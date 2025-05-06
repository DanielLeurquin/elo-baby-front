// src/component/modal/modal.tsx
import React from "react";

interface ModalProps {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, title, children }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className=" flex justify-center flex-col items-center bg-white text-black rounded-3xl p-6 shadow-lg h-[70vh] w-[70%] border-2 border-black maxSm:h-[80vh]">
        <h1 className="text-5xl font-bold mb-2 text-green-500">{title}</h1>
        <div className="">{children}</div>
        <button
          onClick={onClose}
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

export default Modal;
