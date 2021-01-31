const express = require("express");
const routes = express.Router();
const multer = require("./app/middlewares/multer");
const productController = require("./app/controllers/productController");

/*
HTTP Verbs
GET: Recebe
POST: Cria
PUT: Atualiza
DELETE: Deleta
*/

routes.get("/", function (req, res) {
  return res.render("layout.njk");
});

routes.get("/products/create", productController.create);
routes.get("/products/:id", productController.show);
routes.get("/products/:id/edit", productController.edit);

routes.post("/products", multer.array("photos", 6), productController.post);
routes.put("/products", multer.array("photos", 6), productController.put);

//Alias
routes.get("/ads/create", function (req, res) {
  return res.redirect("/products/create");
});

module.exports = routes;
