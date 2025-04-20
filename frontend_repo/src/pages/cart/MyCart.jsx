import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchCartItems,
  removeCartItem,
  updateCartQuantity,
} from "../../api/httpMemberService";
import { motion, AnimatePresence } from "framer-motion";

const MyCart = () => {
  const [items, setItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [isHovering, setIsHovering] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtAuthToken");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchCartItems(token)
      .then((data) => {
        if (!Array.isArray(data)) return;
        setItems(data);

        // Initialize selected items
        const initialSelectedItems = data.reduce((acc, item) => {
          acc[item.productCode] = true;
          return acc;
        }, {});
        setSelectedItems(initialSelectedItems);
        setIsAllSelected(true);
      })
      .catch(() => {});
  }, [token, navigate]);

  const handleRemoveItem = async (productCode) => {
    if (!token) return;
    try {
      await removeCartItem(productCode, token);
      setItems((prevItems) =>
        prevItems.filter((item) => item.productCode !== productCode)
      );

      // Remove from selected items
      const newSelectedItems = { ...selectedItems };
      delete newSelectedItems[productCode];
      setSelectedItems(newSelectedItems);

      // Check if all items are selected
      setIsAllSelected(
        Object.keys(newSelectedItems).length === items.length - 1
      );
    } catch (error) {}
  };

  const handleQuantityChange = async (productCode, newQuantity) => {
    if (!token || isNaN(newQuantity) || newQuantity < 1 || isUpdating) return;

    setIsUpdating(true);

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productCode === productCode
          ? { ...item, quantity: newQuantity }
          : item
      )
    );

    try {
      const updatedItem = await updateCartQuantity(
        productCode,
        newQuantity,
        token
      );
      if (!updatedItem || typeof updatedItem.quantity !== "number") return;

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.productCode === productCode
            ? { ...item, quantity: updatedItem.quantity }
            : item
        )
      );
    } catch (error) {
    } finally {
      setIsUpdating(false);
    }
  };

  const handleItemSelect = (productCode) => {
    const newSelectedItems = {
      ...selectedItems,
      [productCode]: !selectedItems[productCode],
    };
    setSelectedItems(newSelectedItems);

    // Check if all items are selected
    setIsAllSelected(
      Object.keys(newSelectedItems).length === items.length &&
        Object.values(newSelectedItems).every((value) => value)
    );
  };

  const handleSelectAll = () => {
    const newIsAllSelected = !isAllSelected;
    setIsAllSelected(newIsAllSelected);

    const newSelectedItems = items.reduce((acc, item) => {
      acc[item.productCode] = newIsAllSelected;
      return acc;
    }, {});
    setSelectedItems(newSelectedItems);
  };

  const handleCheckout = () => {
    // Get selected items
    const selectedCartItems = items.filter(
      (item) => selectedItems[item.productCode]
    );

    if (selectedCartItems.length === 0) {
      alert("선택된 상품이 없습니다.");
      return;
    }
    localStorage.removeItem("productInfo");

    // Save selected items to localStorage
    localStorage.setItem(
      "selectedCartItems",
      JSON.stringify(selectedCartItems)
    );

    // Navigate to the order page
    navigate("/order", {
      state: { selectedItems: selectedCartItems },
    });
  };

  // 총 금액 계산 (선택된 상품만)
  const totalPrice = items.reduce(
    (total, item) =>
      selectedItems[item.productCode]
        ? total + item.price * item.quantity
        : total,
    0
  );

  // 애니메이션 변수
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-1 bg-white relative">
      {/* 배경 장식 */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-black opacity-[0.02] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-black opacity-[0.02] rounded-full translate-y-1/4 -translate-x-1/4"></div>

      <div className="relative">
        {/* 헤더 */}
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center mb-1">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-black opacity-20"></div>
            <h1 className="text-2xl font-bold text-black mx-4 tracking-wide">
              장바구니
            </h1>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-black opacity-20"></div>
          </div>
          <p className="text-xs text-gray-500 tracking-wider uppercase">
            Your Shopping Bag
          </p>
        </div>

        {/* 전체 선택 옵션 */}
        <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
          <div className="flex items-center">
            <div className="relative w-5 h-5 mr-3 flex items-center justify-center">
              <input
                type="checkbox"
                id="select-all"
                checked={isAllSelected}
                onChange={handleSelectAll}
                className="opacity-0 absolute w-5 h-5 cursor-pointer"
              />
              <div
                className={`w-5 h-5 border transition-colors duration-200 ${
                  isAllSelected ? "bg-black border-black" : "border-gray-300"
                }`}
              >
                {isAllSelected && (
                  <svg
                    className="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M9 12l2 2 4-4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
            <label
              htmlFor="select-all"
              className="text-sm font-medium cursor-pointer select-none"
            >
              전체 선택
            </label>
          </div>

          <div>
            <span className="text-sm font-medium text-gray-600">
              총{" "}
              {items.filter((item) => selectedItems[item.productCode]).length}개
              선택
            </span>
          </div>
        </div>

        <AnimatePresence>
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 border border-dashed border-gray-200 rounded-sm"
            >
              <svg
                className="w-12 h-12 text-gray-300 mb-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className="text-gray-500 font-medium">
                장바구니가 비었습니다.
              </p>
              <button
                onClick={() => navigate("/")}
                className="mt-4 px-4 py-2 text-sm text-black border border-black hover:bg-black hover:text-white transition-colors duration-300"
              >
                쇼핑 계속하기
              </button>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {items.map((item) => (
                <motion.div
                  key={item.productCode}
                  variants={itemVariants}
                  exit="exit"
                  onMouseEnter={() => setIsHovering(item.productCode)}
                  onMouseLeave={() => setIsHovering(null)}
                  className={`border group ${
                    isHovering === item.productCode
                      ? "border-black"
                      : "border-gray-200"
                  } rounded-sm p-5 transition-all duration-300`}
                >
                  <div className="flex w-full">
                    {/* 왼쪽 영역: 체크박스와 삭제 버튼 */}
                    <div className="mr-3">
                      {/* 개별 상품 선택 체크박스 */}
                      <div className="relative w-5 h-5 flex items-center justify-center mt-1">
                        <input
                          type="checkbox"
                          checked={!!selectedItems[item.productCode]}
                          onChange={() => handleItemSelect(item.productCode)}
                          className="opacity-0 absolute w-5 h-5 cursor-pointer"
                        />
                        <div
                          className={`w-5 h-5 border transition-colors duration-200 ${
                            selectedItems[item.productCode]
                              ? "bg-black border-black"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedItems[item.productCode] && (
                            <svg
                              className="w-5 h-5 text-white"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M9 12l2 2 4-4"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 중앙 영역: 상품 이미지 및 수량 조절 버튼 */}
                    <div className="flex flex-col items-center mr-4">
                      {/* 상품 이미지 */}
                      {item.image && (
                        <div className="relative overflow-hidden rounded-sm w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 flex items-center justify-center mb-3">
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}

                      {/* 수량 조절 - 이미지 아래에 배치 */}
                      <div className="flex items-center">
                        <div className="flex items-center border border-gray-200 rounded-sm">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.productCode,
                                item.quantity - 1
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center border-r border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
                            disabled={isUpdating || item.quantity <= 1}
                          >
                            <svg
                              className="w-3 h-3"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M20 12H4"
                              />
                            </svg>
                          </button>
                          <span className="w-10 h-8 flex items-center justify-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.productCode,
                                item.quantity + 1
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center border-l border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
                            disabled={isUpdating}
                          >
                            <svg
                              className="w-3 h-3"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 오른쪽 영역: 상품 정보 및 가격 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="font-medium text-black transition-colors duration-300 group-hover:text-black mb-1">
                            {item.productName}
                          </h2>
                          <p className="text-black font-bold text-lg mb-3">
                            {item.price.toLocaleString()}원
                          </p>

                          {/* 총액 정보 */}
                          <div className="text-sm text-gray-500 whitespace-nowrap">
                            총액:{" "}
                            {(item.price * item.quantity).toLocaleString()}원
                          </div>
                        </div>

                        {/* 삭제 버튼 */}
                        <button
                          onClick={() => handleRemoveItem(item.productCode)}
                          className="text-gray-400 hover:text-black transition-colors duration-200 p-1"
                        >
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* 총 금액 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-t border-gray-200 mt-8 pt-6"
              >
                <div className="flex justify-between items-center mb-2 text-sm">
                  <span className="text-gray-600">상품 금액</span>
                  <span className="font-medium">
                    {totalPrice.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2 text-sm">
                  <span className="text-gray-600">배송비</span>
                  <span className="font-medium">0원</span>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <span className="text-black font-bold">결제 예정 금액</span>
                  <span className="text-xl font-bold text-black">
                    {totalPrice.toLocaleString()}원
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 구매하기 버튼 */}
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row gap-3"
          >
            <button
              onClick={() => navigate("/")}
              className="py-4 px-6 text-black border border-black hover:bg-gray-50 transition-colors duration-300 text-sm font-medium flex-1 sm:flex-none sm:w-40"
            >
              계속 쇼핑하기
            </button>

            <button
              onClick={handleCheckout}
              disabled={!items.some((item) => selectedItems[item.productCode])}
              className={`py-4 px-6 text-white transition-colors duration-300 text-sm font-medium flex-1 ${
                items.some((item) => selectedItems[item.productCode])
                  ? "bg-black hover:bg-gray-900"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {items.some((item) => selectedItems[item.productCode])
                ? `${
                    items.filter((item) => selectedItems[item.productCode])
                      .length
                  }개 상품 구매하기`
                : "상품을 선택해주세요"}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyCart;
