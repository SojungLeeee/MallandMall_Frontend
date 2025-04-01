import React from "react";
import CircularMenuItem from "./CircularMenuItem"; // 개별 원형 메뉴 아이템 컴포넌트 import

const ScrollableMenuContainer = ({ items = [], className = "" }) => {
  // 스크롤바를 숨기는 스타일
  const scrollContainerStyle = {
    scrollbarWidth: "none", // Firefox
    msOverflowStyle: "none", // IE and Edge
  };

  return (
    <div
      className={`w-full overflow-x-auto ${className}`}
      style={scrollContainerStyle}
    >
      <div className="flex py-2 px-4">
        {items.map((item, index) => (
          <CircularMenuItem
            key={index}
            title={item.title}
            icon={item.icon}
            bgColor={
              item.bgColor ||
              `bg-${
                ["indigo", "gray", "pink", "pink", "pink", "blue"][index % 6]
              }-${["400", "400", "400", "200", "500", "500"][index % 6]}`
            }
            textColor={item.textColor || "text-black"}
            onClick={item.onClick}
          />
        ))}
      </div>
    </div>
  );
};

export default ScrollableMenuContainer;
