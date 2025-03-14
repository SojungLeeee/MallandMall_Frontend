import React from "react";

export default function SearchBar() {
  const onSearch = () => {
    const searchText = inputRef.current.value;

    if (searchText) {
      axios.get(`http://localhost:3000/recipe?query=${searchText}`);
    }
  };
  return <div></div>;
}
