import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // axios import

export default function ResetPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userid: "",
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
    if (!formData.userid || !formData.phone || !formData.newPassword) {
      alert("모든 필드를 입력해 주세요.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8090/emart/reset-password",
        {
          userid: formData.userid,
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
    <div
      style={{
        textAlign: "center",
        padding: "50px",
        height: "100vh",
        backgroundColor: "white",
      }}
    >
      <h2>비밀번호 재설정</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            name="userid"
            placeholder="아이디"
            value={formData.userid}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            name="phone"
            placeholder="전화번호"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="password"
            name="newPassword"
            placeholder="새로운 비밀번호"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">확인</button>
      </form>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}{" "}
      {/* 에러 메시지 표시 */}
    </div>
  );
}
