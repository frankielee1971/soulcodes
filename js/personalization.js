import { getCurrentUser, getOrCreateUserProfile, updateUserProfile } from './auth.js';
import { calculateLifePath } from './calculators.js';

// --- Assets ---
const AFFIRMATIONS = [
    { text: "I am a radiant being of light, love, and infinite potential.", tags: ['general'] },
    { text: "I release all that no longer serves my highest good.", tags: ['release', '9'] },
    { text: "My intuition is my most trusted guide.", tags: ['intuition', '11', '7'] },
    { text: "I am worthy of all abundance.", tags: ['abundance', '8'] },
    { text: "I am aligned with my soul's purpose.", tags: ['purpose', '1'] },
    { text: "I choose love over fear.", tags: ['love', '6'] },
    { text: "I am a powerful creator.", tags: ['creation', '22', '1'] },
    { text: "My body is a sacred temple.", tags: ['health', '4'] },
    { text: "I see the divine in all beings.", tags: ['spiritual', '33', '9'] },
    { text: "I am grounded and centered.", tags: ['grounding', '4'] },
    { text: "I forgive myself and others.", tags: ['forgiveness', '9', '6'] },
    { text: "Every challenge is an opportunity to grow.", tags: ['growth', '5'] }
];

// --- Profile Logic ---
const profileModal = document.getElementById('profile-modal');
const profileForm = document.getElementById('profile-form');
const personalizedGreeting = document.getElementById('personalized-greeting');

export async function initPersonalization() {
    const user = await getCurrentUser();
    let profile = null;

    if (user && user.id !== 'local-user') {
        profile = await getOrCreateUserProfile(user);
    } else {
        // Fallback to local storage for anonymous/first-time
        const local = localStorage.getItem('soulcodesProfile');
        if (local) profile = JSON.parse(local);
    }

    if (!profile) {
        // Show modal after delay
        // Show modal after delay (LEGACY - NOW HANDLED BY ONBOARDING WIZARD)
        // setTimeout(() => {
        //     if (profileModal) profileModal.classList.remove('hidden');
        // }, 2000);
    } else {
        showPersonalizedGreeting(profile);
    }

    // Event Listeners
    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveProfile();
        });
    }

    // Init Card
    initDailyCard(profile);
}

async function saveProfile() {
    const name = document.getElementById('profile-name').value.trim();
    const birthdate = document.getElementById('profile-birthdate').value;
    const goal = document.getElementById('profile-goal').value;
    const numbers = document.getElementById('profile-numbers').value;

    if (!name || !birthdate) return;

    const lpResult = calculateLifePath(birthdate);

    const profileData = {
        name,
        birthdate,
        goal,
        numbers,
        life_path_number: lpResult ? lpResult.number : null,
        created_at: new Date().toISOString()
    };

    // Save
    const user = await getCurrentUser();
    if (user && user.id !== 'local-user') {
        await updateUserProfile(user.id, profileData);
    } else {
        localStorage.setItem('soulcodesProfile', JSON.stringify(profileData));
    }

    if (profileModal) profileModal.classList.add('hidden');
    showPersonalizedGreeting(profileData);
}

function showPersonalizedGreeting(profile) {
    if (!personalizedGreeting) return;

    const nameDisplay = document.getElementById('user-name-display');
    const lpDisplay = document.getElementById('user-life-path');
    const daysDisplay = document.getElementById('days-since-signup');

    if (nameDisplay) nameDisplay.textContent = profile.name ? profile.name.split(' ')[0] : 'Soul';
    if (lpDisplay) lpDisplay.textContent = profile.life_path_number || '?';

    if (daysDisplay) {
        const start = new Date(profile.created_at || Date.now());
        const diff = Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24));
        daysDisplay.textContent = diff;
    }

    personalizedGreeting.classList.remove('hidden');
}

// --- Daily Card Logic ---

function initDailyCard(profile) {
    const cardContainer = document.getElementById('card-container');
    const textEl = document.getElementById('affirmation-text');
    const drawBtn = document.getElementById('draw-new-card-button');

    function drawCard() {
        let pool = AFFIRMATIONS;

        // Personalize pool if profile exists
        if (profile) {
            // e.g. Boost cards matching Life Path or Goal
            const lpStr = (profile.life_path_number || '').toString();
            // Simple logic: filter for tags that match LP or are general, 
            // OR just pick random but give weight. For MVP, pure random from pool is fine,
            // but let's try to find at least one match if possible.

            const matches = AFFIRMATIONS.filter(a => a.tags.includes(lpStr) || a.tags.includes(profile.goal));
            if (matches.length > 0 && Math.random() > 0.3) { // 70% chance to pick relevant card
                pool = matches;
            }
        }

        const card = pool[Math.floor(Math.random() * pool.length)];
        if (textEl) textEl.textContent = card.text;
    }

    if (drawBtn) {
        drawBtn.addEventListener('click', () => {
            drawCard();
            if (cardContainer) {
                cardContainer.classList.remove('flipped'); // Reset
                setTimeout(() => cardContainer.classList.add('flipped'), 50); // Flip back
            }
        });
    }

    // Card Flip Click
    if (cardContainer) {
        cardContainer.addEventListener('click', () => {
            cardContainer.classList.toggle('flipped');
            // If flipping to reveal and text is empty/loading, draw
            if (cardContainer.classList.contains('flipped')) {
                const currentText = textEl ? textEl.textContent : '';
                if (!currentText || currentText.includes('loading')) {
                    drawCard();
                }
            }
        });
    }
}
