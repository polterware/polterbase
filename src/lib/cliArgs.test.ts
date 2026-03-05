import { describe, expect, it } from "vitest";
import { parseCliArgs } from "./cliArgs.js";

describe("parseCliArgs", () => {
  it("parses app setup options", () => {
    expect(
      parseCliArgs([
        "app",
        "setup",
        "uru",
        "--path",
        "/tmp/uru",
        "--yes",
        "--create-project",
      ]),
    ).toEqual({
      mode: "app",
      options: {
        action: "setup",
        app: "uru",
        path: "/tmp/uru",
        yes: true,
        createProject: true,
      },
    });
  });

  it("parses app migrate subcommands", () => {
    expect(
      parseCliArgs([
        "app",
        "migrate",
        "uru",
        "reset",
        "--relink",
      ]),
    ).toEqual({
      mode: "app",
      options: {
        action: "migrate",
        app: "uru",
        migrationAction: "reset",
        relink: true,
      },
    });
  });
});
