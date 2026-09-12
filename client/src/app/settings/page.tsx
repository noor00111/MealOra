"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { User, Store, Camera } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { uploadImage } from "@/lib/cloudinary";
import { getErrorMessage } from "@/lib/api";
import {fetchMyProviderProfile, updateUserProfile, updateProviderProfile} from "@/lib/profile-api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/motion";

export default function SettingsPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [address, setAddress] = useState(user?.address ?? "");
  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [providerAddress, setProviderAddress] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);

  const isProvider = user?.role === "PROVIDER";

  const { data: providerProfile } = useQuery({
    queryKey: ["my-provider-profile"],
    queryFn: fetchMyProviderProfile,
    enabled: isProvider,
  });

  useEffect(() => {
    if (providerProfile) {
      setBusinessName(providerProfile.businessName);
      setDescription(providerProfile.description ?? "");
      setCuisine(providerProfile.cuisine ?? "");
      setProviderAddress(providerProfile.address ?? "");
      setLogoUrl(providerProfile.logoUrl ?? "");
      setLogoPreview(providerProfile.logoUrl ?? null);
    }
  }, [providerProfile]);

  const userMutation = useMutation({
    mutationFn: () => updateUserProfile({ name: name || undefined, phone: phone || undefined, address: address || undefined }),
    onSuccess: (updated) => {
      updateUser({ name: updated.name, phone: updated.phone, address: updated.address });
    },
  });

  const providerMutation = useMutation({
    mutationFn: () => updateProviderProfile({
      businessName: businessName || undefined,
      description: description || undefined,
      cuisine: cuisine || undefined,
      address: providerAddress || undefined,
      logoUrl: logoUrl || undefined,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-provider-profile"] });
      queryClient.invalidateQueries({ queryKey: ["providers"] });
    },
  });

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoPreview(URL.createObjectURL(file));
    setLogoUploading(true);
    try {
      const url = await uploadImage(file);
      setLogoUrl(url);
    } finally {
      setLogoUploading(false);
    }
  }

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mb-8">
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}>
          Account Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">{user.email}</p>
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" animate="show" className="rounded-2xl border border-border bg-card p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <User size={15} />
          </div>
          <h2 className="font-semibold text-foreground">Personal info</h2>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Full name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Phone</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+880..." />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Address</label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Your address" />
            </div>
          </div>
        </div>

        {userMutation.isError && (
          <p className="text-sm text-destructive mt-3">{getErrorMessage(userMutation.error)}</p>
        )}
        {userMutation.isSuccess && (
          <p className="text-sm text-green-600 mt-3">Saved successfully.</p>
        )}

        <div className="flex justify-end mt-5">
          <Button
            onClick={() => userMutation.mutate()}
            disabled={userMutation.isPending}
            className="rounded-full px-6">
            {userMutation.isPending ? "Saving…" : "Save"}
          </Button>
        </div>
      </motion.div>


      {isProvider && (
        <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.08 }} className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Store size={15} />
            </div>
            <h2 className="font-semibold text-foreground">Kitchen profile</h2>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Kitchen logo / photo</label>
              <div className="flex items-center gap-4">
                <div className="relative size-20 rounded-2xl overflow-hidden bg-muted border border-border flex items-center justify-center shrink-0">
                  
                  {logoPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <Camera size={22} className="text-muted-foreground/40" />
                  )}
                </div>
                <label htmlFor="logo-upload" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm font-medium hover:bg-muted transition-colors">
                  <Camera size={13} /> {logoUploading ? "Uploading…" : "Upload photo"}
                </label>
                <input id="logo-upload" type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Business name</label>
              <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Your kitchen name" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Cuisine type</label>
                <Input value={cuisine} onChange={(e) => setCuisine(e.target.value)} placeholder="e.g. Korean, Italian" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Address</label>
                <Input value={providerAddress} onChange={(e) => setProviderAddress(e.target.value)} placeholder="Kitchen address" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Description <span className="text-muted-foreground font-normal">(optional)</span></label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell customers about your kitchen…"
                rows={3}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring resize-none"
              />
            </div>
          </div>

          {providerMutation.isError && (
            <p className="text-sm text-destructive mt-3">{getErrorMessage(providerMutation.error)}</p>
          )}
          {providerMutation.isSuccess && (
            <p className="text-sm text-green-600 mt-3">Kitchen profile updated.</p>
          )}

          <div className="flex justify-end mt-5">
            <Button
              onClick={() => providerMutation.mutate()}
              disabled={providerMutation.isPending || logoUploading}
              className="rounded-full px-6">
              {providerMutation.isPending ? "Saving…" : "Save kitchen profile"}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
