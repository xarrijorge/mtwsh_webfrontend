"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";

export default function RoleSelectPage() {
  const [selected, setSelected] = useState<"buyer" | "seller">("buyer");
  const router = useRouter();

  const handleNext = () => {
    router.push(`/register/${selected}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">I am a...</h1>

      <div className="flex gap-6 mb-6 w-full max-w-md">
        <button
          onClick={() => setSelected("buyer")}
          className={clsx(
            "flex-1 p-6 rounded-lg border-2 text-center font-semibold transition-all",
            selected === "buyer"
              ? "border-blue-600 bg-blue-50 text-blue-700"
              : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
          )}
        >
          Buyer
        </button>

        <button
          onClick={() => setSelected("seller")}
          className={clsx(
            "flex-1 p-6 rounded-lg border-2 text-center font-semibold transition-all",
            selected === "seller"
              ? "border-green-600 bg-green-50 text-green-700"
              : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
          )}
        >
          Seller
        </button>
      </div>

      <button
        onClick={handleNext}
        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
      >
        Continue
      </button>
    </div>
  );
}