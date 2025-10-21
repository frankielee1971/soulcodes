"""
📧 Brevo Integration for Agent TARS
Handles email campaigns, onboarding sequences, and affirmation delivery
"""

import os
import json
import requests
from datetime import datetime
from typing import Dict, Any, List, Optional

class BrevoIntegrator:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv('BREVO_API_KEY')
        self.base_url = "https://api.brevo.com/v3"
        self.headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "api-key": self.api_key
        }
    
    def create_contact(self, email: str, archetype: str, name: str = None) -> Dict[str, Any]:
        """
        Create a new contact in Brevo with archetype-specific attributes
        """
        contact_data = {
            "email": email,
            "attributes": {
                "ARCHETYPE": archetype,
                "FIRSTNAME": name or "Soul Sister",
                "ONBOARDED_DATE": datetime.now().strftime("%Y-%m-%d"),
                "SOURCE": "SoulCodes Portal"
            },
            "listIds": [self.get_archetype_list_id(archetype)],
            "updateEnabled": True
        }
        
        response = requests.post(
            f"{self.base_url}/contacts",
            headers=self.headers,
            json=contact_data
        )
        
        if response.status_code in [200, 201]:
            return response.json()
        else:
            raise Exception(f"Failed to create Brevo contact: {response.text}")
    
    def get_archetype_list_id(self, archetype: str) -> int:
        """
        Map archetype to Brevo list ID
        """
        archetype_lists = {
            "Digital Oracle": 1,
            "Cosmic Connector": 2,
            "Rebel Healer": 3,
            "Mystic Mentor": 4,
            "Faceless Visionary": 5,
            "Alter Ego Alchemist": 6
        }
        return archetype_lists.get(archetype, 1)  # Default to list 1
    
    def send_onboarding_sequence(self, email: str, archetype: str) -> Dict[str, Any]:
        """
        Trigger archetype-specific onboarding email sequence
        """
        # Load template manifest to get email sequence ID
        with open('/home/ubuntu/soulcodes-unified/templates/template_manifest.json', 'r') as f:
            manifest = json.load(f)
        
        archetype_key = archetype.lower().replace(' ', '-')
        sequence_id = manifest.get(archetype_key, {}).get('email_sequence', 'default_sequence')
        
        # Send welcome email with archetype-specific content
        email_data = {
            "to": [{"email": email}],
            "templateId": self.get_template_id(sequence_id),
            "params": {
                "ARCHETYPE": archetype,
                "PORTAL_URL": "https://soulcodes.site",
                "AFFIRMATION": self.get_archetype_affirmation(archetype)
            }
        }
        
        response = requests.post(
            f"{self.base_url}/smtp/email",
            headers=self.headers,
            json=email_data
        )
        
        if response.status_code == 201:
            return response.json()
        else:
            raise Exception(f"Failed to send onboarding email: {response.text}")
    
    def get_template_id(self, sequence_name: str) -> int:
        """
        Map sequence name to Brevo template ID
        """
        template_map = {
            "brevo_campaign_oracle_01": 1,
            "brevo_campaign_connector_02": 2,
            "brevo_campaign_alchemist_03": 3,
            "default_sequence": 1
        }
        return template_map.get(sequence_name, 1)
    
    def get_archetype_affirmation(self, archetype: str) -> str:
        """
        Get a random affirmation for the archetype
        """
        try:
            archetype_file = f"/home/ubuntu/soulcodes-unified/archetypes/{archetype.lower().replace(' ', '-')}.json"
            with open(archetype_file, 'r') as f:
                archetype_data = json.load(f)
            affirmations = archetype_data.get('affirmations', ["You are powerful and sovereign."])
            return affirmations[0] if affirmations else "You are aligned with your highest purpose."
        except FileNotFoundError:
            return "You are a digital sovereign, reclaiming your power."
    
    def send_daily_affirmation(self, email: str, archetype: str) -> Dict[str, Any]:
        """
        Send daily affirmation email based on archetype
        """
        affirmation = self.get_archetype_affirmation(archetype)
        
        email_data = {
            "to": [{"email": email}],
            "subject": f"Your Daily {archetype} Affirmation 🌟",
            "htmlContent": f"""
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0f0f23 0%, #1a0033 100%); color: white; padding: 40px; border-radius: 12px;">
                <h1 style="color: #8B5CF6; text-align: center; margin-bottom: 30px;">Soul Activation</h1>
                <div style="background: rgba(139, 92, 246, 0.1); padding: 30px; border-radius: 8px; text-align: center; margin: 20px 0;">
                    <h2 style="color: #FBB936; margin-bottom: 20px;">{archetype} Energy</h2>
                    <p style="font-size: 18px; line-height: 1.6; font-style: italic;">"{affirmation}"</p>
                </div>
                <p style="text-align: center; margin-top: 30px;">
                    <a href="https://soulcodes.site" style="background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Visit Your Portal</a>
                </p>
            </div>
            """,
            "textContent": f"Your Daily {archetype} Affirmation: {affirmation}"
        }
        
        response = requests.post(
            f"{self.base_url}/smtp/email",
            headers=self.headers,
            json=email_data
        )
        
        if response.status_code == 201:
            return response.json()
        else:
            raise Exception(f"Failed to send daily affirmation: {response.text}")
    
    def create_automation_workflow(self, archetype: str) -> Dict[str, Any]:
        """
        Create an automation workflow for the archetype
        """
        workflow_data = {
            "name": f"{archetype} Onboarding Flow",
            "triggerType": "listAddition",
            "triggerSettings": {
                "listId": self.get_archetype_list_id(archetype)
            },
            "actions": [
                {
                    "type": "email",
                    "delay": 0,
                    "templateId": self.get_template_id(f"brevo_campaign_{archetype.lower().replace(' ', '_')}_01")
                },
                {
                    "type": "email", 
                    "delay": 86400,  # 24 hours
                    "templateId": self.get_template_id("daily_affirmation")
                }
            ]
        }
        
        response = requests.post(
            f"{self.base_url}/automations",
            headers=self.headers,
            json=workflow_data
        )
        
        if response.status_code == 201:
            return response.json()
        else:
            raise Exception(f"Failed to create automation workflow: {response.text}")

def send_archetype_email(email: str, archetype: str, name: str = None):
    """
    Legacy function for backward compatibility
    """
    brevo = BrevoIntegrator()
    brevo.create_contact(email, archetype, name)
    return brevo.send_onboarding_sequence(email, archetype)

