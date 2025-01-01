import Link from "next/link";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Voucher Management Project</h1>
      <div className="flex space-x-4">
        <Link href="/campaigns">
          <button className="p-[3px] relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
            <div className="px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
              Campaign Management
            </div>
          </button>
        </Link>
        <Link href="/categories">
          <button className="p-[3px] relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
            <div className="px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
              Category Management
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
