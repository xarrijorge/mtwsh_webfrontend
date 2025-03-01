"use client";

import { useState } from "react";
import { registerUser } from "@/lib/api";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "buyer" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await registerUser(form);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">Register</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-2 border rounded mb-3 focus:ring focus:ring-blue-300 text-gray-900" />
          <input type="email" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full p-2 border rounded mb-3 focus:ring focus:ring-blue-300 text-gray-900" />
          <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full p-2 border rounded mb-3 focus:ring focus:ring-blue-300 text-gray-900" />
          <select onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full p-2 border rounded mb-4 bg-white text-gray-900">
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}