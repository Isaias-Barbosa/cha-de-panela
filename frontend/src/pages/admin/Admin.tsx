import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api"; // <- aqui
import { Trash2, Pencil } from "lucide-react";

interface GiftLink {
  loja: string;
  url: string;
  logo: string;
}

interface Gift {
  id?: number;
  nome: string;
  imagem: string;
  categoria: string;
  tipo?: string;
  corPreferencia?: string;
  links: GiftLink[];
  comprado: boolean;
}

interface Loja {
  id?: number;
  loja: string;
  url: string;
  url2?: string; // link do produto (PresentPage)
  logo: string;
}

export default function Admin() {
  const navigate = useNavigate();

  // 🎁 Estados de presentes
  const [nome, setNome] = useState("");
  const [imagem, setImagem] = useState("");
  const [categoria, setCategoria] = useState("Cama, Mesa e Banho");
  const [mensagem, setMensagem] = useState("");
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  // 🧩 Novos estados de tipo e cor
  const [temTipo, setTemTipo] = useState(false);
  const [tipo, setTipo] = useState("");
  const [temCor, setTemCor] = useState(false);
  const [corPreferencia, setCorPreferencia] = useState("");

  // 🏬 Lojas
  const [lojas, setLojas] = useState<Loja[]>([]);
  const [lojasSelecionadas, setLojasSelecionadas] = useState<Loja[]>([]);
  const [novaLoja, setNovaLoja] = useState<Loja>({
    loja: "",
    url: "",
    logo: "",
  });

  // 🔄 Carrega dados iniciais
  useEffect(() => {
    carregarPresentes();
    carregarLojas();
  }, []);

  const carregarPresentes = async () => {
    try {
      const res = await api.get("/gifts"); // <- aqui
      setGifts(res.data);
    } catch (error) {
      console.error("Erro ao buscar presentes:", error);
    }
  };

  const carregarLojas = async () => {
    try {
      const res = await api.get("/lojas"); // <- aqui
      setLojas(res.data);
    } catch (error) {
      console.error("Erro ao buscar lojas:", error);
    }
  };

  // 🟢 Adicionar ou editar presente

  const handleSubmit = async () => {
    // Validações simples
    if (!nome || !imagem || !categoria) {
      setMensagem("Por favor, preencha nome, imagem e categoria.");
      return;
    }

    const gift: Gift = {
      nome,
      imagem,
      categoria,
      tipo: temTipo ? tipo : undefined,
      corPreferencia: temCor ? corPreferencia : undefined,
      links: lojasSelecionadas,
      comprado: false,
    };

    try {
      if (editandoId) {
        await api.put(`/gifts/${editandoId}`, gift); // <- aqui
        setMensagem("Presente atualizado com sucesso!");
      } else {
        await api.post("/gifts", gift); // <- aqui
        setMensagem("Presente adicionado com sucesso!");
      }

      limparFormulario();
      carregarPresentes();
    } catch (error) {
      console.error(error);
      setMensagem("Erro ao salvar o presente.");
    }
  };

  // 🔴 Excluir presente
  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm("Tem certeza que deseja excluir este presente?")) return;

    try {
      await api.delete(`/gifts/${id}`); // <- aqui
      setGifts(gifts.filter((g) => g.id !== id));
    } catch (error) {
      console.error("Erro ao excluir presente:", error);
    }
  };

  // ✏️ Editar presente
  const handleEdit = (gift: Gift) => {
    setEditandoId(gift.id || null);
    setNome(gift.nome);
    setImagem(gift.imagem);
    setCategoria(gift.categoria);
    setTipo(gift.tipo || "");
    setCorPreferencia(gift.corPreferencia || "");
    setTemTipo(!!gift.tipo);
    setTemCor(!!gift.corPreferencia);
    setLojasSelecionadas(gift.links || []);
  };

  // 🟢 Marcar presente como "Comprado"
  const handleMarcarComoComprado = async () => {
    if (!editandoId) return;

    try {
      const giftSelecionado = gifts.find((g) => g.id === editandoId);
      if (!giftSelecionado) return;

      const atualizado = { ...giftSelecionado, comprado: true };

      await api.put(`/gifts/${editandoId}`, atualizado);
      setMensagem("Presente marcado como 'Comprado'!");
      carregarPresentes();
      limparFormulario();
    } catch (error) {
      console.error("Erro ao atualizar presente:", error);
      setMensagem("Erro ao marcar como 'Comprado'.");
    }
  };

  // 🟡 Marcar presente como "Não comprado"
  const handleMarcarComoNaoComprado = async () => {
    if (!editandoId) return;

    try {
      const giftSelecionado = gifts.find((g) => g.id === editandoId);
      if (!giftSelecionado) return;

      const atualizado = { ...giftSelecionado, comprado: false };

      await api.put(`/gifts/${editandoId}`, atualizado);
      setMensagem("Presente marcado como 'Não comprado'!");
      carregarPresentes();
      limparFormulario();
    } catch (error) {
      console.error("Erro ao atualizar presente:", error);
      setMensagem("Erro ao marcar como 'Não comprado'.");
    }
  };

  // 🧹 Limpar form
  const limparFormulario = () => {
    setNome("");
    setImagem("");
    setCategoria("Cama, Mesa e Banho");
    setTipo("");
    setCorPreferencia("");
    setTemTipo(false);
    setTemCor(false);
    setEditandoId(null);
    setLojasSelecionadas([]);
  };

  // 🏬 Cadastrar loja
  const handleAddLoja = async () => {
    if (!novaLoja.loja || !novaLoja.url || !novaLoja.logo) return;
    try {
      await api.post("/lojas", novaLoja); // <- aqui
      setNovaLoja({ loja: "", url: "", logo: "" });
      carregarLojas();
    } catch (error) {
      console.error("Erro ao adicionar loja:", error);
    }
  };

  const handleSelectLoja = (loja: Loja) => {
    setLojasSelecionadas((prevSelecionadas) => {
      const existe = prevSelecionadas.some((l) => l.loja === loja.loja);
      if (existe) {
        return prevSelecionadas.filter((l) => l.loja !== loja.loja);
      } else {
        return [...prevSelecionadas, loja];
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-700">
        Admin - Adicionar Presente
      </h1>
      <button
        onClick={() => navigate("/admin/presentes-entregues")}
        className="mb-4 px-4 py-2 bg-pink-500 text-white rounded-xl  hover:bg-pink-600 transition"
      >
        Ver Presentes Entregues
      </button>
      <div className="max-w-3xl bg-blue-50 p-6 rounded-2xl shadow-md space-y-4">
        <div>
          <label className="block text-gray-800 font-semibold mb-1">
            Nome do presente
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full border-gray-800 text-gray-800 border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-gray-800 ">
            URL da imagem
          </label>
          <input
            type="text"
            value={imagem}
            onChange={(e) => setImagem(e.target.value)}
            className="w-full border-gray-800 text-gray-800 border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-gray-800 font-semibold mb-1">
            Categoria
          </label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full border-gray-800 text-gray-800 border rounded-lg p-2"
          >
            <option>Cama, Mesa e Banho</option>
            <option>Cozinha</option>
            <option>Decoração</option>
            <option>Eletrônicos</option>
            <option>Móveis</option>
            <option>Sala de Estar</option>
          </select>
        </div>

        {/* Preferência de tipo */}
        <div>
          <label className="block text-gray-800 font-semibold mb-1">
            Tem preferência para o tipo?
          </label>
          <div className="flex gap-4 mb-2">
            <button
              type="button"
              onClick={() => setTemTipo(true)}
              className={`px-3 py-1 rounded-lg ${
                temTipo ? "bg-green-500 text-white" : "bg-gray-200"
              }`}
            >
              Sim
            </button>
            <button
              type="button"
              onClick={() => {
                setTemTipo(false);
                setTipo("");
              }}
              className={`px-3 py-1 rounded-lg ${
                !temTipo ? "bg-red-500 text-white" : "bg-gray-200"
              }`}
            >
              Não
            </button>
          </div>
          {temTipo && (
            <input
              type="text"
              placeholder="Ex: Inox, Vidro..."
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full border border-gray-800 text-gray-800 rounded-lg p-2"
            />
          )}
        </div>

        {/* Preferência de cor */}
        <div>
          <label className="block text-gray-800 font-semibold mb-1">
            Tem preferência para cor?
          </label>
          <div className="flex gap-4 mb-2">
            <button
              type="button"
              onClick={() => setTemCor(true)}
              className={`px-3 py-1 rounded-lg ${
                temCor ? "bg-green-500 text-white" : "bg-gray-200"
              }`}
            >
              Sim
            </button>
            <button
              type="button"
              onClick={() => {
                setTemCor(false);
                setCorPreferencia("");
              }}
              className={`px-3 py-1 rounded-lg ${
                !temCor ? "bg-red-500 text-white" : "bg-gray-200"
              }`}
            >
              Não
            </button>
          </div>
          {temCor && (
            <input
              type="text"
              placeholder="Ex: Azul, Vermelho..."
              value={corPreferencia}
              onChange={(e) => setCorPreferencia(e.target.value)}
              className="w-full border border-gray-800 text-gray-800 rounded-lg p-2"
            />
          )}
        </div>

        {/* Seleção de lojas */}
        <div>
          <label className="block text-gray-800 font-semibold mb-2">
            Selecionar lojas
          </label>
          <div className="flex flex-wrap gap-3">
            {lojas.map((loja) => (
              <button
                key={loja.id}
                type="button"
                onClick={() => handleSelectLoja(loja)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                  lojasSelecionadas.some((l) => l.loja === loja.loja)
                    ? "bg-green-200 border-green-600"
                    : "bg-white border-gray-400"
                }`}
              >
                <img
                  src={loja.logo}
                  alt={loja.loja}
                  className="w-6 h-6 object-contain"
                />
                <span className="text-sm">{loja.loja}</span>
              </button>
            ))}
          </div>
        </div>

        {lojasSelecionadas.length > 0 && (
          <div className="mt-4 bg-white border rounded-lg p-4 space-y-3">
            <p className="font-semibold text-gray-700">Lojas selecionadas:</p>

            <ul className="space-y-3">
              {lojasSelecionadas.map((l, index) => (
                <li key={l.loja} className="border-b pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={l.logo}
                      alt={l.loja}
                      className="w-6 h-6 object-contain"
                    />
                    <span className="text-gray-700 font-medium">{l.loja}</span>
                  </div>

                  {/* Campo 1: URL da loja (link principal, aparece na home) */}
                  <input
                    type="text"
                    placeholder={`URL da loja ${l.loja} (home)`}
                    value={l.url || ""}
                    onChange={(e) => {
                      const novasLojas = [...lojasSelecionadas];
                      novasLojas[index] = { ...l, url: e.target.value };
                      setLojasSelecionadas(novasLojas);
                    }}
                    className="w-full border border-gray-300 text-gray-800 rounded-lg p-2 mb-2"
                  />

                  {/* Campo 2: URL do produto (usado na página Presentear) */}
                  <input
                    type="text"
                    placeholder={`URL do produto na ${l.loja}`}
                    value={l.url2 || ""}
                    onChange={(e) => {
                      const novasLojas = [...lojasSelecionadas];
                      novasLojas[index] = { ...l, url2: e.target.value };
                      setLojasSelecionadas(novasLojas);
                    }}
                    className="w-full border border-gray-300 text-gray-800 rounded-lg p-2"
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="w-full mt-4 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition"
        >
          Salvar presente
        </button>

        {editandoId && (
          <div className="mt-4 flex flex-col items-center gap-2">
            {gifts.find((g) => g.id === editandoId)?.comprado ? (
              <button
                onClick={handleMarcarComoNaoComprado}
                className="w-full px-4 py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition"
              >
                Marcar como Não Comprado
              </button>
            ) : (
              <button
                onClick={handleMarcarComoComprado}
                className="w-full px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition"
              >
                Marcar como Comprado
              </button>
            )}
          </div>
        )}

        {mensagem && (
          <p className="mt-2 text-center border rounded-b-lg border-blue-200 text-green-500">
            {mensagem}
          </p>
        )}
      </div>

      {/* 🏬 Cadastro de Lojas */}
      <div className="bg-yellow-50 p-6 rounded-2xl shadow-md space-y-4 px-12 mt-6">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Cadastro de Lojas
        </h2>

        <input
          type="text"
          placeholder="Nome da loja"
          value={novaLoja.loja}
          onChange={(e) => setNovaLoja({ ...novaLoja, loja: e.target.value })}
          className="w-full border border-gray-800 text-gray-800 rounded-lg p-2"
        />
        <input
          type="text"
          placeholder="URL da loja"
          value={novaLoja.url}
          onChange={(e) => setNovaLoja({ ...novaLoja, url: e.target.value })}
          className="w-full border border-gray-800 text-gray-800 rounded-lg p-2"
        />
        <input
          type="text"
          placeholder="URL da logo"
          value={novaLoja.logo}
          onChange={(e) => setNovaLoja({ ...novaLoja, logo: e.target.value })}
          className="w-full border border-gray-800 text-gray-800 rounded-lg p-2"
        />

        <button
          onClick={handleAddLoja}
          className="w-full mt-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
        >
          Salvar loja
        </button>

        <div className="mt-6 max-h-80 overflow-y-auto">
          {lojas.map((loja) => (
            <div
              key={loja.id}
              className="flex items-center gap-3 mb-2 bg-white p-2 rounded-lg border"
            >
              <img
                src={loja.logo}
                alt={loja.loja}
                className="w-8 h-8 object-contain"
              />
              <div className="flex-1">
                <p className="font-semibold">{loja.loja}</p>
                <a
                  href={loja.url}
                  target="_blank"
                  className="text-blue-600 text-sm"
                >
                  {loja.url}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🧾 Tabela */}
      <div className="max-w-6xl mx-auto overflow-x-auto mt-12">
        <table className="min-w-full border-collapse bg-gray-700 shadow rounded-2xl overflow-hidden">
          <thead>
            <tr className="bg-gray-700 text-white text-left">
              <th className="p-3 border-b">ID</th>
              <th className="p-3 border-b">Nome</th>
              <th className="p-3 border-b">Categoria</th>
              <th className="p-3 border-b">Tipo</th>
              <th className="p-3 border-b">Cor</th>
              <th className="p-3 border-b">Comprado</th>
              <th className="p-3 border-b text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {gifts.map((gift) => (
              <tr key={gift.id} className="hover:bg-gray-700">
                <td className="p-3 border-b">{gift.id}</td>
                <td className="p-3 border-b">{gift.nome}</td>
                <td className="p-3 border-b">{gift.categoria}</td>
                <td className="p-3 border-b">{gift.tipo || "-"}</td>
                <td className="p-3 border-b">
                  {gift.corPreferencia ? (
                    <span style={{ color: gift.corPreferencia.toLowerCase() }}>
                      {gift.corPreferencia.charAt(0).toUpperCase() +
                        gift.corPreferencia.slice(1)}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-3 border-b">
                  {gift.comprado ? "Sim" : "Não"}
                </td>
                <td className="p-3 border-b text-center flex justify-center gap-4">
                  <button
                    onClick={() => handleEdit(gift)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(gift.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {gifts.length === 0 && (
          <p className="text-center text-gray-600 mt-6">
            Nenhum presente cadastrado ainda.
          </p>
        )}
      </div>
    </div>
  );
}
