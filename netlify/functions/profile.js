// Netlify serverless function to handle user profiles with Supabase
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

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
    const { email, name, birthdate, goal, numbers } = JSON.parse(event.body);

    // Validate inputs
    if (!email || !name || !birthdate) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email, name, and birthdate are required' })
      };
    }

    // Calculate life path number
    const lifePathNumber = calculateLifePath(birthdate);

    // Insert or update user profile in Supabase
    const { data: profile, error } = await supabase
      .from('users')
      .upsert({
        email: email,
        name: name,
        birthdate: birthdate,
        goal: goal || '',
        numbers: numbers || '',
        life_path_number: lifePathNumber
      }, {
        onConflict: 'email'
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        success: true, 
        profile: profile,
        message: 'Profile saved successfully!' 
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        error: 'Internal server error', 
        message: error.message 
      })
    };
  }
};

// Helper function to calculate life path number
function calculateLifePath(birthdate) {
  // Parse the birthdate string (format: YYYY-MM-DD)
  const date = new Date(birthdate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Month is 0-indexed
  const day = date.getDate();

  // Calculate the sum of all digits
  let total = sumDigits(year) + sumDigits(month) + sumDigits(day);

  // Reduce to single digit or master number (11, 22, 33)
  while (total > 33 && total !== 11 && total !== 22 && total !== 33) {
    total = sumDigits(total);
  }

  // If still greater than 9 and not a master number, reduce to single digit
  if (total > 9 && total !== 11 && total !== 22 && total !== 33) {
    total = sumDigits(total);
  }

  return total;
}

// Helper function to sum digits of a number
function sumDigits(num) {
  return num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
}