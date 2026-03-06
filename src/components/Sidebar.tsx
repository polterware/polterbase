import React, { useEffect, useMemo, useState } from "react";
import { Box, Text, useInput } from "ink";
import { inkColors, symbols } from "../theme.js";
import type { SidebarItem } from "../hooks/useSidebarItems.js";

interface SidebarProps {
  items: SidebarItem[];
  selectedId: string;
  isFocused: boolean;
  height: number;
  onSelect: (itemId: string) => void;
  onHighlight?: (itemId: string) => void;
}

export function Sidebar({
  items,
  selectedId,
  isFocused,
  height,
  onSelect,
  onHighlight,
}: SidebarProps): React.ReactElement {
  const selectableItems = useMemo(
    () => items.filter((item) => item.type !== "separator"),
    [items],
  );
  const selectedIdx = selectableItems.findIndex((item) => item.id === selectedId);
  const [cursorIdx, setCursorIdx] = useState(Math.max(0, selectedIdx));

  // Sync cursor when selectedId changes externally
  useEffect(() => {
    const idx = selectableItems.findIndex((item) => item.id === selectedId);
    if (idx >= 0) setCursorIdx(idx);
  }, [selectedId, selectableItems]);

  useInput(
    (input, key) => {
      if (key.upArrow || input === "k") {
        setCursorIdx((prev) => {
          const next = prev > 0 ? prev - 1 : selectableItems.length - 1;
          const item = selectableItems[next];
          if (item && onHighlight) onHighlight(item.id);
          return next;
        });
      }
      if (key.downArrow || input === "j") {
        setCursorIdx((prev) => {
          const next = prev < selectableItems.length - 1 ? prev + 1 : 0;
          const item = selectableItems[next];
          if (item && onHighlight) onHighlight(item.id);
          return next;
        });
      }
      if (key.return || key.rightArrow) {
        const item = selectableItems[cursorIdx];
        if (item) {
          onSelect(item.id);
        }
      }
    },
    { isActive: isFocused },
  );

  let selectableIdx = 0;
  return (
    <Box flexDirection="column" paddingX={1}>
      {items.map((item) => {
        if (item.type === "separator") {
          return (
            <Box key={item.id}>
              <Text dimColor>{symbols.horizontal.repeat(10)}</Text>
            </Box>
          );
        }

        const thisIdx = selectableIdx;
        selectableIdx++;
        const isCursor = isFocused && thisIdx === cursorIdx;
        const isActive = item.id === selectedId;

        return (
          <Box key={item.id} gap={0}>
            <Text
              color={isCursor ? inkColors.accent : isActive ? inkColors.accent : undefined}
              bold={isCursor || isActive}
              dimColor={!isCursor && !isActive}
            >
              {isCursor ? `${symbols.pointerActive} ` : "  "}
              {item.icon} {item.label}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
}
