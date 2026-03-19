import { Mail, Instagram, Camera } from "lucide-react";

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
        <p className="mt-2 text-text-secondary text-sm">Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[40%_1fr] gap-12">
      {/* Profile photo */}
      <div>
        {profileImageUrl ? (
          <img
            src={profileImageUrl}
            alt="Funnghy"
            className="w-full rounded-lg object-cover shadow-md max-h-[400px]"
          />
        ) : (
          <div className="w-full rounded-lg bg-gradient-to-br from-accent/20 to-dominant flex items-center justify-center aspect-[3/4] max-h-[400px]">
            <Camera size={48} className="text-text-secondary/40" />
          </div>
        )}
      </div>

      {/* Bio and contact */}
      <div>
        <p className="text-base font-body leading-relaxed text-text-primary whitespace-pre-line">
          {bio}
        </p>

        {/* Contact info */}
        <div className="mt-6 flex items-center gap-4">
          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors"
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
              className="text-text-secondary hover:text-accent transition-colors"
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
              className="text-text-secondary hover:text-accent transition-colors"
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
