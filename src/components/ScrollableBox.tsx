import React, { useState } from "react";
import { Box, Text, useInput } from "ink";

interface ScrollableBoxProps {
  height: number;
  isActive?: boolean;
  children: React.ReactNode[];
}

export function ScrollableBox({
  height,
  isActive = true,
  children,
}: ScrollableBoxProps): React.ReactElement {
  const totalItems = children.length;
  const [scrollOffset, setScrollOffset] = useState(0);
  const visibleCount = Math.max(1, height - 2); // leave room for scroll indicators

  useInput(
    (input, key) => {
      if (key.upArrow || input === "k") {
        setScrollOffset((prev) => Math.max(0, prev - 1));
      }
      if (key.downArrow || input === "j") {
        setScrollOffset((prev) => Math.min(Math.max(0, totalItems - visibleCount), prev + 1));
      }
    },
    { isActive },
  );

  const showScrollUp = scrollOffset > 0;
  const showScrollDown = scrollOffset + visibleCount < totalItems;
  const visible = children.slice(scrollOffset, scrollOffset + visibleCount);

  return (
    <Box flexDirection="column" height={height}>
      {showScrollUp && <Text dimColor>  ↑ more</Text>}
      {visible}
      {showScrollDown && <Text dimColor>  ↓ more</Text>}
    </Box>
  );
}
