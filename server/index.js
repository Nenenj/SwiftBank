require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;


// Import Sequelize and Models
const sequelize = require('./config/database');
const User = require('./models/User');
const Transaction = require('./models/Transaction');

app.use(cors());

// Middleware to parse JSON data
app.use(express.json());

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: true }));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Use the user routes
const userRoutes = require('./routes/user');
app.use('/api', userRoutes);

// DB Connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully. ');

    // Sync all models
    return sequelize.sync();
  })
  .then(() => {
    console.log('Database & tables synchronized! ');

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });


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
