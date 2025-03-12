import React, { useState } from "react";
import "./TraineeDashboard.scss";
import icon from "./Assest/icon1.svg";
import icon4 from "./Assest/icon5.svg";
import cloud from "./Assest/CloudIcon.svg";
import training3 from "./Assest/training3.svg";

const TraineeDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState("March 2024");

  const months = [
    "January ",
    "February ",
    "March ",
    "April ",
    "May ",
    "June ",
  ];
  const years = [
    "2025 ",
    "2024 ",
  ];

  const cardData = [
    { value: "40 hr", label: "Total hours", icon: icon, color: "#E08E3C" },
    { value: "6", label: "Total Number of Training", icon: icon4, color: "#747DE8" },
  ];

  const agentData = [
    { value: "1", label: "On-Boarding Training", color: "#C0702E" },
    { value: "1", label: "Refresher Training", color: "rgb(238, 114, 139)" },
    { value: "1", label: "Technical Training", color: "#B292D9" },
    { value: "1", label: "LMS Training", color: "#82B1B1" },
    { value: "1", label: "Soft Training", color: "#575FBF" },
    { value: "1", label: "Rejoinee Training", color: "rgb(112, 234, 112)" },
  ];

  return (
    <div className="dashboard-container-header">
      <div className="header">
        {cardData.map((card, index) => (
          <div className="card" key={index} style={{ "--card-hover-color": card.color }}>
            <img src={card.icon} alt="icon" className="card-icon" style={{ backgroundColor: card.color + "30" }} />
            <span style={{ fontSize: "22px", fontWeight: "bold", color: "black" }}>{card.value}</span>
            <span className="card-label" style={{ fontSize: "18px", fontWeight: "600", color: card.color }}>
              {card.label}
            </span>
          </div>
        ))}
      </div>

      <div className="training-status">
        <div className="month">
          <div className="month-info">
            <p className="month-status">Current Month Training Status</p>
            
            {/* ✅ Dropdown is now inside a div to prevent collapsing issues */}
            <div className="dropdown-container">
              <select
                className="month-dropdown"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {months.map((month, index) => (
                  <option key={index} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                className="month-dropdown-year"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {years.map((month, index) => (
                  <option key={index} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button className="export-btn">
            <img src={cloud} alt="Export" style={{ backgroundColor: "white" }} />
            &nbsp;Export
          </button>
        </div>

        <div className="training-cards">
          <div className="training-card3-header">
            <div className="icon">
              <img src={training3} alt="training" />
            </div>
            <h4>Module Wise Training</h4>
            <div className="number-container">
              {agentData.map((item, index) => (
                <p key={index} style={{ color: item.color }}>
                  {item.value} <br /> {item.label}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TraineeDashboard;
