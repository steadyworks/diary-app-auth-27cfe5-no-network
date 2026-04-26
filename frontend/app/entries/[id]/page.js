"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

const API = "http://localhost:3001/api";

const MOOD_CLASSES = {
  happy: "bg-green-100 text-green-800",
  neutral: "bg-yellow-100 text-yellow-800",
  sad: "bg-blue-100 text-blue-800",
};

export default function EntryDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [entry, setEntry] = useState(null);

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
      .then((data) => { if (data) setEntry(data); });
  }, [id, router]);

  const handleDelete = async () => {
    await fetch(`${API}/entries/${id}`, { method: "DELETE", credentials: "include" });
    router.push("/");
  };

  if (!entry) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4">
        <Link href="/" className="text-blue-600 hover:underline text-sm">← Back</Link>
      </nav>
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h1
              data-testid="entry-title"
              className="text-2xl font-bold text-gray-900"
            >
              {entry.title}
            </h1>
            <span
              data-testid="entry-mood"
              className={`text-sm px-3 py-1 rounded-full font-medium ${MOOD_CLASSES[entry.mood] || ""}`}
            >
              {entry.mood}
            </span>
          </div>
          <p
            data-testid="entry-body"
            className="text-gray-700 whitespace-pre-wrap mb-6"
          >
            {entry.body}
          </p>
          <p
            data-testid="entry-created-at"
            className="text-sm text-gray-500 mb-6"
          >
            {new Date(entry.created_at).toLocaleString()}
          </p>
          <div className="flex gap-3">
            <Link
              href={`/entries/${id}/edit`}
              data-testid="edit-btn"
              className="bg-gray-100 text-gray-700 rounded px-4 py-2 text-sm font-medium hover:bg-gray-200"
            >
              Edit
            </Link>
            <button
              data-testid="delete-btn"
              onClick={handleDelete}
              className="bg-red-100 text-red-700 rounded px-4 py-2 text-sm font-medium hover:bg-red-200"
            >
              Delete
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
