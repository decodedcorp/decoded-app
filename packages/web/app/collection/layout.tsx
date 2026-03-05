import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Collection | Decoded",
  description: "Your personal magazine collection bookshelf",
};

export default function CollectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-mag-bg min-h-screen text-mag-text">{children}</div>
  );
}
