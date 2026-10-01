use rusqlite::{params, Connection};
use std::path::Path;
use std::sync::Mutex;

pub struct Db {
    conn: Mutex<Connection>,
    path: std::path::PathBuf,
}

impl Db {
    pub fn new(path: &Path) -> Result<Self, Box<dyn std::error::Error>> {
        if let Some(parent) = path.parent() {
            let _ = std::fs::create_dir_all(parent);
            if !path.exists() {
                let legacy_candidates = [
                    parent.join("nh-desktop.db"),
                    parent.join("nh-reader.db"),
                ];
                for legacy in &legacy_candidates {
                    if legacy.exists() {
                        let _ = std::fs::copy(legacy, path);
                        let wal = legacy.with_extension("db-wal");
                        if wal.exists() {
                            let _ = std::fs::copy(&wal, path.with_extension("sqlite-wal"));
                        }
                        let shm = legacy.with_extension("db-shm");
                        if shm.exists() {
                            let _ = std::fs::copy(&shm, path.with_extension("sqlite-shm"));
                        }
                        break;
                    }
                }
            }
        }
        let conn = Connection::open(path)?;
        conn.execute_batch(
            "CREATE TABLE IF NOT EXISTS kv (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                updated_at INTEGER NOT NULL
            );
            CREATE TABLE IF NOT EXISTS api_key (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                key TEXT NOT NULL
            );
            UPDATE kv SET key = 'nh-reader:' || substr(key, 12) WHERE key LIKE 'nh-desktop:%';",
        )?;
        Ok(Self {
            conn: Mutex::new(conn),
            path: path.to_path_buf(),
        })
    }
    fn lock_conn(&self) -> std::sync::MutexGuard<'_, Connection> {
        self.conn.lock().unwrap_or_else(|poisoned| poisoned.into_inner())
    }

    pub fn get(&self, key: &str) -> Result<Option<String>, rusqlite::Error> {
        let conn = self.lock_conn();
        let mut stmt = conn.prepare("SELECT value FROM kv WHERE key = ?1")?;
        let mut rows = stmt.query(params![key])?;
        match rows.next()? {
            Some(row) => row.get(0).map(Some),
            None => Ok(None),
        }
    }

    pub fn set(&self, key: &str, value: &str) -> Result<(), rusqlite::Error> {
        let conn = self.lock_conn();
        conn.execute(
            "INSERT INTO kv (key, value, updated_at) VALUES (?1, ?2, strftime('%s','now'))
             ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at",
            params![key, value],
        )?;
        Ok(())
    }

    pub fn del(&self, key: &str) -> Result<(), rusqlite::Error> {
        let conn = self.lock_conn();
        conn.execute("DELETE FROM kv WHERE key = ?1", params![key])?;
        Ok(())
    }

    pub fn dump(&self) -> Result<Vec<(String, String)>, rusqlite::Error> {
        let conn = self.lock_conn();
        let mut stmt = conn.prepare("SELECT key, value FROM kv")?;
        let rows = stmt.query_map([], |row| Ok((row.get(0)?, row.get(1)?)))?;
        let mut out = Vec::new();
        for row in rows {
            out.push(row?);
        }
        Ok(out)
    }

    pub fn clear(&self) -> Result<(), rusqlite::Error> {
        let conn = self.lock_conn();
        conn.execute("DELETE FROM kv", [])?;
        Ok(())
    }

    pub fn set_api_key(&self, key: &str) -> Result<(), rusqlite::Error> {
        let conn = self.lock_conn();
        conn.execute(
            "INSERT INTO api_key (id, key) VALUES (1, ?1)
             ON CONFLICT(id) DO UPDATE SET key = excluded.key",
            params![key],
        )?;
        Ok(())
    }

    pub fn api_key(&self) -> Result<Option<String>, rusqlite::Error> {
        let conn = self.lock_conn();
        let mut stmt = conn.prepare("SELECT key FROM api_key WHERE id = 1")?;
        let mut rows = stmt.query([])?;
        match rows.next()? {
            Some(row) => row.get(0).map(Some),
            None => Ok(None),
        }
    }

    pub fn prune_cache(&self, before_ts: i64) -> Result<usize, rusqlite::Error> {
        let conn = self.lock_conn();
        let n = conn.execute(
            "DELETE FROM kv WHERE (key LIKE 'nh-reader:cache:%' OR key LIKE 'nh-desktop:cache:%') AND updated_at < ?1",
            params![before_ts],
        )?;
        Ok(n)
    }

    pub fn clear_api_key(&self) -> Result<(), rusqlite::Error> {
        let conn = self.lock_conn();
        conn.execute("DELETE FROM api_key WHERE id = 1", [])?;
        Ok(())
    }

    pub fn file_size_bytes(&self) -> u64 {
        let mut total = std::fs::metadata(&self.path).map(|m| m.len()).unwrap_or(0);
        let wal = self.path.with_extension("sqlite-wal");
        if let Ok(m) = std::fs::metadata(wal) {
            total += m.len();
        }
        let shm = self.path.with_extension("sqlite-shm");
        if let Ok(m) = std::fs::metadata(shm) {
            total += m.len();
        }
        total
    }

    pub fn cache_count(&self) -> Result<usize, rusqlite::Error> {
        let conn = self.lock_conn();
        let mut stmt = conn.prepare(
            "SELECT count(*) FROM kv WHERE key LIKE 'nh-reader:cache:%' OR key LIKE 'nh-desktop:cache:%'",
        )?;
        let mut rows = stmt.query([])?;
        if let Some(row) = rows.next()? {
            let count: i64 = row.get(0)?;
            Ok(count as usize)
        } else {
            Ok(0)
        }
    }

    pub fn clear_cache(&self) -> Result<usize, rusqlite::Error> {
        let conn = self.lock_conn();
        let n = conn.execute(
            "DELETE FROM kv WHERE key LIKE 'nh-reader:cache:%' OR key LIKE 'nh-desktop:cache:%'",
            [],
        )?;
        let _ = conn.execute("VACUUM", []);
        Ok(n)
    }

    pub fn vacuum(&self) -> Result<(), rusqlite::Error> {
        let conn = self.lock_conn();
        conn.execute("VACUUM", [])?;
        Ok(())
    }
}