from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse, StreamingResponse
from sqlalchemy.orm import Session
from io import StringIO
import csv
import json

from app.database import get_db
from app.crud import get_weather_records

router = APIRouter(prefix="/export", tags=["export"])

@router.get("/json")
def export_json(db: Session = Depends(get_db)):
    records = get_weather_records(db)

    data = []

    for record in records:
        r = {
                "id": record.id,
                "location_query": record.location_query,
                "location_name": record.location_name,
                "region": record.region,
                "counrty": record.country,
                "latitude": record.latitude,
                "locngitude": record.longitude,
                "temp_c": record.temp_c,
                "feelslike_c": record.feelslike_c,
                "condition": record.condition,
                "pm2_5": record.pm2_5,
                "pm10": record.pm10,
                "air_quality_status": record.air_quality_status,
                "created_at": record.created_at.isoformat() if record.created_at else None,
            }
        data.append(r)


    return JSONResponse(
        content=json.dumps(data),
        media_type="application/json",
        headers={"Content-Disposition": "attachment; filename=weather_history.json"}
    )

@router.get("/csv")
def export_csv(db: Session = Depends(get_db)):
    records = get_weather_records(db)

    output = StringIO()
    writer = csv.writer(output)

    writer.writerow([
        "id"
        "location_query",
        "location_name",
        "region",
        "counrty",
        "latitude",
        "locngitude",
        "temp_c",
        "feelslike_c",
        "condition",
        "pm2_5",
        "pm10",
        "air_quality_status",
        "created_at",
    ])

    for record in records:
        writer.writerow([
            record.id,
            record.location_query,
            record.location_name,
            record.region,
            record.country,
            record.latitude,
            record.longitude,
            record.temp_c,
            record.feelslike_c,
            record.condition,
            record.pm2_5,
            record.pm10,
            record.air_quality_status,
            record.created_at.isoformat() if record.created_at else None,
        ])

    output.seek(0)

    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=weather_history.csv"}
    )

