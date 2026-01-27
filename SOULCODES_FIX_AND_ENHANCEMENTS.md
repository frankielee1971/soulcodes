# SoulCodes - Card Flip Fix & Personalization Features

## ISSUE IDENTIFIED: Card Click Not Working

### Root Cause
The card flip functionality exists in the code but may have a CSS specificity or z-index issue preventing clicks from registering on the card container.

### Quick Fix (Add to line 804 in index.html)

Replace the existing event listener:
```javascript
// OLD CODE (line 804):
cardContainer.addEventListener('click', flipCard);

// NEW CODE - Add error handling and ensure element exists:
if (cardContainer) {
    console.log('Card container found, attaching click listener');
    cardContainer.addEventListener('click', function(e) {
        console.log('Card clicked!'); // Debug log
        flipCard();
    });
    
    // Also add cursor pointer to make it obvious it's clickable
    cardContainer.style.cursor = 'pointer';
} else {
    console.error('Card container element not found!');
}
```

### CSS Fix (Add to the `<style>` section around line 150)

Add this to ensure the card is clickable:
```css
#card-container {
    cursor: pointer;
    position: relative;
    z-index: 10;
    pointer-events: auto;
}

#card-container * {
    pointer-events: none; /* Prevent child elements from capturing clicks */
}

#card-front, #card-back {
    pointer-events: none;
}
```

---

## PERSONALIZATION FEATURES

### 1. User Profile System

Add this HTML section after the hero section (around line 400):

```html
<!-- User Profile Collection Modal -->
<div id="profile-modal" class="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 hidden flex items-center justify-center p-6">
    <div class="bg-cosmic-midnight border-2 border-cosmic-gold rounded-2xl p-8 max-w-2xl w-full">
        <h2 class="font-serif text-3xl text-cosmic-gold mb-4 text-center">Create Your Soulcodes Profile</h2>
        <p class="text-gray-300 text-center mb-6">Personalize your spiritual journey</p>
        
        <form id="profile-form" class="space-y-4">
            <div>
                <label class="block text-cosmic-pink mb-2">Your Name</label>
                <input type="text" id="profile-name" required
                    class="w-full p-3 rounded-lg bg-white/10 text-white border border-cosmic-purple/30 focus:ring-2 focus:ring-cosmic-gold">
            </div>
            
            <div>
                <label class="block text-cosmic-pink mb-2">Birth Date</label>
                <input type="date" id="profile-birthdate" required
                    class="w-full p-3 rounded-lg bg-white/10 text-white border border-cosmic-purple/30 focus:ring-2 focus:ring-cosmic-gold">
            </div>
            
            <div>
                <label class="block text-cosmic-pink mb-2">What are you seeking guidance on?</label>
                <select id="profile-goal" required
                    class="w-full p-3 rounded-lg bg-white/10 text-white border border-cosmic-purple/30 focus:ring-2 focus:ring-cosmic-gold">
                    <option value="">Select your focus...</option>
                    <option value="career">Career & Purpose</option>
                    <option value="love">Love & Relationships</option>
                    <option value="spiritual">Spiritual Growth</option>
                    <option value="abundance">Financial Abundance</option>
                    <option value="health">Health & Wellbeing</option>
                    <option value="transformation">Personal Transformation</option>
                </select>
            </div>
            
            <div>
                <label class="block text-cosmic-pink mb-2">Numbers you see frequently (optional)</label>
                <input type="text" id="profile-numbers" placeholder="e.g., 111, 444, 777"
                    class="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-500 border border-cosmic-purple/30 focus:ring-2 focus:ring-cosmic-gold">
            </div>
            
            <button type="submit" 
                class="w-full px-8 py-3 bg-gradient-to-r from-cosmic-pink to-cosmic-purple text-white font-bold rounded-full hover:scale-105 transition-all duration-300">
                Start My Journey
            </button>
        </form>
    </div>
</div>
```

### 2. Personalized Welcome Section

Replace the current hero section content with:

```html
<!-- Personalized Greeting (shown when user has profile) -->
<div id="personalized-greeting" class="hidden">
    <h2 class="font-serif text-2xl md:text-3xl text-cosmic-gold mb-4">
        Welcome back, <span id="user-name-display"></span> ✨
    </h2>
    <p class="text-lg text-gray-300 mb-2">
        Your Life Path Number: <span id="user-life-path" class="text-cosmic-pink font-bold text-2xl"></span>
    </p>
    <p class="text-md text-gray-400 mb-6">
        Days on your journey: <span id="days-since-signup" class="text-cosmic-gold"></span>
    </p>
</div>
```

### 3. JavaScript for User Profile

Add this JavaScript (around line 820, after the existing code):

```javascript
// ===== USER PROFILE SYSTEM =====
const profileModal = document.getElementById('profile-modal');
const profileForm = document.getElementById('profile-form');
const personalizedGreeting = document.getElementById('personalized-greeting');

// Check if user has a profile
function checkUserProfile() {
    const userProfile = JSON.parse(localStorage.getItem('soulcodesProfile'));
    
    if (!userProfile) {
        // Show profile modal on first visit
        setTimeout(() => {
            profileModal.classList.remove('hidden');
        }, 2000); // Show after 2 seconds
    } else {
        // Show personalized greeting
        showPersonalizedGreeting(userProfile);
    }
}

// Save user profile
profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const profile = {
        name: document.getElementById('profile-name').value,
        birthdate: document.getElementById('profile-birthdate').value,
        goal: document.getElementById('profile-goal').value,
        numbers: document.getElementById('profile-numbers').value,
        createdAt: Date.now()
    };
    
    // Calculate life path number
    profile.lifePathNumber = calculateLifePath(profile.name, profile.birthdate);
    
    localStorage.setItem('soulcodesProfile', JSON.stringify(profile));
    profileModal.classList.add('hidden');
    showPersonalizedGreeting(profile);
});

// Show personalized greeting
function showPersonalizedGreeting(profile) {
    document.getElementById('user-name-display').textContent = profile.name.split(' ')[0];
    document.getElementById('user-life-path').textContent = profile.lifePathNumber;
    
    // Calculate days since signup
    const daysSince = Math.floor((Date.now() - profile.createdAt) / (1000 * 60 * 60 * 24));
    document.getElementById('days-since-signup').textContent = daysSince;
    
    personalizedGreeting.classList.remove('hidden');
}

// Initialize on page load
checkUserProfile();
```

### 4. AI-Powered Personalized Card Readings

Add this function to generate AI-powered personalized messages:

```javascript
// ===== AI PERSONALIZATION =====
async function getPersonalizedAffirmation() {
    const userProfile = JSON.parse(localStorage.getItem('soulcodesProfile'));
    
    if (!userProfile) {
        // Return regular affirmation if no profile
        return affirmations[Math.floor(Math.random() * affirmations.length)];
    }
    
    // For now, return context-aware affirmation
    // Later, you can integrate OpenAI API here
    const goalAffirmations = {
        career: [
            `${userProfile.name.split(' ')[0]}, your unique talents are needed in the world. Trust your path.`,
            `The universe is aligning opportunities for your career growth. Stay open and ready.`,
            `Your life path ${userProfile.lifePathNumber} reveals your natural leadership. Step into it.`
        ],
        love: [
            `${userProfile.name.split(' ')[0]}, you are worthy of deep, unconditional love.`,
            `The love you seek is seeking you. Open your heart to receive.`,
            `Your life path ${userProfile.lifePathNumber} shows you're meant for profound connections.`
        ],
        spiritual: [
            `${userProfile.name.split(' ')[0]}, your spiritual awakening is unfolding perfectly.`,
            `Trust the divine timing of your journey. You are exactly where you need to be.`,
            `Your life path ${userProfile.lifePathNumber} reveals your spiritual gifts. Embrace them.`
        ],
        abundance: [
            `${userProfile.name.split(' ')[0]}, abundance flows to you naturally and effortlessly.`,
            `You are a powerful manifestor. Your wealth consciousness is expanding.`,
            `Life path ${userProfile.lifePathNumber} carries prosperity energy. Claim it.`
        ],
        health: [
            `${userProfile.name.split(' ')[0]}, your body is healing and regenerating with every breath.`,
            `Listen to your body's wisdom. It knows exactly what it needs.`,
            `Your life path ${userProfile.lifePathNumber} supports vibrant health and vitality.`
        ],
        transformation: [
            `${userProfile.name.split(' ')[0]}, you are shedding old patterns and emerging renewed.`,
            `Every ending is a new beginning. Trust your transformation process.`,
            `Life path ${userProfile.lifePathNumber} is guiding your metamorphosis. Surrender to it.`
        ]
    };
    
    const affirmationsForGoal = goalAffirmations[userProfile.goal] || affirmations;
    return affirmationsForGoal[Math.floor(Math.random() * affirmationsForGoal.length)];
}

// Update the drawNewAffirmation function:
async function drawNewAffirmation() {
    const newAffirmation = await getPersonalizedAffirmation();
    currentAffirmation = newAffirmation;
    affirmationText.textContent = currentAffirmation;
}
```

### 5. OpenAI Integration (Advanced)

To add true AI personalization, add this to your Netlify Environment Variables:

1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add: `OPENAI_API_KEY` = your API key

Then create a Netlify Function (`netlify/functions/get-personalized-message.js`):

```javascript
const fetch = require('node-fetch');

exports.handler = async (event) => {
    const { name, lifePathNumber, goal, recentNumbers } = JSON.parse(event.body);
    
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [{
                    role: 'system',
                    content: 'You are a compassionate spiritual guide who provides personalized soul messages. Keep messages under 30 words, warm, and empowering.'
                }, {
                    role: 'user',
                    content: `Create a personalized spiritual message for ${name}, Life Path ${lifePathNumber}, focusing on ${goal}. They've been seeing these angel numbers: ${recentNumbers}`
                }],
                max_tokens: 100,
                temperature: 0.9
            })
        });
        
        const data = await response.json();
        
        return {
            statusCode: 200,
            body: JSON.stringify({ message: data.choices[0].message.content })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to generate message' })
        };
    }
};
```

---

## IMPLEMENTATION STEPS

1. **Quick Fix for Card Click**:
   - Update line 804 with better event handling
   - Add CSS fixes for clickable card

2. **Add User Profile**:
   - Add profile modal HTML
   - Add profile JavaScript
   - Test profile creation

3. **Add Personalization**:
   - Update affirmations to use user context
   - Add personalized greeting

4. **Optional: AI Integration**:
   - Set up Netlify Function
   - Add OpenAI API key
   - Update affirmation function to call API

---

## TESTING CHECKLIST

- [ ] Card flips when clicked
- [ ] Profile modal appears on first visit
- [ ] Profile saves to localStorage
- [ ] Personalized greeting shows user name
- [ ] Life path number displays correctly
- [ ] Affirmations reference user context
- [ ] Days since signup calculates correctly
- [ ] AI messages are contextual (if implemented)

---

## NEXT STEPS

1. Implement card flip fix first
2. Add user profile system
3. Test personalization
4. Add AI integration (optional)
5. Create user dashboard showing:
   - Recent angel number sightings
   - Journal entries
   - Progress tracking
   - Personalized daily guidance
