"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { getAboutContent, updateAboutContent } from "@/actions/about";
import { ImageUploader } from "@/components/upload/image-uploader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ButtonSpinner } from "@/components/ui/button-spinner";

const aboutSchema = z.object({
  bio: z.string().max(2000, "Bio too long").optional(),
  email: z
    .string()
    .email("Invalid email")
    .optional()
    .or(z.literal("")),
  instagramUrl: z
    .string()
    .url("Invalid URL")
    .optional()
    .or(z.literal("")),
  tiktokUrl: z
    .string()
    .url("Invalid URL")
    .optional()
    .or(z.literal("")),
});

type AboutFormData = z.infer<typeof aboutSchema>;

interface ProfileImage {
  id: string;
  variants: {
    variantName: string;
    url: string;
    width: number;
    height: number;
  }[];
}

export default function AboutEditorPage() {
  const [profileImageId, setProfileImageId] = useState<string | null>(null);
  const [existingProfileImage, setExistingProfileImage] =
    useState<ProfileImage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AboutFormData>({
    resolver: zodResolver(aboutSchema),
  });

  useEffect(() => {
    getAboutContent().then((content) => {
      if (content) {
        reset({
          bio: content.bio ?? "",
          email: content.email ?? "",
          instagramUrl: content.instagramUrl ?? "",
          tiktokUrl: content.tiktokUrl ?? "",
        });
        if (content.profileImageId) {
          setProfileImageId(content.profileImageId);
        }
        if (content.profileImage) {
          setExistingProfileImage(content.profileImage);
        }
      }
      setIsLoading(false);
    });
  }, [reset]);

  const onSubmit = async (data: AboutFormData) => {
    setIsSubmitting(true);
    try {
      await updateAboutContent({
        bio: data.bio || undefined,
        email: data.email || null,
        instagramUrl: data.instagramUrl || null,
        tiktokUrl: data.tiktokUrl || null,
        profileImageId: profileImageId || null,
      });
      toast.success("About page saved");
    } catch {
      toast.error("Changes could not be saved. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-8 md:py-12 max-w-xl mx-auto">
        <h1 className="font-display text-xl font-bold text-text-primary mb-6">
          About Page
        </h1>
        <p className="text-text-secondary">Loading...</p>
      </div>
    );
  }

  const profileThumb = existingProfileImage?.variants.find(
    (v) => v.variantName === "thumb"
  );

  return (
    <div className="py-8 md:py-12 max-w-xl mx-auto">
      <h1 className="font-display text-xl font-bold text-text-primary mb-6">
        About Page
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            maxLength={2000}
            {...register("bio")}
            className="min-h-[200px] resize-y"
          />
          {errors.bio && (
            <p className="text-sm text-destructive mt-1">
              {errors.bio.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-sm text-destructive mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="instagramUrl">Instagram URL</Label>
          <Input
            id="instagramUrl"
            type="url"
            placeholder="https://instagram.com/..."
            {...register("instagramUrl")}
            aria-invalid={!!errors.instagramUrl}
          />
          {errors.instagramUrl && (
            <p className="text-sm text-destructive mt-1">
              {errors.instagramUrl.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="tiktokUrl">TikTok URL</Label>
          <Input
            id="tiktokUrl"
            type="url"
            placeholder="https://tiktok.com/@..."
            {...register("tiktokUrl")}
            aria-invalid={!!errors.tiktokUrl}
          />
          {errors.tiktokUrl && (
            <p className="text-sm text-destructive mt-1">
              {errors.tiktokUrl.message}
            </p>
          )}
        </div>

        <div>
          <Label>Profile Photo</Label>
          {profileThumb && (
            <div className="mb-3">
              <img
                src={profileThumb.url}
                alt="Current profile photo"
                className="w-20 h-20 rounded-lg object-cover"
              />
            </div>
          )}
          <ImageUploader
            bucket="public-images"
            folder="about"
            onUploadComplete={setProfileImageId}
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            className="bg-accent text-white hover:bg-accent-hover active:scale-[0.97] transition-all duration-100"
            disabled={isSubmitting}
          >
            <span className="inline-flex items-center gap-2">
              {isSubmitting && <ButtonSpinner />}
              {isSubmitting ? "Saving..." : "Save About Page"}
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
}
