// src/pages/PresentPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Gift } from "../types";
import api from "../services/api";

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
    <div className="min-h-screen flex items-center justify-center p-6 bg-pink-50">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-md p-6">
        <div className="flex gap-6">
          <img src={gift.imagem} alt={gift.nome} className="w-40 h-40  object-cover rounded-lg" />
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{gift.nome}</h2>
            {gift.tipo && <p className="text-sm text-gray-600 mb-1">Tipo: {gift.tipo}</p>}
            {gift.corPreferencia && (
              <p className="text-sm text-gray-600 mb-2">Cor: {gift.corPreferencia}</p>
            )}
            <p className="text-sm text-gray-500 mb-4">Categoria: {gift.categoria}</p>

            <p className="bg-yellow-50 text-gray-800 p-2 rounded mb-4 text-sm">
              Você realmente deseja comprar este presente para o casal?
            </p>

            <div className="flex gap-3">
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
      </div>
    </div>
  );
}
