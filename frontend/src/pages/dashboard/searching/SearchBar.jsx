// SearchBar.jsx
import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Search } from "lucide-react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const SearchBar = forwardRef(({ onResults }, ref) => {
  const [query, setQuery] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const res = await axios.get(`${BASE_URL}/orders/search?q=${query}`);
      onResults(res.data);
    } catch (error) {
      console.error("❌ Error searching orders:", error);
    }
  };

  // Expose a reset function to parent via ref
  useImperativeHandle(ref, () => ({
    reset: () => {
      setQuery("");
      onResults([]); // clear search results
    },
  }));

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center gap-3 w-full max-w-md mx-auto bg-white border border-gray-300 rounded-2xl px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 transition"
    >
      <Search className="text-gray-400" size={20} />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="جستجو بر اساس نام مشتری یا شماره بیل..."
        className="flex-1 outline-none text-gray-700 placeholder-gray-400"
      />
      <button
        type="submit"
        className="bg-indigo-600 text-white rounded-xl px-4 py-1 hover:bg-indigo-700 transition"
      >
        جستجو
      </button>
    </form>
  );
});

export default SearchBar;
