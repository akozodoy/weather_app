from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.weather import router as weather_router
from app.routers.history import router as history_router
from app.database import Base, engine
import app.models
from app.routers.export import router as export_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Weather App API")

app.include_router(weather_router)
app.include_router(history_router)
app.include_router(export_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://weather-app-one-omega-44.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/check")
def check():
    return {"running": "App is running"}