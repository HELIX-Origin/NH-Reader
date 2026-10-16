#!/usr/bin/env node
// Deterministic, agent-friendly test & verification runner for NH-Reader.
//
// Runs the project's suites directly (no shell, no nested `npm`), with stdin
// closed so no step can block waiting for input, a per-step timeout so a wedged
// tool is killed instead of hanging the session, live streaming plus a
// timestamped transcript in `logs/`, and a compact PASS/FAIL summary with a
// reliable exit code. Prefer this over invoking the tools by hand.
//
// Usage:
//   node scripts/test.mjs [suite ...] [--timeout <seconds>] [--list] [-- <cargo args>]
//
// Suites: fmt, clippy, check, rust, frontend, build, i18n, all
// Default: check, rust, frontend, i18n (see lib/suites.mjs)

import { ALL_SUITES, DEFAULT_SUITES, SUITES, runSuites } from "./lib/suites.mjs";

const argv = process.argv.slice(2);
const names = [];
let timeoutSeconds = 900;
let list = false;
let extraArgs = [];

for (let i = 0; i < argv.length; i += 1) {
  const arg = argv[i];
  if (arg === "--") {
    extraArgs = argv.slice(i + 1);
    break;
  }
  if (arg === "--list" || arg === "-l") {
    list = true;
    continue;
  }
  if (arg === "--timeout" || arg === "-t") {
    const value = Number(argv[i + 1]);
    if (!Number.isFinite(value) || value <= 0) {
      console.error("--timeout expects a number of seconds greater than 0");
      process.exit(2);
    }
    timeoutSeconds = value;
    i += 1;
    continue;
  }
  if (arg.startsWith("--")) {
    console.error(`unknown option: ${arg}`);
    process.exit(2);
  }
  names.push(arg);
}

if (list) {
  console.log("Available suites:");
  for (const [key, suite] of Object.entries(SUITES)) {
    console.log(`  ${key.padEnd(9)} ${suite.title}`);
  }
  console.log(`\nDefault: ${DEFAULT_SUITES.join(", ")}`);
  console.log(`All:     ${ALL_SUITES.join(", ")}`);
  process.exit(0);
}

const requested = names.length === 0 ? DEFAULT_SUITES : names;
const expanded = [];
for (const name of requested) {
  if (name === "all") {
    for (const key of ALL_SUITES) {
      if (!expanded.includes(key)) expanded.push(key);
    }
  } else if (!expanded.includes(name)) {
    expanded.push(name);
  }
}

const timeoutMs = timeoutSeconds * 1000;
const { ok, results } = await runSuites(expanded, { timeoutMs, extraArgs });

console.log("\n=== Verification Summary ===");
for (const r of results) {
  const status = r.pass ? "PASS" : `FAIL (${r.code})`;
  console.log(`  [${status.padEnd(9)}] ${r.suite.padEnd(9)} ${r.step}`);
}

process.exitCode = ok ? 0 : 1;
