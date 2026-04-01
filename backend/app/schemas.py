from pydantic import BaseModel
from datetime import datetime


class WeatherRecordUpdate(BaseModel):
    location: str
    
class WeatherRecordResponse(BaseModel):
    id: int
    location_query: str
    location_name: str
    region: str | None
    country: str
    latitude: float
    longitude: float
    temp_c: float | None
    feelslike_c: float | None
    condition: str | None
    pm2_5: float | None
    pm10: float | None
    air_quality_status: str | None
    created_at: datetime

    class Config: 
        from_attributes = True