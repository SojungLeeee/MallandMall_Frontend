import React, { useRef } from "react";
import {
  RiMenuLine,
  RiStarLine,
  RiHome2Line,
  RiUser3Line,
  RiShoppingCartLine,
} from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";

const styles = `
  @keyframes text-pop-up-top {
    0% {
      transform: translateY(0);
      transform-origin: 50% 50%;
      text-shadow: none;
    }
    100% {
      transform: translateY(-22px);
      transform-origin: 50% 50%;
      text-shadow: 0 1px 0 #cccccc, 0 2px 0 #cccccc, 0 3px 0 #cccccc, 0 4px 0 #cccccc, 0 5px 0 #cccccc, 0 6px 0 #cccccc, 0 30px 20px rgba(0, 0, 0, 0.2);
    }
  }

  .hover-pop-up {
    animation: text-pop-up-top 0.5s ease-out 1 forwards;
    animation-play-state: running;
  }

  .hover-pop-up-paused {
    animation-play-state: paused;
  }
`;

const FooterNav = () => {
  const starRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtAuthToken"); // Check if token exists in localStorage

  const handleMouseEnter = () => {
    if (starRef.current) {
      // Animation logic for star icon
      starRef.current.classList.add("hover-pop-up");
      starRef.current.classList.remove("hover-pop-up-paused");
    }
  };

  const handleMouseLeave = () => {
    if (starRef.current) {
      // Animation logic when mouse leaves star icon
      starRef.current.classList.add("hover-pop-up-paused");
    }
  };

  return (
    <footer
      className="bg-white text-gray-500 px-1.5 ml-1 h rounded-sm"
      style={{
        boxShadow:
          "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      }}
    >
      <style>{styles}</style> {/* CSS 애니메이션을 컴포넌트에 추가 */}
      <nav className="container mx-auto">
        <ul className="flex flex-wrap items-center justify-between space-y-4 sm:space-y-0 sm:flex-nowrap">
          <li className="flex flex-col items-center w-/5 sm:w-auto">
            <Link
              to="/categoryList"
              className="flex flex-col items-center text-black hover:text-[#F9E79F] transition duration-300"
            >
              <RiMenuLine className="text-2xl mb-1" />
              <span className="text-xs font-medium">카테고리</span>
            </Link>
          </li>
          <li className="flex flex-col items-center w-1/5 sm:w-auto">
            <Link
              to="/"
              className="flex flex-col items-center text-black hover:text-[#cece92] transition duration-300"
            >
              <RiHome2Line className="text-2xl mb-1" />
              <span className="text-xs font-medium">홈</span>
            </Link>
          </li>

          <li className="flex flex-col items-center w-1/5 sm:w-auto relative">
            <Link
              to={token ? "/favorites" : "/login"} // token 확인 후 favorites 또는 login으로 이동
              className="w-12 h-12 bg-[#403c23] text-white rounded-full flex items-center justify-center shadow-md shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] mb-1"
              ref={starRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <RiStarLine className="text-2xl" />
            </Link>
          </li>

          <li className="flex flex-col items-center w-1/5 sm:w-auto">
            {token ? (
              <Link
                to="/mypage"
                className="flex flex-col items-center text-black hover:text-[#F9E79F] transition duration-300"
              >
                <RiUser3Line className="text-2xl mb-1" />
                <span className="text-xs font-medium">MY</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex flex-col items-center text-black hover:text-[#F9E79F] transition duration-300"
              >
                <RiUser3Line className="text-2xl mb-1" />
                <span className="text-xs font-medium">내정보</span>
              </Link>
            )}
          </li>

          <li className="flex flex-col items-center w-1/5 sm:w-auto">
            {token ? (
              <Link
                to="/carts"
                className="flex flex-col items-center text-black hover:text-[#F9E79F] transition duration-300"
              >
                <RiShoppingCartLine className="text-2xl mb-1" />
                <span className="text-xs font-medium">장바구니</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex flex-col items-center text-black hover:text-[#F9E79F] transition duration-300"
              >
                <RiShoppingCartLine className="text-2xl mb-1" />
                <span className="text-xs font-medium">장바구니</span>
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default FooterNav;
