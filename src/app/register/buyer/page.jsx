"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export default function BuyerRegisterPage() {
    const router = useRouter();
    const { register, loading, error, clearError } = useAuthStore();
    const [uploading, setUploading] = useState(false);

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        role: "BUYER",
        profileImageUrl: "", // Will store Cloudinary URL
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        clearError();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            // Upload to Cloudinary
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "your_upload_preset"); // Replace with your Cloudinary upload preset

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`, // Replace with your cloud name
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();
            
            // Store the image URL from Cloudinary
            setForm({ ...form, profileImageUrl: data.secure_url });
        } catch (err) {
            console.error("Error uploading image:", err);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create a regular object for user data
        const userData = {
            username: form.username,
            email: form.email,
            password: form.password,
            role: form.role,
            profileImageUrl: form.profileImageUrl, // Include the Cloudinary URL
        };

        try {
            await register(userData);
            router.push("/buyer");
        } catch (err) {
            console.error("Registration error:", err);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 shadow-md rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Register as a Buyer</h2>

                <input name="username" type="text" placeholder="Name" value={form.username} onChange={handleChange} className="mb-4 p-2 w-full border rounded" required />
                <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="mb-4 p-2 w-full border rounded" required />
                <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="mb-4 p-2 w-full border rounded" required />
                
                <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-1">Profile Image</label>
                    <input
                        name="profileImage"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="p-2 border rounded w-full"
                    />
                    {uploading && <p className="text-sm text-blue-600 mt-1">Uploading image...</p>}
                    {form.profileImageUrl && (
                        <div className="mt-2">
                            <img src={form.profileImageUrl} alt="Profile preview" className="h-16 w-16 object-cover rounded-full" />
                        </div>
                    )}
                </div>

                {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

                <button 
                    type="submit" 
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition" 
                    disabled={loading || uploading}
                >
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
}