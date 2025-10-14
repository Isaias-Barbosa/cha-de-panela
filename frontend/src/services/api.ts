import axios from "axios";

// Verifica se o app está rodando localmente ou em produção
const isLocal = window.location.hostname === "localhost";

// Base URL dinâmica
const baseURL = isLocal
  ? "http://localhost:5000" // quando estiver rodando localmente
  : "isaiasdev-cha-de-pane-87.deno.dev"; // substitua pela URL do Render

const api = axios.create({
  baseURL,
});

export default api;
