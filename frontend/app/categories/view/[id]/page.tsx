'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Category {
  categoryId: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const getCategoryById = async (id: number) => {
  const res = await fetch(`http://localhost:3333/categories/${id}`);
  return res.json();
};

export default function CategoryViewPage() {
  const [category, setCategory] = useState<Category | null>(null);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    async function fetchCategory() {
      const categoryData = await getCategoryById(Number(id));
      setCategory(categoryData);
    }

    fetchCategory();
  }, [id]);

  if (!category) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading category details...</p>
      </div>
    );
  }

  return (
    <div className="antialiased bg-white text-gray-800 min-h-screen px-4">
      <div id="view-details" className="max-w-4xl mx-auto bg-gray-100 shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-4xl font-bold text-center my-6">{category.name}</h1>
        <h2 className="text-2xl font-semibold mb-4">Category Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Category Name:</p>
            <p className="text-gray-700">{category.name}</p>
          </div>
          <div>
            <p className="font-semibold">Description:</p>
            <p className="text-gray-700">{category.description || 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold">Created At:</p>
            <p className="text-gray-700">{new Date(category.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="font-semibold">Updated At:</p>
            <p className="text-gray-700">{new Date(category.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <button
          onClick={() => router.push('/categories')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
        >
          Back to Categories
        </button>
      </div>
    </div>
  );
}
