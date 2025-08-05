import 'dotenv/config';
import express from 'express';
import crypto from 'crypto';

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware CRÍTICO - Deve ser o PRIMEIRO a processar a requisição
app.use(express.raw({ type: 'application/json' }));

// Rota do Webhook
app.post('/webhook/kiwify', async (req, res) => {
  try {
    // 1. Log completo para debug (headers + body)
    console.log('\n=== NOVA REQUISIÇÃO ===');
    console.log('📨 Headers:', JSON.stringify(req.headers, null, 2));
    console.log('📦 Body (raw):', req.body.toString().substring(0, 200) + '...');

    // 2. Extrai a assinatura (case-insensitive)
    const signature = 
      req.headers['x-kiwify-webhook-signature'] || 
      req.headers['X-Kiwify-Webhook-Signature'];

    if (!signature) {
      console.error('❌ ERRO: Header de assinatura não encontrado');
      return res.status(401).json({ 
        error: 'Header X-Kiwify-Webhook-Signature ausente',
        debug: { headers: req.headers } 
      });
    }

    // 3. Validação da assinatura
    const rawBody = req.body.toString();
    const calculatedSignature = crypto
      .createHmac('sha256', process.env.WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

    // Comparação segura contra timing attacks
    const isSignatureValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(calculatedSignature)
    );

    if (!isSignatureValid) {
      console.error('❌ Assinatura inválida', {
        recebida: signature,
        calculada: calculatedSignature
      });
      return res.status(403).json({ 
        error: 'Assinatura inválida',
        debug: {
          secret_used: Boolean(process.env.WEBHOOK_SECRET),
          body_length: rawBody.length
        }
      });
    }

    // 4. Processamento do payload (só executa se a assinatura for válida)
    const payload = JSON.parse(rawBody);
    console.log('✅ Webhook válido! Evento:', payload.webhook_event_type);

    // === SEU CÓDIGO DE PROCESSAMENTO AQUI ===
    // Exemplo:
    if (payload.order_status === 'paid') {
      console.log('💸 Pagamento aprovado para:', payload.customer?.email);
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('💥 ERRO CRÍTICO:', error);
    return res.status(500).json({ 
      error: 'Erro interno',
      details: error.message 
    });
  }
});

// Health Check
app.get('/', (req, res) => {
  res.send('Webhook operacional - ' + new Date().toISOString());
});

// Inicia o servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Webhook rodando na porta ${PORT}`);
  console.log('🔑 Webhook Secret:', Boolean(process.env.WEBHOOK_SECRET) ? '***' : 'NÃO CONFIGURADO!');
});