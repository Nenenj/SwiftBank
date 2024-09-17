const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

//JWT Secret key
const JWT_SECRET = process.env.JWT_SECRET;

/*
 * Register route
 */
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const accountNumber = uuidv4().split('-')[0];

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      accountNumber,
      balance: 0.00
    });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
});

/*
 * Login route
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid password' });

    //Generate JWT token
    const token = jwt.sign({ userId: user.Id, email: user.email },
    JWT_SECRET, {
     expiresIn: '1h'
  });

    res.status(200).json({
      message: 'Login successful',
      username: user.username,
      balance: user.balance,
      accountNumber: user.accountNumber,
      token
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
});
/*
 * Account Opening route
 */
router.post('/account-opening', async (req, res) => {
  const { firstName, otherName, surname, dob, address, phoneNumber, email, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique account number
    const accountNumber = uuidv4().split('-')[0];

    // Create new user
    const newUser = await User.create({
      firstName,
      otherName,
      surname,
      dob,
      address,
      phoneNumber,
      email,
      password: hashedPassword,
      accountNumber,
      balance: 0.00,  // Set initial balance
    });

    // Generate JWT token
    const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, {
      expiresIn: '1h',  // Token expires in 1 hour
    });

    // Respond with account number and token
    res.status(201).json({
      message: 'Account created successfully',
      accountNumber: newUser.accountNumber,
    });
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ error: 'Error opening account', details:
    error.message});
  }
});


/*
 * Deposit route
 */
router.post('/deposit', async (req, res) => {
  try {
    const { accountNumber, amount } = req.body;

    const user = await User.findOne({ where: { accountNumber } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.balance = parseFloat(user.balance) + parseFloat(amount);
    await user.save();

    res.status(200).json({ message: 'Deposit successful', newBalance: user.balance.toFixed(2) });
  } catch (error) {
    console.error('Error making deposit:', error);
    res.status(500).json({ error: 'Error making deposit', details: error.message });
  }
});

/*
 * Withdrawal route
 */
router.post('/withdraw', async (req, res) => {
  try {
    const { accountNumber, amount } = req.body;

    const user = await User.findOne({ where: { accountNumber } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.balance < amount) return res.status(400).json({ error: 'Insufficient funds' });

    user.balance = parseFloat(user.balance) - parseFloat(amount);
    await user.save();

    res.status(200).json({ message: 'Withdrawal successful', newBalance: user.balance.toFixed(2) });
  } catch (error) {
    console.error('Error making withdrawal:', error);
    res.status(500).json({ error: 'Error making withdrawal', details: error.message });
  }
});

/*
 * Send Money route
 */
router.post('/send-money', async (req, res) => {
  const { accountNumber, recipientAccountNumber, amount } = req.body;
  console.log('Sender Account:', accountNumber);
  console.log('Recipient Account:', recipientAccountNumber);
  console.log('Amount:', amount);

  try {
    const sender = await User.findOne({ where: { accountNumber } });
    const recipient = await User.findOne({ where: { accountNumber: recipientAccountNumber } });

    if (!sender) return res.status(404).json({ error: 'Sender not found' });
    if (!recipient) return res.status(404).json({ error: 'Recipient not found' });

    if (sender.balance < amount) return res.status(400).json({ error: 'Insufficient funds' });

    sender.balance = parseFloat(sender.balance) - parseFloat(amount);
    recipient.balance = parseFloat(recipient.balance) + parseFloat(amount);

    await sender.save();
    await recipient.save();

    res.status(200).json({ message: 'Money sent successfully', newBalance: sender.balance.toFixed(2) });
  } catch (error) {
    console.error('Error sending money:', error);
    res.status(500).json({ error: 'Error sending money', details: error.message });
  }
});

/*
 * Pay Bills route
 */
router.post('/pay-bills', async (req, res) => {
  const { accountNumber, amount } = req.body;

  try {
    const user = await User.findOne({ where: { accountNumber } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.balance < amount) return res.status(400).json({ error: 'Insufficient funds' });

    user.balance = parseFloat(user.balance) - parseFloat(amount);
    await user.save();

    res.status(200).json({ message: 'Bills paid successfully', newBalance: user.balance.toFixed(2) });
  } catch (error) {
    console.error('Error paying bills:', error);
    res.status(500).json({ error: 'Error paying bills', details: error.message });
  }
});

module.exports = router;
