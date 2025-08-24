'use client';

import AddPersonForm from '@/components/AddPersonForm'
import DeleteGeneration from '@/components/GenerationDelete';
import React from 'react'

export default function page() {
  return (
    <div>
      <AddPersonForm />
      <DeleteGeneration />
    </div>
  )
}
