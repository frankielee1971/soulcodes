import { updateUserProfile, getCurrentUser } from './auth.js';
import { calculateLifePath } from './calculators.js';
import { calculateAngelNumber } from './calculators.js'; // Ensure this is exported from calculators.js
// If calculateAngelNumber wasn't exported before, I might need to fix calculators.js first. 
// Based on previous memory, I did export it.

const WIZARD_HTML = `
<div id="onboarding-wizard" class="fixed inset-0 z-50 bg-black/95 text-white flex flex-col items-center justify-center p-6 hidden opacity-0 transition-opacity duration-500">
    <!-- Starfield Background (reused or independent) -->
    <div class="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>

    <!-- Container -->
    <div class="relative max-w-lg w-full text-center space-y-8 animate-fade-in-up">
        
        <!-- Step 1: Welcome -->
        <div id="step-1" class="wizard-step">
            <h1 class="font-serif text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-cosmic-gold via-white to-cosmic-pink mb-4">
                Welcome to Your Sanctuary
            </h1>
            <p class="text-xl text-gray-300 font-light mb-8 leading-relaxed">
                SoulCodes is a space to reconnect with your spirit, decode the universe's signs, and remember who you are.
            </p>
            <button class="next-step-btn px-8 py-4 bg-gradient-to-r from-cosmic-purple to-cosmic-pink rounded-full text-white font-semibold text-lg hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all transform hover:scale-105">
                Begin My Journey
            </button>
        </div>

        <!-- Step 2: Intention -->
        <div id="step-2" class="wizard-step hidden">
            <h2 class="font-serif text-3xl mb-6">Where are you on your path today?</h2>
            <div class="grid grid-cols-1 gap-4 text-left">
                <button class="intention-btn group relative p-6 rounded-xl border border-white/10 hover:border-cosmic-gold/50 bg-white/5 hover:bg-white/10 transition-all" data-intention="Awakening">
                    <span class="text-xl block mb-1 text-cosmic-gold">The Awakening</span>
                    <span class="text-sm text-gray-400">I'm seeing signs everywhere but don't know what they mean.</span>
                </button>
                <button class="intention-btn group relative p-6 rounded-xl border border-white/10 hover:border-cosmic-pink/50 bg-white/5 hover:bg-white/10 transition-all" data-intention="Healing">
                    <span class="text-xl block mb-1 text-cosmic-pink">The Healing</span>
                    <span class="text-sm text-gray-400">I'm recovering from a big change and finding myself again.</span>
                </button>
                <button class="intention-btn group relative p-6 rounded-xl border border-white/10 hover:border-blue-400/50 bg-white/5 hover:bg-white/10 transition-all" data-intention="Expansion">
                    <span class="text-xl block mb-1 text-blue-300">The Expansion</span>
                    <span class="text-sm text-gray-400">I feel good, but I want to go deeper and manifest purpose.</span>
                </button>
            </div>
        </div>

        <!-- Step 3: Blueprint -->
        <div id="step-3" class="wizard-step hidden">
            <h2 class="font-serif text-3xl mb-2">Let's uncover your blueprint.</h2>
            <p class="text-gray-400 mb-8">Your cosmic signature helps us guide you.</p>
            
            <form id="onboarding-form" class="space-y-6">
                <div>
                    <label class="block text-sm text-gray-400 mb-2 text-left">What should we call you?</label>
                    <input type="text" id="wizard-name" required class="w-full bg-white/5 border border-white/20 rounded-lg p-4 text-white focus:border-cosmic-gold outline-none transition-colors" placeholder="Your Name">
                </div>
                <div>
                    <label class="block text-sm text-gray-400 mb-2 text-left">Date of Birth</label>
                    <input type="date" id="wizard-birthdate" required class="w-full bg-white/5 border border-white/20 rounded-lg p-4 text-white focus:border-cosmic-gold outline-none transition-colors">
                </div>
                <button type="submit" class="w-full px-8 py-4 bg-gradient-to-r from-cosmic-purple to-cosmic-pink rounded-full text-white font-semibold text-lg hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all transform hover:scale-105">
                    Reveal My Blueprint
                </button>
            </form>
        </div>

        <!-- Step 4: The Reveal -->
        <div id="step-4" class="wizard-step hidden">
            <div class="animate-pulse mb-6">✨</div>
            <h2 class="font-serif text-3xl mb-4">Welcome Home, <span id="reveal-name" class="text-cosmic-gold">Soul</span>.</h2>
            <p class="text-lg text-gray-300 mb-8">
                You are walking the path of the <span id="reveal-lp" class="font-bold text-white">Life Path X</span>.
                <br>Your soul is ready for this chapter.
            </p>
            <button id="enter-sanctuary-btn" class="px-8 py-4 border border-white/30 rounded-full text-white hover:bg-white/10 transition-all">
                Enter Sanctuary
            </button>
        </div>

    </div>
</div>
`;

export async function initOnboarding() {
    // 1. Inject HTML if not present
    if (!document.getElementById('onboarding-wizard')) {
        document.body.insertAdjacentHTML('beforeend', WIZARD_HTML);
    }

    const user = await getCurrentUser();

    // Check if user already has a profile. If so, skip onboarding (or offer re-onboarding)
    // For MVP, if profile exists in localStorage or Supabase, we assume they are onboarded.
    // However, we want to migrate old "Profile Modal" users to this new rich data.
    // Let's check for 'intention' field. If missing, show Onboarding.

    const localProfile = JSON.parse(localStorage.getItem('soulcodesProfile')) || {};
    // If we have a profile BUT no intention, show wizard (migration path)
    // OR if no profile at all.

    // For dev testing, force show if query param ?onboarding=true
    const urlParams = new URLSearchParams(window.location.search);
    const forceOnboarding = urlParams.get('onboarding');

    if (!localProfile.name || !localProfile.intention || forceOnboarding) {
        showWizard();
    }
}

function showWizard() {
    const wizard = document.getElementById('onboarding-wizard');
    const steps = [
        document.getElementById('step-1'),
        document.getElementById('step-2'),
        document.getElementById('step-3'),
        document.getElementById('step-4')
    ];
    let currentStep = 0;
    let wizardData = {
        intention: '',
        name: '',
        birthdate: ''
    };

    // Show Wizard
    wizard.classList.remove('hidden');
    // Small delay for fade in
    setTimeout(() => wizard.classList.remove('opacity-0'), 100);

    // Navigation Logic
    const nextStep = () => {
        steps[currentStep].classList.add('hidden');
        currentStep++;
        if (steps[currentStep]) {
            steps[currentStep].classList.remove('hidden');
            steps[currentStep].classList.add('animate-fade-in-up');
        }
    };

    // Step 1 Btn
    steps[0].querySelector('.next-step-btn').addEventListener('click', nextStep);

    // Step 2 Intention Btns
    steps[1].querySelectorAll('.intention-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            wizardData.intention = btn.dataset.intention;
            nextStep();
        });
    });

    // Step 3 Form
    const form = document.getElementById('onboarding-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('wizard-name').value;
        const birthdate = document.getElementById('wizard-birthdate').value;

        if (!name || !birthdate) return;

        wizardData.name = name;
        wizardData.birthdate = birthdate;

        // Calculate & Save
        await completeOnboarding(wizardData);

        // Update Step 4 Reveal UI
        const lp = calculateLifePath(birthdate);
        document.getElementById('reveal-name').textContent = name.split(' ')[0];
        document.getElementById('reveal-lp').textContent = `Life Path ${lp ? lp.number : '?'}`;

        nextStep();
    });

    // Step 4 Enter
    const enterBtn = document.getElementById('enter-sanctuary-btn');
    enterBtn.addEventListener('click', () => {
        wizard.classList.add('opacity-0');
        setTimeout(() => {
            wizard.classList.add('hidden');
            // Trigger sanctuary refresh or reload
            window.location.reload();
        }, 500);
    });
}

async function completeOnboarding(data) {
    const lpResult = calculateLifePath(data.birthdate);
    const angelResult = calculateAngelNumber(data.name, data.birthdate);

    const profile = {
        name: data.name,
        birthdate: data.birthdate,
        intention: data.intention, // New field from wizard
        life_path_number: lpResult ? lpResult.number : null,
        angel_number: angelResult ? angelResult.number : null, // Store personal angel number
        created_at: new Date().toISOString()
    };

    const user = await getCurrentUser();
    if (user && user.id !== 'local-user') {
        await updateUserProfile(user.id, profile);
    } else {
        localStorage.setItem('soulcodesProfile', JSON.stringify(profile));
    }
}
