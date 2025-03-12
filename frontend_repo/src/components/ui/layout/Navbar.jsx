import { BsShop } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import CartStatus from "../cart/CartStatus";
import { BsFillPencilFill } from "react-icons/bs";
import User from "../member/User";
import Button from "../Button";
import { useAuthContext } from "../../../context/AuthContext";

export default function Navbar() {
  const { user, login, logout } = useAuthContext();
  const navigate = useNavigate(); // useNavigate 훅을 사용해 navigate 함수 가져오기

  // 로그인 버튼 클릭 시 로그인 페이지로 이동하도록 설정
  const handleLogin = () => {
    navigate("/login"); // 로그인 페이지로 이동
  };

  return (
    <>
      <header className="flex justify-between border-b border-gray-300 p-2">
        <Link to="/" className="flex items-center text-4xl text-brand">
          <BsShop />
          <h1>Emart</h1>
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/products">Products</Link>
          {/*user가 Admin일때 carts가 보이게*/}
          {user && user.role === "ADMIN" && (
            <Link to="/carts">
              <CartStatus />
            </Link>
          )}
          {/*user가 Admin일때 product/new가 보이게*/}
          {user && user.role === "ADMIN" && (
            <Link to="products/new" className="text-2xl">
              <BsFillPencilFill />
            </Link>
          )}
          {/*user 및 버튼이 보이면 렌더링되게 */}
          {user && <User user={user} />}
          {/* 로그인 버튼 클릭 시 로그인 화면으로 이동 */}
          {!user ? (
            <Button text={"Login"} onClick={handleLogin} />
          ) : (
            <Button text={"Logout"} onClick={logout} />
          )}
        </nav>
      </header>
    </>
  );
}
