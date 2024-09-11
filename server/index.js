const express = require('express');
const app = express();
const port = 3000;
const userRoutes = require('./routes/user');

// Import Sequelize and Models
const sequelize = require('./config/database');  // Adjust this path based on where your config file is
const User = require('./models/User');
const Transaction = require('./models/Transaction');

// Middleware
app.use(express.json());

// Use the user routes
app.use('/', userRoutes);

// Route - Test the API
app.get('/', (req, res) => {
  res.send('Welcome to SwiftBank API');
});

// Sync all models and start the server
sequelize.sync({ force: true })  // Set force to true only in development, it drops tables if they exist
  .then(() => {
    console.log('Database & tables created!');

    // Start the server after DB sync
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Error creating database tables:', err);
  });
