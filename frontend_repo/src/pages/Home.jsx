import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Banner from "../components/ui/layout/Banner";
import AllProducts from "../pages/product/AllProducts";
import Favorites from "../pages/mypage/Favorites";
import ModalContainer from "../components/ModalContainer"; // ModalContainer 컴포넌트 임포트

export default function Home() {
  const location = useLocation(); // 현재 경로를 확인
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태 관리

  // location.pathname이 '/favorites'일 때 자동으로 모달을 열지 않도록 설정
  useEffect(() => {
    if (location.pathname === "/favorites") {
      setIsModalOpen(false); // '/favorites' 페이지로 이동할 때 모달을 자동으로 열지 않도록 설정
    }
  }, [location.pathname]); // location.pathname이 변경될 때마다 실행

  return (
    <>
      <Banner />
      {/* '/favorites' 페이지일 때만 모달을 렌더링 */}
      {location.pathname === "/favorites" && (
        <ModalContainer isOpen={isModalOpen} />
      )}

      {/* '/favorites' 페이지일 때는 Favorites 컴포넌트, 그 외에는 AllProducts 컴포넌트 */}
      {location.pathname === "/favorites" ? <Favorites /> : <AllProducts />}
    </>
  );
}
