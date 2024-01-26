const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { createProduct } = require("./controller/Product");
const productsRouters = require("./routes/Product");
const categoriesRouters = require("./routes/Category");
const brandsRouters = require("./routes/Brand");
const usersRouter = require("./routes/User");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const orderRouter = require("./routes/Order");

//
const session = require("express-session");
const passport = require("passport");
const { User } = require("./model/User");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const { isAuth, sanitizeUser } = require("./services/common");

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const SECRET_KEY = "SECRET_KEY";

//
const server = express();

//

//JWT options
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET_KEY;
//
//passport stratagies
server.use(
  session({
    secret: "keyboard cat",
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    // store: new SQLiteStore({ db: "sessions.db", dir: "./var/db" }),
  })
);
server.use(passport.authenticate("session"));

passport.use(
  "local",
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await User.findOne({ email: username }).exec();
      if (!user) {
        done(null, false, { message: "invalid credentials" });
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashPassword) {
          if (!crypto.timingSafeEqual(user.password, hashPassword)) {
            done(null, false, { message: "invalid credentials" });
          } else {
            const token = jwt.sign(sanitizeUser(user), SECRET_KEY); ///sign -> first argument is payload and second is secret key
            done(null, token);
          }
        }
      );
    } catch (err) {
      done(err);
    }
  })
);
//jwt starategies
passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    console.log("jwt payload", { jwt_payload });
    try {
      const user = await User.findOne({ id: jwt_payload.sub });
      if (user) {
        return done(null, sanitizeUser(user));
      } else {
        return done(null, false);
      }
    } catch (err) {}
  })
);
//this create session variable req.user on being called from callback
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      role: user.role,
    });
  });
});
//this create session variable req.user when called authroized request
passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});
//
// Middlewares
server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);
server.use(express.json()); // To parse req.body
server.use("/products", isAuth(), productsRouters.router);
server.use("/categories", isAuth(), categoriesRouters.router);
server.use("/brands", isAuth(), brandsRouters.router);
server.use("/users", isAuth(), usersRouter.router);
server.use("/auth", authRouter.router);
server.use("/cart", isAuth(), cartRouter.router);
server.use("/orders", isAuth(), orderRouter.router);
// server.use("/auth/login", authRouter.router);
const mongoURI =
  "mongodb+srv://jagtapsumit668:k9twuiN9AjhRZlro@cluster0.tz6fwxx.mongodb.net/e-commerce";

const connectToMongo = () => {
  mongoose
    .connect(mongoURI)
    .then(() => {
      console.log("Connected to MongoDB Successful");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
};

connectToMongo();

server.get("/", (req, res) => {
  res.json({ status: "success" });
});
server.use("/products", createProduct);
//

//
server.listen(8080, () => {
  console.log("Server started on port 8080");
});
