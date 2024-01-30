const request = require("supertest");
const app = require("../app");

describe("User module", () => {
  let user_id;
  let username;
  let password;

  it("Create user", async () => {
    username = `jauboitanetra-${Math.random() * 10000}@yopmail.com`;
    password = "123456";

    const payload = {
      password,
      name: "Vineet Kumar",
      email: username,
      phone_no: "+911234567890",
    };
    const response = await request(app)
      .post("/api/v1/user/create")
      .send(payload);
    const { body, statusCode } = response;
    expect(statusCode).toBe(200);
    expect(body.data.hasOwnProperty("name")).toBe(true);
    expect(body.data.hasOwnProperty("email")).toBe(true);
    expect(body.data.hasOwnProperty("created_at")).toBe(true);
    expect(body.data.hasOwnProperty("phone_no")).toBe(true);
    expect(body.data.hasOwnProperty("id")).toBe(true);
    expect(body.data.hasOwnProperty("password")).toBe(false);
  });

  it("Login user", async () => {
    const payload = {
      username,
      password,
    };
    const response = await request(app)
      .post("/api/v1/user/login")
      .send(payload);
    const { body, statusCode } = response;
    expect(statusCode).toBe(200);
    expect(body.data.hasOwnProperty("id")).toBe(true);
    expect(body.data.hasOwnProperty("name")).toBe(true);
    expect(body.data.hasOwnProperty("email")).toBe(true);
    expect(body.data.hasOwnProperty("password")).toBe(false);
    expect(body.data.hasOwnProperty("created_at")).toBe(true);
    expect(body.data.hasOwnProperty("phone_no")).toBe(true);
    expect(body.data.hasOwnProperty("updated_at")).toBe(true);
    user_id = body.data.id;
  });

  it("Update user", async () => {
    const payload = {
      password,
      email: username,
      name: "Vineet Kumar",
      phone_no: "+911234567890",
    };
    const response = await request(app)
      .patch(`/api/v1/user/${user_id}`)
      .send(payload);
    const { body, statusCode } = response;
    expect(statusCode).toBe(200);
    expect(body.data.hasOwnProperty("name")).toBe(true);
    expect(body.data.hasOwnProperty("email")).toBe(true);
    expect(body.data.hasOwnProperty("updated_at")).toBe(true);
    expect(body.data.hasOwnProperty("phone_no")).toBe(true);
    expect(body.data.hasOwnProperty("password")).toBe(false);
  });

  it("Get specific users details", async () => {
    const { statusCode, body } = await request(app).get(
      `/api/v1/user/${user_id}`
    );
    expect(statusCode).toBe(200);
    expect(body.data.hasOwnProperty("id")).toBe(true);
    expect(body.data.hasOwnProperty("name")).toBe(true);
    expect(body.data.hasOwnProperty("email")).toBe(true);
    expect(body.data.hasOwnProperty("password")).toBe(false);
    expect(body.data.hasOwnProperty("created_at")).toBe(true);
    expect(body.data.hasOwnProperty("phone_no")).toBe(true);
    expect(body.data.hasOwnProperty("updated_at")).toBe(true);
  });

  it("Get all users list with pagination", async () => {
    const { statusCode, body } = await request(app).get(
      `/api/v1/user/list?limit=${10}&offset=${0}`
    );
    expect(statusCode).toBe(200);
    expect(body.data).toBeInstanceOf(Array);
  });

  it("Logout user", async () => {
    const payload = {
      id: user_id,
    };
    const response = await request(app)
      .post("/api/v1/user/logout")
      .send(payload);
    const { statusCode } = response;
    expect(statusCode).toBe(200);
    id = null;
    username = null;
    password = null;
  });
});
