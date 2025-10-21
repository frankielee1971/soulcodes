"""
Pydantic models for SoulCodes archetype data
"""

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class ArchetypeData(BaseModel):
    """Data model for archetype submissions"""
    name: str
    email: EmailStr
    archetype: str
    timestamp: Optional[datetime] = None
    source: Optional[str] = "web_form"
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class ArchetypeResponse(BaseModel):
    """Response model for archetype operations"""
    status: str
    message: str
    archetype: Optional[str] = None
    user_id: Optional[str] = None

class ManifestationData(BaseModel):
    """Data model for manifestation tracking"""
    user_email: EmailStr
    manifestation_text: str
    category: str
    target_date: Optional[str] = None
    emotional_state: int
    archetype: Optional[str] = None
    
class WebhookData(BaseModel):
    """Generic webhook data model"""
    event_type: str
    data: dict
    timestamp: Optional[datetime] = None
    source: Optional[str] = None

