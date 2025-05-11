"use client";

import { use, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Fetch } from "@/lib/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Carousel from '../../../components/Carousel';
import { useAuthStore } from '../../../stores/authStore';
import { useAuctionStore } from '../../../stores/auctionStore';

dayjs.extend(relativeTime);

export default function ListingPage({ params }) {
  // Properly unwrap params promise
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  
  const router = useRouter();
  const [item, setItem] = useState(null);
  const [yourBid, setYourBid] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);

  const { isAuthenticated, user } = useAuthStore();
  const { placeBid, placingBid, bidError, bidSuccess, clearBidState } = useAuctionStore();

  const handlePlaceBid = async () => {
    if (!isAuthenticated || user?.role !== "BUYER") {
      alert("Please login as a buyer to place a bid.");
      router.push("/login");
      return;
    }
    
    if (placingBid || !yourBid || isNaN(yourBid)) return;

    try {
      await placeBid(id, parseFloat(yourBid));
      setYourBid("");
      await fetchListing();
    } catch (err) {
      console.error("Bid failed:", err.message);
    }
  };

  const fetchListing = async () => {
    try {
      setLoading(true);
      const response = await Fetch(`/auctions/${id}`);
      if (response) setItem(response);
    } catch (error) {
      console.error("Failed to fetch listing:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailClick = (index) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    fetchListing();
  }, [id]);

  useEffect(() => {
    if (bidSuccess || bidError) {
      const timer = setTimeout(() => clearBidState(), 4000);
      return () => clearTimeout(timer);
    }
  }, [bidSuccess, bidError]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Listing not found</p>
      </div>
    );
  }

  const {
    title,
    description,
    condition,
    images = [],
    highestBid,
    startingBid,
    minBidIncrement,
    buyNowPrice,
    endsAt,
    views,
    seller = {},
    bids = [],
  } = item;

  const currentBid = parseFloat(highestBid) || parseFloat(startingBid);
  const minBid = currentBid + parseFloat(minBidIncrement);
  const currency = (amount) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(amount);

  const tabs = [
    { id: "description", label: "DESCRIPTION" },
    { id: "detail", label: "DETAIL" },
    { id: "specifications", label: "SPECIFICATIONS" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Image Gallery */}
          <div className="space-y-4">
            <Carousel
              ref={carouselRef}
              images={images.map((img) => ({ src: img, alt: title }))}
              showControls={images.length > 1}
              activeIndex={activeIndex}
              onSlideChange={setActiveIndex}
            />
            
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`w-10 h-10 flex-shrink-0 rounded-md border transition ${activeIndex === i ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-300'}`}
                    onClick={() => handleThumbnailClick(i)}
                  >
                    <img
                      src={img}
                      className="w-full h-full object-cover rounded"
                      alt={`${title} thumbnail ${i}`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auction Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
              <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
                <span>{bids.length} {bids.length === 1 ? 'Bid' : 'Bids'}</span>
                <span>{views} {views === 1 ? 'View' : 'Views'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Current Bid</p>
                <p className="text-green-600 font-semibold text-xl">
                  {currency(currentBid)}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Min Increment</p>
                <p className="text-gray-700 font-medium">{currency(minBidIncrement)}</p>
              </div>
              <div>
                <p className="text-gray-500">Condition</p>
                <p className="font-medium capitalize">{condition?.toLowerCase() || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500">Ends In</p>
                <p className="font-medium text-red-600">
                  {dayjs(endsAt).fromNow(true)}
                </p>
              </div>
            </div>

            {buyNowPrice && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-500 text-sm">Buy It Now</p>
                <p className="text-black font-semibold text-xl">
                  {currency(buyNowPrice)}
                </p>
                <button className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                  Buy Now
                </button>
              </div>
            )}

            {/* Bid Form */}
            <div className="border-t pt-4">
              <label className="block text-gray-700 font-medium mb-2">
                Place Your Bid
              </label>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={yourBid}
                  onChange={(e) => setYourBid(e.target.value)}
                  placeholder={`Min: ${currency(minBid)}`}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min={minBid}
                  step="0.01"
                />
                <button
                  onClick={handlePlaceBid}
                  disabled={placingBid || !yourBid || parseFloat(yourBid) < minBid}
                  className={`bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition
                    ${(placingBid || !yourBid || parseFloat(yourBid) < minBid) 
                      ? "opacity-50 cursor-not-allowed" 
                      : "hover:bg-blue-700"}`}
                >
                  {placingBid ? "Placing..." : "Place Bid"}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Minimum bid: {currency(minBid)}
              </p>
              
              {bidSuccess && (
                <p className="text-green-600 text-sm mt-2">Bid placed successfully!</p>
              )}
              {bidError && (
                <p className="text-red-600 text-sm mt-2">{bidError}</p>
              )}
            </div>

            {/* Seller Info */}
            <div className="flex items-center gap-4 pt-4 border-t">
              <div className="relative">
                {seller?.profileImage ? (
                  <img
                    src={seller.profileImage}
                    className="w-12 h-12 rounded-full border"
                    alt={seller.username}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600">
                    {seller?.username?.[0]?.toUpperCase() || 'S'}
                  </div>
                )}
                {seller?.isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium">{seller?.username || 'Seller'}</p>
                <p className="text-xs text-gray-500">Member since {dayjs(seller?.createdAt).format('YYYY')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="border-t">
          <div className="flex border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`px-6 py-3 font-medium text-sm ${activeTab === tab.id 
                  ? "text-blue-600 border-b-2 border-blue-600" 
                  : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="p-6">
            {activeTab === "description" && (
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{description}</p>
              </div>
            )}
            
            {activeTab === "detail" && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Category</p>
                  <p className="font-medium">Electronics</p>
                </div>
                <div>
                  <p className="text-gray-500">Location</p>
                  <p className="font-medium">Nairobi</p>
                </div>
              </div>
            )}
            
            {activeTab === "specifications" && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Brand</p>
                  <p className="font-medium">Apple</p>
                </div>
                <div>
                  <p className="text-gray-500">Model</p>
                  <p className="font-medium">iPhone 13 Pro Max</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}