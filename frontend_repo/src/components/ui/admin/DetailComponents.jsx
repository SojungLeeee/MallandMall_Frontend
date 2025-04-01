import React, { useEffect, useState } from "react";

const DetailComponents = ({
  itemCode,
  fetchItemDetails,
  onItemUpdate,
  title = "상세 정보",
  submitText = "수정하기",
  successText = "수정되었습니다!",
  loadingText = "불러오는 중...",
  errorText = "정보를 불러오는 데 실패했습니다.",
  notFoundText = "정보를 찾을 수 없습니다.",
}) => {
  const [itemDetails, setItemDetails] = useState(null);
  const [editedDetails, setEditedDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!itemCode) return setLoading(false);

      try {
        const data = await fetchItemDetails(itemCode);
        setItemDetails(data);
        setEditedDetails(data); // 초기값으로 세팅
      } catch (err) {
        setError(errorText);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [itemCode, fetchItemDetails, errorText]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setEditedDetails((prevDetails) => ({
      ...prevDetails,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onItemUpdate(editedDetails); // 수정된 데이터 부모에게 전달
    alert(successText);

    // 수정 완료 후 입력 필드 초기화
    setEditedDetails({});
  };

  const renderFormFields = () => {
    const fields = Object.keys(itemDetails).filter(
      (key) =>
        ![
          "id",
          "createdAt",
          "updatedAt",
          "productCode",
          "averageRating",
        ].includes(key)
    );

    return fields.map((fieldName) => {
      const value = itemDetails[fieldName];
      let inputType = "text";

      // description 필드는 textarea로 처리
      if (fieldName === "description") {
        inputType = "textarea";
      } else if (typeof value === "number") {
        inputType = "number";
      } else if (fieldName === "startDate" || fieldName === "endDate") {
        // startDate, endDate는 datetime-local로 처리
        inputType = "datetime-local";
      }

      return (
        <div className="mb-4" key={fieldName}>
          <label className="block text-lg text-gray-800 mb-1">
            {fieldName
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())}
            :
          </label>

          {inputType === "textarea" ? (
            <textarea
              name={fieldName}
              value={editedDetails[fieldName] || ""}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              rows={4}
            />
          ) : (
            <input
              type={inputType}
              name={fieldName}
              value={editedDetails[fieldName] || ""}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          )}
        </div>
      );
    });
  };

  if (loading) return <div>{loadingText}</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!itemDetails) return <div>{notFoundText}</div>;

  return (
    <div className="mt-4 p-4 border border-gray-300 rounded-lg shadow-sm">
      <h3 className="text-xl font-medium text-gray-700 mb-4">
        {itemCode ? `${itemCode}에 대한 ${title}` : title}
      </h3>
      <form onSubmit={handleSubmit}>
        {renderFormFields()}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {submitText}
        </button>
      </form>
    </div>
  );
};

export default DetailComponents;
