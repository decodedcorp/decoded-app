"use client";

import React, { useState, useRef, useEffect } from "react";
import { FilterOption } from "./FilterOption";

interface FilterDropdownOption {
  id: string;
  label: string;
  labelKo?: string;
  count?: number;
  imageUrl?: string | null;
}

interface FilterDropdownProps {
  label: string;
  options: FilterDropdownOption[];
  selectedId: string | null;
  onSelect: (id: string, label: string, labelKo?: string) => void;
  disabled?: boolean;
  placeholder?: string;
  searchable?: boolean;
}

export function FilterDropdown({
  label,
  options,
  selectedId,
  onSelect,
  disabled = false,
  placeholder = "Select...",
  searchable = false,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when opening
  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const selectedOption = options.find((opt) => opt.id === selectedId);

  const filteredOptions = searchable
    ? options.filter(
        (opt) =>
          opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          opt.labelKo?.includes(searchQuery)
      )
    : options;

  const handleSelect = (option: FilterDropdownOption) => {
    onSelect(option.id, option.label, option.labelKo);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-sm
          ${
            disabled
              ? "bg-muted/30 text-muted-foreground cursor-not-allowed border-transparent"
              : isOpen
                ? "bg-card border-primary shadow-sm"
                : "bg-card/80 border-border hover:border-primary/50"
          }
          ${selectedOption ? "text-foreground" : "text-muted-foreground"}
        `}
      >
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="font-medium truncate max-w-[100px]">
          {selectedOption?.labelKo || selectedOption?.label || placeholder}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 max-h-80 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          {/* Search input */}
          {searchable && (
            <div className="p-2 border-b border-border">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-1.5 text-sm bg-muted/50 rounded-md border border-transparent focus:border-primary focus:outline-none"
              />
            </div>
          )}

          {/* Options list */}
          <div className="max-h-64 overflow-y-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <FilterOption
                  key={option.id}
                  id={option.id}
                  label={option.label}
                  labelKo={option.labelKo}
                  count={option.count}
                  imageUrl={option.imageUrl}
                  isSelected={option.id === selectedId}
                  onClick={() => handleSelect(option)}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
