// Netlify serverless function to handle Brevo newsletter subscriptions
exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the request body
    const { email, name } = JSON.parse(event.body);

    // Validate inputs
    if (!email || !name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email and name are required' })
      };
    }

    // Get Brevo API key from environment variable
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const BREVO_LIST_ID = process.env.BREVO_LIST_ID || 3;

    if (!BREVO_API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'API key not configured' })
      };
    }

    // Call Brevo API
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify({
        email: email,
        attributes: {
          FIRSTNAME: name
        },
        listIds: [parseInt(BREVO_LIST_ID)],
        updateEnabled: true
      })
    });

    // Check if subscription was successful
    if (response.ok || response.status === 201) {
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          success: true, 
          message: 'Successfully subscribed!' 
        })
      };
    } else {
      const errorData = await response.json();
      return {
        statusCode: response.status,
        body: JSON.stringify({ 
          error: 'Subscription failed', 
          details: errorData 
        })
      };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error', 
        message: error.message 
      })
    };
  }
};
