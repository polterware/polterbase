import { useMemo } from "react";
import { features } from "../data/features.js";

export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  type: "feature" | "action" | "separator";
}

export function useSidebarItems(hasPins = false): SidebarItem[] {
  return useMemo(() => {
    const items: SidebarItem[] = [];

    if (hasPins) {
      items.push({ id: "pinned", label: "Pinned", icon: "📌", type: "action" });
      items.push({ id: "__sep_pinned__", label: "---", icon: "", type: "separator" });
    }

    for (const feature of features) {
      items.push({
        id: feature.id,
        label: feature.label,
        icon: feature.icon,
        type: "feature",
      });
    }

    items.push({ id: "__sep__", label: "---", icon: "", type: "separator" });

    items.push({ id: "custom-command", label: "Custom Cmd", icon: "✏️", type: "action" });
    items.push({ id: "pipelines", label: "Pipelines", icon: "🔗", type: "action" });
    items.push({ id: "tool-status", label: "Tool Status", icon: "🔧", type: "action" });
    items.push({ id: "config", label: "Config", icon: "⚙️", type: "action" });
    items.push({ id: "self-update", label: "Update", icon: "⬆️", type: "action" });
    items.push({ id: "exit", label: "Exit", icon: "🚪", type: "action" });

    return items;
  }, [hasPins]);
}
