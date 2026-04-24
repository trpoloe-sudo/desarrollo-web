const APP_NAME = process.env.ALERT_APP_NAME || "Ztar Tech";
const RESEND_API_URL = "https://api.resend.com/emails";
const WHATSAPP_API_VERSION = process.env.WHATSAPP_API_VERSION || "v22.0";

const ORDER_STATUS_LABELS = {
  pending: "Pendiente de coordinacion",
  payment_review: "Pago por verificar",
  paid: "Pago verificado",
  completed: "Completado",
  cancelled: "Cancelado",
};

const LEAD_STATUS_LABELS = {
  new: "Nueva",
  contacted: "Contactada",
  closed: "Cerrada",
};

const formatCurrency = (value) => `$${Number(value || 0).toFixed(2)}`;

const formatDateTime = (value) => {
  if (!value) {
    return "No disponible";
  }

  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const escapeHtml = (value) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const splitCsv = (value) =>
  String(value || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

const normalizePhone = (value) => String(value || "").replace(/[^\d]/g, "");

const buildHeaders = (extraHeaders = {}) => ({
  "content-type": "application/json",
  ...extraHeaders,
});

const postJson = async (url, payload, label, extraHeaders = {}) => {
  if (!url) {
    return false;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: buildHeaders(extraHeaders),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`[notifications] ${label} respondio ${response.status}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`[notifications] ${label} fallo:`, error);
    return false;
  }
};

const sendResendEmail = async ({ subject, text, html }) => {
  const apiKey = String(process.env.RESEND_API_KEY || "").trim();
  const from = String(process.env.RESEND_FROM_EMAIL || "").trim();
  const to = splitCsv(process.env.RESEND_TO_EMAIL);

  if (!apiKey || !from || to.length === 0) {
    return false;
  }

  return postJson(
    RESEND_API_URL,
    {
      from,
      to,
      subject,
      text,
      html,
    },
    "resend email",
    {
      Authorization: `Bearer ${apiKey}`,
    }
  );
};

const sendWhatsAppMessage = async (text) => {
  const accessToken = String(process.env.WHATSAPP_ACCESS_TOKEN || "").trim();
  const phoneNumberId = String(process.env.WHATSAPP_PHONE_NUMBER_ID || "").trim();
  const targetPhone = normalizePhone(process.env.WHATSAPP_ALERT_TO);

  if (!accessToken || !phoneNumberId || !targetPhone) {
    return false;
  }

  return postJson(
    `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${phoneNumberId}/messages`,
    {
      messaging_product: "whatsapp",
      to: targetPhone,
      type: "text",
      text: {
        preview_url: false,
        body: String(text || "").slice(0, 4096),
      },
    },
    "whatsapp cloud api",
    {
      Authorization: `Bearer ${accessToken}`,
    }
  );
};

const sendNotification = async ({
  event,
  subject,
  text,
  html,
  payload,
  webhookUrls = [],
}) => {
  const allWebhookUrls = [
    String(process.env.ALERT_WEBHOOK_URL || "").trim(),
    ...webhookUrls,
  ].filter(Boolean);

  const webhookPayload = {
    app: APP_NAME,
    event,
    subject,
    text,
    payload,
    createdAt: new Date().toISOString(),
  };

  await Promise.allSettled([
    sendResendEmail({ subject, text, html }),
    sendWhatsAppMessage(text),
    ...allWebhookUrls.map((url) =>
      postJson(url, webhookPayload, `webhook ${event}`)
    ),
  ]);
};

const toHtmlRows = (details) =>
  details
    .filter((detail) => detail?.value)
    .map(
      (detail) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#64748b;font-weight:600;">${escapeHtml(detail.label)}</td><td style="padding:6px 0;color:#0f172a;">${escapeHtml(detail.value)}</td></tr>`
    )
    .join("");

const formatAddress = (address) =>
  [
    address?.address,
    address?.city,
    address?.zip,
    address?.country,
  ]
    .filter(Boolean)
    .join(", ");

const buildOrderDetails = (order, user, previousStatus) => {
  const orderAddress = order?.billingAddress || {};
  const itemsText = Array.isArray(order?.items)
    ? order.items
        .map(
          (item) =>
            `- ${item.nombre} x${item.quantity} (${formatCurrency(Number(item.precio) * Number(item.quantity))})`
        )
        .join("\n")
    : "Sin productos";

  const details = [
    { label: "Pedido", value: order?.id },
    { label: "Cliente", value: user?.name || order?.userEmail },
    { label: "Email", value: order?.userEmail },
    { label: "Telefono", value: orderAddress.phone },
    { label: "Estado", value: ORDER_STATUS_LABELS[order?.status] || order?.status },
    previousStatus
      ? {
          label: "Estado anterior",
          value: ORDER_STATUS_LABELS[previousStatus] || previousStatus,
        }
      : null,
    { label: "Metodo de pago", value: order?.paymentMethod },
    { label: "Referencia", value: orderAddress.paymentReference },
    { label: "Total", value: formatCurrency(order?.total) },
    { label: "Fecha", value: formatDateTime(order?.createdAt) },
    { label: "Direccion", value: formatAddress(orderAddress) },
    { label: "Notas de pago", value: orderAddress.paymentNotes },
  ].filter(Boolean);

  return {
    text: [
      `${APP_NAME}`,
      "",
      ...details.map((detail) => `${detail.label}: ${detail.value}`),
      "",
      "Productos:",
      itemsText,
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;">
        <h2 style="margin:0 0 16px;">${escapeHtml(APP_NAME)}</h2>
        <table style="border-collapse:collapse;margin:0 0 16px;">
          ${toHtmlRows(details)}
        </table>
        <h3 style="margin:0 0 10px;">Productos</h3>
        <pre style="white-space:pre-wrap;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px;">${escapeHtml(
          itemsText
        )}</pre>
      </div>
    `,
    payload: {
      order,
      user,
      previousStatus: previousStatus || null,
    },
  };
};

const buildLeadDetails = (lead, previousStatus) => {
  const details = [
    { label: "Lead", value: lead?.id },
    { label: "Nombre", value: lead?.name },
    { label: "Telefono", value: lead?.phone },
    { label: "Empresa", value: lead?.company },
    { label: "Consulta", value: lead?.subject },
    { label: "Canal", value: lead?.source },
    { label: "Estado", value: LEAD_STATUS_LABELS[lead?.status] || lead?.status },
    previousStatus
      ? {
          label: "Estado anterior",
          value: LEAD_STATUS_LABELS[previousStatus] || previousStatus,
        }
      : null,
    { label: "Fecha", value: formatDateTime(lead?.createdAt) },
    { label: "Mensaje", value: lead?.message },
  ].filter(Boolean);

  return {
    text: [
      `${APP_NAME}`,
      "",
      ...details.map((detail) => `${detail.label}: ${detail.value}`),
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;">
        <h2 style="margin:0 0 16px;">${escapeHtml(APP_NAME)}</h2>
        <table style="border-collapse:collapse;">
          ${toHtmlRows(details)}
        </table>
      </div>
    `,
    payload: {
      lead,
      previousStatus: previousStatus || null,
    },
  };
};

export const notifyNewOrder = async (order, user) => {
  const details = buildOrderDetails(order, user);

  await sendNotification({
    event: "order.created",
    subject: `[${APP_NAME}] Nuevo pedido ${order?.id}`,
    text: details.text,
    html: details.html,
    payload: details.payload,
    webhookUrls: [String(process.env.ORDER_ALERT_WEBHOOK_URL || "").trim()],
  });
};

export const notifyOrderStatusChanged = async (order, user, previousStatus) => {
  const details = buildOrderDetails(order, user, previousStatus);

  await sendNotification({
    event: "order.status_changed",
    subject: `[${APP_NAME}] Pedido ${order?.id} actualizado a ${ORDER_STATUS_LABELS[order?.status] || order?.status}`,
    text: details.text,
    html: details.html,
    payload: details.payload,
    webhookUrls: [String(process.env.ORDER_ALERT_WEBHOOK_URL || "").trim()],
  });
};

export const notifyNewLead = async (lead) => {
  const details = buildLeadDetails(lead);

  await sendNotification({
    event: "lead.created",
    subject: `[${APP_NAME}] Nuevo lead ${lead?.subject || lead?.id}`,
    text: details.text,
    html: details.html,
    payload: details.payload,
    webhookUrls: [String(process.env.LEAD_ALERT_WEBHOOK_URL || "").trim()],
  });
};

export const notifyLeadStatusChanged = async (lead, previousStatus) => {
  const details = buildLeadDetails(lead, previousStatus);

  await sendNotification({
    event: "lead.status_changed",
    subject: `[${APP_NAME}] Lead ${lead?.id} actualizado a ${LEAD_STATUS_LABELS[lead?.status] || lead?.status}`,
    text: details.text,
    html: details.html,
    payload: details.payload,
    webhookUrls: [String(process.env.LEAD_ALERT_WEBHOOK_URL || "").trim()],
  });
};
