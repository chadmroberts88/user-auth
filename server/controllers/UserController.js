const Users = require('../models/UserModel');

const registerUser = async (req, res) => {
  try {
    const user = await Users.createUser(req.body);
    return res.json(user);
  } catch (error) {
    console.log(error);
  }
}

const logInUser = async (req, res) => {
  try {
    const user = await Users.readUser(req.body);
    return res.json(user);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  registerUser,
  logInUser
}