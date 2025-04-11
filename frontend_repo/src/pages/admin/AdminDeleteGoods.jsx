import React, { useEffect, useState, useRef } from "react";
import {
  fetchFindAllGoods,
  fetchDeleteGoods,
} from "../../api/httpAdminService";
import ListComponents from "../../components/ui/admin/ListComponents";

export default function AdminAllgoodss() {
  const [error, setError] = useState(null);
  const [goodsData, setgoodsData] = useState([]);
  const [delgoodsId, setDelgoodsId] = useState(null);
  const [selectedProductCode, setSelectedProductCode] = useState(""); // 🔸 선택된 상품코드
  const modal_dialog = useRef(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    async function fetchgoodsData() {
      try {
        const goodsCodeList = await fetchFindAllGoods();
        console.log("받아온 상품 목록:", goodsCodeList);

        if (Array.isArray(goodsCodeList)) {
          setgoodsData(goodsCodeList);
        } else {
          throw new Error("상품 데이터가 배열이 아닙니다.");
        }
      } catch (error1) {
        console.log("Error.name:", error1.name);
        console.log("Error.message:", error1.message);
        setError({ mesg: error1.message });
      }
    }

    fetchgoodsData();
  }, []);

  const handleRemovegoods = (goodsId) => {
    setDelgoodsId(goodsId);
    modal_dialog.current.showModal();
  };

  const handleDeleteConfirm = async () => {
    if (!delgoodsId) return;

    try {
      await fetchDeleteGoods(delgoodsId);
      console.log("상품 삭제 성공");
      alert("삭제되었습니다.");
      setgoodsData((prevData) =>
        prevData.filter((goods) => goods.goodsId !== delgoodsId)
      );
      modal_dialog.current.close();
    } catch (error) {
      console.error("상품 삭제 실패:", error);
      setError({ mesg: error.message });
    }
  };

  if (error) {
    return (
      <div>
        <div>{`Error: ${error.mesg}`}</div>
      </div>
    );
  }

  const renderRow = (goods, index) => {
    return (
      <tr key={index} className="text-xs">
        <td className="px-3 py-2">{goods.goodsId}</td>
        <td className="px-3 py-2">{goods.productCode}</td>
        <td className="px-3 py-2">{goods.branchName}</td>
        <td
          className={`px-3 py-2 ${
            new Date(goods.expirationDate) < new Date()
              ? "bg-red-500 text-white"
              : ""
          }`}
        >
          {formatDate(goods.expirationDate)}
        </td>
        <td className="px-3 py-2">
          <button
            onClick={() => handleRemovegoods(goods.goodsId)}
            className="bg-white"
          >
            ❌
          </button>
        </td>
      </tr>
    );
  };

  // 🔸 중복 제거된 상품코드 리스트
  const uniqueProductCodes = [...new Set(goodsData.map((g) => g.productCode))];

  // 🔸 필터링된 상품 목록
  const filteredGoods = selectedProductCode
    ? goodsData.filter((g) => g.productCode === selectedProductCode)
    : goodsData;

  return (
    <div className="w-full p-2">
      <h2 className="text-2xl font-semibold mb-4">개별 상품 삭제</h2>
      <hr className="mb-4" />

      {/* 🔸 셀렉트박스 UI */}
      <div className="mb-4">
        <label htmlFor="productCode" className="mr-2 text-sm font-medium">
          상품 코드 선택:
        </label>
        <select
          id="productCode"
          className="border px-2 py-1 rounded"
          value={selectedProductCode}
          onChange={(e) => setSelectedProductCode(e.target.value)}
        >
          <option value="">전체</option>
          {uniqueProductCodes.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </div>

      {/* 삭제 확인 모달 */}
      <dialog
        ref={modal_dialog}
        className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-3/5"
      >
        <h3 className="text-xl font-semibold mb-4">삭제 확인</h3>
        <p className="mb-4 text-gray-700">
          정말로 해당 상품을 삭제하시겠습니까?
        </p>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleDeleteConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            삭제
          </button>
          <button
            type="button"
            onClick={() => modal_dialog.current.close()}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            취소
          </button>
        </div>
      </dialog>

      {/* 상품 목록 */}
      {filteredGoods.length > 0 ? (
        <ListComponents
          data={filteredGoods}
          dataType="goods"
          renderRow={renderRow}
          showDeleteCheckbox={true}
          text1="상품ID"
          text2="코드"
          text3="지점명"
          text4="유통기한"
          text5="❌"
        />
      ) : (
        <div>해당 상품코드에 해당하는 상품이 없습니다.</div>
      )}
    </div>
  );
}
