// Shared transcript writer for the command scripts in `scripts/`.
//
// Every logged run writes `<type>-<timestamp>.log` under `logs/` so consecutive
// runs never overwrite each other, while the run's output is still streamed
// live to the console. The on-disk copy is stripped of ANSI escape sequences so
// the transcript stays readable in any editor.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Repository root (this file lives in `<root>/scripts/lib`). */
export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

/** Directory that holds the timestamped transcripts. */
export const LOG_DIR = path.join(ROOT, "logs");

// CSI and OSC escape sequences, used to keep the transcript colour-free.
const ANSI = /\u001B(?:\[[0-9;?]*[ -/]*[@-~]|\][^\u0007]*(?:\u0007|\u001B\\))/g;

/** Local, filesystem-safe timestamp: `2026-10-14_15-20-26`. */
export function timestamp(date = new Date()) {
  const pad = (value) => String(value).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `_${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`
  );
}

/** Remove ANSI escape sequences from a string. */
export function stripAnsi(text) {
  return String(text).replace(ANSI, "");
}

/** Default maximum number of `.log` files kept in `logs/`. */
export const DEFAULT_MAX_LOG_FILES = 25;

/**
 * Remove oldest `.log` files in `LOG_DIR` when the count exceeds `maxFiles`.
 *
 * `README.md` and any non-`.log` files are strictly preserved.
 *
 * @param {number} [maxFiles] Maximum log files to retain (default: 25, or `MAX_LOG_FILES` env).
 * @returns {number} Number of deleted stale log files.
 */
export function cleanupLogs(maxFiles = Number(process.env.MAX_LOG_FILES) || DEFAULT_MAX_LOG_FILES) {
  if (!fs.existsSync(LOG_DIR)) return 0;

  try {
    const entries = fs
      .readdirSync(LOG_DIR, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith(".log"))
      .map((entry) => {
        const fullPath = path.join(LOG_DIR, entry.name);
        try {
          const stats = fs.statSync(fullPath);
          return { name: entry.name, path: fullPath, mtimeMs: stats.mtimeMs };
        } catch {
          return null;
        }
      })
      .filter((entry) => entry !== null);

    if (entries.length <= maxFiles) return 0;

    entries.sort((a, b) => a.mtimeMs - b.mtimeMs);
    const toDelete = entries.slice(0, entries.length - maxFiles);
    for (const file of toDelete) {
      try {
        fs.unlinkSync(file.path);
      } catch {
        // Ignored
      }
    }
    return toDelete.length;
  } catch {
    return 0;
  }
}

/**
 * Open a new transcript for a run.
 *
 * @param {string} type short identifier, e.g. `tauri-dev`, `test-rust`
 */
export function createLogger(type) {
  cleanupLogs();
  fs.mkdirSync(LOG_DIR, { recursive: true });

  const safeType = type.replace(/[^a-z0-9_-]/gi, "-");
  const fileName = `${safeType}-${timestamp()}.log`;
  const filePath = path.join(LOG_DIR, fileName);
  const stream = fs.createWriteStream(filePath, { flags: "a", encoding: "utf8" });
  const startedAt = Date.now();

  const writeLine = (line) => {
    stream.write(`${line}\n`);
  };

  return {
    path: filePath,
    relative: path.relative(ROOT, filePath),

    header({ command, args = [], cwd = ROOT }) {
      writeLine(`=== ${type} started at ${new Date().toISOString()} ===`);
      writeLine(`cwd:     ${cwd}`);
      writeLine(`command: ${command} ${args.join(" ")}`.trimEnd());
      writeLine(`node:    ${process.version} (${process.platform} ${process.arch})`);
      writeLine("=".repeat(60));
    },

    chunk(data, isError = false) {
      const text = typeof data === "string" ? data : data.toString("utf8");
      (isError ? process.stderr : process.stdout).write(text);
      stream.write(stripAnsi(text));
    },

    info(message) {
      const line = `[info] ${message}`;
      console.log(line);
      writeLine(line);
    },

    warn(message) {
      const line = `[warn] ${message}`;
      console.warn(line);
      writeLine(line);
    },

    error(message) {
      const line = `[error] ${message}`;
      console.error(line);
      writeLine(line);
    },

    async footer({ code, signal, error, timedOut }) {
      const durationSeconds = ((Date.now() - startedAt) / 1000).toFixed(1);
      writeLine("=".repeat(60));
      if (timedOut) {
        writeLine(`=== TIMED OUT after ${durationSeconds}s ===`);
      } else if (error) {
        writeLine(`=== FAILED (${error.message}) after ${durationSeconds}s ===`);
      } else if (signal) {
        writeLine(`=== TERMINATED by signal ${signal} after ${durationSeconds}s ===`);
      } else {
        writeLine(`=== EXITED with code ${code} after ${durationSeconds}s ===`);
      }
      return new Promise((resolve) => stream.end(resolve));
    }
  };
}
