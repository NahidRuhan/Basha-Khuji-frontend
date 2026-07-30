"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeroSearch() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/properties?searchTerm=${encodeURIComponent(searchTerm)}`);
    } else {
      router.push(`/properties`);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 bg-background/80 backdrop-blur-xl p-2 rounded-2xl shadow-xl border border-primary/10">
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1 flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Search by city, neighborhood, or property name..." 
            className="w-full pl-12 h-14 bg-transparent border-none shadow-none focus-visible:ring-0 text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button type="submit" size="lg" className="h-14 px-8 rounded-xl shrink-0 text-base font-semibold shadow-md">
          Search
        </Button>
      </form>
    </div>
  );
}
