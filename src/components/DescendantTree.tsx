import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

interface Person {
  id: string;
  name: string;
  parentId?: string | null;
  children?: Person[];
}

async function fetchDescendants(personId: string): Promise<Person[]> {
  try {
    const q = query(collection(db, "people"), where("parentId", "==", personId));
    const snapshot = await getDocs(q);
console.log("Fetched descendants for personId:", personId, "Count:", snapshot.size);
    const children: Person[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Person, "id">),
    }));

    return await Promise.all(
      children.map(async (child) => ({
        ...child,
        children: await fetchDescendants(child.id),
      }))
    );
  } catch (err) {
    console.error("Error fetching descendants:", err);
    return [];
  }
}

export default function DescendantTree({ person }: { person: Person }) {
  const [descendants, setDescendants] = useState<Person[]>([]);

  useEffect(() => {
    fetchDescendants(person.id).then(setDescendants);
  }, [person.id]);

  const renderTree = (nodes: Person[]) => (
    <ul className="ml-6 list-disc">
      {nodes.map((child) => (
        <li key={child.id}>
          <span className="font-semibold">{child.name}</span>
          {child.children && child.children.length > 0 && renderTree(child.children)}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="bg-white p-4 rounded shadow w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-2">Descendants of {person.name}</h2>
      {descendants.length > 0 ? renderTree(descendants) : (
        <div className="text-gray-500">No descendants found.</div>
      )}
    </div>
  );
}
