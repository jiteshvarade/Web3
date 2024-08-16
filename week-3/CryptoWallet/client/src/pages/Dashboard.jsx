import React from 'react';

function Dashboard() {
  return (
    <div className="bg-black min-h-screen w-full flex flex-col items-center justify-center">
      <div className="flex space-x-4">
        <button className="px-6 py-3 bg-green-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition">
          Create Wallet
        </button>
        <button className="px-6 py-3 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition">
          Import Wallet
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
