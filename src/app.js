import express from "express";
import IndexRoute from "./routes/index.router.js";
import CartRoute from "./routes/cart.router.js";
import ProductsRoute from "./routes/products.router.js";
import __dirname from "./utils.js";
const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Carpeta static
app.use("/static", express.static(`${__dirname}/public`));

//Routes
app.use(IndexRoute);
app.use(CartRoute);
app.use(ProductsRoute);

app.listen(port, (req, res) => {
  console.log(`Server levantado sobre puerto: ${port}`);
});
