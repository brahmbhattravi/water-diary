// pages/api/log-water.js
import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Format the private key correctly
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined;

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // Rest of your code...
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: 'v4', auth: client });
    const { amount } = req.body;
    
    const now = new Date();
    const formattedDate = now.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).replace(/\//g, '-');

    const values = [[formattedDate, amount]];

    await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A:B',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: values,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Successfully logged water intake',
    });

  } catch (err) {
    console.error('Detailed error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to log water intake',
      error: err.message,
    });
  }
}