import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const BIN_URL_GIFTS = "https://api.jsonbin.io/v3/b/68ea74a943b1c97be962d1c3";
const BIN_URL_LOJAS = "https://api.jsonbin.io/v3/b/68ea75cfd0ea881f409dc212";

const HEADERS = {
  "Content-Type": "application/json",
  "X-Master-Key": "$2a$10$Fmq.O6jQkbtn8WS5XvGLD.jVkeMLKrAGAJVU7/tRxXNQQyiyxS/Gm",
};

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const { pathname } = url;

  // ======== GIFTS ========

  // GET /gifts
  if (req.method === "GET" && pathname === "/gifts") {
    try {
      const res = await fetch(BIN_URL_GIFTS, { headers: HEADERS });
      const data = await res.json();
      return json(data.record.gifts || []);
    } catch {
      return error("Erro ao buscar gifts");
    }
  }

  // POST /gifts
  if (req.method === "POST" && pathname === "/gifts") {
    try {
      const res = await fetch(BIN_URL_GIFTS, { headers: HEADERS });
      const data = await res.json();
      const gifts = data.record.gifts || [];
      const body = await req.json();
      const newGift = { id: Date.now(), ...body };
      gifts.push(newGift);

      await fetch(BIN_URL_GIFTS, {
        method: "PUT",
        headers: HEADERS,
        body: JSON.stringify({ ...data.record, gifts }),
      });

      return json(newGift, 201);
    } catch {
      return error("Erro ao adicionar gift");
    }
  }

  // PUT /gifts/:id
  if (req.method === "PUT" && pathname.startsWith("/gifts/")) {
    try {
      const id = pathname.split("/").pop();
      const res = await fetch(BIN_URL_GIFTS, { headers: HEADERS });
      const data = await res.json();
      let gifts = data.record.gifts || [];
      const body = await req.json();

      gifts = gifts.map((g: any) => (String(g.id) === id ? { ...g, ...body } : g));

      await fetch(BIN_URL_GIFTS, {
        method: "PUT",
        headers: HEADERS,
        body: JSON.stringify({ ...data.record, gifts }),
      });

      return json({ message: "Presente atualizado!" });
    } catch {
      return error("Erro ao atualizar gift");
    }
  }

  // DELETE /gifts/:id
  if (req.method === "DELETE" && pathname.startsWith("/gifts/")) {
    try {
      const id = pathname.split("/").pop();
      const res = await fetch(BIN_URL_GIFTS, { headers: HEADERS });
      const data = await res.json();
      let gifts = data.record.gifts || [];

      gifts = gifts.filter((g: any) => String(g.id) !== id);

      await fetch(BIN_URL_GIFTS, {
        method: "PUT",
        headers: HEADERS,
        body: JSON.stringify({ ...data.record, gifts }),
      });

      return json({ message: "Presente removido!" });
    } catch {
      return error("Erro ao remover gift");
    }
  }

  // ======== LOJAS ========

  // GET /lojas
  if (req.method === "GET" && pathname === "/lojas") {
    try {
      const res = await fetch(BIN_URL_LOJAS, { headers: HEADERS });
      const data = await res.json();
      return json(data.record.lojas || []);
    } catch {
      return error("Erro ao buscar lojas");
    }
  }

  // POST /lojas
  if (req.method === "POST" && pathname === "/lojas") {
    try {
      const res = await fetch(BIN_URL_LOJAS, { headers: HEADERS });
      const data = await res.json();
      const lojas = data.record.lojas || [];
      const body = await req.json();
      const newLoja = { id: Date.now(), ...body };
      lojas.push(newLoja);

      await fetch(BIN_URL_LOJAS, {
        method: "PUT",
        headers: HEADERS,
        body: JSON.stringify({ ...data.record, lojas }),
      });

      return json(newLoja, 201);
    } catch {
      return error("Erro ao adicionar loja");
    }
  }

  // PUT /lojas/:id
  if (req.method === "PUT" && pathname.startsWith("/lojas/")) {
    try {
      const id = pathname.split("/").pop();
      const res = await fetch(BIN_URL_LOJAS, { headers: HEADERS });
      const data = await res.json();
      let lojas = data.record.lojas || [];
      const body = await req.json();

      lojas = lojas.map((l: any) => (String(l.id) === id ? { ...l, ...body } : l));

      await fetch(BIN_URL_LOJAS, {
        method: "PUT",
        headers: HEADERS,
        body: JSON.stringify({ ...data.record, lojas }),
      });

      return json({ message: "Loja atualizada!" });
    } catch {
      return error("Erro ao atualizar loja");
    }
  }

  // DELETE /lojas/:id
  if (req.method === "DELETE" && pathname.startsWith("/lojas/")) {
    try {
      const id = pathname.split("/").pop();
      const res = await fetch(BIN_URL_LOJAS, { headers: HEADERS });
      const data = await res.json();
      let lojas = data.record.lojas || [];

      lojas = lojas.filter((l: any) => String(l.id) !== id);

      await fetch(BIN_URL_LOJAS, {
        method: "PUT",
        headers: HEADERS,
        body: JSON.stringify({ ...data.record, lojas }),
      });

      return json({ message: "Loja removida!" });
    } catch {
      return error("Erro ao remover loja");
    }
  }

  // Rota padrão
  return new Response("Backend do Chá de Panela rodando! 🎁", { status: 200 });
}

// Helpers
function json(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function error(message: string, status = 500): Response {
  return json({ error: message }, status);
}

serve(handler);
