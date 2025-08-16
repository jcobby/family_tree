'use client';

import { useState } from "react";
import { db } from "../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

interface Person {
  id: string;
  name: string;
  parentId?: string | null;
}

export default function SearchBar({ onSelect }: { onSelect: (person: Person) => void }) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Person[]>([]);
console.log("results:", results);
  const handleSearch = async () => {
    const term = search.trim();
    if (!term) {
      setResults([]);
      return;
    }
console.log("Searching for:", term);
    try {
      const q = query(
        collection(db, "people"),
        where("name", ">=", term),
        where("name", "<=", term + "\uf8ff")
      );
      console.log("Querying Firestore with:", q);
      const snapshot = await getDocs(q);
      console.log("Search results:", snapshot.docs.length);
      setResults(snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Person, "id">) })));
    } catch (error) {
      console.error("Error searching people:", error);
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center mb-6">
      <div className="flex gap-2">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search name..."
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>
      <ul className="w-full max-w-md">
        {results.map((person) => (
          <li key={person.id} className="py-1">
            <button
              onClick={() => onSelect(person)}
              className="text-blue-600 hover:underline"
            >
              {person.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
