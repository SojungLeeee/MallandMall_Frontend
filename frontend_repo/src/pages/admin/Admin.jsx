import React from "react";
import AdminButton from "../../components/ui/AdminButton";
export default function Admin() {
  return (
    <div className="flex flex-col gap-4 ml-3">
      {/*상품코드 작성 div만들어서 작성하세요*/}
      <AdminButton text={"상품"} className="w-2 h-1" />
      {/*개별상품 작성 div만들어서 작성하세요*/}
      <AdminButton text={"개별"} />

      <AdminButton text={"행사"} />
      <AdminButton text={"지점"} />
    </div>
  );
}
