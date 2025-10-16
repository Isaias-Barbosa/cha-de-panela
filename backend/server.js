import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// 🔗 URL do seu JSONBin
const BIN_URL_GIFTS = "https://api.jsonbin.io/v3/b/68ea74a943b1c97be962d1c3";
const BIN_URL_LOJAS  = "https://api.jsonbin.io/v3/b/68ea75cfd0ea881f409dc212";
const BIN_URL_PRESENTES_ENTREGUES = "https://api.jsonbin.io/v3/b/68f16e78ae596e708f17ce2d";

// 🗝️ Sua chave mestre do JSONBin
const HEADERS = {
  "Content-Type": "application/json",
  "X-Master-Key": "$2a$10$Fmq.O6jQkbtn8WS5XvGLD.jVkeMLKrAGAJVU7/tRxXNQQyiyxS/Gm"
};

// ======== ROTAS ========

// ======================= GIFTS =======================

// Listar todos os presentes
app.get("/gifts", async (req, res) => {
  try {
    const response = await axios.get(BIN_URL_GIFTS, { headers: HEADERS });
    res.json(response.data.record.gifts || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar gifts" });
  }
});

// Adicionar novo presente
app.post("/gifts", async (req, res) => {
  try {
    const { data } = await axios.get(BIN_URL_GIFTS, { headers: HEADERS });
    const gifts = data.record.gifts || [];
    const newGift = { id: Date.now(), ...req.body };
    gifts.push(newGift);

    await axios.put(
      BIN_URL_GIFTS,
      { ...data.record, gifts },
      { headers: HEADERS }
    );

    res.status(201).json(newGift);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao adicionar gift" });
  }
});

// Editar presente
app.put("/gifts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await axios.get(BIN_URL_GIFTS, { headers: HEADERS });
    let gifts = data.record.gifts || [];

    gifts = gifts.map((g) => (g.id == id ? { ...g, ...req.body } : g));

    await axios.put(BIN_URL_GIFTS, { ...data.record, gifts }, { headers: HEADERS });
    res.json({ message: "Presente atualizado!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar gift" });
  }
});

// Excluir presente
app.delete("/gifts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await axios.get(BIN_URL_GIFTS, { headers: HEADERS });
    let gifts = data.record.gifts || [];

    gifts = gifts.filter((g) => g.id != id);

    await axios.put(BIN_URL_GIFTS, { ...data.record, gifts }, { headers: HEADERS });
    res.json({ message: "Presente removido!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao remover gift" });
  }
});

// Listar apenas presentes comprados
app.get("/gifts/comprados", async (req, res) => {
  try {
    const { data } = await axios.get(BIN_URL_GIFTS, { headers: HEADERS });
    const gifts = data.record.gifts || [];
    const comprados = gifts.filter((g) => g.comprado === true);
    res.json(comprados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar gifts comprados" });
  }
});


// ======================= LOJAS =======================

// Listar todas as lojas
app.get("/lojas", async (req, res) => {
  try {
    const response = await axios.get(BIN_URL_LOJAS, { headers: HEADERS });
    res.json(response.data.record.lojas || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar lojas" });
  }
});

// Adicionar nova loja
app.post("/lojas", async (req, res) => {
  try {
    const { data } = await axios.get(BIN_URL_LOJAS, { headers: HEADERS });
    const lojas = data.record.lojas || [];
    const newLoja = { id: Date.now(), ...req.body };
    lojas.push(newLoja);

    await axios.put(BIN_URL_LOJAS, { ...data.record, lojas }, { headers: HEADERS });

    res.status(201).json(newLoja);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao adicionar loja" });
  }
});

// Editar loja
app.put("/lojas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await axios.get(BIN_URL_LOJAS, { headers: HEADERS });
    let lojas = data.record.lojas || [];

    lojas = lojas.map((l) => (l.id == id ? { ...l, ...req.body } : l));

    await axios.put(BIN_URL_LOJAS, { ...data.record, lojas }, { headers: HEADERS });
    res.json({ message: "Loja atualizada!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar loja" });
  }
});

// Excluir loja
app.delete("/lojas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await axios.get(BIN_URL_LOJAS, { headers: HEADERS });
    let lojas = data.record.lojas || [];

    lojas = lojas.filter((l) => l.id != id);

    await axios.put(BIN_URL_LOJAS, { ...data.record, lojas }, { headers: HEADERS });
    res.json({ message: "Loja removida!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao remover loja" });
  }
});

// ======================= PRESENTES ENTREGUES =======================

// Listar todos os presentes entregues
app.get("/presentesEntregues", async (req, res) => {
  try {
    const { data } = await axios.get(BIN_URL_PRESENTES_ENTREGUES, { headers: HEADERS });
    res.json(data.record.presentesEntregues || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar presentes entregues" });
  }
});

// Adicionar presente entregue
app.post("/presentesEntregues", async (req, res) => {
  try {
    const { data } = await axios.get(BIN_URL_PRESENTES_ENTREGUES, { headers: HEADERS });
    const entregues = data.record.presentesEntregues || [];
    const newEntregue = { id: Date.now(), ...req.body }; // Ex: { nomePessoa, presente }
    entregues.push(newEntregue);

    await axios.put(
      BIN_URL_PRESENTES_ENTREGUES,
      { ...data.record, presentesEntregues: entregues },
      { headers: HEADERS }
    );

    res.status(201).json(newEntregue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao adicionar presente entregue" });
  }
});

// Editar presente entregue
app.put("/presentesEntregues/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await axios.get(BIN_URL_PRESENTES_ENTREGUES, { headers: HEADERS });
    let entregues = data.record.presentesEntregues || [];

    entregues = entregues.map((e) => (e.id == id ? { ...e, ...req.body } : e));

    await axios.put(
      BIN_URL_PRESENTES_ENTREGUES,
      { ...data.record, presentesEntregues: entregues },
      { headers: HEADERS }
    );

    res.json({ message: "Presente entregue atualizado!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar presente entregue" });
  }
});

// Excluir presente entregue
app.delete("/presentesEntregues/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await axios.get(BIN_URL_PRESENTES_ENTREGUES, { headers: HEADERS });
    let entregues = data.record.presentesEntregues || [];

    entregues = entregues.filter((e) => e.id != id);

    await axios.put(
      BIN_URL_PRESENTES_ENTREGUES,
      { ...data.record, presentesEntregues: entregues },
      { headers: HEADERS }
    );

    res.json({ message: "Presente entregue removido!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao remover presente entregue" });
  }
});

app.listen(PORT, () => console.log(`✅ Backend rodando na porta ${PORT}`));


