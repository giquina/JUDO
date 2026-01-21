import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type ModalType =
  | "subscription"
  | "profile"
  | "booking"
  | "achievements"
  | "calendar"
  | "goals"
  | null;

interface ModalContextType {
  activeModal: ModalType;
  modalData: any;
  openModal: (modal: ModalType, data?: any) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [modalData, setModalData] = useState<any>(null);

  const openModal = (modal: ModalType, data?: any) => {
    setActiveModal(modal);
    setModalData(data);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalData(null);
  };

  return (
    <ModalContext.Provider value={{ activeModal, modalData, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
