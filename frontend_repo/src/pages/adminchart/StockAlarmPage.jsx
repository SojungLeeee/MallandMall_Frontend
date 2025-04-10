"use client";

import { useEffect, useState } from "react";
import { fetchAllAlerts, markAlertAsRead } from "../../api/alertService";

export default function StockAlarmPage() {
  const [alerts, setAlerts] = useState([]);

  // 알림 목록 불러오기
  const loadAlerts = async () => {
    try {
      const res = await fetchAllAlerts();
      setAlerts(res);
    } catch (err) {
      console.error("알림 불러오기 실패:", err);
    }
  };

  // 최초 + 30초마다 polling
  useEffect(() => {
    loadAlerts();
    const interval = setInterval(loadAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  // 알림 클릭 시 읽음 처리
  const handleMarkAsRead = async (alertId) => {
    try {
      await markAlertAsRead(alertId);
      await loadAlerts(); // 갱신
    } catch (err) {
      console.error("읽음 처리 실패:", err);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl shadow-lg border border-blue-100">
      <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-blue-200">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 text-white p-2 rounded-lg shadow-md">
            <span className="text-xl">🔊</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-amber-500 to-red-500 bg-clip-text text-transparent">
            재고 이상 알림 목록
          </h2>
        </div>
        <div className="bg-blue-100 px-3 py-1 rounded-full text-blue-600 text-sm font-medium shadow-sm border border-blue-200">
          {alerts.length}개의 알림
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="bg-white p-10 rounded-xl text-center shadow-md border border-gray-100 flex flex-col items-center justify-center min-h-[200px]">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-500 text-lg">현재 알림이 없습니다.</p>
          <p className="text-gray-400 text-sm mt-2">새로운 알림이 생기면 여기에 표시됩니다</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {alerts.map((alert) => (
            <li
              key={alert.alertId}
              onClick={() => handleMarkAsRead(alert.alertId)}
              className={`p-5 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.01] hover:shadow-xl ${
                alert.alertRead
                  ? "bg-white text-gray-600 border border-gray-100 shadow-sm"
                  : "bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 text-gray-800 border border-yellow-200 shadow-md"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="font-semibold text-lg flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${alert.alertRead ? "bg-gray-100" : "bg-amber-100"}`}>
                    <span className="text-amber-600">🚨</span>
                  </div>
                  <span className="bg-blue-50 px-2 py-0.5 rounded text-blue-700 border border-blue-100">
                    [{alert.productCode}]
                  </span>
                  <span className="text-gray-700">{alert.branchName}</span>
                </div>
                {!alert.alertRead && (
                  <span className="text-xs font-semibold px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full shadow-sm animate-pulse">
                    New
                  </span>
                )}
              </div>

              <div className="mt-4 pl-3 border-l-3 border-amber-300 py-2 bg-amber-50 bg-opacity-50 rounded-r-lg">
                <div className="flex items-start gap-2 mb-3">
                  <div className="bg-blue-100 p-1 rounded text-blue-600 flex-shrink-0">
                    <span>📈</span>
                  </div>
                  <span className="font-medium">{alert.trendSummary}</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-green-100 p-1 rounded text-green-600 flex-shrink-0">
                    <span>💎</span>
                  </div>
                  <span>{alert.recommendation}</span>
                </div>
              </div>

              <div className="flex justify-between mt-4 text-sm pt-3 border-t border-dashed border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">위험도:</span>
                  <div className="relative w-16 h-6 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`absolute top-0 left-0 h-full rounded-full ${
                        alert.riskScore > 70 ? "bg-red-500" : alert.riskScore > 40 ? "bg-amber-500" : "bg-green-500"
                      }`}
                      style={{ width: `${alert.riskScore}%` }}
                    ></div>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow-md">
                      {alert.riskScore}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <span className="text-xs">⏰</span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                    {alert.alertTime?.replace("T", " ").slice(0, 16)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
