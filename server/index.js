import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import { createClient } from "@supabase/supabase-js";

const app = express();
const PORT = process.env.PORT || 3001;

console.log("DEBUG SUPABASE URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

app.use(bodyParser.json());

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Rota principal para teste
app.get("/", (req, res) => {
  res.send("Servidor webhook ativo!");
});

// Webhook da Kiwify
app.post("/webhook/kiwify", async (req, res) => {
  const headerToken = req.headers.authorization?.split(" ")[1];
  const bodyToken = req.body?.token || req.query?.token;
  const token = headerToken || bodyToken;

  console.log("Token recebido:", token);

  if (token !== process.env.WEBHOOK_SECRET) {
    console.log("Token inválido:", token);
    return res.status(401).json({ error: "Unauthorized" });
  }

  const body = req.body;

  if (
    body.order_status === "paid" &&
    body.webhook_event_type === "order_approved"
  ) {
    const email = body.Customer?.email;
    if (!email) {
      return res.status(400).json({ error: "Email não encontrado" });
    }

    await criarUsuarioSeNaoExistir(email);
  }

  return res.status(200).json({ ok: true });
});

async function criarUsuarioSeNaoExistir(email) {
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error("Erro listando usuários:", listError);
    return;
  }

  const existe = users?.users.find((u) => u.email === email);

  if (!existe) {
    const { error } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
    });

    if (error) console.error("Erro ao criar usuário:", error);
    else console.log(`Usuário ${email} criado com sucesso!`);
  } else {
    console.log(`Usuário ${email} já existe.`);
  }
}

// Inicia o servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor webhook rodando na porta ${PORT}`);
});
