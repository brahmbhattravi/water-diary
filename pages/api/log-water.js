// pages/api/log-water.js
import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Log the incoming request for debugging
    console.log('Received request body:', req.body);

    // Create auth client
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // Create client instance
    const client = await auth.getClient();

    // Create Google Sheets instance
    const googleSheets = google.sheets({ version: 'v4', auth: client });

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // Get the amount from request body
    const { amount } = req.body;

    // Format current date and time
    const now = new Date();
    const formattedDate = now.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).replace(/\//g, '-');

    // Prepare the values to write
    const values = [[formattedDate, amount]];

    // Append values to the spreadsheet
    const response = await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: 'Sheet1!A:B',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: values,
      },
    });

    console.log('Sheets API Response:', response.data);

    return res.status(200).json({
      success: true,
      message: 'Successfully logged water intake',
    });

  } catch (err) { // Changed from 'error' to 'err' since we're using it
    console.error('Detailed error:', {
      message: err.message,
      stack: err.stack,
    });

    return res.status(500).json({
      success: false,
      message: 'Failed to log water intake',
      error: err.message,
    });
  }
}