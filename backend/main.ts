import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const BIN_URL_GIFTS = "https://api.jsonbin.io/v3/b/68ea74a943b1c97be962d1c3";
const BIN_URL_LOJAS = "https://api.jsonbin.io/v3/b/68ea75cfd0ea881f409dc212";

const HEADERS = {
  "Content-Type": "application/json",
  "X-Master-Key": "$2a$10$Fmq.O6jQkbtn8WS5XvGLD.jVkeMLKrAGAJVU7/tRxXNQQyiyxS/Gm",
};

// Cabeçalhos CORS
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
  "Access-Control-Allow-Headers": "Content-Type",
};

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // Tratamento CORS pré-flight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  try {
    // ======== GIFTS ========

    if (pathname === "/gifts") {
      if (req.method === "GET") {
        const res = await fetch(BIN_URL_GIFTS, { headers: HEADERS });
        const data = await res.json();
        return json(data.record.gifts || []);
      }

      if (req.method === "POST") {
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
      }
    }

    if (pathname.startsWith("/gifts/")) {
      const id = pathname.split("/").pop();
      const res = await fetch(BIN_URL_GIFTS, { headers: HEADERS });
      const data = await res.json();
      let gifts = data.record.gifts || [];

      if (req.method === "PUT") {
        const body = await req.json();
        gifts = gifts.map((g: any) => (String(g.id) === id ? { ...g, ...body } : g));
        await fetch(BIN_URL_GIFTS, {
          method: "PUT",
          headers: HEADERS,
          body: JSON.stringify({ ...data.record, gifts }),
        });
        return json({ message: "Presente atualizado!" });
      }

      if (req.method === "DELETE") {
        gifts = gifts.filter((g: any) => String(g.id) !== id);
        await fetch(BIN_URL_GIFTS, {
          method: "PUT",
          headers: HEADERS,
          body: JSON.stringify({ ...data.record, gifts }),
        });
        return json({ message: "Presente removido!" });
      }
    }

    // ======== LOJAS ========

    if (pathname === "/lojas") {
      if (req.method === "GET") {
        const res = await fetch(BIN_URL_LOJAS, { headers: HEADERS });
        const data = await res.json();
        return json(data.record.lojas || []);
      }

      if (req.method === "POST") {
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
      }
    }

    if (pathname.startsWith("/lojas/")) {
      const id = pathname.split("/").pop();
      const res = await fetch(BIN_URL_LOJAS, { headers: HEADERS });
      const data = await res.json();
      let lojas = data.record.lojas || [];

      if (req.method === "PUT") {
        const body = await req.json();
        lojas = lojas.map((l: any) => (String(l.id) === id ? { ...l, ...body } : l));
        await fetch(BIN_URL_LOJAS, {
          method: "PUT",
          headers: HEADERS,
          body: JSON.stringify({ ...data.record, lojas }),
        });
        return json({ message: "Loja atualizada!" });
      }

      if (req.method === "DELETE") {
        lojas = lojas.filter((l: any) => String(l.id) !== id);
        await fetch(BIN_URL_LOJAS, {
          method: "PUT",
          headers: HEADERS,
          body: JSON.stringify({ ...data.record, lojas }),
        });
        return json({ message: "Loja removida!" });
      }
    }

    return new Response("Backend do Chá de Panela rodando! 🎁", { status: 200 });
  } catch (err) {
    console.error(err);
    return error("Erro interno do servidor");
  }
}

// Helpers
function json(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

function error(message: string, status = 500): Response {
  return json({ error: message }, status);
}

serve(handler);
// Para rodar localmente: deno run --allow-net backend/main.ts