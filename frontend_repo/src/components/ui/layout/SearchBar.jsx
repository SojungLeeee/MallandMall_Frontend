import React from "react";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const navigate = useNavigate();

  return (
    <form className="flex items-center w-full caret-transparent">
      <div className="flex-grow relative ml-0.5 mb-2">
        <input
          type="text"
          placeholder="Mall&Mall에 오신것을 환영합니다"
          readOnly
          className="w-full p-3 pl-2 pr-10 text-gray-800 placeholder-gray-400 border border-gray-300 rounded-2xl focus:outline-none"
          onClick={() => navigate("/search")} // 클릭 시 새 페이지로 이동
        />
        <CiSearch className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-500" />
      </div>
    </form>
  );
};

export default SearchBar;
