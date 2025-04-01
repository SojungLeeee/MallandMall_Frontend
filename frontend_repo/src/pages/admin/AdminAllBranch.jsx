import React, { useEffect, useState } from "react";
import { fetchAllBranches } from "../../api/httpAdminBranch"; // 지점 API 함수 임포트
import ListComponents from "../../components/ui/admin/ListComponents"; // ListComponents 컴포넌트 임포트

export default function AdminAllBranch() {
  const [error, setError] = useState(null); // 오류 상태
  const [branchData, setBranchData] = useState([]); // 지점 데이터를 위한 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    async function fetchBranchData() {
      try {
        setIsLoading(true);
        const branchList = await fetchAllBranches();
        console.log("받아온 지점 목록:", branchList); // 받아온 데이터를 콘솔에 출력

        if (Array.isArray(branchList)) {
          setBranchData(branchList); // 응답이 배열이면 그 자체를 상태에 저장
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

  // 행 렌더링 함수 정의 - 지점 엔티티에 맞게 수정
  const renderRow = (branch, index) => {
    return (
      <tr
        key={index}
        className="border-b border-gray-200 hover:bg-gray-50 text-sm"
      >
        <td className="px-4 py-3">{branch.branchName}</td>
        <td className="px-2 py-3">{branch.branchAddress}</td>
      </tr>
    );
  };

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-semibold mb-4">지점 목록</h2>
      <hr className="mb-4" />

      {isLoading ? (
        <div className="p-4 text-center bg-gray-100 rounded">
          <p>지점 데이터를 불러오는 중...</p>
        </div>
      ) : branchData.length > 0 ? (
        <ListComponents
          data={branchData} // 지점 데이터
          dataType="branch" // 데이터 타입
          renderRow={renderRow} // 행 렌더링 함수
          showDeleteCheckbox={false} // 삭제 체크박스 여부
          text1="지점명" // 헤더 텍스트
          text2="지점 주소"
          text3="" // 불필요한 헤더는 빈 문자열로 설정
          text4="" // 불필요한 헤더는 빈 문자열로 설정
          text5="" // 불필요한 헤더는 빈 문자열로 설정
        />
      ) : (
        <div className="p-4 text-center bg-gray-100 rounded">
          <p>등록된 지점이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
