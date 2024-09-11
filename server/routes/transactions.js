// In server/routes/transactions.js

const Transaction = require('./models/Transaction');
const User = require('./models/User');

// Deposit Route
router.post('/deposit', async (req, res) => {
  const { accountNumber, amount } = req.body;
  const user = await User.findOne({ where: { accountNumber } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.balance += amount;
  await user.save();

  await Transaction.create({ fromAccount: accountNumber, toAccount: accountNumber, amount, date: new Date() });
  res.json({ message: 'Deposit successful', balance: user.balance });
});

// Withdrawal Route
router.post('/withdraw', async (req, res) => {
  const { accountNumber, amount } = req.body;
  const user = await User.findOne({ where: { accountNumber } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (user.balance < amount) return res.status(400).json({ error: 'Insufficient funds' });

  user.balance -= amount;
  await user.save();

  await Transaction.create({ fromAccount: accountNumber, toAccount: accountNumber, amount: -amount, date: new Date() });
  res.json({ message: 'Withdrawal successful', balance: user.balance });
});

// Transfer Route
router.post('/transfer', async (req, res) => {
  const { fromAccount, toAccount, amount } = req.body;
  
  const sender = await User.findOne({ where: { accountNumber: fromAccount } });
  const receiver = await User.findOne({ where: { accountNumber: toAccount } });

  if (!sender || !receiver) return res.status(404).json({ error: 'Invalid accounts' });
  if (sender.balance < amount) return res.status(400).json({ error: 'Insufficient funds' });

  sender.balance -= amount;
  receiver.balance += amount;

  await sender.save();
  await receiver.save();

  await Transaction.create({ fromAccount, toAccount, amount, date: new Date() });
  res.json({ message: 'Transfer successful', balance: sender.balance });
});
