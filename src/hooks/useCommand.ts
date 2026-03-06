import { useState, useCallback } from "react";
import {
  runCommand,
  type CommandExecution,
  type RunResult,
} from "../lib/runner.js";
import { resolveToolCommand } from "../lib/toolResolver.js";
import type { CliToolId } from "../data/types.js";

export type CommandStatus = "idle" | "running" | "success" | "error";

export function useCommand(
  execution: string | CliToolId | CommandExecution = "supabase",
  cwd: string = process.cwd(),
) {
  const [status, setStatus] = useState<CommandStatus>("idle");
  const [result, setResult] = useState<RunResult | null>(null);

  const run = useCallback(async (args: string[]) => {
    setStatus("running");
    setResult(null);

    let resolvedExecution: string | CommandExecution;

    if (typeof execution === "string") {
      const toolIds: string[] = ["supabase", "gh", "vercel"];
      if (toolIds.includes(execution)) {
        const resolved = resolveToolCommand(execution as CliToolId, cwd);
        resolvedExecution = { command: resolved.command, env: resolved.env };
      } else {
        resolvedExecution = execution;
      }
    } else {
      resolvedExecution = execution;
    }

    const res = await runCommand(resolvedExecution, args, cwd);
    setResult(res);

    if (res.spawnError || (res.exitCode !== null && res.exitCode !== 0)) {
      setStatus("error");
    } else {
      setStatus("success");
    }

    return res;
  }, [cwd, execution]);

  const reset = useCallback(() => {
    setStatus("idle");
    setResult(null);
  }, []);

  return { status, result, run, reset };
}
