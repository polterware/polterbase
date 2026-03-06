import { existsSync } from "node:fs";
import { join } from "node:path";
import { readdirSync } from "node:fs";

export function findPulumiConfig(cwd: string): string | undefined {
  // Look for Pulumi.yaml or Pulumi.<stack>.yaml
  try {
    const files = readdirSync(cwd);
    const config = files.find(
      (f) => f === "Pulumi.yaml" || (f.startsWith("Pulumi.") && f.endsWith(".yaml")),
    );
    return config ? join(cwd, config) : undefined;
  } catch {
    return undefined;
  }
}

export function findPulumiEntrypoint(cwd: string): string | undefined {
  const candidates = [
    "index.ts",
    "index.js",
    "__main__.py",
    "main.go",
    "Program.cs",
  ];

  for (const candidate of candidates) {
    const full = join(cwd, candidate);
    if (existsSync(full)) return full;
  }
  return undefined;
}
