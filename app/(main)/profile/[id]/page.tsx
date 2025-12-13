"use client";

import { GlowCard } from "@/components/glow-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { userApi } from "@/lib/userApi";
import type { User } from "@/lib/types";
import { ArrowLeft, MapPin, Star, User as UserIcon } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function PublicProfilePage() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    if (params.id) {
      fetchUserProfile();
    }
  }, [params.id]);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await userApi.getPublicProfile(params.id as string);
      if (response.success) {
        setUser(response.data);
      } else {
        toast.error("User not found");
        router.push("/");
      }
    } catch (error) {
      toast.error("Failed to load profile");
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Profile not found</h1>
        <Button className="mt-4" onClick={() => router.push("/")}>
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {/* Profile Header */}
        <GlowCard className="relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-r from-primary/20 via-accent/20 to-primary/20" />

          <div className="relative pt-16 pb-6 px-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
              <div className="relative -mt-24 sm:-mt-20">
                <div className="h-32 w-32 sm:h-36 sm:w-36 rounded-2xl border-4 border-background overflow-hidden bg-muted">
                  {user.profilePhoto ? (
                    <Image
                      src={user.profilePhoto}
                      alt={user.fullName}
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
                {user.role === "HOST" && (
                  <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary">
                    Verified Host
                  </Badge>
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <h1 className="text-2xl sm:text-3xl font-bold">
                    {user.fullName}
                  </h1>
                  {user.rating && user.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-primary text-primary" />
                      <span className="font-semibold">{user.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({user.reviewCount} reviews)
                      </span>
                    </div>
                  )}
                </div>

                {user.address && (
                  <div className="flex items-center gap-1 text-muted-foreground mt-2">
                    <MapPin className="h-4 w-4" />
                    {user.address}
                  </div>
                )}

                {user.bio && (
                  <p className="mt-3 text-muted-foreground max-w-2xl">
                    {user.bio}
                  </p>
                )}

                {user.interests && user.interests.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {user.interests.map((interest) => (
                      <Badge key={interest} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold gradient-text">
                  {user.hostedEvents || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Events Hosted
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold gradient-text">
                  {user.pertcipatedEvents || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Events Joined
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold gradient-text">
                  {new Date(user.createdAt).getFullYear()}
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
                    {user.bio || "No bio provided yet."}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Interests</h3>
                  {user.interests && user.interests.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.interests.map((interest) => (
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
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p className="capitalize">Role: {user.role}</p>
                    {user.address && <p>Location: {user.address}</p>}
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
                    <h3 className="font-semibold mb-2">Public Email</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                  {user.gender && (
                    <div>
                      <h3 className="font-semibold mb-2">Gender</h3>
                      <p className="text-muted-foreground capitalize">
                        {user.gender.toLowerCase()}
                      </p>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold mb-2">Account Status</h3>
                    <Badge
                      variant={
                        user.status === "ACTIVE" ? "default" : "destructive"
                      }
                    >
                      {user.status}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Email Verified</h3>
                    <Badge
                      variant={user.isEmailVerified ? "default" : "secondary"}
                    >
                      {user.isEmailVerified ? "Verified" : "Not Verified"}
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