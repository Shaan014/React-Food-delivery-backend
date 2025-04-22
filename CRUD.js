const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// 🔧 In-memory user list
let users = [
  { id: 1, name: 'Yathurshan' },
  { id: 2, name: 'React Learner' },
];

// ✅ Get all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// ✅ Get user by ID
app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// ✅ Create a user
app.post('/api/users', (req, res) => {
  const { id, name } = req.body;
  const exists = users.find(u => u.id === id);
  if (exists) return res.status(400).json({ message: 'User ID already exists' });

  const newUser = { id, name };
  users.push(newUser);
  res.status(201).json({ message: 'User created', data: newUser });
});

// ✅ Update a user
app.put('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const { name } = req.body;
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.name = name;
  res.json({ message: 'User updated', data: user });
});

// ✅ Delete a user
app.delete('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) return res.status(404).json({ message: 'User not found' });

  users.splice(index, 1);
  res.json({ message: 'User deleted' });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
