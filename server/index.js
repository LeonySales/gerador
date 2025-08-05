import express from 'express';
import crypto from 'crypto';

const app = express();
const PORT = 8080;

// Middleware CRÍTICO: raw body para webhooks
app.use(express.raw({ type: 'application/json' }));

app.post('/webhook/kiwify', (req, res) => {
  try {
    // Log completo dos headers para debug
    console.log('📨 Headers recebidos:', req.headers);

    // Lê o header (case-insensitive)
    const signature = req.headers['x-kiwify-webhook-signature'] 
      || req.headers['X-Kiwify-Webhook-Signature'];

    if (!signature) {
      console.log('❌ ERRO: Header de assinatura não encontrado. Verifique:');
      console.log('1. Kiwify está enviando o header "X-Kiwify-Webhook-Signature"');
      console.log('2. Nenhum proxy (Nginx, Cloudflare) está removendo headers');
      return res.status(401).json({ error: 'Assinatura ausente' });
    }

    const rawBody = req.body.toString();
    const calculatedSignature = crypto
      .createHmac('sha256', process.env.WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

    // Comparação SEGURA (evita timing attacks)
    const isSignatureValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(calculatedSignature)
    );

    if (!isSignatureValid) {
      console.log('❌ Assinatura inválida. Verifique:');
      console.log('1. WEBHOOK_SECRET no .env = Secret no painel da Kiwify');
      console.log('2. O body não foi modificado por middlewares');
      return res.status(403).json({ error: 'Assinatura inválida' });
    }

    // Webhook válido!
    const payload = JSON.parse(rawBody);
    console.log('✅ Webhook processado:', payload.webhook_event_type);
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('💥 Erro crítico:', error);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Webhook rodando em http://localhost:${PORT}`);
});