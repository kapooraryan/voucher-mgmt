'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

enum DiscountType {
  PERCENTAGE,
  AMOUNT,
}

interface Coupon {
  couponId: number;
  code: string;
  startDate: Date;
  expiryDate: Date;
  usedCount: number;
  userId: number;
  campaignId: number;
}

interface Campaign {
  campaignId: number;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  targetCategoryId: number;
  discountType: DiscountType;
  discountValue: number;
  maxUsageLimit: number;
  minCartValue: number;
  coupons: Coupon[];
  createdAt: Date;
  updatedAt: Date;
}

const getCampaignWithCoupons = async (id: number) => {
  const res = await fetch(`https://yearling-penny-napersonal-3fbe45d2.koyeb.app/campaigns/${id}`);
  return res.json();
};

export default function CampaignViewPage() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    async function fetchCampaign() {
      const campaignData = await getCampaignWithCoupons(Number(id));
      setCampaign(campaignData);
    }

    fetchCampaign();
  }, [id]);

  if (!campaign) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading campaign details...</p>
      </div>
    );
  }

  return (
    <div className="antialiased bg-white text-gray-800 min-h-screen px-4">
      <div id="view-details" className="max-w-4xl mx-auto bg-gray-100 shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-4xl font-bold text-center my-6">{campaign.name}</h1>
        <h2 className="text-2xl font-semibold mb-4">Campaign Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Description:</p>
            <p className="text-gray-700">{campaign.description || 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold">Start Date:</p>
            <p className="text-gray-700">{new Date(campaign.startDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="font-semibold">End Date:</p>
            <p className="text-gray-700">{new Date(campaign.endDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="font-semibold">Discount Type:</p>
            <p className="text-gray-700">{DiscountType[campaign.discountType]}</p>
          </div>
          <div>
            <p className="font-semibold">Discount Value:</p>
            <p className="text-gray-700">{campaign.discountValue}</p>
          </div>
          <div>
            <p className="font-semibold">Target Category ID:</p>
            <p className="text-gray-700">{campaign.targetCategoryId}</p>
          </div>
          <div>
            <p className="font-semibold">Max Usage Limit:</p>
            <p className="text-gray-700">{campaign.maxUsageLimit}</p>
          </div>
          <div>
            <p className="font-semibold">Min Cart Value:</p>
            <p className="text-gray-700">{campaign.minCartValue}</p>
          </div>
        </div>
      </div>

      <div id="view-coupons" className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Coupons</h2>
        <table className="min-w-full table-auto border-collapse border border-gray-400 mt-4">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Coupon ID</th>
              <th className="border border-gray-300 px-4 py-2">Code</th>
              <th className="border border-gray-300 px-4 py-2">Start Date</th>
              <th className="border border-gray-300 px-4 py-2">Expiry Date</th>
              <th className="border border-gray-300 px-4 py-2">Used Count</th>
              <th className="border border-gray-300 px-4 py-2">User ID</th>
              <th className="border border-gray-300 px-4 py-2">Campaign ID</th>
            </tr>
          </thead>
          <tbody>
            {campaign.coupons.length > 0 ? (
              campaign.coupons.map((coupon) => (
                <tr key={coupon.couponId} className="border-t border-gray-300">
                  <td className="border border-gray-300 px-4 py-2">{coupon.couponId}</td>
                  <td className="border border-gray-300 px-4 py-2">{coupon.code}</td>
                  <td className="border border-gray-300 px-4 py-2">{new Date(coupon.startDate).toLocaleDateString()}</td>
                  <td className="border border-gray-300 px-4 py-2">{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                  <td className="border border-gray-300 px-4 py-2">{coupon.usedCount}</td>
                  <td className="border border-gray-300 px-4 py-2">{coupon.userId}</td>
                  <td className="border border-gray-300 px-4 py-2">{coupon.campaignId}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                >
                  No coupons found for this campaign.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="text-center mt-8">
        <button
          onClick={() => router.push('/campaigns')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
        >
          Back to Campaigns
        </button>
      </div>
    </div>
  );
}
