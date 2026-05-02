import nodemailer from 'nodemailer';

export async function sendWelcomeEmail(toEmail: string, name: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Inter', Arial, sans-serif; background: #f4f6fb; margin: 0; padding: 0; }
    .container { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #4f46e5, #2563eb); padding: 40px 32px; text-align: center; }
    .header h1 { color: #fff; font-size: 28px; margin: 0; font-weight: 800; letter-spacing: -0.5px; }
    .header p { color: #c7d2fe; font-size: 14px; margin: 8px 0 0; }
    .body { padding: 36px 32px; }
    .greeting { font-size: 22px; font-weight: 700; color: #1e1b4b; margin-bottom: 12px; }
    .text { font-size: 15px; color: #6b7280; line-height: 1.7; margin-bottom: 20px; }
    .feature-box { background: #eef2ff; border-radius: 12px; padding: 20px 24px; margin: 24px 0; }
    .feature-box h3 { color: #4f46e5; font-size: 14px; font-weight: 700; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    .feature { display: flex; align-items: flex-start; margin-bottom: 10px; }
    .feature-icon { color: #4f46e5; font-size: 16px; margin-right: 10px; flex-shrink: 0; }
    .feature-text { font-size: 14px; color: #374151; }
    .cta { text-align: center; margin: 28px 0; }
    .cta a { background: linear-gradient(135deg, #4f46e5, #2563eb); color: #fff; text-decoration: none; padding: 14px 36px; border-radius: 12px; font-weight: 700; font-size: 15px; display: inline-block; }
    .footer { padding: 20px 32px; background: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; }
    .footer p { font-size: 12px; color: #9ca3af; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🗳️ ElectionIQ</h1>
      <p>Smart Election Learning Assistant</p>
    </div>
    <div class="body">
      <p class="greeting">Welcome, ${name}! 🎉</p>
      <p class="text">
        Thank you for registering with <strong>ElectionIQ</strong>. You're now part of a platform that's making India's democratic process more accessible and easy to understand for every citizen.
      </p>

      <div class="feature-box">
        <h3>What you can do now</h3>
        <div class="feature">
          <span class="feature-icon">✅</span>
          <span class="feature-text"><strong>Check your eligibility</strong> — Know if you can vote based on your age and state</span>
        </div>
        <div class="feature">
          <span class="feature-icon">📋</span>
          <span class="feature-text"><strong>Get your Action Plan</strong> — AI-powered step-by-step election journey</span>
        </div>
        <div class="feature">
          <span class="feature-icon">📁</span>
          <span class="feature-text"><strong>Submit Documents</strong> — Upload your ID proof via your secure Dashboard</span>
        </div>
        <div class="feature">
          <span class="feature-icon">📰</span>
          <span class="feature-text"><strong>Read Election News</strong> — Stay up to date with the latest ECI updates</span>
        </div>
      </div>

      <div class="cta">
        <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard">Go to My Dashboard</a>
      </div>

      <p class="text" style="font-size:13px; color: #9ca3af;">
        If you didn't create this account, please ignore this email. No action is required.
      </p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} ElectionIQ · Built for Indian Citizens 🇮🇳</p>
      <p style="margin-top:6px;">Empowering democracy through technology</p>
    </div>
  </div>
</body>
</html>
  `;

  await transporter.sendMail({
    from: `"ElectionIQ" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: '🗳️ Welcome to ElectionIQ — Your Election Journey Starts Now!',
    html,
  });
}
