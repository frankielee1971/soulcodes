import { supabase, isSupabaseConfigured } from './supabase_config.js';
import { getCurrentUser } from './auth.js';

// --- Assets ---
const MOON_PHASES = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Third Quarter', 'Waning Crescent'];
const MOON_ICONS = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];

const JOURNAL_PROMPTS = [
    "What limiting belief am I ready to release today?",
    "How can I show myself unconditional love in this moment?",
    "What is my soul whispering to me?",
    "Where in my life am I being called to be more authentic?",
    "What am I most grateful for in my spiritual journey right now?",
    "How can I raise my vibration today?",
];

// --- Logic ---

function getMoonPhaseIndex() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    // Simple calc
    let jd = 367 * year - Math.floor(7 * (year + Math.floor((month + 9) / 12)) / 4) + Math.floor(275 * month / 9) + day;
    const daysSinceNew = jd - 2451549.5;
    const lunarCycle = 29.53058867;
    let phase = (daysSinceNew / lunarCycle);
    phase -= Math.floor(phase);

    return Math.floor(phase * 8) % 8;
}

export async function saveJournalEntry(content, prompt) {
    const user = await getCurrentUser();
    const phaseIdx = getMoonPhaseIndex();

    const entry = {
        content,
        prompt,
        moon_phase: MOON_PHASES[phaseIdx],
        user_id: user ? user.id : 'anonymous',
        created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
        const { error } = await supabase.from('journal_entries').insert([entry]);
        if (error) {
            console.error('Supabase Journal Error:', error);
            alert('Could not save to cloud. Saving locally.');
            localStorage.setItem('soulcodeJournal', content);
        }
    } else {
        localStorage.setItem('soulcodeJournal', content);
    }

    return true;
}

// --- UI ---

export function initJournal() {
    // 1. Moon Phase
    const phaseIndex = getMoonPhaseIndex();
    const iconEl = document.getElementById('moon-phase-icon');
    const nameEl = document.getElementById('moon-phase-name');

    if (iconEl) iconEl.textContent = MOON_ICONS[phaseIndex];
    if (nameEl) nameEl.textContent = MOON_PHASES[phaseIndex];

    // 2. Prompt
    const promptEl = document.getElementById('journal-prompt');
    if (promptEl) {
        promptEl.textContent = JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)];
    }

    // 3. Save Logic
    const saveBtn = document.getElementById('save-journal-button');
    const statusEl = document.getElementById('save-status');
    const inputEl = document.getElementById('journal-input');

    // Load local draft if exists
    if (inputEl) {
        const saved = localStorage.getItem('soulcodeJournal');
        if (saved) inputEl.value = saved;
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            const content = inputEl.value;
            const prompt = promptEl.textContent;

            statusEl.textContent = 'Saving...';

            await saveJournalEntry(content, prompt);

            statusEl.textContent = 'Ritual saved successfully to the cosmos.';
            setTimeout(() => statusEl.textContent = '', 3000);
        });
    }
}
