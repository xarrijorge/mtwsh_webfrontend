"use client";

import { useEffect } from "react";

export default function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4">
      <div
        onClick={onClose}
        className="absolute inset-0"
      />
      <div className="relative z-10 bg-white w-full max-w-xl rounded-lg shadow-lg p-6 animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-lg font-bold"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}