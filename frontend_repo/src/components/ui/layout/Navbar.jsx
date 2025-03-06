import { Link } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";
import { BsFillPencilFill } from "react-icons/bs";
import User from "../member/User";
import Button from "./ui/Button";
import { useAuthContext } from "../context/AuthContext";
import CartStatus from "../cart/CartStatus";

export default function Navbar() {
  const { user, login, logout } = useAuthContext();
  //구조 분해 할당을 통해서 3가지 요소를 커스텀 훅인 useAuthContext를 통해서 가져온다
  return (
    <header className="flex justify-between border-b border-gray-300 p-2">
      <Link to="/" className="flex items-center text-4xl text-brand">
        <FiShoppingBag />
        <h1>Shoppy</h1>
      </Link>
      <nav className="flex items-center gap-4">
        <Link to="/products">Products</Link>
        {user && user.isAdmin && (
          <Link to="/carts">
            <CartStatus />
          </Link>
        )}
        {user && user.isAdmin && (
          <Link to="products/new" className="text-2xl">
            <BsFillPencilFill />
          </Link>
        )}
        {user && <User user={user} />}
        {!user && <Button text={"Login"} onClick={login} />}
        {user && <Button text={"Logout"} onClick={logout} />}
      </nav>
    </header>
  );
}
