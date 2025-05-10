"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children, role }) {
  const { user, isAuthenticated, fetchUser } = useAuthStore();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!user && localStorage.getItem("token")) {
        await fetchUser();
      }
      setReady(true);
    };
    
    checkAuth();
  }, []);

  useEffect(() => {
    if (ready && (!isAuthenticated || (user && user.role !== role))) {
      router.push("/login");
    }
  }, [ready, isAuthenticated, user, role]);

  return ready && isAuthenticated && user?.role === role ? children : null;
}