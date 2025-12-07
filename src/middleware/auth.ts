import { Request, Response, NextFunction } from 'express';
import config from '../config';

export const authenticateServiceRole = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const apiKey = req.headers['x-api-key'] as string;
  const secretKey = req.headers['x-admin-secret'] as string;

  const token = authHeader?.replace('Bearer ', '');

  if (
    token === config.adminSecretKey ||
    apiKey === config.adminSecretKey ||
    secretKey === config.adminSecretKey
  ) {
    return next();
  }

  return res.status(401).json({
    success: false,
    message: 'Unauthorized. Admin access required. Use x-admin-secret header with the secret key.',
  });
};

export const authenticatePublic = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
