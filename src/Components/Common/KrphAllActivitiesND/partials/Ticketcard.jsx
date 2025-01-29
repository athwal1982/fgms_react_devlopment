import React from "react";

const Ticketcard = ({ bgclass, name, value, img }) => {
  return (
    <div className={`ticket-card ${bgclass}`}>
      <div className="left-card">
        <p className="title_name">{name}</p>
        <p className="card_value">{value}</p>
      </div>
      <div className="right-card">
        <img src={img} className="w-100" alt="" />
      </div>
    </div>
  );
};

export default Ticketcard;
