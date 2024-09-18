const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const filePath = path.join(__dirname, '../data/carrito.json');

const getCarts = async () => {
  try {
    const data = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

router.post('/', async (req, res) => {
  const carts = await getCarts();
  const newCart = {
    id: carts.length + 1,
    products: []
  };
  carts.push(newCart);
  await fs.promises.writeFile(filePath, JSON.stringify(carts, null, 2));
  res.status(201).json(newCart);
});

router.get('/:cid', async (req, res) => {
  const carts = await getCarts();
  const cart = carts.find(c => c.id === parseInt(req.params.cid));
  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  const carts = await getCarts();
  const cart = carts.find(c => c.id === parseInt(req.params.cid));

  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  const existingProduct = cart.products.find(p => p.product === parseInt(req.params.pid));

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.products.push({
      product: parseInt(req.params.pid),
      quantity: 1
    });
  }

  await fs.promises.writeFile(filePath, JSON.stringify(carts, null, 2));
  res.json(cart);
});

module.exports = router;
