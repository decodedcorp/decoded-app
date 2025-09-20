import { Metadata } from 'next';

interface ProfileLayoutProps {
  children: React.ReactNode;
  params: Promise<{ userid: string }>;
}

export async function generateMetadata({ params }: ProfileLayoutProps): Promise<Metadata> {
  const { userid } = await params;

  return {
    title: `Profile - ${userid} | Decoded App`,
    description: `View ${userid}'s profile on Decoded App`,
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return <>{children}</>;
}
