// Netlify serverless function to handle angel number sightings with Supabase
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };
  }

  // Parse URL to determine action
  const pathParts = event.path.split('/');
  const action = pathParts[pathParts.length - 1];
  const userId = event.queryStringParameters?.userId;

  try {
    if (event.httpMethod === 'POST') {
      // Log a new angel sighting
      const { number, datetime, location, notes } = JSON.parse(event.body);

      if (!userId || !number || !datetime) {
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({ error: 'User ID, number, and datetime are required' })
        };
      }

      // Insert the new sighting
      const { data: sighting, error } = await supabase
        .from('angel_sightings')
        .insert([{
          user_id: userId,
          number: number,
          datetime: datetime,
          location: location || '',
          notes: notes || ''
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          success: true, 
          sighting: sighting,
          message: 'Sighting logged successfully!' 
        })
      };
    } 
    else if (event.httpMethod === 'GET') {
      // Retrieve all sightings for a user
      if (!userId) {
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({ error: 'User ID is required' })
        };
      }

      const { data: sightings, error } = await supabase
        .from('angel_sightings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          success: true, 
          sightings: sightings 
        })
      };
    }
    else if (event.httpMethod === 'DELETE') {
      // Delete a specific sighting
      const sightingId = event.queryStringParameters?.sightingId;
      
      if (!userId || !sightingId) {
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({ error: 'User ID and Sighting ID are required' })
        };
      }

      const { error } = await supabase
        .from('angel_sightings')
        .delete()
        .eq('id', sightingId)
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          success: true, 
          message: 'Sighting deleted successfully!' 
        })
      };
    }
    else {
      return {
        statusCode: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Internal server error', 
        message: error.message 
      })
    };
  }
};