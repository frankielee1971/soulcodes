"""
Data models for cosmic tools in the SoulCodes portal.
These models define the structure for Human Design, Numerology, Moon Reading, Astrology, and Angel Numbers.
"""

from dataclasses import dataclass
from typing import Dict, List, Optional
from datetime import datetime
from enum import Enum


class HumanDesignType(Enum):
    MANIFESTOR = "Manifestor"
    GENERATOR = "Generator"
    MANIFESTING_GENERATOR = "Manifesting Generator"
    PROJECTOR = "Projector"
    REFLECTOR = "Reflector"


class HumanDesignAuthority(Enum):
    EMOTIONAL = "Emotional"
    SACRAL = "Sacral"
    SPLENIC = "Splenic"
    EGO = "Ego"
    SELF_PROJECTED = "Self-Projected"
    ENVIRONMENTAL = "Environmental"
    LUNAR = "Lunar"
    NONE = "None"


@dataclass
class HumanDesignChart:
    """Human Design chart data model"""
    name: str
    birth_date: datetime
    birth_time: str
    birth_place: str
    type: HumanDesignType
    strategy: str
    authority: HumanDesignAuthority
    profile: str
    defined_centers: List[str]
    undefined_centers: List[str]
    defined_gates: List[int]
    defined_channels: List[str]
    incarnation_cross: str
    description: str


@dataclass
class NumerologyReading:
    """Numerology reading data model"""
    name: str
    birth_date: datetime
    life_path_number: int
    expression_number: int
    soul_urge_number: int
    personality_number: int
    birth_day_number: int
    life_path_meaning: str
    expression_meaning: str
    soul_urge_meaning: str
    personality_meaning: str
    birth_day_meaning: str


class MoonPhase(Enum):
    NEW_MOON = "New Moon"
    WAXING_CRESCENT = "Waxing Crescent"
    FIRST_QUARTER = "First Quarter"
    WAXING_GIBBOUS = "Waxing Gibbous"
    FULL_MOON = "Full Moon"
    WANING_GIBBOUS = "Waning Gibbous"
    LAST_QUARTER = "Last Quarter"
    WANING_CRESCENT = "Waning Crescent"


class ZodiacSign(Enum):
    ARIES = "Aries"
    TAURUS = "Taurus"
    GEMINI = "Gemini"
    CANCER = "Cancer"
    LEO = "Leo"
    VIRGO = "Virgo"
    LIBRA = "Libra"
    SCORPIO = "Scorpio"
    SAGITTARIUS = "Sagittarius"
    CAPRICORN = "Capricorn"
    AQUARIUS = "Aquarius"
    PISCES = "Pisces"


@dataclass
class MoonReading:
    """Moon reading data model"""
    name: str
    birth_date: datetime
    birth_time: str
    birth_place: str
    current_moon_phase: MoonPhase
    current_moon_sign: ZodiacSign
    natal_moon_sign: ZodiacSign
    natal_moon_phase: MoonPhase
    current_phase_meaning: str
    natal_moon_meaning: str
    natal_phase_meaning: str


@dataclass
class AstrologyReading:
    """Basic astrology reading data model"""
    name: str
    birth_date: datetime
    birth_time: str
    birth_place: str
    sun_sign: ZodiacSign
    moon_sign: ZodiacSign
    rising_sign: ZodiacSign
    sun_sign_meaning: str
    moon_sign_meaning: str
    rising_sign_meaning: str


@dataclass
class AngelNumberReading:
    """Angel number reading data model"""
    number_sequence: str
    meaning: str
    spiritual_significance: str
    guidance_message: str
    affirmation: str


@dataclass
class CosmicProfile:
    """Complete cosmic profile combining all tools"""
    user_id: str
    name: str
    birth_date: datetime
    birth_time: str
    birth_place: str
    human_design: Optional[HumanDesignChart] = None
    numerology: Optional[NumerologyReading] = None
    moon_reading: Optional[MoonReading] = None
    astrology: Optional[AstrologyReading] = None
    favorite_angel_numbers: List[AngelNumberReading] = None
    created_at: datetime = None
    updated_at: datetime = None

    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now()
        if self.updated_at is None:
            self.updated_at = datetime.now()
        if self.favorite_angel_numbers is None:
            self.favorite_angel_numbers = []


# Mapping dictionaries for calculations
NUMEROLOGY_LETTER_VALUES = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
    'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
}

# Human Design Gates to I Ching mapping (simplified version)
HUMAN_DESIGN_GATES = {
    1: "The Creative",
    2: "The Receptive",
    3: "Difficulty at the Beginning",
    4: "Youthful Folly",
    5: "Waiting",
    6: "Conflict",
    7: "The Army",
    8: "Holding Together",
    9: "The Taming Power of the Small",
    10: "Treading",
    # ... (would continue for all 64 gates)
}

# Zodiac sign date ranges
ZODIAC_DATE_RANGES = {
    ZodiacSign.ARIES: ((3, 21), (4, 19)),
    ZodiacSign.TAURUS: ((4, 20), (5, 20)),
    ZodiacSign.GEMINI: ((5, 21), (6, 20)),
    ZodiacSign.CANCER: ((6, 21), (7, 22)),
    ZodiacSign.LEO: ((7, 23), (8, 22)),
    ZodiacSign.VIRGO: ((8, 23), (9, 22)),
    ZodiacSign.LIBRA: ((9, 23), (10, 22)),
    ZodiacSign.SCORPIO: ((10, 23), (11, 21)),
    ZodiacSign.SAGITTARIUS: ((11, 22), (12, 21)),
    ZodiacSign.CAPRICORN: ((12, 22), (1, 19)),
    ZodiacSign.AQUARIUS: ((1, 20), (2, 18)),
    ZodiacSign.PISCES: ((2, 19), (3, 20))
}

