import React, { useEffect, useState } from "react";

const NaverMap = () => {
  const [map, setMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 네이버 맵 초기화
  useEffect(() => {
    const initMap = () => {
      // 네이버 맵 스크립트 로드
      const script = document.createElement("script");
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.REACT_APP_NAVER_CLIENT_ID}`;
      script.async = true;

      script.onload = () => {
        const mapOptions = {
          center: new window.naver.maps.LatLng(35.1796, 129.0756), // 부산 중심 좌표
          zoom: 13,
          zoomControl: true,
          zoomControlOptions: {
            position: window.naver.maps.Position.TOP_RIGHT,
          },
        };

        const newMap = new window.naver.maps.Map("map", mapOptions);
        setMap(newMap);
        setLoading(false);
      };

      script.onerror = (error) => {
        console.error("스크립트 로드 실패:", error);
        setError("네이버 지도 로딩 실패");
        setLoading(false);
      };

      document.body.appendChild(script);
    };

    initMap();
  }, []);

  return (
    <div className="relative w-100px h-100px h-screen">
      {loading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bg-white bg-opacity-80 p-5 rounded-lg font-bold">
          로딩 중...
        </div>
      )}

      {error && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bg-red-50 p-5 rounded-lg text-red-600 font-bold">
          {error}
        </div>
      )}

      <div id="map" className="w-full h-full"></div>
    </div>
  );
};

export default NaverMap;
