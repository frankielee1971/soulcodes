import { supabase, isSupabaseConfigured } from './supabase_config.js';
import { getCurrentUser } from './auth.js';

export async function logSighting(number, location, notes, mood, context) {
    const user = await getCurrentUser();
    const sighting = {
        number,
        location,
        notes,
        mood,
        context,
        datetime: new Date().toISOString(),
        user_id: user ? user.id : 'anonymous'
    };

    if (isSupabaseConfigured()) {
        const { error } = await supabase.from('angel_sightings').insert([sighting]);
        if (error) {
            console.error('Error logging sighting to Supabase:', error);
            alert('Failed to save sighting to cloud. Saving locally.');
            saveLocally(sighting);
        }
    } else {
        saveLocally(sighting);
    }

    return sighting;
}

// ... (saveLocally, getSightings, deleteSighting remain same) ...

export async function initTracker() {
    const logBtn = document.getElementById('log-sighting');
    const listContainer = document.getElementById('sightings-list');

    async function renderList() {
        if (!listContainer) return;

        listContainer.innerHTML = '<p class="text-gray-400 text-center">Loading...</p>';
        const sightings = await getSightings();

        if (sightings.length === 0) {
            listContainer.innerHTML = '<p class="text-gray-400 text-center italic">No sightings recorded yet.</p>';
            return;
        }

        listContainer.innerHTML = sightings.map((s, idx) => `
            <div class="bg-white/5 rounded-xl p-4 border border-cosmic-purple/30 hover:border-cosmic-gold/50 transition-all">
                <div class="flex justify-between items-start mb-2">
                    <div class="flex-1">
                        <span class="font-serif text-3xl text-cosmic-gold text-shadow-glow-gold">${s.number}</span>
                        <span class="text-gray-400 text-sm ml-3">${new Date(s.datetime || s.created_at).toLocaleString()}</span>
                    </div>
                    <button data-id="${s.id || idx}" class="delete-btn text-red-400 hover:text-red-300 text-sm">Delete</button>
                </div>
                <div class="flex flex-wrap gap-2 text-xs mb-2">
                    ${s.mood ? `<span class="px-2 py-1 rounded bg-cosmic-pink/20 text-cosmic-pink border border-cosmic-pink/30">Mood: ${s.mood}</span>` : ''}
                    ${s.context ? `<span class="px-2 py-1 rounded bg-cosmic-purple/20 text-cosmic-purple border border-cosmic-purple/30">Context: ${s.context}</span>` : ''}
                </div>
                ${s.location ? `<p class="text-gray-300 text-sm mb-1"><span class="text-cosmic-pink">📍</span> ${s.location}</p>` : ''}
                ${s.notes ? `<p class="text-gray-400 text-sm italic mt-2">"${s.notes}"</p>` : ''}
            </div>
        `).join('');

        // Re-attach listeners because innerHTML wipes them
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                if (confirm('Delete this sighting?')) {
                    await deleteSighting(e.target.dataset.id);
                    renderList();
                }
            });
        });
    }

    if (logBtn) {
        logBtn.addEventListener('click', async () => {
            const number = document.getElementById('sighting-number').value.trim();
            const location = document.getElementById('sighting-location').value.trim();
            const notes = document.getElementById('sighting-notes').value.trim();
            const mood = document.getElementById('sighting-mood') ? document.getElementById('sighting-mood').value : '';
            const context = document.getElementById('sighting-context') ? document.getElementById('sighting-context').value : '';

            if (!number) {
                alert('Please enter a number.');
                return;
            }

            await logSighting(number, location, notes, mood, context);

            // Clear
            document.getElementById('sighting-number').value = '';
            document.getElementById('sighting-location').value = '';
            document.getElementById('sighting-notes').value = '';
            if (document.getElementById('sighting-mood')) document.getElementById('sighting-mood').value = '';
            if (document.getElementById('sighting-context')) document.getElementById('sighting-context').value = '';

            renderList();
        });
    }

    // Initial Render
    renderList();
}
