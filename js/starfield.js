export function initStarfield() {
    const starsContainer = document.getElementById('stars-container');
    if (!starsContainer) return;

    // Clear existing stars to prevent duplicates on re-init
    starsContainer.innerHTML = '';

    // Adjust star count based on screen size for performance
    const starCount = window.innerWidth < 768 ? 100 : 200;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        // Randomize size: mostly small, fresh connection points
        const isLarge = Math.random() > 0.9;
        const size = isLarge ? Math.random() * 2 + 2 : Math.random() * 1.5 + 1;

        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        // Random placement
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;

        // Cosmic opacity variability
        star.style.opacity = (Math.random() * 0.7 + 0.1).toFixed(2);

        // Animation params
        const duration = Math.random() * 3 + 2; // 2-5s
        const delay = Math.random() * 3;

        star.style.animationName = 'star-blink';
        star.style.animationDuration = `${duration}s`;
        star.style.animationDelay = `${delay}s`;
        star.style.animationIterationCount = 'infinite';
        star.style.animationDirection = 'alternate';
        star.style.animationTimingFunction = 'ease-in-out';

        // Add subtle color tints (White, Gold, Pink hints)
        const randomColor = Math.random();
        if (randomColor > 0.9) {
            star.style.backgroundColor = '#f1c40f'; // Gold hint
            star.style.boxShadow = `0 0 ${size * 2}px rgba(241, 196, 15, 0.6)`;
        } else if (randomColor > 0.85) {
            star.style.backgroundColor = '#ff69b4'; // Pink hint
            star.style.boxShadow = `0 0 ${size * 2}px rgba(255, 105, 180, 0.6)`;
        } else {
            star.style.backgroundColor = '#ffffff';
            star.style.boxShadow = `0 0 ${size * 1.5}px rgba(255, 255, 255, 0.4)`;
        }

        fragment.appendChild(star);
    }

    starsContainer.appendChild(fragment);
}

// Handle resize with debounce to avoid thrashing
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Optional: Re-init or just let CSS handle it?
        // Since positions are %, CSS handles position. 
        // Only need to re-init if we want to change density logic.
        // For now, let's keep it static to avoid visual resetting.
        // initStarfield(); 
    }, 200);
});
