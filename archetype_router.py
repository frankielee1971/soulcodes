
import os
from googleapiclient.discovery import build
from google.oauth2 import service_account
from config.config import (
	SERVICE_ACCOUNT_FILE,
	SCOPES,
	FOLDER_ID,
	ARCHETYPE_KEYWORDS
)

# 🧬 Detect archetype from filename
def detect_archetype(file_name):
	lower_name = file_name.lower()
	for keyword, archetype in ARCHETYPE_KEYWORDS.items():
		if keyword in lower_name:
			return archetype
	return "General Entrepreneurial"

# 📁 Create folder if it doesn't exist
def get_or_create_folder(service, archetype):
	query = f"'{FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder' and name='{archetype}'"
	results = service.files().list(q=query, fields="files(id)").execute()
	folders = results.get('files', [])
	if folders:
		return folders[0]['id']
	folder_metadata = {
		'name': archetype,
		'mimeType': 'application/vnd.google-apps.folder',
		'parents': [FOLDER_ID]
	}
	folder = service.files().create(body=folder_metadata, fields='id').execute()
	return folder['id']

# 🚚 Move file to archetype folder
def move_file(service, file_id, new_parent_id):
	file = service.files().get(fileId=file_id, fields='parents').execute()
	previous_parents = ",".join(file.get('parents'))
	service.files().update(
		fileId=file_id,
		addParents=new_parent_id,
		removeParents=previous_parents,
		fields='id, parents'
	).execute()

# 🚀 Main invocation
def route_files():
	creds = service_account.Credentials.from_service_account_file(
		SERVICE_ACCOUNT_FILE, scopes=SCOPES)
	service = build('drive', 'v3', credentials=creds)

	log_path = "processing_log.txt"
	if not os.path.exists(log_path):
		print("⚠️ No processing_log.txt found. Run agent_tars.py first.")
		return

	with open(log_path, "r", encoding="utf-8") as log:
		lines = log.readlines()

	results = service.files().list(
		q=f"'{FOLDER_ID}' in parents and trashed=false",
		fields="files(id, name)").execute()
	all_files = results.get('files', [])
	file_map = {f['name']: f['id'] for f in all_files}

	for line in lines:
		if "→" not in line:
			continue
		file_name = line.split("|")[1].split("→")[0].strip()
		archetype = detect_archetype(file_name)
		if file_name not in file_map:
			print(f"⚠️ File not found in Drive: {file_name}")
			continue
		file_id = file_map[file_name]
		folder_id = get_or_create_folder(service, archetype)
		move_file(service, file_id, folder_id)
if __name__ == "__main__":
	route_files()
