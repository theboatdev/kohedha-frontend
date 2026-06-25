"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface MenuSearchFilterProps {
  searchQuery: string;
  selectedCategory: string;
  categories: string[];
  sortBy: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export function MenuSearchFilter({
  searchQuery,
  selectedCategory,
  categories,
  sortBy,
  onSearchChange,
  onCategoryChange,
  onSortChange,
}: MenuSearchFilterProps) {
  return (
    <div className="mb-6 flex flex-col lg:flex-row gap-4">
      {/* Search Bar */}
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
          style={{ color: "rgba(13,13,13,0.48)" }}
        />
        <Input
          type="text"
          placeholder="Search by name, description, or category..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 font-poppins"
        />
      </div>

      {/* Category Filter */}
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full lg:w-[200px] font-poppins">
          <SelectValue placeholder="Filter by category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="font-poppins">
            All Categories
          </SelectItem>
          {categories.map((category) => (
            <SelectItem
              key={category}
              value={category}
              className="font-poppins"
            >
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort By */}
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-full lg:w-[200px] font-poppins">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default" className="font-poppins">
            No Sort
          </SelectItem>
          <SelectItem value="upvotes-most" className="font-poppins">
            Most Upvoted
          </SelectItem>
          <SelectItem value="upvotes-least" className="font-poppins">
            Least Upvoted
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
