import React, { useState } from "react";
import { Box, Text } from "ink";
import { TextPrompt } from "../components/TextPrompt.js";
import { SelectList } from "../components/SelectList.js";
import { StatusBar } from "../components/StatusBar.js";
import { inkColors } from "../theme.js";
import type { NavigationParams, Screen } from "../hooks/useNavigation.js";
import type { CliToolId } from "../data/types.js";

interface CustomCommandProps {
  onNavigate: (screen: Screen, params?: NavigationParams) => void;
  onBack: () => void;
  width?: number;
  panelMode?: boolean;
  isInputActive?: boolean;
}

type Phase = "tool-select" | "input";

export function CustomCommand({
  onNavigate,
  onBack,
  width = 80,
  panelMode = false,
  isInputActive = true,
}: CustomCommandProps): React.ReactElement {
  const [phase, setPhase] = useState<Phase>("tool-select");
  const [selectedTool, setSelectedTool] = useState<CliToolId>("supabase");

  if (phase === "tool-select") {
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold color={inkColors.accent}>
            ✏️ Custom Command
          </Text>
        </Box>
        <Text dimColor>Select tool:</Text>

        <SelectList
          items={[
            { value: "supabase", label: "Supabase CLI", hint: "supabase ..." },
            { value: "gh", label: "GitHub CLI", hint: "gh ..." },
            { value: "vercel", label: "Vercel CLI", hint: "vercel ..." },
            { value: "__back__", label: "← Back" },
          ]}
          onSelect={(value) => {
            if (value === "__back__") {
              onBack();
              return;
            }
            setSelectedTool(value as CliToolId);
            setPhase("input");
          }}
          onCancel={onBack}
          width={width}
          isInputActive={isInputActive}
          arrowNavigation={panelMode}
        />

        {!panelMode && <StatusBar hint="↑↓ navigate · Enter select · Esc back" width={width} />}
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Box marginBottom={1} gap={1}>
        <Text bold color={inkColors.accent}>
          ✏️ Custom Command
        </Text>
        <Text dimColor>({selectedTool})</Text>
      </Box>

      <TextPrompt
        label={`Enter your ${selectedTool} command/flags:`}
        placeholder={`e.g. ${selectedTool === "supabase" ? "-v, status -o json, db pull" : selectedTool === "gh" ? "pr list, issue create" : "deploy, env ls"}`}
        validate={(val) => {
          if (!val || !val.trim()) return "Please enter a command";
          return undefined;
        }}
        onSubmit={(value) => {
          const args = value.split(" ").filter(Boolean);
          onNavigate("flag-selection", { args, tool: selectedTool });
        }}
        onCancel={() => setPhase("tool-select")}
      />

      {!panelMode && <StatusBar hint="Type a command · Enter to continue · Esc to go back" width={width} />}
    </Box>
  );
}
