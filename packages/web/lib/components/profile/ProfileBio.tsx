"use client";

import { Instagram, Twitter, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface SocialLink {
  platform: "instagram" | "twitter" | "website";
  url: string;
  handle: string;
}

export interface ProfileBioProps {
  bio?: string;
  socialLinks?: SocialLink[];
  className?: string;
}

const MOCK_SOCIAL_LINKS: SocialLink[] = [
  { platform: "instagram", url: "#", handle: "@decoded_style" },
  { platform: "twitter", url: "#", handle: "@decoded" },
];

const iconMap = {
  instagram: Instagram,
  twitter: Twitter,
  website: Globe,
};

export function ProfileBio({
  bio = "Fashion enthusiast & K-pop style decoder. Finding the exact items worn by your favorite idols.",
  socialLinks = MOCK_SOCIAL_LINKS,
  className,
}: ProfileBioProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {bio && <p className="text-sm text-foreground/90">{bio}</p>}
      {socialLinks.length > 0 && (
        <div className="flex items-center gap-3">
          {socialLinks.map((link) => {
            const Icon = iconMap[link.platform];
            return (
              <a
                key={link.platform}
                href={link.url}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{link.handle}</span>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
