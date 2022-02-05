import React from "react";

const CustomBtn = ({ children, onClick, imageSrc }) => {
  return (
    <>
    <button trype="button" onClick={onClick}>
      {imageSrc && <img src={imageSrc} alt={children} />}
      {children}
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