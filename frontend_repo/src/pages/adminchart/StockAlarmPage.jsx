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
    <div className="p-8 max-w-4xl mx-auto bg-white shadow-md border border-gray-200 rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center">
          <div className="bg-black text-white p-2.5 rounded-sm shadow-sm mr-3">
            <span className="text-lg">🔊</span>
          </div>
          <div className="border-l-4 border-black pl-3 py-0.5">
            <h2 className="text-lg font-bold text-gray-900">재고 이상 알림</h2>
            <p className="text-gray-500 text-xs mt-0.5">실시간 업데이트</p>
          </div>
        </div>
        <div className="bg-black text-white px-3 py-1.5 rounded-sm text-xs font-medium">
          {alerts.length}개 알림
        </div>
      </div>
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-6"></div>

      {alerts.length === 0 ? (
        <div className="bg-gray-50 p-10 rounded-lg text-center shadow-sm flex flex-col items-center justify-center min-h-[200px]">
          <div className="text-5xl mb-4 text-gray-400">🔍</div>
          <p className="text-gray-700 text-lg font-medium">
            현재 알림이 없습니다.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            새로운 알림이 생기면 여기에 표시됩니다
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {alerts.map((alert) => (
            <li
              key={alert.alertId}
              onClick={() => handleMarkAsRead(alert.alertId)}
              className={`p-5 rounded-lg cursor-pointer transition-all duration-200 ${
                alert.alertRead
                  ? "bg-white text-gray-600 border border-gray-100"
                  : "bg-white text-gray-800 border border-gray-200 shadow-sm"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="font-medium text-lg flex items-center gap-3">
                  <div className="text-red-500 text-lg">🚨</div>
                  <span className="text-gray-800">{alert.branchName}</span>
                </div>
                {!alert.alertRead && (
                  <span className="text-xs font-medium px-2.5 py-1 bg-gray-900 text-white rounded-md">
                    New
                  </span>
                )}
              </div>

              <div className="mt-4 pl-4 py-2.5 border-l-2 border-gray-300">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-gray-600 flex-shrink-0 mt-0.5">
                    <span>📈</span>
                  </div>
                  <span className="text-sm text-gray-600 text-left">
                    {alert.trendSummary}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-gray-600 flex-shrink-0 mt-0.5">
                    <span>💎</span>
                  </div>
                  <span className="text-sm text-gray-600 text-left">
                    {alert.recommendation}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 text-sm pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 font-medium">위험도</span>
                  <div className="w-20 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        alert.riskScore > 70 ? "bg-gray-900" : "bg-gray-500"
                      }`}
                      style={{ width: `${alert.riskScore}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">
                    {alert.riskScore}
                  </span>
                </div>
                <div className="text-gray-500 text-xs">
                  {alert.alertTime?.replace("T", " ").slice(0, 16)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
