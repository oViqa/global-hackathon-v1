const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database('./pudding.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initDatabase();
  }
});

// Initialize database tables
function initDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      image TEXT,
      category TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      total REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  // Insert sample products if table is empty (with a small delay to ensure tables are created)
  setTimeout(() => {
    db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
      if (!err && row && row.count === 0) {
        const sampleProducts = [
          { name: 'Classic Vanilla Pudding', description: 'Rich and creamy vanilla pudding made with premium ingredients', price: 4.99, category: 'classic', image: '/images/vanilla.jpg' },
          { name: 'Chocolate Dream', description: 'Decadent dark chocolate pudding for true chocolate lovers', price: 5.49, category: 'classic', image: '/images/chocolate.jpg' },
          { name: 'Caramel Delight', description: 'Smooth caramel pudding with a hint of sea salt', price: 5.99, category: 'premium', image: '/images/caramel.jpg' },
          { name: 'Berry Bliss', description: 'Fresh berry pudding with real fruit pieces', price: 6.49, category: 'premium', image: '/images/berry.jpg' },
          { name: 'Matcha Magic', description: 'Japanese-inspired matcha green tea pudding', price: 6.99, category: 'signature', image: '/images/matcha.jpg' },
          { name: 'Pistachio Paradise', description: 'Luxury pistachio pudding with real nuts', price: 7.49, category: 'signature', image: '/images/pistachio.jpg' }
        ];

        const stmt = db.prepare('INSERT INTO products (name, description, price, category, image) VALUES (?, ?, ?, ?, ?)');
        sampleProducts.forEach(product => {
          stmt.run(product.name, product.description, product.price, product.category, product.image);
        });
        stmt.finalize(() => {
          console.log('✓ Sample products inserted successfully');
        });
      } else if (row && row.count > 0) {
        console.log('✓ Database already contains products');
      }
    });
  }, 100);
}

// API Routes

// Get all products
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.json(row);
    }
  });
});

// Create order
app.post('/api/orders', (req, res) => {
  const { customer_name, customer_email, items, total } = req.body;

  db.run(
    'INSERT INTO orders (customer_name, customer_email, total) VALUES (?, ?, ?)',
    [customer_name, customer_email, total],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        const orderId = this.lastID;
        
        // Insert order items
        const stmt = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)');
        items.forEach(item => {
          stmt.run(orderId, item.product_id, item.quantity, item.price);
        });
        stmt.finalize();

        res.json({ 
          message: 'Order created successfully', 
          orderId: orderId 
        });
      }
    }
  );
});

// Get orders
app.get('/api/orders', (req, res) => {
  db.all('SELECT * FROM orders ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'PuddingmitGabel API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🍮 PuddingmitGabel server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed');
    process.exit(0);
  });
});
