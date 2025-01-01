'use client';

import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';

interface Category {
  name: string;
  description?: string | null;
  minSpend?: number | null;
  maxSpend?: number | null;
  dateJoinedBefore?: string | null;
  creditCardType?: string | null;
  lastLoginOption?: string | null;
  lastLoginThreshold?: string | null;
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

const getCategoryById = async (id: number) => {
  const res = await fetch(`http://localhost:3333/categories/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch category');
  }
  return res.json();
};

const updateCategory = async (id: number, data: Category) => {
  const res = await fetch(`http://localhost:3333/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to update category');
  }
  return res.json();
};

export default function UpdateCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Category>();

  useEffect(() => {
    if (!id) {
      toast.error('Invalid ID');
      router.push('/categories');
      return;
    }

    getCategoryById(id)
      .then((data) => {
        setValue('name', data.name || '');
        setValue('description', data.description || '');
        setValue('minSpend', data.minSpend ?? null);
        setValue('maxSpend', data.maxSpend ?? null);
        setValue(
          'dateJoinedBefore',
          data.dateJoinedBefore
            ? new Date(data.dateJoinedBefore).toISOString().split('T')[0]
            : ''
        );
        setValue('creditCardType', data.creditCardType || '');
        setValue('lastLoginOption', data.lastLoginOption || '');
        setValue('lastLoginThreshold', data.lastLoginThreshold ?? '');
      })
      .catch((error) => {
        toast.error('Failed to load category details');
        console.error('Error fetching category:', error);
        router.push('/categories');
      });
  }, [id, setValue, router]);

  const onSubmit: SubmitHandler<Category> = async (data) => {
    const categoryData: Category = {
      ...data,
      minSpend: data.minSpend ?? null,
      maxSpend: data.maxSpend ?? null,
      dateJoinedBefore: data.dateJoinedBefore ?? null,
      creditCardType: data.creditCardType === '' ? undefined : data.creditCardType,
      lastLoginThreshold: data.lastLoginThreshold ?? null,
    };
  
    console.log('Payload being sent to the server:', categoryData);
  
    try {
      await updateCategory(id, categoryData);
      toast.success('Category updated successfully!');
      router.push('/categories');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category.');
    }
  };
  

  return (
    <div className="relative flex flex-col bg-white p-6 rounded-xl shadow-md">
      <h4 className="block text-xl font-medium text-slate-800">Update Category</h4>
      <p className="text-slate-500 font-light">Modify the details of the category below.</p>
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
          <textarea id="description" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" {...register('description')} />
        </div>

        <div>
          <label htmlFor="minSpend" className="block font-medium text-slate-600">Minimum Expenditure</label>
          <input id="minSpend" type="number" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" {...register('minSpend')} />
        </div>

        <div>
          <label htmlFor="maxSpend" className="block font-medium text-slate-600">Maximum Expenditure</label>
          <input id="maxSpend" type="number" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" {...register('maxSpend')} />
        </div>

        <div>
          <label htmlFor="dateJoinedBefore" className="block font-medium text-slate-600">User Joining Date</label>
          <input id="dateJoinedBefore" type="date" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" {...register('dateJoinedBefore')} />
        </div>

        <div>
          <label htmlFor="creditCardType" className="block font-medium text-slate-600">Credit Card Type</label>
          <select id="creditCardType" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" {...register('creditCardType')}>
            <option value="">Select Credit Card Type</option>
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
          <label htmlFor="lastLoginThreshold" className="block font-medium text-slate-600">Last Login Threshold</label>
          <input id="lastLoginThreshold" type="date" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" {...register('lastLoginThreshold')} />
        </div>

        <button
          type="submit"
          className="w-full bg-slate-800 text-white rounded-md py-2 px-4 border border-transparent text-sm transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 disabled:pointer-events-none disabled:opacity-50"
        >
          Update Category
        </button>
      </form>
    </div>
  );
}

