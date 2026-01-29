// Netlify serverless function to calculate angel numbers
exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { name, birthdate } = JSON.parse(event.body);

    if (!name || !birthdate) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Name and birthdate are required' })
      };
    }

    // Calculate angel number
    const angelNumber = calculateAngelNumber(name, birthdate);
    
    // Get meaning for the angel number
    const meaning = getAngelNumberMeaning(angelNumber);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        success: true, 
        angelNumber: angelNumber,
        meaning: meaning
      })
    };
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

// Helper function to calculate angel number
function calculateAngelNumber(name, birthdate) {
  // Calculate from name (Pythagorean numerology)
  const letterValues = {
    'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9,
    'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 6, 'p': 7, 'q': 8, 'r': 9,
    's': 1, 't': 2, 'u': 3, 'v': 4, 'w': 5, 'x': 6, 'y': 7, 'z': 8
  };

  let nameSum = 0;
  name.toLowerCase().split('').forEach(char => {
    if (letterValues[char]) {
      nameSum += letterValues[char];
    }
  });

  // Calculate from birthdate
  const dateSum = birthdate.split('-').join('').split('').reduce((sum, digit) => sum + parseInt(digit), 0);

  // Combine and reduce
  let total = nameSum + dateSum;

  // Reduce to single digit or master number (11, 22, 33)
  while (total > 33 && total !== 11 && total !== 22 && total !== 33) {
    total = total.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }

  // If still not a master number, reduce to single digit
  if (total > 9 && total !== 11 && total !== 22 && total !== 33) {
    total = total.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }

  return total;
}

// Helper function to get meaning for angel number
function getAngelNumberMeaning(number) {
  const meanings = {
    1: "New beginnings, independence, and manifesting your desires. The universe is supporting your new path.",
    2: "Balance, harmony, and partnerships. Trust in divine timing and maintain faith.",
    3: "Creativity, self-expression, and growth. The ascended masters are guiding you.",
    4: "Stability, hard work paying off, and angelic protection. You're on the right path.",
    5: "Change, freedom, and adventure. Major life transformations are coming.",
    6: "Love, family, and domestic harmony. Focus on balance between material and spiritual.",
    7: "Spiritual awakening, inner wisdom, and good fortune. You're aligned with your soul's purpose.",
    8: "Abundance, success, and infinite possibilities. Financial and personal power are manifesting.",
    9: "Completion, humanitarian service, and spiritual enlightenment. A chapter is ending to make way for new beginnings.",
    11: "Master number of intuition, spiritual insight, and enlightenment. Your thoughts are rapidly manifesting.",
    22: "Master number of the master builder. You have the power to turn dreams into reality.",
    33: "Master number of compassion and blessings. You're being called to uplift others through your gifts."
  };

  return meanings[number] || meanings[number % 10];
}