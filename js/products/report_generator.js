import { REPORT_CONTENT } from './report_content.js';
import { calculateLifePath } from '../calculators.js';

// We will use a simple HTML-based modal to "Show" the report for MVP, 
// rather than a complex PDF library download immediately. 
// This keeps it lightweight. User can "Print to PDF" if they want.
// Or we can construct a Blob.

export class ReportGenerator {
    constructor(userProfile) {
        this.user = userProfile;
    }

    generateHTML() {
        const lp = this.user.life_path_number || calculateLifePath(this.user.birthdate).number;
        const name = this.user.name;
        const data = REPORT_CONTENT.life_paths[lp] || REPORT_CONTENT.life_paths[1];

        // Simple Soul Urge Mock (using vowels)
        // A=1, E=5, I=9, O=6, U=3
        const soulUrge = this.calculateSoulUrge(name);

        return `
            <div class="soul-report p-8 max-w-2xl mx-auto bg-white text-black font-serif">
                <div class="text-center border-b-2 border-black pb-8 mb-8">
                    <h1 class="text-4xl font-bold uppercase tracking-widest mb-2">${REPORT_CONTENT.intro.title}</h1>
                    <h2 class="text-xl italic text-gray-600">${REPORT_CONTENT.intro.subtitle}</h2>
                    <p class="mt-4 text-sm font-sans text-gray-500">Prepared for ${name} | ${new Date().toLocaleDateString()}</p>
                </div>

                <div class="mb-12">
                    <p class="text-lg leading-relaxed font-sans">${REPORT_CONTENT.intro.welcome}</p>
                </div>

                <div class="mb-12">
                    <h3 class="text-2xl font-bold mb-4 uppercase">Your Life Path: ${lp} - ${data.title}</h3>
                    <p class="text-lg leading-relaxed mb-6">${data.essay}</p>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-gray-100 p-4 rounded">
                            <h4 class="font-bold text-sm uppercase mb-2">Your Superpower</h4>
                            <p class="text-sm">${data.superpower}</p>
                        </div>
                        <div class="bg-gray-100 p-4 rounded">
                            <h4 class="font-bold text-sm uppercase mb-2">Your Shadow</h4>
                            <p class="text-sm">${data.challenge}</p>
                        </div>
                    </div>
                </div>

                <div class="mb-12">
                    <h3 class="text-2xl font-bold mb-4 uppercase">Soul Urge: ${soulUrge}</h3>
                    <p class="text-lg leading-relaxed mb-4">${REPORT_CONTENT.soul_urge_intro}</p>
                    <p class="italic">"Your soul craves expression through vibration ${soulUrge}."</p>
                </div>

                <div class="text-center pt-12 border-t border-gray-200">
                    <p class="text-sm text-gray-500">${REPORT_CONTENT.closing}</p>
                    <p class="text-xs text-gray-400 mt-2">© SoulCodes 2026</p>
                </div>
            </div>
        `;
    }

    calculateSoulUrge(name) {
        const vowels = { 'a': 1, 'e': 5, 'i': 9, 'o': 6, 'u': 3, 'y': 7 };
        const lowerName = name.toLowerCase();
        let sum = 0;
        for (let char of lowerName) {
            if (vowels[char]) sum += vowels[char];
        }

        // Reduce
        while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
            sum = sum.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
        }
        return sum || 1;
    }
}
