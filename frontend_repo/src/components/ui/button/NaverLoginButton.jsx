import React from "react";
import { useNavigate } from "react-router-dom";
import { getNaverLoginUrl } from "../../../api/httpNaverService";
import npayLogo from "../../../assets/images/logo/npayLogo.png";

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
      className="flex items-center justify-center w-12 h-12 rounded-full hover:opacity-90 transition-opacity"
      aria-label="네이버페이 로그인"
    >
      <img
        src={npayLogo}
        alt="네이버페이"
        className="w-full h-full rounded-full"
      />
    </button>
  );
}

export default NaverLoginButton;
