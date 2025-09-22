"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";

type Person = {
  name: string;
  generation?: string;
  born?: number;
  parentId?: string | null;
  id?: string;
  children?: Person[];
};

function TreeNode({ person }: { person: Person }) {
  return (
    <div className="flex flex-col items-center">
      {/* Person node */}
      <div className="px-2 sm:px-4 py-1 sm:py-2 bg-blue-100 rounded-lg shadow text-blue-800 font-medium text-xs sm:text-sm text-center">
        {person.name}
      </div>

      {/* Children */}
      {person.children && person.children.length > 0 && (
        <div className="flex flex-col items-center mt-2">
          {/* vertical line */}
          <div className="w-0.5 h-4 bg-gray-400"></div>
<div className="flex justify-center items-start relative">
            {/* horizontal line connecting siblings */}
            <div className="absolute top-2 left-0 right-0 h-0.5 bg-gray-400 hidden sm:block"></div>
            {person.children.map((child) => (
              <div
                key={child.id}
                className="flex flex-col items-center relative px-2 sm:px-4 mb-4"
              >
                <div className="w-0.5 h-4 bg-gray-400"></div>
                <TreeNode person={child} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}



export default function FamilyTreePage() {
  const [familyTrees, setFamilyTrees] = useState<Record<string, Person[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFamily = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "people"));
        const data: Person[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Person[];

        // Map by ID
        const byId: Record<string, Person> = {};
        data.forEach((p) => {
          byId[p.id!] = { ...p, children: [] };
        });

        // Build tree
        const roots: Person[] = [];
data.forEach((p) => {
  if (p.parentId && byId[p.parentId]) {
    byId[p.parentId].children!.push(byId[p.id!]);

    // 🔹 Sort children left-to-right by born number
    byId[p.parentId].children!.sort((a, b) => {
      if (a.born != null && b.born != null) return a.born - b.born;
      return (a.born ?? 9999) - (b.born ?? 9999); // put missing born at the end
    });
  } else {
    roots.push(byId[p.id!]);
  }
});
       // Group roots by generation
const grouped: Record<string, Person[]> = {};
roots.forEach((root) => {
  const gen = root.generation || "Unknown";
  if (!grouped[gen]) grouped[gen] = [];
  grouped[gen].push(root);
});

// 🔹 Sort roots inside each generation by born number
Object.keys(grouped).forEach((gen) => {
  grouped[gen].sort((a, b) => {
    if (a.born != null && b.born != null) return a.born - b.born;
    return (a.born ?? 9999) - (b.born ?? 9999);
  });
});


        setFamilyTrees(grouped);
      } catch (error) {
        console.error("Error fetching family data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFamily();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  console.log('familyTrees',familyTrees);


  // 🔹 Define custom generation order
// 🔹 Your custom order but shorter keywords
const generationOrder = [
  "NANA ABREMA TO FOURTH",
  "AYISAA TO FIFTH",
  "EKOBA SENSEN TO FIFTH",
  "NKRUMAH TO FIFTH",
  "MANU TO SIXTH",
  "EFAH TO SIXTH",
  "AYA TO SIXTH",
  "ABA TO SEVENTH",
  "BAYO TO SEVENTH",
  "NYAWEBA TO SEVENTH",
  "MANZA ADOW TO  SEVENTH",
  "ATTA TO SEVENTH",
]; 

function normalizeGen(gen: string): string {
  return gen.toUpperCase();
}

function findGenIndex(gen: string): number {
  const upper = normalizeGen(gen);
  console.log('upper',upper);
  for (let i = 0; i < generationOrder.length; i++) {
    if (upper.includes(generationOrder[i])) return i;
  }
  return -1; // not found
}


  return (
    <div className="min-h-screen bg-gray-50 text-black py-8 px-3 sm:px-6 overflow-x-auto">
   {Object.keys(familyTrees)
  .sort((a, b) => {
  const indexA = findGenIndex(a);
  const indexB = findGenIndex(b);

  if (indexA !== -1 && indexB !== -1) return indexA - indexB;
  if (indexA !== -1) return -1;
  if (indexB !== -1) return 1;

  return a.localeCompare(b);
})
  .map((genKey) => (
    <section key={genKey} className="mb-10">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 text-center">
        {genKey}
      </h2>
      <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
        {familyTrees[genKey].map((root) => (
          <TreeNode key={root.id} person={root} />
        ))}
      </div>
    </section>
  ))}


    </div>
  );
}
