import React, { useState } from "react";
import axios from "axios";

const AnswerForm = ({ questionId, onAnswerAdded }) => {
  const [answer, setAnswer] = useState("");
  const token = localStorage.getItem("jwtAuthToken");

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`https://morek9.click/answers/add/${questionId}`, answer, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      alert(response.data); // 답변이 등록되었음을 알리는 메시지
      onAnswerAdded(); // 답변이 추가되었을 때 부모 컴포넌트에게 알리기
      setAnswer(""); // 입력란 초기화
    } catch (error) {
      console.error("❌ 답변 추가 실패:", error);
      alert("답변 추가 실패");
    }
  };

  return (
    <div>
      <h2 className="text-xl">답변 작성</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleAnswerChange}
          placeholder="답변을 작성하세요"
          required
          className="border p-2 w-full"
        ></textarea>
        <button type="submit" className="bg-blue-500 text-white p-2 mt-2">
          답변 추가
        </button>
      </form>
    </div>
  );
};

export default AnswerForm;
