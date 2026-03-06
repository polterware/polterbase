import { useState, useCallback } from "react";

export type FocusedPanel = "sidebar" | "main";

export function usePanelFocus() {
  const [focused, setFocused] = useState<FocusedPanel>("sidebar");

  const toggleFocus = useCallback(() => {
    setFocused((prev) => (prev === "sidebar" ? "main" : "sidebar"));
  }, []);

  const focusSidebar = useCallback(() => setFocused("sidebar"), []);
  const focusMain = useCallback(() => setFocused("main"), []);

  return {
    focused,
    isSidebarFocused: focused === "sidebar",
    isMainFocused: focused === "main",
    toggleFocus,
    focusSidebar,
    focusMain,
  };
}
