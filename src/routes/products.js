const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const filePath = path.join(__dirname, '../data/productos.json');

const getProducts = async () => {
  try {
    const data = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

router.get('/', async (req, res) => {
  const products = await getProducts();
  const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
  res.json(products.slice(0, limit));
});

router.get('/:pid', async (req, res) => {
  const products = await getProducts();
  const product = products.find(p => p.id === parseInt(req.params.pid));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

router.post('/', async (req, res) => {
  const products = await getProducts();
  const newProduct = {
    id: products.length + 1,
    ...req.body,
    status: true
  };
  products.push(newProduct);
  await fs.promises.writeFile(filePath, JSON.stringify(products, null, 2));
  res.status(201).json(newProduct);
});

router.put('/:pid', async (req, res) => {
  const products = await getProducts();
  const index = products.findIndex(p => p.id === parseInt(req.params.pid));
  if (index !== -1) {
    products[index] = { ...products[index], ...req.body };
    await fs.promises.writeFile(filePath, JSON.stringify(products, null, 2));
    res.json(products[index]);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

router.delete('/:pid', async (req, res) => {
  const products = await getProducts();
  const filteredProducts = products.filter(p => p.id !== parseInt(req.params.pid));
  await fs.promises.writeFile(filePath, JSON.stringify(filteredProducts, null, 2));
  res.json({ message: 'Producto eliminado' });
});

module.exports = router;
