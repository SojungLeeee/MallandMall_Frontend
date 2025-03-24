import React from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../../api/httpGoogleService";
import { setAuthToken } from "../../auth/tokenProviderService";

function GoogleLoginButton() {
  const navigate = useNavigate();

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

  return (
    <div className="flex justify-center w-full mb-4">
      <div className="w-[60%]">
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginError}
          useOneTap={false}
          shape="rectangular"
          text="continue_with"
          locale="ko"
          width="100%"
        />
      </div>
    </div>
  );
}

export default GoogleLoginButton;
