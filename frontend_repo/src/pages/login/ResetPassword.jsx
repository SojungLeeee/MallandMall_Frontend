import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // axios import

export default function ResetPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: "",
    phone: "",
    newPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 확인 버튼 클릭 시 실행
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 입력값 확인
    if (!formData.userId || !formData.phone || !formData.newPassword) {
      alert("모든 필드를 입력해 주세요.");
      return;
    }

    try {
      const response = await axios.post("https://morek9.click/reset-password", {
        userId: formData.userId,
        phoneNumber: formData.phone,
        newPassword: formData.newPassword,
      });

      if (response.status === 200) {
        alert("비밀번호가 성공적으로 재설정되었습니다.");
        navigate("/"); // 홈 페이지로 이동
      } else {
        setErrorMessage("아이디와 전화번호가 일치하는 회원이 없습니다."); // 실패 시 메시지 설정
      }
    } catch (error) {
      console.error("API 요청 실패:", error);
      alert("아이디와 전화번호가 일치하는 회원이 없습니다.");
    }
  };

  return (
    <div className="flex justify-center items-center h-full bg-white p-5">
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">비밀번호 재설정</h2>

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
            
            textarea:-webkit-autofill,
            textarea:-webkit-autofill:hover,
            textarea:-webkit-autofill:focus,
            textarea:-webkit-autofill:active {
              -webkit-box-shadow: 0 0 0 30px white inset !important;
              -webkit-text-fill-color: black !important;
              transition: background-color 5000s ease-in-out 0s;
            }
          `}
        </style>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          {/* 아이디 입력란 */}
          <div>
            <input
              type="text"
              name="userId"
              placeholder="아이디"
              value={formData.userId}
              onChange={handleChange}
              required
              className="w-full p-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-gray-300"
              style={{
                WebkitAppearance: "none",
                backgroundColor: "white",
              }}
            />
          </div>

          {/* 전화번호 입력란 */}
          <div>
            <input
              type="text"
              name="phone"
              placeholder="전화번호"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-gray-300"
              style={{
                WebkitAppearance: "none",
                backgroundColor: "white",
              }}
            />
          </div>

          {/* 새로운 비밀번호 입력란 */}
          <div>
            <input
              type="password"
              name="newPassword"
              placeholder="새로운 비밀번호"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="w-full p-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-gray-300"
              style={{
                WebkitAppearance: "none",
                backgroundColor: "white",
              }}
            />
          </div>

          {/* 확인 버튼 */}
          <div>
            <button
              type="submit"
              className="w-full py-3 text-base bg-black text-white font-medium rounded-md
                         shadow-md hover:bg-gray-800 hover:translate-y-[-2px] transition-all
                         focus:outline-none focus:ring-0 duration-300 ease-in-out"
            >
              비밀번호 재설정
            </button>
          </div>
        </form>

        {/* 에러 메시지 */}
        {errorMessage && <p className="text-red-600 text-center mt-4">{errorMessage}</p>}
      </div>
    </div>
  );
}
