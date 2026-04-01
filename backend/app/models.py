from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from app.database import Base

class WeatherRecord(Base):
    __tablename__ = "weather_records"

    id = Column(Integer, primary_key=True, index=True)
    location_query = Column(String, nullable=True)
    location_name = Column(String, nullable=True)
    region = Column(String, nullable=True)
    country = Column(String, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    temp_c = Column(Float, nullable=True)
    feelslike_c = Column(Float, nullable=True)
    condition = Column(String, nullable=True)

    pm2_5 = Column(Float, nullable=True)
    pm10 = Column(Float, nullable=True)
    air_quality_status = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

