import React from "react";
import AdminButton from "../../components/ui/button/AdminButton";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();

  // 상품 관련 핸들러
  const handleProductSearch = () => {
    console.log("handleProductSearch 눌림");
    navigate("/admin/product/search");
  };

  const handleProductRegister = () => {
    navigate("/admin/product/register");
  };

  const handleProductUpdate = () => {
    navigate("/admin/product/update");
  };

  const handleProductDelete = () => {
    navigate("/admin/product/delete");
  };

  // 개별 상품 관련 핸들러
  const handleItemSearch = () => {
    navigate("/admin/item/search");
  };

  // 다른 버튼들의 핸들러도 같은 방식으로 구현...

  return (
    <div className="flex flex-col gap-4 ml-3">
      {/* 상품 버튼 그룹 */}
      <AdminButton
        text={"상품"}
        onSearch={handleProductSearch}
        onRegister={handleProductRegister}
        onUpdate={handleProductUpdate}
        onDelete={handleProductDelete}
      />

      {/* 개별 상품 버튼 그룹 */}
      <AdminButton
        text={"개별"}
        onSearch={handleItemSearch}
        onRegister={() => navigate("/admin/item/register")}
        onUpdate={() => navigate("/admin/item/update")}
        onDelete={() => navigate("/admin/item/delete")}
      />

      {/* 행사 버튼 그룹 */}
      <AdminButton
        text={"행사"}
        onSearch={() => navigate("/admin/event/search")}
        onRegister={() => navigate("/admin/event/register")}
        onUpdate={() => navigate("/admin/event/update")}
        onDelete={() => navigate("/admin/event/delete")}
      />

      {/* 지점 버튼 그룹 */}
      <AdminButton
        text={"지점"}
        onSearch={() => navigate("/admin/branch/search")}
        onRegister={() => navigate("/admin/branch/register")}
        onUpdate={() => navigate("/admin/branch/update")}
        onDelete={() => navigate("/admin/branch/delete")}
      />
    </div>
  );
}
