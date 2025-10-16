import { useEffect, useState } from "react";
import type { Gift } from "../types";
import api from "../services/api"; // <- aqui
import GiftList from "../components/GiftList";
import MarkGiftModal from "../components/MarkGiftModal";
import Footer from "../components/Footer";

export default function Home() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Busca os presentes usando a instância api
    api
      .get<Gift[]>("/gifts")
      .then((res) => setGifts(res.data))
      .catch((err) => console.error("Erro ao buscar presentes:", err));
  }, []);

  const handleMarkAsBought = async (id: number) => {
    await api.patch(`/gifts/${id}`, { comprado: true }); // <- aqui
    setGifts((prev) =>
      prev.map((gift) => (gift.id === id ? { ...gift, comprado: true } : gift))
    );
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-blue-50 w-full"
      style={{
        backgroundImage:
          "url('https://www.transparenttextures.com/patterns/flowers.png')",
        backgroundRepeat: "repeat",
      }}
    >
      {/* Container centralizado */}
      <div className="flex flex-col items-center py-10 flex-1">
        {/* Título */}
        <h1
          className="text-3xl font-['Great_Vibes'] mb-4 text-gray-700 text-center"
          style={{ letterSpacing: "1px" }}
        >
          Chá de Panela Isaías & Paula 💕
        </h1>
        {/* Descrição */}
        <p className="text-gray-600 mb-5 text-center max-w-md ">
          Seja bem-vindo(a)! Veja abaixo as sugestões de presentes.
        </p>

        {/* Aviso */}
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg mb-8 max-w-3xl text-center">
          Os links das lojas abaixo são apenas sugestões para os convidados,
          porém, sintam-se livre para comprar na loja de sua preferência. <br />
          <p className="text-gray-600 text-mb">
            As imagens abaixos são apenas ilustrativas
          </p>
        </div>

        {/* Cartão de data */}
        <div className="border border-gray-700 rounded-2xl px-8 py-5 mb-10 text-center">
          <h2 className="text-2xl font-semibold text-pink-700 drop-shadow-sm">
            Data do Chá de Panela
          </h2>
          <p className="text-gray-800 text-xl mt-2 font-medium">
            15 de março de 2026
          </p>

        </div>

        {/*}
      <p className="bg-red-300 py-2 text-gray-700 p-4 rounded-lg mb-8 text-center ">
        Se as imagens dos produtos não aparecer, aguarde entre 30 segundos a 1 minuto que elas irão aparecer de forma automática.</p>*/}

        {/* Lista de presentes */}
        <GiftList gifts={gifts} />
      </div>

      <Footer />

      {/* Modal */}
      <MarkGiftModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        gifts={gifts}
        onMark={handleMarkAsBought}
      />
    </div>
  );
}
