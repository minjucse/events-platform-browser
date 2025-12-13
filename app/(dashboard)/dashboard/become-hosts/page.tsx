"use client";

import { GlowCard } from "@/components/glow-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { becomeHostApi } from "@/lib/becomeHostApi";
import {
  CheckCircle,
  Eye,
  MoreVertical,
  Search,
  Shield,
  Trash2,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface BecomeHostRequest {
  id: string;
  userId: string;
  hostExperience: string;
  typeOfEvents: string;
  whyHost: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
    profilePhoto: string | null;
  };
}

export default function BecomeHostsPage() {
  const { user: currentUser } = useAuth();
  const [requests, setRequests] = useState<BecomeHostRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10 });
  const [selectedRequest, setSelectedRequest] =
    useState<BecomeHostRequest | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, [page, searchQuery]);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      if (searchQuery) {
        params.append("searchTerm", searchQuery);
      }

      const response = await becomeHostApi.getAllBecomeHostRequests(params);
      if (response.success) {
        setRequests(response.data || []);
        setMeta(response.meta || { total: 0, page: 1, limit: 10 });
      }
    } catch (error) {
      toast.error("Failed to fetch host requests");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    try {
      const response = await becomeHostApi.updateBecomeHostRequest(requestId, {
        approveHost: true,
      });
      if (response.success) {
        toast.success("Host request approved successfully");
        fetchRequests();
      } else {
        toast.error(response.message || "Failed to approve request");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      const response = await becomeHostApi.updateBecomeHostRequest(requestId, {
        status: "REJECTED",
      });
      if (response.success) {
        toast.success("Host request rejected");
        fetchRequests();
      } else {
        toast.error(response.message || "Failed to reject request");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
  };

  const handleDelete = async (requestId: string) => {
    try {
      const response = await becomeHostApi.deleteBecomeHostRequest(requestId);
      if (response.success) {
        toast.success("Host request deleted");
        fetchRequests();
      } else {
        toast.error(response.message || "Failed to delete request");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
  };

  const handleViewDetails = (request: BecomeHostRequest) => {
    setSelectedRequest(request);
    setIsDetailDialogOpen(true);
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
          Become <span className="gradient-text">Host Requests</span>
        </h1>
        <p className="text-muted-foreground">
          Review and manage host applications
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <GlowCard className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{meta.total}</p>
              <p className="text-sm text-muted-foreground">Total Requests</p>
            </div>
          </div>
        </GlowCard>
        <GlowCard className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Approved</p>
            </div>
          </div>
        </GlowCard>
        <GlowCard className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
              <XCircle className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{requests.length}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
        </GlowCard>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search requests..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Requests Table */}
      <GlowCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Event Types</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading requests...
                  </TableCell>
                </TableRow>
              ) : requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No host requests found
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={
                              request.user.profilePhoto || "/placeholder.svg"
                            }
                          />
                          <AvatarFallback>
                            {request.user.fullName?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{request.user.fullName}</p>
                          <p className="text-sm text-muted-foreground">
                            {request.user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm line-clamp-2 max-w-xs">
                        {request.hostExperience}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm line-clamp-2 max-w-xs">
                        {request.typeOfEvents}
                      </p>
                    </TableCell>
                    <TableCell>
                      {new Date(request.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(request)}
                            className="flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleApprove(request.id)}
                            className="flex items-center gap-2 text-green-600"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleReject(request.id)}
                            className="flex items-center gap-2 text-yellow-600"
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(request.id)}
                            className="text-destructive focus:text-destructive flex items-center gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
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

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Host Application Details</DialogTitle>
            <DialogDescription>
              Review the complete host application
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={
                      selectedRequest.user.profilePhoto || "/placeholder.svg"
                    }
                  />
                  <AvatarFallback>
                    {selectedRequest.user.fullName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedRequest.user.fullName}
                  </h3>
                  <p className="text-muted-foreground">
                    {selectedRequest.user.email}
                  </p>
                  <Badge variant="secondary">{selectedRequest.user.role}</Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Host Experience</h4>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                    {selectedRequest.hostExperience}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Types of Events</h4>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                    {selectedRequest.typeOfEvents}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Why Host?</h4>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                    {selectedRequest.whyHost}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Application Date</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedRequest.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => {
                    handleApprove(selectedRequest.id);
                    setIsDetailDialogOpen(false);
                  }}
                  className="flex-1"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleReject(selectedRequest.id);
                    setIsDetailDialogOpen(false);
                  }}
                  className="flex-1"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
