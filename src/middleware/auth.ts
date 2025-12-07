import { Request, Response, NextFunction } from 'express';
import config from '../config';

export const authenticateServiceRole = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const apiKey = req.headers['x-api-key'] as string;

  const token = authHeader?.replace('Bearer ', '');

  if (token === config.supabase.serviceRoleKey || apiKey === config.supabase.serviceRoleKey) {
    return next();
  }

  return res.status(401).json({
    success: false,
    message: 'Unauthorized. Admin access required.',
  });
};

export const authenticatePublic = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const apiKey = req.headers['x-api-key'] as string;

  const token = authHeader?.replace('Bearer ', '');

  // Allow both anon key and service role key
  if (
    token === config.supabase.anonKey ||
    token === config.supabase.serviceRoleKey ||
    apiKey === config.supabase.anonKey ||
    apiKey === config.supabase.serviceRoleKey
  ) {
    return next();
  }

  return res.status(401).json({
    success: false,
    message: 'Unauthorized. Valid API key required.',
  });
};
