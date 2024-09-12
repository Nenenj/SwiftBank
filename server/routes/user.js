const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Register route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique account number for the user
    const accountNumber = uuidv4().split('-')[0];

    // Create the user in the database
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      accountNumber,
      balance: 0.00
    });

    // Send a success response
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    // Log the error to the terminal for debugging
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
 try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: 'User not found' });

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid password' });

    // Create a JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send a success response with the token
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    // Log the error to the terminal for debugging
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Deposit route
router.post('/deposit', async (req, res) => {
  try {
    const { accountNumber, amount } = req.body;
    console.log("Deposit Request - Account Number:", accountNumber, "Amount:", amount);  // Log incoming data

    // Find the user by account number
    const user = await User.findOne({ where: { accountNumber } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's balance
    user.balance = parseFloat(user.balance) + parseFloat(amount);
    
    // Save the updated balance
    await user.save();

    // Format balance for the response
    const formattedBalance = user.balance.toFixed(2);

    res.status(200).json({ message: 'Deposit successful', newBalance: user.balance });
  } catch (error) {
    console.error('Error making deposit:', error);
    res.status(500).json({ error: 'Error making deposit', details: error.message });
  }
});

// Temporary route to list all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

module.exports = router;
