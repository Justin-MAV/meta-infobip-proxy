export default function handler(req, res) {
  // Erlaubt Browser-Checks (CORS) ohne Preflight-Fehler
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({
    status: "ok",
    service: "meta-flow-healthcheck",
    method: req.method,
    time: new Date().toISOString()
  });
}
