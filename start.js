import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to spawn process and pipe stdout/stderr
function runProcess(command, args, name, colorCode) {
  const isWin = process.platform === "win32";
  const cmd = isWin ? "cmd.exe" : command;
  const cmdArgs = isWin ? ["/c", command, ...args] : args;

  const child = spawn(cmd, cmdArgs, {
    cwd: __dirname,
    stdio: "pipe",
    env: { ...process.env, FORCE_COLOR: "true" }
  });

  child.stdout.on("data", (data) => {
    const lines = data.toString().trim().split("\n");
    lines.forEach((line) => {
      console.log(`\x1b[${colorCode}m[${name}]\x1b[0m ${line}`);
    });
  });

  child.stderr.on("data", (data) => {
    const lines = data.toString().trim().split("\n");
    lines.forEach((line) => {
      console.error(`\x1b[31m[${name} ERROR]\x1b[0m ${line}`);
    });
  });

  child.on("close", (code) => {
    console.log(`[${name}] process exited with code ${code}`);
    process.exit(code || 0);
  });

  return child;
}

console.log("Starting ClientFlow CRM services...");

// Start Backend on Port 5000 (Color: Blue/Cyan 36)
const serverProcess = runProcess("npm", ["run", "server"], "BACKEND", "36");

// Start Frontend Vite Dev Server (Color: Magenta 35)
const clientProcess = runProcess("npm", ["run", "dev"], "FRONTEND", "35");

// Handle process termination cleanly
process.on("SIGINT", () => {
  console.log("\nStopping processes...");
  serverProcess.kill();
  clientProcess.kill();
  process.exit(0);
});
