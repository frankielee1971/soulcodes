// Angel Number Meanings - "Big Sister" Voice
export const ANGEL_MEANINGS = {
    "111": {
        meaning: "Intuition & Alignment",
        message: "Your thoughts are manifesting rapidly. Keep your vibration high.",
        affirmation: "I am a powerful creator aligned with my soul's purpose."
    },
    "222": {
        meaning: "Balance & Harmony",
        message: "You are exactly where you need to be. Trust the timing of your life.",
        affirmation: "I trust that everything is working out for my highest good."
    },
    "333": {
        meaning: "Support & Expansion",
        message: " The ascended masters are surrounding you with love and guidance.",
        affirmation: "I am supported, loved, and guided by the divine."
    },
    "444": {
        meaning: "Protection & Stability",
        message: "You are safe and protected. The angels are building a foundation with you.",
        affirmation: "I am grounded, safe, and intuitively led."
    },
    "555": {
        meaning: "Change & Freedom",
        message: "A major shift is coming. Embrace the new adventure with an open heart.",
        affirmation: "I welcome change with excitement and grace."
    },
    "666": {
        meaning: "Reflection & Realignment",
        message: "It’s time to find balance between the material and the spiritual. Reconnect with yourself.",
        affirmation: "I release fear and align with love and abundance."
    },
    "777": {
        meaning: "Luck & Wisdom",
        message: "You are on the right spiritual path. Keep listening to your inner wisdom.",
        affirmation: "I am filled with divine wisdom and guided by intuition."
    },
    "888": {
        meaning: "Abundance & Power",
        message: "Financial and spiritual abundance is flowing to you. You are a manifestor.",
        affirmation: "I am a magnet for miracles and prosperity."
    },
    "999": {
        meaning: "Completion & Release",
        message: "A cycle is ending. Let go of what no longer serves you to make room for the new.",
        affirmation: "I release the past with love and step into my new beginning."
    },
    "1111": {
        meaning: "Awakening Portal",
        message: "The universe is snapping a picture of your thoughts right now. Make a wish.",
        affirmation: "I am awakened to my highest potential."
    }
};

export const getMeaning = (number) => {
    // Basic normalization
    const key = number.toString();
    return ANGEL_MEANINGS[key] || {
        meaning: "Divine Guidance",
        message: "The angels are with you. Trust your intuition to decode this message.",
        affirmation: "I am open to the signs and symbols of the universe."
    };
};
