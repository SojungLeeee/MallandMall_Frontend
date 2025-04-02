import React from "react";
import { LuPackageSearch } from "react-icons/lu";

export default function SemiWideComponent({
  noMargin = false,
  title = "재고찾기",
  subtitle = "내 근처의 매장 찾기",
  onClick,
}) {
  // 재사용 가능한 박스 컴포넌트 정의
  const ProductBox = ({
    title = "",
    subtitle = "",
    boxColor = "bg-white",
    textColor = "text-gray-900",
    subtitleColor = "text-gray-500",
    className = "",
    onClick,
  }) => {
    return (
      <div
        className={`${boxColor} mt-4 -ml-2 rounded-sm shadow-sm p-3 flex flex-col justify-center items-center ${className} ${
          onClick ? "cursor-pointer" : ""
        } border border-gray-300`}
        onClick={onClick}
        style={{
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          width: "172px",
        }}
      >
        {/* 아이콘 추가 */}
        <LuPackageSearch className="text-black-500 text-4xl mb-2" />
        <div className="flex flex-col gap-1 text-center">
          <h1 className={`text-sm font-bold ${textColor}`}>{title}</h1>
          <p className={`text-xs ${subtitleColor}`}>{subtitle}</p>
        </div>
      </div>
    );
  };

  // 여기에 return 문이 없었습니다! 추가합니다.
  return (
    <div className={`w-full ${noMargin ? "px-0" : "px-2"}`}>
      <ProductBox title={title} subtitle={subtitle} onClick={onClick} />
    </div>
  );
}
