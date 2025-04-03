import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ChevronLeft } from "lucide-react"; // X 아이콘 추가
import {
  addAdminAnswer,
  updateAdminAnswer,
  deleteAdminAnswer,
  getQuestionDetail,
} from "../../api/httpQuestion";

const AdminQuestionDetail = () => {
  const location = useLocation();
  const question = location.state?.question;
  const token = localStorage.getItem("jwtAuthToken");
  const [answer, setAnswer] = useState("");
  const [responses, setResponses] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAnswerId, setEditingAnswerId] = useState(null);

  const navigate = useNavigate(); // useNavigate 훅 추가

  // 질문에 대한 답변 불러오기
  const fetchAnswersByQuestion = useCallback(async () => {
    if (!question?.questionId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getQuestionDetail(question.questionId, token);
      setResponses(data || []);
    } catch (error) {
      console.error("답변 조회 오류", error);
      setMessage("❌ 답변 조회에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [question?.questionId, token]);

  useEffect(() => {
    fetchAnswersByQuestion();
  }, [fetchAnswersByQuestion]);

  // 🔹 답변 추가
  const handleAddAnswer = async () => {
    if (!answer.trim()) {
      setMessage("❌ 답변을 입력해주세요.");
      return;
    }
    try {
      await addAdminAnswer(question.questionId, answer, token);
      setMessage("✅ 답변 등록 완료");
      setAnswer("");
      await fetchAnswersByQuestion();
    } catch (error) {
      setMessage("❌ 답변 등록 실패");
    }
  };

  // 🔹 답변 수정
  const handleUpdateAnswer = async () => {
    if (!answer.trim()) {
      setMessage("❌ 답변을 입력해주세요.");
      return;
    }
    try {
      await updateAdminAnswer(editingAnswerId, answer, token);
      setMessage("✅ 답변 수정 완료");
      setIsEditing(false);
      setAnswer("");
      setEditingAnswerId(null);
      await fetchAnswersByQuestion();
    } catch (error) {
      setMessage("❌ 답변 수정 실패");
    }
  };

  // 🔹 답변 삭제
  const handleDeleteAnswer = async (answerId) => {
    if (!answerId) {
      setMessage("❌ 삭제할 답변이 없습니다.");
      return;
    }
    try {
      await deleteAdminAnswer(answerId, token);
      setMessage("✅ 답변 삭제 완료");
      await fetchAnswersByQuestion();
    } catch (error) {
      setMessage("❌ 답변 삭제 실패");
      console.error("❌ 삭제 오류:", error);
    }
  };

  const handleBack = () => {
    navigate(-1); // 이전 페이지로 돌아가기
  };

  if (loading) return <div className="text-center py-4">로딩 중...</div>;
  if (!question)
    return (
      <div className="text-center text-red-500 py-4">잘못된 접근입니다.</div>
    );

  return (
    <div className="container mx-auto p-6 bg-gray-50 h-full">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center mb-3">
          <ChevronLeft onClick={handleBack} className="cursor-pointer" />
          <h1 className="text-xl font-bold text-gray-800 flex-grow text-center mr-8">
            📌 질문 상세
          </h1>
        </div>

        <hr></hr>
        <div className="border-b pb-4 pt-4">
          <h2 className="text-lg font-semibold">{question.title}</h2>
          <p className="text-xs text-gray-500 text-right">
            작성자: {question.userId}
          </p>
          <p className="text-xs text-gray-500 text-right">
            {question.createDate}
          </p>
          <p className="mt-3 text-sm text-gray-600">{question.content}</p>
        </div>

        {/* 🔹 답변 입력 폼 */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">✏️ 관리자 답변</h2>
          <textarea
            className="w-full p-3 border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows="4"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="답변을 입력하세요..."
          />
          <button
            onClick={isEditing ? handleUpdateAnswer : handleAddAnswer}
            className="mt-3 px-5 py-2 bg-[#787669] text-white rounded-sm w-full"
          >
            {isEditing ? "답변 수정" : "답변 등록"}
          </button>
          {message && (
            <p className="mt-3 text-sm font-semibold text-red-500">{message}</p>
          )}
        </div>

        {/* 🔹 기존 답변 목록 */}
        {responses.length > 0 ? (
          <div className="mt-6">
            <h3 className="text-lg font-semibold">💬 등록된 답변</h3>
            <table className="min-w-full mt-3 bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-2 border-b text-left">답변 내용</th>
                  <th className="py-2 px-2 border-b text-center">수정</th>
                  <th className="py-2 px-2 border-b text-center">삭제</th>
                </tr>
              </thead>
              <tbody>
                {responses.map((response) => (
                  <tr key={response.answerId} className="hover:bg-gray-50">
                    <td className="py-2 px-2 border-b text-xs">
                      {response.content}
                    </td>
                    <td className="py-2 px-2 border-b text-center text-xs">
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setAnswer(response.content);
                          setEditingAnswerId(response.answerId);
                        }}
                        className="text-blue-500 hover:underline"
                      >
                        수정
                      </button>
                    </td>
                    <td className="py-2 px-2 border-b text-cente  text-xs">
                      <button
                        onClick={() => handleDeleteAnswer(response.answerId)}
                        className="text-red-500 hover:underline"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6 text-sm text-gray-500 text-center">
            📝 아직 등록된 답변이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminQuestionDetail;
