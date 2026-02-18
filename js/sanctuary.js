import { getCurrentUser, getOrCreateUserProfile } from './auth.js';
import { getMeaning } from './content/angel_meanings.js';
import { getMoonPhaseData } from './content/moon_data.js';
import { getLifePathData } from './content/life_paths.js';

// --- UI Elements ---
const dashboardEl = document.getElementById('sanctuary-dashboard');
const toolsEl = document.getElementById('tools-section');

export async function initSanctuary() {
    // 1. Get User Profile
    const user = await getCurrentUser();
    let profile = null;
    if (user) {
        profile = await getOrCreateUserProfile(user);
    } else {
        profile = JSON.parse(localStorage.getItem('soulcodesProfile'));
    }

    if (!profile) return; // Wait for onboarding

    // 2. Render Header
    renderHeader(profile);

    // 3. Render Daily Ritual (Hero)
    renderDailyRitual(profile);

    // 4. Render Products (Cosmic Source Code)
    renderSourceCodeCTA(profile);
}

function renderHeader(profile) {
    const nameEl = document.getElementById('sanctuary-greeting');
    const daysEl = document.getElementById('days-counter');

    if (nameEl) nameEl.textContent = `Good Morning, ${profile.name.split(' ')[0]}`;

    if (daysEl) {
        const start = new Date(profile.created_at || Date.now());
        const diff = Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24));
        daysEl.textContent = `Day ${diff} of your awakening`; // Simpler text
    }
}

function renderSourceCodeCTA(profile) {
    const dashboard = document.getElementById('sanctuary-dashboard');
    const existingCTA = document.getElementById('source-code-cta');
    if (existingCTA) return;

    const ctaHTML = `
        <div id="source-code-cta" class="w-full max-w-4xl mt-12 mb-8 animate-fade-in-up delay-300">
            <div class="relative overflow-hidden group rounded-2xl border border-cosmic-gold/30 bg-gradient-to-r from-black/60 to-cosmic-midnight/60 p-8 text-left">
                <!-- Background Glow -->
                <div class="absolute -right-20 -top-20 w-64 h-64 bg-cosmic-gold/20 blur-[100px] group-hover:bg-cosmic-gold/30 transition-all"></div>
                
                <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 class="text-2xl font-serif text-white mb-2">The Cosmic Source Code</h3>
                        <p class="text-gray-300 max-w-lg mb-4">
                            You are living as a <span class="text-cosmic-pink font-bold">Life Path ${profile.life_path_number || '?'}</span>, 
                            but that is just the cover of your soul's book. Unlock your full 20-page energetic blueprint.
                        </p>
                        <div class="flex items-center gap-2 text-xs text-cosmic-gold uppercase tracking-widest">
                            <span>✨ Soul Urge</span>
                            <span>•</span>
                            <span>🌑 Shadow Work</span>
                            <span>•</span>
                            <span>🔮 12-Month Forecast</span>
                        </div>
                    </div>
                    <button id="unlock-report-btn" class="shrink-0 px-8 py-4 bg-cosmic-gold text-black font-bold rounded-full hover:scale-105 hover:shadow-[0_0_20px_rgba(241,196,15,0.4)] transition-transform">
                        Unlock Report ($27)
                    </button>
                </div>
            </div>
        </div>
    `;

    // Insert before tools section
    const tools = document.getElementById('tools-section');
    if (tools) {
        tools.insertAdjacentHTML('beforebegin', ctaHTML);
    }

    // Attach Event
    document.getElementById('unlock-report-btn').addEventListener('click', () => {
        import('./products/report_generator.js').then(({ ReportGenerator }) => {
            const generator = new ReportGenerator(profile);
            const html = generator.generateHTML();
            showReportModal(html);
        });
    });
}

function showReportModal(htmlContent) {
    // Basic modal implementation
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in';
    modal.innerHTML = `
        <div class="bg-white text-black w-full max-w-4xl h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative">
            <button class="absolute top-4 right-4 text-gray-500 hover:text-black text-3xl font-bold z-10">&times;</button>
            
            <div id="report-preview" class="p-8">
                ${htmlContent}
            </div>

            <div class="sticky bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 flex justify-between items-center">
                 <p class="text-sm text-gray-500">Preview Mode</p>
                 <button class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-bold shadow-lg">
                    Download PDF (Simulated)
                 </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close Logic
    const closeBtn = modal.querySelector('button');
    closeBtn.addEventListener('click', () => modal.remove());
}

function renderDailyRitual(profile) {
    // A. Moon Phase
    // calculate index... reuse logic or import?
    // Let's assume we can get phase index. For now simple calc or reuse from journal.js if we exported it?
    // I'll reuse the simple calc here for decoupling or import if I refactor journal.js.
    // For speed, let's copy the helper or make it shared util later.
    const phaseIndex = getMoonPhaseSimple();
    const moonData = getMoonPhaseData(phaseIndex);

    const moonIconEl = document.getElementById('daily-moon-icon');
    const moonTextEl = document.getElementById('daily-moon-text');
    if (moonIconEl) moonIconEl.textContent = moonData.icon;
    if (moonTextEl) moonTextEl.textContent = `${moonData.name}: ${moonData.energy}`;

    // B. Focus Angel Number
    // Use their personal number OR a daily random one?
    // Logic: 50% chance of Personal Angel Number (if exists), 50% chance of random daily guide.
    const personalNum = profile.angel_number;
    let focusNum = "444"; // default

    if (personalNum && Math.random() > 0.5) {
        focusNum = personalNum;
    } else {
        const keys = ["111", "222", "333", "444", "555", "777", "888", "1111"];
        focusNum = keys[Math.floor(Math.random() * keys.length)];
    }

    const angelData = getMeaning(focusNum);

    document.getElementById('daily-angel-number').textContent = focusNum;
    document.getElementById('daily-angel-msg').textContent = angelData.message;

    // C. Affirmation
    // Tie to Life Path?
    const lp = profile.life_path_number || 1;
    const lpData = getLifePathData(lp);

    // Or use the Angel Affirmation? Let's use Angel Affirmation for coherence with the number.
    document.getElementById('daily-affirmation').textContent = angelData.affirmation;

    // D. Journal Prompt
    // Use Moon Phase prompt
    document.getElementById('daily-journal-prompt').textContent = moonData.prompt;

    // Setup Action Button to scroll to Journal
    document.getElementById('start-ritual-btn').addEventListener('click', () => {
        document.getElementById('soul-journal').scrollIntoView({ behavior: 'smooth' });
    });
}

function getMoonPhaseSimple() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    let jd = 367 * year - Math.floor(7 * (year + Math.floor((month + 9) / 12)) / 4) + Math.floor(275 * month / 9) + day;
    const daysSinceNew = jd - 2451549.5;
    const lunarCycle = 29.53058867;
    let phase = (daysSinceNew / lunarCycle);
    phase -= Math.floor(phase);
    return Math.floor(phase * 8) % 8;
}
