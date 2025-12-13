"use client";

import { GlowCard } from "@/components/glow-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/lib/auth-context";
import { reportsApi } from "@/lib/reportsApi";
import type { User } from "@/lib/types";
import { userApi } from "@/lib/userApi";
import {
  Calendar,
  CheckCircle,
  DollarSign,
  Eye,
  MoreVertical,
  Search,
  Shield,
  Star,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ManageHostsPage() {
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [hosts, setHosts] = useState<User[]>([]);
  const [hostStats, setHostStats] = useState({
    totalHost: 0,
    totalRequestHosts: 0,
    averageHostRating: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10 });

  useEffect(() => {
    fetchHostData();
  }, [page, searchQuery]);

  const fetchHostData = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      if (searchQuery) {
        params.append("searchTerm", searchQuery);
      }

      const [statsResponse, hostsResponse] = await Promise.all([
        reportsApi.getHostStatsPublic(),
        userApi.getHosts(params),
      ]);

      if (statsResponse.success) {
        setHostStats(statsResponse.data);
      }

      if (hostsResponse.success) {
        setHosts(hostsResponse.data || []);
        setMeta(hostsResponse.meta || { total: 0, page: 1, limit: 10 });
      }
    } catch (error) {
      toast.error("Failed to fetch host data");
    } finally {
      setIsLoading(false);
    }
  };

  if (currentUser?.role !== "ADMIN") {
    return (
      <GlowCard className="text-center py-12">
        <Shield className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
        <h3 className="font-semibold">Access Denied</h3>
        <p className="text-sm text-muted-foreground mt-1">
          You don't have permission to view this page
        </p>
      </GlowCard>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Manage <span className="gradient-text">Hosts</span>
        </h1>
        <p className="text-muted-foreground">View and manage event hosts</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <GlowCard className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{hostStats.totalHost}</p>
              <p className="text-sm text-muted-foreground">Total Hosts</p>
            </div>
          </div>
        </GlowCard>
        <GlowCard className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {hostStats.totalRequestHosts}
              </p>
              <p className="text-sm text-muted-foreground">Pending Requests</p>
            </div>
          </div>
        </GlowCard>
        <GlowCard className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Star className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {hostStats.averageHostRating.toFixed(1)}
              </p>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
            </div>
          </div>
        </GlowCard>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search hosts..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Hosts Table */}
      <GlowCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Host</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Events</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading hosts...
                  </TableCell>
                </TableRow>
              ) : hosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No hosts found
                  </TableCell>
                </TableRow>
              ) : (
                hosts.map((host) => (
                  <TableRow key={host.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={host.profilePhoto || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {host.fullName?.charAt(0) || "H"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{host.fullName}</p>
                          <p className="text-sm text-muted-foreground">
                            {host.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="font-medium">
                          {host.averageRating || 0}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          ({host.reviewCount || 0})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{host.hostedEvents || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>{host.pertcipatedEvents || 0}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">$0</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          host.status === "ACTIVE" ? "default" : "secondary"
                        }
                        className="gap-1"
                      >
                        <CheckCircle className="h-3 w-3" />
                        {host.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/profile/${host.id}`}
                              className="flex items-center gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              View Profile
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            View Events
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive flex items-center gap-2"
                            onClick={() => toast.success("Host status updated")}
                          >
                            <XCircle className="h-4 w-4" />
                            Update Status
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </GlowCard>

      {/* Pagination */}
      {meta.total > meta.limit && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={
                  page === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
            {Array.from(
              { length: Math.ceil(meta.total / meta.limit) },
              (_, i) => i + 1
            ).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  onClick={() => setPage(p)}
                  isActive={page === p}
                  className="cursor-pointer"
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setPage((p) =>
                    Math.min(Math.ceil(meta.total / meta.limit), p + 1)
                  )
                }
                className={
                  page === Math.ceil(meta.total / meta.limit)
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
