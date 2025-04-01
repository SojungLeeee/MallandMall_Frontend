import React from "react";
import {
  Camera,
  PackageSearch,
  ShoppingBag,
  Gift,
  Award,
  Gamepad2,
  Tv,
} from "lucide-react";

export default function CircularMenuItem({
  title = "메뉴",
  icon = "package",
  bgColor = "bg-pink-400",
  textColor = "text-black",
  onClick = () => console.log(`Clicked on ${title}`),
}) {
  // 아이콘 매핑 함수
  const getIcon = (iconType) => {
    const size = 24;
    const color = "white";

    switch (iconType) {
      case "package":
        return <PackageSearch size={size} color={color} />;
      case "shopping":
        return <ShoppingBag size={size} color={color} />;
      case "gift":
        return <Gift size={size} color={color} />;
      case "game":
        return <Gamepad2 size={size} color={color} />;
      case "award":
        return <Award size={size} color={color} />;
      case "tv":
        return <Tv size={size} color={color} />;
      default:
        return <Camera size={size} color={color} />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center ml-1 mt-3 px-1 py-2 flex-shrink-0">
      {/* 원형 아이콘 */}
      <div
        className={`${bgColor} rounded-full w-12 h-12 flex items-center justify-center mb-2 shadow-sm cursor-pointer`}
        onClick={onClick}
      >
        <div className="text-white">{getIcon(icon)}</div>
      </div>

      {/* 텍스트 라벨 */}
      <span
        className={`text-xs font-medium ${textColor} text-center w-14 truncate`}
      >
        {title}
      </span>
    </div>
  );
}
