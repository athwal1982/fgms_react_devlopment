import React from "react";

const Informationcard = ({ name, value }) => {
  return (
    <div className="card-container-value">
      <p className="lable">{name}</p>
      <p className="value">{value}</p>
    </div>
  );
};

export default Informationcard;
