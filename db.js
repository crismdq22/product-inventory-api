const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL
  )`);
});

const addProduct = (name, description, price, quantity, callback) => {
  const stmt = db.prepare('INSERT INTO products (name, description, price, quantity) VALUES (?, ?, ?, ?)');
  stmt.run(name, description, price, quantity, function (err) {
    callback(err, this.lastID);
  });
  stmt.finalize();
};

const getProduct = (id, callback) => {
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    callback(err, row);
  });
};

const getAllProducts = (callback) => {
  db.all('SELECT * FROM products', (err, rows) => {
    callback(err, rows);
  });
};

const updateProduct = (id, name, description, price, quantity, callback) => {
  const stmt = db.prepare('UPDATE products SET name = ?, description = ?, price = ?, quantity = ? WHERE id = ?');
  stmt.run(name, description, price, quantity, id, function (err) {
    callback(err, this.changes);
  });
  stmt.finalize();
};

const deleteProduct = (id, callback) => {
  const stmt = db.prepare('DELETE FROM products WHERE id = ?');
  stmt.run(id, function (err) {
    callback(err, this.changes);
  });
  stmt.finalize();
};

module.exports = {
  addProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct
};
