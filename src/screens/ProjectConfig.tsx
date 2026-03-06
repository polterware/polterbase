import React, { useMemo, useState } from "react";
import { Box, Text } from "ink";
import { SelectList } from "../components/SelectList.js";
import { TextPrompt } from "../components/TextPrompt.js";
import { StatusBar } from "../components/StatusBar.js";
import { inkColors } from "../theme.js";
import {
  getOrCreateProjectConfig,
  writeProjectConfig,
  getProjectConfigPath,
} from "../config/projectConfig.js";
import { useEditor } from "../hooks/useEditor.js";

interface ProjectConfigProps {
  onBack: () => void;
  width?: number;
  panelMode?: boolean;
  isInputActive?: boolean;
}

type Phase = "overview" | "edit-supabase-ref" | "edit-vercel-id" | "edit-gh-repo";

export function ProjectConfig({
  onBack,
  width = 80,
  panelMode = false,
  isInputActive = true,
}: ProjectConfigProps): React.ReactElement {
  const configPath = useMemo(() => getProjectConfigPath(), []);
  const [config, setConfig] = useState(() => getOrCreateProjectConfig());
  const [phase, setPhase] = useState<Phase>("overview");
  const [feedback, setFeedback] = useState<string>();
  const { openEditor, isEditing } = useEditor();

  if (!configPath) {
    return (
      <Box flexDirection="column">
        <Text color="red">
          No package.json found. Run from a project directory.
        </Text>
        <SelectList
          items={[{ value: "__back__", label: "← Back" }]}
          onSelect={onBack}
          onCancel={onBack}
          width={width}
          isInputActive={isInputActive}
          arrowNavigation={panelMode}
        />
      </Box>
    );
  }

  if (phase === "edit-supabase-ref") {
    return (
      <Box flexDirection="column">
        <TextPrompt
          label="Supabase project ref:"
          placeholder="e.g. abcdefghijklmnop"
          onSubmit={(val) => {
            const updated = {
              ...config,
              tools: {
                ...config.tools,
                supabase: { ...config.tools.supabase, projectRef: val.trim() || undefined },
              },
            };
            writeProjectConfig(updated);
            setConfig(updated);
            setFeedback("Supabase project ref updated");
            setPhase("overview");
          }}
          onCancel={() => setPhase("overview")}
        />
      </Box>
    );
  }

  if (phase === "edit-vercel-id") {
    return (
      <Box flexDirection="column">
        <TextPrompt
          label="Vercel project ID:"
          placeholder="e.g. prj_xxxx"
          onSubmit={(val) => {
            const updated = {
              ...config,
              tools: {
                ...config.tools,
                vercel: { ...config.tools.vercel, projectId: val.trim() || undefined },
              },
            };
            writeProjectConfig(updated);
            setConfig(updated);
            setFeedback("Vercel project ID updated");
            setPhase("overview");
          }}
          onCancel={() => setPhase("overview")}
        />
      </Box>
    );
  }

  if (phase === "edit-gh-repo") {
    return (
      <Box flexDirection="column">
        <TextPrompt
          label="GitHub repo (owner/name):"
          placeholder="e.g. myorg/my-app"
          onSubmit={(val) => {
            const updated = {
              ...config,
              tools: {
                ...config.tools,
                gh: { ...config.tools.gh, repo: val.trim() || undefined },
              },
            };
            writeProjectConfig(updated);
            setConfig(updated);
            setFeedback("GitHub repo updated");
            setPhase("overview");
          }}
          onCancel={() => setPhase("overview")}
        />
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold color={inkColors.accent}>
          ⚙️ Project Config
        </Text>
      </Box>

      <Box marginBottom={1} marginLeft={2} flexDirection="column">
        <Text dimColor>Path: {configPath.file}</Text>
        <Text>
          Supabase ref: {config.tools.supabase?.projectRef ?? <Text dimColor>not set</Text>}
        </Text>
        <Text>
          Vercel ID: {config.tools.vercel?.projectId ?? <Text dimColor>not set</Text>}
        </Text>
        <Text>
          GitHub repo: {config.tools.gh?.repo ?? <Text dimColor>not set</Text>}
        </Text>
      </Box>

      {feedback && (
        <Box marginBottom={1}>
          <Text color={inkColors.accent}>✓ {feedback}</Text>
        </Box>
      )}

      <SelectList
        items={[
          { value: "supabase", label: "Set Supabase project ref" },
          { value: "vercel", label: "Set Vercel project ID" },
          { value: "gh", label: "Set GitHub repo" },
          { value: "editor", label: "Open config in editor" },
          { value: "__back__", label: "← Back" },
        ]}
        onSelect={(value) => {
          switch (value) {
            case "supabase":
              setPhase("edit-supabase-ref");
              break;
            case "vercel":
              setPhase("edit-vercel-id");
              break;
            case "gh":
              setPhase("edit-gh-repo");
              break;
            case "editor":
              openEditor(configPath!.file).then(() => {
                try {
                  const reloaded = getOrCreateProjectConfig();
                  setConfig(reloaded);
                  setFeedback("Config reloaded from file");
                } catch {
                  setFeedback("Warning: could not parse config after editing");
                }
              });
              break;
            default:
              onBack();
          }
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
