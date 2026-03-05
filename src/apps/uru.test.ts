import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { uruProfile } from "./uru.js";

const tempDirs: string[] = [];

function createUruFixture(): string {
  const root = mkdtempSync(join(tmpdir(), "polterbase-uru-test-"));
  tempDirs.push(root);

  mkdirSync(join(root, "src-tauri"), { recursive: true });
  mkdirSync(join(root, "supabase", "migrations"), { recursive: true });
  writeFileSync(join(root, "src-tauri", "tauri.conf.json"), "{}\n");
  writeFileSync(join(root, "package.json"), '{ "name": "uru-desktop" }\n');

  return root;
}

describe("uruProfile", () => {
  afterEach(() => {
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir) {
        rmSync(dir, { recursive: true, force: true });
      }
    }
  });

  it("detects the project root directly", () => {
    const root = createUruFixture();
    expect(uruProfile.detect(root)).toBe(root);
  });

  it("resolves a sibling uru folder from a parent directory", () => {
    const marketRoot = mkdtempSync(join(tmpdir(), "polterbase-market-test-"));
    tempDirs.push(marketRoot);

    const uruRoot = join(marketRoot, "uru");
    mkdirSync(join(uruRoot, "src-tauri"), { recursive: true });
    mkdirSync(join(uruRoot, "supabase", "migrations"), { recursive: true });
    writeFileSync(join(uruRoot, "src-tauri", "tauri.conf.json"), "{}\n");
    writeFileSync(join(uruRoot, "package.json"), '{ "name": "uru-desktop" }\n');

    expect(uruProfile.resolveProjectRoot(marketRoot)).toBe(uruRoot);
  });
});
