'use client';

import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

interface Person {
  id: string;
  name: string;
  parentId?: string | null;
  generation?: number;
}

export default function SearchBar({ onSelect }: { onSelect: (person: Person) => void }) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);

  // Debounced search effect
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim().length > 0) {
        handleSearch(search.trim());
      } else {
        setResults([]);
      }
    }, 300); // waits 300ms after typing stops

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleSearch = async (term: string) => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "people"),
        where("searchName", ">=", term.toLowerCase()),
        where("searchName", "<=", term.toLowerCase() + "\uf8ff")
      );

      const snapshot = await getDocs(q);
      setResults(snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Person, "id">) })));
    } catch (error) {
      console.error("Error searching people:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center mb-6 relative w-full max-w-md">
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search name..."
        className="border px-3 py-2 rounded w-full"
      />

      {/* Dropdown suggestions */}
      {search && results.length > 0 && (
        <ul className="absolute top-full mt-1 w-full bg-white border rounded shadow-md max-h-60 overflow-y-auto z-10">
          {results.map((person) => (
            <li key={person.id} className="px-3 py-2 hover:bg-gray-100 cursor-pointer">
              <button
  onClick={() => {
    onSelect(person);
    setSearch("");       // clear input
    setResults([]);      // clear dropdown
  }}
  className="w-full text-left"
>
  {person.name}{" "}
  <span className="text-gray-500 text-sm">(Gen {person.generation})</span>
</button>

            </li>
          ))}
        </ul>
      )}

      {loading && <div className="text-gray-500 text-sm mt-1">Searching...</div>}
    </div>
  );
}
