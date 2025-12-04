import jwt from 'jsonwebtoken';
import morgan from 'morgan';
import cors from 'cors';
import { JWT_SECRET, CLIENT_ORIGIN } from './config.js';
import { User } from './models.js';

export const createCorsMiddleware = () =>
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  });

export const loggerMiddleware = morgan('dev');

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid authorization header' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = { id: user._id.toString(), role: user.role };
    next();
  } catch (err) {
    console.error('JWT error', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

