import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, getDocs, DocumentData } from "firebase/firestore";

interface Person {
  id: string;
  name: string;
  parentId?: string | null;
  generation?: string | null;
}

export default function AddPersonForm({ onPersonAdded }: { onPersonAdded?: () => void }) {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [generation, setGeneration] = useState<string>(""); 
  const [customGeneration, setCustomGeneration] = useState<string>(""); 
  const [people, setPeople] = useState<Person[]>([]);
  const [generations, setGenerations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch people & generations
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

      // ✅ Extract unique generations
      const gens = Array.from(
        new Set(peopleList.map((p) => p.generation).filter(Boolean))
      ) as string[];
      setGenerations(gens);
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

    const finalGeneration = generation === "other" ? customGeneration : generation;

    if (!finalGeneration) {
      alert("⚠️ Please select or enter a generation.");
      return;
    }

    setLoading(true);
    setSuccessMessage("");
    try {
      await addDoc(collection(db, "people"), {
        name,
        parentId: parentId || null,
        generation: finalGeneration,
        searchName: name.toLowerCase(),
      });

      // setName("");
      // setParentId("");
      // setGeneration("");
      // setCustomGeneration("");

      await fetchPeople();

      if (onPersonAdded) onPersonAdded();

      setSuccessMessage("✅ Person added successfully!");
      setTimeout(() => setSuccessMessage(""), 1000);
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
            <p className="text-green-400">{p.name}</p> {p.generation ? `(${p.generation})` : ""}
          </option>
        ))}
      </select>

      {/* ✅ Generation Dropdown */}
      <select
        className="border px-2 py-1 rounded w-full mb-2"
        value={generation}
        onChange={(e) => setGeneration(e.target.value)}
      >
        <option value="">-- Select Generation --</option>
        {generations.map((gen, idx) => (
          <option key={idx} value={gen}>
            {gen}
          </option>
        ))}
        <option value="other">➕ Other (type new)</option>
      </select>

      {/* ✅ Show input if "Other" is selected */}
      {generation === "other" && (
        <input
          type="text"
          className="border px-2 py-1 rounded w-full mb-2"
          value={customGeneration}
          onChange={(e) => setCustomGeneration(e.target.value)}
          placeholder="Enter new generation"
        />
      )}

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
