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
      {/* Navbar */}
      <nav className="w-full bg-white shadow-md py-4 px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-700">
          👨‍👩‍👧 Dompim Asamankama Geneology
        </h1>
        <div className="space-x-6 text-gray-600 font-medium">
          <button className="hover:text-blue-700">Home</button>
          <button className="hover:text-blue-700">Family Tree</button>
          <button className="hover:text-blue-700">Gallery</button>
          <button className="hover:text-blue-700">Events</button>
          <button className="hover:text-blue-700">About</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="flex flex-col items-center text-center py-20 px-6">
        <h2 className="text-5xl font-extrabold text-gray-800 drop-shadow-sm">
          Welcome to Our Family Website
        </h2>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl">
          Explore our family history, search for relatives, and keep track of our
          legacy together. This is our story — preserved for future generations.
        </p>
      </header>

      {/* Search Section */}
      <section className="w-full max-w-2xl mx-auto px-6 -mt-10">
        <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            🔍 Find Family Members
          </h3>
          <SearchBar onSelect={setSelectedPerson} />
        </div>
      </section>

      {/* Descendant Tree */}
      {selectedPerson && (
        <section className="w-full max-w-5xl mx-auto px-6 mt-16">
          <div className="bg-white shadow-xl rounded-2xl p-10 border border-gray-200">
            <h3 className="text-2xl font-bold text-blue-700 mb-6">
              🌳 Descendants of {selectedPerson.name}
            </h3>
            <DescendantTree person={selectedPerson} />
          </div>
        </section>
      )}

      {/* Extra Features Section */}
      <section className="w-full max-w-6xl mx-auto px-6 mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-xl transition">
          <h4 className="text-xl font-semibold text-green-700 mb-3">📸 Gallery</h4>
          <p className="text-gray-600">
            Browse cherished family memories in pictures & videos.
          </p>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-xl transition">
          <h4 className="text-xl font-semibold text-blue-700 mb-3">🎉 Events</h4>
          <p className="text-gray-600">
            Keep track of birthdays, weddings, and reunions.
          </p>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-xl transition">
          <h4 className="text-xl font-semibold text-purple-700 mb-3">📖 About</h4>
          <p className="text-gray-600">
            Read about our family’s history and origins.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 bg-white py-6 text-center border-t border-gray-200 text-gray-600">
        © {new Date().getFullYear()} Dompim Asamankama Geneology. All rights reserved.
      </footer>
    </div>
  );
}
