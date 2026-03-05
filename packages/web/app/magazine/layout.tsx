import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Magazine | Decoded",
};

export default function MagazineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-mag-bg min-h-screen text-mag-text">{children}</div>
  );
}
