import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, getDocs, DocumentData } from "firebase/firestore";

interface Person {
  id: string;
  name: string;
  parentId?: string | null;
  generation?: number;
}

export default function AddPersonForm({ onPersonAdded }: { onPersonAdded?: () => void }) {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [generation, setGeneration] = useState<number | "">("");
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // ✅ success state

  // Fetch people
  const fetchPeople = async () => {
    try {
      const snapshot = await getDocs(collection(db, "people"));
      const peopleList: Person[] = snapshot.docs.map((doc) => {
        const data = doc.data() as DocumentData;
        return {
          id: doc.id,
          name: data.name,
          parentId: data.parentId ?? null,
          generation: data.generation ?? null,
        };
      });
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

    setLoading(true);
    setSuccessMessage(""); // clear old message
    try {
      await addDoc(collection(db, "people"), {
        name,
        parentId: parentId || null,
        generation: generation || null,
        searchName: name.toLowerCase(),
      });

      setName("");
      setParentId("");
      setGeneration("");

      await fetchPeople();

      if (onPersonAdded) onPersonAdded();

      setSuccessMessage("✅ Person added successfully!"); // ✅ show success
      setTimeout(() => setSuccessMessage(""), 3000); // auto-hide after 3s
    } catch (error) {
      console.error("Error adding person:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleAdd}
      className="bg-white p-4 rounded shadow w-full max-w-md mx-auto mb-8 mt-5"
    >
      <h2 className="text-lg font-bold mb-4">Add Person</h2>

      {successMessage && (
        <div className="mb-3 p-2 text-green-700 bg-green-100 border border-green-400 rounded">
          {successMessage}
        </div>
      )}

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
      {p.name} {p.generation ? `(Gen ${p.generation})` : ""}
    </option>
  ))}
</select>


      <input
        type="number"
        className="border px-2 py-1 rounded w-full mb-2"
        value={generation}
        onChange={(e) => setGeneration(Number(e.target.value))}
        placeholder="Generation (e.g., 1, 2, 3)"
        min={1}
      />

      <button
        type="submit"
        disabled={loading}
        className={`px-4 py-1 rounded w-full text-white ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? "Adding..." : "Add Person"}
      </button>
    </form>
  );
}
