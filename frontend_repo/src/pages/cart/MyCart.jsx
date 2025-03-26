import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchCartItems,
  removeCartItem,
  updateCartQuantity,
} from "../../api/httpMemberService";

const MyCart = () => {
  const [items, setItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const [isAllSelected, setIsAllSelected] = useState(false);
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-white">
      <h1 className="text-xl font-bold text-black mb-4 text-center">
        장바구니
      </h1>

      <div className="flex items-center mb-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="select-all"
            checked={isAllSelected}
            onChange={handleSelectAll}
            className="mr-2 w-5 h-5 text-black focus:ring-black border-gray-300 rounded"
          />
          <label htmlFor="select-all" className="text-sm">
            전체 선택
          </label>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-gray-500 py-12">
          장바구니가 비었습니다.
        </p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.productCode}
              className="flex items-center justify-between border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center space-x-4 w-full">
                {/* 개별 상품 선택 체크박스 */}
                <input
                  type="checkbox"
                  checked={!!selectedItems[item.productCode]}
                  onChange={() => handleItemSelect(item.productCode)}
                  className="mr-2 w-5 h-5 text-black focus:ring-black border-gray-300 rounded"
                />

                {item.image && (
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                )}
                <div className="flex-1">
                  <h2 className="font-semibold text-black">
                    {item.productName}
                  </h2>
                  <p className="text-gray-600 mb-2">
                    {item.price.toLocaleString()}원
                  </p>

                  {/* 수량 조절 박스를 여기로 이동 */}
                  <div className="flex items-center">
                    <div className="flex items-center border border-gray-300 rounded-sm">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.productCode,
                            item.quantity - 1
                          )
                        }
                        className="px-3 py-1 border-r border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                        disabled={isUpdating || item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-4 py-1 text-black">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.productCode,
                            item.quantity + 1
                          )
                        }
                        className="px-3 py-1 border-l border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                        disabled={isUpdating}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* 삭제 버튼 */}
                <button
                  onClick={() => handleRemoveItem(item.productCode)}
                  className="text-gray-500 hover:text-black transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          {/* 총 금액 */}
          <div className="border-t border-gray-200 pt-4 text-right">
            <p className="text-xl font-bold text-black">
              총 합계: {totalPrice.toLocaleString()}원
            </p>
          </div>
        </div>
      )}

      {/* 구매하기 버튼 */}
      {items.length > 0 && (
        <div className="mt-8">
          <button
            onClick={handleCheckout}
            className="w-full py-4 text-lg font-semibold text-white bg-black 
                       hover:bg-gray-800 transition-colors duration-300 
                       focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50"
          >
            구매하기
          </button>
        </div>
      )}
    </div>
  );
};

export default MyCart;
