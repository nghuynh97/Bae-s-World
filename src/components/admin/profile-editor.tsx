'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { getAboutContent, updateAboutContent } from '@/actions/about';
import { ImageUploader } from '@/components/upload/image-uploader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ButtonSpinner } from '@/components/ui/button-spinner';

const aboutSchema = z.object({
  bio: z.string().max(2000, 'Bio too long').optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  instagramUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  tiktokUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  tagline: z
    .string()
    .max(200, 'Tagline too long')
    .optional()
    .or(z.literal('')),
  height: z.string().max(20).optional().or(z.literal('')),
  weight: z.string().max(20).optional().or(z.literal('')),
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

export function ProfileEditor() {
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
          bio: content.bio ?? '',
          email: content.email ?? '',
          instagramUrl: content.instagramUrl ?? '',
          tiktokUrl: content.tiktokUrl ?? '',
          tagline: content.tagline ?? '',
          height: content.height ?? '',
          weight: content.weight ?? '',
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
        tagline: data.tagline || null,
        height: data.height || null,
        weight: data.weight || null,
        profileImageId: profileImageId || null,
      });
      toast.success('Profile saved');
    } catch {
      toast.error('Changes could not be saved. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <p className="text-text-secondary">Loading...</p>;
  }

  const profileThumb = existingProfileImage?.variants.find(
    (v) => v.variantName === 'thumb',
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-xl space-y-5">
      <div className="space-y-2">
        <Label htmlFor="tagline">Tagline</Label>
        <Input
          id="tagline"
          placeholder="e.g., Freelance Model & Creator"
          {...register('tagline')}
        />
        {errors.tagline && (
          <p className="text-sm text-destructive">{errors.tagline.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          maxLength={2000}
          {...register('bio')}
          className="min-h-[160px] resize-y"
        />
        {errors.bio && (
          <p className="text-sm text-destructive">{errors.bio.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="height">Height</Label>
          <Input id="height" placeholder="e.g., 170cm" {...register('height')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight">Weight</Label>
          <Input id="weight" placeholder="e.g., 52kg" {...register('weight')} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="instagramUrl">Instagram URL</Label>
        <Input
          id="instagramUrl"
          type="url"
          placeholder="https://instagram.com/..."
          {...register('instagramUrl')}
          aria-invalid={!!errors.instagramUrl}
        />
        {errors.instagramUrl && (
          <p className="text-sm text-destructive">
            {errors.instagramUrl.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tiktokUrl">TikTok URL</Label>
        <Input
          id="tiktokUrl"
          type="url"
          placeholder="https://tiktok.com/@..."
          {...register('tiktokUrl')}
          aria-invalid={!!errors.tiktokUrl}
        />
        {errors.tiktokUrl && (
          <p className="text-sm text-destructive">{errors.tiktokUrl.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Profile Photo</Label>
        {profileThumb && (
          <div className="mb-2">
            <img
              src={profileThumb.url}
              alt="Current profile photo"
              className="h-20 w-20 rounded-lg object-cover"
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
        <Button type="submit" disabled={isSubmitting} className="active:scale-[0.97]">
          <span className="inline-flex items-center gap-2">
            {isSubmitting && <ButtonSpinner />}
            {isSubmitting ? 'Saving...' : 'Save Profile'}
          </span>
        </Button>
      </div>
    </form>
  );
}
