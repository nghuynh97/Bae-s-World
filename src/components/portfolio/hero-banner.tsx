import { Instagram, Mail, Music2, User } from 'lucide-react';

interface HeroBannerProps {
  profileImageUrl: string | null;
  name: string;
  tagline: string | null;
  bio: string;
  height: string | null;
  weight: string | null;
  email: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
}

export function HeroBanner({
  profileImageUrl,
  name,
  tagline,
  bio,
  height,
  weight,
  email,
  instagramUrl,
  tiktokUrl,
}: HeroBannerProps) {
  const stats = [height, weight].filter(Boolean);

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 rounded-xl bg-surface p-6 shadow-sm md:grid-cols-[160px_1fr] md:p-8">
      {/* Profile photo */}
      <div className="flex justify-center md:justify-start">
        {profileImageUrl ? (
          <img
            src={profileImageUrl}
            alt={name}
            className="h-32 w-32 rounded-full object-cover shadow-md md:h-40 md:w-40"
          />
        ) : (
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-accent/20 md:h-40 md:w-40">
            <User size={48} className="text-text-secondary/40" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="text-center md:text-left">
        <h1 className="text-2xl font-bold text-text-primary">{name}</h1>

        {tagline && (
          <p className="mt-1 text-sm text-text-secondary">{tagline}</p>
        )}

        <p className="mt-3 text-sm leading-relaxed text-text-primary">{bio}</p>

        {stats.length > 0 && (
          <p className="mt-2 text-xs text-text-secondary">
            {stats.join(' \u00b7 ')}
          </p>
        )}

        {/* Social links */}
        <div className="mt-3 flex justify-center gap-3 md:justify-start">
          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-text-secondary transition-colors hover:text-accent"
            >
              <Instagram size={18} />
            </a>
          )}
          {tiktokUrl && (
            <a
              href={tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="text-text-secondary transition-colors hover:text-accent"
            >
              <Music2 size={18} />
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              aria-label="Email"
              className="text-text-secondary transition-colors hover:text-accent"
            >
              <Mail size={18} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
