import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendResetEmail = async (email: string, name: string, token: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  await transporter.sendMail({
  from: `"Support" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: 'Reset Your Password',

  html:`
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #fafafa; padding: 60px 20px;">
    <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden; border: 1px solid #e1e5e9;">
      
      <!-- Clean Header -->
      <div style="background: white; padding: 50px 40px 30px; border-bottom: 3px solid #0066cc;">
        <h1 style="margin: 0 0 10px 0; font-size: 32px; font-weight: 700; color: #1a1a1a; letter-spacing: -0.5px;">Password Reset</h1>
        <p style="margin: 0; font-size: 16px; color: #666; font-weight: 400;">Secure account recovery</p>
      </div>

      <!-- Content -->
      <div style="padding: 40px;">
        <p style="font-size: 17px; color: #1a1a1a; margin-bottom: 8px; font-weight: 500;">Dear ${name},</p>
        
        <p style="font-size: 16px; color: #4a4a4a; line-height: 1.7; margin-bottom: 35px;">A password reset was requested for your account. To proceed with creating a new password, please click the secure link below.</p>

        <table cellpadding="0" cellspacing="0" style="width: 100%; margin: 35px 0;">
          <tr>
            <td align="center">
              <a href="${resetLink}" style="display: inline-block; background-color: #0066cc; color: white; padding: 16px 32px; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 15px; border: none; box-shadow: 0 2px 4px rgba(0, 102, 204, 0.2);">
                RESET PASSWORD
              </a>
            </td>
          </tr>
        </table>

        <div style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 4px; padding: 20px; margin: 35px 0;">
          <p style="margin: 0 0 12px 0; font-size: 14px; color: #495057; font-weight: 600;">Alternative Access:</p>
          <p style="margin: 0 0 8px 0; font-size: 13px; color: #6c757d;">If you're unable to click the button, copy and paste this URL:</p>
          <div style="background: white; border: 1px solid #dee2e6; border-radius: 3px; padding: 12px; word-break: break-all; font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace; font-size: 12px;">
            <a href="${resetLink}" style="color: #0066cc; text-decoration: none;">${resetLink}</a>
          </div>
        </div>

        <div style="border-left: 4px solid #ffc107; background: #fff3cd; padding: 16px 20px; border-radius: 0 4px 4px 0; margin: 35px 0;">
          <p style="margin: 0; font-size: 14px; color: #856404; font-weight: 500;">🕐 Security Notice: This link will expire in 15 minutes for your protection.</p>
        </div>

        <hr style="border: none; border-top: 1px solid #e9ecef; margin: 40px 0;">
        
        <p style="font-size: 13px; color: #6c757d; line-height: 1.5; margin: 0;">
          If you did not request this password reset, no action is required. Your account remains secure.<br><br>
          <strong style="color: #495057;">Customer Support Team</strong><br>
          Available 24/7 for your security needs
        </p>
      </div>
    </div>
  </div>
`

});

};
