import { supabase, isSupabaseConfigured } from './supabase_config.js';
import { updateUserProfile, getCurrentUser } from './auth.js';

// --- Angel Number Calculator ---

const ANGEL_MEANINGS = {
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

export function calculateAngelNumber(name, birthdate) {
    const letterValues = {
        'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9,
        'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 6, 'p': 7, 'q': 8, 'r': 9,
        's': 1, 't': 2, 'u': 3, 'v': 4, 'w': 5, 'x': 6, 'y': 7, 'z': 8
    };

    let nameSum = 0;
    if (name) {
        name.toLowerCase().split('').forEach(char => {
            if (letterValues[char]) {
                nameSum += letterValues[char];
            }
        });
    }

    const dateSum = birthdate.split('-').join('').split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    let total = nameSum + dateSum;

    // Reduce logic
    while (total > 33 && total !== 11 && total !== 22 && total !== 33) {
        total = total.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    }
    if (total > 9 && total !== 11 && total !== 22 && total !== 33) {
        total = total.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    }

    return {
        number: total,
        meaning: ANGEL_MEANINGS[total] || ANGEL_MEANINGS[total % 10]
    };
}

// --- Life Path Calculator ---

const LIFE_PATH_MEANINGS = {
    1: "You are a natural leader and pioneer. Your path is about independence, innovation, and being first.",
    2: "You are the peacemaker and diplomat. Your purpose involves creating harmony and building partnerships.",
    3: "You are the creative communicator. Your life path is about self-expression, joy, and inspiring others.",
    4: "You are the builder and organizer. Your path involves creating solid foundations and bringing order.",
    5: "You are the freedom seeker. Your purpose is about experiencing life fully and embracing change.",
    6: "You are the nurturer and healer. Your path centers on love, family, and community service.",
    7: "You are the seeker of truth. Your journey involves deep spiritual understanding and analysis.",
    8: "You are the manifestor of abundance. Your path is about material success and leadership.",
    9: "You are the humanitarian. Your purpose is about compassion and serving humanity.",
    11: "Master Number 11 - The Illuminator. Your path involves inspiring others through intuition.",
    22: "Master Number 22 - The Master Builder. You manifest grand visions for humanity.",
    33: "Master Number 33 - The Master Teacher. You heal through love and spiritual teaching."
};

export function calculateLifePath(birthdate) {
    const parts = birthdate.split('-');
    if (parts.length !== 3) return null;

    let total = 0;
    parts.forEach(part => {
        total += part.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    });

    while (total > 33 && total !== 11 && total !== 22 && total !== 33) {
        total = total.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    }
    if (total > 9 && total !== 11 && total !== 22 && total !== 33) {
        total = total.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    }

    return {
        number: total,
        meaning: LIFE_PATH_MEANINGS[total] || LIFE_PATH_MEANINGS[total % 10]
    };
}

// --- UI Binding & Saving ---

export function initCalculators() {
    // Angel Calculator
    const calcBtn = document.getElementById('calculate-angel-number');
    if (calcBtn) {
        calcBtn.addEventListener('click', async () => {
            const name = document.getElementById('calc-name').value.trim();
            const birthdate = document.getElementById('calc-birthdate').value;

            if (!name || !birthdate) {
                alert('Please enter both name and birthdate.');
                return;
            }

            const result = calculateAngelNumber(name, birthdate);

            // Display
            document.getElementById('angel-number-display').textContent = result.number;
            document.getElementById('angel-meaning').textContent = result.meaning;
            document.getElementById('angel-result').classList.remove('hidden');

            // Save to Profile
            const user = await getCurrentUser();
            if (user && isSupabaseConfigured()) {
                await updateUserProfile(user.id, {
                    angel_number: result.number,
                    birthdate: birthdate // also save birthdate if we have it
                });
            }
        });
    }

    // Life Path Calculator
    const lpBtn = document.getElementById('calculate-life-path');
    if (lpBtn) {
        lpBtn.addEventListener('click', async () => {
            const birthdate = document.getElementById('lifepath-birthdate').value;
            const name = document.getElementById('lifepath-name').value.trim();

            if (!birthdate) {
                alert('Please enter your birthdate.');
                return;
            }

            // Dynamic Import for Rich Content
            const { REPORT_CONTENT } = await import('./products/report_content.js');
            const result = calculateLifePath(birthdate);
            const richData = REPORT_CONTENT.life_paths[result.number] || REPORT_CONTENT.life_paths[1];

            // Display
            document.getElementById('lifepath-number').textContent = result.number;
            document.getElementById('lifepath-title').textContent = richData.title;
            // Use the shorter "welcome" text or the first sentence of the essay for the summary
            document.getElementById('lifepath-meaning').textContent = richData.essay.split('.')[0] + '.';

            document.getElementById('lifepath-superpower').textContent = richData.superpower;
            document.getElementById('lifepath-shadow').textContent = richData.challenge;

            const resultContainer = document.getElementById('lifepath-result');
            resultContainer.classList.remove('hidden');
            resultContainer.scrollIntoView({ behavior: 'smooth' });

            // Hook up "Unlock Full Report" button
            const unlockBtn = document.getElementById('unlock-full-report-btn');
            if (unlockBtn) {
                // Clone to remove old listeners if re-calc
                const newBtn = unlockBtn.cloneNode(true);
                unlockBtn.parentNode.replaceChild(newBtn, unlockBtn);

                newBtn.addEventListener('click', () => {
                    import('./products/report_generator.js').then(({ ReportGenerator }) => {
                        const profile = { name: name || 'Seeker', birthdate: birthdate, life_path_number: result.number };
                        const generator = new ReportGenerator(profile);
                        // We need a way to show the modal from here. 
                        // Since showReportModal is not exported from sanctuary.js, we should likely export it or duplicate/move common UI logic.
                        // For now, I'll inline the modal creation logic here for simplicity/MVP.

                        const html = generator.generateHTML();

                        // Inline Modal Logic (Quick MVP)
                        const modal = document.createElement('div');
                        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in';
                        modal.innerHTML = `
                            <div class="bg-white text-black w-full max-w-4xl h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative">
                                <button class="absolute top-4 right-4 text-gray-500 hover:text-black text-3xl font-bold z-10">&times;</button>
                                <div class="p-8">${html}</div>
                            </div>
                        `;
                        document.body.appendChild(modal);
                        modal.querySelector('button').addEventListener('click', () => modal.remove());
                    });
                });
            }

            // Save to Profile
            const user = await getCurrentUser();
            if (user && isSupabaseConfigured()) {
                const updates = { life_path_number: result.number, birthdate: birthdate };
                if (name) updates.full_name = name;

                await updateUserProfile(user.id, updates);
            }
        });
    }
}
