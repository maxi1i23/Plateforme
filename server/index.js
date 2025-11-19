// index.js
const http = require("http");
const app = require("./app");
const setupSocket = require("./socket");
const createDefaultAdmin = require("./function/createAdmin");

const port = process.env.PORT || 5000;
const server = http.createServer(app);

// Socket.IO branché ici
setupSocket(server);

server.listen(port, async () => {
  console.log(`Serveur démarré sur le port ${port}`);
  createDefaultAdmin();
});
