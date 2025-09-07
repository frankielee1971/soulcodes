
import os
from datetime import datetime
from googleapiclient.discovery import build
from google.oauth2 import service_account
from notion_logger import log_to_notion
import json

with open('config/credentials.json') as f:
    creds = json.load(f)

dashboard_id = creds['soulcodes_dashboard_page_id']
webhook_url = creds['agent_tars_webhook']

# 🔐 Service account setup
SERVICE_ACCOUNT_FILE = r"C:\\Users\\frank\\OneDrive\\Desktop\\SoulCodesSchema\\digitallydefined_ai\\soulcodedriveagent-key.json"
SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly']
FOLDER_ID = '1yqbTlF8FuNUPhHb0z9vBv8HhgMV-UzwA'  # DigitallyDefined folder

# 🧠 Keyword-to-archetype map (aligned with config.py and Notion)
keyword_map = {
	"affiliate": "Affiliate Strategist",
	"faceless": "Faceless Funnel Architect",
	"mystic": "Mystic Builder",
	"ugc": "Radiant Rebel",
	"confidence": "Empowerment Guide",
	"automation": "Backend Oracle",
	"branding": "Radiant Rebel",
	"spiritual": "Mystic Builder",
	"sovereignty": "Faceless Funnel Architect",
	"conversion": "Affiliate Strategist"
}
# 🔮 Keyword-to-ritual type map
ritual_map = {
    "affiliate": "Conversion",
    "faceless": "Presence",
    "mystic": "Integration",
    "ugc": "Visibility",
    "confidence": "Empowerment",
    "automation": "Flow",
    "branding": "Resonance",
    "spiritual": "Alignment",
    "sovereignty": "Containment",
    "conversion": "Magnetism"
}

# 🧬 Check if file already processed
def already_processed(file_name, log_path="processing_log.txt"):
	if not os.path.exists(log_path):
		return False
	with open(log_path, "r", encoding="utf-8") as log:
		return file_name in log.read()

# 🧾 Mark file as processed
def mark_as_processed(file_name, log_path="processing_log.txt"):
	with open(log_path, "a", encoding="utf-8") as log:
		log.write(file_name + "\n")

# 🚀 Activate Agent TARS
def activate_agent_tars():
	creds = service_account.Credentials.from_service_account_file(
		SERVICE_ACCOUNT_FILE, scopes=SCOPES
	)
	service = build('drive', 'v3', credentials=creds)

	# 🔍 Scan folder for files
	results = service.files().list(
		q=f"'{FOLDER_ID}' in parents and trashed = false",
		fields="files(name, id)"
	).execute()

	files = results.get('files', [])
	if not files:
		print("📁 No files found in DigitallyDefined folder.")
		return

	for file in files:
		file_name = file['name']
		if already_processed(file_name):
			print(f"⏭️ Skipping {file_name} (already processed)")
			continue

		# 🧠 Match keyword to archetype
		matched_archetype = "Unknown Archetype"
		for keyword, archetype in keyword_map.items():
			if keyword.lower() in file_name.lower():
				matched_archetype = archetype
				break
# 🔮 Match keyword to ritual type
matched_ritual_type = "Visibility"  # default fallback
for keyword in ritual_map:
    if keyword.lower() in file_name.lower():
        matched_ritual_type = ritual_map[keyword]
        break

	# 📝 Log to Notion
log_to_notion(
    file_name=file_name,
    archetype=matched_archetype,
    element="Water",
    notes="Auto-logged by Agent TARS"
)

# 🧬 Create Ritual Page
create_ritual_page(matched_archetype, "Visibility")

		# ✅ Mark as processed
		mark_as_processed(file_name)

# 🔔 Run the agent
if __name__ == "__main__":
	activate_agent_tars()
# 🧬 Create Ritual Page in Notion
def create_ritual_page(archetype, ritual_type):
    import requests

    page_title = f"{archetype} – {ritual_type} Ritual Tracker"
    payload = {
        "parent": { "page_id": dashboard_id },
        "properties": {
            "title": {
                "title": [
                    { "text": { "content": page_title } }
                ]
            }
        },
        "children": [
            {
                "object": "block",
                "type": "heading_2",
                "heading_2": {
                    "text": [{ "type": "text", "text": { "content": f"{ritual_type} Ritual for {archetype}" } }]
                }
            },
            {
                "object": "block",
                "type": "paragraph",
                "paragraph": {
                    "text": [{ "type": "text", "text": { "content": "This ritual page was auto-created by Agent TARS based on your archetype activation." } }]
                }
            }
        ]
    }

    headers = {
        "Authorization": f"Bearer {os.getenv('NOTION_API_KEY')}",
        "Content-Type": "application/json"
    }

    response = requests.post("https://api.notion.com/v1/pages", json=payload, headers=headers)

    if response.status_code == 200:
        print(f"✅ Ritual page created: {page_title}")
    else:
        print(f"❌ Failed to create ritual page: {response.text}")



