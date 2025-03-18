import React, { useState } from "react";
import "./TrainingDashboard.scss";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import icon from "../../../../../src/assets/icon1.svg";
import icon1 from "../../../../../src/assets/icon2.svg";;
import icon2 from "../../../../../src/assets/icon3.svg";
import icon4 from "../../../../../src/assets/icon5.svg";
import cloud from "../../../../../src/assets/CloudIcon.svg";
import training2 from "../../../../../src/assets/training2.svg";
import training3 from "../../../../../src/assets/training3.svg";


const dataset = [
    { state: "Pune", seoul: 50 },
    { state: "Mumbai", seoul: 80 },
    { state: "Delhi", seoul: 120 },
    { state: "Punjab", seoul: 150 },
    { state: "chennai", seoul: 200 },
];

const chartSettingBar = {
    width: 500,
    height: 400,
};

const chartSettingPie = {
    width: 300,
    height: 300,

};

const pieData = [
    { id: 0, value: 13,label: "Onboard" },
    { id: 1, value: 10, label:"Refresher"},
    { id: 2, value: 5, label:"Soft Skill" },
    { id: 3, value: 25, label: "Technical Skill"},
    { id: 4, value: 8,  label: "LMS"},
    { id: 5, value: 11,  label: "Rejoining"},
];

const TrainingDashboard = () => {
    const cardData = [
        { value: "500", label: "Total Agents", icon: icon, color: "#E08E3C" },
        { value: "275", label: "Active Agent", icon: icon1, color: "#E0D6D8" },
        { value: "225", label: "Inactive Agent", icon: icon2, color: "#D5B8F3" },

        { value: "05", label: "Disabled/Blocked", icon: icon4, color: "#747DE8" },

    ];
  const [selectedMonth, setSelectedMonth] = useState("March");
  const [selectedYear, setSelectedYear] = useState("2024");
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = ["2025", "2024", "2023", "2022"];
    return (
        <div className="dashboard-container">
            <div className="header">
                {cardData.map((card, index) => (
                    <div
                        className="card"
                        key={index}
                        style={{ "--card-hover-color": card.color }}
                    >
                        <img
                            src={card.icon}
                            alt="icon"
                            className="card-icon"
                            style={{ backgroundColor: card.color + "30" }}
                        />
                      <strong>  {card.value} </strong><span>{card.label}</span>
                    </div>
                ))}
            </div>

            <div className="training-status">
                <div className="month">
                    <div className="month-info">
                        <p className="month-status">Current Month Training Status</p>
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
                        <img src={cloud} style={{ backgroundColor: "white" }} />
                        &nbsp;Export
                    </button>
                </div>
                <div className="training-cards">

                    <div className="training-card2">
                        <div className="icon">
                            <img src={training2} />
                        </div>
                        <h4>Training Status</h4>
                        <div>
                            <p className="number">6</p>
                            <p className="subtext">Completed</p>
                        </div>
                        <div>
                            <p className="number">12</p>
                            <p className="subtext">Training scheduled</p>
                        </div>
                    </div>

                    <div className="training-card3">
                        <div className="icon">
                            <img src={training3} />
                        </div>
                        <h4>Module Wise Training</h4>
                        <div className="number-container">
                            <p className="number">13 <br /><span className="subtext">Onboard</span></p>
                            <p className="number">10 <br /><span className="subtext">Refresher</span></p>
                            <p className="number">5 <br /><span className="subtext">Soft Skill</span></p>
                            <p className="number">25 <br /><span className="subtext">Technical Skill</span></p>
                            <p className="number">8 <br /><span className="subtext">LMS</span></p>
                            <p className="number">11 <br /><span className="subtext">Rejoining</span></p>
                        </div>
                    </div>
                </div>
            </div>


            <div className="charts-container">
                <div className="chart-box">
                    <div className="chart-header">
                        <h3>Center Wise Trainee Details</h3>
                      
                    </div>
                    <BarChart
                        dataset={dataset}
                        yAxis={[
                            {
                                scaleType: "band",
                                dataKey: "state",
                                tickLabelProps: () => ({
                                    fontSize: 12,
                                    textAnchor: "start",
                                    dx: 5,
                                }),
                            },
                        ]}
                        series={[
                            {
                                dataKey: "seoul",
                                label: "Number of trainee",
                            },
                        ]}
                        layout="horizontal"
                        margin={{ left: 70 }}
                        {...chartSettingBar}
                    />

                </div>

                <div className="chart-box-PieChart">
                    <div className="chart-header">
                        <h3>Training Module</h3><br />

                    </div>
                    <PieChart
                        series={[
                            {
                                data: [
                                    { id: 0, value: 13,label: "Onboard" },
                                    { id: 1, value: 10, label:"Refresher"},
                                    { id: 2, value: 5, label:"Soft Skill" },
                                    { id: 3, value: 25, label: "Technical Skill"},
                                    { id: 4, value: 8,  label: "LMS"},
                                    { id: 5, value: 11,  label: "Rejoining"},
                                ],
                            },
                        ]}
                     
                        style={{ marginLeft: "9px", marginTop: "80px", }}
                        width={400}
                        height={200}
                    />
                </div>
            </div>
        </div>

    );
};

export default TrainingDashboard;
