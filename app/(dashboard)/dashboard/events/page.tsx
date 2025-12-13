"use client";

import { GlowCard } from "@/components/glow-card";
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
import { eventApi } from "@/lib/eventApi";
import type { Event } from "@/lib/types";
import {
  CheckCircle,
  Edit,
  Eye,
  MoreVertical,
  Plus,
  Search,
  Shield,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ManageEventsPage() {
  const { user: currentUser } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });

  useEffect(() => {
    fetchEvents();
    if (currentUser?.role === "ADMIN") {
      fetchStats();
    }
  }, [page, statusFilter, searchQuery, currentUser]);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await eventApi.getAllEvents({
        page,
        limit: 10,
        searchTerm: searchQuery,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
      if (response.success) {
        setEvents(response.data || []);
        setMeta(response.meta || { page: 1, limit: 10, total: 0 });
      }
    } catch (error) {
      toast.error("Failed to fetch events");
    }
    setIsLoading(false);
  };

  const fetchStats = async () => {
    try {
      const response = await eventApi.getEventStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch stats");
    }
  };

  const handleStatusUpdate = async (eventId: string, status: string) => {
    try {
      const formData = new FormData();
      formData.append("status", status);
      const response = await eventApi.updateEvent(eventId, formData);
      if (response.success) {
        toast.success(`Event ${status.toLowerCase()}`);
        fetchEvents();
        if (currentUser?.role === "ADMIN") fetchStats();
      } else {
        toast.error(response.message || "Failed to update event");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  if (currentUser?.role !== "ADMIN" && currentUser?.role !== "HOST") {
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

  const statusColors: Record<string, string> = {
    OPEN: "bg-green-500/10 text-green-500 border-green-500/20",
    FULL: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
    COMPLETED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    PENDING: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    ONGOING: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Manage <span className="gradient-text">Events</span>
          </h1>
          <p className="text-muted-foreground">
            Review and moderate all platform events
          </p>
        </div>
        <div className="flex items-center gap-2">
          <GlowCard className="px-3 py-2">
            <Link
              href="/dashboard/events/create"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Link>
          </GlowCard>
        </div>
      </div>

      {/* Stats */}
      {currentUser?.role === "ADMIN" && stats && (
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            {
              label: "Total Events",
              value: stats.totalEvents,
              color: "text-primary",
            },
            {
              label: "Open",
              value: stats.totalOpenEvents,
              color: "text-green-500",
            },
            {
              label: "Ongoing",
              value: stats.totalOngoingEvents,
              color: "text-blue-500",
            },
            {
              label: "Completed",
              value: stats.totalCompletedEvents,
              color: "text-blue-500",
            },
          ].map((stat) => (
            <GlowCard key={stat.label} className="p-4">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </GlowCard>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="ONGOING">Ongoing</SelectItem>
            <SelectItem value="FULL">Full</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Events Table */}
      <GlowCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Host</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : events.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No events found
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-14 rounded-md overflow-hidden bg-muted">
                          <Image
                            src={event.eventImage || "/placeholder.svg"}
                            alt={event.title}
                            width={56}
                            height={40}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div>
                          <p className="font-medium line-clamp-1">
                            {event.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {event.eventCategory}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {event.user.fullName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(event.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {event.currentParticipants}/{event.maxParticipants}
                    </TableCell>
                    <TableCell>
                      {event.joiningFee > 0 ? `$${event.joiningFee}` : "Free"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`border ${
                          statusColors[event.status] ||
                          "bg-gray-500/10 text-gray-500 border-gray-500/20"
                        }`}
                      >
                        {event.status}
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
                              href={`/events/${event.id}`}
                              className="flex items-center gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              View Event
                            </Link>
                          </DropdownMenuItem>
                          {(currentUser?.id === event.userId ||
                            currentUser?.role === "ADMIN") && (
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/dashboard/events/edit/${event.id}`}
                                className="flex items-center gap-2"
                              >
                                <Edit className="h-4 w-4" />
                                Edit Event
                              </Link>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {currentUser?.role === "ADMIN" && (
                            <>
                              {event.status === "PENDING" && (
                                <DropdownMenuItem
                                  className="flex items-center gap-2"
                                  onClick={() =>
                                    handleStatusUpdate(event.id, "ONGOING")
                                  }
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  Approve
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive flex items-center gap-2"
                                onClick={() =>
                                  handleStatusUpdate(event.id, "CANCELLED")
                                }
                              >
                                <XCircle className="h-4 w-4" />
                                Cancel Event
                              </DropdownMenuItem>
                            </>
                          )}
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
