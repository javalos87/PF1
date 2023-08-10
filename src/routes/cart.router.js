import { Router } from "express";
import fs from "fs";
import __dirname from "../utils.js";

const path = __dirname + "/carritos.json";
const router = Router();

//Ruta raiz donde devuelve todos los productos
router.get("/api/carts", async (req, res) => {
  let productos = await fs.promises.readFile(path, "utf-8");
  productos = await JSON.parse(productos);
  res.send({ status: "success", payload: productos });
});

//Ruta con params pid, donde devuelve el carrito
router.get("/api/carts/:cid", async (req, res) => {
  let cid = req.params.cid;
  let carritos = await fs.promises.readFile(path, "utf-8");
  carritos = await JSON.parse(carritos);
  const index = carritos.findIndex((e) => e.id == cid);

  if (index === -1) {
    return res
      .status(400)
      .send({ status: "error", error: "Carrito no encontrado" });
  } else {
    res.send({ status: "success", payload: carritos[index] });
  }
});

//Ruta para agregar carritos
router.post("/api/carts", async (req, res) => {
  const cartsFile = await fs.promises.readFile(path, "utf-8");
  let cart = { products: [] };
  let carts = await JSON.parse(cartsFile);
  carts.length === 0
    ? (cart.id = 1)
    : (cart.id = carts[carts.length - 1].id + 1);
  carts.push(cart);
  await fs.promises.writeFile(path, JSON.stringify(carts));
  res.send({
    status: "success",
    message: "Se agrego el carrito",
    payload: cart,
  });
});

router.post("/api/carts/:cid/products/:pid", async (req, res) => {
  let cid = req.params.cid;
  let carritos = await fs.promises.readFile(path, "utf-8");
  carritos = await JSON.parse(carritos);
  const index = carritos.findIndex((e) => e.id == cid);

  // si no existe el cid se termina y devuelve 400
  if (index === -1) {
    return res
      .status(400)
      .send({ status: "error", error: "Carrito no encontrado" });
  }
  // si cid existe -> chequear si existe el pid-> Si existe aumentar en 1 el quantity -> Sino agregar push un nuevo objecto al arreglo
  //const newProd = carritos[cid].products;

  const indexPid = carritos[index].products.findIndex(
    (e) => e.id === req.params.pid
  );

  // si no existe el producto en el carrito se agrega el producto
  if (indexPid === -1) {
    let product = { id: req.params.pid, quantity: 1 };
    carritos[index].products.push(product);
    await fs.promises.writeFile(path, JSON.stringify(carritos));
    return res.send({
      status: "success",
      message: "El producto se agrego al carrito",
      payload: carritos[index],
    });
  } else {
    ++carritos[index].products[indexPid].quantity;
    await fs.promises.writeFile(path, JSON.stringify(carritos));
    res.send({ status: "success", payload: carritos[index] });
  }
});

export default router;
