const startedAt = Date.now();

export const healthCheck = (req, res) => {
  const uptimeSeconds = Math.floor((Date.now() - startedAt) / 1000);
  res.status(200).json({
    ok: true,
    version: "1.0",
    uptime: uptimeSeconds
  });
};
