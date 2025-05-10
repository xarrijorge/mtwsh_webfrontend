"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Fetch } from "@/lib/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { useAuthStore } from '../../../stores/authStore';
import { useAuctionStore } from '../../../stores/auctionStore';


export default function ListingPage({ params }) {

  const wrappedParams = use(params);
  const { id } = wrappedParams;
  const router = useRouter();
  const [item, setItem] = useState(null);
  const [yourBid, setYourBid] = useState("");

  const {isAuthenticated, user} = useAuthStore();
  const { placeBid, placingBid, bidError, bidSuccess, clearBidState } = useAuctionStore();

  dayjs.extend(relativeTime);

  const handlePlaceBid = async () => {
    if(!isAuthenticated || !(user.role === "BUYER")) {
      alert("Please login as a buyer to place a bid.");
      router.push("/login");
      return;
    }
    if (placingBid) return; // Prevent multiple submissions

    if (!yourBid || isNaN(yourBid)) return;
  
    try {
      await placeBid(id, parseFloat(yourBid));
      setYourBid(""); // Clear field
      await Fetch(`/auctions/${id}`).then(setItem); // Refresh auction data
    } catch (err) {
      console.error("Bid failed:", err.message);
    }
  
    setTimeout(() => {
      clearBidState();
    }, 4000);
  };

  useEffect(() => {
    const getListing = async () => {
      const response = await Fetch(`/auctions/${id}`);
      if (response) setItem(response);
    };
    getListing();
  }, [id]);

  if (!item) return <p className="text-center text-gray-600 mt-10">Loading listing...</p>;

  const {
    title,
    description,
    condition,
    images,
    highestBid,
    startingBid,
    minBidIncrement,
    buyNowPrice,
    endsAt,
    views,
    seller,
    status,
    bids,
  } = item;

  const currentBid = parseFloat(highestBid) || parseFloat(startingBid);
  const currency = (amount) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(amount);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 px-4 py-10">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Product Images */}
          <div>
            <img
              src={images[0]}
              alt={title}
              className="w-full h-[400px] object-cover rounded-lg border"
            />
            <div className="flex gap-3 mt-4">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className="w-20 h-20 object-cover rounded border"
                  alt={`thumb-${i}`}
                />
              ))}
            </div>
          </div>

          {/* Details Panel */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">{title}</h1>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{bids.length} Bids</span>
                <span>{views} Views</span>
              </div>

              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400">Current Bid</p>
                    <p className="text-green-600 font-semibold text-xl">
                      {currency(currentBid)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Minimum Increment</p>
                    <p className="text-gray-700 font-medium">{currency(minBidIncrement)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Condition</p>
                    <p className="font-medium capitalize">{condition.toLowerCase()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Ends In</p>
                    <p className="font-medium text-red-600">{dayjs(endsAt).fromNow(true)}</p>
                  </div>
                  {buyNowPrice && (
                    <div className="col-span-2">
                      <p className="text-gray-400">Buy It Now</p>
                      <p className="text-black font-semibold text-lg">
                        {currency(buyNowPrice)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <label className="text-sm text-gray-500 font-medium mb-1 block">
                    Your Bid
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={yourBid}
                      onChange={(e) => setYourBid(e.target.value)}
                      placeholder={`Enter ${currency(currentBid + parseFloat(minBidIncrement))} or more`}
                      className="flex-1 p-3 border-2 border-blue-500 rounded-lg text-lg focus:outline-none"
                      min={currentBid + parseFloat(minBidIncrement)}
                    />
                    <button
                      onClick={handlePlaceBid}
                      disabled={placingBid}
                      className={`bg-blue-600 text-white px-6 rounded-lg transition text-lg font-semibold
    ${placingBid ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
                    >
                      {placingBid ? "Placing..." : "Place Bid"}
                    </button> 
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum bid: {currency(currentBid + parseFloat(minBidIncrement))}
                  </p>
                </div>
              </div>

              {/* Seller Info */}
              <div className="flex items-center gap-4 mt-8 pt-4 border-t">
                {seller.profileImage ? (
                  <img
                    src={seller.profileImage}
                    className="w-12 h-12 rounded-full border"
                    alt="Seller"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold text-white">
                    {seller.username[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-medium text-sm">{seller.username}</p>
                  {seller.isVerified && (
                    <p className="text-xs text-blue-600">Verified Seller</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Tab */}
        <div className="mt-10">
          <div className="border-b mb-4 pb-2 flex gap-6 text-gray-600 font-medium">
            <span className="text-black border-b-2 border-black pb-1">DESCRIPTION</span>
            <span>DETAIL</span>
            <span>SPECIFICATIONS</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}