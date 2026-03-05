import { readFileSync } from "node:fs";
import { createServer } from "node:https";
import next from "next";

const hostname = "0.0.0.0";
const port = Number(process.env.NEXT_PORT ?? 3443);
const sslKeyPath = process.env.SSL_KEY_PATH ?? "/etc/ssl/private/next.key";
const sslCertPath = process.env.SSL_CERT_PATH ?? "/etc/ssl/certs/next.crt";

const app = next({
  dev: false,
  hostname,
  port,
});
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = createServer(
      {
        key: readFileSync(sslKeyPath),
        cert: readFileSync(sslCertPath),
      },
      (req, res) => handle(req, res),
    );

    server.listen(port, hostname, () => {
      console.log(`[NEXT] HTTPS listo en https://${hostname}:${port}`);
    });
  })
  .catch((error) => {
    console.error("[NEXT] Error al iniciar servidor HTTPS:", error);
    process.exit(1);
  });
