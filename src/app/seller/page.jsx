"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/lib/protectedRoute";
import { useAuthStore } from "@/stores/authStore";
import { Fetch } from "@/lib/api";

import Modal from "@/components/Modal";
import CreateAuctionForm from "@/components/CreateAuctionForm";
import {useAuctionStore} from "@/stores/auctionStore"

export default function SellerDashboardPage() {
  const { user } = useAuthStore();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  const {isCreateOpen, openCreateModal, closeCreateModal} = useAuctionStore()

  const fetchAuctions = async () => {
    try {
      const res = await Fetch(`/auctions/seller/${user.id}`);
      setAuctions(res.auctions);
    } catch (err) {
      console.error("Failed to load auctions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchAuctions();
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <ProtectedRoute role="SELLER">
      <div className="min-h-screen bg-gray-100 p-8 text-gray-900">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Welcome back, {user?.username}</h1>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-sm text-gray-500">Active Auctions</p>
              <p className="text-2xl font-bold">{auctions.filter(a => a.status === "OPEN").length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-sm text-gray-500">Total Bids</p>
              <p className="text-2xl font-bold">
                {auctions.reduce((total, a) => total + a.bids.length, 0)}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-sm text-gray-500">Reviews</p>
              <p className="text-2xl font-bold">{user?._count?.reviews || 0}</p>
            </div>
          </div>

          {/* Create Auction Button */}
          <div className="mb-6 flex justify-end">
            <button
              onClick={openCreateModal}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            >
              + Create Auction
            </button>
          </div>

          {/* Table Layout */}
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            {loading ? (
              <p className="p-4 text-gray-500">Loading...</p>
            ) : auctions.length === 0 ? (
              <p className="p-4 text-gray-500">You haven’t created any listings yet.</p>
            ) : (
              <table className="min-w-full text-sm table-auto">
                <thead className="bg-gray-100 text-left text-gray-700 uppercase text-xs">
                  <tr>
                    <th className="p-4">Image</th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Bids</th>
                    <th className="p-4">Views</th>
                    <th className="p-4">Ends At</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {auctions.map((auction) => (
                    <tr key={auction.id} className="border-t hover:bg-gray-50">
                      <td className="p-4">
                        <img
                          src={auction.images[0]}
                          alt={auction.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="p-4 font-medium text-gray-800">{auction.title}</td>
                      <td className="p-4 capitalize">{auction.status}</td>
                      <td className="p-4">{auction.bids.length}</td>
                      <td className="p-4">{auction.views}</td>
                      <td className="p-4">{new Date(auction.endsAt).toLocaleString()}</td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => alert(`TODO: Edit ${auction.id}`)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => alert(`TODO: Close ${auction.id}`)}
                          className="text-red-600 hover:underline"
                        >
                         {auction.status === "OPEN" ? "Close" : "Reopen"} 
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      <Modal isOpen={isCreateOpen} onClose={closeCreateModal}>
        <CreateAuctionForm onSuccess={() => {
          closeCreateModal();
          fetchAuctions(); // Refresh listings
        }} />
      </Modal>
    </ProtectedRoute>
  );
}