import { Request, Response } from 'express';
import supabase from '../config/supabase';
import { asyncHandler, AppError } from '../middleware/errorHandler';

/**
 * @swagger
 * tags:
 *   name: Complaints
 *   description: Complaint management endpoints
 */

/**
 * @swagger
 * /api/v1/complaints:
 *   get:
 *     summary: Get all complaints (Admin Only)
 *     tags: [Complaints]
 *     description: Admin access required - use x-admin-secret header
 *     security:
 *       - AdminSecretKey: []
 *     parameters:
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
 *         description: List of complaints
 *       401:
 *         description: Unauthorized
 */
export const getAllComplaints = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 50, offset = 0 } = req.query;

  // Get total count
  const { count: totalCount, error: countError } = await supabase
    .from('complaints')
    .select('*', { count: 'exact', head: true });

  if (countError) throw new AppError(countError.message, 400);

  // Get paginated data
  const { data, error } = await supabase
    .from('complaints')
    .select('*')
    .order('created_at', { ascending: false })
    .range(Number(offset), Number(offset) + Number(limit) - 1)
    .limit(Number(limit));

  if (error) throw new AppError(error.message, 400);

  res.status(200).json({
    success: true,
    count: totalCount || 0,
    data,
  });
});

/**
 * @swagger
 * /api/v1/complaints/{id}:
 *   get:
 *     summary: Get complaint by ID (Admin Only)
 *     tags: [Complaints]
 *     description: Admin access required - use x-admin-secret header
 *     security:
 *       - AdminSecretKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Complaint details
 *       404:
 *         description: Complaint not found
 */
export const getComplaintById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { data, error } = await supabase.from('complaints').select('*').eq('id', id).single();

  if (error || !data) throw new AppError('Complaint not found', 404);

  res.status(200).json({
    success: true,
    data,
  });
});

/**
 * @swagger
 * /api/v1/complaints:
 *   post:
 *     summary: Submit a new complaint (Public)
 *     tags: [Complaints]
 *     description: Public endpoint - no authentication required
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - subject
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               email:
 *                 type: string
 *                 format: email
 *                 minLength: 5
 *                 maxLength: 100
 *               subject:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 200
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 2000
 *     responses:
 *       201:
 *         description: Complaint submitted successfully
 *       400:
 *         description: Validation error
 */
export const createComplaint = asyncHandler(async (req: Request, res: Response) => {
  const complaintData = req.body;

  const { data, error } = await supabase
    .from('complaints')
    .insert(complaintData as any)
    .select()
    .single();

  if (error) throw new AppError(error.message, 400);

  res.status(201).json({
    success: true,
    message: 'Complaint submitted successfully. We will review it shortly.',
    data,
  });
});

/**
 * @swagger
 * /api/v1/complaints/{id}:
 *   delete:
 *     summary: Delete a complaint (Admin Only)
 *     tags: [Complaints]
 *     description: Admin access required - use x-admin-secret header
 *     security:
 *       - AdminSecretKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Complaint deleted successfully
 *       404:
 *         description: Complaint not found
 */
export const deleteComplaint = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error } = await supabase.from('complaints').delete().eq('id', id);

  if (error) throw new AppError(error.message, 400);

  res.status(200).json({
    success: true,
    message: 'Complaint deleted successfully',
  });
});
