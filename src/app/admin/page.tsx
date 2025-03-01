import ProtectedRoute from "@/lib/protectedRoute";

export default function AdminPage() {
  return (
    <ProtectedRoute role="admin">
      <h1>Admin Dashboard</h1>
    </ProtectedRoute>
  );
}