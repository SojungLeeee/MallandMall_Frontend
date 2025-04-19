import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
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

  const navigate = useNavigate();

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
    navigate(-1);
  };

  if (loading) return <div className="text-center py-4">로딩 중...</div>;
  if (!question)
    return (
      <div className="text-center text-red-500 py-4">잘못된 접근입니다.</div>
    );

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 bg-white rounded-lg shadow-md h-full">
      <div className="flex items-center mb-4">
        <ChevronLeft
          onClick={handleBack}
          className="cursor-pointer text-black hover:bg-gray-100 rounded-full p-1"
          size={24}
        />
        <h1 className="text-gray-900 text-center text-xl font-bold flex-grow mr-8">
          📌 질문 상세
        </h1>
      </div>

      <hr className="border-gray-200" />

      <div className="border-b border-gray-200 pb-4 pt-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {question.title}
        </h2>
        <p className="text-xs text-gray-500 text-right">
          작성자: {question.userId}
        </p>
        <p className="text-xs text-gray-500 text-right">
          {question.createDate}
        </p>
        <p className="mt-3 text-sm text-gray-700">{question.content}</p>
      </div>

      {/* 🔹 답변 입력 폼 */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-900">
          ✏️ 관리자 답변
        </h2>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
          rows="4"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="답변을 입력하세요..."
        />
        <button
          onClick={isEditing ? handleUpdateAnswer : handleAddAnswer}
          className="mt-3 px-5 py-2 bg-black text-white rounded-md w-full hover:bg-gray-900 transition-colors"
        >
          {isEditing ? "답변 수정" : "답변 등록"}
        </button>
        {message && (
          <p className="mt-3 text-sm font-semibold text-red-500">{message}</p>
        )}
      </div>

      {/* 🔹 기존 답변 목록 */}
      {responses.length > 0 ? (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            💬 등록된 답변
          </h3>
          <div className="overflow-hidden border border-gray-200 rounded-md shadow-sm">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 border-b border-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    답변 내용
                  </th>
                  <th className="py-3 px-4 border-b border-gray-200 text-center text-xs font-medium text-gray-700 uppercase tracking-wider w-20">
                    수정
                  </th>
                  <th className="py-3 px-4 border-b border-gray-200 text-center text-xs font-medium text-gray-700 uppercase tracking-wider w-20">
                    삭제
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {responses.map((response) => (
                  <tr key={response.answerId} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-800">
                      {response.content}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setAnswer(response.content);
                          setEditingAnswerId(response.answerId);
                        }}
                        className="text-black hover:underline text-xs font-medium"
                      >
                        수정
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleDeleteAnswer(response.answerId)}
                        className="text-red-600 hover:underline text-xs font-medium"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="mt-8 py-6 text-sm text-gray-500 text-center bg-gray-50 rounded-md">
          📝 아직 등록된 답변이 없습니다.
        </div>
      )}
    </div>
  );
};

export default AdminQuestionDetail;
