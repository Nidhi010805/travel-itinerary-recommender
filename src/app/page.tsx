"use client";

import { useState } from "react";
import Image from "next/image";

type Result = {
  place: string;
  highlight: string;
  itinerary: string;
  bestTime?: string;
  activities?: string[];
  tags?: string[];
  image?: string;
};

export default function Home() {
  const [destination, setDestination] = useState("");
  const [useAi, setUseAi] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Result[]>([]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const res = await fetch(`/api/plan?useAi=${useAi}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: destination }),
      });

      const data: { ok: boolean; error?: string; results?: Result[] } = await res.json();
      if (!res.ok || !data.ok) throw new Error(data?.error || "Failed to fetch");
      setResults(data.results ?? []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <h1 className="title">🌍 Mini Travel Itinerary Recommender</h1>

      <form onSubmit={handleSubmit} className="search">
        <input
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Enter your travel destination"
          className="input"
        />
        <button disabled={loading} className="button">
          {loading ? "Finding…" : "Submit"}
        </button>
      </form>

      <label className="checkbox">
        <input
          type="checkbox"
          checked={useAi}
          onChange={(e) => setUseAi(e.target.checked)}
        />
        <span>✨ Use AI to rephrase (optional)</span>
      </label>

      {error && <p className="error">{error}</p>}

      <section className="grid">
        {results.map((r, idx) => (
          <article key={idx} className="card">
            {r.image && (
              <Image
                src={r.image}
                alt={r.place}
                width={400}
                height={250}
                className="card-image"
              />
            )}
            <h3>{r.place}</h3>
            <p className="muted">{r.highlight}</p>
            <p>{r.itinerary}</p>

            {r.bestTime && (
              <p className="best-time">
                <strong>Best time:</strong> {r.bestTime}
              </p>
            )}

            {r.activities && r.activities.length > 0 && (
              <ul className="activities">
                {r.activities.slice(0, 3).map((a, i) => (
                  <li key={i}>• {a}</li>
                ))}
              </ul>
            )}

            {r.tags && (
              <div className="tags">
                {r.tags.map((tag, i) => (
                  <span key={i} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </section>

      {!loading && results.length === 0 && (
        <p className="muted">
          💡 Try &quot;Goa&quot;, &quot;Kerala&quot;, &quot;Jaipur&quot;, etc.
        </p>
      )}
    </main>
  );
}
