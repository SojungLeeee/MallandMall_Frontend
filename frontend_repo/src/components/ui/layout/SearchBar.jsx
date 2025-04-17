import React from "react";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const navigate = useNavigate();

  return (
    <form className="flex items-center w-full caret-transparent">
      <div className="flex-grow relative pb-2 flex justify-center">
        <div className="w-full relative px-4">
          <input
            type="text"
            placeholder="Mall&Mall 에 오신 것을 환영합니다!"
            readOnly
            className="w-full p-3 pr-10 text-gray-800 placeholder-gray-400 border border-gray-300 rounded-sm focus:outline-none"
            onClick={() => navigate("/search")} // 클릭 시 새 페이지로 이동
          />
          <CiSearch className="absolute right-5 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-500" />
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
