// Main application logic for Soulcodes
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initializeAngelCalculator();
    initializeCardDeck();
    initializeAngelTracker();
    initializeProfileModal();
    initializeMobileMenu();
});

// Angel Number Calculator
function initializeAngelCalculator() {
    const calculatorForm = document.getElementById('angel-calculator-form');
    if (!calculatorForm) return;

    calculatorForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(calculatorForm);
        const name = formData.get('name');
        const birthdate = formData.get('birthdate');
        
        try {
            const angelNumber = calculateAngelNumber(name, birthdate);
            displayAngelResult(angelNumber);
            
            // Optionally save to database
            await saveAngelCalculation({ name, birthdate, angelNumber });
        } catch (error) {
            console.error('Error calculating angel number:', error);
            showError('Failed to calculate angel number. Please try again.');
        }
    });
}

// Card Deck for Daily Affirmations
function initializeCardDeck() {
    const drawButton = document.getElementById('draw-card');
    if (!drawButton) return;

    drawButton.addEventListener('click', async () => {
        try {
            const card = await getRandomAffirmation();
            displayCard(card);
        } catch (error) {
            console.error('Error drawing card:', error);
            showError('Failed to draw card. Please try again.');
        }
    });
}

// Angel Number Tracker
function initializeAngelTracker() {
    const trackerForm = document.getElementById('angel-tracker-form');
    if (!trackerForm) return;

    trackerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(trackerForm);
        const entry = Object.fromEntries(formData);
        
        try {
            await saveTrackerEntry(entry);
            showSuccess('Angel number sighting recorded!');
            trackerForm.reset();
        } catch (error) {
            console.error('Error saving tracker entry:', error);
            showError('Failed to record angel number sighting.');
        }
    });
}

// Profile Modal
function initializeProfileModal() {
    const profileModal = document.getElementById('profile-modal');
    const profileForm = document.getElementById('profile-form');
    
    if (!profileForm) return;

    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(profileForm);
        const profileData = Object.fromEntries(formData);
        
        try {
            await saveUserProfile(profileData);
            closeProfileModal();
            showSuccess('Profile saved successfully!');
        } catch (error) {
            console.error('Error saving profile:', error);
            showError('Failed to save profile. Please try again.');
        }
    });
}

// Mobile Menu
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.querySelector('nav');
    
    if (!mobileMenuBtn || !navMenu) return;

    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('hidden');
        navMenu.classList.toggle('flex');
    });
}

// Helper Functions
function calculateAngelNumber(name, birthdate) {
    // Simplified calculation - implement full numerology logic
    const nameValue = calculateNameValue(name);
    const birthValue = calculateBirthValue(birthdate);
    return reduceToSingleDigit(nameValue + birthValue);
}

function calculateNameValue(name) {
    const letterValues = {
        A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
        J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
        S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
    };
    
    let total = 0;
    for (const char of name.toUpperCase()) {
        if (letterValues[char]) {
            total += letterValues[char];
        }
    }
    return reduceToSingleDigit(total);
}

function calculateBirthValue(birthdate) {
    const date = new Date(birthdate);
    const dateString = date.getDate().toString() + (date.getMonth() + 1).toString() + date.getFullYear().toString();
    return reduceToSingleDigit(parseInt(dateString));
}

function reduceToSingleDigit(num) {
    while (num > 9 && ![11, 22, 33].includes(num)) {
        num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    }
    return num;
}

async function getRandomAffirmation() {
    // Fetch from API or use local array
    const affirmations = [
        "You are divinely guided and protected.",
        "Trust your intuition, it knows the way.",
        "Abundance flows to you effortlessly.",
        "You are worthy of love and happiness.",
        "Your dreams are manifesting into reality."
    ];
    
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    return { text: affirmations[randomIndex], date: new Date().toISOString() };
}

function displayCard(card) {
    const cardContainer = document.getElementById('current-card');
    if (cardContainer) {
        cardContainer.innerHTML = `
            <div class="bg-gradient-to-br from-cosmic-purple/20 to-cosmic-pink/20 p-8 rounded-2xl border border-cosmic-gold/30 text-center">
                <h3 class="text-xl font-serif text-cosmic-gold mb-4">Today's Affirmation</h3>
                <p class="text-lg text-white italic">${card.text}</p>
                <p class="text-sm text-gray-400 mt-4">${new Date(card.date).toLocaleDateString()}</p>
            </div>
        `;
    }
}

function displayAngelResult(angelNumber) {
    const resultElement = document.getElementById('angel-result');
    if (resultElement) {
        resultElement.innerHTML = `
            <div class="bg-gradient-to-r from-cosmic-purple/30 to-cosmic-pink/30 p-6 rounded-xl border border-cosmic-gold/50">
                <h3 class="text-2xl font-serif text-cosmic-gold mb-2">Your Angel Number: ${angelNumber}</h3>
                <p class="text-white">This number carries special significance for your spiritual journey.</p>
            </div>
        `;
    }
}

function showError(message) {
    const statusElement = document.getElementById('status-message');
    if (statusElement) {
        statusElement.className = 'text-red-400 bg-red-900/20 p-2 rounded';
        statusElement.textContent = message;
        setTimeout(() => statusElement.textContent = '', 5000);
    }
}

function showSuccess(message) {
    const statusElement = document.getElementById('status-message');
    if (statusElement) {
        statusElement.className = 'text-green-400 bg-green-900/20 p-2 rounded';
        statusElement.textContent = message;
        setTimeout(() => statusElement.textContent = '', 5000);
    }
}

function closeProfileModal() {
    const modal = document.getElementById('profile-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Placeholder functions for API calls
async function saveAngelCalculation(data) {
    // Implement API call to save data
    console.log('Saving angel calculation:', data);
}

async function saveTrackerEntry(entry) {
    // Implement API call to save tracker entry
    console.log('Saving tracker entry:', entry);
}

async function saveUserProfile(data) {
    // Implement API call to save user profile
    console.log('Saving user profile:', data);
}