// Netlify serverless function to calculate life path numbers
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
    const { birthdate } = JSON.parse(event.body);

    if (!birthdate) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Birthdate is required' })
      };
    }

    // Calculate life path number
    const lifePathNumber = calculateLifePath(birthdate);
    
    // Get meaning for the life path number
    const meaning = getLifePathMeaning(lifePathNumber);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        success: true, 
        lifePathNumber: lifePathNumber,
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

// Helper function to get meaning for life path number
function getLifePathMeaning(number) {
  const meanings = {
    1: "You are a natural leader and pioneer. Your path is about independence, innovation, and being first. You're meant to forge new paths and inspire others with your courage.",
    2: "You are the peacemaker and diplomat. Your purpose involves creating harmony, building partnerships, and bringing people together. You excel at cooperation and sensitivity.",
    3: "You are the creative communicator. Your life path is about self-expression, joy, and inspiring others through art, words, or performance. You bring light and optimism to the world.",
    4: "You are the builder and organizer. Your path involves creating solid foundations, bringing order to chaos, and manifesting dreams through hard work and dedication.",
    5: "You are the freedom seeker and adventurer. Your purpose is about experiencing life fully, embracing change, and helping others break free from limitations.",
    6: "You are the nurturer and healer. Your path centers on love, family, community service, and creating beauty and harmony in the world around you.",
    7: "You are the seeker of truth and wisdom. Your journey involves deep spiritual understanding, analysis, and sharing knowledge with the world.",
    8: "You are the manifestor of abundance. Your path is about material success, leadership in business, and using your power to create positive change in the world.",
    9: "You are the humanitarian and universal lover. Your purpose is about compassion, letting go, and serving humanity on a grand scale.",
    11: "Master Number - You are a spiritual messenger and illuminator. Your path involves inspiring others through your intuition and bringing divine light to the world.",
    22: "Master Number - You are the master builder. Your purpose is to manifest grand visions and create lasting structures that benefit humanity.",
    33: "Master Number - You are the master teacher. Your path involves healing through love, teaching spiritual truths, and uplifting humanity."
  };

  return meanings[number] || meanings[number % 10];
}