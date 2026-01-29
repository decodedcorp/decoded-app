"use client";

import Link from "next/link";
import { motion } from "motion/react";

export interface StyleCardData {
  id: string;
  title: string;
  description: string;
  artistName: string;
  imageUrl?: string;
  link: string;
  items?: {
    id: string;
    label: string;
    brand: string;
    name: string;
    imageUrl?: string;
  }[];
}

interface StyleCardProps {
  data: StyleCardData;
  variant?: "large" | "medium" | "small";
  showItems?: boolean;
  index?: number;
}

export function StyleCard({
  data,
  variant = "medium",
  showItems = true,
  index = 0,
}: StyleCardProps) {
  const sizeClasses = {
    large: "col-span-2 row-span-2",
    medium: "col-span-1",
    small: "col-span-1",
  };

  const aspectClasses = {
    large: "aspect-[4/3]",
    medium: "aspect-[3/4]",
    small: "aspect-square",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group ${sizeClasses[variant]}`}
    >
      <Link href={data.link} className="block h-full">
        <div className="h-full flex flex-col bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-shadow">
          {/* Image */}
          <div className={`relative ${aspectClasses[variant]} bg-muted`}>
            {/* Placeholder gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-muted via-card to-muted" />

            {/* Item Labels Overlay */}
            {showItems && data.items && data.items.length > 0 && (
              <div className="absolute inset-0 p-4">
                {data.items.slice(0, 3).map((item, i) => (
                  <div
                    key={item.id}
                    className="absolute bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-foreground"
                    style={{
                      top: `${20 + i * 25}%`,
                      left: i % 2 === 0 ? "10%" : "auto",
                      right: i % 2 === 1 ? "10%" : "auto",
                    }}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            <h3 className="text-base font-semibold text-foreground mb-1 line-clamp-1">
              {data.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {data.description}
            </p>
            <p className="text-xs text-muted-foreground">{data.artistName}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
