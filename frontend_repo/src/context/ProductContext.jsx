import React, { createContext, useContext, useState } from "react";

// Context 생성 (export 추가)
export const ProductContext = createContext();

// Provider 컴포넌트
export const ProductProvider = ({ children }) => {
  const [product, setProduct] = useState(null); // 상품 정보
  const [inventoryQuantity, setInventoryQuantity] = useState(0); // 전체 재고량
  const [branchInventoryQuantity, setBranchInventoryQuantity] = useState(0); // 선택한 지점의 재고량
  const [branches, setBranches] = useState([]); // 지점 목록
  const [selectedBranch, setSelectedBranch] = useState(""); // 선택된 지점

  return (
    <ProductContext.Provider
      value={{
        product,
        setProduct,
        inventoryQuantity,
        setInventoryQuantity,
        branchInventoryQuantity,
        setBranchInventoryQuantity,
        branches,
        setBranches,
        selectedBranch,
        setSelectedBranch,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// useContext를 쉽게 사용하기 위한 custom hook
export const useProductContext = () => {
  return useContext(ProductContext);
};
