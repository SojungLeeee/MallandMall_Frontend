import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { kakaoLogin } from "../../api/httpAuthService";

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (!code) {
      console.error(" 인가 코드가 존재하지 않음!");
      return; // 인가 코드가 없으면 실행 중지
    }

    console.log("🔹 카카오 인가 코드:", code);

    kakaoLogin(code)
      .then((response) => {
        if (response && response.token) {
          localStorage.setItem("jwtAuthToken", response.token);
          localStorage.setItem("userId", response.userId); //  userId 저장
          localStorage.setItem("role", response.role); //  role 저장
          sessionStorage.setItem("kakao_login_success", "true"); // 중복 요청 방지

          //  로그인 성공 후 홈으로 이동
          setTimeout(() => navigate("/"), 1000);
        } else {
          console.error(" 로그인 실패! 응답:", response);
        }
      })
      .catch((error) => {
        console.error(" 카카오 로그인 요청 실패:", error);
      });
  }, [navigate]);

  return <div>카카오 로그인 중...</div>;
};

export default KakaoCallback;
