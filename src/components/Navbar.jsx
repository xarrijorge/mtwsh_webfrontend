"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = "/"; // redirect to home after logout
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-800">
          MTWSH
        </Link>

        <div className="flex items-center space-x-6">
          <Link href="/" className="text-gray-700 hover:text-black">
            Live Auctions
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                href={`/${user.role.toLowerCase()}`}
                className="text-gray-700 hover:text-black"
              >
                My Account
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="text-gray-700 hover:text-black">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}