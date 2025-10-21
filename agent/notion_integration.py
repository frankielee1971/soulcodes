"""
🧠 Notion Integration for Agent TARS
Handles template generation, board updates, and onboarding flows
"""

import os
import json
import requests
from datetime import datetime
from typing import Dict, Any, Optional

class NotionIntegrator:
    def __init__(self, notion_token: str = None):
        self.notion_token = notion_token or os.getenv('NOTION_TOKEN')
        self.base_url = "https://api.notion.com/v1"
        self.headers = {
            "Authorization": f"Bearer {self.notion_token}",
            "Content-Type": "application/json",
            "Notion-Version": "2022-06-28"
        }
    
    def create_archetype_template(self, archetype_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new Notion template based on archetype data
        """
        template_data = {
            "parent": {"database_id": os.getenv('NOTION_TEMPLATES_DB_ID')},
            "properties": {
                "Name": {
                    "title": [{"text": {"content": f"{archetype_data['archetypeName']} Template"}}]
                },
                "Archetype": {
                    "select": {"name": archetype_data['archetypeName']}
                },
                "Mission": {
                    "rich_text": [{"text": {"content": archetype_data['missionStatement']}}]
                },
                "Brand Voice": {
                    "select": {"name": archetype_data['brandVoice']}
                },
                "Created": {
                    "date": {"start": datetime.now().isoformat()}
                }
            }
        }
        
        response = requests.post(
            f"{self.base_url}/pages",
            headers=self.headers,
            json=template_data
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Failed to create Notion template: {response.text}")
    
    def update_onboarding_board(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update the onboarding board with new user information
        """
        board_data = {
            "parent": {"database_id": os.getenv('NOTION_ONBOARDING_DB_ID')},
            "properties": {
                "Name": {
                    "title": [{"text": {"content": user_data.get('name', 'Unknown')}}]
                },
                "Email": {
                    "email": user_data.get('email', '')
                },
                "Archetype": {
                    "select": {"name": user_data.get('archetype', 'Unknown')}
                },
                "Status": {
                    "select": {"name": "New"}
                },
                "Onboarded": {
                    "date": {"start": datetime.now().isoformat()}
                }
            }
        }
        
        response = requests.post(
            f"{self.base_url}/pages",
            headers=self.headers,
            json=board_data
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Failed to update onboarding board: {response.text}")
    
    def generate_soul_blueprint_page(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate a personalized soul blueprint page in Notion
        """
        archetype = user_data.get('archetype', 'Unknown')
        
        # Load archetype data
        archetype_file = f"/home/ubuntu/soulcodes-unified/archetypes/{archetype.lower().replace(' ', '-')}.json"
        try:
            with open(archetype_file, 'r') as f:
                archetype_data = json.load(f)
        except FileNotFoundError:
            archetype_data = {"affirmations": ["You are powerful.", "You are sovereign.", "You are aligned."]}
        
        blueprint_data = {
            "parent": {"database_id": os.getenv('NOTION_BLUEPRINTS_DB_ID')},
            "properties": {
                "Name": {
                    "title": [{"text": {"content": f"{user_data.get('name', 'Soul')} Blueprint"}}]
                },
                "Archetype": {
                    "select": {"name": archetype}
                },
                "Email": {
                    "email": user_data.get('email', '')
                },
                "Created": {
                    "date": {"start": datetime.now().isoformat()}
                }
            },
            "children": [
                {
                    "object": "block",
                    "type": "heading_1",
                    "heading_1": {
                        "rich_text": [{"type": "text", "text": {"content": f"Soul Blueprint: {archetype}"}}]
                    }
                },
                {
                    "object": "block",
                    "type": "paragraph",
                    "paragraph": {
                        "rich_text": [{"type": "text", "text": {"content": archetype_data.get('missionStatement', 'Your mission awaits.')}}]
                    }
                },
                {
                    "object": "block",
                    "type": "heading_2",
                    "heading_2": {
                        "rich_text": [{"type": "text", "text": {"content": "Daily Affirmations"}}]
                    }
                }
            ]
        }
        
        # Add affirmations as bullet points
        for affirmation in archetype_data.get('affirmations', []):
            blueprint_data["children"].append({
                "object": "block",
                "type": "bulleted_list_item",
                "bulleted_list_item": {
                    "rich_text": [{"type": "text", "text": {"content": affirmation}}]
                }
            })
        
        response = requests.post(
            f"{self.base_url}/pages",
            headers=self.headers,
            json=blueprint_data
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Failed to create soul blueprint: {response.text}")

def log_to_notion(file_name: str, archetype: str, element: Optional[str] = None, notes: str = ""):
    """
    Legacy function for backward compatibility with existing Agent TARS code
    """
    notion = NotionIntegrator()
    user_data = {
        'name': file_name,
        'archetype': archetype,
        'email': 'auto-generated@soulcodes.com',
        'notes': notes
    }
    return notion.update_onboarding_board(user_data)

