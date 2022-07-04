const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config({ path: './.env' })

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
})

db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("MySQL Connected!");
  }
})


app.post('/register', (req, res) => {
  const statement = `INSERT INTO UserData (name, email, password) VALUES ('${req.body.name}', '${req.body.email}', '${req.body.password}');`
  db.query(statement, (error, result) => {
    if (error) {
      res.json({
        status: 'error',
        details: error
      });
    } else {
      res.json({
        status: 'ok',
        details: result
      });
    }
  });
});

app.post('/login', (req, res) => {
  const statement = `SELECT * FROM UserData WHERE email = '${req.body.email}';`

  db.query(statement, (error, result) => {

    if (error) {

      res.json({
        status: 'error',
        details: error
      });

    } else {

      if (result.length > 0) {

        if (result[0].password === req.body.password) {

          const token = jwt.sign({
            name: result[0].name,
            email: result[0].email
          }, 'secret123');

          res.json({
            status: 'email found. passwords match.',
            token: token
          });

        } else {

          res.json({
            status: 'email found. passwords DO NOT match.',
          });

        }

      } else {

        res.json({
          status: 'email NOT found',
        });

      }

    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
})