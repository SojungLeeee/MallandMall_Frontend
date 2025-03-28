import React from "react";
import { useNavigate } from "react-router-dom";

function NaverMapButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/map");
  };

  return (
    <button
      onClick={handleClick}
      className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-sm shadow-md transition duration-300 flex items-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
          clipRule="evenodd"
        />
      </svg>
      재고 조회
    </button>
  );
}

export default NaverMapButton;
