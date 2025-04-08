import React, { useState, useEffect } from "react";
import { fetchFindLikeCategories } from "../../../api/httpCategoryService"; // Assuming your API is in a file called api.js
import { getAuthToken } from "../../../context/tokenProviderService";

const Modal = ({ isOpen, onClose, event }) => {
  console.log(event);
  const { token } = getAuthToken();
  const userId = localStorage.getItem("userId"); // 로컬 스토리지에서 userId 가져오기

  useEffect(() => {
    if (!isOpen) return; // 모달이 열릴 때만 데이터를 가져오도록 설정
    // fetch categories or event-specific data if necessary
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null; // 모달이 열리지 않으면 아무 것도 렌더링하지 않음

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleClose} // 모달 외부를 클릭하면 닫히도록 설정
    >
      <div
        className="bg-white p-2 rounded-lg w-4/5 max-w-4xl relative"
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 이벤트 버블링 방지
      >
        {/* Event Display */}
        <h3 className="font-semibold text-xl mb-2">오프라인 전용 이벤트</h3>
        <p>[전 지점] {event.eventTitle} 관련 이벤트</p>
        <p>내용 : {event.description}</p>

        {/* 이미지 표시 */}
        {event.image && (
          <div className="my-4">
            <img
              src={event.image}
              alt="Event Image"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* "오늘 하루 보지 않기" 체크박스 */}
        <div className="flex justify-between items-center">
          {/* X 버튼 */}
          <button
            className="text-2xl font-bold text-gray-600 hover:text-black"
            onClick={handleClose} // 닫기 버튼 클릭 시 모달 닫기
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
