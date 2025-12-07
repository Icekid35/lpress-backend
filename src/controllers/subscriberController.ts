import { Request, Response } from 'express';
import supabase from '../config/supabase';
import { asyncHandler, AppError } from '../middleware/errorHandler';

/**
 * @swagger
 * tags:
 *   name: Newsletter
 *   description: Newsletter subscription management
 */

/**
 * @swagger
 * /api/v1/subscribers:
 *   get:
 *     summary: Get all newsletter subscribers (Admin only)
 *     tags: [Newsletter]
 *     security:
 *       - ServiceRoleAuth: []
 *     parameters:
 *       - in: query
 *         name: subscribed
 *         schema:
 *           type: boolean
 *         description: Filter by subscription status
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: List of subscribers
 */
export const getAllSubscribers = asyncHandler(async (req: Request, res: Response) => {
  const { subscribed, limit = 50, offset = 0 } = req.query;

  let query = supabase
    .from('newsletter_subscribers')
    .select('*')
    .order('created_at', { ascending: false });

  if (subscribed !== undefined) {
    query = query.eq('subscribed', subscribed === 'true');
  }

  const { data, error } = await query
    .range(Number(offset), Number(offset) + Number(limit) - 1)
    .limit(Number(limit));

  if (error) throw new AppError(error.message, 400);

  res.status(200).json({
    success: true,
    count: data?.length || 0,
    data,
  });
});

/**
 * @swagger
 * /api/v1/subscribers/count:
 *   get:
 *     summary: Get subscriber count
 *     tags: [Newsletter]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: subscribed
 *         schema:
 *           type: boolean
 *           default: true
 *     responses:
 *       200:
 *         description: Subscriber count
 */
export const getSubscriberCount = asyncHandler(async (req: Request, res: Response) => {
  const { subscribed = 'true' } = req.query;

  const { count, error } = await supabase
    .from('newsletter_subscribers')
    .select('*', { count: 'exact', head: true })
    .eq('subscribed', subscribed === 'true');

  if (error) throw new AppError(error.message, 400);

  res.status(200).json({
    success: true,
    count: count || 0,
  });
});

/**
 * @swagger
 * /api/v1/subscribers/subscribe:
 *   post:
 *     summary: Subscribe to newsletter (Public)
 *     tags: [Newsletter]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       201:
 *         description: Subscribed successfully
 *       400:
 *         description: Validation error or already subscribed
 */
export const subscribe = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  // Check if already exists
  const { data: existing } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .eq('email', email)
    .single();

  if (existing) {
    if (existing.subscribed) {
      throw new AppError('Email is already subscribed to the newsletter', 400);
    }

    // Resubscribe
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .update({ subscribed: true } as any)
      .eq('email', email)
      .select()
      .single();

    if (error) throw new AppError(error.message, 400);

    return res.status(200).json({
      success: true,
      message: 'Successfully resubscribed to the newsletter',
      data,
    });
  }

  // New subscription
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .insert({ email, subscribed: true } as any)
    .select()
    .single();

  if (error) throw new AppError(error.message, 400);

  res.status(201).json({
    success: true,
    message: 'Successfully subscribed to the newsletter',
    data,
  });
});

/**
 * @swagger
 * /api/v1/subscribers/unsubscribe:
 *   post:
 *     summary: Unsubscribe from newsletter (Public)
 *     tags: [Newsletter]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Unsubscribed successfully
 *       404:
 *         description: Email not found
 */
export const unsubscribe = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .update({ subscribed: false } as any)
    .eq('email', email)
    .select()
    .single();

  if (error || !data) throw new AppError('Email not found in our newsletter list', 404);

  res.status(200).json({
    success: true,
    message: 'Successfully unsubscribed from the newsletter',
    data,
  });
});
