import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function FindId() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userName || !email) {
      setMessage("이름과 이메일을 모두 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post("https://morek9.click/findid", {
        userName,
        email,
      });
      console.log("응답 데이터:", response.data);
      console.log(response.data.userId);

      if (response.status === 200 && response.data) {
        setMessage(`찾은 아이디: ${response.data.userId}`);
      } else {
        setMessage("아이디를 찾을 수 없습니다.");
      }

      navigate("/foundid", {
        state: {
          userId: response.data.userId,
          createDate: response.data.createDate,
        },
      });
    } catch (error) {
      setMessage("서버 오류가 발생했습니다. 다시 시도해 주세요.");
      navigate("/foundid", { state: { userId: "notfound" } });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-white p-5">
      <h2 className="text-2xl font-bold mb-6 text-black">아이디 찾기</h2>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-gray-200"
      >
        {/* 이름 입력 (라벨 상단 좌측) */}
        <div className="mb-5">
          <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2 text-left">
            이름
          </label>
          <input
            type="text"
            id="userName"
            name="userName"
            placeholder="이름을 입력하세요"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-3 text-base bg-white border border-gray-300 rounded-md text-black placeholder-gray-500
                       focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            style={{
              WebkitAppearance: "none",
              backgroundColor: "white",
            }}
          />
        </div>

        {/* 이메일 입력 (라벨 상단 좌측) */}
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 text-left">
            이메일
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 text-base bg-white border border-gray-300 rounded-md text-black placeholder-gray-500
                       focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            style={{
              WebkitAppearance: "none",
              backgroundColor: "white",
            }}
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 text-base bg-black text-white rounded-md font-medium 
                    shadow-md hover:bg-gray-800 hover:translate-y-[-2px] transition-all duration-300 ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
        >
          확인
        </button>
      </form>

      {message && <p className="mt-4 text-sm text-center text-red-500">{message}</p>}

      {/* 자동완성 배경색 제거를 위한 스타일 */}
      <style>
        {`
          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus,
          input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 30px white inset !important;
            -webkit-text-fill-color: black !important;
            transition: background-color 5000s ease-in-out 0s;
          }
        `}
      </style>
    </div>
  );
}
