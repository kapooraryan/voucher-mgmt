'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Campaign {
  campaignId: number;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
}

const getCampaigns = async () => {
  const res = await fetch("https://yearling-penny-napersonal-3fbe45d2.koyeb.app/campaigns");
  return res.json();
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchCampaigns() {
      const campaignsData = await getCampaigns();
      setCampaigns(campaignsData);
    }

    fetchCampaigns();
  }, []);

  const deleteCampaign = async (id: number) => {
    try {
      const res = await fetch(`https://yearling-penny-napersonal-3fbe45d2.koyeb.app/campaigns/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        setCampaigns(campaigns.filter(campaign => campaign.campaignId !== id));
        toast.success('Campaign deleted successfully');
      } else {
        const errorContent = await res.json();
        toast.error(`Failed to delete campaign: ${errorContent.message}`);
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast.error('An error occurred while deleting the campaign.');
    }
  };

  return (
    <div className="antialiased bg-white text-gray-800 min-h-screen px-4">
      <h1 className="text-4xl font-bold text-center my-6">Campaigns</h1>
      <div className="flex flex-col justify-center h-full">
        <Link href="/campaigns/add">
          <button className="bg-green-500 text-white px-8 py-2 rounded-md transition duration-200 hover:bg-green-700">
            Add Campaign
          </button>
        </Link>
        <table className="min-w-full table-auto border-collapse border border-gray-400 mt-4">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Start Date</th>
              <th className="border border-gray-300 px-4 py-2">End Date</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign: Campaign) => (
              <tr key={campaign.campaignId} className="border-t border-gray-300">
                <td className="border border-gray-300 px-4 py-2">{campaign.name}</td>
                <td className="border border-gray-300 px-4 py-2">{campaign.description || 'N/A'}</td>
                <td className="border border-gray-300 px-4 py-2">{new Date(campaign.startDate).toLocaleDateString()}</td>
                <td className="border border-gray-300 px-4 py-2">{new Date(campaign.endDate).toLocaleDateString()}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => router.push(`/campaigns/view/${campaign.campaignId}#view-details`)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md transition duration-200 hover:bg-blue-700"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => router.push(`/campaigns/view/${campaign.campaignId}#view-coupons`)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md transition duration-200 hover:bg-gray-700"
                    >
                      View Coupons
                    </button>
                    <button
                      onClick={() => deleteCampaign(campaign.campaignId)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md transition duration-200 hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
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
