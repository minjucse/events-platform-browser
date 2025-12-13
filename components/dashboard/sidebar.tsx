"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth-context";
import {
  Calendar,
  CalendarCheck,
  CalendarClock,
  ChevronUp,
  CreditCard,
  Heart,
  Home,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
  Shield,
  Sparkles,
  Star,
  UserCheck2,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const userNavItems = [
    { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { title: "My Events", href: "/dashboard/my-events", icon: CalendarCheck },
    { title: "Upcoming", href: "/dashboard/upcoming", icon: CalendarClock },
    { title: "Saved Events", href: "/dashboard/saved", icon: Heart },
    { title: "My Reviews", href: "/dashboard/reviews", icon: Star },
  ];

  const hostNavItems = [
    { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { title: "Create Event", href: "/dashboard/events/create", icon: Plus },
    { title: "My Events", href: "/dashboard/my-events", icon: Calendar },
    { title: "Saved Events", href: "/dashboard/saved", icon: Heart },
    // { title: "Participants", href: "/dashboard/participants", icon: Users },
    // { title: "Revenue", href: "/dashboard/revenue", icon: CreditCard },
    { title: "Reviews", href: "/dashboard/reviews", icon: Star },
  ];

  const adminNavItems = [
    { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { title: "Manage Users", href: "/dashboard/users", icon: UserCog },
    { title: "Manage Hosts", href: "/dashboard/hosts", icon: Shield },
    {
      title: "Become Hosts Requests",
      href: "/dashboard/become-hosts",
      icon: UserCheck2,
    },
    { title: "Manage Events", href: "/dashboard/events", icon: Calendar },
    { title: "Reviews", href: "/dashboard/reviews", icon: Star },
    { title: "Revenue", href: "/dashboard/revenue", icon: CreditCard },
  ];

  const navItems =
    user?.role === "ADMIN"
      ? adminNavItems
      : user?.role === "HOST"
      ? hostNavItems
      : userNavItems;

  return (
    <Sidebar className="border-r border-sidebar-border " collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-sidebar-foreground">
            EventHub
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">
            {user?.role === "ADMIN"
              ? "Admin Panel"
              : user?.role === "HOST"
              ? "Host Dashboard"
              : "My Dashboard"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">
            Quick Links
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="text-sidebar-foreground hover:bg-sidebar-accent"
                >
                  <Link href="/events">
                    <Home className="h-4 w-4" />
                    <span>Browse Events</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="text-sidebar-foreground hover:bg-sidebar-accent"
                >
                  <Link href={`/dashboard/profile`}>
                    <Settings className="h-4 w-4" />
                    <span>My Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full text-sidebar-foreground hover:bg-sidebar-accent">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={user?.profilePhoto || "/placeholder.svg"}
                    />
                    <AvatarFallback>{user?.fullName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left flex-1 min-w-0">
                    <span className="text-sm font-medium truncate w-full">
                      {user?.fullName}
                    </span>
                    <span className="text-xs text-sidebar-foreground/60 capitalize">
                      {user?.role}
                    </span>
                  </div>
                  <ChevronUp className="h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href={`/profile/${user?.id}`}>
                    <Settings className="mr-2 h-4 w-4" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
