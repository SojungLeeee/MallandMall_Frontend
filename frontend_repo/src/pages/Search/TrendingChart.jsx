import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/**
 * 트렌딩 차트 컴포넌트
 * @param {Object} props
 * @param {Array} props.data - 차트 데이터
 * @param {string} props.featureName - 특성 이름
 * @param {string} props.timeFrame - 시간 프레임 (day, week, month)
 * @returns {JSX.Element}
 */
const TrendingChart = ({ data, featureName, timeFrame }) => {
  // 시간 프레임에 따른 라벨 형식 지정
  const getTimeframeLabel = () => {
    switch (timeFrame) {
      case "day":
        return "시간별";
      case "week":
        return "요일별";
      case "month":
        return "일자별";
      default:
        return "";
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">
        <span className="text-blue-600">'{featureName}'</span> 특성{" "}
        {getTimeframeLabel()} 트렌드
      </h2>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
            <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: "4px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{ paddingTop: "10px" }}
            />
            <Line
              type="monotone"
              dataKey="positive"
              name="긍정적 언급"
              stroke="#10b981"
              strokeWidth={2}
              activeDot={{ r: 6 }}
              animationDuration={300}
            />
            <Line
              type="monotone"
              dataKey="negative"
              name="부정적 언급"
              stroke="#ef4444"
              strokeWidth={2}
              animationDuration={300}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 text-xs text-gray-500 text-right">
        마지막 업데이트: {new Date().toLocaleString()}
      </div>
    </div>
  );
};

export default TrendingChart;
