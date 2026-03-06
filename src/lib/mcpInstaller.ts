import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import pc from "picocolors";
import { commandExists } from "./system.js";
import type { McpScope } from "./cliArgs.js";

const MCP_ARGS = ["npx", "-y", "-p", "@polterware/polter", "polter-mcp"];

const SCOPE_LABELS: Record<McpScope, string> = {
  local: "local (this machine)",
  project: "project (shared via repo)",
  user: "global (all projects)",
};

function tryClaudeCli(scope: McpScope): boolean {
  if (!commandExists("claude")) return false;

  const result = spawnSync("claude", ["mcp", "add", "-s", scope, "polter", "--", ...MCP_ARGS], {
    stdio: "inherit",
    shell: true,
  });

  return result.status === 0;
}

function getSettingsPath(scope: McpScope): string {
  if (scope === "project") {
    return join(process.cwd(), ".mcp.json");
  }
  return join(homedir(), ".claude", "settings.json");
}

function tryManualInstall(scope: McpScope): boolean {
  const settingsPath = getSettingsPath(scope);
  const dir = join(settingsPath, "..");

  let settings: Record<string, unknown> = {};
  if (existsSync(settingsPath)) {
    try {
      settings = JSON.parse(readFileSync(settingsPath, "utf-8"));
    } catch {
      process.stderr.write(pc.red(`Failed to parse ${settingsPath}\n`));
      return false;
    }
  } else {
    mkdirSync(dir, { recursive: true });
  }

  const mcpServers = (settings.mcpServers ?? {}) as Record<string, unknown>;
  mcpServers.polter = {
    command: "npx",
    args: ["-y", "-p", "@polterware/polter", "polter-mcp"],
  };
  settings.mcpServers = mcpServers;

  writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + "\n");
  return true;
}

export async function installMcpServer(scope: McpScope): Promise<void> {
  process.stdout.write(pc.bold(`Installing Polter MCP server — ${SCOPE_LABELS[scope]}\n\n`));

  // Try claude CLI first
  if (commandExists("claude")) {
    process.stdout.write(`  Using 'claude mcp add -s ${scope}'...\n`);
    if (tryClaudeCli(scope)) {
      process.stdout.write(pc.green("\n  Done! Restart Claude Code to use Polter tools.\n"));
      return;
    }
    process.stdout.write(pc.yellow("  'claude mcp add' failed, falling back to manual install...\n\n"));
  }

  // Fallback: write settings file directly
  const settingsPath = getSettingsPath(scope);
  process.stdout.write(`  Writing to ${settingsPath}...\n`);
  if (tryManualInstall(scope)) {
    process.stdout.write(pc.green("\n  Done! Restart Claude Code to use Polter tools.\n"));
  } else {
    process.stderr.write(pc.red("\n  Failed to install. Add manually:\n\n"));
    process.stderr.write(`  ${pc.dim(JSON.stringify({ mcpServers: { polter: { command: "npx", args: ["-y", "-p", "@polterware/polter", "polter-mcp"] } } }, null, 2))}\n`);
    process.exit(1);
  }
}
