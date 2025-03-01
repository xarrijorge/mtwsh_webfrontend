"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children, role }: { children: any; role: string }) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || (user && user.role !== role)) router.push("/login");
  }, [isAuthenticated, user, router]);

  return isAuthenticated && user?.role === role ? children : null;
}
