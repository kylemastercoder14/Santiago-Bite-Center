import { create } from "zustand";

interface useBranchModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useBranchModal = create<useBranchModalProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
