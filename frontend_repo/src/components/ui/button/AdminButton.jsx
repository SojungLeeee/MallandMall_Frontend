import React from "react";
import { CiSearch } from "react-icons/ci"; // 조회 아이콘
import { CiCircleCheck } from "react-icons/ci"; // 등록 아이콘
import { MdOutlineUpdate } from "react-icons/md"; // 수정 아이콘
import { TiDeleteOutline } from "react-icons/ti"; // 삭제 아이콘

export default function AdminButton({ text, onSearch, onRegister, onUpdate, onDelete, onClick, disabled = false }) {
  return (
    <div className="inline-flex rounded-sm shadow-sm mt-2 mr-3 border border-gray-200 overflow-hidden" role="group">
      {/* 첫 번째 버튼: 텍스트를 받는 칸 */}
      <button
        type="button"
        onClick={onClick}
        className="flex-1 text-white justify-center rounded-none bg-black hover:bg-gray-800 focus:outline-none font-medium text-sm px-2 py-3 text-center inline-flex items-center border-r border-gray-700 transition-colors duration-200"
      >
        {text}
      </button>
      {/* 조회 버튼 */}
      <button
        type="button"
        onClick={onSearch || onClick}
        className="flex-1 rounded-none inline-flex items-center justify-center px-2 py-2 text-sm font-medium text-gray-700 bg-white border-0 border-r border-gray-200 hover:bg-gray-50 hover:text-black focus:outline-none transition-colors duration-200"
      >
        <CiSearch className="mr-1 text-black" /> 조회
      </button>
      {/* 등록 버튼 */}
      <button
        type="button"
        onClick={onRegister || onClick}
        className="flex-1 rounded-none inline-flex items-center justify-center px-2 py-2 text-sm font-medium text-gray-700 bg-white border-0 border-r border-gray-200 hover:bg-gray-50 hover:text-black focus:outline-none transition-colors duration-200"
      >
        <CiCircleCheck className="mr-1 text-black" /> 등록
      </button>
      {/* 수정 버튼 */}
      <button
        type="button"
        onClick={text === "개별" || text === "지점" ? null : onUpdate || onClick} // text가 "개별" 또는 "지점"일 때 onClick이 실행되지 않음
        disabled={text === "개별" || text === "지점"} // text가 "개별" 또는 "지점"일 때 버튼 비활성화
        className={`flex-1 rounded-none inline-flex items-center justify-center px-2 py-2 text-sm font-medium text-gray-700 bg-white border-0 border-r border-gray-200 hover:bg-gray-50 hover:text-black focus:outline-none transition-colors duration-200 ${
          text === "개별" || text === "지점" ? "cursor-not-allowed opacity-50 hover:bg-white hover:text-gray-700" : ""
        }`}
      >
        <MdOutlineUpdate className="mr-1 text-black" /> 수정
      </button>

      {/* 삭제 버튼 */}
      <button
        type="button"
        onClick={onDelete || onClick}
        className="flex-1 inline-flex items-center justify-center px-2 py-2 text-sm rounded-none font-medium text-gray-700 bg-white border-0 hover:bg-gray-50 hover:text-black focus:outline-none transition-colors duration-200"
      >
        <TiDeleteOutline className="mr-1 text-black" /> 삭제
      </button>
    </div>
  );
}
