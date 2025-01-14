const request = require('supertest');
const app = require('../server');
const db = require('../db');
const jwt = require('jsonwebtoken');

const secretKey = 'your_secret_key';

describe('Product CRUD operations', () => {
  let token;

  beforeAll((done) => {
    // Create a test user and get a token
    db.addUser('testuser', 'testpassword', (err) => {
      if (err) {
        return done(err);
      }
      request(app)
        .post('/auth/login')
        .send({ username: 'testuser', password: 'testpassword' })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          token = res.body.token;
          done();
        });
    });
  });

  afterAll((done) => {
    // Clean up the database
    db.run('DELETE FROM products', done);
  });

  test('should create a new product', (done) => {
    request(app)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Product',
        description: 'Test Description',
        price: 10.0,
        quantity: 100
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.message).toBe('Product created successfully');
      })
      .end(done);
  });

  test('should get all products', (done) => {
    request(app)
      .get('/products')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBeGreaterThan(0);
      })
      .end(done);
  });

  test('should get a single product', (done) => {
    db.addProduct('Test Product', 'Test Description', 10.0, 100, (err, id) => {
      if (err) {
        return done(err);
      }
      request(app)
        .get(`/products/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('Test Product');
        })
        .end(done);
    });
  });

  test('should update a product', (done) => {
    db.addProduct('Test Product', 'Test Description', 10.0, 100, (err, id) => {
      if (err) {
        return done(err);
      }
      request(app)
        .put(`/products/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Product',
          description: 'Updated Description',
          price: 20.0,
          quantity: 200
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toBe('Product updated successfully');
        })
        .end(done);
    });
  });

  test('should delete a product', (done) => {
    db.addProduct('Test Product', 'Test Description', 10.0, 100, (err, id) => {
      if (err) {
        return done(err);
      }
      request(app)
        .delete(`/products/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toBe('Product deleted successfully');
        })
        .end(done);
    });
  });
});

describe('Authentication middleware', () => {
  test('should return 403 if no token is provided', (done) => {
    request(app)
      .get('/products')
      .expect(403)
      .expect((res) => {
        expect(res.body.error).toBe('No token provided');
      })
      .end(done);
  });

  test('should return 401 if token is invalid', (done) => {
    request(app)
      .get('/products')
      .set('Authorization', 'Bearer invalidtoken')
      .expect(401)
      .expect((res) => {
        expect(res.body.error).toBe('Failed to authenticate token');
      })
      .end(done);
  });

  test('should pass if token is valid', (done) => {
    const token = jwt.sign({ id: 1, username: 'testuser' }, secretKey, { expiresIn: '1h' });
    request(app)
      .get('/products')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .end(done);
  });
});
