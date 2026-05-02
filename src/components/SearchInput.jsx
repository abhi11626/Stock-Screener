"use client";

import { useEffect, useRef, useState } from "react";
import useDebounce from "@/hooks/useDebounce";

export default function SearchInput({ onSearch }) {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value);
  const lastSubmittedRef = useRef("");

  useEffect(() => {
    const query = debouncedValue.trim();

    if (!query || query === lastSubmittedRef.current) {
      return;
    }

    lastSubmittedRef.current = query;
    onSearch?.(query);
  }, [debouncedValue, onSearch]);

  return (
    <input
      value={value}
      onChange={(event) => setValue(event.target.value)}
      placeholder="Search stocks..."
      className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
    />
  );
}
