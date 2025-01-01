'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Category {
  categoryId: number;
  name: string;
  description?: string;
}

const getCategories = async () => {
  const res = await fetch("http://localhost:3333/categories");
  return res.json();
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    }

    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3333/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        setCategories(categories.filter(category => category.categoryId !== id));
        toast.success('Category deleted successfully!');
      } else {
        const errorContent = await res.json();
        toast.error(`Failed to delete category: ${errorContent.message}`);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('An error occurred while deleting the category.');
    }
  };

  return (
    <div className="antialiased bg-white text-gray-800 min-h-screen px-4">
      <h1 className="text-4xl font-bold text-center my-6">Categories</h1>
      <div className="flex flex-col justify-center h-full">
        <Link href="/categories/add">
          <button className="bg-green-500 text-white px-8 py-2 rounded-md transition duration-200 hover:bg-green-700">
            Add Category
          </button>
        </Link>
        <table className="min-w-full table-auto border-collapse border border-gray-400 mt-4">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.categoryId} className="border-t border-gray-300">
                <td className="border border-gray-300 px-4 py-2">{category.name}</td>
                <td className="border border-gray-300 px-4 py-2">{category.description}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <Link href={`/categories/view/${category.categoryId}`}>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded ml-2 transition duration-200 hover:bg-blue-700">View</button>
                  </Link>
                  <button onClick={() => handleDelete(category.categoryId)} className="bg-red-500 text-white px-4 py-2 rounded ml-2 transition duration-200 hover:bg-red-700">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
}

{/* <Link href={`/categories/update/${category.categoryId}`}>
                    <button className="bg-yellow-500 text-white px-4 py-2 rounded ml-2 transition duration-200 hover:bg-yellow-700">Edit</button>
                  </Link> */}