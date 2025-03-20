import React, { useEffect, useState } from "react";
import "./TraineeDashboard.scss";
import icon from "../../../../assets/icon1.svg";
import icon4 from "../../../../assets/icon5.svg";
import training3 from "../../../../assets/training3.svg";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import {gettraineeDashboradData} from "../../TrainingManagement/Services/Methods";

const getCurrentMonthAndYear = () => {
  const currentDate = new Date();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); 
  const year = currentDate.getFullYear().toString();
  return { month, year };
};

const TraineeDashboard = () => {
  const { month, year } = getCurrentMonthAndYear();
  const userData = getSessionStorage("user");

  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);
  const [totalTrainingHours, setTotalTrainingHours] = useState("0 hr");
  const [totalTrainings, setTotalTrainings] = useState("0");
  const [moduleTraining, setModuleTraining] = useState({});

  const months = [
    { name: "January", value: "01" },
    { name: "February", value: "02" },
    { name: "March", value: "03" },
    { name: "April", value: "04" },
    { name: "May", value: "05" },
    { name: "June", value: "06" },
    { name: "July", value: "07" },
    { name: "August", value: "08" },
    { name: "September", value: "09" },
    { name: "October", value: "10" },
    { name: "November", value: "11" },
    { name: "December", value: "12" },
  ];
  const years = ["2025"];
  const moduleColors = ["#2196F3", "#E91E63", "#4CAF50", "#FF9800", "#9C27B0", "#795548"]; 
  const fetchAllTrainer = async () => {
    debugger;
    try {
      const formData = {
        SPViewMode: "TRAINEEDASHBOARD",
        SPUserID: userData.CscUserID,
        SPYear: selectedYear,
        SPMonth: selectedMonth,
      };

      const response = await gettraineeDashboradData(formData);
      console.log("API Response:", response);

      if (response?.response?.responseCode === 1) {
        const data = response.response.responseData[0] || {};
        
        const hours = Math.floor(data.totalTrainingHours / 60);
        const minutes = data.totalTrainingHours % 60;
        const formattedHours = hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;

        setTotalTrainingHours(formattedHours);
        setTotalTrainings(data.totalTraining || "0");
        setModuleTraining(data.moduleTraining || {});
      } else {
        setTotalTrainingHours("0 hr");
        setTotalTrainings("0");
        setModuleTraining({});
      }
    } catch (error) {
      console.error("Error fetching trainer data:", error);
      setTotalTrainingHours("0 hr");
      setTotalTrainings("0");
      setModuleTraining({});
    }
  };

  useEffect(() => {
    fetchAllTrainer();
  }, [selectedMonth, selectedYear]);

  return (
    <div className="dashboard-container-header">
       <div className="common-header">
       <div className="dropdown-container">
              <select
                className="month-dropdown"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {months.map((month, index) => (
                  <option key={index} value={month.value}>
                    {month.name}
                  </option>
                ))}
              </select>
              <select
                className="month-dropdown-year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {years.map((year, index) => (
                  <option key={index} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
      </div>
      <div className="header-trainee">
        <div className="card" style={{ "--card-hover-color": "#E08E3C" }}>
          <img src={icon} alt="icon" className="card-icon" style={{ backgroundColor: "#E08E3C30" }} />
          <span style={{ fontSize: "22px", fontWeight: "bold", color: "black" }}>{totalTrainingHours}</span>
          <span className="card-label" style={{ fontSize: "18px", fontWeight: "600", color: "#E08E3C" }}>
            Total Hours
          </span>
        </div>
        <div className="card" style={{ "--card-hover-color": "#747DE8" }}>
          <img src={icon4} alt="icon" className="card-icon" style={{ backgroundColor: "#747DE830" }} />
          <span style={{ fontSize: "22px", fontWeight: "bold", color: "black" }}>{totalTrainings}</span>
          <span className="card-label" style={{ fontSize: "18px", fontWeight: "600", color: "#747DE8" }}>
            Total Number of Trainings
          </span>
        </div>
      </div>

      <div className="training-status">
        <div className="month">
          <div className="month-info">
            <p className="month-status">Training Status</p>
          
          </div>
          {/* <button className="export-btn">
            <img src={cloud} alt="Export" style={{ backgroundColor: "white" }} />
            &nbsp;Export
          </button> */}
        </div>

        <div className="training-cards">
  <div className="training-card3-header">
    <div className="icon">
      <img src={training3} alt="training" />
    </div>
    <h4>Module Wise Training</h4>
    <div className="number-container">
      {Object.entries(moduleTraining).map(([key, value], index) => (
        <p key={index} style={{ color: moduleColors[index % moduleColors.length] }}>
          {value} <br />  {key}
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
