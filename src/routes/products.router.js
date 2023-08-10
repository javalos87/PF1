import { Router } from "express";
import fs from "fs";
import __dirname, { uploader } from "../utils.js";

const path = __dirname + "/productos.json";

const router = Router();

//Ruta raiz donde devuelve todos los productos
router.get("/api/products", async (req, res) => {
  let productos = await fs.promises.readFile(path, "utf-8");
  productos = await JSON.parse(productos);
  res.send({ status: "success", payload: productos });
});

//Ruta con params pid, donde devuelve el producto
router.get("/api/products/:pid", async (req, res) => {
  let pid = req.params.pid;
  let productos = await fs.promises.readFile(path, "utf-8");
  productos = await JSON.parse(productos);
  const index = productos.findIndex((e) => e.id == pid);
  if (index === -1) {
    return res
      .status(400)
      .send({ status: "error", error: "Producto no encontrado" });
  } else {
    res.send({ status: "success", payload: productos[index] });
  }
});

//Ruta para agregar productos si uso del midleware upload
/* router.post("/api/products", async (req, res) => {
  let product = req.body;
  if (
    !product.title ||
    !product.description ||
    !product.code ||
    !product.price ||
    !product.status ||
    !product.stock ||
    !product.category ||
    !product.thumbnails
  ) {
    return res
      .status(400)
      .send({ status: "error", error: "Valores incompletos" });
  }

  const productsFile = await fs.promises.readFile(path, "utf-8");

  let products = await JSON.parse(productsFile);

  products.length === 0
    ? (product.id = 1)
    : (product.id = products[products.length - 1].id + 1);

  products.push(product);
  await fs.promises.writeFile(path, JSON.stringify(products));

  res.send({ status: "success", message: "Se agrego el producto" });
}); */

router.put("/api/products/:pid", async (req, res) => {
  let pid = req.params.pid;
  let producto = req.body;
  producto.id = pid;
  let productos = await fs.promises.readFile(path, "utf-8");
  productos = await JSON.parse(productos);
  const index = productos.findIndex((e) => e.id == pid);

  if (index === -1) {
    return res
      .status(400)
      .send({ status: "error", error: "Producto no encontrado" });
  } else {
    productos[index] = producto;
    await fs.promises.writeFile(path, JSON.stringify(productos));
    res.send({
      status: "success",
      payload: productos[index],
      message: "Producto actualizado",
    });
  }
});

router.delete("/api/products/:pid", async (req, res) => {
  let pid = req.params.pid;
  let producto = req.body;
  producto.id = pid;
  let productos = await fs.promises.readFile(path, "utf-8");
  productos = await JSON.parse(productos);
  const index = productos.findIndex((e) => e.id == pid);

  if (index === -1) {
    return res
      .status(400)
      .send({ status: "error", error: "Producto no encontrado" });
  } else {
    res.send({
      status: "success",
      payload: productos[index],
      message: "Producto Eliminado",
    });
    productos.splice(index, 1);

    await fs.promises.writeFile(path, JSON.stringify(productos));
  }
});

//Ruta para agregar productos con el Uso de midleware Uploads
router.post("/api/products", uploader.array("thumbnails"), async (req, res) => {
  let files = req.files;
  if (!req.files) {
    return res
      .status(500)
      .send({ status: "error", error: "No se pudo guardar las imagenes" });
  }
  const arreglo = [];
  const thumbs = files.map((e) => {
    arreglo.push(e.path);
    return arreglo;
  });

  let product = req.body;
  console.log(product);
  if (
    !product.title ||
    !product.description ||
    !product.code ||
    !product.price ||
    !product.status ||
    !product.stock ||
    !product.category
  ) {
    return res.status(400).send({
      status: "error",
      error: "Valores incompletos",
      payload: product,
    });
  }
  product.thumbnails = arreglo;
  const productsFile = await fs.promises.readFile(path, "utf-8");
  let products = await JSON.parse(productsFile);
  products.length === 0
    ? (product.id = 1)
    : (product.id = products[products.length - 1].id + 1);
  products.push(product);
  await fs.promises.writeFile(path, JSON.stringify(products));
  res.send({
    status: "success",
    message: "Se agrego el producto",
    payload: product,
  });
});

export default router;
