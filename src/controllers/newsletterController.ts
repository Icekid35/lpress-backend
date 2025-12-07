import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import supabase from '../config/supabase';
import emailService from '../services/emailService';
import { asyncHandler, AppError } from '../middleware/errorHandler';

/**
 * @swagger
 * tags:
 *   name: Newsletter
 *   description: Newsletter and email campaign management
 */

/**
 * @swagger
 * /api/v1/newsletter/send:
 *   post:
 *     summary: Send newsletter to subscribers (Admin Only)
 *     tags: [Newsletter]
 *     security:
 *       - AdminSecretKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - htmlContent
 *               - recipientType
 *             properties:
 *               subject:
 *                 type: string
 *               htmlContent:
 *                 type: string
 *               recipientType:
 *                 type: string
 *                 enum: [all, test]
 *               testEmail:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Newsletter sent successfully
 */
export const sendNewsletter = asyncHandler(async (req: Request, res: Response) => {
  const { subject, htmlContent, recipientType, testEmail } = req.body;

  if (!subject || !htmlContent) {
    throw new AppError('Subject and content are required', 400);
  }

  // Verify email service
  const isConnected = await emailService.verifyConnection();
  if (!isConnected) {
    throw new AppError(
      'Email service not configured properly. Please check your email settings.',
      500
    );
  }

  // Wrap content in professional template
  const wrappedHtml = emailService.generateNewsletterWrapper(htmlContent);

  if (recipientType === 'test') {
    if (!testEmail) {
      throw new AppError('Test email address is required for test sends', 400);
    }

    await emailService.sendEmail({
      to: testEmail,
      subject: `[TEST] ${subject}`,
      html: wrappedHtml,
    });

    res.status(200).json({
      success: true,
      message: 'Test email sent successfully',
      data: { recipient: testEmail },
    });
    return;
  }

  // Get all subscribed emails
  const { data: subscribers, error } = await supabase
    .from('newsletter_subscribers')
    .select('email')
    .eq('subscribed', true);

  if (error) throw new AppError(error.message, 400);

  if (!subscribers || subscribers.length === 0) {
    throw new AppError('No active subscribers found', 404);
  }

  const emails = subscribers.map((sub: any) => sub.email);

  // Send bulk emails
  const results = await emailService.sendBulkEmails(emails, subject, wrappedHtml);

  // Log the campaign
  await supabase.from('newsletter_campaigns').insert({
    subject,
    html_content: htmlContent,
    sent_to_count: results.success,
    failed_count: results.failed,
    status: results.failed === 0 ? 'completed' : 'partial',
  });

  res.status(200).json({
    success: true,
    message: 'Newsletter sent successfully',
    data: {
      totalSubscribers: emails.length,
      successfullySent: results.success,
      failed: results.failed,
      errors: results.errors.length > 0 ? results.errors.slice(0, 5) : undefined,
    },
  });
});

/**
 * @swagger
 * /api/v1/newsletter/templates:
 *   get:
 *     summary: Get all newsletter templates (Admin Only)
 *     tags: [Newsletter]
 *     security:
 *       - AdminSecretKey: []
 *     responses:
 *       200:
 *         description: List of templates
 */
export const getTemplates = asyncHandler(async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('newsletter_templates')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new AppError(error.message, 400);

  res.status(200).json({
    success: true,
    count: data?.length || 0,
    data,
  });
});

/**
 * @swagger
 * /api/v1/newsletter/templates/{id}:
 *   get:
 *     summary: Get template by ID (Admin Only)
 *     tags: [Newsletter]
 *     security:
 *       - AdminSecretKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Template details
 */
export const getTemplateById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('newsletter_templates')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) throw new AppError('Template not found', 404);

  res.status(200).json({
    success: true,
    data,
  });
});

/**
 * @swagger
 * /api/v1/newsletter/templates:
 *   post:
 *     summary: Create newsletter template (Admin Only)
 *     tags: [Newsletter]
 *     security:
 *       - AdminSecretKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - htmlContent
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               htmlContent:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *     responses:
 *       201:
 *         description: Template created successfully
 */
export const createTemplate = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, htmlContent, thumbnail } = req.body;

  if (!name || !htmlContent) {
    throw new AppError('Name and content are required', 400);
  }

  const { data, error } = await supabase
    .from('newsletter_templates')
    .insert({
      id: uuidv4(),
      name,
      description,
      html_content: htmlContent,
      thumbnail,
    } as any)
    .select()
    .single();

  if (error) throw new AppError(error.message, 400);

  res.status(201).json({
    success: true,
    message: 'Template created successfully',
    data,
  });
});

/**
 * @swagger
 * /api/v1/newsletter/templates/{id}:
 *   put:
 *     summary: Update newsletter template (Admin Only)
 *     tags: [Newsletter]
 *     security:
 *       - AdminSecretKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Template updated successfully
 */
export const updateTemplate = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const { data, error } = await (
    supabase.from('newsletter_templates').update(updateData as any) as any
  )
    .eq('id', id)
    .select()
    .single();

  if (error) throw new AppError(error.message, 400);
  if (!data) throw new AppError('Template not found', 404);

  res.status(200).json({
    success: true,
    message: 'Template updated successfully',
    data,
  });
});

/**
 * @swagger
 * /api/v1/newsletter/templates/{id}:
 *   delete:
 *     summary: Delete newsletter template (Admin Only)
 *     tags: [Newsletter]
 *     security:
 *       - AdminSecretKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Template deleted successfully
 */
export const deleteTemplate = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error } = await supabase.from('newsletter_templates').delete().eq('id', id);

  if (error) throw new AppError(error.message, 400);

  res.status(200).json({
    success: true,
    message: 'Template deleted successfully',
  });
});

/**
 * @swagger
 * /api/v1/newsletter/campaigns:
 *   get:
 *     summary: Get newsletter campaign history (Admin Only)
 *     tags: [Newsletter]
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
 *         description: List of campaigns
 */
export const getCampaigns = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 50, offset = 0 } = req.query;

  const { data, error } = await supabase
    .from('newsletter_campaigns')
    .select('*')
    .order('created_at', { ascending: false })
    .range(Number(offset), Number(offset) + Number(limit) - 1)
    .limit(Number(limit));

  if (error) throw new AppError(error.message, 400);

  res.status(200).json({
    success: true,
    count: data?.length || 0,
    data,
  });
});
