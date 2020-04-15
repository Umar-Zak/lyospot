const request = require("supertest");
const mongoose = require("mongoose");
const { User } = require("../../model/user");
const { Wishlist } = require("../../model/wishlist");

let objectId;
let server;
let wishlist;
let payload;
let token;
let user;
describe("/api/wishlist", () => {
  beforeEach(async () => {
    server = require("../../index");
    objectId = mongoose.Types.ObjectId();
    user = new User({
      email: "umarabanga78@gmail.com",
      password: "0201348856"
    });
    await user.save();
    token = user.genAuthToken();
    wishlist = new Wishlist({
      user: {
        _id: user._id,
        email: "umarabanga78@gamil.com"
      },
      product: {
        name: "mypro",
        price: 12,
        quantity: 45,
        store: {
          _id: objectId,
          name: "mystore"
        },
        category: {
          _id: objectId,
          title: "mycat"
        },
        shipping: {
          _id: objectId,
          type: "domestic"
        },
        description: "mydesc",
        profile1: "pro1",
        profile2: "pro2",
        profile3: "pro3",
        profile4: "pro4"
      }
    });
    await wishlist.save();
    payload = {
      useremail: "umarabanga78@gmail.com",
      product: {
        name: "mypro",
        price: 12,
        quantity: 45,
        store: {
          _id: objectId,
          name: "mystore"
        },
        category: {
          _id: objectId,
          title: "mycat"
        },
        shipping: {
          _id: objectId,
          type: "domestic"
        },
        description: "mydesc",
        profile1: "pro1",
        profile2: "pro2",
        profile3: "pro3",
        profile4: "pro4"
      }
    };
  });

  afterEach(async () => {
    await server.close();
    await Wishlist.remove({});
    await User.remove({});
  });

  describe("get", () => {
    it("should return with status 401 if not logged in", async () => {
      const res = await request(server).get("/api/wishlists");
      expect(res.status).toBe(401);
    });
    it("should return with status 403 if  logged in but not an admin", async () => {
      const res = await request(server)
        .get("/api/wishlists")
        .set("x-auth-token", token);
      expect(res.status).toBe(403);
    });
    it("should return with status 200 if  logged inand an admin", async () => {
      token = new User({ isAdmin: true }).genAuthToken();
      const res = await request(server)
        .get("/api/wishlists")
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
    });
  });

  describe("get/:id", () => {
    it("should return with status 401 if not logged in", async () => {
      const res = await request(server).get(`/api/wishlists/${objectId}`);
      expect(res.status).toBe(401);
    });
    it("should return with status 400 if  logged in but objectid invalid", async () => {
      objectId = "63gdhje";
      const res = await request(server)
        .get(`/api/wishlists/${objectId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(400);
    });
    it("should return with status 404 if  logged in but wishlist not available", async () => {
      const res = await request(server)
        .get(`/api/wishlists/${objectId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(404);
    });
    it("should return with status 200 if  logged in and wishlist available", async () => {
      objectId = wishlist._id;
      const res = await request(server)
        .get(`/api/wishlists/${objectId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
    });
  });

  describe("delete/:id", () => {
    it("should return with status 401 if not logged in", async () => {
      const res = await request(server).delete(`/api/wishlists/${objectId}`);
      expect(res.status).toBe(401);
    });
    it("should return with status 400 if  logged in but objectid not valid", async () => {
      objectId = "564yduue";
      const res = await request(server)
        .delete(`/api/wishlists/${objectId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(400);
    });
    it("should return with status 404 if  logged in but wishlist not found", async () => {
      const res = await request(server)
        .delete(`/api/wishlists/${objectId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(404);
    });
    it("should return with status 200 if  logged in and wishlist found", async () => {
      objectId = wishlist._id;
      const res = await request(server)
        .delete(`/api/wishlists/${objectId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
    });
  });

  describe("post", () => {
    it("should return with status 401 if not logged in", async () => {
      const res = await request(server)
        .post("/api/wishlists")
        .send(payload);
      expect(res.status).toBe(401);
    });
    it("should return with status 404 if  logged in user not available", async () => {
      payload.useremail = "umar@gmail.com";
      const res = await request(server)
        .post("/api/wishlists")
        .set("x-auth-token", token)
        .send(payload);
      expect(res.status).toBe(404);
    });
    it("should return with status 200 if  logged in and valid data posted", async () => {
      const res = await request(server)
        .post("/api/wishlists")
        .set("x-auth-token", token)
        .send(payload);
      expect(res.status).toBe(200);
    });
  });

  describe("get/user/:id", () => {
    it("should return with status 401 if not logged in", async () => {
      const res = await request(server).get(`/api/wishlists/user/${objectId}`);
      expect(res.status).toBe(401);
    });
    it("should return with status 400 if logged in but objectid not valid", async () => {
      objectId = "6eyyey78";
      const res = await request(server)
        .get(`/api/wishlists/user/${objectId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(400);
    });
    it("should return with status 404 if logged in but wishlist not available", async () => {
      const res = await request(server)
        .get(`/api/wishlists/user/${objectId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(404);
    });
    it("should return with status 200 if logged in and wishlists available", async () => {
      objectId = user._id;
      const res = await request(server)
        .get(`/api/wishlists/user/${objectId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
    });
  });
});
