import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import httpAdminquestion from "../../api/httpAdminquestions"; // API 요청 함수

const AdminQuestionManagement = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await httpAdminquestion.get("/answers/all");
        setQuestions(response.data);
      } catch (error) {
        console.error("❌ 질문 목록 불러오기 실패:", error);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">관리자 - 질문 목록</h1>
      <div className="mb-6">
        {questions.length > 0 ? (
          questions.map((question) => (
            <div
              key={question.questionId}
              className="border p-4 mb-4 shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{question.title}</h2>
                  <p className="text-sm text-gray-500">{question.createDate}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {/* 답변 여부에 따라 상태 표시 */}
                  {Array.isArray(question.answers) &&
                  question.answers.length > 0
                    ? "답변 완료"
                    : "답변 대기 중"}
                </div>
              </div>
              {/* 🔹 URL에 questionId를 넣지 않고, state로 데이터 전달 */}
              <Link
                to="/admin/question/detail"
                state={{ question }} // question 객체를 전달
                className="text-blue-500 ml-4 text-xs hover:underline"
              >
                상세보기
              </Link>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">아직 질문이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default AdminQuestionManagement;
