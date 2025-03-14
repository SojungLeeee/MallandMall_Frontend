import React, { useState } from "react";
import axios from "axios"; // axios import
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate

export default function FindId() {
  const [userName, setUserName] = useState(""); // 이름 상태
  const [email, setEmail] = useState(""); // 이메일 상태
  const [message, setMessage] = useState(""); // 메시지 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작을 막음

    // 이름과 이메일이 비어 있으면 메시지 출력
    if (!userName || !email) {
      setMessage("이름과 이메일을 모두 입력해주세요.");
      return;
    }

    try {
      // API 호출 (아이디 찾기 요청)
      const response = await axios.post("http://localhost:8090/emart/findid", {
        userName,
        email,
      });
      console.log("응답 데이터:", response.data); // 응답 데이터 로그
      console.log(response.data.userId);

      // 아이디를 찾은 경우
      if (response.status === 200 && response.data) {
        setMessage(`찾은 아이디: ${response.data.userId}`); // 찾은 아이디 표시
      } else {
        setMessage("아이디를 찾을 수 없습니다.");
      }

      // 상태로 데이터를 전달하여 FoundId 페이지로 이동
      navigate("/foundid", {
        state: {
          userId: response.data.userId,
          createDate: response.data.createDate,
        },
      });
    } catch (error) {
      setMessage("서버 오류가 발생했습니다. 다시 시도해 주세요.");
      // 아이디 찾을 수 없으면 FoundId로 이동
      navigate("/foundid", { state: { userId: "notfound" } });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-white p-5">
      <h2 className="text-2xl font-bold mb-5">아이디 찾기</h2>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[#fff6e2] p-8 rounded-xl shadow-lg"
      >
        <div className="mb-4">
          <label
            htmlFor="userName"
            className="block text-lg font-semibold mb-2"
          >
            이름
          </label>
          <input
            type="text"
            id="userName"
            name="userName"
            placeholder="이름을 입력하세요"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-4 text-xl bg-[#eae1e1] border border-[#eae1e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-lg font-semibold mb-2">
            이메일
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 text-xl bg-[#eae1e1] border border-[#eae1e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 text-xl bg-[#f9e687] rounded-xl font-bold hover:bg-[#e2d267] focus:outline-none"
        >
          확인
        </button>
      </form>
      {message && (
        <p className="mt-4 text-lg text-center text-red-500">{message}</p>
      )}
    </div>
  );
}
