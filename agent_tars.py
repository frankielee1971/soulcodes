
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

		# 📝 Log to Notion
		log_to_notion(
			file_name=file_name,
			archetype=matched_archetype,
			element="Water",  # Optional: can be dynamic later
			notes="Auto-logged by Agent TARS"
		)

		# ✅ Mark as processed
		mark_as_processed(file_name)

# 🔔 Run the agent
if __name__ == "__main__":
	activate_agent_tars()

