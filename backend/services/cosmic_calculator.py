"""
Cosmic Calculator Service for SoulCodes Portal
Provides calculation services for Human Design, Numerology, Moon Reading, Astrology, and Angel Numbers.
"""

import math
from datetime import datetime, date
from typing import Dict, List, Tuple, Optional
from ..models.cosmic_tools import (
    HumanDesignChart, NumerologyReading, MoonReading, AstrologyReading, 
    AngelNumberReading, CosmicProfile, HumanDesignType, HumanDesignAuthority,
    MoonPhase, ZodiacSign, NUMEROLOGY_LETTER_VALUES, ZODIAC_DATE_RANGES
)


class CosmicCalculatorService:
    """Service class for calculating cosmic readings"""
    
    def __init__(self):
        self.angel_numbers_db = self._initialize_angel_numbers()
    
    def calculate_numerology(self, full_name: str, birth_date: datetime) -> NumerologyReading:
        """Calculate complete numerology reading"""
        
        # Life Path Number
        life_path = self._calculate_life_path_number(birth_date)
        
        # Expression Number (from full name)
        expression = self._calculate_expression_number(full_name)
        
        # Soul Urge Number (from vowels in name)
        soul_urge = self._calculate_soul_urge_number(full_name)
        
        # Personality Number (from consonants in name)
        personality = self._calculate_personality_number(full_name)
        
        # Birth Day Number
        birth_day = birth_date.day
        if birth_day > 9 and birth_day not in [11, 22, 33]:
            birth_day = self._reduce_to_single_digit(birth_day)
        
        return NumerologyReading(
            name=full_name,
            birth_date=birth_date,
            life_path_number=life_path,
            expression_number=expression,
            soul_urge_number=soul_urge,
            personality_number=personality,
            birth_day_number=birth_day,
            life_path_meaning=self._get_life_path_meaning(life_path),
            expression_meaning=self._get_expression_meaning(expression),
            soul_urge_meaning=self._get_soul_urge_meaning(soul_urge),
            personality_meaning=self._get_personality_meaning(personality),
            birth_day_meaning=self._get_birth_day_meaning(birth_day)
        )
    
    def calculate_basic_astrology(self, name: str, birth_date: datetime, 
                                birth_time: str, birth_place: str) -> AstrologyReading:
        """Calculate basic astrology reading (Sun, Moon, Rising)"""
        
        # For now, we'll calculate Sun sign from birth date
        # In a full implementation, we'd use an ephemeris for Moon and Rising
        sun_sign = self._calculate_sun_sign(birth_date)
        
        # Simplified calculations (would need proper ephemeris in production)
        moon_sign = self._calculate_approximate_moon_sign(birth_date)
        rising_sign = self._calculate_approximate_rising_sign(birth_date, birth_time)
        
        return AstrologyReading(
            name=name,
            birth_date=birth_date,
            birth_time=birth_time,
            birth_place=birth_place,
            sun_sign=sun_sign,
            moon_sign=moon_sign,
            rising_sign=rising_sign,
            sun_sign_meaning=self._get_sun_sign_meaning(sun_sign),
            moon_sign_meaning=self._get_moon_sign_meaning(moon_sign),
            rising_sign_meaning=self._get_rising_sign_meaning(rising_sign)
        )
    
    def get_angel_number_meaning(self, number_sequence: str) -> AngelNumberReading:
        """Get angel number meaning"""
        return self.angel_numbers_db.get(number_sequence, self._create_default_angel_number(number_sequence))
    
    def calculate_moon_reading(self, name: str, birth_date: datetime, 
                             birth_time: str, birth_place: str) -> MoonReading:
        """Calculate moon reading"""
        
        # Current moon phase and sign (simplified calculation)
        current_phase = self._calculate_current_moon_phase()
        current_sign = self._calculate_current_moon_sign()
        
        # Natal moon (simplified - would need ephemeris for accuracy)
        natal_sign = self._calculate_approximate_moon_sign(birth_date)
        natal_phase = self._calculate_moon_phase_at_birth(birth_date)
        
        return MoonReading(
            name=name,
            birth_date=birth_date,
            birth_time=birth_time,
            birth_place=birth_place,
            current_moon_phase=current_phase,
            current_moon_sign=current_sign,
            natal_moon_sign=natal_sign,
            natal_moon_phase=natal_phase,
            current_phase_meaning=self._get_moon_phase_meaning(current_phase),
            natal_moon_meaning=self._get_natal_moon_meaning(natal_sign),
            natal_phase_meaning=self._get_natal_phase_meaning(natal_phase)
        )
    
    def calculate_simplified_human_design(self, name: str, birth_date: datetime,
                                        birth_time: str, birth_place: str) -> HumanDesignChart:
        """Calculate simplified Human Design chart"""
        
        # This is a very simplified version - real HD requires complex calculations
        # For demonstration purposes, we'll use birth date patterns
        
        day_sum = sum(int(d) for d in str(birth_date.day))
        month_sum = sum(int(d) for d in str(birth_date.month))
        year_sum = sum(int(d) for d in str(birth_date.year))
        
        total = day_sum + month_sum + year_sum
        type_index = total % 5
        
        types = [
            HumanDesignType.MANIFESTOR,
            HumanDesignType.GENERATOR,
            HumanDesignType.MANIFESTING_GENERATOR,
            HumanDesignType.PROJECTOR,
            HumanDesignType.REFLECTOR
        ]
        
        hd_type = types[type_index]
        
        return HumanDesignChart(
            name=name,
            birth_date=birth_date,
            birth_time=birth_time,
            birth_place=birth_place,
            type=hd_type,
            strategy=self._get_hd_strategy(hd_type),
            authority=self._get_hd_authority(hd_type, total),
            profile=self._get_hd_profile(total),
            defined_centers=self._get_defined_centers(total),
            undefined_centers=self._get_undefined_centers(total),
            defined_gates=self._get_defined_gates(total),
            defined_channels=self._get_defined_channels(total),
            incarnation_cross=self._get_incarnation_cross(total),
            description=self._get_hd_description(hd_type)
        )
    
    # Private helper methods
    
    def _calculate_life_path_number(self, birth_date: datetime) -> int:
        """Calculate life path number from birth date"""
        total = birth_date.day + birth_date.month + birth_date.year
        return self._reduce_to_single_digit(total)
    
    def _calculate_expression_number(self, full_name: str) -> int:
        """Calculate expression number from full name"""
        total = sum(NUMEROLOGY_LETTER_VALUES.get(char.upper(), 0) for char in full_name if char.isalpha())
        return self._reduce_to_single_digit(total)
    
    def _calculate_soul_urge_number(self, full_name: str) -> int:
        """Calculate soul urge number from vowels in name"""
        vowels = "AEIOU"
        total = sum(NUMEROLOGY_LETTER_VALUES.get(char.upper(), 0) 
                   for char in full_name if char.upper() in vowels)
        return self._reduce_to_single_digit(total)
    
    def _calculate_personality_number(self, full_name: str) -> int:
        """Calculate personality number from consonants in name"""
        vowels = "AEIOU"
        total = sum(NUMEROLOGY_LETTER_VALUES.get(char.upper(), 0) 
                   for char in full_name if char.isalpha() and char.upper() not in vowels)
        return self._reduce_to_single_digit(total)
    
    def _reduce_to_single_digit(self, number: int) -> int:
        """Reduce number to single digit (except master numbers 11, 22, 33)"""
        while number > 9 and number not in [11, 22, 33]:
            number = sum(int(digit) for digit in str(number))
        return number
    
    def _calculate_sun_sign(self, birth_date: datetime) -> ZodiacSign:
        """Calculate sun sign from birth date"""
        month = birth_date.month
        day = birth_date.day
        
        for sign, ((start_month, start_day), (end_month, end_day)) in ZODIAC_DATE_RANGES.items():
            if (month == start_month and day >= start_day) or (month == end_month and day <= end_day):
                return sign
        
        return ZodiacSign.CAPRICORN  # Default fallback
    
    def _calculate_approximate_moon_sign(self, birth_date: datetime) -> ZodiacSign:
        """Simplified moon sign calculation (not astronomically accurate)"""
        # This is a placeholder - real calculation requires ephemeris
        day_of_year = birth_date.timetuple().tm_yday
        sign_index = (day_of_year // 30) % 12
        return list(ZodiacSign)[sign_index]
    
    def _calculate_approximate_rising_sign(self, birth_date: datetime, birth_time: str) -> ZodiacSign:
        """Simplified rising sign calculation (not astronomically accurate)"""
        # This is a placeholder - real calculation requires time and location
        try:
            hour = int(birth_time.split(':')[0])
            sign_index = (hour // 2) % 12
            return list(ZodiacSign)[sign_index]
        except:
            return ZodiacSign.ARIES  # Default fallback
    
    def _calculate_current_moon_phase(self) -> MoonPhase:
        """Calculate current moon phase (simplified)"""
        # This is a placeholder - real calculation requires astronomical data
        import random
        return random.choice(list(MoonPhase))
    
    def _calculate_current_moon_sign(self) -> ZodiacSign:
        """Calculate current moon sign (simplified)"""
        # This is a placeholder - real calculation requires ephemeris
        import random
        return random.choice(list(ZodiacSign))
    
    def _calculate_moon_phase_at_birth(self, birth_date: datetime) -> MoonPhase:
        """Calculate moon phase at birth (simplified)"""
        # This is a placeholder - real calculation requires astronomical data
        day_cycle = birth_date.day % 8
        phases = list(MoonPhase)
        return phases[day_cycle]
    
    def _initialize_angel_numbers(self) -> Dict[str, AngelNumberReading]:
        """Initialize angel numbers database"""
        return {
            "111": AngelNumberReading(
                number_sequence="111",
                meaning="New beginnings and manifestation",
                spiritual_significance="A powerful portal for manifestation. Your thoughts are rapidly manifesting into reality.",
                guidance_message="Pay attention to your thoughts and focus on what you want to create, not what you fear.",
                affirmation="I am a powerful manifestor and my thoughts create my reality."
            ),
            "222": AngelNumberReading(
                number_sequence="222",
                meaning="Balance, cooperation, and relationships",
                spiritual_significance="A sign of harmony and the need to find balance in your life and relationships.",
                guidance_message="Trust the process and maintain faith. Cooperation and diplomacy will serve you well.",
                affirmation="I trust in divine timing and maintain balance in all areas of my life."
            ),
            "333": AngelNumberReading(
                number_sequence="333",
                meaning="Spiritual growth and ascended master guidance",
                spiritual_significance="The ascended masters are near, offering guidance and support for your spiritual journey.",
                guidance_message="You are being encouraged to express your creativity and communicate your truth.",
                affirmation="I am supported by divine beings and express my authentic self with confidence."
            ),
            "444": AngelNumberReading(
                number_sequence="444",
                meaning="Protection and angelic presence",
                spiritual_significance="Your angels are surrounding you with love and protection. You are on the right path.",
                guidance_message="Continue with determination and hard work. Your foundation is strong.",
                affirmation="I am protected and guided by my angels in everything I do."
            ),
            "555": AngelNumberReading(
                number_sequence="555",
                meaning="Major life changes and transformation",
                spiritual_significance="Significant changes are coming that will align you with your highest good.",
                guidance_message="Embrace change with an open heart. These transitions are divinely guided.",
                affirmation="I welcome positive changes and trust they lead me to my highest good."
            )
        }
    
    def _create_default_angel_number(self, number_sequence: str) -> AngelNumberReading:
        """Create default angel number reading for unknown sequences"""
        return AngelNumberReading(
            number_sequence=number_sequence,
            meaning="Divine guidance and synchronicity",
            spiritual_significance="This number sequence is a sign that you are in alignment with your spiritual path.",
            guidance_message="Pay attention to the circumstances when you see this number for personalized guidance.",
            affirmation="I am open to receiving divine messages and guidance in all forms."
        )
    
    # Meaning methods for various readings
    
    def _get_life_path_meaning(self, number: int) -> str:
        """Get life path number meaning"""
        meanings = {
            1: "The Leader - You are here to be independent, innovative, and lead others.",
            2: "The Peacemaker - You are here to bring harmony, cooperation, and diplomacy.",
            3: "The Creative - You are here to express creativity, joy, and inspiration.",
            4: "The Builder - You are here to create stability, order, and practical solutions.",
            5: "The Freedom Seeker - You are here to experience freedom, adventure, and change.",
            6: "The Nurturer - You are here to care for others, create harmony, and serve.",
            7: "The Seeker - You are here to seek truth, wisdom, and spiritual understanding.",
            8: "The Achiever - You are here to achieve material success and personal power.",
            9: "The Humanitarian - You are here to serve humanity and complete a cycle.",
            11: "The Intuitive - You are here to inspire others through your intuition and spiritual insight.",
            22: "The Master Builder - You are here to build something of lasting value for humanity.",
            33: "The Master Teacher - You are here to uplift humanity through compassionate service."
        }
        return meanings.get(number, "A unique path of self-discovery and growth.")
    
    def _get_expression_meaning(self, number: int) -> str:
        """Get expression number meaning"""
        meanings = {
            1: "You express yourself through leadership, independence, and pioneering spirit.",
            2: "You express yourself through cooperation, sensitivity, and bringing people together.",
            3: "You express yourself through creativity, communication, and artistic talents.",
            4: "You express yourself through hard work, organization, and building solid foundations.",
            5: "You express yourself through freedom, versatility, and adventurous experiences.",
            6: "You express yourself through nurturing, responsibility, and caring for others.",
            7: "You express yourself through analysis, research, and spiritual seeking.",
            8: "You express yourself through ambition, business acumen, and material achievement.",
            9: "You express yourself through humanitarian service and universal love."
        }
        return meanings.get(number, "You express yourself in unique and meaningful ways.")
    
    def _get_soul_urge_meaning(self, number: int) -> str:
        """Get soul urge number meaning"""
        meanings = {
            1: "Your soul urges you to be independent, lead, and make your own decisions.",
            2: "Your soul urges you to create harmony, work with others, and find peace.",
            3: "Your soul urges you to express creativity, have fun, and inspire others.",
            4: "Your soul urges you to build security, create order, and work systematically.",
            5: "Your soul urges you to experience freedom, travel, and embrace change.",
            6: "Your soul urges you to nurture others, create beauty, and serve your community.",
            7: "Your soul urges you to seek truth, develop spiritually, and understand life's mysteries.",
            8: "Your soul urges you to achieve success, gain recognition, and build material wealth.",
            9: "Your soul urges you to serve humanity, be compassionate, and give generously."
        }
        return meanings.get(number, "Your soul urges you toward growth and self-realization.")
    
    def _get_personality_meaning(self, number: int) -> str:
        """Get personality number meaning"""
        meanings = {
            1: "Others see you as confident, independent, and a natural leader.",
            2: "Others see you as gentle, cooperative, and diplomatic.",
            3: "Others see you as creative, charming, and entertaining.",
            4: "Others see you as reliable, practical, and hardworking.",
            5: "Others see you as dynamic, adventurous, and freedom-loving.",
            6: "Others see you as caring, responsible, and family-oriented.",
            7: "Others see you as mysterious, intellectual, and spiritually minded.",
            8: "Others see you as successful, ambitious, and materially focused.",
            9: "Others see you as compassionate, generous, and humanitarian."
        }
        return meanings.get(number, "Others see you as unique and memorable.")
    
    def _get_birth_day_meaning(self, number: int) -> str:
        """Get birth day number meaning"""
        meanings = {
            1: "You have natural leadership abilities and pioneering spirit.",
            2: "You have diplomatic skills and work well in partnerships.",
            3: "You have creative talents and excellent communication skills.",
            4: "You have organizational abilities and a strong work ethic.",
            5: "You have versatility and a love for freedom and adventure.",
            6: "You have nurturing abilities and a strong sense of responsibility.",
            7: "You have analytical skills and spiritual insight.",
            8: "You have business acumen and the ability to achieve material success.",
            9: "You have humanitarian instincts and a desire to serve others."
        }
        return meanings.get(number, "You have special talents that make you unique.")
    
    def _get_sun_sign_meaning(self, sign: ZodiacSign) -> str:
        """Get sun sign meaning"""
        meanings = {
            ZodiacSign.ARIES: "You are bold, pioneering, and full of energy. You lead with courage and enthusiasm.",
            ZodiacSign.TAURUS: "You are stable, practical, and appreciate beauty. You build lasting foundations.",
            ZodiacSign.GEMINI: "You are curious, communicative, and adaptable. You thrive on variety and learning.",
            ZodiacSign.CANCER: "You are nurturing, intuitive, and emotionally deep. You care deeply for others.",
            ZodiacSign.LEO: "You are confident, creative, and generous. You shine brightly and inspire others.",
            ZodiacSign.VIRGO: "You are analytical, helpful, and detail-oriented. You serve others with precision.",
            ZodiacSign.LIBRA: "You are diplomatic, artistic, and seek harmony. You bring balance to relationships.",
            ZodiacSign.SCORPIO: "You are intense, transformative, and deeply intuitive. You see beneath the surface.",
            ZodiacSign.SAGITTARIUS: "You are adventurous, philosophical, and optimistic. You seek truth and meaning.",
            ZodiacSign.CAPRICORN: "You are ambitious, disciplined, and practical. You achieve your goals through persistence.",
            ZodiacSign.AQUARIUS: "You are innovative, humanitarian, and independent. You envision a better future.",
            ZodiacSign.PISCES: "You are compassionate, intuitive, and artistic. You connect with the spiritual realm."
        }
        return meanings.get(sign, "You have a unique solar essence that guides your life path.")
    
    def _get_moon_sign_meaning(self, sign: ZodiacSign) -> str:
        """Get moon sign meaning"""
        meanings = {
            ZodiacSign.ARIES: "Your emotions are fiery and direct. You react quickly and need independence.",
            ZodiacSign.TAURUS: "Your emotions are stable and grounded. You need security and comfort.",
            ZodiacSign.GEMINI: "Your emotions are changeable and curious. You need mental stimulation.",
            ZodiacSign.CANCER: "Your emotions are deep and nurturing. You need emotional security and family.",
            ZodiacSign.LEO: "Your emotions are dramatic and warm. You need appreciation and creative expression.",
            ZodiacSign.VIRGO: "Your emotions are practical and analytical. You need order and usefulness.",
            ZodiacSign.LIBRA: "Your emotions seek harmony and beauty. You need partnership and balance.",
            ZodiacSign.SCORPIO: "Your emotions are intense and transformative. You need depth and authenticity.",
            ZodiacSign.SAGITTARIUS: "Your emotions are optimistic and adventurous. You need freedom and meaning.",
            ZodiacSign.CAPRICORN: "Your emotions are controlled and ambitious. You need achievement and respect.",
            ZodiacSign.AQUARIUS: "Your emotions are detached and humanitarian. You need independence and innovation.",
            ZodiacSign.PISCES: "Your emotions are compassionate and intuitive. You need spiritual connection."
        }
        return meanings.get(sign, "Your emotional nature is unique and guides your inner world.")
    
    def _get_rising_sign_meaning(self, sign: ZodiacSign) -> str:
        """Get rising sign meaning"""
        meanings = {
            ZodiacSign.ARIES: "You appear confident, energetic, and ready for action. Others see you as a leader.",
            ZodiacSign.TAURUS: "You appear calm, reliable, and grounded. Others see you as stable and trustworthy.",
            ZodiacSign.GEMINI: "You appear curious, talkative, and adaptable. Others see you as intelligent and social.",
            ZodiacSign.CANCER: "You appear caring, protective, and intuitive. Others see you as nurturing and sensitive.",
            ZodiacSign.LEO: "You appear confident, dramatic, and warm. Others see you as charismatic and creative.",
            ZodiacSign.VIRGO: "You appear organized, helpful, and detail-oriented. Others see you as practical and reliable.",
            ZodiacSign.LIBRA: "You appear charming, diplomatic, and balanced. Others see you as harmonious and fair.",
            ZodiacSign.SCORPIO: "You appear intense, mysterious, and powerful. Others see you as magnetic and deep.",
            ZodiacSign.SAGITTARIUS: "You appear optimistic, adventurous, and philosophical. Others see you as inspiring.",
            ZodiacSign.CAPRICORN: "You appear serious, ambitious, and responsible. Others see you as competent and mature.",
            ZodiacSign.AQUARIUS: "You appear unique, friendly, and innovative. Others see you as progressive and independent.",
            ZodiacSign.PISCES: "You appear gentle, intuitive, and artistic. Others see you as compassionate and dreamy."
        }
        return meanings.get(sign, "Your outer personality creates a unique first impression.")
    
    def _get_moon_phase_meaning(self, phase: MoonPhase) -> str:
        """Get moon phase meaning"""
        meanings = {
            MoonPhase.NEW_MOON: "A time for new beginnings, setting intentions, and planting seeds for the future.",
            MoonPhase.WAXING_CRESCENT: "A time for taking action on your intentions and building momentum.",
            MoonPhase.FIRST_QUARTER: "A time for overcoming challenges and making important decisions.",
            MoonPhase.WAXING_GIBBOUS: "A time for refinement, adjustment, and preparing for manifestation.",
            MoonPhase.FULL_MOON: "A time of culmination, celebration, and releasing what no longer serves.",
            MoonPhase.WANING_GIBBOUS: "A time for gratitude, sharing wisdom, and giving back to others.",
            MoonPhase.LAST_QUARTER: "A time for forgiveness, letting go, and breaking bad habits.",
            MoonPhase.WANING_CRESCENT: "A time for rest, reflection, and preparing for the next cycle."
        }
        return meanings.get(phase, "This moon phase brings its own unique energy and opportunities.")
    
    def _get_natal_moon_meaning(self, sign: ZodiacSign) -> str:
        """Get natal moon meaning"""
        return f"Born under a {sign.value} moon, your emotional nature is deeply influenced by {sign.value} qualities. " + self._get_moon_sign_meaning(sign)
    
    def _get_natal_phase_meaning(self, phase: MoonPhase) -> str:
        """Get natal phase meaning"""
        return f"Born during the {phase.value}, you carry this lunar energy throughout your life. " + self._get_moon_phase_meaning(phase)
    
    # Human Design helper methods (simplified)
    
    def _get_hd_strategy(self, hd_type: HumanDesignType) -> str:
        """Get Human Design strategy"""
        strategies = {
            HumanDesignType.MANIFESTOR: "To inform before you act",
            HumanDesignType.GENERATOR: "To respond to life",
            HumanDesignType.MANIFESTING_GENERATOR: "To respond and then inform",
            HumanDesignType.PROJECTOR: "To wait for the invitation",
            HumanDesignType.REFLECTOR: "To wait a lunar cycle before making decisions"
        }
        return strategies.get(hd_type, "To follow your inner guidance")
    
    def _get_hd_authority(self, hd_type: HumanDesignType, total: int) -> HumanDesignAuthority:
        """Get Human Design authority (simplified)"""
        authority_index = total % 7
        authorities = [
            HumanDesignAuthority.EMOTIONAL,
            HumanDesignAuthority.SACRAL,
            HumanDesignAuthority.SPLENIC,
            HumanDesignAuthority.EGO,
            HumanDesignAuthority.SELF_PROJECTED,
            HumanDesignAuthority.ENVIRONMENTAL,
            HumanDesignAuthority.LUNAR
        ]
        return authorities[authority_index]
    
    def _get_hd_profile(self, total: int) -> str:
        """Get Human Design profile (simplified)"""
        profiles = ["1/3", "1/4", "2/4", "2/5", "3/5", "3/6", "4/6", "4/1", "5/1", "5/2", "6/2", "6/3"]
        return profiles[total % 12]
    
    def _get_defined_centers(self, total: int) -> List[str]:
        """Get defined centers (simplified)"""
        centers = ["Head", "Ajna", "Throat", "G", "Heart", "Spleen", "Solar Plexus", "Sacral", "Root"]
        num_defined = (total % 5) + 2  # 2-6 defined centers
        return centers[:num_defined]
    
    def _get_undefined_centers(self, total: int) -> List[str]:
        """Get undefined centers (simplified)"""
        all_centers = ["Head", "Ajna", "Throat", "G", "Heart", "Spleen", "Solar Plexus", "Sacral", "Root"]
        defined = self._get_defined_centers(total)
        return [center for center in all_centers if center not in defined]
    
    def _get_defined_gates(self, total: int) -> List[int]:
        """Get defined gates (simplified)"""
        num_gates = (total % 10) + 5  # 5-14 gates
        return list(range(1, num_gates + 1))
    
    def _get_defined_channels(self, total: int) -> List[str]:
        """Get defined channels (simplified)"""
        channels = ["1-8", "2-14", "3-60", "4-63", "5-15", "6-59", "7-31", "9-52", "10-20", "11-56"]
        num_channels = (total % 3) + 1  # 1-3 channels
        return channels[:num_channels]
    
    def _get_incarnation_cross(self, total: int) -> str:
        """Get incarnation cross (simplified)"""
        crosses = [
            "Right Angle Cross of the Four Ways",
            "Left Angle Cross of Wishes",
            "Juxtaposition Cross of Behavior",
            "Right Angle Cross of Service",
            "Left Angle Cross of Healing"
        ]
        return crosses[total % 5]
    
    def _get_hd_description(self, hd_type: HumanDesignType) -> str:
        """Get Human Design type description"""
        descriptions = {
            HumanDesignType.MANIFESTOR: "You are here to initiate and make things happen. You have the power to start new projects and influence others.",
            HumanDesignType.GENERATOR: "You are here to respond to life and build. You have sustainable life force energy when doing what you love.",
            HumanDesignType.MANIFESTING_GENERATOR: "You are a multi-passionate being who can initiate and respond. You move quickly and efficiently when aligned.",
            HumanDesignType.PROJECTOR: "You are here to guide and manage others. You have natural wisdom and see the bigger picture.",
            HumanDesignType.REFLECTOR: "You are here to reflect the health of your community. You are deeply wise and need time to make decisions."
        }
        return descriptions.get(hd_type, "You have a unique energetic design that guides your life path.")

