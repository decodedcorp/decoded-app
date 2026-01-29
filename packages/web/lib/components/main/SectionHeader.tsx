"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Heading, Text } from "@/lib/design-system";

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
        <Heading variant="h2" className="text-xl md:text-2xl">
          {title}
        </Heading>
        {subtitle && (
          <Text variant="small" textColor="muted" className="mt-1">
            {subtitle}
          </Text>
        )}
      </div>
      {viewMoreLink && (
        <Link href={viewMoreLink}>
          <Text
            variant="small"
            textColor="muted"
            as="span"
            className="font-medium hover:text-foreground transition-colors"
          >
            {viewMoreText}
          </Text>
        </Link>
      )}
    </motion.div>
  );
}
