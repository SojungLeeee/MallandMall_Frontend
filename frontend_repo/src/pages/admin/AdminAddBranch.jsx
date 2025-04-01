import React, { useEffect, useState } from "react";
import { fetchAllBranches, createBranch } from "../../api/httpAdminBranch";
import ListComponents from "../../components/ui/admin/ListComponents";
import GenericForm from "../../components/ui/admin/AddComponents"; // 재사용 가능한 양식 컴포넌트 import

export default function AdminAddBranch() {
  const [error, setError] = useState(null);
  const [branchData, setBranchData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 지점 추가 양식을 위한 상태 및 필드 정의
  const [branchValues, setBranchValues] = useState({
    branchName: "",
    branchAddress: "",
  });

  // 지점 양식 필드 정의
  const branchFields = [
    { id: "branchName", label: "지점명", type: "text" },
    { id: "branchAddress", label: "지점 주소", type: "text" },
  ];

  // 지점 데이터를 가져오는 함수
  const fetchBranchData = async () => {
    setIsLoading(true);
    try {
      const branchList = await fetchAllBranches();
      console.log("받아온 지점 목록:", branchList);

      if (Array.isArray(branchList)) {
        setBranchData(branchList);
      } else {
        throw new Error("지점 데이터가 배열이 아닙니다.");
      }
    } catch (error1) {
      console.log("Error.name:", error1.name);
      console.log("Error.message:", error1.message);
      setError({ mesg: error1.message });
    } finally {
      setIsLoading(false);
    }
  };

  // 지점 추가 처리 함수
  const handleBranchSubmit = async (values) => {
    try {
      await createBranch(values); // 지점 추가 API 호출

      alert("지점이 정상적으로 추가되었습니다.");
      setError(null);

      // 폼 초기화
      setBranchValues({
        branchName: "",
        branchAddress: "",
      });

      await fetchBranchData(); // 지점 목록을 새로 불러옵니다.
    } catch (error) {
      console.log("지점 추가 실패:", error);
      setError({ mesg: "중복된 지점명입니다." });
    }
  };

  useEffect(() => {
    fetchBranchData(); // 컴포넌트가 마운트되었을 때 지점 데이터 가져오기
  }, []);

  // 오류 메시지 표시
  const errorMessage =
    error && error.mesg ? (
      <div className="p-4 text-red-500 bg-red-100 rounded mb-4">
        <div>{`${error.mesg}`}</div>
      </div>
    ) : null;

  // 행 렌더링 함수 정의
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
      {/* 지점 추가 실패 시 오류 메시지 표시 */}
      {errorMessage}

      {/* 재사용 가능한 지점 추가 양식 */}
      <div className="mb-6">
        <GenericForm
          title="지점 추가"
          fields={branchFields}
          values={branchValues}
          setValues={setBranchValues}
          onSubmit={handleBranchSubmit}
          submitButtonText="지점 추가"
          submitButtonClass="bg-[#ebe2d5] hover:bg-[#ddd3c6]"
        />
      </div>

      <hr className="mb-4" />

      {/* 지점 목록 표시 */}
      {isLoading ? (
        <div className="p-4 text-center bg-gray-100 rounded">
          <p>지점 데이터를 불러오는 중...</p>
        </div>
      ) : branchData.length > 0 ? (
        <ListComponents
          data={branchData}
          dataType="branch"
          renderRow={renderRow}
          showDeleteCheckbox={false}
          text1="지점명"
          text2="지점 주소"
          text3=""
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
