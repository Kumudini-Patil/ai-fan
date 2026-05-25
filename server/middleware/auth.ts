import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { AppErrorClass } from './errorHandler';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
    is_admin: boolean;
  };
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppErrorClass('Not authorized to access this route', 401);
    }

    const decoded = jwt.verify(token, config.jwt.secret) as {
      id: string;
      email: string;
      username: string;
      is_admin: boolean;
    };

    req.user = decoded;
    next();
  } catch (error) {
    next(new AppErrorClass('Not authorized to access this route', 401));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppErrorClass('Not authorized to access this route', 401));
    }

    if (roles.includes('admin') && !req.user.is_admin) {
      return next(new AppErrorClass('Not authorized - admin access required', 403));
    }

    next();
  };
};

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
};
