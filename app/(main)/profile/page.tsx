"use client";

import { GlowCard } from "@/components/glow-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth-context";
import { ArrowLeft, Edit, MapPin, Star, User as UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("about");

  if (!currentUser) {
    router.push("/login");
    return null;
  }

  return (
    <div className="py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        {/* Profile Header */}
        <GlowCard className="relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-r from-primary/20 via-accent/20 to-primary/20" />

          <div className="relative pt-16 pb-6 px-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
              <div className="relative -mt-24 sm:-mt-20">
                <div className="h-32 w-32 sm:h-36 sm:w-36 rounded-2xl border-4 border-background overflow-hidden bg-muted">
                  {currentUser.profilePhoto || currentUser.avatar ? (
                    <Image
                      src={
                        currentUser.profilePhoto ||
                        currentUser.avatar ||
                        "/placeholder.svg"
                      }
                      alt={currentUser.fullName}
                      width={144}
                      height={144}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <UserIcon className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
                {currentUser.role === "HOST" && (
                  <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary">
                    Verified Host
                  </Badge>
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <h1 className="text-2xl sm:text-3xl font-bold">
                    {currentUser.fullName}
                  </h1>
                  {currentUser.rating && currentUser.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-primary text-primary" />
                      <span className="font-semibold">
                        {currentUser.rating}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ({currentUser.reviewCount} reviews)
                      </span>
                    </div>
                  )}
                </div>

                {(currentUser.address || currentUser.location) && (
                  <div className="flex items-center gap-1 text-muted-foreground mt-2">
                    <MapPin className="h-4 w-4" />
                    {currentUser.address || currentUser.location}
                  </div>
                )}

                {currentUser.bio && (
                  <p className="mt-3 text-muted-foreground max-w-2xl">
                    {currentUser.bio}
                  </p>
                )}

                {currentUser.interests && currentUser.interests.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {currentUser.interests.map((interest) => (
                      <Badge key={interest} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <Link
                  href="/dashboard/profile/edit"
                  className="flex-1 sm:flex-none"
                >
                  <Button
                    variant="outline"
                    className="w-full gap-2 bg-transparent"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold gradient-text">
                  {currentUser.hostedEvents || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Events Hosted
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold gradient-text">
                  {currentUser.pertcipatedEvents || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Events Joined
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold gradient-text">
                  {new Date(currentUser.createdAt).getFullYear()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Member Since
                </div>
              </div>
            </div>
          </div>
        </GlowCard>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="mt-6">
            <GlowCard>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">About</h3>
                  <p className="text-muted-foreground">
                    {currentUser.bio || "No bio provided yet."}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Interests</h3>
                  {currentUser.interests && currentUser.interests.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {currentUser.interests.map((interest) => (
                        <Badge key={interest} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No interests specified yet.
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Member Info</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      Member since{" "}
                      {new Date(currentUser.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                    <p className="capitalize">Role: {currentUser.role}</p>
                    {(currentUser.address || currentUser.location) && (
                      <p>
                        Location: {currentUser.address || currentUser.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </GlowCard>
          </TabsContent>

          <TabsContent value="details" className="mt-6">
            <GlowCard>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Email</h3>
                    <p className="text-muted-foreground">{currentUser.email}</p>
                  </div>
                  {currentUser.phoneNumber && (
                    <div>
                      <h3 className="font-semibold mb-2">Phone</h3>
                      <p className="text-muted-foreground">
                        {currentUser.phoneNumber}
                      </p>
                    </div>
                  )}
                  {currentUser.gender && (
                    <div>
                      <h3 className="font-semibold mb-2">Gender</h3>
                      <p className="text-muted-foreground capitalize">
                        {currentUser.gender.toLowerCase()}
                      </p>
                    </div>
                  )}
                  {currentUser.dateOfBirth && (
                    <div>
                      <h3 className="font-semibold mb-2">Date of Birth</h3>
                      <p className="text-muted-foreground">
                        {new Date(currentUser.dateOfBirth).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold mb-2">Account Status</h3>
                    <Badge
                      variant={
                        currentUser.status === "ACTIVE"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {currentUser.status}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Email Verified</h3>
                    <Badge
                      variant={
                        currentUser.isEmailVerified ? "default" : "secondary"
                      }
                    >
                      {currentUser.isEmailVerified
                        ? "Verified"
                        : "Not Verified"}
                    </Badge>
                  </div>
                </div>
              </div>
            </GlowCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
