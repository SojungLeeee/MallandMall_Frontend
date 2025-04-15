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
  const [selectedExpirationDate, setSelectedExpirationDate] = useState(""); // 유통기한 선택 상태
  const [selectedGoodsIds, setSelectedGoodsIds] = useState([]); // ✅ 선택된 상품 ID 목록
  const modal_dialog = useRef(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // 유통기한 형식은 YYYY-MM-DD로
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

  // 여러 상품 삭제 (bulk delete)
  const handleBulkDelete = async () => {
    if (selectedGoodsIds.length === 0) {
      alert("삭제할 상품을 선택하세요.");
      return;
    }

    if (!window.confirm("정말로 선택한 상품들을 삭제하시겠습니까?")) return;

    try {
      // fetchDeleteGoods에 selectedGoodsIds 배열을 전달
      await fetchDeleteGoods(selectedGoodsIds);

      // 삭제된 상품 목록 업데이트
      setgoodsData((prev) =>
        prev.filter((goods) => !selectedGoodsIds.includes(goods.goodsId))
      );
      setSelectedGoodsIds([]); // 선택된 상품 초기화
      alert("선택된 상품이 삭제되었습니다.");
    } catch (error) {
      console.error("일괄 삭제 실패:", error);
      setError({ mesg: error.message });
    }
  };

  if (error) {
    return <div>{`Error: ${error.mesg}`}</div>;
  }

  // 선택된 상품코드에 대한 유통기한만 뽑기
  const getExpirationDatesByProductCode = (productCode) => {
    return [
      ...new Set(
        goodsData
          .filter((g) => g.productCode === productCode) // 선택된 상품코드에 해당하는 상품들만 필터링
          .map((g) => formatDate(g.expirationDate)) // 유통기한만 뽑아서 중복 제거
      ),
    ];
  };

  // 필터링된 상품 목록 (상품 코드와 유통기한에 맞게 필터링)
  const filteredGoods = goodsData.filter(
    (g) =>
      (selectedProductCode === "" || g.productCode === selectedProductCode) &&
      (selectedExpirationDate === "" ||
        formatDate(g.expirationDate) === selectedExpirationDate)
  );

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

  const handleProductCodeChange = (e) => {
    setSelectedProductCode(e.target.value);
    setSelectedExpirationDate(""); // 상품 코드가 변경되면 유통기한은 전체로 설정
  };

  return (
    <div className="w-full p-2">
      <h2 className="text-2xl font-semibold mb-4">개별 상품 삭제</h2>
      <hr className="mb-4" />

      <button
        className="ml-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        onClick={handleBulkDelete}
      >
        선택 삭제
      </button>

      {/* 🔸 셀렉트박스 UI */}
      <div className="mb-4 flex gap-8 mt-4">
        {" "}
        {/* flex로 묶어 두 묶음을 가로로 배치 */}
        {/* 상품 코드 묶음 */}
        <div className="flex flex-col w-1/2">
          {" "}
          {/* flex-col로 세로로 배치 */}
          <label htmlFor="productCode" className="text-sm font-medium">
            상품 코드 선택:
          </label>
          <select
            id="productCode"
            className="border px-2 py-1 rounded"
            value={selectedProductCode}
            onChange={handleProductCodeChange}
          >
            <option value="">전체</option>
            {[...new Set(goodsData.map((g) => g.productCode))].map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
        {/* 유통기한 묶음 (상품 코드가 전체일 때는 숨기기) */}
        {selectedProductCode && (
          <div className="flex flex-col w-1/2">
            {" "}
            {/* flex-col로 세로로 배치 */}
            <label htmlFor="expirationDate" className="text-sm font-medium">
              유통기한 선택:
            </label>
            <select
              id="expirationDate"
              className="border px-2 py-1 rounded"
              value={selectedExpirationDate}
              onChange={(e) => setSelectedExpirationDate(e.target.value)}
            >
              <option value="">전체</option>
              {getExpirationDatesByProductCode(selectedProductCode).map(
                (date) => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                )
              )}
            </select>
          </div>
        )}
      </div>

      {/* 상품 목록 */}
      {filteredGoods.length > 0 ? (
        <table className="table-auto w-full border">
          <thead className="bg-black text-white">
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
        <div>해당 조건에 맞는 상품이 없습니다.</div>
      )}
    </div>
  );
}
