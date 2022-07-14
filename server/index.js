const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const userRouter = require('./controllers/UsersController');
const gameRouter = require('./controllers/GamesController');
const authRouter = require('./controllers/AuthController');
const port = process.env.PORT || 3000;

dotenv.config({ path: './.env' });

if (!process.env.JWT_KEY) {
  console.error('JWT key is not defined. Terminating process.');
  process.exit(1);
}

app.use(cors());
app.use(express.json());
app.use('/api/users', userRouter);
app.use('/api/games', gameRouter);
app.use('/api/auth', authRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
})
