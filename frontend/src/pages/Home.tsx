import { useEffect, useState } from "react";
import type { Gift } from "../types";
import api from "../services/api"; // <- aqui
import GiftList from "../components/GiftList";
import MarkGiftModal from "../components/MarkGiftModal";

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
    
     <div className="flex flex-col min-h-screen bg-blue-50 py-10 w-full"
      style={{
        backgroundImage:
          "url('https://www.transparenttextures.com/patterns/flowers.png')",
        backgroundRepeat: "repeat",
      }}
     >
       {/* Container centralizado */}
      <div className="flex flex-col items-center py-10 flex-1">
      {/* Título */}
      <h1 className="text-3xl font-['Great_Vibes'] mb-4 text-gray-700 text-center"
       style={{ letterSpacing: "1px" }}
      >
        Chá de Panela Isaías & Paula 💕
      </h1>
      {/* Descrição */}
      <p className="text-gray-600 mb-4 text-center max-w-md ">
        Seja bem-vindo(a)! Veja abaixo as sugestões de presentes.
        <p className="bg-red-300 py-2 text-gray-700 p-1 rounded-lg text-center">
        Ao escolher um presente, por favor, clique no botão no final da pagina informando qual presente você comprou.</p>
      </p>

       {/* Aviso */}
      <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg mb-8 max-w-3xl text-center">
        Os links das lojas abaixo são apenas sugestões para os convidados, porém, sinta-se livre
        para comprar na loja de sua preferência, se não encontrar o que queria comprar aqui no site,
        pode escolher outro presente também e entregar no dia do Chá de Panelas.
      </div>


      {/* Lista de presentes */}
      <GiftList gifts={gifts} />

      {/* Botão para abrir modal */}
    
      <button
        onClick={() => setModalOpen(true)}
        className="mt-8 bg-pink-500 text-white px-5 py-3 rounded-xl hover:bg-pink-600 transition"
      >
        Já comprou um presente? Clique aqui e informe
      </button>
    </div>

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
