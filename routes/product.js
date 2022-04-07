const { Router } = require("express");
const router = Router();
const generateProducts = require("../util/generateProductsRandom.faker");

router.get("/", (req, res) => {
  const products = generateProducts();
  res.status(200).send(products);
});

module.exports = router;
