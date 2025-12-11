import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone } = body;

    // Validate input
    if (!name && !phone) {
      return NextResponse.json(
        { error: 'Name or phone is required' },
        { status: 400 }
      );
    }

    // Get Google Apps Script web app URL from environment variables
    const webAppUrl = process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL;

    if (!webAppUrl) {
      console.error('GOOGLE_APPS_SCRIPT_WEB_APP_URL is not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Prepare data to send to Google Apps Script
    const timestamp = new Date().toISOString();
    const payload = {
      name: name || '',
      phone: phone || '',
      timestamp: timestamp,
    };

    // POST data to Google Apps Script web app
    const response = await fetch(webAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Apps Script error:', errorText);
      throw new Error(`Google Apps Script returned ${response.status}`);
    }

    // Response handled - Google Apps Script will process the data
    await response.json().catch(() => ({}));

    return NextResponse.json(
      { success: true, message: 'User details saved successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving user details to Google Sheets:', error);
    
    // Don't expose internal errors to client
    return NextResponse.json(
      { error: 'Failed to save user details' },
      { status: 500 }
    );
  }
}

