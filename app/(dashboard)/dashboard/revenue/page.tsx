"use client";

import { useState, useEffect } from "react";
import { GlowCard } from "@/components/glow-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/lib/auth-context";
import { paymentApi } from "@/lib/paymentApi";
import { reportsApi } from "@/lib/reportsApi";
import type { Payment } from "@/lib/types";
import { DollarSign, TrendingUp, Users, CreditCard, Search, Filter } from "lucide-react";
import { toast } from "sonner";

interface PaymentStats {
  totalRevenue: number;
  totalTransactions: number;
  completedPayments: number;
  pendingPayments: number;
}

export default function RevenuePage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchPayments();
      fetchStats();
    }
  }, [user, currentPage, statusFilter]);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      });
      
      if (statusFilter !== "ALL") {
        params.append("paymentStatus", statusFilter);
      }

      const response = await paymentApi.getAllPayments(params);
      if (response.success) {
        setPayments(response.data || []);
      } else {
        toast.error("Failed to load payments");
      }
    } catch (error) {
      toast.error("Network error loading payments");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await reportsApi.getPaymentStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Failed to load payment stats:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      COMPLETED: "default",
      PENDING: "secondary",
      FAILED: "destructive",
      REFUNDED: "outline",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status}
      </Badge>
    );
  };

  const filteredPayments = payments.filter(payment =>
    payment.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (user?.role !== "ADMIN") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground mt-2">
          Only administrators can access revenue data.
        </p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Revenue <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Monitor payments and transaction analytics
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <GlowCard>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">${stats.totalRevenue?.toFixed(2) || "0.00"}</p>
                </div>
              </div>
            </GlowCard>

            <GlowCard>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-blue-500/10 p-3">
                  <CreditCard className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Transactions</p>
                  <p className="text-2xl font-bold">{stats.totalTransactions || 0}</p>
                </div>
              </div>
            </GlowCard>

            <GlowCard>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-green-500/10 p-3">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{stats.completedPayments || 0}</p>
                </div>
              </div>
            </GlowCard>

            <GlowCard>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-yellow-500/10 p-3">
                  <Users className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{stats.pendingPayments || 0}</p>
                </div>
              </div>
            </GlowCard>
          </div>
        )}

        {/* Filters */}
        <GlowCard className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by user, event, or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="REFUNDED">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </GlowCard>

        {/* Payments Table */}
        <GlowCard>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading payments...
                    </TableCell>
                  </TableRow>
                ) : filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No payments found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-sm">
                        {payment.transactionId || payment.id.slice(0, 8)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{payment.user.fullName}</p>
                          <p className="text-sm text-muted-foreground">{payment.user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{payment.event.title}</p>
                          <p className="text-sm text-muted-foreground">Fee: ${payment.event.joiningFee}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${payment.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(payment.paymentStatus)}
                      </TableCell>
                      <TableCell>
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </GlowCard>
      </div>
    </div>
  );
}