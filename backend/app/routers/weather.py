from fastapi import APIRouter, Query, Depends
from sqlalchemy.orm import Session
from app.services.weather_service import fetch_weather_data
from app.services.air_quiality_service import fetch_air_quality, classify_pm25
from app.database import get_db
from app.crud import create_weather_record

router = APIRouter(prefix="/weather", tags=["weather"])

@router.get("")
async def get_weather(location: str = Query(..., min_length=1),
                      db: Session = Depends(get_db)):
    
    data = await fetch_weather_data(location)

    lat = data["location"]["lat"]
    lon = data["location"]["lon"]

    air_data = await fetch_air_quality(lat, lon)

    pm25 = air_data.get("current", {}).get("pm2_5")
    pm10 = air_data.get("current", {}).get("pm10")
    air_status = classify_pm25(pm25)
    
    create_weather_record(
        db=db,
        location_query=location,
        location_name=data["location"]["name"],
        region=data["location"]["region"],
        country=data["location"]["country"],
        latitude=lat,
        longitude=lon,
        temp_c=data["current"]["temp_c"],
        feelslike_c=data["current"]["feelslike_c"],
        condition=data["current"]["condition"]["text"],
        pm2_5=pm25,
        pm10=pm10,
        air_quality_status=air_status,
    )
    return {
        "location": {
            "name": data["location"]["name"],
            "region": data["location"]["region"],
            "country": data["location"]["country"],
            "lat": data["location"]["lat"],
            "lon": data["location"]["lon"],
            "localtime": data["location"]["localtime"],
        },
        "current": {
            "temp_c": data["current"]["temp_c"],
            "feelslike_c": data["current"]["feelslike_c"],
            "condition": data["current"]["condition"]["text"],
            "icon": "https:" + data["current"]["condition"]["icon"],
            "humidity": data["current"]["humidity"],
            "wind_kph": data["current"]["wind_kph"],
            "uv": data["current"]["uv"],
        },
        "forecast": [
           {
                "date": day["date"],
                "max_temp_c": day["day"]["maxtemp_c"],
                "min_temp_c": day["day"]["mintemp_c"],
                "condition": day["day"]["condition"]["text"],
                "icon": "https:" +  day["day"]["condition"]["icon"],
                "chance_of_rain": day["day"].get("daily_chance_of_rain"),
            }
            for day in data["forecast"]["forecastday"]
        ],
        "air_quality": {
            "pm2_5": pm25,
            "pm10": pm10,
            "status": classify_pm25(pm25)
        }
    }
