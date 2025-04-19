import React from "react";

const KAKAO_CLIENT_ID = "d91f0aee90225deaa8dd9ce8585b6033";
const REDIRECT_URI = "https://moreandmall.click/auth/kakao/callback";

const KakaoLoginButton = () => {
  const handleLogin = () => {
    console.log(" 카카오 로그인 버튼 클릭됨");
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    console.log(" 카카오 로그인 이동 URL:", kakaoAuthUrl);

    window.location.href = kakaoAuthUrl;
  };

  return (
    <button
      onClick={handleLogin}
      className="w-12 h-12 rounded-full bg-yellow-300 flex items-center justify-center  cursor-pointer border-none focus:outline-none"
    >
      <div className="text-black text-2xl">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 3C6.48 3 2 6.48 2 11C2 14.24 4.94 17.13 8.56 18.35C8.36 19.33 7.5 21.73 7.5 22.31C7.5 22.43 7.57 22.51 7.69 22.51C7.75 22.51 7.81 22.49 7.86 22.44C8.5 21.88 11.13 18.73 11.74 17.95C11.83 17.95 11.91 17.95 12 17.95C17.52 17.95 22 14.47 22 10.05C22 5.63 17.52 3 12 3Z"
            fill="black"
          />
        </svg>
      </div>
    </button>
  );
};

export default KakaoLoginButton;
