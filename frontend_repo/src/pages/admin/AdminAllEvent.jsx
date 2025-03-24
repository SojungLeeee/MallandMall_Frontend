import React, { useEffect, useState } from "react";
import { fetchAllBranches } from "../../api/httpAdminBranch"; // 지점 API 임포트
import { fetchEventsByBranch } from "../../api/httpAdminEvent"; // 이벤트 API 임포트
import ListComponents from "../../components/ui/admin/ListComponents"; // ListComponents 컴포넌트 임포트

export default function BranchEventsList() {
  const [error, setError] = useState(null); // 오류 상태
  const [branches, setBranches] = useState([]); // 지점 목록
  const [selectedBranch, setSelectedBranch] = useState(""); // 선택된 지점
  const [eventData, setEventData] = useState([]); // 이벤트 데이터
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  // 모든 지점 정보 불러오기
  const fetchBranchData = async () => {
    try {
      const branchList = await fetchAllBranches();
      console.log("받아온 지점 목록:", branchList);

      if (Array.isArray(branchList) && branchList.length > 0) {
        setBranches(branchList);
        // 첫 번째 지점을 기본값으로 설정
        setSelectedBranch(branchList[0].branchName);
      } else {
        throw new Error("지점 데이터가 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("지점 목록 조회 실패:", error);
      setError({ mesg: "지점 목록을 불러오는데 실패했습니다." });
    }
  };

  // 선택된 지점의 이벤트 목록 불러오기
  const fetchBranchEvents = async (branchName) => {
    if (!branchName) return;

    setIsLoading(true);
    try {
      const eventList = await fetchEventsByBranch(branchName);
      console.log(`${branchName} 지점의 이벤트 목록:`, eventList);

      if (Array.isArray(eventList)) {
        setEventData(eventList);
      } else {
        setEventData([]);
      }
    } catch (error) {
      console.error("이벤트 목록 조회 실패:", error);
      setError({
        mesg: `${branchName} 지점의 이벤트를 불러오는데 실패했습니다.`,
      });
      setEventData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 지점 변경 핸들러
  const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value);
  };

  // 컴포넌트 마운트 시 지점 목록 로드
  useEffect(() => {
    fetchBranchData();
  }, []);

  // 선택된 지점이 변경될 때 해당 지점의 이벤트 로드
  useEffect(() => {
    if (selectedBranch) {
      fetchBranchEvents(selectedBranch);
    }
  }, [selectedBranch]);

  // 행 렌더링 함수 - 이벤트 정보 표시
  const renderRow = (event, index) => {
    return (
      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
        <td className="px-4 py-3">{event.eventId}</td>
        <td className="px-4 py-3">{event.category}</td>
        <td className="px-4 py-3">{event.eventTitle}</td>
      </tr>
    );
  };

  // 오류 메시지 표시
  const errorMessage = error && (
    <div className="p-4 text-red-500 bg-red-100 rounded mb-4">
      <div>{error.mesg}</div>
    </div>
  );

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-semibold mb-4">지점별 행사 목록</h2>

      {errorMessage}

      {/* 지점 선택 드롭다운 */}
      <div className="mb-6">
        <label
          htmlFor="branchSelect"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          지점 선택:
        </label>
        <select
          id="branchSelect"
          value={selectedBranch}
          onChange={handleBranchChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {branches.map((branch) => (
            <option key={branch.branchName} value={branch.branchName}>
              {branch.branchName} ({branch.branchAddress})
            </option>
          ))}
        </select>
      </div>

      <hr className="mb-4" />

      {/* 선택된 지점 정보 표시 */}
      {selectedBranch && (
        <div className="mb-4">
          <h3 className="text-lg font-medium">
            <span className="font-bold">{selectedBranch}</span> 지점 행사 목록
          </h3>
          <p className="text-sm text-gray-600">
            {
              branches.find((b) => b.branchName === selectedBranch)
                ?.branchAddress
            }
          </p>
        </div>
      )}

      {/* 이벤트 목록 표시 */}
      {isLoading ? (
        <div className="p-4 text-center bg-gray-100 rounded">
          <p>행사 데이터를 불러오는 중...</p>
        </div>
      ) : eventData.length > 0 ? (
        <ListComponents
          data={eventData}
          dataType="event"
          renderRow={renderRow}
          showDeleteCheckbox={false}
          text1="행사 ID"
          text2="카테고리"
          text3="행사 제목"
          text4=""
        />
      ) : (
        <div className="p-4 text-center bg-gray-100 rounded">
          <p>{selectedBranch} 지점에 등록된 행사가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
