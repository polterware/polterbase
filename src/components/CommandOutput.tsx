import React from "react";
import { Text } from "ink";
import { ScrollableBox } from "./ScrollableBox.js";
import { stripAnsi } from "../lib/ansi.js";

interface CommandOutputProps {
  stdout?: string;
  stderr?: string;
  height: number;
  width?: number;
  isActive?: boolean;
}

function cleanLines(raw: string): string[] {
  const stripped = stripAnsi(raw);
  // Remove carriage returns (progress bar artifacts) and split
  return stripped
    .replace(/\r/g, "")
    .split("\n")
    .filter((line) => line.length > 0);
}

export function CommandOutput({
  stdout,
  stderr,
  height,
  isActive = false,
}: CommandOutputProps): React.ReactElement | null {
  const outLines = stdout ? cleanLines(stdout) : [];
  const errLines = stderr ? cleanLines(stderr) : [];

  if (outLines.length === 0 && errLines.length === 0) {
    return null;
  }

  return (
    <ScrollableBox height={Math.max(3, height)} isActive={isActive}>
      {[
        ...outLines.map((line, i) => <Text key={`o-${i}`}>{line}</Text>),
        ...errLines.map((line, i) => (
          <Text key={`e-${i}`} color="red">
            {line}
          </Text>
        )),
      ]}
    </ScrollableBox>
  );
}
