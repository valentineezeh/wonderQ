import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const verifyUserToken = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    // Check if token is provided
    if (!token) {
      return res.status(400).json({
        message: 'Please provide token'
      });
    }

    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }

    const verifyUser = await jwt.verify(token, process.env.secret);
    
    if (!verifyUser) {
      return res.status(401).json({
        message: 'User token could not be verified.'
      });
    }
    req.userData = verifyUser;
    next();
  } catch (error) {
    return error;
  }
};

export default verifyUserToken;
