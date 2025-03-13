import React from "react";

export default function Button({ text, onClick }) {
  return (
    <button
      className="bg-brand text-white px-4 py-2 rounded-md font-semibold shadow-md hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-opacity-50 transition duration-200 ease-in-out"
      onClick={onClick}
    >
      {text}
    </button>
  );
}
