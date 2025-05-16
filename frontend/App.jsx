import React, { useState } from 'react';

const backend = "http://localhost:8000";

export default function App() {
  const [interests, setInterests] = useState([]);
  const [itinerary, setItinerary] = useState([]);

  const handleInterestChange = (val) => {
    setInterests(prev =>
      prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val]
    );
  };

  const handleSubmit = async () => {
    const body = {
      destination: "Rom",
      start_date: "2025-07-01",
      end_date: "2025-07-03",
      interests: interests,
      pace: "normal"
    };
    const res = await fetch(`${backend}/plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    setItinerary(data.itinerary);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>TripTailor MVP</h1>
      <p>Wähle deine Interessen:</p>
      {["Kultur", "Natur", "Essen"].map(cat => (
        <label key={cat}>
          <input
            type="checkbox"
            value={cat}
            checked={interests.includes(cat)}
            onChange={() => handleInterestChange(cat)}
          />
          {cat}
        </label>
      ))}
      <br /><br />
      <button onClick={handleSubmit}>Reiseplan erstellen</button>

      <hr />
      {itinerary.length > 0 && (
        <>
          <h2>Dein Reiseplan:</h2>
          {itinerary.map((day, idx) => (
            <div key={idx}>
              <h3>{day.date}</h3>
              <ul>
                {day.activities.map((a, i) => (
                  <li key={i}>
                    <strong>{a.name}</strong> ({a.category}, {a.recommended_time})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
