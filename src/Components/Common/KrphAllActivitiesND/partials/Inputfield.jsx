import React from "react";

const Inputfield = ({ lable, onchage, placeholder, type, value, disabled }) => {
  return (
    <div className="form-group">
      <label>{lable}</label>
      <input type={type} className="form-control" placeholder={placeholder} value={value} onchage={onchage} disabled={disabled ? true : false} />
    </div>
  );
};

export default Inputfield;
