import React, { useEffect, useState } from "react";
import { fetchFindAllProductCode } from "../../api/httpAdminService";

export default function AdminAllProducts() {
  //error 를 저장하는 state 작성
  const [error, setError] = useState(null);

  //httpService.js와 연동해서 응답받은 userList 를 관리하는 state 작성
  const [productData, setProductData] = useState([]);

  //서버에서 한번만 가져오면 될 것 같아서 빈배열 줌줌
  useEffect(() => {
    //함수 안에서 httpService.js 의 fetchUserList(n) 호출
    async function xxx() {
      try {
        var productCodeList = await fetchFindAllProductCode();
        setProductData(productCodeList);
        //console.log("App.response : ",userList);
      } catch (error1) {
        console.log("Error.name : ", error1.name);
        console.log("Error.message : ", error1.message);
        setError({ mesg: error1.message });
      }
    }

    xxx();
  }, []);

  return (
    <div className="App">
      {error && <ResponseError message={error} />}
      <h2>App 컴포넌트</h2>
      <hr></hr>
      <UserList data={userData} />
    </div>
  );
}
