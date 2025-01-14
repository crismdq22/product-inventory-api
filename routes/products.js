const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.post('/', (req, res) => {
  const { name, description, price, quantity } = req.body;
  db.addProduct(name, description, price, quantity, (err, id) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to create product' });
    }
    res.status(201).json({ message: 'Product created successfully', id });
  });
});

router.get('/', (req, res) => {
  db.getAllProducts((err, products) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve products' });
    }
    res.status(200).json(products);
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.getProduct(id, (err, product) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve product' });
    }
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity } = req.body;
  db.updateProduct(id, name, description, price, quantity, (err, changes) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update product' });
    }
    if (changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ message: 'Product updated successfully' });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.deleteProduct(id, (err, changes) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete product' });
    }
    if (changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  });
});

module.exports = router;
