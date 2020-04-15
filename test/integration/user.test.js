const request = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { User } = require("../../model/user");

let server;
let objectId;
let token;
describe("/api/users", () => {
  beforeEach(async () => {
    server = require("../../index");
    objectId = mongoose.Types.ObjectId();

    const user = new User({
      email: "umarabanga78@gmail.com",
      password: "0201348856"
    });
    const salt = await bcrypt.genSalt(15);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    token = user.genAuthToken();
  });

  afterEach(async () => {
    await server.close();
    await User.remove({});
  });

  describe("post", () => {
    it("should return 400 if data provided is not valid", async () => {
      const res = await request(server).post("/api/user");
      expect(res.status).toBe(400);
    });

    it("should return 400 if user is already registered", async () => {
      const payload = { email: "umarabanga@gmail.com", password: "0201348856" };
      const user = new User(payload);
      await user.save();
      const res = await request(server)
        .post("/api/user")
        .send(payload);
      expect(res.status).toBe(400);
    });

    it("should return 200 if user is data is valid", async () => {
      const payload = { email: "umarabanga@gmail.com", password: "0201348856" };
      const res = await request(server)
        .post("/api/user")
        .send(payload);
      expect(res.status).toBe(200);
    });
  });

  describe("put", () => {
    const payload = {
      email: "umarabanga@gmail.com",
      password: "0201348856",
      phone: "0201348856",
      address: "pt789"
    };
    it("should return with status 401 if not logged in", async () => {
      const res = await request(server)
        .put(`/api/user/${objectId}`)
        .send(payload);
      expect(res.status).toBe(401);
    });

    it("should return with status 403 if not logged in", async () => {
      const res = await request(server)
        .put(`/api/user/${objectId}`)
        .set("x-auth-token", "ytyuqhu8771")
        .send(payload);
      expect(res.status).toBe(403);
    });
    it("should return with status 400 if objectid is not valid", async () => {
      objectId = "6w8uydfhjsidiosd";
      const res = await request(server)
        .put(`/api/user/${objectId}`)
        .set("x-auth-token", token)
        .send(payload);
      expect(res.status).toBe(400);
    });
    it("should return with status 400 if user is not available", async () => {
      const res = await request(server)
        .put(`/api/user/${objectId}`)
        .set("x-auth-token", token)
        .send(payload);
      expect(res.status).toBe(404);
    });
    it("should return with status 200 if user is available", async () => {
      const user = new User({
        email: "umarabanga@gmail.com",
        password: "0201348856"
      });
      await user.save();
      objectId = user._id;
      const res = await request(server)
        .put(`/api/user/${objectId}`)
        .set("x-auth-token", token)
        .send(payload);
      expect(res.status).toBe(200);
    });
  });
  describe("get", () => {
    it("should return with status 401 if not logged in", async () => {
      const res = await request(server).get("/api/user");
      expect(res.status).toBe(401);
    });
    it("should return with status 403 if logged in but not admin", async () => {
      const res = await request(server)
        .get("/api/user")
        .set("x-auth-token", token);
      expect(res.status).toBe(403);
    });
    it("should return with status 200 if logged in and admin", async () => {
      user = new User({
        email: "umar7367673",
        password: "ew78wyuew",
        isAdmin: true
      });
      token = user.genAuthToken();
      await user.save();
      const res = await request(server)
        .get("/api/user")
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty("email");
    });
  });

  describe("get/:d", () => {
    it("should return status 401 if not logged in", async () => {
      const res = await request(server).get(`/api/user/${objectId}`);
      expect(res.status).toBe(401);
    });
    it("should return status 403 if logged in but not admin", async () => {
      const res = await request(server)
        .get(`/api/user/${objectId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(403);
    });
    it("should return status 400 if logged in and admin but invalid id", async () => {
      token = new User({ isAdmin: true }).genAuthToken();
      objectId = "63728uy8sr";
      const res = await request(server)
        .get(`/api/user/${objectId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(400);
    });
    it("should return status 404 if logged in and admin but user doesn't exist", async () => {
      token = new User({ isAdmin: true }).genAuthToken();
      const res = await request(server)
        .get(`/api/user/${objectId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(404);
    });
    it("should return status 200 if logged in and admin and user exist", async () => {
      const user = new User({
        email: "632yueyuyhuas",
        password: "ytyewtyew",
        isAdmin: true
      });
      token = user.genAuthToken();
      await user.save();
      objectId = user._id;
      const res = await request(server)
        .get(`/api/user/${objectId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("email", "632yueyuyhuas");
    });
  });

  describe("delete", () => {
    it("should return with status 401 if not logged in", async () => {
      const res = await request(server).delete(`/api/user/${objectId}`);
      expect(res.status).toBe(401);
    });
    it("should return with status 403 if logged in but not admin", async () => {
      const res = await request(server)
        .delete(`/api/user/${objectId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(403);
    });

    it("should return with status 400 if logged in and admin but objectid not valid", async () => {
      token = new User({ isAdmin: true }).genAuthToken();
      objectId = "gdghgdf";
      const res = await request(server)
        .delete(`/api/user/${objectId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(400);
    });
    it("should return with status 404 if logged in and admin but user not available", async () => {
      token = new User({ isAdmin: true }).genAuthToken();
      const res = await request(server)
        .delete(`/api/user/${objectId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(404);
    });
    it("should return with status 200 if logged in and admin and user available", async () => {
      const user = new User({
        email: "udsghghds",
        password: "gsdhhjsd",
        isAdmin: true
      });
      token = user.genAuthToken();
      await user.save();
      objectId = user._id;
      const res = await request(server)
        .delete(`/api/user/${objectId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
    });
  });

  describe("/login", () => {
    it("should return 400 if email is not provided", async () => {
      const res = await request(server)
        .post("/api/user/login")
        .send({ password: "0201348856" });
      expect(res.status).toBe(400);
    });
    it("should return 400 if password is not provided", async () => {
      const res = await request(server)
        .post("/api/user/login")
        .send({ email: "umarabanga78@gmail.com" });
      expect(res.status).toBe(400);
    });
    it("should return 400 if user is not present", async () => {
      const res = await request(server)
        .post("/api/user/login")
        .send({ email: "umarabanga781@gmail.com", password: "0201348856" });
      expect(res.status).toBe(400);
    });
    it("should return 400 if password is incorrect", async () => {
      const res = await request(server)
        .post("/api/user/login")
        .send({ email: "umarabanga78@gmail.com", password: "0201348856123" });
      expect(res.status).toBe(400);
    });
    it("should return 200 if login credentials correct", async () => {
      const res = await request(server)
        .post("/api/user/login")
        .send({ email: "umarabanga78@gmail.com", password: "0201348856" });
      expect(res.status).toBe(200);
    });
  });
  //
  describe("/confirm", () => {
    it("should return with status 400 if data posted is invalid", async () => {
      const res = await request(server)
        .post("/api/user/confirm")
        .send({});
      expect(res.status).toBe(400);
    });
    // it("should return with status 200 if data posted is valid", async () => {
    //   const res = await request(server)
    //     .post("/api/user/confirm")
    //     .send({
    //       html: "https://localhost:3000/signup?uid=umarabanga78@gmail.com",
    //       email: "matroodzak78@gmail.com"
    //     });
    //   expect(res.status).toBe(200);
    // });
  });

  describe("/profile/me", () => {
    it("should return with status 401 if not logged in", async () => {
      const res = await request(server).get("/api/user/profile/me");
      expect(res.status).toBe(401);
    });
    it("should return with status 200 if logged in", async () => {
      const res = await request(server)
        .get("/api/user/profile/me")
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
    });
  });
});
