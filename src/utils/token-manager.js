import jwt from 'jsonwebtoken';
import { COOKIE_NAME } from './constants.js';

// Function to create a token
export const createToken = (id, email, expiresIn) => {
  const payload = { id, email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });
  return token;
};

// Middleware to verify a token
export const verifyToken = async (req, res, next) => {
  const token = req.signedCookies[COOKIE_NAME];
  if (!token || token.trim() === '') {
    return res.status(401).json({ message: 'Token Not Received' });
  }
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, success) => {
      if (err) {
        reject(err.message);
        return res.status(401).json({ message: 'Token Expired' });
      } else {
        res.locals.jwtData = success;
        resolve();
        return next();
      }
    });
  });
};
