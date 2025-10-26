export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ status: "error", message: "Method Not Allowed" });
    }

    const { to, text, templateName, templateLanguage = "de", placeholders = [] } = req.body || {};

    const BASE = process.env.INFOBIP_BASE;
    const APIKEY = process.env.INFOBIP_API_KEY;
    const FROM = process.env.INFOBIP_WHATSAPP_FROM;

    const isTemplate = Boolean(templateName);
    const url = isTemplate
      ? `${BASE}/whatsapp/1/message/template`
      : `${BASE}/whatsapp/1/message/text`;

    const body = isTemplate
      ? {
          from: FROM,
          to: String(to).replace(/^\+/, ""),
          messageId: templateName,
          language: templateLanguage,
          templateData: { body: { placeholders } }
        }
      : {
          from: FROM,
          to: String(to).replace(/^\+/, ""),
          content: { text: text || "Autobewertung gestartet." }
        };

    const r = await fetch(url, {
      method: "POST",
      headers: { Authorization: `App ${APIKEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await r.json();

    return res.status(200).json({
      status: "ok",
      provider: "infobip",
      messageId: data?.messages?.[0]?.messageId ?? null,
      providerStatus: data?.messages?.[0]?.status ?? null
    });
  } catch (e) {
    return res.status(200).json({ status: "error", error: String(e) });
  }
}
