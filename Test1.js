// Test1.js
const express = require('express');
const app = express();
const PORT = 3000;

// ✅ Middleware to parse JSON from request body
app.use(express.json());

// ✅ Test GET API
app.get('/', (req, res) => {
  res.send('Welcome to Express API');
});

// ✅ POST API - Create a user
app.post('/api/users', (req, res) => {
  const newUser = req.body; // getting JSON data from body
  console.log('New user data:', newUser);

  res.status(201).json({
    message: 'User created',
    data: newUser,
  });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
