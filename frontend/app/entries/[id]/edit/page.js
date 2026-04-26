"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

const API = "http://localhost:3001/api";

export default function EditEntryPage() {
  const router = useRouter();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mood, setMood] = useState("neutral");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/auth/me`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) { router.replace("/login"); return null; }
        return fetch(`${API}/entries/${id}`, { credentials: "include" });
      })
      .then((res) => {
        if (!res) return null;
        if (res.status === 404) { router.replace("/"); return null; }
        return res.json();
      })
      .then((data) => {
        if (data) { setTitle(data.title); setBody(data.body); setMood(data.mood); }
      });
  }, [id, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await fetch(`${API}/entries/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title, body, mood }),
    });
    if (res.ok) {
      router.push(`/entries/${id}`);
    } else {
      const data = await res.json();
      setError(data.detail || "Failed to update entry");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4">
        <Link href={`/entries/${id}`} className="text-blue-600 hover:underline text-sm">← Back</Link>
      </nav>
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Entry</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              data-testid="title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
            <textarea
              data-testid="body-input"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={6}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mood</label>
            <select
              data-testid="mood-select"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="happy">happy</option>
              <option value="neutral">neutral</option>
              <option value="sad">sad</option>
            </select>
          </div>
          {error && (
            <p data-testid="form-error" className="text-red-600 text-sm">{error}</p>
          )}
          <button
            data-testid="entry-submit"
            type="submit"
            className="w-full bg-blue-600 text-white rounded px-4 py-2 font-medium hover:bg-blue-700"
          >
            Save Changes
          </button>
        </form>
      </main>
    </div>
  );
}
