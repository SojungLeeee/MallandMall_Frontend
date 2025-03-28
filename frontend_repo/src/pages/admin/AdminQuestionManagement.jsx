import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import httpAdminquestion from "../../api/httpAdminquestions";

const AdminQuestionManagement = () => {
  const [questions, setQuestions] = useState([]);

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
                <div
                  className={`text-sm font-bold ${
                    question.answerStatus === "답변 완료"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {question.answerStatus}
                </div>
              </div>
              <Link
                to="/admin/question/detail"
                state={{ question }}
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
