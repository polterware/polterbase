import type { CommandDef, CliToolId } from "../types.js";
import { supabaseCommands } from "./supabase.js";
import { ghCommands } from "./gh.js";
import { vercelCommands } from "./vercel.js";
import { pulumiCommands } from "./pulumi.js";

export const allCommands: CommandDef[] = [
  ...supabaseCommands,
  ...ghCommands,
  ...vercelCommands,
  ...pulumiCommands,
];

const commandById = new Map(allCommands.map((cmd) => [cmd.id, cmd]));

export function getCommandById(id: string): CommandDef | undefined {
  return commandById.get(id);
}

export function getCommandsByTool(tool: CliToolId): CommandDef[] {
  return allCommands.filter((cmd) => cmd.tool === tool);
}

/**
 * Build a legacy-compatible command value from a CommandDef.
 * For supabase commands, the value is the base[0] (e.g. "db", "migration").
 * For other tools, the value is "tool:base" (e.g. "gh:pr create").
 */
export function getCommandValue(cmd: CommandDef): string {
  if (cmd.tool === "supabase") {
    return cmd.base.join(" ");
  }
  return `${cmd.tool}:${cmd.base.join(" ")}`;
}

/**
 * Find a command def by its legacy value (e.g. "db" or "gh:pr create").
 */
export function findCommandByValue(value: string): CommandDef | undefined {
  // Try direct ID match first
  const byId = commandById.get(value);
  if (byId) return byId;

  // Try tool:base format
  if (value.includes(":")) {
    const [tool, ...rest] = value.split(":");
    const basePart = rest.join(":");
    return allCommands.find(
      (cmd) => cmd.tool === tool && cmd.base.join(" ") === basePart,
    );
  }

  // Legacy supabase-only format (just the base command)
  return supabaseCommands.find((cmd) => cmd.base.join(" ") === value);
}
