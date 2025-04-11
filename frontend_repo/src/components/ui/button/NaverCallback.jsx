// 콜백 페이지 개선 예시
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function NaverCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("jwtAuthToken", token); // ✅ 저장
      navigate("/emart"); // ✅ 그리고 메인으로 이동
    } else {
      navigate("");
    }
  }, []);

  return <div>로그인 처리 중...</div>;
}

export default NaverCallbackPage;
