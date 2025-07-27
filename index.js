import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Allow CORS for frontend on localhost:3000
app.use(cors({
  origin: process.env.FRONTEND_URL,
}));

app.use(express.json());

// Configure your SMTP transporter using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

// Verify transporter configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('Transporter verification failed:', error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

app.post('/api/test-email', async (req, res) => {
  const { to, subject, body } = req.body;
  console.log('Received email request:', req.body);

  if (!to || !subject || !body) {
    console.warn('Missing required fields:', req.body);
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const mailOptions = {
      from: 'Artium <abhinetcore1701@gmail.com>', // sender address
      to,
      subject,
      text: body
    };
    console.log('Sending mail with options:', mailOptions);
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info);
    res.json({ message: 'Email sent successfully!', info });
  } catch (error) {
    console.error('Failed to send email:', error);
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

app.listen(8080, () => {
  console.log('Server running on http://localhost:8080');
}); 