import { useState, useCallback } from "react";
import React from "react";

interface ModalState {
  content: React.ReactNode;
  title: string;
}

export function useModal() {
  const [state, setState] = useState<ModalState | null>(null);

  const openModal = useCallback((content: React.ReactNode, title: string) => {
    setState({ content, title });
  }, []);

  const closeModal = useCallback(() => {
    setState(null);
  }, []);

  return {
    isOpen: state !== null,
    modalContent: state?.content ?? null,
    modalTitle: state?.title ?? "",
    openModal,
    closeModal,
  };
}
