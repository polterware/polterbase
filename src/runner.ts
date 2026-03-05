import * as p from "@clack/prompts";
import pc from "picocolors";
import { spawn, exec } from "node:child_process";

export interface RunResult {
  exitCode: number | null;
  signal: NodeJS.Signals | null;
  spawnError?: string;
}

export async function runSupabaseCommand(args: string[]): Promise<RunResult> {
  const cmdDisplay = `supabase ${args.join(" ")}`;

  console.log("");
  console.log(pc.dim("─".repeat(50)));
  console.log(
    pc.bold(pc.cyan("▶ ")) + pc.dim("Running: ") + pc.white(cmdDisplay),
  );
  console.log(pc.dim("─".repeat(50)));
  console.log("");

  return new Promise<RunResult>((resolve) => {
    const child = spawn("supabase", args, {
      stdio: "inherit",
      shell: true,
    });

    child.on("error", (err: Error) => {
      resolve({ exitCode: null, signal: null, spawnError: err.message });
    });

    child.on("exit", (code: number | null, signal: NodeJS.Signals | null) => {
      resolve({ exitCode: code, signal });
    });
  });
}

export async function handleCommandResult(
  result: RunResult,
  args: string[],
): Promise<"success" | "retry" | "retry-debug" | "menu" | "exit"> {
  const cmdDisplay = `supabase ${args.join(" ")}`;

  console.log("");

  // Spawn error — supabase not found
  if (result.spawnError) {
    p.log.error(pc.red(pc.bold("Failed to start command")));
    console.log("");
    console.log(pc.dim("  Error: ") + pc.red(result.spawnError));
    console.log("");

    if (
      result.spawnError.includes("ENOENT") ||
      result.spawnError.includes("not found")
    ) {
      console.log(pc.yellow(pc.bold("  💡 Supabase CLI not found in PATH")));
      console.log(
        pc.dim("  Install it: ") +
          pc.cyan("https://supabase.com/docs/guides/cli"),
      );
      console.log(pc.dim("  Then run: ") + pc.white("supabase --version"));
      console.log("");
    }

    return handleErrorMenu(args, true);
  }

  // Success
  if (result.exitCode === 0) {
    console.log(pc.dim("─".repeat(50)));
    p.log.success(pc.green(pc.bold("Command completed successfully!")));
    return "success";
  }

  // Non-zero exit code
  console.log(pc.dim("─".repeat(50)));
  p.log.error(
    pc.red(`Command failed `) +
      pc.dim("(exit code ") +
      pc.red(pc.bold(String(result.exitCode))) +
      pc.dim(")"),
  );
  console.log("");
  console.log(pc.dim("  Command: ") + pc.white(cmdDisplay));
  console.log("");

  const hasDebug = args.includes("--debug");
  if (!hasDebug) {
    console.log(
      pc.dim("  💡 Tip: retry with ") +
        pc.cyan("--debug") +
        pc.dim(" to see detailed logs"),
    );
    console.log("");
  }

  return handleErrorMenu(args, false);
}

async function handleErrorMenu(
  args: string[],
  isSpawnError: boolean,
): Promise<"retry" | "retry-debug" | "menu" | "exit"> {
  const hasDebug = args.includes("--debug");

  type ErrorAction =
    | "retry"
    | "retry-debug"
    | "docs"
    | "copy"
    | "menu"
    | "exit";

  const options: { value: ErrorAction; label: string; hint?: string }[] = [];

  if (!isSpawnError) {
    options.push({ value: "retry", label: "🔄 Retry the same command" });
    if (!hasDebug) {
      options.push({
        value: "retry-debug",
        label: "🐛 Retry with --debug",
        hint: "Append --debug for verbose logs",
      });
    }
  }

  options.push(
    {
      value: "docs",
      label: "📖 Open Supabase CLI docs",
      hint: "Opens in browser",
    },
    { value: "copy", label: "📋 Copy command to clipboard" },
    { value: "menu", label: "← Return to main menu" },
    { value: "exit", label: "🚪 Exit Polterbase" },
  );

  const action = await p.select({
    message: "What would you like to do?",
    options,
  });

  if (p.isCancel(action)) return "menu";

  switch (action) {
    case "docs":
      await openInBrowser("https://supabase.com/docs/guides/cli");
      p.log.info("Opened docs in browser");
      return handleErrorMenu(args, isSpawnError);

    case "copy":
      await copyToClipboard(`supabase ${args.join(" ")}`);
      p.log.info("Command copied to clipboard");
      return handleErrorMenu(args, isSpawnError);

    default:
      return action as "retry" | "retry-debug" | "menu" | "exit";
  }
}

async function openInBrowser(url: string): Promise<void> {
  return new Promise((resolve) => {
    const cmd =
      process.platform === "darwin"
        ? `open "${url}"`
        : process.platform === "win32"
          ? `start "${url}"`
          : `xdg-open "${url}"`;

    exec(cmd, () => resolve());
  });
}

async function copyToClipboard(text: string): Promise<void> {
  return new Promise((resolve) => {
    const cmd =
      process.platform === "darwin"
        ? "pbcopy"
        : process.platform === "win32"
          ? "clip"
          : "xclip -selection clipboard";

    const child = spawn(cmd, [], { shell: true });
    child.stdin?.write(text);
    child.stdin?.end();
    child.on("exit", () => resolve());
    child.on("error", () => resolve());
  });
}
