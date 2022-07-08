const express = require('express');
const { registerUser, logInUser } = require('./controllers/UserController');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/register', (req, res) => {
  registerUser(req, res);
});

app.post('/api/login', (req, res) => {
  logInUser(req, res);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
})