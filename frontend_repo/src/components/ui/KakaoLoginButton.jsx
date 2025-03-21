import React from "react";
import kakaoLoginImg from "../../assets/kakao_login_medium_wide.png"; // 이미지 파일 경로에 맞게 수정

const KAKAO_CLIENT_ID = "d91f0aee90225deaa8dd9ce8585b6033";

const REDIRECT_URI = "http://localhost:3000/auth/kakao/callback";

const KakaoLoginButton = () => {
  const handleLogin = () => {
    console.log(" 카카오 로그인 버튼 클릭됨");
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    console.log(" 카카오 로그인 이동 URL:", kakaoAuthUrl);

    window.location.href = kakaoAuthUrl;
  };

  return (
    <button onClick={handleLogin} style={buttonStyle}>
      <img src={kakaoLoginImg} alt="카카오 로그인" style={imgStyle} />
    </button>
  );
};

//  스타일 적용 (버튼 크기 확대)
const buttonStyle = {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

//  이미지 크기 조정 (가로 길이 확대, 세로 길이 약간 증가)
const imgStyle = {
  width: "230px", // 기존 183px → 230px (다른 버튼과 비슷한 너비로 확대)
  height: "52px", // 기존 45px → 52px (세로 길이 약간 증가)
};

export default KakaoLoginButton;
