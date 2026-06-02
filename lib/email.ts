import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendInviteEmail(to: string, name: string, programme: string): Promise<{ success: boolean }> {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0F172A; padding: 24px; text-align: center;">
          <h1 style="color: #FFFFFF; margin: 0; font-size: 24px; letter-spacing: 0.05em;">Gurukul</h1>
        </div>
        <div style="padding: 32px; background-color: #FFFFFF;">
          <p style="font-size: 16px; color: #334155; margin-top: 0;">Hi ${name || 'Student'},</p>
          <p style="font-size: 16px; color: #334155; line-height: 1.5;">
            Your Gurukul account for the <strong>${programme}</strong> programme is ready.
            Visit the portal and click "Sign in with Google" using this email address to get started.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${appUrl}" style="background-color: #2563EB; color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Visit Gurukul
            </a>
          </div>
          <p style="font-size: 12px; color: #94A3B8; margin-bottom: 0; margin-top: 40px; border-top: 1px solid #E2E8F0; padding-top: 16px;">
            This invitation was sent by your Programme Admin.<br>
            If you did not expect this, please ignore this email.
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'Gurukul <noreply@gurukul.iiml.ac.in>',
      to,
      subject: "You're invited to Gurukul — Your IIML Portal",
      html: htmlBody,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send invite email to', to, error);
    return { success: false };
  }
}
