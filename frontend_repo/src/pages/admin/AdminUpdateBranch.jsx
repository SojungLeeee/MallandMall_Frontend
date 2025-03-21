import React, { useState } from "react";
import ToggleComponents from "../../components/ui/admin/ToggleComponents";
import DetailComponents from "../../components/ui/admin/DetailComponents";
import {
  fetchAllBranches,
  fetchBranchByName,
  updateBranch,
} from "../../api/httpAdminBranch";

const AdminUpdateBranch = () => {
  const [selectedBranch, setSelectedBranch] = useState(""); // 선택된 지점명을 상태로 관리
  const [isUpdated, setIsUpdated] = useState(false); // 수정 성공 여부 상태

  // 지점이 선택되었을 때 호출되는 함수
  const handleBranchSelect = (branchName) => {
    console.log("선택된 지점명:", branchName);
    setSelectedBranch(branchName); // 선택된 지점명 업데이트
    setIsUpdated(false); // 새 지점 선택 시 업데이트 상태 초기화
  };

  // 수정된 지점 정보를 처리하는 함수
  const handleBranchUpdate = async (updatedBranchDetail) => {
    try {
      console.log("지점 수정 시도:", updatedBranchDetail);

      // 지점 수정 API 호출
      const response = await updateBranch(selectedBranch, updatedBranchDetail);

      console.log("지점 수정 응답:", response);

      if (response) {
        setIsUpdated(true); // 수정 완료 표시
        // alert는 DetailsComponent 내부에서 처리됨
      }
    } catch (error) {
      console.error("지점 수정 오류:", error);
      alert("지점 수정에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">지점 정보 수정</h1>
      <hr className="my-4" />

      {/* 지점 목록 컴포넌트 */}
      <ToggleComponents
        onItemSelect={handleBranchSelect}
        fetchItems={fetchAllBranches}
        extractCode={(branch) => branch.branchName}
        extractLabel={(branch) =>
          `${branch.branchName} (${branch.branchAddress})`
        }
        title="수정할 지점"
        labelText="지점명"
        placeholderText="지점을 선택하세요"
      />
      <hr className="my-4" />

      {/* 선택된 지점이 있을 때, 해당 지점의 상세 정보 컴포넌트 표시 */}
      {selectedBranch && (
        <DetailComponents
          itemCode={selectedBranch}
          fetchItemDetails={(branchName) => {
            // 모든 지점을 가져온 후, 선택된 지점만 찾아서 반환
            return fetchAllBranches().then((branches) => {
              const branch = branches.find((b) => b.branchName === branchName);
              if (!branch) {
                throw new Error(`'${branchName}' 지점을 찾을 수 없습니다`);
              }
              return branch; // 단일 객체 반환
            });
          }}
          onItemUpdate={handleBranchUpdate}
          title="지점 상세 정보"
          itemType="지점"
          submitText="수정하기"
          successText="지점 정보 수정이 완료되었습니다."
          fields={[
            {
              name: "branchName",
              label: "지점명",
              type: "text",
              readOnly: true,
            },
            { name: "branchAddress", label: "지점 주소", type: "text" },
          ]}
        />
      )}

      {/* 수정 성공 메시지 */}
      {isUpdated && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
          지점 정보가 성공적으로 업데이트되었습니다.
        </div>
      )}
    </div>
  );
};

export default AdminUpdateBranch;
