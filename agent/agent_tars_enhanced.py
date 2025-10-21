"""
🤖 Agent TARS Enhanced - SoulCodes Automation Intelligence
Orchestrates backend intelligence across Notion, Brevo, and Facebook
"""

import os
import json
import schedule
import time
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from googleapiclient.discovery import build
from google.oauth2 import service_account

# Import our integration modules
from notion_integration import NotionIntegrator
from brevo_integration import BrevoIntegrator
from facebook_integration import FacebookGroupIntegrator

class AgentTARS:
    def __init__(self):
        self.notion = NotionIntegrator()
        self.brevo = BrevoIntegrator()
        self.facebook = FacebookGroupIntegrator()
        
        # Google Drive setup
        self.service_account_file = os.getenv('GOOGLE_SERVICE_ACCOUNT_FILE')
        self.scopes = ['https://www.googleapis.com/auth/drive.metadata.readonly']
        self.folder_id = os.getenv('GOOGLE_DRIVE_FOLDER_ID')
        
        # Archetype mapping
        self.keyword_map = {
            "affiliate": "Affiliate Strategist",
            "faceless": "Faceless Visionary",
            "mystic": "Mystic Mentor",
            "ugc": "Rebel Healer",
            "confidence": "Cosmic Connector",
            "automation": "Digital Oracle",
            "branding": "Rebel Healer",
            "spiritual": "Mystic Mentor",
            "sovereignty": "Faceless Visionary",
            "conversion": "Affiliate Strategist"
        }
        
        self.processing_log = "/home/ubuntu/soulcodes-unified/agent/processing_log.txt"
    
    def activate_full_automation(self):
        """
        Main activation function that orchestrates all automations
        """
        print("🚀 Activating Agent TARS Full Automation...")
        
        # 1. Scan Google Drive for new files
        new_files = self.scan_drive_for_new_files()
        
        # 2. Process each new file
        for file_info in new_files:
            self.process_new_file(file_info)
        
        # 3. Update Notion templates
        self.update_notion_templates()
        
        # 4. Send scheduled emails
        self.send_scheduled_emails()
        
        # 5. Post to Facebook group
        self.post_to_facebook()
        
        print("✅ Agent TARS automation cycle complete!")
    
    def scan_drive_for_new_files(self) -> List[Dict[str, Any]]:
        """
        Scan Google Drive folder for new files
        """
        if not self.service_account_file:
            print("⚠️ Google Drive service account not configured")
            return []
        
        try:
            creds = service_account.Credentials.from_service_account_file(
                self.service_account_file, scopes=self.scopes
            )
            service = build('drive', 'v3', credentials=creds)
            
            results = service.files().list(
                q=f"'{self.folder_id}' in parents and trashed = false",
                fields="files(name, id, createdTime)"
            ).execute()
            
            files = results.get('files', [])
            new_files = []
            
            for file in files:
                if not self.already_processed(file['name']):
                    new_files.append(file)
            
            return new_files
            
        except Exception as e:
            print(f"❌ Error scanning Google Drive: {e}")
            return []
    
    def process_new_file(self, file_info: Dict[str, Any]):
        """
        Process a new file and trigger appropriate automations
        """
        file_name = file_info['name']
        print(f"📁 Processing new file: {file_name}")
        
        # Determine archetype from filename
        archetype = self.determine_archetype(file_name)
        
        # Create Notion entry
        try:
            notion_result = self.notion.update_onboarding_board({
                'name': file_name,
                'archetype': archetype,
                'email': 'auto-generated@soulcodes.com',
                'source': 'Google Drive'
            })
            print(f"✅ Notion entry created: {notion_result.get('id', 'Unknown')}")
        except Exception as e:
            print(f"❌ Notion error: {e}")
        
        # Mark as processed
        self.mark_as_processed(file_name)
    
    def determine_archetype(self, file_name: str) -> str:
        """
        Determine archetype based on filename keywords
        """
        file_name_lower = file_name.lower()
        
        for keyword, archetype in self.keyword_map.items():
            if keyword in file_name_lower:
                return archetype
        
        return "Digital Oracle"  # Default archetype
    
    def update_notion_templates(self):
        """
        Update Notion templates based on archetype data
        """
        print("📝 Updating Notion templates...")
        
        # Load all archetype files
        archetype_dir = "/home/ubuntu/soulcodes-unified/archetypes"
        for filename in os.listdir(archetype_dir):
            if filename.endswith('.json') and filename != 'manifest.json':
                try:
                    with open(os.path.join(archetype_dir, filename), 'r') as f:
                        archetype_data = json.load(f)
                    
                    # Create or update template
                    template_result = self.notion.create_archetype_template(archetype_data)
                    print(f"✅ Template updated for {archetype_data['archetypeName']}")
                    
                except Exception as e:
                    print(f"❌ Template error for {filename}: {e}")
    
    def send_scheduled_emails(self):
        """
        Send scheduled emails based on time and archetype
        """
        print("📧 Sending scheduled emails...")
        
        current_hour = datetime.now().hour
        
        # Morning affirmations (8 AM)
        if current_hour == 8:
            archetypes = ["Digital Oracle", "Cosmic Connector"]
            for archetype in archetypes:
                try:
                    # This would normally pull from a subscriber list
                    # For demo, we'll just log the action
                    print(f"📧 Would send morning affirmation for {archetype}")
                except Exception as e:
                    print(f"❌ Email error for {archetype}: {e}")
        
        # Evening reflections (6 PM)
        elif current_hour == 18:
            archetypes = ["Rebel Healer", "Mystic Mentor"]
            for archetype in archetypes:
                try:
                    print(f"📧 Would send evening reflection for {archetype}")
                except Exception as e:
                    print(f"❌ Email error for {archetype}: {e}")
    
    def post_to_facebook(self):
        """
        Post to Facebook group based on schedule
        """
        print("📱 Posting to Facebook group...")
        
        current_day = datetime.now().strftime("%A")
        
        try:
            if current_day == "Monday":
                self.facebook.post_community_activation("manifestation")
            elif current_day == "Tuesday":
                self.facebook.post_community_activation("tech_empowerment")
            elif current_day == "Wednesday":
                self.facebook.post_ritual_prompt("Digital Oracle")
            elif current_day == "Thursday":
                self.facebook.post_ritual_prompt("Cosmic Connector")
            elif current_day == "Friday":
                self.facebook.post_ritual_prompt("Rebel Healer")
            elif current_day == "Saturday":
                self.facebook.post_community_activation("sovereignty")
            elif current_day == "Sunday":
                self.facebook.post_daily_affirmation("Mystic Mentor")
            
            print(f"✅ Facebook post scheduled for {current_day}")
            
        except Exception as e:
            print(f"❌ Facebook posting error: {e}")
    
    def already_processed(self, file_name: str) -> bool:
        """
        Check if file has already been processed
        """
        if not os.path.exists(self.processing_log):
            return False
        
        with open(self.processing_log, 'r', encoding='utf-8') as log:
            return file_name in log.read()
    
    def mark_as_processed(self, file_name: str):
        """
        Mark file as processed
        """
        with open(self.processing_log, 'a', encoding='utf-8') as log:
            log.write(f"{file_name}\n")
    
    def setup_scheduled_tasks(self):
        """
        Setup scheduled tasks for automation
        """
        print("⏰ Setting up scheduled tasks...")
        
        # Daily automation at 9 AM
        schedule.every().day.at("09:00").do(self.activate_full_automation)
        
        # Morning affirmations at 8 AM
        schedule.every().day.at("08:00").do(self.send_scheduled_emails)
        
        # Evening posts at 6 PM
        schedule.every().day.at("18:00").do(self.post_to_facebook)
        
        # Weekly template updates on Sundays at 10 AM
        schedule.every().sunday.at("10:00").do(self.update_notion_templates)
        
        print("✅ Scheduled tasks configured!")
    
    def run_scheduler(self):
        """
        Run the scheduler continuously
        """
        print("🔄 Starting Agent TARS scheduler...")
        self.setup_scheduled_tasks()
        
        while True:
            schedule.run_pending()
            time.sleep(60)  # Check every minute
    
    def manual_trigger(self, action: str, **kwargs):
        """
        Manually trigger specific actions
        """
        actions = {
            "scan_drive": self.scan_drive_for_new_files,
            "update_notion": self.update_notion_templates,
            "send_emails": self.send_scheduled_emails,
            "post_facebook": self.post_to_facebook,
            "full_automation": self.activate_full_automation
        }
        
        if action in actions:
            print(f"🎯 Manually triggering: {action}")
            return actions[action]()
        else:
            print(f"❌ Unknown action: {action}")
            return None

# Main execution
if __name__ == "__main__":
    agent = AgentTARS()
    
    # For testing, run a single automation cycle
    agent.activate_full_automation()
    
    # Uncomment to run continuous scheduler
    # agent.run_scheduler()

