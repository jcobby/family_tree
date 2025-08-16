import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, getDocs, DocumentData } from "firebase/firestore";

interface Person {
  id: string;
  name: string;
  parentId?: string | null;
}

export default function AddPersonForm({ onPersonAdded }: { onPersonAdded?: () => void }) {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [people, setPeople] = useState<Person[]>([]);

  // Fetch people
  const fetchPeople = async () => {
    try {
      const snapshot = await getDocs(collection(db, "people"));
      const peopleList: Person[] = snapshot.docs.map((doc) => {
        const data = doc.data() as DocumentData;
        console.log("Fetched person:", data, "with parentId:", data.parentId);
        return {
          id: doc.id,
          name: data.name,
          parentId: data.parentId ?? null,
        };
      });
      console.log("Fetched people:", peopleList);
      setPeople(peopleList);
    } catch (error) {
      console.error("Failed to fetch people:", error);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  // Add person
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adding person:", name, "with parentId:", parentId || "None");

    try {
      await addDoc(collection(db, "people"), {
        name,
        parentId: parentId || null,
      });

      setName("");
      setParentId("");

      // Refresh people list after adding
      await fetchPeople();

      if (onPersonAdded) onPersonAdded();
    } catch (error) {
      console.error("Error adding person:", error);
    }
  };

  return (
    <form
      onSubmit={handleAdd}
      className="bg-white p-4 rounded shadow w-full max-w-md mx-auto mb-8"
    >
      <h2 className="text-lg font-bold mb-4">Add Person</h2>

      <input
        className="border px-2 py-1 rounded w-full mb-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
      />

      <select
        className="border px-2 py-1 rounded w-full mb-2"
        value={parentId}
        onChange={(e) => setParentId(e.target.value)}
      >
        <option value="">No parent (top ancestor)</option>
        {people.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 w-full"
      >
        Add Person
      </button>
    </form>
  );
}
