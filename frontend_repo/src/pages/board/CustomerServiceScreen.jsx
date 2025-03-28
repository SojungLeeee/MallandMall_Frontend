import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeft, Edit, X } from "lucide-react"; // X 아이콘 추가
import ConversationView from "./ConversationView";
import InquiryWriteForm from "./InquiryWriteForm";
import InquiryEditForm from "./InquiryEditForm";

// 질문 목록 가져오기 함수
export async function getUserQuestions(userId, token) {
  try {
    const response = await axios.get(`/questions/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log("토큰 값:", token);
    console.error(
      "❌ 문의 목록 불러오기 실패:",
      error.response ? error.response.data : error
    );
    throw error;
  }
}

// 질문 삭제하기 함수
export async function deleteQuestion(questionId, token) {
  try {
    const response = await axios.delete(`/questions/delete/${questionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // 성공적으로 삭제된 경우 서버의 응답 반환
  } catch (error) {
    console.log("토큰 값:", token);
    console.error(
      "❌ 질문 삭제 실패:",
      error.response ? error.response.data : error
    );
    throw error;
  }
}

const CustomerServiceScreen = () => {
  const [inquiries, setInquiries] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isWriting, setIsWriting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // 로컬 스토리지에서 토큰 가져오기
  const token = localStorage.getItem("jwtAuthToken");

  // 인증된 사용자 ID를 가져오는 함수 (실제로 JWT에서 userId를 추출해야 함)
  const getAuthenticatedUserId = () => {
    if (!token) {
      console.error("❌ JWT 토큰이 존재하지 않습니다.");
      return null;
    }
    // 실제로 JWT에서 userId를 추출해야 합니다.
    return localStorage.getItem("userId"); // 로컬 스토리지에서 userId 가져오기
  };

  useEffect(() => {
    const fetchInquiries = async () => {
      const userId = getAuthenticatedUserId();
      if (!userId || !token) return;

      try {
        const response = await axios.get(
          `http://localhost:8090/emart/questions/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // API 응답 데이터 변환
        const formattedData = response.data.map((item) => ({
          id: item.questionId,
          title: item.title,
          createDate: item.createDate.split("T")[0],
          content: item.content,
        }));

        setInquiries(formattedData);
      } catch (error) {
        console.error("❌ 문의 내역을 불러오는 중 오류 발생:", error);
      }
    };

    fetchInquiries();
  }, [token]);

  // 문의 작성 버튼 클릭 시 실행될 함수
  const onWriteClick = () => {
    setIsWriting(true);
  };

  // 문의 수정 버튼 클릭 시 실행될 함수
  const onEditClick = (inquiry) => {
    setSelectedConversation(inquiry);
    setIsEditing(true);
  };

  // 질문 삭제 처리
  const onDeleteClick = async (questionId) => {
    const userId = getAuthenticatedUserId();
    const token = localStorage.getItem("jwtAuthToken");

    if (!userId || !token) return;

    try {
      await deleteQuestion(questionId, token); // 질문 삭제
      setInquiries(inquiries.filter((inquiry) => inquiry.id !== questionId)); // 화면에서 삭제된 질문 제거
      console.log("✅ 질문이 삭제되었습니다.");
    } catch (error) {
      console.error("❌ 질문 삭제 중 오류 발생:", error);
    }
  };

  // 뒤로가기 처리 함수
  const handleBack = () => {
    setSelectedConversation(null);
    setIsWriting(false);
    setIsEditing(false);
  };

  // 렌더링 조건부 처리
  if (isWriting) {
    return <InquiryWriteForm onBack={handleBack} />;
  }

  if (isEditing) {
    return (
      <InquiryEditForm inquiry={selectedConversation} onBack={handleBack} />
    );
  }

  if (selectedConversation) {
    return (
      <ConversationView inquiry={selectedConversation} onBack={handleBack} />
    );
  }

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-white relative">
      <div className="flex items-center p-4 border-b">
        <ChevronLeft className="mr-4" />
        <div className="flex-grow text-center font-bold">고객센터</div>
      </div>

      <div className="flex border-b">
        <div className="flex-1 text-center p-3 font-bold border-b-2 border-blue-500 text-blue-500">
          문의내역
        </div>
      </div>

      <div className="flex-grow overflow-y-auto">
        {inquiries.length > 0 ? (
          inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="p-4 border-b hover:bg-gray-100 flex items-center justify-between"
            >
              <div
                onClick={() => setSelectedConversation(inquiry)}
                className="flex-grow"
              >
                <div className="text-sm">{inquiry.title}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {inquiry.createDate}
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => onEditClick(inquiry)}
                  className="ml-2 p-2 hover:bg-gray-200 rounded-full"
                >
                  <Edit size={16} className="text-gray-500" />
                </button>
                <button
                  onClick={() => onDeleteClick(inquiry.id)} // 삭제 버튼 클릭 시
                  className="ml-2 p-2 hover:bg-gray-200 rounded-full"
                >
                  <X size={16} className="text-red-500" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 p-4">
            문의 내역이 없습니다.
          </div>
        )}
      </div>

      {/* 문의 작성하기 버튼 */}
      <div className="p-4 border-t bg-white">
        <button
          onClick={onWriteClick}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg w-full"
        >
          문의 작성하기
        </button>
      </div>
    </div>
  );
};

export default CustomerServiceScreen;
