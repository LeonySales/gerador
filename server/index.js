import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.post('/webhook/kiwify', async (req, res) => {
  // 1. Verifica assinatura da query
  const signature = req.query.signature;
  console.log('🔐 Assinatura recebida (query):', signature);

  const calculatedSignature = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');

  console.log('🔐 Assinatura calculada:', calculatedSignature);

  if (signature !== calculatedSignature) {
    console.log('❌ Assinatura inválida');
    return res.status(401).json({ error: 'Assinatura inválida' });
  }

  // 2. Verifica tipo de evento
  const { order_status, webhook_event_type, Customer } = req.body;

  if (order_status === 'paid' && webhook_event_type === 'order_approved') {
    const email = Customer?.email;
    if (!email) {
      return res.status(400).json({ error: 'Email não encontrado' });
    }

    await criarUsuarioSeNaoExistir(email);
  }

  return res.status(200).json({ ok: true });
});

async function criarUsuarioSeNaoExistir(email) {
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
    console.error('Erro ao listar usuários:', listError);
    return;
  }

  const existe = users?.users.find((u) => u.email === email);

  if (!existe) {
    const { error } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
    });

    if (error) console.error('❌ Erro ao criar usuário:', error);
    else console.log(`✅ Usuário ${email} criado com sucesso!`);
  } else {
    console.log(`ℹ️ Usuário ${email} já existe.`);
  }
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor webhook rodando na porta ${PORT}`);
});
