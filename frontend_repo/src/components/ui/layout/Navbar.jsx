import { BsShop } from "react-icons/bs";
import { Link } from "react-router-dom";
import CartStatus from "../cart/CartStatus";
import { BsFillPencilFill } from "react-icons/bs";
import User from "../member/User";
import Button from "../Button";
import { useAuthContext } from "../../../context/AuthContext";

export default function Navbar() {
  const { user, login, logout } = useAuthContext();
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
          {user && user.isAdmin && (
            <Link to="/carts">
              <CartStatus />
            </Link>
          )}

          {/*user가 Admin일때 product/new가 보이게*/}
          {user && user.isAdmin && (
            <Link to="products/new" className="text-2xl">
              <BsFillPencilFill />
            </Link>
          )}

          {/*user 및 버튼이 보이면 렌더링되게 */}
          {user && <User user={user} />}
          {!user && <Button text={"Login"} onClick={login} />}
          {user && <Button text={"Logout"} onClick={logout} />}
        </nav>
      </header>
    </>
  );
}
