import React, { useState, useEffect } from "react";
import { fetchFindLikeCategories } from "../api/httpCategoryService"; // Assuming your API is in a file called api.js
import { getAuthToken } from "../context/tokenProviderService";
import Modal from "../components/EventModal"; // Modal 컴포넌트 임포트
import eventImage1 from "../assets/images/event/event.png";

const ModalContainer = ({ isOpen }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = getAuthToken();
  const userId = localStorage.getItem("userId");
  const [openModals, setOpenModals] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await fetchFindLikeCategories(userId, token);
        setEvents(data);
      } catch (err) {
        setError("카테고리 불러오기 실패");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [userId, token]);

  useEffect(() => {
    if (isOpen) {
      const modalState = {};
      events.forEach((_, index) => {
        modalState[index] = true;
      });
      setOpenModals(modalState);
    }
  }, [isOpen, events]);

  const toggleModal = (index) => {
    setOpenModals((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  return (
    <div className="relative">
      <h4 className="text-xl font-semibold mb-4 text-center">
        [ 전국 지점 통합 이벤트 안내 ]
      </h4>

      {/* Error and Loading State */}
      {loading && (
        <p className="text-center text-gray-500">이벤트를 불러오는 중...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Grid Layout for Events */}
      <div className="grid grid-cols-2 gap-4">
        {events.map((event, index) => (
          <div key={index} className="mb-4">
            {/* Modal for each event */}
            <Modal
              isOpen={openModals[index]}
              onClose={() => toggleModal(index)}
              event={event}
            />

            {/* Event Image with hover effect */}
            <div
              className="cursor-pointer relative group"
              onClick={() => toggleModal(index)}
            >
              <img
                src={event.image}
                alt={event.eventTitle}
                className="w-full h-20 object-cover rounded-lg shadow-md transform transition duration-300 group-hover:scale-105"
              />

              {/* event.category 위에 표시 */}
              <div className="absolute top-0 left-0 w-full bg-black bg-opacity-50 p-2 text-white text-sm font-semibold">
                {event.category} {/* 여기에 event.category를 텍스트로 추가 */}
              </div>

              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-lg font-semibold">
                  {event.eventTitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModalContainer;
