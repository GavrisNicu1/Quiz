import http from "http";

import app from "./app";
import { env } from "./config/env";
import { initSocket } from "./services/socket";

const server = http.createServer(app);

initSocket(server);

const start = () => {
  server.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
};

start();
