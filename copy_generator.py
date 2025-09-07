
import os
from datetime import datetime

# 🧠 Keyword-to-archetype map
keyword_map = {
	"affiliate": "Affiliate Strategist",
	"faceless": "Faceless Funnel",
	"mystic": "Mystic Messenger",
	"ugc": "UGC Creator",
	"confidence": "Radiant Rebel",
	"automation": "Backend Oracle",
	"branding": "Radiant Rebel",
	"spiritual": "Mystic Messenger",
	"sovereignty": "Faceless Funnel",
	"conversion": "Affiliate Strategist"
}

# 🧬 Detect archetype from filename
def detect_archetype(file_name):
	lower_name = file_name.lower()
	for keyword, archetype in keyword_map.items():
		if keyword in lower_name:
			return archetype
	return "General Entrepreneurial"

# 📝 Generate copy block
def generate_copy(file_name, archetype):
	headline = f"Unlock Your {archetype} Power"
	subhead = f"This resource—“{file_name}”—was crafted for the {archetype} path. It’s time to activate your digital destiny."
	cta = f"✨ Download now and begin your {archetype}-coded journey."
	return headline, subhead, cta

# 🧾 Log output
def log_copy(file_name, headline, subhead, cta, log_path="copy_log.txt"):
	timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
	with open(log_path, "a", encoding="utf-8") as log:
		log.write(f"\n[{timestamp}] {file_name}\n")
		log.write(f"Headline: {headline}\n")
		log.write(f"Subhead: {subhead}\n")
		log.write(f"CTA: {cta}\n")

# 🚀 Main invocation
def generate_all_copy():
	# Pull filenames from processing_log.txt
	log_path = "processing_log.txt"
	if not os.path.exists(log_path):
		print("⚠️ No processing_log.txt found. Run agent_tars.py first.")
		return

	with open(log_path, "r", encoding="utf-8") as log:
		lines = log.readlines()

	for line in lines:
		if "→" not in line:
			continue
		file_name = line.split("|")[1].split("→")[0].strip()
		archetype = detect_archetype(file_name)
		headline, subhead, cta = generate_copy(file_name, archetype)
		print(f"\n📝 {file_name}")
		print(f"Headline: {headline}")
		print(f"Subhead: {subhead}")
		print(f"CTA: {cta}")
		log_copy(file_name, headline, subhead, cta)

	print("\n✅ Copy generation complete. Log saved to copy_log.txt.")

# 🧙‍♀️ Invoke the ritual
if __name__ == "__main__":
	generate_all_copy()
