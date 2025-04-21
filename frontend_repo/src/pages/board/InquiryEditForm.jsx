import React, { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import axios from "axios";

const InquiryEditForm = ({ inquiry, onBack }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 컴포넌트 마운트 시 기존 문의 데이터로 폼 초기화
  useEffect(() => {
    if (inquiry) {
      setTitle(inquiry.title);
      setContent(inquiry.content);
    }
  }, [inquiry]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 로컬 스토리지에서 토큰 가져오기
    const token = localStorage.getItem("jwtAuthToken");

    try {
      // 실제 API 엔드포인트는 /update/{questionId}로 수정
      const response = await axios.put(
        `https://morek9.click/questions/update/${inquiry.id}`, // questionId를 URL에 추가
        {
          title: title,
          content: content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // 인증 헤더에 토큰 추가
          },
        }
      );

      // 성공 처리 - 예: 알림, 페이지 이동 등
      alert("문의가 성공적으로 수정되었습니다.");
      onBack(); // 이전 화면으로 돌아가기
    } catch (error) {
      console.error("문의 수정 중 오류 발생:", error);
      alert("문의 수정에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-md mx-auto h-full flex flex-col bg-white">
      {/* 헤더 */}
      <div className="flex items-center px-4 py-2 border-b">
        <button onClick={onBack}>
          <ChevronLeft />
        </button>
        <div className="flex-grow text-center text-xl font-bold mr-5">문의 수정</div>
      </div>

      {/* 폼 */}
      <form onSubmit={handleSubmit} className="flex-grow p-4 flex flex-col">
        {/* 제목 (가로 정렬) */}
        <div className="mb-4 flex items-center gap-4">
          <label htmlFor="title" className="min-w-[80px] font-medium text-gray-700">
            제목
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            required
            className="flex-grow px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 내용 (가로 정렬) */}
        <div className="mb-4 flex gap-4 items-start">
          <label htmlFor="content" className="min-w-[80px] pt-2 font-medium text-gray-700">
            내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="문의 내용을 입력하세요"
            required
            className="flex-grow min-h-[498px] px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <button type="submit" className="w-full bg-[#787669] text-white py-3 rounded-sm">
          수정 완료
        </button>
      </form>
    </div>
  );
};

export default InquiryEditForm;
