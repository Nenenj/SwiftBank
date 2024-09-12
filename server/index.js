const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

// Import Sequelize and Models
const sequelize = require('./config/database');  
const User = require('./models/User');
const Transaction = require('./models/Transaction');

// Middleware to parse JSON data
app.use(express.json());

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: true }));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Use the user routes
const userRoutes = require('./routes/user');
app.use('/api', userRoutes);

// Route - Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/account-opening', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'account-opening.html'));
});

app.get('/transactions', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'transactions.html'));
});


// Sync all models and start the server
sequelize.sync()
  .then(() => {
    console.log('Database & tables synchronized!');

    // Start the server after DB sync
    app.listen(3000, () => {
      console.log(`Server is running on http://localhost:3000`);
    });
  })
  .catch((err) => {
    console.error('Error synchronizing database tables:', err);
  });
