import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../../../api/httpGoogleService";
import { setAuthToken } from "../../../auth/tokenProviderService";

function GoogleLoginButton() {
  const navigate = useNavigate();
  const googleButtonRef = useRef(null);

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      console.log(
        "Google 로그인 성공, 토큰:",
        credentialResponse.credential.substring(0, 20) + "..."
      );

      // 구글 로그인 API 호출
      const data = await googleLogin(credentialResponse.credential);
      console.log("백엔드 응답:", data);

      // 토큰 저장
      setAuthToken({
        token: data.token,
        userId: data.userId,
        role: data.role,
      });

      // 홈페이지로 이동
      navigate("/");
    } catch (error) {
      console.error("Google 로그인 오류:", error);
      alert("Google 로그인에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  const handleGoogleLoginError = (error) => {
    console.error("Google 로그인 실패:", error);
  };

  // 커스텀 버튼 클릭 시 실제 Google 버튼 클릭
  const handleCustomButtonClick = () => {
    if (googleButtonRef.current) {
      // 숨겨진 GoogleLogin 버튼의 첫 번째 자식 요소 클릭
      const googleButton =
        googleButtonRef.current.querySelector("div[role='button']");
      if (googleButton) {
        googleButton.click();
      }
    }
  };

  return (
    <div className="relative">
      {/* 숨겨진 GoogleLogin 컴포넌트 */}
      <div
        className="absolute opacity-0 pointer-events-none"
        ref={googleButtonRef}
      >
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginError}
          useOneTap={false}
          type="icon"
          shape="circle"
          width="48px"
        />
      </div>

      {/* 커스텀 디자인 버튼 */}
      <button
        onClick={handleCustomButtonClick}
        className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-gray-200 cursor-pointer focus:outline-none  mx-auto"
      >
        <div>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z"
              fill="#4285F4"
            />
            <path
              d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.57C14.73 18.22 13.48 18.58 12 18.58C9.11 18.58 6.66 16.67 5.77 14.07H2.09V16.94C3.9 20.57 7.67 23 12 23Z"
              fill="#34A853"
            />
            <path
              d="M5.77 14.07C5.54 13.42 5.42 12.73 5.42 12C5.42 11.27 5.54 10.58 5.77 9.93V7.06H2.09C1.4 8.59 1 10.25 1 12C1 13.75 1.4 15.41 2.09 16.94L5.77 14.07Z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.42C13.62 5.42 15.06 5.98 16.21 7.08L19.36 3.93C17.45 2.14 14.97 1 12 1C7.67 1 3.9 3.43 2.09 7.06L5.77 9.93C6.66 7.33 9.11 5.42 12 5.42Z"
              fill="#EA4335"
            />
          </svg>
        </div>
      </button>
    </div>
  );
}

export default GoogleLoginButton;
