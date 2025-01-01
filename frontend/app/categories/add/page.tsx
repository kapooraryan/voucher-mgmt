'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface CategoryInput {
  name: string;
  description?: string;
  minSpend?: number;
  maxSpend?: number;
  dateJoinedBefore?: string;
  creditCardType?: string;
  lastLoginOption?: string;
  lastLoginThreshold?: string;
}

const creditCardTypes = [
  'china-unionpay',
  'mastercard',
  'americanexpress',
  'diners-club-enroute',
  'instapayment',
  'jcb',
  'bankcard',
  'visa',
  'visa-electron',
  'maestro',
  'diners-club-carte-blanche',
  'laser',
  'diners-club-us-ca',
  'switch',
];

const addCategory = async (categoryData: CategoryInput) => {
  const res = await fetch('http://localhost:3333/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(categoryData),
  });

  if (!res.ok) {
    const errorResponse = await res.json();
    console.error('Server Error:', errorResponse);
    throw new Error('Failed to create category');
  }
};

export default function AddCategoryPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<CategoryInput>();

  const onSubmit: SubmitHandler<CategoryInput> = async (data) => {
    const categoryData: CategoryInput = {
      name: data.name,
      description: data.description || undefined,
      minSpend: !isNaN(data.minSpend!) && data.minSpend !== undefined ? data.minSpend : undefined,
      maxSpend: !isNaN(data.maxSpend!) && data.maxSpend !== undefined ? data.maxSpend : undefined,
      dateJoinedBefore: data.dateJoinedBefore ? new Date(data.dateJoinedBefore).toISOString().split('T')[0] : undefined,
      creditCardType: data.creditCardType || undefined,
      lastLoginOption: data.lastLoginOption || undefined,
      lastLoginThreshold: data.lastLoginThreshold ? new Date(data.lastLoginThreshold).toISOString().split('T')[0] : undefined,
    };

    console.log('Payload sent to backend:', categoryData);

    try {
      await addCategory(categoryData);
      toast.success('Category created successfully!');
      router.push('/categories');
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category.');
    }
  };

  return (
    <div className="relative flex flex-col bg-white p-6 rounded-xl shadow-md">
      <h4 className="block text-xl font-medium text-slate-800">Add Category</h4>
      <p className="text-slate-500 font-light">Fill in the details to create a new category.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 space-y-4">

        <div>
          <label htmlFor="name" className="block font-medium text-slate-600">Name</label>
          <input
            id="name"
            type="text"
            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block font-medium text-slate-600">Description</label>
          <textarea
            id="description"
            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            {...register('description')}
          />
        </div>

        <div>
          <label htmlFor="minSpend" className="block font-medium text-slate-600">Minimum Expenditure</label>
          <input
            id="minSpend"
            type="number"
            step="0.01"
            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            {...register('minSpend', { valueAsNumber: true })}
          />
        </div>

        <div>
          <label htmlFor="maxSpend" className="block font-medium text-slate-600">Maximum Expenditure</label>
          <input
            id="maxSpend"
            type="number"
            step="0.01"
            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            {...register('maxSpend', { valueAsNumber: true })}
          />
        </div>

        <div>
          <label htmlFor="dateJoinedBefore" className="block font-medium text-slate-600">User Joining Date</label>
          <input
            id="dateJoinedBefore"
            type="date"
            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            {...register('dateJoinedBefore')}
          />
        </div>

        <div>
          <label htmlFor="creditCardType" className="block font-medium text-slate-600">Credit Card Type</label>
          <select
            id="creditCardType"
            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            {...register('creditCardType')}
          >
            <option value="">Select a Credit Card Type</option>
            {creditCardTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="lastLoginOption" className="block font-medium text-slate-600">Last Login Option</label>
          <select id="lastLoginOption" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" {...register('lastLoginOption')}>
            <option value="">Select Option</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label htmlFor="lastLoginThreshold" className="block font-medium text-slate-600">Last Login Threshold Date</label>
          <input
            id="lastLoginThreshold"
            type="date"
            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            {...register('lastLoginThreshold')}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-slate-800 text-white rounded-md py-2 px-4 border border-transparent text-sm transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 disabled:pointer-events-none disabled:opacity-50"
        >
          Add Category
        </button>
      </form>
    </div>
  );
}