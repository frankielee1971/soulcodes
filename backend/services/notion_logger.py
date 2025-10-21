"""
Notion logging service for backward compatibility
"""

import os
import sys

# Add agent directory to path for imports
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'agent'))

try:
    from notion_integration import log_to_notion as notion_log
except ImportError:
    def notion_log(file_name: str, archetype: str, element: str = None, notes: str = ""):
        """Fallback function when notion integration is not available"""
        print(f"📝 Would log to Notion: {file_name} - {archetype}")
        return {"status": "logged", "file_name": file_name, "archetype": archetype}

def log_to_notion(file_name: str, archetype: str, element: str = None, notes: str = ""):
    """
    Log archetype data to Notion
    Wrapper function for backward compatibility
    """
    return notion_log(file_name, archetype, element, notes)

