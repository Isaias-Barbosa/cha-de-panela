import Modal from "react-modal";
import { useState } from "react";
import type { Gift } from "../types";

interface MarkGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  gifts: Gift[];
  onMark: (id: number) => void;
}

Modal.setAppElement("#root");

export default function MarkGiftModal({
  isOpen,
  onClose,
  gifts,
  onMark,
}: MarkGiftModalProps) {
  const [selectedGift, setSelectedGift] = useState<string>("");

  const handleSubmit = () => {
    if (selectedGift) {

      // Marca como comprado
      onMark(Number(selectedGift));

      // Reseta o select
      setSelectedGift("");

       // Fecha o modal
      onClose();
    }
  };

  const availableGifts = gifts.filter((g) => !g.comprado);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto mt-20 outline-none transition-transform duration-300 ease-out scale-95"
     overlayClassName="fixed inset-0 bg-white/20 backdrop-blur-sm flex justify-center items-start transition-opacity duration-300 ease-in"

    >
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Informe qual presente você comprou 💝
      </h2>

      <select
        value={selectedGift}
        onChange={(e) => setSelectedGift(e.target.value)}
        className="w-full bg-gray-700 border rounded-lg p-2 mb-4 text-white"
      >
        <option value="">Selecione um presente</option>
        {availableGifts.map((gift) => (
          <option key={gift.id} value={gift.id}>
            {gift.nome}
          </option>
        ))}
      </select>

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          disabled={!selectedGift}
          className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 disabled:opacity-50 transition"
        >
          Confirmar
        </button>
      </div>
    </Modal>
  );
}
