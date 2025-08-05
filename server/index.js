import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const app = express();
const PORT = process.env.PORT || 3001;

// Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Middleware para capturar o raw body (necessário para HMAC)
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

// Teste
app.get("/", (req, res) => {
  res.send("Servidor webhook seguro ativo!");
});

// Webhook Kiwify com validação HMAC-SHA256
app.post("/webhook/kiwify", async (req, res) => {
  const signature = req.headers["x-kiwify-webhook-signature"];
  const secret = process.env.WEBHOOK_SECRET;

  if (!signature) {
    console.log("❌ Assinatura ausente");
    return res.status(401).json({ error: "Assinatura ausente" });
  }

  // Recalcular o hash
  const hmac = crypto.createHmac("sha256", secret);
  const calculated = hmac.update(req.rawBody).digest("hex");

  console.log("🔐 Assinatura recebida:", signature);
  console.log("🔐 Assinatura calculada:", calculated);

  if (signature !== calculated) {
    console.log("❌ Assinatura inválida");
    return res.status(401).json({ error: "Assinatura inválida" });
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
    else console.log(`✅ Usuário ${email} criado com sucesso!`);
  } else {
    console.log(`⚠️ Usuário ${email} já existe.`);
  }
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor webhook rodando na porta ${PORT}`);
});
