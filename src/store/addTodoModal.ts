import create from "zustand";

interface AddTodoModal {
  showModal: boolean;
  setShowModal: (state: boolean) => void;
}

export const useAddTodoModal = create<AddTodoModal>((set) => ({
  showModal: false,
  setShowModal: (state: boolean) => set({ showModal: state }),
}));
