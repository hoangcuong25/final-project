import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SortAsc, SortDesc } from "lucide-react";
import { useDebounce } from "use-debounce";

interface Props {
  onSearch: (search: string) => void;
  onSort: (sortBy: string, order: "asc" | "desc") => void;
}

const CoursesFilter = ({ onSearch, onSort }: Props) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const handleSortChange = () => {
    const newOrder = order === "asc" ? "desc" : "asc";
    setOrder(newOrder);
    onSort("price", newOrder);
  };

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Tìm khóa học..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Button
        variant="outline"
        onClick={handleSortChange}
        className="flex items-center gap-1"
      >
        {order === "asc" ? (
          <>
            <SortAsc className="w-4 h-4" /> Giá tăng dần
          </>
        ) : (
          <>
            <SortDesc className="w-4 h-4" /> Giá giảm dần
          </>
        )}
      </Button>
    </div>
  );
};

export default CoursesFilter;
