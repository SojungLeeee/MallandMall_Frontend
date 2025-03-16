import { Link, useNavigate, useRouteLoaderData } from "react-router-dom";
import Button from "../Button";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { MdAdminPanelSettings } from "react-icons/md";

export default function Navbar() {
  const { token } = useRouteLoaderData("root");
  const navigate = useNavigate(); // useNavigate 훅을 사용해 navigate 함수 가져오기
  const [role, setRole] = useState();

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
      setRole();
    }
  }, [token]);

  // 로그인 버튼 클릭 시 로그인 페이지로 이동하도록 설정
  const handleLogin = () => {
    navigate("/login"); // 로그인 페이지로 이동
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtAuthToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    alert("로그아웃 되었습니다.");
    navigate("/"); // 로그인 페이지로 이동
  };

  return (
    <>
      <header className="flex justify-between  p-2">
        <Link to="/" className="flex items-center">
          <img src="/images/Logo.png" alt="Emart Logo" className="h-13 w-20" />
        </Link>
        <nav className="flex items-center gap-3 ">
          {token && (
            <>
              {/* 관리자 메뉴 표시 */}
              {role === "ADMIN" && (
                <Link
                  to="/admin"
                  className="flex items-center text-black font-bold font-size hover:text-yellow-600"
                >
                  <MdAdminPanelSettings className="text-4xl animate-pop-up" />
                </Link>
              )}
              <Button
                text={"Logout"}
                onClick={handleLogout}
                className="flex items-center"
              />
            </>
          )}
          {!token && (
            <>
              <Button text={"Login"} onClick={handleLogin} />
            </>
          )}
          {}
        </nav>
      </header>
    </>
  );
}
