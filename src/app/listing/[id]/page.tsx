"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

interface AuctionItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  currentBid: number;
}

const dummyData: AuctionItem[] = [
  {
    id: "1",
    title: "Vintage Watch",
    description: "A classic timepiece from the 1950s.",
    images: ["https://via.placeholder.com/600x400"],
    currentBid: 120,
  },
  {
    id: "2",
    title: "Luxury Handbag",
    description: "Designer handbag in pristine condition.",
    images: ["https://via.placeholder.com/600x400"],
    currentBid: 450,
  },
  {
    id: "3",
    title: "Antique Vase",
    description: "Rare antique vase from 1800s, well preserved.",
    images: ["https://via.placeholder.com/600x400"],
    currentBid: 320,
  },
];

export default function ListingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [item, setItem] = useState<AuctionItem | null>(null);

  useEffect(() => {
    // Simulate fetching item from API
    const listing = dummyData.find((i) => i.id === params.id);
    if (listing) setItem(listing);
  }, [params.id]);

  if (!item) return <p className="text-center text-gray-600 mt-10">Loading listing...</p>;

  // Handle Previous / Next Navigation
  const currentIndex = dummyData.findIndex((i) => i.id === params.id);
  const prevItem = currentIndex > 0 ? dummyData[currentIndex - 1] : null;
  const nextItem = currentIndex < dummyData.length - 1 ? dummyData[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold mb-6 text-center">{item.title}</h1>
        
        {/* Image (Carousel to be added later) */}
        <div className="flex justify-center">
          <img src={item.images[0]} alt={item.title} className="w-full max-w-2xl h-96 object-cover rounded-lg shadow-lg" />
        </div>

        {/* Details */}
        <div className="max-w-2xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-lg">
          <p className="text-gray-700 text-lg">{item.description}</p>
          <p className="text-green-600 font-bold text-2xl mt-3">Current Bid: ${item.currentBid}</p>
          <button className="mt-4 w-full bg-blue-600 text-white font-medium px-4 py-3 rounded-lg hover:bg-blue-700 transition">
            Place a Bid
          </button>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          {prevItem ? (
            <button
              onClick={() => router.push(`/listing/${prevItem.id}`)}
              className="flex items-center bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Previous
            </button>
          ) : <div></div>}

          {nextItem ? (
            <button
              onClick={() => router.push(`/listing/${nextItem.id}`)}
              className="flex items-center bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Next
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </button>
          ) : <div></div>}
        </div>
      </div>
    </div>
  );
}