const request = require("supertest");
const app = require("../app");

describe("Chat Group module", () => {
  let groupID;
  let memberID;
  let adminID;

  it("Create group with some members", async () => {
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
    groupID = body.data;
    adminID = user1.data.id;
  });

  it("Add member to group", async () => {
    const { body: user1 } = await request(app)
      .post("/api/v1/user/create")
      .send({
        password: "12345",
        name: "Vineet Kumar",
        email: `jauboitanetra-${Math.random() * 10000}@yopmail.com`,
        phone_no: "+911234567890",
      });

    const { statusCode } = await request(app)
      .post("/api/v1/group/add_member")
      .send({
        groupID,
        userID: adminID,
        memberID: user1.data.id,
        role: "NORMAL",
      });
    expect(statusCode).toBe(200);
    memberID = user1.data.id;
  });

  it("Add existing member to group", async () => {
    const { statusCode } = await request(app)
      .post("/api/v1/group/add_member")
      .send({
        groupID,
        memberID,
        userID: adminID,
        role: "NORMAL",
      });
    expect(statusCode).toBe(500);
  });

  it("Get group list", async () => {
    const { statusCode, body } = await request(app).get(
      `/api/v1/group/search?limit=${10}&offset=${0}&query=${""}`
    );
    expect(statusCode).toBe(200);
    expect(body.data).toBeInstanceOf(Array);
  });
});
