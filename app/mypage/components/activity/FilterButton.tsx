"use client";

import { Filter } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface FilterButtonProps {
  filter: string;
  setFilter: (filter: string) => void;
  t: any;
}

export const FilterButton = ({ filter, setFilter, t }: FilterButtonProps) => {
  const filterOptions = [
    { id: "all", label: t.mypage.filter.all },
    { id: "latest", label: t.mypage.filter.latest },
    { id: "oldest", label: t.mypage.filter.oldest },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-1 bg-white/10 hover:bg-white/15 transition-colors rounded-full px-3 py-1.5 text-xs text-white/80"
        >
          <Filter className="h-3 w-3" />
          <span>{filter === 'all' ? t.mypage.filter.all : 
                 filter === 'latest' ? t.mypage.filter.latest : 
                 t.mypage.filter.oldest}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1 bg-black/90 border-white/10 text-white">
        <div className="space-y-1">
          {filterOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setFilter(option.id)}
              className={`block w-full text-left px-3 py-2 rounded-sm text-sm transition-colors ${
                filter === option.id
                  ? "bg-white/20 text-white"
                  : "hover:bg-white/10 text-white/70"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}; 