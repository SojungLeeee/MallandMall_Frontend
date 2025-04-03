import React, { useState, useEffect } from "react"; // useState와 useEffect를 React에서 가져오기
import { ChevronLeft } from "lucide-react";
import { getQuestionDetail } from "../../api/httpQuestion";

const InquiryResponseView = ({ inquiry, onBack }) => {
  const [answers, setAnswers] = useState([]); // 답변 상태 관리
  const token = localStorage.getItem("jwtAuthToken"); // 관리자 인증 토큰

  // 질문에 대한 답변 불러오기
  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const data = await getQuestionDetail(inquiry.id, token);
        setAnswers(data); // 답변 데이터를 상태에 저장
      } catch (error) {
        console.error("❌ 답변을 불러오는 중 오류 발생:", error);
      }
    };
    fetchAnswers();
  }, [inquiry.id, token]);

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center p-4 border-b">
        <button onClick={onBack}>
          <ChevronLeft />
        </button>
        <div className="flex-grow text-center font-bold mr-5">문의 상세</div>
      </div>

      {/* Inquiry Details */}
      <div className="p-4 border-b border-gray-200">
        {/* 제목 */}
        <div className="text-xl font-bold text-gray-900">{inquiry.title}</div>

        {/* 문의 일자 */}
        <div className="text-xs text-gray-500 mt-1 text-right">
          문의일자: <span className="font-medium">{inquiry.createDate}</span>
        </div>

        {/* 내용 */}
        <div className="mt-3 text-sm text-gray-900 bg-gray-30 p-3 rounded-sm shadow-sm">
          {inquiry.content}
        </div>
      </div>

      {/* Response Section */}
      <div className="flex-grow p-4">
        {answers.length > 0 ? (
          answers.map((answer, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg mb-4">
              <div className="text-sm mb-2 font-semibold text-gray-700">
                관리자 답변
              </div>
              <div className="text-sm text-gray-800">{answer.content}</div>
              {answer.createDate && (
                <div className="text-xs text-gray-500 mt-2 text-right">
                  답변 일시: {answer.createDate}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500">
            아직 답변이 등록되지 않았습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiryResponseView;
