const express = require('express');
const cors = require('cors');
const app = express();
const userRouter = require('./controllers/UsersController');
const gameRouter = require('./controllers/GamesController');
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/users', userRouter);
app.use('/api/games', gameRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
})
