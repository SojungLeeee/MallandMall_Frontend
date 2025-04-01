import React, { useEffect, useState, useRef } from "react";
import { fetchAllBranches, deleteBranch } from "../../api/httpAdminBranch";
import ListComponents from "../../components/ui/admin/ListComponents"; // ListComponents 컴포넌트 임포트

export default function AdminDeleteBranch() {
  const [error, setError] = useState(null); // 오류 상태
  const [branchData, setBranchData] = useState([]); // 지점 데이터를 위한 상태
  const [delBranchName, setDelBranchName] = useState(null); // 삭제할 지점명
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const modal_dialog = useRef(null); // 모달 ref

  // 지점 데이터를 불러오는 함수
  useEffect(() => {
    async function fetchBranchData() {
      setIsLoading(true);
      try {
        const branchList = await fetchAllBranches();
        console.log("받아온 지점 목록:", branchList); // 받아온 데이터를 콘솔에 출력

        if (Array.isArray(branchList)) {
          setBranchData(branchList); // 지점 데이터를 상태에 저장
        } else {
          throw new Error("지점 데이터가 배열이 아닙니다.");
        }
      } catch (error1) {
        console.log("Error.name:", error1.name);
        console.log("Error.message:", error1.message);
        setError({ mesg: error1.message }); // 오류 발생 시 상태 업데이트
      } finally {
        setIsLoading(false);
      }
    }

    fetchBranchData();
  }, []);

  // 지점 삭제 처리 함수
  const handleRemoveBranch = (branchName) => {
    setDelBranchName(branchName); // 삭제할 지점명 설정
    modal_dialog.current.showModal(); // 모달 표시
  };

  // 삭제 확인 후 서버와 연동하여 지점 삭제
  const handleDeleteConfirm = async () => {
    if (!delBranchName) return; // 삭제할 지점명이 없으면 아무것도 하지 않음

    try {
      await deleteBranch(delBranchName); // 서버에서 지점 삭제
      console.log("지점 삭제 성공");
      alert("삭제되었습니다.");

      // 로컬 상태에서 해당 지점 삭제
      setBranchData((prevData) =>
        prevData.filter((branch) => branch.branchName !== delBranchName)
      );
      modal_dialog.current.close(); // 모달 닫기
    } catch (error) {
      console.error("지점 삭제 실패:", error);
      setError({ mesg: error.message });
    }
  };

  // 오류가 있으면 화면에 오류 메시지 표시
  if (error) {
    return (
      <div className="w-full p-4">
        <div className="p-4 text-red-500 bg-red-100 rounded">
          <div>{`오류: ${error.mesg}`}</div>
        </div>
      </div>
    );
  }

  // 행 렌더링 함수 정의
  const renderRow = (branch, index) => {
    return (
      <tr
        key={index}
        className="border-b border-gray-200 hover:bg-gray-50 text-sm"
      >
        <td className="px-4 py-3 w-40">{branch.branchName}</td>
        <td className="px-2 py-3 w-40">{branch.branchAddress}</td>
        <td className="px-4 py-3">
          <button
            onClick={() => handleRemoveBranch(branch.branchName)}
            className="bg-white hover:bg-red-100 p-1 rounded"
          >
            ❌
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-semibold mb-4">지점 삭제</h2>
      <hr className="mb-4" />

      {/* 삭제 확인 모달 */}
      <dialog
        ref={modal_dialog}
        className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-3/5"
      >
        <h3 className="text-xl font-semibold mb-4">삭제 확인</h3>
        <p className="mb-4 text-gray-700">
          정말로 <span className="text-red-600 font-bold">{delBranchName}</span>{" "}
          지점을 삭제하시겠습니까?
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

      {/* 지점 목록 표시 */}
      {isLoading ? (
        <div className="p-4 text-center bg-gray-100 rounded">
          <p>지점 데이터를 불러오는 중...</p>
        </div>
      ) : branchData.length > 0 ? (
        <ListComponents
          data={branchData} // 지점 데이터
          dataType="branch" // 데이터 타입
          renderRow={renderRow} // 행 렌더링 함수
          showDeleteCheckbox={true} // 삭제 체크박스 여부
          text1="지점명" // 헤더 텍스트
          text2="지점 주소"
          text3="삭제"
          text4=""
          text5=""
        />
      ) : (
        <div className="p-4 text-center bg-gray-100 rounded">
          <p>등록된 지점이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
