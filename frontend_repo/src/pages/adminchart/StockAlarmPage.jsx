"use client";

import { useEffect, useState } from "react";
import { fetchAllAlerts, markAlertAsRead } from "../../api/alertService";

export default function StockAlarmPage() {
  const [alerts, setAlerts] = useState([]);

  const loadAlerts = async () => {
    try {
      const res = await fetchAllAlerts();
      setAlerts(res);
    } catch (err) {
      console.error("알림 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    loadAlerts();
    const interval = setInterval(loadAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (alertId) => {
    try {
      await markAlertAsRead(alertId);
      await loadAlerts();
    } catch (err) {
      console.error("읽음 처리 실패:", err);
    }
  };

  return (
    <div className="p-5 max-w-4xl mx-auto bg-white shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-300">
        <div className="flex items-center gap-3">
          <div className="bg-gray-800 text-white p-2 rounded-lg shadow-md">
            <span className="text-xl">🔊</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            재고 이상 알림 목록
          </h2>
        </div>
        <div className="bg-gray-100 px-2 py-1 m-1 rounded-full text-gray-700 text-sm font-medium shadow-sm border border-gray-200">
          {alerts.length}개의 알림
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="bg-white p-10 rounded-sm text-center shadow-md border border-gray-100 flex flex-col items-center justify-center min-h-[200px]">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-500 text-lg">현재 알림이 없습니다.</p>
          <p className="text-gray-400 text-sm mt-2">
            새로운 알림이 생기면 여기에 표시됩니다
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {alerts.map((alert) => (
            <li
              key={alert.alertId}
              onClick={() => handleMarkAsRead(alert.alertId)}
              className={`p-5 rounded-sm cursor-pointer transition-all duration-300 border ${
                alert.alertRead
                  ? "bg-white text-gray-600 border-gray-400"
                  : "bg-white text-black border-gray-400"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="font-semibold text-lg flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gray-100">
                    <span className="text-red-500">🚨</span>
                  </div>
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 border text-sm border-gray-300">
                    [{alert.productCode}]
                  </span>
                  <span className="text-gray-800">{alert.branchName}</span>
                </div>
                {!alert.alertRead && (
                  <span className="text-xs font-semibold px-3 py-1 bg-orange-600 text-white rounded-full shadow-sm">
                    New
                  </span>
                )}
              </div>

              <div className="mt-4 pl-3 border-l-4 border-gray-300 py-2 bg-gray-50 rounded-r-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-gray-200 p-1 rounded text-gray-600 flex-shrink-0">
                    <span>📈</span>
                  </div>
                  <span className="text-sm">{alert.trendSummary}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-gray-200 p-1 rounded text-gray-600 flex-shrink-0">
                    <span>💎</span>
                  </div>
                  <span className="text-sm">{alert.recommendation}</span>
                </div>
              </div>

              <div className="flex justify-between mt-4 text-sm pt-3 border-t border-dashed border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">위험도:</span>
                  <div className="relative w-16 h-6 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`absolute top-0 left-0 h-full rounded-full ${
                        alert.riskScore > 70 ? "bg-red-500" : "bg-gray-400"
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
