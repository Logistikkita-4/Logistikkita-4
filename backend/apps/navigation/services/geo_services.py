# apps/navigation/services/geo_services.py
import requests
from django.conf import settings
from geopy.distance import geodesic
import logging

logger = logging.getLogger(__name__)

class TomTomService:
    """Service untuk TOMTOM Geocoding & Routing API"""
    
    def __init__(self):
        self.api_key = settings.TOMTOM_API_KEY
        self.base_url = settings.TOMTOM_API_BASE_URL
        self.version = settings.TOMTOM_VERSION_NUMBER
        
    def geocode(self, address):
        """Convert address to coordinates"""
        if not self.api_key:
            logger.warning("TOMTOM_API_KEY tidak di-set")
            return None
            
        url = f"{self.base_url}/search/{self.version}/geocode/{address}.json"
        params = {
            'key': self.api_key,
            'language': 'id-ID',
            'limit': 1
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if data.get('results'):
                result = data['results'][0]
                return {
                    'address': result['address']['freeformAddress'],
                    'latitude': result['position']['lat'],
                    'longitude': result['position']['lon'],
                    'score': result['score']
                }
        except Exception as e:
            logger.error(f"TOMTOM Geocoding error: {e}")
            
        return None
    
    def calculate_route(self, origin, destination, travel_mode='car'):
        """Calculate route between two points"""
        if not self.api_key:
            return None
            
        url = f"{self.base_url}/routing/{self.version}/calculateRoute/{origin}:{destination}/json"
        params = {
            'key': self.api_key,
            'travelMode': travel_mode,
            'routeType': 'fastest',
            'traffic': 'true'
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if data.get('routes'):
                route = data['routes'][0]
                return {
                    'distance': route['summary']['lengthInMeters'],
                    'duration': route['summary']['travelTimeInSeconds'],
                    'traffic_delay': route['summary']['trafficDelayInSeconds']
                }
        except Exception as e:
            logger.error(f"TOMTOM Routing error: {e}")
            
        return None

class EmsifaService:
    """Service untuk EMSIFA Indonesia Regions API"""
    
    def __init__(self):
        self.base_url = settings.EMSIFA_API_BASE_URL
        
    def get_provinces(self):
        """Get semua provinsi Indonesia"""
        try:
            response = requests.get(f"{self.base_url}/provinces.json", timeout=10)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"EMSIFA Provinces error: {e}")
            return []
    
    def get_regencies(self, province_id):
        """Get kabupaten/kota berdasarkan provinsi"""
        try:
            response = requests.get(f"{self.base_url}/regencies/{province_id}.json", timeout=10)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"EMSIFA Regencies error: {e}")
            return []
    
    def get_districts(self, regency_id):
        """Get kecamatan berdasarkan kabupaten"""
        try:
            response = requests.get(f"{self.base_url}/districts/{regency_id}.json", timeout=10)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"EMSIFA Districts error: {e}")
            return []
    
    def get_villages(self, district_id):
        """Get kelurahan/desa berdasarkan kecamatan"""
        try:
            response = requests.get(f"{self.base_url}/villages/{district_id}.json", timeout=10)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"EMSIFA Villages error: {e}")
            return []

class GeoUtils:
    """Utility functions untuk geospatial calculations"""
    
    @staticmethod
    def calculate_distance(lat1, lon1, lat2, lon2):
        """Calculate distance antara dua koordinat (dalam km)"""
        coord1 = (lat1, lon1)
        coord2 = (lat2, lon2)
        return geodesic(coord1, coord2).kilometers
    
    @staticmethod
    def estimate_shipping_cost(distance_km, weight_kg, service_type='regular'):
        """Estimate biaya pengiriman berdasarkan jarak dan berat"""
        # Base rates (bisa diambil dari database nanti)
        base_rates = {
            'regular': 5000,  # Rp 5,000 per km
            'express': 8000,  # Rp 8,000 per km
            'same_day': 12000, # Rp 12,000 per km
        }
        
        rate = base_rates.get(service_type, 5000)
        base_cost = distance_km * rate
        
        # Tambah berdasarkan berat
        weight_cost = max(0, (weight_kg - 1)) * 2000  # Rp 2,000 per kg tambahan
        
        return base_cost + weight_cost
