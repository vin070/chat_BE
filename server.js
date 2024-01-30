const http = require("http");
const app = require("./src/app");
const { port } = require("./src/config/config");
const init_database = require("./src/database_init");
const { WebSocketServer } = require("ws");
const { queryDatabase } = require("./src/utils/utils");
const { messageReaction } = require("./src/reaction/controller");
const { sendMessage } = require("./src/message/controller");
const { addConn, removeConn, clients } = require("./src/connected_client");
const server = http.createServer(app);

//Websocket
const ws = new WebSocketServer({ server, clientTracking: false });

ws.on("connection", function connection(conn, req) {
  let id;
  conn.on("message", async function message(data) {
    data = JSON.parse(data);
    try {
      if (data.type == "MESSAGE") {
        await sendMessage(data);
        conn.send(JSON.stringify({type: 'ACK'}));
      } else if (data.type == "REACTION") {
        await messageReaction(data);
        conn.send(JSON.stringify({type: 'ACK'}));
      } else if (data.type === "INIT") {
        id = data.id;
        const query = `SELECT * FROM USERS WHERE id='${data["id"]}'`;
        const { rows } = await queryDatabase(query);
        if (!rows?.length) {
          conn.close();
        } else {
          addConn(data.id, conn);
        }
      }
    } catch (e) {
      conn.send(JSON.stringify({ type: "FAILED", error: e }));
    }
  });

  conn.on("close", () => {
    removeConn(
      clients[id],
      clients[id].length - 1
    );
  });
});

server.listen(port, (_) => {
  init_database();
});
