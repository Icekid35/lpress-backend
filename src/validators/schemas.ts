import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(200, 'Title must not exceed 200 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(10000, 'Description must not exceed 10000 characters'),
  location: z.string().min(5, 'Location must be at least 5 characters').max(200, 'Location must not exceed 200 characters'),
  status: z.enum(['in progress', 'completed']).default('in progress'),
  images: z.array(z.string().url()).max(6, 'Maximum 6 images allowed').optional().default([]),
});

export const updateProjectSchema = createProjectSchema.partial();

export const createNewsSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(200, 'Title must not exceed 200 characters'),
  details: z.string().min(20, 'Details must be at least 20 characters').max(10000, 'Details must not exceed 10000 characters'),
  event: z.string().min(10, 'Event must be at least 10 characters').max(200, 'Event must not exceed 200 characters'),
  location: z.string().min(5, 'Location must be at least 5 characters').max(200, 'Location must not exceed 200 characters'),
  published_at: z.string().datetime().optional(),
  images: z.array(z.string().url()).max(6, 'Maximum 6 images allowed').optional().default([]),
});

export const updateNewsSchema = createNewsSchema.partial();

export const createComplaintSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must not exceed 100 characters'),
  email: z.string().email('Invalid email address').min(5).max(100),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200, 'Subject must not exceed 200 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description must not exceed 2000 characters'),
});

export const subscribeSchema = z.object({
  email: z.string().email('Invalid email address').min(5).max(100),
});

export const unsubscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
});
