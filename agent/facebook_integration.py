"""
📱 Facebook Group Integration for Agent TARS
Handles community posts, ritual prompts, and archetype activations
"""

import os
import json
import requests
from datetime import datetime
from typing import Dict, Any, List, Optional

class FacebookGroupIntegrator:
    def __init__(self, access_token: str = None, group_id: str = None):
        self.access_token = access_token or os.getenv('FACEBOOK_ACCESS_TOKEN')
        self.group_id = group_id or os.getenv('FACEBOOK_GROUP_ID')
        self.base_url = "https://graph.facebook.com/v18.0"
    
    def post_ritual_prompt(self, archetype: str) -> Dict[str, Any]:
        """
        Post an archetype-specific ritual prompt to the Facebook group
        """
        # Load template manifest to get Facebook prompt
        with open('/home/ubuntu/soulcodes-unified/templates/template_manifest.json', 'r') as f:
            manifest = json.load(f)
        
        archetype_key = archetype.lower().replace(' ', '-')
        prompt = manifest.get(archetype_key, {}).get('facebook_prompt', 
                                                   f"Today's {archetype} activation: What's calling to your soul?")
        
        # Enhance prompt with cosmic elements
        enhanced_prompt = f"""🌟 {prompt}

✨ {archetype} souls, this is your moment to shine!

Drop a 🔮 if you're feeling this energy
Share your intention in the comments 👇

#SoulCodes #{archetype.replace(' ', '')} #DigitalSovereignty #GenXWomen #EscapeTheMatrix"""
        
        post_data = {
            'message': enhanced_prompt,
            'access_token': self.access_token
        }
        
        response = requests.post(
            f"{self.base_url}/{self.group_id}/feed",
            data=post_data
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Failed to post to Facebook group: {response.text}")
    
    def post_daily_affirmation(self, archetype: str) -> Dict[str, Any]:
        """
        Post daily affirmation for specific archetype
        """
        try:
            archetype_file = f"/home/ubuntu/soulcodes-unified/archetypes/{archetype.lower().replace(' ', '-')}.json"
            with open(archetype_file, 'r') as f:
                archetype_data = json.load(f)
            
            affirmations = archetype_data.get('affirmations', ["You are powerful and sovereign."])
            affirmation = affirmations[0] if affirmations else "You are aligned with your highest purpose."
            
        except FileNotFoundError:
            affirmation = "You are a digital sovereign, reclaiming your power."
        
        post_content = f"""🧬 Daily {archetype} Affirmation 🧬

"{affirmation}"

Repeat this 3 times while looking in the mirror.
Your frequency is your power. 💫

Who else needs to hear this today? Tag a soul sister! 👇

#DailyAffirmation #{archetype.replace(' ', '')} #SoulCodes #Manifestation #GenXWomen"""
        
        post_data = {
            'message': post_content,
            'access_token': self.access_token
        }
        
        response = requests.post(
            f"{self.base_url}/{self.group_id}/feed",
            data=post_data
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Failed to post affirmation: {response.text}")
    
    def post_community_activation(self, theme: str = "sovereignty") -> Dict[str, Any]:
        """
        Post community activation prompts
        """
        activation_prompts = {
            "sovereignty": """🔥 SOVEREIGNTY ACTIVATION 🔥

Gen X queens, it's time to reclaim what's ours!

What's one way you're breaking free from the matrix this week?

💪 Starting a side hustle?
🧠 Learning new tech?
✨ Setting boundaries?
🎯 Following your intuition?

Share your rebellion in the comments! 
Your story might be exactly what another soul needs to hear. 👇

#DigitalSovereignty #EscapeTheMatrix #GenXWomen #SoulCodes""",
            
            "manifestation": """🌙 MANIFESTATION MONDAY 🌙

What are you calling into your reality this week?

✨ Write it in the comments
✨ Feel it in your body
✨ Trust the process

The universe is listening, soul sister. 💫

#ManifestationMonday #SoulCodes #DigitalManifestation #GenXMagic""",
            
            "tech_empowerment": """💻 TECH EMPOWERMENT TUESDAY 💻

What's one piece of technology that's changed your life this year?

AI tools? 
Automation?
New apps?
Online courses?

Share your tech wins! Let's celebrate our digital evolution 🚀

#TechEmpowerment #DigitallyDefined #AIForWomen #SoulCodes"""
        }
        
        post_content = activation_prompts.get(theme, activation_prompts["sovereignty"])
        
        post_data = {
            'message': post_content,
            'access_token': self.access_token
        }
        
        response = requests.post(
            f"{self.base_url}/{self.group_id}/feed",
            data=post_data
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Failed to post community activation: {response.text}")
    
    def schedule_weekly_posts(self) -> List[Dict[str, Any]]:
        """
        Schedule a week's worth of posts for different archetypes
        """
        archetypes = ["Digital Oracle", "Cosmic Connector", "Rebel Healer", "Mystic Mentor"]
        results = []
        
        for i, archetype in enumerate(archetypes):
            try:
                # Schedule ritual prompt
                result = self.post_ritual_prompt(archetype)
                results.append({
                    "type": "ritual_prompt",
                    "archetype": archetype,
                    "status": "success",
                    "post_id": result.get('id')
                })
            except Exception as e:
                results.append({
                    "type": "ritual_prompt",
                    "archetype": archetype,
                    "status": "error",
                    "error": str(e)
                })
        
        return results
    
    def get_group_insights(self) -> Dict[str, Any]:
        """
        Get insights about group engagement
        """
        response = requests.get(
            f"{self.base_url}/{self.group_id}",
            params={
                'fields': 'name,member_count,description',
                'access_token': self.access_token
            }
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Failed to get group insights: {response.text}")

def post_to_facebook_group(archetype: str, prompt_type: str = "ritual"):
    """
    Legacy function for backward compatibility
    """
    fb = FacebookGroupIntegrator()
    if prompt_type == "ritual":
        return fb.post_ritual_prompt(archetype)
    elif prompt_type == "affirmation":
        return fb.post_daily_affirmation(archetype)
    else:
        return fb.post_community_activation()

