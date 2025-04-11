import React from "react";
import { useNavigate } from "react-router-dom";
import { getNaverLoginUrl } from "../../../api/httpNaverService";

function NaverLoginButton() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log("네이버 로그인 버튼 클릭됨!");

    try {
      const loginUrl = await getNaverLoginUrl();

      if (loginUrl) {
        window.location.href = loginUrl;
      } else {
        console.error("네이버 로그인 URL이 비어 있음.");
        navigate("/login");
      }
    } catch (error) {
      console.error("네이버 로그인 URL 가져오기 실패:", error);
      navigate("/login");
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="flex items-center justify-center w-12 h-12 rounded-full bg-[#03C75A] text-white font-semibold hover:opacity-90 transition-opacity"
      aria-label="네이버 로그인"
    >
      N
    </button>
  );
}

export default NaverLoginButton;
