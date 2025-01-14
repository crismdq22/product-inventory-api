const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const authRoutes = require('../routes/auth');
const db = require('../db');

const app = express();
app.use(bodyParser.json());
app.use('/auth', authRoutes);

describe('Auth API', () => {
  beforeAll((done) => {
    db.addUser('testuser', 'testpassword', done);
  });

  afterAll((done) => {
    db.run('DELETE FROM users', done);
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({ username: 'newuser', password: 'newpassword' });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message', 'User registered successfully');
    });
  });

  describe('POST /auth/login', () => {
    it('should login an existing user', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ username: 'testuser', password: 'testpassword' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should return 401 for invalid credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ username: 'testuser', password: 'wrongpassword' });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error', 'Invalid username or password');
    });
  });

  describe('POST /auth/validate', () => {
    it('should validate a valid token', async () => {
      const token = jwt.sign({ id: 1, username: 'testuser' }, 'your_secret_key', { expiresIn: '1h' });

      const res = await request(app)
        .post('/auth/validate')
        .send({ token });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Token is valid');
    });

    it('should return 401 for an invalid token', async () => {
      const res = await request(app)
        .post('/auth/validate')
        .send({ token: 'invalidtoken' });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error', 'Invalid token');
    });
  });
});
