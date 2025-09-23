import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Welcome to Decoded',
  description: 'Enter your invite code to access the Decoded experience',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
};

export default function InviteCodeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {/* Full screen immersive layout */}
      <div className="relative min-h-screen">
        {children}
      </div>
    </div>
  );
}