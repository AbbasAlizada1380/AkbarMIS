import React, { useState } from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [pageInput, setPageInput] = useState("");

  const handlePageSubmit = (e) => {
    e.preventDefault();
    const page = parseInt(pageInput);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page);
      setPageInput("");
    }
  };

  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  return (
    <div className="flex flex-col md:flex-row items-center justify-center mt-6 gap-3 text-sm">
      {/* Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirst}
          className={`px-4 py-2 rounded-xl font-medium transition ${
            isFirst
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          قبلی
        </button>

        <span className="px-3 text-gray-700">
          صفحه{" "}
          <span className="font-semibold text-blue-600">{currentPage}</span> از{" "}
          <span className="font-semibold text-blue-600">{totalPages}</span>
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLast}
          className={`px-4 py-2 rounded-xl font-medium transition ${
            isLast
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          بعدی
        </button>
      </div>

      {/* Jump to Page */}
      <form onSubmit={handlePageSubmit} className="flex items-center gap-2">
        <input
          type="number"
          min="1"
          max={totalPages}
          value={pageInput}
          onChange={(e) => setPageInput(e.target.value)}
          className="w-20 text-center border border-gray-300 rounded-xl px-2 py-1 focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="شماره"
        />
        <button
          type="submit"
          className="px-3 py-1 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
        >
          برو
        </button>
      </form>
    </div>
  );
};

export default Pagination;
