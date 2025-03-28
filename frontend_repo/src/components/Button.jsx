import React from "react";

export default function Button({ text, onClick }) {
  return (
    <button
      className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-sm shadow-md 
                 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] 
                 hover:translate-y-[-3px] transition-transform 
                 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 
                 duration-300 ease-in-out"
      onClick={onClick}
    >
      {text}
    </button>
  );
}
