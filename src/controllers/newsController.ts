import { Request, Response } from 'express';
import supabase from '../config/supabase';
import { asyncHandler, AppError } from '../middleware/errorHandler';

/**
 * @swagger
 * tags:
 *   name: News
 *   description: News management endpoints
 */

/**
 * @swagger
 * /api/v1/news:
 *   get:
 *     summary: Get all news articles
 *     tags: [News]
 *     security:
 *       - ApiKeyAuth: []
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
 *         description: List of news articles
 */
export const getAllNews = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 50, offset = 0 } = req.query;

  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false })
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
 * /api/v1/news/{id}:
 *   get:
 *     summary: Get news article by ID
 *     tags: [News]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: News article details
 *       404:
 *         description: News article not found
 */
export const getNewsById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { data, error } = await supabase.from('news').select('*').eq('id', id).single();

  if (error || !data) throw new AppError('News article not found', 404);

  res.status(200).json({
    success: true,
    data,
  });
});

/**
 * @swagger
 * /api/v1/news:
 *   post:
 *     summary: Create a new news article
 *     tags: [News]
 *     security:
 *       - ServiceRoleAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - details
 *               - event
 *               - location
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 200
 *               details:
 *                 type: string
 *                 minLength: 20
 *                 maxLength: 10000
 *               event:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 200
 *               location:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 200
 *               published_at:
 *                 type: string
 *                 format: date-time
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *                 maxItems: 6
 *     responses:
 *       201:
 *         description: News article created successfully
 */
export const createNews = asyncHandler(async (req: Request, res: Response) => {
  const newsData = req.body;

  const { data, error } = await supabase
    .from('news')
    .insert(newsData as any)
    .select()
    .single();

  if (error) throw new AppError(error.message, 400);

  res.status(201).json({
    success: true,
    message: 'News article created successfully',
    data,
  });
});

/**
 * @swagger
 * /api/v1/news/{id}:
 *   put:
 *     summary: Update a news article
 *     tags: [News]
 *     security:
 *       - ServiceRoleAuth: []
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
 *     responses:
 *       200:
 *         description: News article updated successfully
 */
export const updateNews = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const { data, error } = await supabase
    .from('news')
    .update(updateData as any)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new AppError(error.message, 400);
  if (!data) throw new AppError('News article not found', 404);

  res.status(200).json({
    success: true,
    message: 'News article updated successfully',
    data,
  });
});

/**
 * @swagger
 * /api/v1/news/{id}:
 *   delete:
 *     summary: Delete a news article
 *     tags: [News]
 *     security:
 *       - ServiceRoleAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: News article deleted successfully
 */
export const deleteNews = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error } = await supabase.from('news').delete().eq('id', id);

  if (error) throw new AppError(error.message, 400);

  res.status(200).json({
    success: true,
    message: 'News article deleted successfully',
  });
});

/**
 * @swagger
 * /api/v1/news/upload:
 *   post:
 *     summary: Upload news images
 *     tags: [News]
 *     security:
 *       - ServiceRoleAuth: []
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
 */
export const uploadImages = asyncHandler(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    throw new AppError('No files provided', 400);
  }

  const uploadPromises = files.map(async (file) => {
    const fileName = `news/${Date.now()}-${file.originalname}`;
    const { data, error } = await supabase.storage.from('images').upload(fileName, file.buffer, {
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
