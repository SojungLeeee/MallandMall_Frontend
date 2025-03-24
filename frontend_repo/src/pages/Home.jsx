import React from "react";
import { useLocation } from "react-router-dom"; // useLocation 훅 임포트
import Banner from "../components/ui/layout/Banner";
import AllProducts from "../pages/product/AllProducts";
import Favorites from "../pages/mypage/Favorites"; // Favorites 컴포넌트 임포트

export default function Home() {
  const location = useLocation(); // 현재 경로를 확인

  return (
    <>
      <Banner />
      {location.pathname === "/favorites" ? <Favorites /> : <AllProducts />}
    </>
  );
}
