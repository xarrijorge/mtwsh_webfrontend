import ProtectedRoute from "@/lib/protectedRoute";

export default function SellerPage() {
  return (
    <ProtectedRoute role="seller">
      <h1>Seller Dashboard</h1>
      <p>Manage your auction listings and track bids here.</p>
    </ProtectedRoute>
  );
}
