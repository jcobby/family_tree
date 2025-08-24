"use client";

import { useState } from "react";
import { db } from "../lib/firebase";
import { collection, query, where, getDocs, writeBatch } from "firebase/firestore";

export default function DeleteGeneration() {
  const [generation, setGeneration] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleDelete = async () => {
    if (!generation) {
      setMessage("⚠️ Please enter a generation number.");
      return;
    }

    if (!confirm(`Are you sure you want to delete generation ${generation}? This cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      // Query all people in that generation
      const q = query(collection(db, "people"), where("generation", "==", Number(generation)));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setMessage(`No people found in generation ${generation}.`);
        setLoading(false);
        return;
      }

      // Batch delete
      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      setMessage(`✅ Successfully deleted generation ${generation} and all its people.`);
    } catch (err) {
      console.error("Error deleting generation:", err);
      setMessage("❌ Failed to delete generation. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md p-4 rounded-md w-full max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-3">🗑️ Delete Generation</h2>

      <input
        type="number"
        placeholder="Enter generation number"
        value={generation}
        onChange={(e) => setGeneration(e.target.value)}
        className="border rounded px-3 py-2 w-full mb-3"
      />

      <button
        onClick={handleDelete}
        disabled={loading}
        className={`w-full py-2 rounded text-white ${
          loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
        }`}
      >
        {loading ? "Deleting..." : "Delete Generation"}
      </button>

      {message && <p className="mt-3 text-sm">{message}</p>}
    </div>
  );
}
