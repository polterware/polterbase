#!/usr/bin/env node
import React from "react";
import { render } from "ink";
import { App } from "./app.js";
import { parseCliArgs, printCliHelp } from "./lib/cliArgs.js";
import { runAppCli } from "./apps/runAppCli.js";

async function main() {
  const parsed = parseCliArgs(process.argv.slice(2));

  if (parsed.mode === "help") {
    printCliHelp();
    return;
  }

  if (parsed.mode === "app") {
    const exitCode = await runAppCli(parsed.options);
    process.exit(exitCode);
  }

  render(React.createElement(App));
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
