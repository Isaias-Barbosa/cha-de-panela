// src/pages/admin/PresentesEntregues.tsx
import { useEffect, useState } from "react";
import api from "../../services/api";
import type { Gift } from "../../types";
import { useNavigate } from "react-router-dom";

interface PresenteEntregue {
  id: number;
  nomePessoa: string;
  presenteId: number;
  presenteNome: string;
}

export default function PresentesEntregues() {
  const [presentes, setPresentes] = useState<Gift[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [presentesFiltrados, setPresentesFiltrados] = useState<Gift[]>([]);
  const [nomePessoa, setNomePessoa] = useState("");
  const [presenteId, setPresenteId] = useState<number | null>(null);
  const [listaEntregues, setListaEntregues] = useState<PresenteEntregue[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");
   const navigate = useNavigate();
   

  const categorias = [
    "Cama, Mesa e Banho",
    "Cozinha",
    "Decoração",
    "Eletrônicos",
    "Sala de Estar",
  ];

  // 🔹 Busca os presentes comprados da API
  useEffect(() => {
    api
      .get("/gifts")
      .then((res) => {
        const apenasComprados = res.data.filter(
          (p: Gift) => p.comprado === true
        );
        setPresentes(apenasComprados);
      })
      .catch((err) =>
        console.error("Erro ao carregar presentes comprados:", err)
      );
  }, []);

  // 🔹 Busca os presentes entregues da API
useEffect(() => {
  api
    .get("/presentesEntregues")
    .then((res) => setListaEntregues(res.data))
    .catch((err) => console.error("Erro ao carregar presentes entregues:", err));
}, []);

  // Filtra por categoria e por comprado === true
  useEffect(() => {
    if (categoriaSelecionada) {
      const filtrados = presentes.filter(
        (p) => p.categoria === categoriaSelecionada && p.comprado === true
      );
      setPresentesFiltrados(filtrados);
    } else {
      setPresentesFiltrados([]);
    }
  }, [categoriaSelecionada, presentes]);

  const handleAdd = async () => {
    if (!nomePessoa || !presenteId) return alert("Preencha todos os campos!");

    const presenteSelecionado = presentes.find((p) => p.id === presenteId);
    if (!presenteSelecionado) return;

    const novoPresente: PresenteEntregue = {
      id: editandoId ?? Date.now(),
      nomePessoa,
      presenteId,
      presenteNome: presenteSelecionado.nome,
    };

    try {
      if (editandoId) {
        await api.put(`/presentesEntregues/${editandoId}`, novoPresente);
        setListaEntregues((prev) =>
          prev.map((p) => (p.id === editandoId ? novoPresente : p))
        );
        setEditandoId(null);
        setMensagemSucesso("✅ Presente atualizado com sucesso!");
      } else {
        const res = await api.post("/presentesEntregues", novoPresente);
        setListaEntregues((prev) => [...prev, res.data]);
        setMensagemSucesso("🎉 Presente entregue cadastrado com sucesso!");
      }

      setNomePessoa("");
      setPresenteId(null);
      setCategoriaSelecionada("");

      // Remove a mensagem após 3 segundos
      setTimeout(() => setMensagemSucesso(""), 3000);
    } catch (err) {
      console.error("Erro ao salvar presente entregue:", err);
    }
  };

  const handleEdit = (id: number) => {
    const item = listaEntregues.find((p) => p.id === id);
    if (!item) return;
    setNomePessoa(item.nomePessoa);
    setPresenteId(item.presenteId);
    setCategoriaSelecionada(
      presentes.find((p) => p.id === item.presenteId)?.categoria || ""
    );
    setEditandoId(id);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/presentesEntregues/${id}`);
      setListaEntregues((prev) => prev.filter((p) => p.id !== id));
      setMensagemSucesso("🗑️ Presente excluído com sucesso!");
    setTimeout(() => setMensagemSucesso(""), 3000);
    } catch (err) {
      console.error("Erro ao excluir presente entregue:", err);
      setMensagemErro("❌ Erro ao excluir presente. Tente novamente!");
    setTimeout(() => setMensagemErro(""), 3000);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-pink-600 mb-6">
        🎁 Presentes Entregues
      </h1>
      <button
        onClick={() => navigate("/admin/")}
        className="mb-4 px-4 py-2 bg-pink-500 text-white rounded-xl  hover:bg-pink-600 transition"
      >
        Voltar ao Admin.
      </button>
      <div className="bg-white p-6 rounded-2xl shadow-md max-w-lg mb-10">
        <h2 className="text-lg text-gray-700 font-semibold mb-4">
          {editandoId ? "Editar Presente" : "Adicionar Presente"}
        </h2>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nome de quem presenteou"
            value={nomePessoa}
            onChange={(e) => setNomePessoa(e.target.value)}
            className="border text-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-400 outline-none"
          />

          <select
            value={categoriaSelecionada}
            onChange={(e) => setCategoriaSelecionada(e.target.value)}
            className="border text-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-400 outline-none"
          >
            <option value="">Selecione uma categoria</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={presenteId || ""}
            onChange={(e) => setPresenteId(Number(e.target.value))}
            className="border rounded text-gray-700 lg px-3 py-2 focus:ring-2 focus:ring-pink-400 outline-none"
            disabled={!categoriaSelecionada}
          >
            <option value="">Selecione o presente</option>
            {presentesFiltrados.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>

          <button
            onClick={handleAdd}
            className="bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition"
          >
            {editandoId ? "Salvar Edição" : "Adicionar"}
          </button>
          {mensagemSucesso && (
            <p className="text-green-600 text-sm mt-2 font-semibold">
              {mensagemSucesso}
            </p>
          )}
          {mensagemErro && (
  <p className="text-red-600 text-sm mt-2 font-semibold">
    {mensagemErro}
  </p>
)}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border-gray-700 border-1 shadow-md">
        <h2 className="text-lg text-gray-700 font-semibold mb-4">
          Lista de Presentes Entregues
        </h2>
        {listaEntregues.length === 0 ? (
          <p className="text-gray-500">Nenhum presente entregue ainda.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-blue-100">
                <th className="p-3 text-gray-700">Nome</th>
                <th className="p-3 text-gray-700">Presente</th>
                <th className="p-3 text-gray-700 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {listaEntregues.map((item) => (
                <tr
                  key={item.id}
                  className="border-b text-gray-700 hover:bg-gray-50"
                >
                  <td className="p-3">{item.nomePessoa}</td>
                  <td className="p-3">{item.presenteNome}</td>
                  <td className="p-3 text-center flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:underline"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
