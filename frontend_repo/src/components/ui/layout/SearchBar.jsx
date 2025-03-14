import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";

const SearchBar = () => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", query);
    // 여기에 검색 로직을 추가할 수 있습니다.
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center w-full">
      <div className="flex-grow relative ml-0.5 mb-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Mall&Mall에 오신것을 환영합니다"
          className="w-full p-3 pl-2 pr-10 text-gray-800 placeholder-gray-400 border border-gray-300 rounded-2xl focus:outline-none"
          onClick={() => (window.location.href = "https://example.com")} // 클릭 시 새 페이지로 이동
        />
        <CiSearch className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-500" />
      </div>
    </form>
  );
};

export default SearchBar;
