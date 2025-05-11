"use client";

import { useState } from "react";
import { Fetch } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import uploadFile from "@/lib/uploadToSupabase";



export default function CreateAuctionForm({ onSuccess }) {
    const { user, token } = useAuthStore();

    const [form, setForm] = useState({
        title: "",
        description: "",
        startingBid: "",
        reservePrice: "",
        buyNowPrice: "",
        minBidIncrement: "1",
        condition: "NEW",
        endsAt: "",
        currency: "KES"
    });

    const [files, setFiles] = useState([]);
    const [uploadedUrls, setUploadedUrls] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleFileChange = (e) => {
        const selected = Array.from(e.target.files);
        setFiles(selected);
        setError(null);
        setUploadedUrls([]); // optional: clear old state

        // (optional) preview logic:
        const previewUrls = selected.map((file) => URL.createObjectURL(file));
        setUploadedUrls(previewUrls); // for preview only — replaced by real URLs on submit
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validate files (comment or uncomment as needed)
        // if (files.length < 3) {
        //     setError("Please select at least 3 images.");
        //     return;
        // }

        setLoading(true);
        let imageUrls = [];

        try {
            // Upload each file with the user's auth token
            for (const file of files) {
                const uploadResult = await uploadFile(file);

                // Store the public URL instead of just the key
                imageUrls.push(uploadResult.publicUrl);
           }

           console.log("Uploaded image URLs:", imageUrls);
            // Format the endsAt date properly with seconds and timezone (ISO-8601 compliant)
            const endsAtDate = form.endsAt ? new Date(form.endsAt) : null;
            const formattedEndsAt = endsAtDate ? endsAtDate.toISOString() : null;

            // Send the auction data to your API
            await Fetch("/auctions", {
                method: "POST",
                body: JSON.stringify({
                    ...form,
                    startingBid: parseFloat(form.startingBid),
                    reservePrice: form.reservePrice ? parseFloat(form.reservePrice) : null,
                    buyNowPrice: form.buyNowPrice ? parseFloat(form.buyNowPrice) : null,
                    minBidIncrement: parseFloat(form.minBidIncrement),
                    images: imageUrls,
                    sellerId: user.id,
                    currency: form.currency,
                    status: "OPEN",
                    endsAt: formattedEndsAt,
                }),
            });

            if (onSuccess) onSuccess();
        } catch (err) {
            console.error("Error creating auction:", err);
            setError(err.message || "Failed to submit auction");
        } finally {
            setLoading(false);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold mb-2">Create Auction</h2>

            <label className="block text-sm font-medium text-gray-600">Title</label>
            <input
                name="title"
                value={form.title}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
                placeholder='What are you selling?'
            />

            <label className="block text-sm font-medium text-gray-600">Description</label>
            <textarea
                name="description"
                value={form.description}
                minLength={150}
                rows={6}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
                placeholder='Describe your item. 
                Technical specs (if applicable). 
                How long was it used for (if not new)? 
                Does it come in original packaging?
                Is it in working condition?
                Are there any accessories included?
                Are there any defects?
                Are there any missing parts?
                Are there any scratches?
                Are there nicks, dents, cracks, or scratches?'
            />
            <label className="block text-sm font-medium text-gray-600">Upload Images (min 3)</label>
            <div className="border border-dashed border-gray-400 rounded-md p-4 bg-gray-50 text-center cursor-pointer hover:bg-gray-100 transition">
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="w-full text-sm text-gray-700 bg-transparent outline-none"
                />
                <p className="text-sm text-gray-500 mt-2">Click or drag files here to upload</p>
            </div>

            <div className="flex gap-2 mt-2 flex-wrap">
                {uploadedUrls.map((url, i) => (
                    <img
                        key={i}
                        src={url}
                        alt={`Preview ${i}`}
                        className="w-20 h-20 object-cover rounded border"
                    />
                ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600">Starting Bid</label>
                    <input
                        name="startingBid"
                        type="number"
                        value={form.startingBid}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600">Reserve Price (optional)</label>
                    <input
                        name="reservePrice"
                        type="number"
                        value={form.reservePrice}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600">Buy Now Price (optional)</label>
                    <input
                        name="buyNowPrice"
                        type="number"
                        value={form.buyNowPrice}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600">Min Bid Increment</label>
                    <input
                        name="minBidIncrement"
                        type="number"
                        value={form.minBidIncrement}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">Currency</label>
                    <select
                        name="currency"
                        value={form.currency}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="KES">Kenyan Shilling (KES)</option>
                        <option value="USD">US Dollar (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                        <option value="GBP">British Pound (GBP)</option>
                    </select>

                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600">Condition</label>
                    <select
                        name="condition"
                        value={form.condition}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="NEW">New</option>
                        <option value="USED_GOOD">Used - Good</option>
                        <option value="USED_FAIR">Used - Fair</option>
                        <option value="FOR_PARTS">For Parts</option>
                    </select>
                </div>

                <div>
    <label className="block text-sm font-medium text-gray-600">Ends At</label>
    <input
        name="endsAt"
        type="datetime-local"
        value={form.endsAt}
        onChange={handleInputChange}
        min={new Date().toISOString().slice(0, 16)} // Only allow future dates
        className="w-full p-2 border rounded"
        required
        step="60" // Force seconds input
    />
    <p className="text-xs text-gray-500 mt-1">
        Set when the auction will end (date and time)
    </p>
</div> 
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex justify-end gap-3 pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
                >
                    {loading ? "Creating..." : "Create"}
                </button>
            </div>
        </form>
    );
}