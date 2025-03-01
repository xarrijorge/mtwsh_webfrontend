import ProtectedRoute from "@/lib/protectedRoute";

export default function BuyerPage() {
  return (
    <ProtectedRoute role="buyer">
      <h1>Buyer Dashboard</h1>
      <p>Welcome to your dashboard! Browse and bid on items here.</p>
    </ProtectedRoute>
  );
}
