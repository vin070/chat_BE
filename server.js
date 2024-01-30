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
const ws = new WebSocketServer({ noServer: true, clientTracking: true });
ws.on("connection", function connection(conn, req) {
  const { headers } = req;
  addConn(headers["Authorization"], conn);

  conn.on("message", async function message(data) {
    data = JSON.parse(data);
    try {
      if (data.type == "MESSAGE") {
        await sendMessage(data);
      } else if (data.type == "REACTION") {
        await messageReaction(data);
      }
      conn.send("ACK");
    } catch (e) {
      conn.send(JSON.stringify({ type: "FAILED", error: e }));
    }
  });

  conn.on("close", () => {
    removeConn(
      clients[headers["Authorization"]],
      clients[headers["Authorization"]].length - 1
    );
  });
});

server.on("upgrade", async (request, socket, head) => {
  const { headers } = request;
  headers["Authorization"] = "1ea52749-1f3f-4bc3-95bb-0e1e1571bfc5";
  try {
    const query = `SELECT * FROM USERS WHERE id='${headers["Authorization"]}'`;
    const { rows } = await queryDatabase(query);
    if (!rows?.length) {
      throw new Error(
        "User is not authenticated while making socket connection"
      );
    }
    ws.handleUpgrade(request, socket, head, (conn) => {
      ws.emit("connection", conn, request);
    });
  } catch (e) {
    socket.destroy();
    return;
  }
});

server.listen(port, (_) => {
  init_database();
});
