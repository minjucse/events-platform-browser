"use client";

import { GlowCard } from "@/components/glow-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
import { mockEvents } from "@/lib/mock-data";
import {
  Calendar,
  Eye,
  Mail,
  MoreVertical,
  Search,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function ParticipantsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [eventFilter, setEventFilter] = useState<string>("all");

  if (user?.role !== "HOST" && user?.role !== "ADMIN") {
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

  const hostedEvents = mockEvents.filter((e) => e.hostId === user?.id);

  const allParticipants = hostedEvents.flatMap((event) =>
    event.participants.map((participant) => ({
      ...participant,
      eventId: event.id,
      eventName: event.name,
      eventDate: event.date,
    }))
  );

  const filteredParticipants = allParticipants.filter((participant) => {
    const matchesSearch =
      participant.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEvent =
      eventFilter === "all" || participant.eventId === eventFilter;
    return matchesSearch && matchesEvent;
  });

  const totalParticipants = hostedEvents.reduce(
    (acc, e) => acc + e.currentParticipants,
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Event <span className="gradient-text">Participants</span>
        </h1>
        <p className="text-muted-foreground">
          Manage participants across all your events
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <GlowCard className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalParticipants}</p>
              <p className="text-sm text-muted-foreground">
                Total Participants
              </p>
            </div>
          </div>
        </GlowCard>
        <GlowCard className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <Calendar className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{hostedEvents.length}</p>
              <p className="text-sm text-muted-foreground">Active Events</p>
            </div>
          </div>
        </GlowCard>
        <GlowCard className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Users className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {hostedEvents.length > 0
                  ? Math.round(totalParticipants / hostedEvents.length)
                  : 0}
              </p>
              <p className="text-sm text-muted-foreground">Avg per Event</p>
            </div>
          </div>
        </GlowCard>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search participants..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={eventFilter} onValueChange={setEventFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by event" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            {hostedEvents.map((event) => (
              <SelectItem key={event.id} value={event.id}>
                {event.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Participants Table */}
      <GlowCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Participant</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParticipants.length > 0 ? (
                filteredParticipants.map((participant, idx) => (
                  <TableRow key={`${participant.id}-${idx}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={participant.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {participant.fullName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{participant.fullName}</p>
                          <p className="text-sm text-muted-foreground">
                            {participant.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{participant.eventName}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(participant.eventDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {participant.location || "-"}
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
                              href={`/profile/${participant.id}`}
                              className="flex items-center gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              View Profile
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2"
                            onClick={() => toast.success("Email sent")}
                          >
                            <Mail className="h-4 w-4" />
                            Send Message
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No participants found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </GlowCard>
    </div>
  );
}
