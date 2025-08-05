import 'dotenv/config';
import express from 'express';
import crypto from 'crypto';

const app = express();
const PORT = process.env.PORT || 8080;

// =============================================
// 1. CONFIGURAÇÃO INICIAL
// =============================================

// Middleware para capturar o body RAW (crucial para webhooks)
app.use(express.raw({ type: 'application/json' }));

// Health Check
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// =============================================
// 2. MIDDLEWARE DE LOGS (DEBUG COMPLETO)
// =============================================
app.use('/webhook/kiwify', (req, res, next) => {
  console.log('\n=== NOVA REQUISIÇÃO ===');
  console.log('🔵 Método:', req.method);
  console.log('🔵 URL:', req.originalUrl);
  console.log('🔵 Headers:', JSON.stringify(req.headers, null, 2));
  console.log('🔵 Body (200 primeiros caracteres):', req.body?.toString()?.substring(0, 200));
  next();
});

// =============================================
// 3. ROTA PRINCIPAL DO WEBHOOK
// =============================================
app.post('/webhook/kiwify', async (req, res) => {
  try {
    // Extrai a assinatura (com fallback para testes)
    const signature = 
      req.headers['x-kiwify-webhook-signature'] || 
      req.headers['X-Kiwify-Webhook-Signature'] ||
      process.env.TEST_SIGNATURE; // Apenas para desenvolvimento!

    if (!signature && process.env.NODE_ENV === 'production') {
      console.error('❌ ERRO CRÍTICO: Header de assinatura ausente');
      return res.status(401).json({ 
        error: 'Autenticação requerida',
        details: 'Header X-Kiwify-Webhook-Signature não encontrado'
      });
    }

    // Validação da assinatura
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
        calculada: calculatedSignature,
        secret_used: Boolean(process.env.WEBHOOK_SECRET)
      });
      return res.status(403).json({ 
        error: 'Acesso não autorizado',
        details: 'Assinatura do webhook inválida'
      });
    }

    // Processamento do payload
    const payload = JSON.parse(rawBody);
    console.log('✅ Webhook válido! Evento:', payload.webhook_event_type);

    // =============================================
    // 4. LÓGICA DE NEGÓCIO (EXEMPLO)
    // =============================================
    if (payload.order_status === 'paid') {
      console.log('💸 Pagamento aprovado para:', payload.customer?.email);
      // Adicione aqui sua lógica (ex: criar usuário, liberar acesso, etc.)
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('💥 ERRO INTERNO:', error);
    return res.status(500).json({ 
      error: 'Erro no servidor',
      details: error.message 
    });
  }
});

// =============================================
// 5. INICIALIZAÇÃO DO SERVIDOR
// =============================================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Servidor rodando na porta ${PORT}`);
  console.log('🔑 Webhook Secret:', process.env.WEBHOOK_SECRET ? '***' : 'NÃO CONFIGURADO!');
  console.log('🔧 Modo:', process.env.NODE_ENV || 'development');
});