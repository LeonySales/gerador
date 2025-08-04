app.post("/webhook/kiwify", async (req, res) => {
  // LOG PARA VER O QUE ESTÁ VINDO
  console.log("Webhook recebido:", req.body);

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
