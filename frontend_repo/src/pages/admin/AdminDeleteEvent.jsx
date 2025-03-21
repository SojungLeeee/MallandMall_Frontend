import React, { useEffect, useState, useRef } from "react";
import {
  fetchEventsByBranch,
  fetchDeleteEvent,
} from "../../api/httpAdminEvent";
import ListComponents from "../../components/ui/admin/ListComponents"; // ListComponents 컴포넌트 임포트

export default function AdminDeleteEvent() {
  const [error, setError] = useState(null); // 오류 상태
  const [eventData, setEventData] = useState([]); // 이벤트 데이터를 위한 상태
  const [delEventId, setDelEventId] = useState(null); // 삭제할 이벤트 ID
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const modal_dialog = useRef(null); // 모달 ref

  // 이벤트 데이터를 불러오는 함수
  useEffect(() => {
    async function fetchEventData() {
      setIsLoading(true);
      try {
        // 'default'를 전달하면 서버에서 모든 이벤트를 반환하도록 구현
        const eventList = await fetchEventsByBranch("default");
        console.log("받아온 이벤트 목록:", eventList); // 받아온 데이터를 콘솔에 출력

        if (Array.isArray(eventList)) {
          setEventData(eventList); // 이벤트 데이터를 상태에 저장
        } else {
          throw new Error("이벤트 데이터가 배열이 아닙니다.");
        }
      } catch (error1) {
        console.log("Error.name:", error1.name);
        console.log("Error.message:", error1.message);
        setError({ mesg: error1.message }); // 오류 발생 시 상태 업데이트
      } finally {
        setIsLoading(false);
      }
    }

    fetchEventData();
  }, []);

  // 이벤트 삭제 처리 함수
  const handleRemoveEvent = (eventId) => {
    setDelEventId(eventId); // 삭제할 이벤트 ID 설정
    modal_dialog.current.showModal(); // 모달 표시
  };

  // 삭제 확인 후 서버와 연동하여 이벤트 삭제
  const handleDeleteConfirm = async () => {
    if (!delEventId) return; // 삭제할 이벤트 ID가 없으면 아무것도 하지 않음

    try {
      await fetchDeleteEvent(delEventId); // 서버에서 이벤트 삭제
      console.log("이벤트 삭제 성공");
      alert("삭제되었습니다.");

      // 로컬 상태에서 해당 이벤트 삭제
      setEventData((prevData) =>
        prevData.filter((event) => event.eventId !== delEventId)
      );
      modal_dialog.current.close(); // 모달 닫기
    } catch (error) {
      console.error("이벤트 삭제 실패:", error);
      setError({ mesg: error.message });
    }
  };

  // 행 렌더링 함수 정의
  const renderRow = (event, index) => {
    return (
      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
        <td className="px-4 py-3">{event.eventId}</td>
        <td className="px-4 py-3">{event.category}</td>
        <td className="px-4 py-3">{event.branchName}</td>
        <td className="px-4 py-3">{event.eventTitle}</td>
        <td className="px-4 py-3">
          <button
            onClick={() => handleRemoveEvent(event.eventId)}
            className="bg-white hover:bg-red-100 p-1 rounded"
          >
            ❌
          </button>
        </td>
      </tr>
    );
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

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-semibold mb-4">이벤트 목록</h2>
      <hr className="mb-4" />

      {/* 삭제 확인 모달 */}
      <dialog
        ref={modal_dialog}
        className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-3/5"
      >
        <h3 className="text-xl font-semibold mb-4">삭제 확인</h3>
        <p className="mb-4 text-gray-700">
          정말로{" "}
          <span className="text-red-600 font-bold">ID: {delEventId}</span>{" "}
          이벤트를 삭제하시겠습니까?
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

      {/* 이벤트 목록 표시 */}
      {isLoading ? (
        <div className="p-4 text-center bg-gray-100 rounded">
          <p>이벤트 데이터를 불러오는 중...</p>
        </div>
      ) : eventData.length > 0 ? (
        <ListComponents
          data={eventData} // 이벤트 데이터
          dataType="event" // 데이터 타입
          renderRow={renderRow} // 행 렌더링 함수
          showDeleteCheckbox={true} // 삭제 체크박스 여부
          text1="이벤트 ID" // 헤더 텍스트
          text2="카테고리"
          text3="지점"
          text4="이벤트 제목"
          text5="삭제"
        />
      ) : (
        <div className="p-4 text-center bg-gray-100 rounded">
          <p>등록된 이벤트가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
