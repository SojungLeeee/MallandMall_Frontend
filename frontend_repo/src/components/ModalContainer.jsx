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
    <div>
      {" "}
      {/* Error and Loading State */}
      {loading && (
        <p className="text-center text-gray-500">이벤트를 불러오는 중...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}
      {/* Grid Layout for Events */}
      <div className="grid grid-cols-1">
        {events.map((event, index) => (
          <div key={index} className="">
            {" "}
            {/* Adding relative here for proper absolute positioning */}
            {/* Modal for each event */}
            <Modal
              isOpen={openModals[index]}
              onClose={() => toggleModal(index)}
              event={event}
            />
            {/* Event Image with hover effect */}
            <div
              className="cursor-pointer relative group flex justify-center"
              onClick={() => toggleModal(index)}
            >
              <img
                src={event.image}
                alt={event.eventTitle}
                className="object-cover shadow-md rounded-sm mt-2"
                height="30"
                width="350"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModalContainer;
