import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  // 검색 함수: 엔터를 눌렀을 때 실행
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const response = await axios.get(`example`, {
        params: { query }, // 쿼리 파라미터로 전달
      });

      console.log("🔍 검색 결과:", response.data);

      // 검색 결과 페이지로 이동하면서 데이터 전달
      navigate(`/search?query=${encodeURIComponent(query)}`, {
        state: { results: response.data },
      });
    } catch (error) {
      console.error("검색 실패:", error);
      alert("검색 중 오류가 발생했습니다. 다시 입력하세요.");
    }
  };

  // 엔터 키를 눌렀을 때 실행
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(e); // 엔터키를 누르면 검색 실행
    }
  };

  return (
    <form className="flex items-center w-full">
      <div className="relative flex-grow ml-0.5 mb-2 flex">
        {/* 인풋 */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
      {/* 영역 클릭 시 커서 깜빡이지 않도록 설정 */}
      <div className="absolute inset-0 pointer-events-none"></div>
    </form>
  );
};

export default SearchBar;
