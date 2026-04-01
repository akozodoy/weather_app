from sqlalchemy.orm import Session
from app.models import WeatherRecord

def create_weather_record(
        db: Session,
        location_query: str,
        location_name: str,
        region: str | None,
        country: str,
        latitude: float,
        longitude: float,
        temp_c: float | None,
        feelslike_c: float | None,
        condition: str | None,
        pm2_5: float | None,
        pm10: float | None,
        air_quality_status: str | None,
):
    
    record=WeatherRecord(
        location_query=location_query,
        location_name=location_name,
        region=region,
        country=country,
        latitude=latitude,
        longitude=longitude,
        temp_c=temp_c,
        feelslike_c=feelslike_c,
        condition=condition,
        pm2_5=pm2_5,
        pm10=pm10,
        air_quality_status=air_quality_status,
    )

    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def get_weather_records(db: Session):
    return db.query(WeatherRecord).order_by(WeatherRecord.id.desc()).all()

def get_weather_record_by_id(db: Session, record_id: int):
    return db.query(WeatherRecord).filter(WeatherRecord.id == record_id).first()


def delete_weather_record(db: Session, record_id: int):
    record = db.query(WeatherRecord).filter(WeatherRecord.id == record_id).first()
    if record is None:
        return None
    
    db.delete(record)
    db.commit()
    return record

def update_weather_record(
        db: Session,
        record_id: int,
        location_query: str,
        location_name: str,
        region: str | None,
        country: str,
        latitude: float,
        longitude: float,
        temp_c: float | None,
        feelslike_c: float | None,
        condition: str | None,
        pm2_5: float | None,
        pm10: float | None,
        air_quality_status: str | None,
):
    record = db.query(WeatherRecord).filter(WeatherRecord.id == record_id).first()
    if record is None:
        return None
    
    record.location_query = location_query
    record.location_name = location_name
    record.region=region
    record.country=country
    record.latitude=latitude
    record.longitude=longitude
    record.temp_c=temp_c
    record.feelslike_c=feelslike_c
    record.condition=condition
    record.pm2_5=pm2_5
    record.pm10=pm10
    record.air_quality_status=air_quality_status

    db.commit()
    db.refresh(record)
    return record