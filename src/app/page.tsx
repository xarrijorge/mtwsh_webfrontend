"use client";

import { useEffect, useState } from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface AuctionItem {
  id: string;
  title: string;
  description: string;
  image: string;
  currentBid: number;
}

export default function HomePage() {
  const [items, setItems] = useState<AuctionItem[]>([]);

  useEffect(() => {
    // Placeholder data until backend is ready
    setItems([
      {
        id: "1",
        title: "Vintage Watch",
        description: "A classic timepiece from the 1950s.",
        image: "https://via.placeholder.com/300x200",
        currentBid: 120,
      },
      {
        id: "2",
        title: "Luxury Handbag",
        description: "Designer handbag in pristine condition.",
        image: "https://via.placeholder.com/300x200",
        currentBid: 450,
      },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">Live Auctions</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {items.length > 0 ? (
            items.map((item) => (
              <Link key={item.id} href={`/listing/${item.id}`}>
                <div
                  key={item.id}
                  className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105"
                >
                  <img src={item.image} alt={item.title} className="w-full h-56 object-cover" />
                  <div className="p-5">
                    <h2 className="text-2xl font-semibold text-gray-900">{item.title}</h2>
                    <p className="text-gray-600 text-sm mt-2">{item.description}</p>
                    <p className="text-green-600 font-bold text-lg mt-3">Current Bid: ${item.currentBid}</p>
                    <button className="mt-4 flex items-center justify-center w-full bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                      <ShoppingCartIcon className="w-3 h-3 mr-2" />
                      Bid Now
                    </button>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-600 text-lg">No auctions available at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}