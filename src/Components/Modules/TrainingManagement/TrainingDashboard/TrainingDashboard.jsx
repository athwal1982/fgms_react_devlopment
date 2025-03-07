import React from "react";
import "./TrainingDashboard.scss";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import icon from "./Assest/icon1.svg";
import icon1 from "./Assest/icon2.svg";
import icon2 from "./Assest/icon3.svg";
import icon3 from "./Assest/icon4.svg";
import icon4 from "./Assest/icon5.svg";
import icon5 from "./Assest/icon6.svg";
import cloud from "./Assest/CloudIcon.svg";
import training1 from "./Assest/training1.svg";
import training2 from "./Assest/training2.svg";
import training3 from "./Assest/training3.svg";


const dataset = [
    { state: "Pune", seoul: 50 },
    { state: "Mumbai", seoul: 80 },
    { state: "Delhi", seoul: 120 },
    { state: "Punjab", seoul: 150 },
    { state: "Manali", seoul: 200 },
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
    { id: 0, value: 10, },
    { id: 1, value: 15, },
    { id: 2, value: 20, },
];

const TrainingDashboard = () => {
    const cardData = [
        { value: "500", label: "Total Agents", icon: icon, color: "#E08E3C" },
        { value: "275", label: "Active Agent", icon: icon1, color: "#E0D6D8" },
        { value: "225", label: "Inactive Agent", icon: icon2, color: "#D5B8F3" },
        { value: "50", label: "New On-boarding", icon: icon3, color: "#A4D3D3" },
        { value: "05", label: "Disabled/Blocked", icon: icon4, color: "#747DE8" },
        { value: "50", label: "Total Terminated", icon: icon5, color: "#C5CFC5" },
    ];

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
                        {card.value} <span>{card.label}</span>
                    </div>
                ))}
            </div>

            <div className="training-status">
                <div className="month">
                    <div className="month-info">
                        <p className="month-status">Current Month Training Status</p>
                        <h3>November 2024</h3>
                    </div>
                    <button className="export-btn">
                        <img src={cloud} style={{ backgroundColor: "white" }} />
                        &nbsp;Export
                    </button>
                </div>
                <div className="training-cards">
                    <div className="training-card1">
                        <div className="icon">
                            <img src={training1} />
                        </div>
                        <h4>Total Training</h4>
                        <p className="number">1200</p>
                        <p className="subtext">Till Nov 2024</p>
                    </div>
                    <div className="training-card2">
                        <div className="icon">
                            <img src={training2} />
                        </div>
                        <h4>Status</h4>
                        <div>
                            <p className="number">1200</p>
                            <p className="subtext">Completed</p>
                        </div>
                        <div>
                            <p className="number">1200</p>
                            <p className="subtext">Pending</p>
                        </div>
                    </div>

                    <div className="training-card3">
                        <div className="icon">
                            <img src={training3} />
                        </div>
                        <h4>Module Wise Training</h4>
                        <div className="number-container">
                            <p className="number">300 <br /><span className="subtext">Onboard</span></p>
                            <p className="number">300 <br /><span className="subtext">Refresher</span></p>
                            <p className="number">300 <br /><span className="subtext">Soft Skill</span></p>
                            <p className="number">300 <br /><span className="subtext">Technical Skill</span></p>
                        </div>
                    </div>
                </div>
            </div>


            <div className="charts-container">
                <div className="chart-box">
                    <div className="chart-header">
                        <h3>State Wise Agent Details</h3>
                        <div className="chart-dropdown" aria-disabled>Total Number of Agents: 233</div>
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
                                label: "State Wise Trainee",
                            },
                        ]}
                        layout="horizontal"
                        margin={{ left: 70 }} 
                        {...chartSettingBar}
                    />

                </div>

                <div className="chart-box-PieChart">
                    <div className="chart-header">
                        <h3>Training Status</h3><br />
                        <div className="badges">
                            <span className="badge">Batch</span>
                            <span className="badge">Modules</span>
                        </div>
                        <select className="chart-dropdown">
                            <option value="all">All</option>
                            <option value="seriesA">Series A</option>
                            <option value="seriesB">Series B</option>
                            <option value="seriesC">Series C</option>
                        </select>
                    </div>
                    <PieChart series={[{ data: pieData, label: "State Wise Trainee" }]} style={{ marginLeft: "100px", marginTop: "40px" }}    {...chartSettingPie} />
                </div>
            </div>
        </div>

    );
};

export default TrainingDashboard;
