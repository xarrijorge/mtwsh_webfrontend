"use client";

import { useState } from "react";
import { registerUser } from "@/lib/api";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "buyer" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await registerUser(formData);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-xl font-bold mb-4">Register</h2>
        <input type="text" placeholder="Name" onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mb-2 p-2 border w-full" />
        <input type="email" placeholder="Email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="mb-2 p-2 border w-full" />
        <input type="password" placeholder="Password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="mb-2 p-2 border w-full" />
        <select onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="mb-4 p-2 border w-full">
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="bg-green-500 text-white px-4 py-2">Register</button>
      </form>
    </div>
  );
}
