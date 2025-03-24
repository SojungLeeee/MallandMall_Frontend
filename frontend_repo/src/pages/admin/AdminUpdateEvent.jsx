import React, { useState } from "react";
import ToggleComponents from "../../components/ui/admin/ToggleComponents";
import DetailComponents from "../../components/ui/admin/DetailComponents";
import { fetchEventsByBranch, updateEvent } from "../../api/httpAdminEvent";

// 지점 목록을 가져오는 함수가 있다고 가정
import { fetchAllBranches } from "../../api/httpAdminBranch";

const AdminUpdateEvents = () => {
  const [selectedEventId, setSelectedEventId] = useState(""); // 선택된 이벤트 ID를 상태로 관리
  const [isUpdated, setIsUpdated] = useState(false); // 수정 성공 여부 상태
  const [branchName, setBranchName] = useState(""); // 지점 선택을 위한 상태 추가

  // 이벤트 ID가 선택되었을 때 호출되는 함수
  const handleEventSelect = (eventId, selectedEvent) => {
    console.log("선택된 이벤트 ID:", eventId);
    console.log("선택된 이벤트 객체:", selectedEvent);
    setSelectedEventId(eventId); // 선택된 이벤트 ID 업데이트
    setIsUpdated(false); // 새 이벤트 선택 시 업데이트 상태 초기화
  };

  // 지점이 선택되었을 때 호출되는 함수
  const handleBranchSelect = (selectedBranch, branchItem) => {
    console.log("선택된 지점:", selectedBranch);
    console.log("선택된 지점 객체:", branchItem);
    setBranchName(selectedBranch);
    setSelectedEventId(""); // 지점 변경 시 선택된 이벤트 초기화
    setIsUpdated(false);
  };

  // 수정된 이벤트 정보를 처리하는 함수
  const handleEventUpdate = async (updatedEventDetail) => {
    try {
      console.log("이벤트 수정 시도:", updatedEventDetail);

      // 이벤트 수정 API 호출 - 이미 만들어진 함수 사용
      const response = await updateEvent(selectedEventId, updatedEventDetail);

      console.log("이벤트 수정 응답:", response);

      if (response) {
        setIsUpdated(true); // 수정 완료 표시
        // alert는 DetailsComponent 내부에서 처리됨
      }
    } catch (error) {
      console.error("이벤트 수정 오류:", error);
      alert("이벤트 수정에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">이벤트 수정</h1>
      <hr className="my-4" />

      {/* 지점 선택 토글 컴포넌트 */}
      <ToggleComponents
        onItemSelect={handleBranchSelect}
        fetchItems={fetchAllBranches}
        extractCode={(branchItem) => branchItem.branchName}
        title="지점 선택"
        labelText="지점명"
        placeholderText="지점을 선택하세요"
      />

      {/* 지점이 선택되었을 때만 이벤트 목록 표시 */}
      {branchName && (
        <>
          <hr className="my-4" />
          {/* 이벤트 ID 목록 컴포넌트 */}
          <ToggleComponents
            onItemSelect={handleEventSelect}
            fetchItems={() => fetchEventsByBranch(branchName)}
            extractCode={(event) => event.eventId}
            title="수정할 이벤트"
            labelText="이벤트 ID"
            placeholderText="이벤트를 선택하세요"
          />
        </>
      )}

      <hr className="my-4" />

      {/* 선택된 이벤트 ID가 있을 때, 해당 이벤트의 상세 정보 컴포넌트 표시 */}
      {selectedEventId && branchName && (
        <DetailComponents
          itemCode={selectedEventId}
          fetchItemDetails={(eventId) => {
            // 이벤트 목록에서 선택된 이벤트 정보를 찾는 방식으로 구현
            return fetchEventsByBranch(branchName).then((events) => {
              const event = events.find(
                (e) => e.eventId.toString() === eventId.toString()
              );
              if (!event) throw new Error("이벤트를 찾을 수 없습니다");
              return event;
            });
          }}
          onItemUpdate={handleEventUpdate}
          title="이벤트 상세 정보"
          submitText="수정하기"
          successText="이벤트 수정이 완료되었습니다."
        />
      )}

      {/* 수정 성공 메시지 */}
      {isUpdated && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
          이벤트 정보가 성공적으로 업데이트되었습니다.
        </div>
      )}
    </div>
  );
};

export default AdminUpdateEvents;
