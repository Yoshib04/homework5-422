import { useState, useEffect } from 'react';
import { API_URL } from "./api.js";

function App() {
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: "",
    distanceMiles: "",
    difficulty: "Easy",
    region: ""
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Get trails
  useEffect(() => {
    async function loadTrails() {
      try {
        const res = await fetch(`${API_URL}/trails`);
        if (!res.ok) throw new Error("Failed to load trails");
        const data = await res.json();
        setTrails(data);
      } catch (err) {
        console.error(err);
        setError("Error loading trail data from API");
      } finally {
        setLoading(false);
      }
    }

    loadTrails();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Post trails
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`${API_URL}/trails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          distanceMiles: parseFloat(form.distanceMiles),
          difficulty: form.difficulty,
          region: form.region
        })
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        setSubmitError(errorBody.error || "Failed to create trail");
        return;
      }

      const createdTrail = await res.json();
      setTrails((prev) => [...prev, createdTrail]);

      // Reset form
      setForm({
        name: "",
        distanceMiles: "",
        difficulty: "Easy",
        region: ""
      });
    } catch (err) {
      console.error(err);
      setSubmitError("Error communicating with server");
    } finally {
      setSubmitting(false);
    }
  }

  // loading and errors
  let content;
  if (loading) {
    content = <p>Loading trails...</p>;
  } else if (error) {
    content = <p style={{ color: "red" }}>{error}</p>;
  } else if (trails.length === 0) {
    content = <p>No trails found.</p>;
  } else {
    content = (
      <div className="trail-grid">
        {trails.map((trail) => (
          <div key={trail.id} className="trail-card">
            <h3>{trail.name}</h3>
            <p><strong>Distance:</strong> {trail.distanceMiles} miles</p>
            <p><strong>Difficulty:</strong> {trail.difficulty}</p>
            <p><strong>Region:</strong> {trail.region}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Hiking Trail Explorer</h1>

      <section className="form-section">
        <h2>Add a New Trail</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Trail Name:
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Falcon Point Trails"
              required
            />
          </label>

          <label>
            Distance (Miles):
            <input
              type="number"
              step="0.1"
              name="distanceMiles"
              value={form.distanceMiles}
              onChange={handleChange}
              placeholder="e.g. 4.8"
              required
            />
          </label>

          <label>
            Difficulty:
            <select name="difficulty" value={form.difficulty} onChange={handleChange}>
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Hard">Hard</option>
            </select>
          </label>

          <label>
            Region:
            <input
              type="text"
              name="region"
              value={form.region}
              onChange={handleChange}
              placeholder="e.g. Blue Hills"
              required
            />
          </label>

          <button type="submit" disabled={submitting}>
            {submitting ? "Adding Trail..." : "Add Trail"}
          </button>

          {submitError && <p style={{ color: "red" }}>{submitError}</p>}
        </form>
      </section>

      <section className="list-section">
        <h2>All Trails</h2>
        {content}
      </section>
    </div>
  );
}

export default App;