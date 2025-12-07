import nodemailer, { Transporter } from 'nodemailer';
import juice from 'juice';
import config from '../config';

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    if (!config.email.user || !config.email.password) {
      console.warn('Email credentials not configured. Newsletter functionality will be disabled.');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.user,
        pass: config.email.password,
      },
    });
  }

  private inlineCSS(html: string): string {
    try {
      return juice(html);
    } catch (error) {
      console.error('Error inlining CSS:', error);
      return html;
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      throw new Error(
        'Email service not configured. Please set EMAIL_USER and EMAIL_PASSWORD in your environment variables.'
      );
    }

    try {
      const processedHtml = this.inlineCSS(options.html);

      const mailOptions = {
        from: `${config.email.fromName} <${config.email.from}>`,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: processedHtml,
        text: options.text || this.stripHtml(options.html),
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendBulkEmails(
    recipients: string[],
    subject: string,
    html: string
  ): Promise<{ success: number; failed: number; errors: string[] }> {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Send in batches to avoid overwhelming the email server
    const batchSize = 50;
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);

      const promises = batch.map(async (email) => {
        try {
          await this.sendEmail({
            to: email,
            subject,
            html,
          });
          results.success++;
        } catch (error) {
          results.failed++;
          results.errors.push(`Failed to send to ${email}: ${error}`);
        }
      });

      await Promise.allSettled(promises);

      // Add a small delay between batches to avoid rate limiting
      if (i + batchSize < recipients.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  private stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  async verifyConnection(): Promise<boolean> {
    if (!this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email service verification failed:', error);
      return false;
    }
  }

  // Generate a professional email wrapper for newsletters optimized for Gmail
  generateNewsletterWrapper(content: string, unsubscribeUrl?: string): string {
    // Process content to ensure images are block-level and one per line for Gmail
    const processedContent = content
      .replace(/<img([^>]*)style="([^"]*)"([^>]*)>/gi, (_match, before, style, after) => {
        // Remove inline-block and ensure display:block for images
        const cleanStyle = style
          .replace(/display\s*:\s*inline-block/gi, '')
          .replace(/vertical-align\s*:[^;]*/gi, '');
        return `<img${before}style="display:block;margin:15px auto;${cleanStyle}"${after}>`;
      })
      .replace(
        /<img(?![^>]*style=)/gi,
        '<img style="display:block;margin:15px auto;max-width:100%;height:auto;"'
      );

    return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>LPRES Newsletter</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <!-- Gmail requires table-based layouts for best compatibility -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f4f4f4;">
    <tr>
      <td align="center" style="padding:20px 0;">
        <!-- Main Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;background-color:#ffffff;margin:0 auto;">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#064e3b 0%,#059669 100%);background-color:#064e3b;padding:30px 20px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:600;font-family:Arial,Helvetica,sans-serif;">LPRES Administration</h1>
              <p style="color:#d1fae5;margin:10px 0 0 0;font-size:14px;font-family:Arial,Helvetica,sans-serif;">Local Planning Research and Statistics</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding:40px 30px;color:#333333;line-height:1.6;font-size:16px;font-family:Arial,Helvetica,sans-serif;">
              ${processedContent}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;padding:30px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="color:#6b7280;font-size:12px;margin:5px 0;font-family:Arial,Helvetica,sans-serif;">&copy; ${new Date().getFullYear()} LPRES Administration. All rights reserved.</p>
              <p style="color:#6b7280;font-size:12px;margin:5px 0;font-family:Arial,Helvetica,sans-serif;">This is an official communication from the Local Planning Research and Statistics Office.</p>
              ${unsubscribeUrl ? `<p style="margin:10px 0 0 0;"><a href="${unsubscribeUrl}" style="color:#059669;text-decoration:none;font-size:12px;font-family:Arial,Helvetica,sans-serif;">Unsubscribe</a> from this mailing list</p>` : ''}
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
  }
}

export default new EmailService();
