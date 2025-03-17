import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SearchBar = () => {
  const [search, setSearch] = useState(""); // 검색어 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수

  // 검색 함수: 엔터를 눌렀을 때 실행
  const handleSearch = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작을 방지
    if (!search.trim()) return; // 검색어가 비어 있으면 실행하지 않음

    // 검색어를 URL 경로에 포함하여 이동
    navigate(`/search/${search}`); // 카테고리 이름을 포함한 URL로 이동
  };

  // 엔터 키를 눌렀을 때 실행
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(e); // 엔터키를 누르면 검색 실행
    }
  };

  return (
    <div className="flex justify-center m-2">
      {/* 가로 중앙 정렬 및 상단 여백 추가 */}
      <form
        className="flex justify-between items-center w-full max-w-4xl"
        onSubmit={handleSearch}
      >
        {/* 화면 크기에 맞게 최대 너비 설정 */}
        <div className="relative flex-grow ml-0.5 mb-2 flex">
          {/* 인풋 */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)} // 입력값을 상태에 저장
            onKeyDown={handleKeyDown} // 엔터키를 누르면 검색 실행
            placeholder="검색어 입력"
            className="w-5/6 p-3 pl-2 pr-10 text-gray-800 placeholder-gray-400 border border-gray-300 rounded-2xl focus:outline-none"
          />

          {/* 오른쪽 버튼 */}
          <Link
            to="/"
            className="w-1/5 p-3 rounded-l-2xl flex items-center justify-center font-bold cursor-pointer"
          >
            <span className="text-black">취소</span> {/* 텍스트만 표시 */}
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
