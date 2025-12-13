"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Search } from "lucide-react";

export function DashboardHeader() {
  const notifications = [
    {
      id: 1,
      title: "New participant joined",
      message: "Sarah joined your Sunset Hiking event",
      time: "2m ago",
    },
    {
      id: 2,
      title: "Event reminder",
      message: "Board Game Night starts in 2 hours",
      time: "1h ago",
    },
    {
      id: 3,
      title: "New review",
      message: "John left a 5-star review",
      time: "3h ago",
    },
  ];

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-6">
      <SidebarTrigger className="-ml-2" />
      <Separator orientation="vertical" className="h-6" />

      <div className="flex flex-1 items-center gap-4">
        <div className="relative hidden md:block w-64 lg:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search events, users..." className="pl-10" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-[10px]">
                {notifications.length}
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start gap-1 p-3"
              >
                <span className="font-medium">{notification.title}</span>
                <span className="text-sm text-muted-foreground">
                  {notification.message}
                </span>
                <span className="text-xs text-muted-foreground">
                  {notification.time}
                </span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center justify-center text-primary">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
