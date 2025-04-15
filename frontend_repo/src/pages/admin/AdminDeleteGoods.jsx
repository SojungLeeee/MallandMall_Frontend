import React, { useEffect, useState, useRef } from "react";
import {
  fetchFindAllGoods,
  fetchDeleteGoods,
} from "../../api/httpAdminService";
import ListComponents from "../../components/ui/admin/ListComponents";

export default function AdminAllgoodss() {
  const [error, setError] = useState(null);
  const [goodsData, setgoodsData] = useState([]);
  const [selectedProductCode, setSelectedProductCode] = useState("");
  const [selectedGoodsIds, setSelectedGoodsIds] = useState([]); // ✅ 선택된 상품 ID 목록
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
        if (Array.isArray(goodsCodeList)) {
          setgoodsData(goodsCodeList);
        } else {
          throw new Error("상품 데이터가 배열이 아닙니다.");
        }
      } catch (error1) {
        setError({ mesg: error1.message });
      }
    }
    fetchgoodsData();
  }, []);

  const handleSingleCheck = (goodsId) => {
    setSelectedGoodsIds((prev) =>
      prev.includes(goodsId)
        ? prev.filter((id) => id !== goodsId)
        : [...prev, goodsId]
    );
  };

  const handleAllCheck = () => {
    if (selectedGoodsIds.length === filteredGoods.length) {
      setSelectedGoodsIds([]);
    } else {
      setSelectedGoodsIds(filteredGoods.map((goods) => goods.goodsId));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedGoodsIds.length === 0) {
      alert("삭제할 상품을 선택하세요.");
      return;
    }

    if (!window.confirm("정말로 선택한 상품들을 삭제하시겠습니까?")) return;

    try {
      for (const goodsId of selectedGoodsIds) {
        await fetchDeleteGoods(goodsId);
      }

      setgoodsData((prev) =>
        prev.filter((goods) => !selectedGoodsIds.includes(goods.goodsId))
      );
      setSelectedGoodsIds([]);
      alert("선택된 상품이 삭제되었습니다.");
    } catch (error) {
      console.error("일괄 삭제 실패:", error);
      setError({ mesg: error.message });
    }
  };

  if (error) {
    return <div>{`Error: ${error.mesg}`}</div>;
  }

  const uniqueProductCodes = [...new Set(goodsData.map((g) => g.productCode))];

  const filteredGoods = selectedProductCode
    ? goodsData.filter((g) => g.productCode === selectedProductCode)
    : goodsData;

  const renderRow = (goods, index) => {
    const isChecked = selectedGoodsIds.includes(goods.goodsId);
    return (
      <tr key={index} className="text-sm">
        <td className="px-3 py-2">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => handleSingleCheck(goods.goodsId)}
          />
        </td>
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
      </tr>
    );
  };

  return (
    <div className="w-full p-2">
      <h2 className="text-2xl font-semibold mb-4">개별 상품 삭제</h2>
      <hr className="mb-4" />

      {/* 🔸 셀렉트박스 UI */}
      <div className="mb-4 flex items-center gap-4">
        <label htmlFor="productCode" className="text-sm font-medium">
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

        <button
          className="ml-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={handleBulkDelete}
        >
          선택 삭제
        </button>
      </div>

      {/* 상품 목록 */}
      {filteredGoods.length > 0 ? (
        <table className="table-auto w-full border">
          <thead className="bg-black  text-white">
            <tr>
              <th className="px-3 py-2">
                <input
                  type="checkbox"
                  onChange={handleAllCheck}
                  checked={
                    selectedGoodsIds.length === filteredGoods.length &&
                    filteredGoods.length > 0
                  }
                />
              </th>
              <th className="px-3 py-2">코드</th>
              <th className="px-3 py-2">지점명</th>
              <th className="px-3 py-2">유통기한</th>
            </tr>
          </thead>
          <tbody className="text-sm">{filteredGoods.map(renderRow)}</tbody>
        </table>
      ) : (
        <div>해당 상품코드에 해당하는 상품이 없습니다.</div>
      )}
    </div>
  );
}
