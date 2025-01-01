'use client';

import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface Category {
  categoryId: number;
  name: string;
}

interface CampaignInput {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  targetCategoryId?: number | null;
  discountType: 'PERCENTAGE' | 'AMOUNT';
  discountValue: number;
  maxUsageLimit?: number | null;
  minCartValue?: number | null;
}

const getCategories = async (): Promise<Category[]> => {
  const res = await fetch('http://localhost:3333/categories');
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
};

const addCampaign = async (campaignData: CampaignInput) => {
  const res = await fetch('http://localhost:3333/campaigns', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(campaignData),
  });

  if (!res.ok) {
    const errorResponse = await res.json();
    console.error('Server Error:', errorResponse);
    throw new Error('Failed to create campaign');
  }
};

export default function AddCampaignPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<CampaignInput>();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load categories');
      }
    }
    fetchCategories();
  }, []);

  const onSubmit: SubmitHandler<CampaignInput> = async (data) => {
    const campaignData = {
      ...data,
      startDate: new Date(data.startDate).toISOString().split('T')[0],
      endDate: new Date(data.endDate).toISOString().split('T')[0],
      targetCategoryId: data.targetCategoryId ? +data.targetCategoryId : null, 
    };

    console.log('Payload sent to backend:', campaignData);

    try {
      await addCampaign(campaignData);
      toast.success('Campaign created successfully!');
      router.push('/campaigns');
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error('Failed to create campaign.');
    }
  };

  return (
    <div className="relative flex flex-col bg-white p-6 rounded-xl shadow-md">
      <h4 className="block text-xl font-medium text-slate-800">Add Campaign</h4>
      <p className="text-slate-500 font-light">Fill in the details to create a new campaign.</p>
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
          <label htmlFor="startDate" className="block font-medium text-slate-600">Start Date</label>
          <input
            id="startDate"
            type="date"
            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            {...register('startDate', { required: 'Start Date is required' })}
          />
          {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
        </div>

        <div>
          <label htmlFor="endDate" className="block font-medium text-slate-600">End Date</label>
          <input
            id="endDate"
            type="date"
            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            {...register('endDate', { required: 'End Date is required' })}
          />
          {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate.message}</p>}
        </div>

        <div>
          <label htmlFor="targetCategoryId" className="block font-medium text-slate-600">Target Category</label>
          <select
            id="targetCategoryId"
            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            {...register('targetCategoryId')}
          >
            <option value="">None</option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.categoryId} - {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="discountType" className="block font-medium text-slate-600">Discount Type</label>
          <select
            id="discountType"
            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            {...register('discountType', { required: 'Discount Type is required' })}
          >
            <option value="PERCENTAGE">Percentage</option>
            <option value="AMOUNT">Amount</option>
          </select>
          {errors.discountType && <p className="text-red-500 text-sm">{errors.discountType.message}</p>}
        </div>

        <div>
          <label htmlFor="discountValue" className="block font-medium text-slate-600">Discount Value</label>
          <input
            id="discountValue"
            type="number"
            step="0.01"
            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            {...register('discountValue', { required: 'Discount Value is required', valueAsNumber: true })}
          />
          {errors.discountValue && <p className="text-red-500 text-sm">{errors.discountValue.message}</p>}
        </div>

        <div>
          <label htmlFor="maxUsageLimit" className="block font-medium text-slate-600">Max Usage Limit</label>
          <input
            id="maxUsageLimit"
            type="number"
            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            {...register('maxUsageLimit', { valueAsNumber: true })}
          />
        </div>

        <div>
          <label htmlFor="minCartValue" className="block font-medium text-slate-600">Min Cart Value</label>
          <input
            id="minCartValue"
            type="number"
            step="0.01"
            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            {...register('minCartValue', { valueAsNumber: true })}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-slate-800 text-white rounded-md py-2 px-4 border border-transparent text-sm transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 disabled:pointer-events-none disabled:opacity-50"
        >
          Add Campaign
        </button>
      </form>
    </div>
  );
}
