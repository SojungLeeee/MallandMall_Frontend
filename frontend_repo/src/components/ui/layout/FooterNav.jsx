import React from "react";
import { CiMenuBurger, CiStar } from "react-icons/ci";
import { SlHome } from "react-icons/sl";
import { VscAccount } from "react-icons/vsc";
import { BsCart } from "react-icons/bs";
import { Link } from "react-router-dom";

// CSS 애니메이션 정의
const styles = `
  @keyframes text-pop-up-top {
    0% {
      transform: translateY(0);
      transform-origin: 50% 50%;
      text-shadow: none;
    }
    100% {
      transform: translateY(-33px); /* 50px에서 33px로 줄임 */
      transform-origin: 50% 50%;
      text-shadow: 0 1px 0 #cccccc, 0 2px 0 #cccccc, 0 3px 0 #cccccc, 0 4px 0 #cccccc, 0 5px 0 #cccccc, 0 6px 0 #cccccc, 0 7px 0 #cccccc, 0 8px 0 #cccccc, 0 9px 0 #cccccc, 0 50px 30px rgba(0, 0, 0, 0.3);
    }
  }

  .hover-pop-up {
    transition: transform 0.5s ease-out, text-shadow 0.5s ease-out;
  }

  .hover-pop-up:hover {
    animation: text-pop-up-top 0.5s ease-out forwards;
  }
`;

const FooterNav = () => {
  return (
    <footer
      className="bg-white text-gray-500 py-4 px-4 mt-4 rounded-3xl"
      style={{
        boxShadow:
          "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      }}
    >
      <style>{styles}</style> {/* CSS 애니메이션을 컴포넌트에 추가 */}
      <nav className="container mx-auto">
        <ul className="flex flex-wrap items-center justify-between space-y-4 sm:space-y-0 sm:flex-nowrap">
          <li className="flex flex-col items-center w-1/5 sm:w-auto">
            <Link
              to="/categoryList"
              className="flex flex-col items-center hover:text-[#F9E79F] transition duration-300"
            >
              <CiMenuBurger className="text-3xl mb-1" />
              <span className="text-xs font-medium">메뉴</span>
            </Link>
          </li>
          <li className="flex flex-col items-center w-1/5 sm:w-auto">
            <Link
              to="/"
              className="flex flex-col items-center hover:text-[#cece92] transition duration-300"
            >
              <SlHome className="text-3xl mb-1" />
              <span className="text-xs font-medium">홈</span>
            </Link>
          </li>

          <li className="flex flex-col items-center w-1/5 sm:w-auto relative">
            <Link
              to="/favorites"
              className="w-12 h-12 bg-[#403c23] text-white rounded-full flex items-center justify-center shadow-md shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] mb-1 hover-pop-up"
            >
              <CiStar className="text-3xl" />
            </Link>
          </li>

          <li className="flex flex-col items-center w-1/5 sm:w-auto">
            <Link
              to="/mypage"
              className="flex flex-col items-center hover:text-[#F9E79F] transition duration-300"
            >
              <VscAccount className="text-3xl mb-1" />
              <span className="text-xs font-medium">MY</span>
            </Link>
          </li>
          <li className="flex flex-col items-center w-1/5 sm:w-auto">
            <Link
              to="/carts"
              className="flex flex-col items-center hover:text-[#F9E79F] transition duration-300"
            >
              <BsCart className="text-3xl mb-1" />
              <span className="text-xs font-medium">장바구니</span>
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default FooterNav;
