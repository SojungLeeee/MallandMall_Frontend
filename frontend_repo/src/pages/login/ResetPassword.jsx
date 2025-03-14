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
      const response = await axios.post(
        "http://localhost:8090/emart/reset-password",
        {
          userId: formData.userId,
          phoneNumber: formData.phone,
          newPassword: formData.newPassword,
        }
      );

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
      <div className="bg-[#fff6e2] p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">비밀번호 재설정</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 아이디 입력란 */}
          <div>
            <input
              type="text"
              name="userId"
              placeholder="아이디"
              value={formData.userId}
              onChange={handleChange}
              required
              className="w-full p-3 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
              className="w-full p-3 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
              className="w-full p-3 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* 확인 버튼 */}
          <div>
            <button
              type="submit"
              className="w-full py-3 text-xl bg-[#f9e687] text-black font-bold rounded-2xl focus:outline-none hover:bg-[#e2d267]"
            >
              비밀번호 재설정
            </button>
          </div>
        </form>

        {/* 에러 메시지 */}
        {errorMessage && (
          <p className="text-red-600 text-center mt-4">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}
