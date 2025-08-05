import 'dotenv/config';
import express from 'express';
import crypto from 'crypto';

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware para pegar o body RAW (DEVE ser o primeiro middleware!)
app.use(express.raw({ type: 'application/json' })); // Tipo explícito para JSON

app.post('/webhook/kiwify', (req, res) => {
  try {
    // Lê o header (case-insensitive)
    const signature = req.headers['x-kiwify-webhook-signature'] || req.headers['X-Kiwify-Webhook-Signature'];
    
    if (!signature) {
      console.log('❌ Header de assinatura não encontrado');
      return res.status(401).json({ error: 'Assinatura ausente' });
    }

    const rawBody = req.body.toString(); // Body como string
    console.log('🔐 Assinatura recebida (header):', signature);

    // Calcula a assinatura
    const calculatedSignature = crypto
      .createHmac('sha256', process.env.WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

    console.log('🔐 Assinatura calculada:', calculatedSignature);

    // Comparação SEGURA (evita timing attacks)
    const isSignatureValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(calculatedSignature)
    );

    if (!isSignatureValid) {
      console.log('❌ Assinatura inválida');
      return res.status(403).json({ error: 'Assinatura inválida' });
    }

    // Processa o webhook (assinaura válida)
    const payload = JSON.parse(rawBody);
    console.log('✅ Webhook válido! Evento:', payload.webhook_event_type);
    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error('Erro:', error);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor webhook rodando na porta ${PORT}`);
});