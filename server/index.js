const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const accountRouter = require('./controllers/AccountController');
const profileRouter = require('./controllers/ProfileController');
const gameRouter = require('./controllers/GameController');
const db = require('./utils/Database');
const port = process.env.PORT || 3000;

dotenv.config({ path: './.env' });

if (!process.env.JWT_KEY) {
  console.error('JWT key is not defined. Terminating process.');
  process.exit(1);
}

app.use(cors({ exposedHeaders: ['x-auth-token'] }));
app.use(express.json());
app.use('/api/account', accountRouter);
app.use('/api/profile', profileRouter);
app.use('/api/game', gameRouter);

db.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
  });
})
  .catch(() => {
    console.log('Database sync error.')
  });
