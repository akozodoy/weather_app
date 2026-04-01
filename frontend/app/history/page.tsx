"use client";

import { useEffect, useState } from "react";

type HistoryRecord = {
  id: number;
  location_query: string;
  location_name: string;
  region: string | null;
  country: string;
  latitude: number;
  longitude: number;
  temp_c: number | null;
  feelslike_c: number | null;
  condition: string | null;
  pm2_5: number | null;
  pm10: number | null;
  air_quality_status: string | null;
  created_at: string;
};

export default function HistoryPage() {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newLocation, setNewLocation] = useState("");

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:8000/history");
      if (!res.ok) {
        throw new Error("Failed to load history");
      }

      const data = await res.json();
      setRecords(data);
    } catch (err) {
      setError("Could not load history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/history/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      setRecords((prev) => prev.filter((record) => record.id !== id));
    } catch (err) {
      alert("Could not delete record.");
    }
  };

  const handleStartEdit = (id: number, currentLocation: string) => {
    setEditingId(id);
    setNewLocation(currentLocation);
  };

  const handleUpdate = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/history/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ location: newLocation }),
      });

      if (!res.ok) {
        throw new Error("Update failed");
      }

      const updatedRecord = await res.json();

      setRecords((prev) =>
        prev.map((record) => (record.id === id ? updatedRecord : record))
      );

      setEditingId(null);
      setNewLocation("");
    } catch (err) {
      alert("Could not update record.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br bg-[var(--primary)] text-white px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Saved Weather History</h1>
            <p className="mt-2 text-slate-300">
              View, update, and delete previously saved weather searches.
            </p>
          </div>

          <a
            href="/"
            className="rounded-xl bg-sky-600 px-4 py-2 font-medium hover:bg-sky-500"
          >
            Back to Weather
          </a>
        </div>

        {loading && (
          <div className="rounded-2xl border border-slate-800 bg-[var(--primary)] p-6 text-slate-300">
            Loading history...
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-700 bg-red-950/40 p-4 text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && records.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            No saved weather records yet.
          </div>
        )}

        <div className="grid gap-4">
          {records.map((record) => (
            <div
              key={record.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">
                    {record.location_name}, {record.country}
                  </h2>
                  <p className="text-slate-400">
                    Query: {record.location_query}
                  </p>
                  <p className="text-slate-400">
                    Region: {record.region ?? "N/A"}
                  </p>
                  <p className="text-slate-400">
                    Temperature: {record.temp_c ?? "N/A"}°C
                  </p>
                  <p className="text-slate-400">
                    Feels like: {record.feelslike_c ?? "N/A"}°C
                  </p>
                  <p className="text-slate-400">
                    Condition: {record.condition ?? "N/A"}
                  </p>
                  <p className="text-slate-400">
                    Air quality: {record.air_quality_status ?? "N/A"}
                  </p>
                  <p className="text-slate-500 text-sm">
                    Saved: {new Date(record.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex min-w-[260px] flex-col gap-3">
                  {editingId === record.id ? (
                    <>
                      <input
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 outline-none focus:border-sky-500"
                        placeholder="Enter new location"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(record.id)}
                          className="rounded-xl bg-emerald-600 px-4 py-2 font-medium hover:bg-emerald-500"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setNewLocation("");
                          }}
                          className="rounded-xl border border-slate-700 px-4 py-2 font-medium hover:bg-slate-800"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          handleStartEdit(record.id, record.location_query)
                        }
                        className="rounded-xl bg-amber-600 px-4 py-2 font-medium hover:bg-amber-500"
                      >
                        Update Location
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="rounded-xl bg-red-600 px-4 py-2 font-medium hover:bg-red-500"
                      >
                        Delete Record
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}