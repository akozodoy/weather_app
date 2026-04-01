from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.crud import get_weather_records, get_weather_record_by_id, delete_weather_record, update_weather_record
from app.schemas import WeatherRecordResponse, WeatherRecordUpdate
from app.services.air_quiality_service import fetch_air_quality, classify_pm25
from app.services.weather_service import fetch_weather_data

router = APIRouter(prefix="/history", tags=["history"])

@router.get("", response_model=list[WeatherRecordResponse])
def read_history(db: Session = Depends(get_db)):
    return get_weather_records(db)

@router.get("/{record_id}", response_model=WeatherRecordResponse)
def read_history_item(record_id: int, db: Session = Depends(get_db)):
    record = get_weather_record_by_id(db, record_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Record not found")
    return record


@router.delete("/{record_id}")
def delete_history_item(record_id: int, db: Session = Depends(get_db)):
    record = delete_weather_record(db, record_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Record not found")
    return {"message": f"Record {record_id} deleted successfully"}


@router.put("/{record_id}", response_model=WeatherRecordResponse)
async def update_histroy_item(record_id: int,
                              payload: WeatherRecordUpdate,
                              db: Session = Depends(get_db)):
    existing_record = get_weather_record_by_id(db, record_id)
    if existing_record is None: 
        raise HTTPException(status_code=404, detail="Record not found")
    
    data = await fetch_weather_data(payload.location)

    lat = data["location"]["lat"]
    lon = data["location"]["lon"]

    air_data = await fetch_air_quality(lat, lon)
    pm25 = air_data.get("current", {}).get("pm2_5")
    pm10 = air_data.get("current", {}).get("pm10")
    air_status = classify_pm25(pm25)

    updated_record = update_weather_record(
        db=db,
        record_id=record_id,
        location_query=payload.location,
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
    return updated_record