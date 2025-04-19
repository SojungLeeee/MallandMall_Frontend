import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import httpAdminquestion from "../../api/httpAdminquestions";

const AdminQuestionManagement = () => {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await httpAdminquestion.get("/answers/all");
        const questionList = response.data;

        const updatedQuestions = await Promise.all(
          questionList.map(async (question) => {
            try {
              const answerResponse = await httpAdminquestion.get(
                `/answers/question/${question.questionId}`
              );
              const answers = answerResponse.data;

              const isAnswered = answers.some(
                (answer) => answer.status === "ACTIVE"
              );

              return {
                ...question,
                answerStatus: isAnswered ? "답변 완료" : "답변 대기 중",
              };
            } catch (error) {
              console.error(
                `❌ 질문 ${question.questionId}의 답변 조회 실패:`,
                error
              );
              return { ...question, answerStatus: "답변 대기 중" };
            }
          })
        );

        setQuestions(updatedQuestions);
      } catch (error) {
        console.error("❌ 질문 목록 불러오기 실패:", error);
      }
    };

    fetchQuestions();
  }, []);

  // 질문 클릭 시 상세보기 페이지로 이동
  const handleQuestionClick = (question) => {
    navigate("/admin/question/detail", { state: { question } });
  };

  return (
    <div className="container mx-auto px-4 py-6 bg-white">
      <div className="flex items-center mb-6">
        <h1 className="text-xl font-bold text-gray-900">[관리자] 질문 관리</h1>
      </div>

      <div className="mb-6">
        {questions.length > 0 ? (
          <div className="space-y-4">
            {questions.map((question) => (
              <div
                key={question.questionId}
                className="border border-gray-200 p-4 rounded-md shadow-sm hover:shadow-md cursor-pointer transition-shadow bg-white"
                onClick={() => handleQuestionClick(question)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="font-semibold text-left text-gray-900 mb-1">
                      {question.title}
                    </h2>
                    <div className="flex text-xs text-gray-500 space-x-4">
                      <p>작성자: {question.userId}</p>
                      <p>{question.createDate}</p>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      question.answerStatus === "답변 완료"
                        ? "bg-black text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {question.answerStatus}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-md border border-gray-200">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-500">아직 등록된 질문이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminQuestionManagement;
