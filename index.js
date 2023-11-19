const express = require("express");
const cors=require("cors");
const mongoose = require("mongoose");
const { createProduct } = require("./controller/Product");
const productsRouters=require('./routes/Product')
const categoriesRouters=require('./routes/Category')
const brandsRouters=require('./routes/Brand')
const usersRouter=require('./routes/User')
const authRouter=require('./routes/Auth')
const cartRouter=require('./routes/Cart')
const orderRouter=require('./routes/Order')


const server = express();

// Middlewares
server.use(cors({
  exposedHeaders:['X-Total-Count']
}))
server.use(express.json()); // To parse req.body
server.use('/products',productsRouters.router)
server.use('/categories',categoriesRouters.router)
server.use('/brands',brandsRouters.router)
server.use('/users',usersRouter.router)
server.use('/auth',authRouter.router)
server.use('/cart',cartRouter.router)
server.use('/orders',orderRouter.router)


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

server.listen(8080, () => {
  console.log("Server started on port 8080");
});
