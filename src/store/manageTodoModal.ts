import create from "zustand";

interface ManageTodoModal {
  showModal: boolean;
  setShowModal: (state: boolean) => void;
}

export const useManageTodoModal = create<ManageTodoModal>((set) => ({
  showModal: false,
  setShowModal: (state: boolean) => set({ showModal: state }),
}));
