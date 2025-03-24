import { Link, useNavigate, useRouteLoaderData } from "react-router-dom";
import Button from "../button/Button";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { MdAdminPanelSettings } from "react-icons/md";
import Logo from "../../../assets/images/logo/Logo.png";

export default function Navbar() {
  // 기존 코드 유지
  const { token: routerToken } = useRouteLoaderData("root");
  const navigate = useNavigate();
  const [role, setRole] = useState();

  // localStorage에서도 토큰을 확인
  const [localToken, setLocalToken] = useState(localStorage.getItem("jwtAuthToken"));

  // 두 토큰 중 하나라도 있으면 인증된 것으로 간주
  const token = routerToken || localToken;

  // localStorage 변경 감지
  useEffect(() => {
    const checkLocalStorage = () => {
      const storedToken = localStorage.getItem("jwtAuthToken");
      setLocalToken(storedToken);
    };

    // 컴포넌트 마운트 시 확인
    checkLocalStorage();

    // localStorage 변경 이벤트 리스너 추가
    window.addEventListener("storage", checkLocalStorage);

    // 주기적으로 localStorage 확인 (이벤트가 누락될 경우를 대비)
    const interval = setInterval(checkLocalStorage, 1000);

    return () => {
      window.removeEventListener("storage", checkLocalStorage);
      clearInterval(interval);
    };
  }, []);

  // 기존 useEffect 수정 (routerToken 대신 통합된 token 사용)
  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setRole(decodedToken.role);
      } catch (error) {
        console.error("토큰 디코딩 실패:", error);
        setRole(null);
      }
    } else {
      setRole(null);
    }
  }, [token]); // routerToken 대신 token으로 의존성 변경

  // 나머지 코드는 그대로 유지
  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    const KAKAO_CLIENT_ID = "d91f0aee90225deaa8dd9ce8585b6033"; // 카카오 REST API 키

    const KAKAO_LOGOUT_URL = `https://kauth.kakao.com/oauth/logout?client_id=${KAKAO_CLIENT_ID}&logout_redirect_uri=http://localhost:3000`;

    localStorage.removeItem("jwtAuthToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");

    alert("로그아웃 되었습니다.");

    //  2. 카카오 강제 로그아웃 URL로 이동

    window.location.href = KAKAO_LOGOUT_URL;
  };

  return (
    <>
      <header className="flex justify-between p-2">
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="Emart Logo" className="h-13 w-20" />
        </Link>
        <nav className="flex items-center gap-3">
          {token && (
            <>
              {role === "ADMIN" && (
                <Link to="/admin" className="flex items-center text-black font-bold font-size hover:text-yellow-600">
                  <MdAdminPanelSettings className="text-4xl animate-pop-up" />
                </Link>
              )}
              <Button text={"Logout"} onClick={handleLogout} className="flex items-center" />
            </>
          )}
          {!token && (
            <>
              <Button text={"Login"} onClick={handleLogin} />
            </>
          )}
        </nav>
      </header>
    </>
  );
}
