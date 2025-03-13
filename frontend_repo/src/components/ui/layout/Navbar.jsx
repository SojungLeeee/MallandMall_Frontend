import { BsShop } from "react-icons/bs";
import { Link, useNavigate, useRouteLoaderData } from "react-router-dom";
import Button from "../Button";
import { VscAccount } from "react-icons/vsc";
import { BsCart2 } from "react-icons/bs";

export default function Navbar() {
  const { token, userid } = useRouteLoaderData("root");
  const navigate = useNavigate(); // useNavigate 훅을 사용해 navigate 함수 가져오기

  // 로그인 버튼 클릭 시 로그인 페이지로 이동하도록 설정
  const handleLogin = () => {
    navigate("/login"); // 로그인 페이지로 이동
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtAuthToken");
    localStorage.removeItem("userId");
    navigate("/"); // 로그인 페이지로 이동
  };

  return (
    <>
      <header className="flex justify-between  border-b border-gray-300 p-2">
        <Link to="/" className="flex items-center text-4xl text-brand">
          <BsShop />
          <h1>Emart</h1>
        </Link>
        <nav className="flex items-center gap-3 ">
          {token && (
            <>
              <div className="flex items-center gap-3"></div>
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
        </nav>
      </header>
    </>
  );
}
