import os
import httpx
from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()

WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")

async def fetch_weather_data(location: str):
    if not WEATHER_API_KEY: 
        raise HTTPException(status_code=500, detail="Missing Weather API key")
    
    url = "https://api.weatherapi.com/v1/forecast.json"
    params = {
        "key": WEATHER_API_KEY,
        "q": location,
        "days": 5,
        "aqi": "no",
        "alerts": "yes",
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            return response.json()
        
    except httpx.HTTPStatusError:
        raise HTTPException(status_code=404, detail="Location not found")
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Unavailable")
    