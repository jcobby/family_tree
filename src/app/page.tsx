"use client";

import AddPersonForm from "@/components/AddPersonForm";
import DescendantTree from "@/components/DescendantTree";
import SearchBar from "@/components/SearchBar";
import { useState } from "react";

interface Person {
  id: string;
  name: string;
  [key: string]: any;
}

export default function Home() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handlePersonAdded = () => {
    setSelectedPerson(null); // Clear selection after adding a person
  };

  return (
   <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 via-white to-blue-50">
 

  {/* Hero Section */}
  <header className="flex flex-col items-center text-center py-16 md:py-20 px-4">
    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-800 drop-shadow-sm">
      Welcome to Our Family Website
    </h2>
    <p className="mt-4 text-base md:text-lg text-gray-600 max-w-2xl">
      Explore our family history, search for relatives, and keep track of our
      legacy together. This is our story — preserved for future generations.
    </p>
  </header>

  {/* Search Section */}
  <section className="w-full max-w-xl mx-auto px-4 -mt-8 md:-mt-10">
    <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 border border-gray-200">
      <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-700">
        🔍 Find Family Members
      </h3>
      <SearchBar onSelect={setSelectedPerson} />
    </div>
  </section>

  {/* Descendant Tree */}
  {selectedPerson && (
    <section className="w-full max-w-5xl mx-auto px-4 mt-12 md:mt-16">
      <div className="bg-white shadow-xl rounded-2xl p-6 md:p-10 border border-gray-200">
        <h3 className="text-xl md:text-2xl font-bold text-blue-700 mb-6">
          🌳 Descendants of {selectedPerson.name}
        </h3>
        <DescendantTree person={selectedPerson} />
      </div>
    </section>
  )}

  {/* Extra Features Section */}
  <section className="w-full max-w-6xl mx-auto px-4 mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
    <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-xl transition">
      <h4 className="text-lg md:text-xl font-semibold text-green-700 mb-3">📸 Gallery</h4>
      <p className="text-gray-600 text-sm md:text-base">
        Browse cherished family memories in pictures & videos.
      </p>
    </div>
    <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-xl transition">
      <h4 className="text-lg md:text-xl font-semibold text-blue-700 mb-3">🎉 Events</h4>
      <p className="text-gray-600 text-sm md:text-base">
        Keep track of birthdays, weddings, and reunions.
      </p>
    </div>
    <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-xl transition">
      <h4 className="text-lg md:text-xl font-semibold text-purple-700 mb-3">📖 About</h4>
      <p className="text-gray-600 text-sm md:text-base">
        Read about our family’s history and origins.
      </p>
    </div>
  </section>

  {/* Footer */}
  <footer className="mt-16 md:mt-20 bg-white py-6 text-center border-t border-gray-200 text-gray-600 text-sm md:text-base">
    © {new Date().getFullYear()} Adjua Asamankama Ebusua at Dompim Pepesa. All rights reserved.
  </footer>
</div>

  );
}
