import { Request, Response } from 'express';
import supabase from '../config/supabase';
import { asyncHandler, AppError } from '../middleware/errorHandler';

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management endpoints
 */

/**
 * @swagger
 * /api/v1/projects:
 *   get:
 *     summary: Get all projects (Public)
 *     tags: [Projects]
 *     description: Public endpoint - no authentication required
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [in progress, completed]
 *         description: Filter by project status
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of results
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Pagination offset
 *     responses:
 *       200:
 *         description: List of projects
 *       401:
 *         description: Unauthorized
 */
export const getAllProjects = asyncHandler(async (req: Request, res: Response) => {
  const { status, limit = 50, offset = 0 } = req.query;

  // Build count query
  let countQuery = supabase.from('projects').select('*', { count: 'exact', head: true });
  if (status) {
    countQuery = countQuery.eq('status', status);
  }
  const { count: totalCount, error: countError } = await countQuery;
  if (countError) throw new AppError(countError.message, 400);

  // Build data query
  let query = supabase.from('projects').select('*').order('created_at', { ascending: false });
  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query
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
 * /api/v1/projects/{id}:
 *   get:
 *     summary: Get project by ID (Public)
 *     tags: [Projects]
 *     description: Public endpoint - no authentication required
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project details
 *       404:
 *         description: Project not found
 */
export const getProjectById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();

  if (error || !data) throw new AppError('Project not found', 404);

  res.status(200).json({
    success: true,
    data,
  });
});

/**
 * @swagger
 * /api/v1/projects:
 *   post:
 *     summary: Create a new project (Admin Only)
 *     tags: [Projects]
 *     description: Admin access required - use x-admin-secret header
 *     security:
 *       - AdminSecretKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - location
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 200
 *               description:
 *                 type: string
 *                 minLength: 20
 *                 maxLength: 10000
 *               location:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 200
 *               status:
 *                 type: string
 *                 enum: [in progress, completed]
 *                 default: in progress
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *                 maxItems: 6
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const projectData = req.body;

  // Ensure description is stored as HTML
  if (projectData.description) {
    // Description should already be HTML from the rich text editor
    projectData.description = projectData.description;
  }

  const { data, error } = await supabase
    .from('projects')
    .insert(projectData as any)
    .select()
    .single();

  if (error) throw new AppError(error.message, 400);

  res.status(201).json({
    success: true,
    message: 'Project created successfully',
    data,
  });
});

/**
 * @swagger
 * /api/v1/projects/{id}:
 *   put:
 *     summary: Update a project (Admin Only)
 *     tags: [Projects]
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [in progress, completed]
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       404:
 *         description: Project not found
 */
export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const { data, error } = await supabase
    .from('projects')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new AppError(error.message, 400);
  if (!data) throw new AppError('Project not found', 404);

  res.status(200).json({
    success: true,
    message: 'Project updated successfully',
    data,
  });
});

/**
 * @swagger
 * /api/v1/projects/{id}:
 *   delete:
 *     summary: Delete a project (Admin Only)
 *     tags: [Projects]
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
 *         description: Project deleted successfully
 *       404:
 *         description: Project not found
 */
export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error } = await supabase.from('projects').delete().eq('id', id);

  if (error) throw new AppError(error.message, 400);

  res.status(200).json({
    success: true,
    message: 'Project deleted successfully',
  });
});

/**
 * @swagger
 * /api/v1/projects/upload:
 *   post:
 *     summary: Upload project images (Admin Only)
 *     tags: [Projects]
 *     description: Admin access required - use x-admin-secret header
 *     security:
 *       - AdminSecretKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Images uploaded successfully
 *       400:
 *         description: Upload error
 */
export const uploadImages = asyncHandler(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    throw new AppError('No files provided', 400);
  }

  const uploadPromises = files.map(async (file) => {
    const fileName = `projects/${Date.now()}-${file.originalname}`;
    const { error } = await supabase.storage.from('images').upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

    if (error) throw new AppError(error.message, 400);

    const {
      data: { publicUrl },
    } = supabase.storage.from('images').getPublicUrl(fileName);

    return publicUrl;
  });

  const imageUrls = await Promise.all(uploadPromises);

  res.status(200).json({
    success: true,
    message: 'Images uploaded successfully',
    data: imageUrls,
  });
});
