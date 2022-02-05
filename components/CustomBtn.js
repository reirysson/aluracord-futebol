import React from "react";

const CustomBtn = ({ children, onClick }) => {
  return (
    <>
    <button trype="button" onClick={onClick}>
      <img src={children} alt={children}></img>
    </button>
    
    <style jsx>
    {`
      button {
        background-color: transparent;
        border: none;
        cursor: pointer;
        margin-left: 10px;
      }
    `}
    </style>
    </>
  );
};

export default CustomBtn;