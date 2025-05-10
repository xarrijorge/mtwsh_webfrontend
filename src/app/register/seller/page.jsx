"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export default function SellerRegisterPage() {
    const router = useRouter();
    const { register, loading, error, clearError } = useAuthStore();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        role: "seller",
        phoneNumber: "",
        sellerType: "Individual",
        storeName: "",
        businessLicenseNumber: "",
        website: "",
        profileImage: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        clearError();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        for (let key in form) {
            if (form[key]) formData.append(key, form[key]);
        }

        try {
            await register(formData);
            router.push("/seller");
        } catch (err) { }
    };


    const isBusiness = form.sellerType === "Business";

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 shadow-md rounded-lg w-full max-w-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Register as a Seller</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="username" type="text" placeholder="Your Name" value={form.username} onChange={handleChange} className="p-2 border rounded" required />
                    <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="p-2 border rounded" required />

                    <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="p-2 border rounded" required />
                    <input name="phoneNumber" type="tel" placeholder="Phone Number" value={form.phoneNumber} onChange={handleChange} className="p-2 border rounded" required />

                    <select name="sellerType" value={form.sellerType} onChange={handleChange} className="p-2 border rounded">
                        <option value="Individual">Individual</option>
                        <option value="Business">Business</option>
                    </select>

                    {isBusiness && (
                        <>
                            <input name="storeName" type="text" placeholder="Store Name" value={form.storeName} onChange={handleChange} className="p-2 border rounded md:col-span-1" />
                            <input name="businessLicenseNumber" type="text" placeholder="Business License No. (optional)" value={form.businessLicenseNumber} onChange={handleChange} className="p-2 border rounded md:col-span-1" />
                            <input name="website" type="url" placeholder="Website (optional)" value={form.website} onChange={handleChange} className="p-2 border rounded md:col-span-2" />
                        </>
                    )}
                </div>
                <input
                    name="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="p-2 border rounded w-full mt-4"
                />


                {error && <p className="text-red-600 text-sm mt-3">{error}</p>}

                <button type="submit" className="w-full mt-6 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition" disabled={loading}>
                    {loading ? "Registering..." : "Register as Seller"}
                </button>
            </form>
        </div>
    );
}