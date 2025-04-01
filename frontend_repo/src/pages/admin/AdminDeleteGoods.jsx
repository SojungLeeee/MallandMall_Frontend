import React, { useEffect, useState, useRef } from "react";
import {
  fetchFindAllGoods,
  fetchDeleteGoods,
} from "../../api/httpAdminService";
import ListComponents from "../../components/ui/admin/ListComponents"; // AddComponents 컴포넌트 임포트

export default function AdminAllgoodss() {
  const [error, setError] = useState(null); // 오류 상태
  const [goodsData, setgoodsData] = useState([]); // 상품 데이터를 위한 상태
  const [delgoodsId, setDelgoodsId] = useState(null); // 삭제할 상품 코드
  const modal_dialog = useRef(null); // 모달 ref

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

  // 상품 데이터를 불러오는 함수
  useEffect(() => {
    async function fetchgoodsData() {
      try {
        const goodsCodeList = await fetchFindAllGoods();
        console.log("받아온 상품 목록:", goodsCodeList); // 받아온 데이터를 콘솔에 출력

        if (Array.isArray(goodsCodeList)) {
          setgoodsData(goodsCodeList); // 상품 데이터를 상태에 저장
        } else {
          throw new Error("상품 데이터가 배열이 아닙니다.");
        }
      } catch (error1) {
        console.log("Error.name:", error1.name);
        console.log("Error.message:", error1.message);
        setError({ mesg: error1.message }); // 오류 발생 시 상태 업데이트
      }
    }

    fetchgoodsData();
  }, []);

  // 상품 삭제 처리 함수
  const handleRemovegoods = (goodsId) => {
    setDelgoodsId(goodsId); // 삭제할 상품 코드 설정
    modal_dialog.current.showModal(); // 모달 표시
  };

  // 삭제 확인 후 서버와 연동하여 상품 삭제
  const handleDeleteConfirm = async () => {
    if (!delgoodsId) return; // 삭제할 상품 코드가 없으면 아무것도 하지 않음

    try {
      await fetchDeleteGoods(delgoodsId); // 서버에서 상품 삭제
      console.log("상품 삭제 성공");
      alert("삭제되었습니다.");

      // 로컬 상태에서 해당 상품 삭제
      setgoodsData((prevData) =>
        prevData.filter((goods) => goods.goodsId !== delgoodsId)
      );
      modal_dialog.current.close(); // 모달 닫기
    } catch (error) {
      console.error("상품 삭제 실패:", error);
      setError({ mesg: error.message });
    }
  };

  // 오류가 있으면 화면에 오류 메시지 표시
  if (error) {
    return (
      <div>
        <div>{`Error: ${error.mesg}`}</div>
      </div>
    );
  }

  // 행 렌더링 함수 정의
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
          {formatDate(goods.expirationDate)} {/* 날짜 형식 변환 */}
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

  return (
    <div className="w-full p-2">
      <h2 className="text-2xl font-semibold mb-4">개별 상품 삭제</h2>
      <hr className="mb-4" />

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

      {/* 상품 목록 표시 */}
      {goodsData.length > 0 ? (
        <ListComponents
          data={goodsData} // 상품 데이터
          dataType="goods" // 데이터 타입 예시
          renderRow={renderRow} // 행 렌더링 함수
          showDeleteCheckbox={true} // 삭제 체크박스 여부
          text1="상품ID"
          text2="코드" // 헤더 텍스트
          text3="지점명"
          text4="유통기한"
          text5="❌"
        />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
