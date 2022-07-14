const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.id = decoded.id; // set custom request property

    console.log(req);
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token.' })
  }

}

module.exports = auth;