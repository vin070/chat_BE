const { WebSocket } = require("ws");
const { port } = require("../config/config");
const request = require("supertest");
const app = require("../app");

function waitForSocketState(socket, state) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      if (socket.readyState === state) {
        resolve();
      } else {
        waitForSocketState(socket, state).then(resolve);
      }
    }, 5);
  });
}

describe("WebSocket Server", () => {
  test("Server echoes the message it receives from client", async () => {
    const { body: user1 } = await request(app)
      .post("/api/v1/user/create")
      .send({
        password: "12345",
        name: "Vineet Kumar",
        email: `jauboitanetra-${Math.random() * 10000}@yopmail.com`,
        phone_no: "+911234567890",
      });

    //Create user 2
    const { body: user2 } = await request(app)
      .post("/api/v1/user/create")
      .send({
        password: "12345",
        name: "Vineet Kumar",
        email: `jauboitanetra-${Math.random() * 10000}@yopmail.com`,
        phone_no: "+911234567890",
      });

    const { body, statusCode } = await request(app)
      .post("/api/v1/group/create")
      .send({
        name: "Test group",
        userID: user1.data.id,
        membersID: [user1.data.id, user2.data.id],
      });
    expect(statusCode).toBe(200);
    expect(body.hasOwnProperty("data")).toBe(true);

    // Create test client
    const client = new WebSocket(`ws://localhost:${port}`);
    await waitForSocketState(client, client.OPEN);

    client.send(
      JSON.stringify({
        type: "INIT",
        id: user1.data.id,
      })
    );

    let message = "nodeJS assignment";
    let received_message;
    client.send(
      JSON.stringify({
        type: "MESSAGE",
        groupID: body.data,
        message: message,
        time: new Date().toISOString(),
        senderID: user1.data.id,
      })
    );
    client.on("message", (data) => {
      data = JSON.parse(data);
      if (data.type === "MESSAGE") {
        received_message = data.message;
        client.close();
      }
    });

    // Perform assertions on the response
    await waitForSocketState(client, client.CLOSED);
    expect(received_message).toBe(message);
  });
});
