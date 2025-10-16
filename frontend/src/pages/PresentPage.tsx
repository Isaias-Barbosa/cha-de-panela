// src/pages/PresentPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Gift } from "../types";
import api from "../services/api";
import Footer from "../components/Footer";

export default function PresentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [gift, setGift] = useState<Gift | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get<Gift[]>("/gifts")
      .then((res) => {
        const found = res.data.find((g) => String(g.id) === String(id));
        if (!found) {
          setError("Presente não encontrado.");
        } else {
          setGift(found);
        }
      })
      .catch(() => setError("Erro ao buscar presente."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleConfirm = async () => {
    if (!gift) return;
    setProcessing(true);
    try {
      // Atualiza no backend (mantendo os campos do gift e marcando comprado)
      await api.put(`/gifts/${gift.id}`, { ...gift, comprado: true });
      // Volta pra home e garante atualização (rota + refresh)
      navigate("/");
      // Reload para garantir que Home busque do backend (simples e seguro)
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError("Erro ao confirmar a compra. Tente novamente.");
      setProcessing(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (loading) return <div className="p-6">Carregando...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!gift) return null;

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center p-6 bg-blue-50"
        style={{
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/flowers.png')",
          backgroundRepeat: "repeat",
        }}
      >
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-md p-6">
          <div className="flex gap-6 mb-6">
            <img
              src={gift.imagem}
              alt={gift.nome}
              className="w-40 h-40 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {gift.nome}
              </h2>
              {gift.tipo && (
                <p className="text-sm text-gray-700 mb-1">
                  Sugestões: {gift.tipo}
                </p>
              )}
              {gift.corPreferencia && (
                <p className="text-sm text-gray-600 mb-2">
                  Cor Sugerida: {gift.corPreferencia}
                </p>
              )}
              <p className="text-sm text-gray-500 mb-4">
                Categoria: {gift.categoria}
              </p>
            </div>
          </div>

          {/* 🏬 Lojas recomendadas */}
          {/*
        {gift.links && gift.links.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-1">
              Se caso queira comprar em uma das lojas sugeridas, separamos elas com os link direto do produto:
            </h3>
            <div className="flex flex-wrap gap-3 py-2">
              {gift.links
                .filter((l) => l.url2) // agora só mostra se tiver link do produto
                .map((l) => (
                  <a
                    key={l.loja}
                    href={l.url2}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border rounded-lg bg-white hover:shadow-md flex items-center gap-2"
                  >
                    <img
                      src={l.logo}
                      alt={l.loja}
                      className="w-3 h-4 object-contain"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {l.loja}
                    </span>
                  </a>
                ))}
            </div>
          </div>
        )}
        */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 inline-block text-gray-600 text-sm">
            <p className="font-medium text-gray-700 mb-1">
              📦 Se quiser enviar o presente diretamente, basta nos chamar no privado.
            </p>
            <div className="text-left inline-block">
              <p>
                <strong>Isaías:</strong> 61 9 96242678 
              </p>
              <p>
                <strong>Paula:</strong> 61 9 93349363
              </p>
            </div>
          </div>

          <div className="py-3">
          <p className="bg-yellow-50 text-gray-800 p-3  rounded mb-4 text-sm">
            Você tem certeza que deseja confirmar a compra deste presente?
          </p>
          <p className="bg-red-400 text-white p-3 rounded mb-4 text-sm">
            Ao confirmar, o presente será marcado como "Presenteado" no site
            para que outros convidados não o escolham.
          </p>
      </div>
          <div className="flex gap-3 ">
            <button
              onClick={handleConfirm}
              disabled={processing || gift.comprado}
              className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
            >
              {processing ? "Confirmando..." : "Sim, confirmar"}
            </button>

            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Não, voltar
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
