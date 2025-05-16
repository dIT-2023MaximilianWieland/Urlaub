from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
import json
from datetime import datetime, timedelta

app = FastAPI()

# CORS für lokal laufendes Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

with open("pois.json", "r", encoding="utf-8") as f:
    POIS = json.load(f)

class PlanRequest(BaseModel):
    destination: str
    start_date: str
    end_date: str
    interests: list
    pace: str

@app.post("/plan")
def generate_plan(req: PlanRequest):
    days = (datetime.fromisoformat(req.end_date) - datetime.fromisoformat(req.start_date)).days + 1
    times = ["morning", "afternoon", "evening"]
    pace_map = {"entspannt": 2, "normal": 3, "aktiv": 4}
    max_per_day = pace_map[req.pace]

    filtered_pois = [p for p in POIS if p["category"] in req.interests]

    itinerary = []
    for i in range(days):
        day_plan = []
        random.shuffle(times)
        for t in times:
            if len(day_plan) >= max_per_day:
                break
            candidates = [p for p in filtered_pois if p["recommended_time"] == t]
            if candidates:
                act = random.choice(candidates)
                day_plan.append(act)
                filtered_pois.remove(act)
        itinerary.append({
            "date": (datetime.fromisoformat(req.start_date) + timedelta(days=i)).strftime("%Y-%m-%d"),
            "activities": day_plan
        })

    return {"itinerary": itinerary}
