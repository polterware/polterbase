import React from "react";
import { Text } from "ink";
import type { CliToolId } from "../data/types.js";

const toolColors: Record<CliToolId, string> = {
  supabase: "#3ECF8E",
  gh: "#58A6FF",
  vercel: "#FFFFFF",
  pulumi: "#8B5CF6",
};

const toolLabels: Record<CliToolId, string> = {
  supabase: "supabase",
  gh: "github",
  vercel: "vercel",
  pulumi: "pulumi",
};

interface ToolBadgeProps {
  tool: CliToolId;
}

export function ToolBadge({ tool }: ToolBadgeProps): React.ReactElement {
  return (
    <Text color={toolColors[tool]} dimColor>
      {toolLabels[tool]}
    </Text>
  );
}

export { toolColors, toolLabels };
