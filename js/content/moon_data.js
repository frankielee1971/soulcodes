// Moon Phase Data & Energy
export const MOON_PHASES = {
    0: { // New Moon
        name: "New Moon",
        icon: "🌑",
        energy: "New Beginnings & Dreaming",
        prompt: "What seed of intention am I planting for this cycle?",
        action: "Set your intentions."
    },
    1: { // Waxing Crescent
        name: "Waxing Crescent",
        icon: "🌒",
        energy: "Faith & Courage",
        prompt: "What small step can I take towards my dream today?",
        action: "Take the first step."
    },
    2: { // First Quarter
        name: "First Quarter",
        icon: "🌓",
        energy: "Action & Challenges",
        prompt: "What obstacle is asking me to grow stronger right now?",
        action: "Push through resistance."
    },
    3: { // Waxing Gibbous
        name: "Waxing Gibbous",
        icon: "🌔",
        energy: "Refining & Adjusting",
        prompt: "What details need my attention before the manifestation?",
        action: "Refine your plans."
    },
    4: { // Full Moon
        name: "Full Moon",
        icon: "🌕",
        energy: "Peak Release & Celebration",
        prompt: "What am I ready to release and what am I celebrating?",
        action: "Release and celebrate."
    },
    5: { // Waning Gibbous
        name: "Waning Gibbous",
        icon: "🌖",
        energy: "Gratitude & Receiving",
        prompt: "How can I open myself to receive the blessings coming my way?",
        action: "Practice gratitude."
    },
    6: { // Third Quarter
        name: "Third Quarter",
        icon: "🌗",
        energy: "Evaluation & Transition",
        prompt: "What lessons have I learned this cycle that I want to keep?",
        action: "Reflect and assess."
    },
    7: { // Waning Crescent
        name: "Waning Crescent",
        icon: "🌘",
        energy: "Rest & Surrender",
        prompt: "How can I nurture my spirit as I prepare for a new beginning?",
        action: "Rest and recharge."
    }
};

export const getMoonPhaseData = (phaseIndex) => {
    // Phase index should be 0-7
    return MOON_PHASES[phaseIndex] || MOON_PHASES[0];
};
