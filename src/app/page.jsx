"use client";

import { useEffect, useState } from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { Fetch } from "../lib/api";
import Link from "next/link";
import Carousel from '../components/Carousel';

function getConditionDescription(condition) {
  switch (condition) {
    case 'NEW':
      return 'Brand new, unused, in original packaging';
    case 'USED_LIKE_NEW':
      return 'Like new - barely used, no visible wear';
    case 'USED_VERY_GOOD':
      return 'Very good - minor signs of wear';
    case 'USED_GOOD':
      return 'Good - functional but noticeable wear';
    case 'USED_ACCEPTABLE':
      return 'Acceptable - heavily used but works';
    case 'FOR_PARTS':
      return 'For parts/not working - sold as-is';
    case 'REFURBISHED':
      return 'Refurbished - professionally restored';
    case 'OPEN_BOX':
      return 'Open box - unused but packaging opened';
    default:
      return 'Condition not specified';
  }
}

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getListings = async () => {
    try {
      setIsLoading(true);
      const response = await Fetch("/auctions");
      if (response) {
        const data = await response.auctions;
        setItems(data);
      } else {
        console.error("Failed to fetch auction items");
      }
    } catch (error) {
      console.error("Error fetching auctions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getListings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">Live Auctions</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl justify-center mx-auto">
            {items.length > 0 ? (
              items.map((item) => (
                <Link key={item.id} href={`/listing/${item.id}`} className="flex justify-center">
                  <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 h-full w-full max-w-xs">
                    <img src={item.images[0]} alt={item.title} className="w-full h-56 object-cover" />
                    <div className="p-5">
                      <h2 className="text-2xl font-semibold text-gray-900 text-center">{item.title}</h2>
                      <p className="text-gray-600 text-sm mt-2 text-center">{getConditionDescription(item.condition)}</p>
                      <p className="text-green-600 font-bold text-lg mt-3 text-center">Current Bid: ${item.currentBid}</p>
                      <button className="mt-4 flex items-center justify-center w-full bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                        <ShoppingCartIcon className="w-3 h-3 mr-2" />
                        Bid Now
                      </button>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-600 text-lg">
                No auctions available at the moment.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}