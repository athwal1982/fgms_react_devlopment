import React, { useState } from "react";
import "./TraineeDashboard.scss";
import icon from "../../../../assets/icon1.svg";
import icon4 from "../../../../assets/icon5.svg";
import cloud from "../../../../assets/CloudIcon.svg";
import training3 from "../../../../assets/training3.svg";

const TraineeDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState("March");
  const [selectedYear, setSelectedYear] = useState("2024");


  const cardData = [
    { value: "40 hr", label: "Total Hours", icon: icon, color: "#E08E3C" },
    { value: "12", label: "Total Number of Trainings", icon: icon4, color: "#747DE8" }
  ];

  const agentData = [
    { value: "1", label: "Technical ", color: "#4CAF50" },
    { value: "1", label: "Soft Skills ", color: "#FF9800" },
    { value: "1", label: "Compliance ", color: "#2196F3" },
    { value: "1", label: "LMS ", color: "#2196F3" },
    { value: "1", label: "Refresher ", color: "#2196F3" }, 
    { value: "1", label: "onboard ", color: "#2136F3" }

  ];

    const fetchAllTrainer = async () => {
          try {
              const formData ={
                SPViewMode:"TRAINEEDASHBOARD",
                SPUserID:"311178",
                SPStartDate:"2025-03-01",
                SPEndDate:"2025-03-26"
            
            };
              const response = await getAgentTraining(formData);
              console.log("API Response:", response);
      
              let data = response.response.responseData.result;
              let responseCode = response.response.responseCode || 0;
      
              if (responseCode === 1) {
                  const transformedData = data.map(item => {
                      const minutes = parseInt(item.Duration, 10) || 0;
                      const hours = Math.floor(minutes / 60);
                      const remainingMinutes = minutes % 60;
                      const formattedDuration = hours > 0 
                          ? `${hours} hrs ${remainingMinutes} mins`
                          : `${remainingMinutes} mins`;
      
                      return {
                          ...item,
                          IsPresent: item.IsPresent === "Y" ? "Present" : item.IsPresent === "N" ? "Absent" : item.IsPresent,
                          Duration: formattedDuration
                      };
                  });
                  setRowData(transformedData);
              } else {
                  setRowData([]);
              }
          } catch (error) {
              console.error("Error fetching trainer data:", error);
              setRowData([]);
          }
      };


  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = ["2025", "2024", "2023", "2022"];
  
  return (
    <div className="dashboard-container-header">
      <div className="header-trainee">
        {cardData.map((card, index) => (
          <div className="card" key={index} style={{ "--card-hover-color": card.color }}>
            <img src={card.icon} alt="icon" className="card-icon" style={{ backgroundColor: `${card.color}30` }} />
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
            <p className="month-status">Month Wise Training Status</p>
            <div className="dropdown-container">
              <select className="month-dropdown" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                {months.map((month, index) => (
                  <option key={index} value={month}>{month}</option>
                ))}
              </select>
              <select className="month-dropdown-year" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                {years.map((year, index) => (
                  <option key={index} value={year}>{year}</option>
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
