import React, { useState, useEffect } from "react";
import ListComponents, {
  GenericTableBody,
} from "../../components/ui/admin/ListComponents";
import axios from "axios";

const AdminAllBranch = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBranches, setSelectedBranches] = useState([]);

  // 모든 지점 데이터 가져오기
  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/admin/branch/all");
      setBranches(response.data);
      setError(null);
    } catch (err) {
      setError(
        "지점 데이터를 불러오는 중 오류가 발생했습니다: " +
          (err.response?.data || err.message)
      );
      console.error("지점 데이터 로딩 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  // 지점 삭제 처리 함수
  const handleDelete = async (branchName) => {
    if (window.confirm(`'${branchName}' 지점을 삭제하시겠습니까?`)) {
      try {
        await axios.delete(`/admin/branch/delete/${branchName}`);
        // 삭제 후 목록 업데이트
        fetchBranches();
      } catch (err) {
        alert(
          "지점 삭제 중 오류가 발생했습니다: " +
            (err.response?.data || err.message)
        );
        console.error("지점 삭제 오류:", err);
      }
    }
  };

  // 체크박스 선택 처리
  const handleCheckboxChange = (branchName) => {
    setSelectedBranches((prev) => {
      if (prev.includes(branchName)) {
        return prev.filter((name) => name !== branchName);
      } else {
        return [...prev, branchName];
      }
    });
  };

  // 선택된 지점 일괄 삭제
  const handleBulkDelete = async () => {
    if (selectedBranches.length === 0) {
      alert("삭제할 지점을 선택해주세요.");
      return;
    }

    if (
      window.confirm(
        `선택한 ${selectedBranches.length}개의 지점을 삭제하시겠습니까?`
      )
    ) {
      try {
        // 각 지점 삭제 요청을 병렬로 처리
        await Promise.all(
          selectedBranches.map((branchName) =>
            axios.delete(`/admin/branch/delete/${branchName}`)
          )
        );

        // 삭제 후 목록 업데이트
        fetchBranches();
        setSelectedBranches([]); // 선택 목록 초기화
      } catch (err) {
        alert("지점 일괄 삭제 중 오류가 발생했습니다.");
        console.error("지점 일괄 삭제 오류:", err);
      }
    }
  };

  // 각 지점 데이터로 테이블 행 렌더링
  const renderBranchRow = (branch, index) => (
    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
      <td className="px-4 py-3 border-b border-gray-200">
        {branch.branchName}
      </td>
      <td className="px-4 py-3 border-b border-gray-200">
        {branch.branchAddress}
      </td>
      <td className="px-4 py-3 border-b border-gray-200">
        <button
          onClick={() => handleEdit(branch)}
          className="mr-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          수정
        </button>
      </td>
      <td className="px-4 py-3 border-b border-gray-200">
        <button
          onClick={() => handleDelete(branch.branchName)}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          삭제
        </button>
      </td>
      {/* 체크박스 열 */}
      <td className="px-4 py-3 border-b border-gray-200">
        <input
          type="checkbox"
          checked={selectedBranches.includes(branch.branchName)}
          onChange={() => handleCheckboxChange(branch.branchName)}
          className="form-checkbox h-5 w-5 text-blue-600"
        />
      </td>
    </tr>
  );

  // 지점 수정 처리 함수
  const handleEdit = (branch) => {
    // 지점 수정을 위한 함수 (실제 구현은 상위 컴포넌트나 라우팅에 따라 다를 수 있음)
    console.log("수정할 지점:", branch);
  };

  // 지점 추가 처리 함수
  const handleAdd = () => {
    // 지점 추가를 위한 함수 (실제 구현은 상위 컴포넌트나 라우팅에 따라 다를 수 있음)
    console.log("새 지점 추가");
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between mb-4">
        <button
          onClick={handleBulkDelete}
          disabled={selectedBranches.length === 0}
          className={`px-3 py-1 rounded ${
            selectedBranches.length > 0
              ? "bg-red-500 text-white"
              : "bg-gray-300 text-gray-500"
          }`}
        >
          선택 삭제 ({selectedBranches.length})
        </button>
        <button
          onClick={handleAdd}
          className="px-3 py-1 bg-green-500 text-white rounded"
        >
          지점 추가
        </button>
      </div>

      <ListComponents showDeleteCheckbox={true} text1="지점명" text2="주소">
        <GenericTableBody data={branches} renderRow={renderBranchRow} />
      </ListComponents>
    </div>
  );
};

export default AdminAllBranch;
