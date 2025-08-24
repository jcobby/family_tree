"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";

type Person = {
  name: string;
  generation?: number;
  parentId?: string | null;
  id?: string; // Firestore document ID
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
          <div className="flex flex-wrap justify-center items-start relative">
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
  const [familyTrees, setFamilyTrees] = useState<Record<number, Person[]>>({});
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
          } else {
            roots.push(byId[p.id!]);
          }
        });

        // Group roots by generation
        const grouped: Record<number, Person[]> = {};
        roots.forEach((root) => {
          const gen = root.generation || 1;
          if (!grouped[gen]) grouped[gen] = [];
          grouped[gen].push(root);
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

  return (
    <div className="min-h-screen bg-gray-50 text-black py-8 px-3 sm:px-6 overflow-x-auto">
      {Object.keys(familyTrees)
        .sort((a, b) => Number(a) - Number(b))
        .map((genKey) => (
          <section key={genKey} className="mb-10">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 text-center">
              Generation {genKey}
            </h2>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
              {familyTrees[Number(genKey)].map((root) => (
                <TreeNode key={root.id} person={root} />
              ))}
            </div>
          </section>
        ))}
    </div>
  );
}
