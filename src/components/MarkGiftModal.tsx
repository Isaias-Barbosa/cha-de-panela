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
      onMark(Number(selectedGift));
      setSelectedGift("");
      onClose();
    }
  };

  const availableGifts = gifts.filter((g) => !g.comprado);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto mt-20 outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Informe qual presente você comprou 💝
      </h2>

      <select
        value={selectedGift}
        onChange={(e) => setSelectedGift(e.target.value)}
        className="w-full bg-gray-700 border rounded-lg p-2 mb-4"
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
          className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          disabled={!selectedGift}
          className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 disabled:opacity-50"
        >
          Confirmar
        </button>
      </div>
    </Modal>
  );
}
