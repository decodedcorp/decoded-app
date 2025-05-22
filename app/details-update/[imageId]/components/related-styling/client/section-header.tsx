"use client";

interface SectionHeaderProps {
  title: string;
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div className="mb-6">
      <h2 className="text-white/80 text-2xl font-bold">{title}</h2>
    </div>
  );
}
