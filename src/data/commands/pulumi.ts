import type { CommandDef } from "../types.js";

export const pulumiCommands: CommandDef[] = [
  // Stack Management
  { id: "pulumi:stack:ls",     tool: "pulumi", base: ["stack", "ls"],     label: "stack ls",     hint: "List stacks" },
  { id: "pulumi:stack:select", tool: "pulumi", base: ["stack", "select"], label: "stack select", hint: "Switch to a stack" },
  { id: "pulumi:stack:init",   tool: "pulumi", base: ["stack", "init"],   label: "stack init",   hint: "Create a new stack" },
  { id: "pulumi:stack:rm",     tool: "pulumi", base: ["stack", "rm"],     label: "stack rm",     hint: "Remove a stack" },
  { id: "pulumi:stack:output", tool: "pulumi", base: ["stack", "output"], label: "stack output", hint: "Show stack outputs" },

  // Core Operations
  { id: "pulumi:up",      tool: "pulumi", base: ["up"],      label: "up",      hint: "Deploy infrastructure changes" },
  { id: "pulumi:preview", tool: "pulumi", base: ["preview"], label: "preview", hint: "Preview changes before deploying" },
  { id: "pulumi:destroy", tool: "pulumi", base: ["destroy"], label: "destroy", hint: "Tear down all resources" },
  { id: "pulumi:refresh", tool: "pulumi", base: ["refresh"], label: "refresh", hint: "Refresh state from cloud provider" },

  // Config
  { id: "pulumi:config:set", tool: "pulumi", base: ["config", "set"], label: "config set", hint: "Set a config value" },
  { id: "pulumi:config:get", tool: "pulumi", base: ["config", "get"], label: "config get", hint: "Get a config value" },
  { id: "pulumi:config:ls",  tool: "pulumi", base: ["config"],        label: "config",    hint: "List config key-value pairs" },

  // Import & State
  { id: "pulumi:import",       tool: "pulumi", base: ["import"],          label: "import",       hint: "Import existing resources" },
  { id: "pulumi:state:delete", tool: "pulumi", base: ["state", "delete"], label: "state delete", hint: "Remove resource from state" },

  // Auth & Setup
  { id: "pulumi:login",  tool: "pulumi", base: ["login"],  label: "login",  hint: "Log in to Pulumi Cloud" },
  { id: "pulumi:whoami", tool: "pulumi", base: ["whoami"], label: "whoami", hint: "Show current user" },
  { id: "pulumi:new",    tool: "pulumi", base: ["new"],    label: "new",    hint: "Create a new project from template" },

  // Editor-backed commands
  { id: "pulumi:edit:config", tool: "pulumi", base: ["__editor__"], label: "edit config", hint: "Open Pulumi.yaml in editor", editorTarget: "config" },
  { id: "pulumi:edit:code",   tool: "pulumi", base: ["__editor__"], label: "edit code",   hint: "Open IaC source file in editor", editorTarget: "code" },
];
