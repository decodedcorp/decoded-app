"use client";

import Link from "next/link";
import { motion } from "motion/react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  viewMoreLink?: string;
  viewMoreText?: string;
}

export function SectionHeader({
  title,
  subtitle,
  viewMoreLink,
  viewMoreText = "VIEW MORE",
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex items-end justify-between mb-6"
    >
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
      {viewMoreLink && (
        <Link
          href={viewMoreLink}
          className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          {viewMoreText}
        </Link>
      )}
    </motion.div>
  );
}
