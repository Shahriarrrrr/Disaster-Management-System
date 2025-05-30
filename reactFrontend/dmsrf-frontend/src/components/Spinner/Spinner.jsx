// src/components/Spinner.jsx
import React from "react";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-12 h-12 border-4 border-green-500 border-dashed rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;
