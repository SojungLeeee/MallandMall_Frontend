import React, { useEffect, useState } from "react";
import { fetchAllEvents } from "../../api/httpAdminEvent"; // 전체 이벤트 API 임포트
import ListComponents from "../../components/ui/admin/ListComponents"; // ListComponents 컴포넌트 임포트

export default function BranchEventsList() {
  const [error, setError] = useState(null); // 오류 상태
  const [eventData, setEventData] = useState([]); // 이벤트 데이터
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

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

  // 전체 이벤트 목록 불러오기
  const fetchAllEventData = async () => {
    setIsLoading(true);
    try {
      const eventList = await fetchAllEvents(); // 전체 이벤트 목록 불러오기
      console.log("전체 이벤트 목록:", eventList);

      if (Array.isArray(eventList)) {
        setEventData(eventList);
      } else {
        setEventData([]);
      }
    } catch (error) {
      console.error("이벤트 목록 조회 실패:", error);
      setError({ mesg: "이벤트 목록을 불러오는데 실패했습니다." });
      setEventData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 전체 이벤트 목록 로드
  useEffect(() => {
    fetchAllEventData();
  }, []);

  // 행 렌더링 함수 - 이벤트 정보 표시
  const renderRow = (event, index) => {
    return (
      <tr
        key={index}
        className="border-b border-gray-200 hover:bg-gray-50 text-xs"
      >
        <td className="px-4 py-3 text-xs">{event.eventId}</td>
        <td className="px-3 py-3  text-xs">{event.category}</td>
        <td className="px-3 py-3  text-xs w-40">{event.eventTitle}</td>
        <td className={"px-3 py-2 text-xs w-20"}>
          {formatDate(event.endDate)} {/* 날짜 형식 변환 */}
        </td>
        <td className={"px-3 py-2 text-xs w-20"}>
          {formatDate(event.endDate)} {/* 날짜 형식 변환 */}
        </td>
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
      <h2 className="text-2xl font-semibold mb-4">전체 이벤트 목록</h2>

      {errorMessage}

      <hr className="mb-4" />

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
          text1="ID"
          text2="카테고리"
          text3="이벤트명"
          text4="시작일자"
          text5="마감일자"
        />
      ) : (
        <div className="p-4 text-center bg-gray-100 rounded">
          <p>등록된 행사가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
