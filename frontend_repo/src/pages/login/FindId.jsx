import React, { useState } from "react";
import axios from "axios"; // axios import
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate
import "./FindId.css"; // 스타일을 따로 관리할 경우 (선택 사항)

export default function FindId() {
  const [userName, setuserName] = useState(""); // 이름 상태
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
    <div className="find-id-container">
      <h2>아이디 찾기</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="userName">이름</label>
          <input
            type="text"
            id="userName"
            name="userName"
            placeholder="이름을 입력하세요"
            value={userName}
            onChange={(e) => setuserName(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit" className="btn">
          확인
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
