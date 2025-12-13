"use client";

import { GlowCard } from "@/components/glow-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import type { User } from "@/lib/types";
import { userApi } from "@/lib/userApi";
import { Ban, Eye, MoreVertical, Search, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ManageUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<"ban" | "activate" | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });
  const [viewUser, setViewUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter, searchQuery]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await userApi.getAllUsers({
        page,
        limit: 10,
        searchTerm: searchQuery,
        role: roleFilter,
      });
      if (response.success) {
        setUsers(response.data || []);
        setMeta(response.meta || { page: 1, limit: 10, total: 0 });
      }
    } catch (error) {
      toast.error("Failed to fetch users");
    }
    setIsLoading(false);
  };

  const handleAction = async () => {
    if (!selectedUser) return;
    try {
      const status = actionType === "ban" ? "BLOCKED" : "ACTIVE";
      console.log("Sending status:", status, "for user:", selectedUser.id);
      const response = await userApi.updateUserStatus(selectedUser.id, status);
      console.log("Response:", response);
      if (response.success) {
        toast.success(response.message || "User status updated");
        fetchUsers();
      } else {
        toast.error(response.message || "Failed to update status");
        console.error("Error response:", response);
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error");
    }
    setSelectedUser(null);
    setActionType(null);
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
          Manage <span className="gradient-text">Users</span>
        </h1>
        <p className="text-muted-foreground">
          View and manage all platform users
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select
          value={roleFilter}
          onValueChange={(v) => {
            setRoleFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="USER">Users</SelectItem>
            <SelectItem value="HOST">Hosts</SelectItem>
            <SelectItem value="ADMIN">Admins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <GlowCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Events</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={
                              user.profilePhoto ||
                              user.avatar ||
                              "/placeholder.svg"
                            }
                          />
                          <AvatarFallback>
                            {user.fullName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.fullName}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "ADMIN"
                            ? "destructive"
                            : user.role === "HOST"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "ACTIVE" ? "default" : "destructive"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.role === "HOST"
                        ? `${user.hostedEvents || 0} hosted`
                        : `${user.pertcipatedEvents || 0} joined`}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
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
                            className="flex items-center gap-2"
                            onClick={() => setViewUser(user)}
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.role !== "ADMIN" && (
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive flex items-center gap-2"
                              onClick={() => {
                                setSelectedUser(user);
                                setActionType(
                                  user.status === "ACTIVE" ? "ban" : "activate"
                                );
                              }}
                            >
                              <Ban className="h-4 w-4" />
                              {user.status === "ACTIVE"
                                ? "Block User"
                                : "Activate User"}
                            </DropdownMenuItem>
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

      {/* User Details Dialog */}
      <Dialog open={!!viewUser} onOpenChange={() => setViewUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {viewUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={
                      viewUser.profilePhoto ||
                      viewUser.avatar ||
                      "/placeholder.svg"
                    }
                  />
                  <AvatarFallback>{viewUser.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{viewUser.fullName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {viewUser.email}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <Badge
                    variant={
                      viewUser.role === "ADMIN" ? "destructive" : "default"
                    }
                  >
                    {viewUser.role}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    variant={
                      viewUser.status === "ACTIVE" ? "default" : "destructive"
                    }
                  >
                    {viewUser.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{viewUser.phoneNumber || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium">{viewUser.gender || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{viewUser.address || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">
                    {viewUser.dateOfBirth
                      ? new Date(viewUser.dateOfBirth).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hosted Events</p>
                  <p className="font-medium">{viewUser.hostedEvents || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Participated Events
                  </p>
                  <p className="font-medium">
                    {viewUser.pertcipatedEvents || 0}
                  </p>
                </div>
              </div>
              {viewUser.bio && (
                <div>
                  <p className="text-sm text-muted-foreground">Bio</p>
                  <p className="text-sm">{viewUser.bio}</p>
                </div>
              )}
              {viewUser.interests && viewUser.interests.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Interests
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {viewUser.interests.map((interest) => (
                      <Badge key={interest} variant="outline">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Confirmation Dialog */}
      <Dialog open={!!actionType} onOpenChange={() => setActionType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "ban" && "Block User"}
              {actionType === "activate" && "Activate User"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "ban" &&
                `Are you sure you want to block ${selectedUser?.fullName}? They will no longer be able to access the platform.`}
              {actionType === "activate" &&
                `Are you sure you want to activate ${selectedUser?.fullName}? They will be able to access the platform again.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionType(null)}>
              Cancel
            </Button>
            <Button
              variant={actionType === "ban" ? "destructive" : "default"}
              onClick={handleAction}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
