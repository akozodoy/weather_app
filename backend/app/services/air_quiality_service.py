import httpx
from fastapi import HTTPException

async def fetch_air_quality(lat: float, lon: float):
    url = "https://air-quality-api.open-meteo.com/v1/air-quality"

    params = {
        "latitude": lat,
        "longitude": lon,
        "current": "pm2_5,pm10"
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            return response.json()
        
    except httpx.HTTPStatusError:
        raise HTTPException(status_code=502, detail="Air quality API error")
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Unavailable")
    


def classify_pm25(pm25):
    if pm25 is None:
        return "Unknown"
    if pm25 <= 12:
        return "Good"
    if pm25 <= 35:
        return "Unhealty for sensitive group"
    return "Poor"