import { Mail, Instagram, Camera } from 'lucide-react';

interface AboutSectionProps {
  bio: string;
  email: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  profileImageUrl: string | null;
}

export function AboutSection({
  bio,
  email,
  instagramUrl,
  tiktokUrl,
  profileImageUrl,
}: AboutSectionProps) {
  if (!bio) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="font-display text-xl font-bold text-text-primary">
          About page not set up yet
        </h2>
        <p className="mt-2 text-sm text-text-secondary">Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-[40%_1fr]">
      {/* Profile photo */}
      <div>
        {profileImageUrl ? (
          <img
            src={profileImageUrl}
            alt="Funnghy"
            className="max-h-[400px] w-full rounded-lg object-cover shadow-md"
          />
        ) : (
          <div className="flex aspect-[3/4] max-h-[400px] w-full items-center justify-center rounded-lg bg-gradient-to-br from-accent/20 to-dominant">
            <Camera size={48} className="text-text-secondary/40" />
          </div>
        )}
      </div>

      {/* Bio and contact */}
      <div>
        <p className="font-body text-base leading-relaxed whitespace-pre-line text-text-primary">
          {bio}
        </p>

        {/* Contact info */}
        <div className="mt-6 flex items-center gap-4">
          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 text-text-secondary transition-colors hover:text-accent"
            >
              <Mail size={24} />
              <span className="text-sm">{email}</span>
            </a>
          )}
        </div>

        {/* Social links */}
        <div className="mt-4 flex items-center gap-2">
          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary transition-colors hover:text-accent"
              aria-label="Instagram"
            >
              <Instagram size={24} />
            </a>
          )}
          {tiktokUrl && (
            <a
              href={tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary transition-colors hover:text-accent"
              aria-label="TikTok"
            >
              {/* TikTok icon - lucide doesn't have one, use a simple SVG */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
