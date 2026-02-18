// Life Path Archetypes & Rituals
export const LIFE_PATHS = {
    1: {
        archetype: "The Pioneer",
        strengths: "Leadership, Independence, Innovation",
        shadow: "Self-doubt, Aggression",
        ritual: "Take yourself on a solo date to reconnect with your independent spirit."
    },
    2: {
        archetype: "The Peacemaker",
        strengths: "Diplomacy, Empathy, Intuition",
        shadow: "Over-sensitivity, Self-sacrifice",
        ritual: "Light a pink candle and write a letter of forgiveness to someone (or yourself)."
    },
    3: {
        archetype: "The Creative",
        strengths: "Expression, Joy, Communication",
        shadow: "Scattered energy, Superficiality",
        ritual: "Spend 20 minutes creating something—writing, drawing, or dancing—just for fun."
    },
    4: {
        archetype: "The Builder",
        strengths: "Stability, Order, Dedication",
        shadow: "Rigidity, Stubbornness",
        ritual: "Declutter one small corner of your home to create physical and mental space."
    },
    5: {
        archetype: "The Adventurer",
        strengths: "Freedom, Adaptability, Change",
        shadow: "Restlessness, Over-indulgence",
        ritual: "Go for a walk in a new neighborhood or try a new food to feed your need for variety."
    },
    6: {
        archetype: "The Nurturer",
        strengths: "Love, Responsibility, Protection",
        shadow: "Perfectionism, Meddling",
        ritual: "Buy yourself fresh flowers or cook a nourishing meal to honor your caring energy."
    },
    7: {
        archetype: "The Seeker",
        strengths: "Wisdom, Analysis, Spirituality",
        shadow: "Isolation, Cynicism",
        ritual: "Spend 15 minutes in meditation or deep contemplation in nature."
    },
    8: {
        archetype: "The Powerhouse",
        strengths: "Abundance, Authority, Vision",
        shadow: "Materialism, Control issues",
        ritual: "Review your finances or goals with gratitude, affirming your ability to manifest."
    },
    9: {
        archetype: "The Humanitarian",
        strengths: "Compassion, Generosity, Healing",
        shadow: "Resentment, Martyrdom",
        ritual: "Perform one random act of kindness or donate to a cause you believe in."
    },
    11: {
        archetype: "The Illuminator (Master)",
        strengths: "Intuition, Inspiration, Light",
        shadow: "Anxiety, Nervous tension",
        ritual: "Practice grounding visualization to anchor your high-vibrational energy."
    },
    22: {
        archetype: "The Master Builder",
        strengths: "Manifestation, Practical Visionary",
        shadow: "Overwhelm, unfulfilled potential",
        ritual: "Write down your biggest dream and one practical step you can take towards it today."
    },
    33: {
        archetype: "The Master Teacher",
        strengths: "Altruism, Spiritual Uplifting",
        shadow: "Burdened by the world's pain",
        ritual: "Send energy healing or a prayer to the world, then seal your own energy field."
    }
};

export const getLifePathData = (number) => {
    return LIFE_PATHS[number] || LIFE_PATHS[1]; // Fallback
};
