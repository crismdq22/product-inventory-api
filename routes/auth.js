const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../db');
const router = express.Router();

const secretKey = 'your_secret_key';

router.post('/register', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.addUser(username, hashedPassword, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to register user' });
    }
    res.status(201).json({ message: 'User registered successfully' });
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.getUserByUsername(username, (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to login' });
    }
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
    res.status(200).json({ token });
  });
});

router.post('/validate', (req, res) => {
  const { token } = req.body;

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(200).json({ message: 'Token is valid', decoded });
  });
});

module.exports = router;
