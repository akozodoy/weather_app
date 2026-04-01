"use client"

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type WeatherResponse = {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    location: string;
    localtime: string;
  };
  current: {
    temp_c: number;
    feelslike_c: number;
    condition: string;
    icon: string;
    humidity: number;
    wind_kph: number;
    uv: number;
  };
  forecast: {
    date: string;
    max_temp_c: number;
    min_temp_c: number;
    condition: string;
    icon: string;
    chance_of_rain: number | null;
  }[];
  air_quality: {
    pm2_5: number | null;
    pm10: number | null;
    status: string;
  };
};

export default function HomePage() {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async (searchLocation: string) => {
    try {
      setLoading(true);
      setError("");
      setWeather(null);

  const res = await fetch(
    `${API_URL}/weather?location=${encodeURIComponent(searchLocation)}`
  );
      if (!res.ok) {
        throw new Error("Could not fetch weather data");
      }

      const data: WeatherResponse = await res.json();
      setWeather(data);
    } catch (err) {
      setError("Could not load weather. Please check the location and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!location.trim()) {
      setError("Please enter a location.");
      return;
    }
    await fetchWeather(location);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = `${position.coords.latitude},${position.coords.longitude}`;
        await fetchWeather(coords);
      },
      () => {
        setLoading(false);
        setError("Unable to access your location.");
      }
    );
  };

  return (
    <main className="min-h-screen bg-[var(--primary)] px-5 py-3">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-white">Weather Explorer</h1>
          <p className="mt-2 text-slate-300 text-white">
            Search weather, forecast, and air quality for any location.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          <a
            href="/history"
            className="rounded-xl bg-sky-600 border-slate-700 px-4 py-2 font-medium hover:bg-slate-700 text-white"
          >
            View History
          </a>
          <a
            href={`${API_URL}/export/json`}
            target="_blank"
            className="rounded-xl border border-slate-700 px-4 py-2 font-medium hover:bg-slate-800 text-white"
          >
            Export JSON
          </a>
          <a
            href={`${API_URL}/export/csv`}
            target="_blank"
            className="rounded-xl border border-slate-700 px-4 py-2 font-medium hover:bg-slate-800 text-white"
          >
            Export CSV
          </a>
        </div>
        <div className="mb-8 rounded-2xl border rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
          <div className="flex flex-col gap-4 md:flex-row">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter city, postal code, or coordinates"
              className="flex-1 rounded-xl border border-white/10 bg-white/5 p-4 text-white backdrop-blur-md"
            />
            <button
              onClick={handleSearch}
              className="rounded-xl bg-sky-600 px-5 py-3 font-medium hover:bg-sky-500"
            >
              Search
            </button>
            <button
              onClick={handleUseMyLocation}
              className="rounded-xl bg-sky-600 px-5 py-3 font-medium hover:bg-sky-500"
            >
              Use My Location
            </button>
          </div>
        </div>

        {loading && (
          <div className="rounded-2xl border bg-[var(--primary)] p-6 text-slate-300 text-white">
            Loading weather data...
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-700 bg-red-950/40 p-4 text-red-200">
            {error}
          </div>
        )}

        {weather && (
          <div className="space-y-8">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-3xl font-semibold text-white">
                    {weather.location.name}, {weather.location.country}
                  </h2>
                  <p className="text-slate-400 text-white">
                    {weather.location.region} · Local time: {weather.location.localtime}
                  </p>
                  <div className="mt-4 flex items-center gap-4">
                    <img
                      src={weather.current.icon}
                      alt={weather.current.condition}
                      className="h-16 w-16"
                    />
                    <div>
                      <p className="text-5xl font-bold text-white">{weather.current.temp_c}°C</p>
                      <p className="text-slate-300 text-white">{weather.current.condition}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 md:w-[320px]">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                    <p className="text-sm text-slate-400 text-white">Feels like</p>
                    <p className="text-xl font-semibold text-white">{weather.current.feelslike_c}°C</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md ">
                    <p className="text-sm text-slate-400 text-white">Humidity</p>
                    <p className="text-xl font-semibold text-white">{weather.current.humidity}%</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                    <p className="text-sm text-slate-400 text-white">Wind</p>
                    <p className="text-xl font-semibold text-white">{weather.current.wind_kph} kph</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                    <p className="text-sm text-slate-400 text-white">UV</p>
                    <p className="text-xl font-semibold text-white">{weather.current.uv}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <div className="mb-4">
                <h3 className="text-2xl font-semibold text-white">Air Quality</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                  <p className="text-sm text-slate-400 text-white">PM2.5</p>
                  <p className="text-xl font-semibold text-white">{weather.air_quality.pm2_5 ?? "N/A"}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                  <p className="text-sm text-slate-400 text-white">PM10</p>
                  <p className="text-xl font-semibold text-white">{weather.air_quality.pm10 ?? "N/A"}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                  <p className="text-sm text-slate-400 text-white">Status</p>
                  <p className="text-xl font-semibold text-white">{weather.air_quality.status}</p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <div className="mb-4">
                <h3 className="text-2xl font-semibold text-white">5-Day Forecast</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {weather.forecast.map((day) => (
                  <div
                    key={day.date}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
                  >
                    <p className="font-medium text-white">{day.date}</p>
                    <img
                      src={day.icon}
                      alt={day.condition}
                      className="my-3 h-14 w-14"
                    />
                    <p className="text-slate-300">{day.condition}</p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {day.max_temp_c}° / {day.min_temp_c}°
                    </p>
                    <p className="text-sm text-slate-400 text-white">
                      Rain chance: {day.chance_of_rain ?? 0}%
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}