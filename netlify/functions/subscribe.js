const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Parse request body
  const { name, email } = JSON.parse(event.body);

  // Validate inputs
  if (!name || !email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Name and email are required' })
    };
  }

  // Extract first name
  const firstName = name.split(' ')[0];

  // Brevo API request
  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        attributes: {
          FIRSTNAME: firstName,
          NOM: name // Full name
        },
        listIds: [7], // SoulCodes Welcome list
        updateEnabled: true // Update if contact already exists
      })
    });

    const data = await response.json();

    if (response.ok || response.status === 400) {
      // 400 with Brevo usually means "Contact already exists", which we treat as success provided updateEnabled is true
      // However, fetch might not throw on 400, so we handle data checking if needed.
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
          success: true,
          message: 'Welcome to your sanctuary! Check your email.'
        })
      };
    } else {
      console.error('Brevo API error:', data);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Failed to subscribe. Please try again.'
        })
      };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Server error. Please try again later.'
      })
    };
  }
};
