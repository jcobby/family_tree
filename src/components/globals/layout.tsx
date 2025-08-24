'use client';

import Link from 'next/link';
import React, { useState } from 'react';

export default function GlobalLayout({ children }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Navbar */}
      <nav className="w-full bg-white shadow-md py-4 px-6 md:px-12 flex justify-between items-center">
        {/* Title */}
        <h1 className="text-xl md:text-2xl font-bold text-blue-700">
          👨‍👩‍👧 Adjua Asamankama Ebusua at Dompim Pepesa
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 text-gray-600 font-medium">
          <Link href="/" className="hover:text-blue-700">Home</Link>
          <Link href="/familyTree" className="hover:text-blue-700">Family Tree</Link>
          <Link href="/gallery" className="hover:text-blue-700">Gallery</Link>
          <Link href="/events" className="hover:text-blue-700">Events</Link>
          <Link href="/about" className="hover:text-blue-700">About</Link>
        </div>

        {/* Mobile menu button (hamburger) */}
        <div className="md:hidden">
          <button
            className="text-gray-600 hover:text-blue-700 text-2xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md flex flex-col space-y-4 px-6 py-4 text-gray-600 font-medium">
          <Link href="/" className="hover:text-blue-700" onClick={() => setIsOpen(false)}>Home</Link>
          <Link href="/familyTree" className="hover:text-blue-700" onClick={() => setIsOpen(false)}>Family Tree</Link>
          <Link href="/gallery" className="hover:text-blue-700" onClick={() => setIsOpen(false)}>Gallery</Link>
          <Link href="/events" className="hover:text-blue-700" onClick={() => setIsOpen(false)}>Events</Link>
          <Link href="/about" className="hover:text-blue-700" onClick={() => setIsOpen(false)}>About</Link>
        </div>
      )}

      {/* Page Content */}
      <main>{children}</main>
    </div>
  );
}
