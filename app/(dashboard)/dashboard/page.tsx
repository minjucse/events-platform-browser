"use client";

import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { HostDashboard } from "@/components/dashboard/host-dashboard";
import { UserDashboard } from "@/components/dashboard/user-dashboard";
import { useAuth } from "@/lib/auth-context";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role === "ADMIN") {
    return <AdminDashboard />;
  }

  if (user.role === "HOST") {
    return <HostDashboard />;
  }

  return <UserDashboard />;
}
