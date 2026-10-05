// PostToolUse hook: run Prettier on the file Claude just wrote/edited.
// Never blocks the tool call — formatting failures are reported, not fatal.
import { spawnSync } from "node:child_process";
import path from "node:path";

let input = "";
for await (const chunk of process.stdin) input += chunk;

const filePath = JSON.parse(input || "{}").tool_input?.file_path;
const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
if (!filePath) process.exit(0);

const rel = path.relative(projectDir, path.resolve(filePath));
if (rel.startsWith("..") || path.isAbsolute(rel)) process.exit(0);

const prettier = path.join(projectDir, "node_modules", "prettier", "bin", "prettier.cjs");
const result = spawnSync(
  process.execPath,
  [prettier, "--write", "--ignore-unknown", "--log-level", "warn", rel],
  { cwd: projectDir, encoding: "utf8" },
);

if (result.status !== 0) {
  process.stderr.write(`prettier failed on ${rel}:\n${result.stderr || result.stdout}`);
}
process.exit(0);
