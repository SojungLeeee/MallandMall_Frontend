import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import axios from "axios";

const InquiryWriteForm = ({ onBack }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 로컬 스토리지에서 토큰 가져오기
    const token = localStorage.getItem("jwtAuthToken");

    // 인증된 사용자 ID 가져오기 (실제로는 JWT를 디코딩해서 사용자 ID를 추출해야 함)
    const userId = "aaa"; // 실제 userId로 대체 필요

    try {
      // 실제 API 엔드포인트
      const response = await axios.post(
        "http://localhost:8090/emart/questions/add", // API 엔드포인트
        {
          userId: userId, // 인증된 사용자 ID
          title: title,
          content: content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Bearer 토큰을 헤더에 추가
          },
        }
      );

      // 성공 처리 - 예: 알림, 페이지 이동 등
      alert("문의가 성공적으로 작성되었습니다.");
      onBack(); // 이전 화면으로 돌아가기
    } catch (error) {
      console.error("문의 작성 중 오류 발생:", error);
      alert("문의 작성에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-md mx-auto h-full flex flex-col bg-white">
      {/* 헤더 */}
      <div className="flex items-center p-4 border-b">
        <button onClick={onBack}>
          <ChevronLeft />
        </button>
        <div className="flex-grow text-center font-bold mr-5">문의 작성</div>
      </div>

      {/* 폼 */}
      <form onSubmit={handleSubmit} className="flex-grow p-4 flex flex-col">
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            제목
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            required
            className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex-grow mb-4">
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="문의 내용을 입력하세요"
            required
            className="w-full h-4/5 px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#787669] text-white py-3 rounded-sm"
        >
          문의 작성 완료
        </button>
      </form>
    </div>
  );
};

export default InquiryWriteForm;
