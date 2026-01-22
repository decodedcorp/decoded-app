"use client";

import Link from "next/link";
import { motion } from "motion/react";

export interface ItemCardData {
  id: string;
  brand: string;
  name: string;
  imageUrl?: string;
  link: string;
  relatedStyles?: number;
  badge?: "TOP" | "NEW" | "BEST";
}

interface ItemCardProps {
  data: ItemCardData;
  index?: number;
}

export function ItemCard({ data, index = 0 }: ItemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group"
    >
      <Link href={data.link} className="block">
        <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
          {/* Image */}
          <div className="relative aspect-square bg-gray-50">
            {/* Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />

            {/* Badge */}
            {data.badge && (
              <div
                className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-bold text-white ${
                  data.badge === "TOP"
                    ? "bg-black"
                    : data.badge === "NEW"
                      ? "bg-blue-500"
                      : "bg-red-500"
                }`}
              >
                {data.badge}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-3">
            <p className="text-xs text-gray-500 mb-0.5">{data.brand}</p>
            <h4 className="text-sm font-medium text-gray-900 line-clamp-1 mb-1">
              {data.name}
            </h4>
            {data.relatedStyles !== undefined && (
              <p className="text-xs text-gray-400">
                관련 스타일 {data.relatedStyles}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
