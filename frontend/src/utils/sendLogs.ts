// scripts/sendLogs.ts
import nodemailer from 'nodemailer';
import { getLogs, clearLogs } from './logger';
import dotenv from 'dotenv';

dotenv.config();

async function sendLogsEmail() {
  const logs = getLogs();

  if (logs.length === 0) {
    console.log('No logs to send.');
    return;
  }

  // Format logs as JSON string with indentation for readability
  const logsContent = JSON.stringify(logs, null, 2);

  // Create transporter for Gmail SMTP
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Email options
  const mailOptions = {
    from: `"App Logger" <${process.env.SMTP_USER}>`, // sender address
    to: process.env.LOG_RECIPIENT, // list of receivers (your dev email)
    subject: `App Logs - ${new Date().toLocaleString()}`, // Subject line with date/time
    text: 'Attached are the application logs.', // plain text body
    attachments: [
      {
        filename: `app-logs-${new Date().toISOString()}.json`,
        content: logsContent,
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Logs email sent:', info.response);
    clearLogs(); // Clear logs after sending
  } catch (error) {
    console.error('Failed to send logs email:', error);
  }
}

// If this script is run directly, send the email
if (require.main === module) {
  sendLogsEmail();
}

export default sendLogsEmail;
