import React, { useState,useEffect  } from "react";
import "./TrainingDashboard.scss";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import icon from "../../../../../src/assets/icon1.svg";
import icon1 from "../../../../../src/assets/icon2.svg";
import icon2 from "../../../../../src/assets/icon3.svg";
import icon4 from "../../../../../src/assets/icon5.svg";
import cloud from "../../../../../src/assets/CloudIcon.svg";
import training2 from "../../../../../src/assets/training2.svg";
import training3 from "../../../../../src/assets/training3.svg";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import {gettraineeDashboradData} from "../../TrainingManagement/Services/Methods";
import { pieArcLabelClasses } from "@mui/x-charts/PieChart";



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
const getCurrentMonthAndYear = () => {
    const currentDate = new Date();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); 
    const year = currentDate.getFullYear().toString();
    return { month, year };
    
  };
const TrainingDashboard = () => {
    const { month, year } = getCurrentMonthAndYear();

    const [barChartData, setBarChartData] = useState([]);
    const [moduleTrainingData, setModuleTrainingData] = useState([]);
    const [cardData, setCardData] = useState([
        { value: "0", label: "Total Agents", icon: icon, color: "#E08E3C" },
        { value: "0", label: "Active Agent", icon: icon1, color: "#E0D6D8" },
        { value: "0", label: "Completed Trainings", icon: icon2, color: "#D5B8F3" },
        { value: "0", label: "Upcoming Trainings", icon: icon4, color: "#747DE8" },
    ]);
  const userData = getSessionStorage("user");

  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);
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




  const fetchTotalAgentDetails = async () => {
    debugger;
    try {
        const formData = {
            SPViewMode: "SUPERADMINDASHBAORD",
            SPUserID: userData.CscUserID,
            SPYear: 0,
            SPMonth: 0
        };

        const response = await gettraineeDashboradData(formData);
        console.log("API Response:", response);

        if (response?.response?.responseCode === 1) {
            const data = response.response.responseData[0] || {};

            setCardData([
                { value: data.TotalAgent || "0", label: "Total Agents", icon: icon, color: "#E08E3C" },
                { value: data.TotalActiveAgent || "0", label: "Active Agent", icon: icon1, color: "#E0D6D8" },
                { value: data.CompletedTrainings || "0", label: "Completed Trainings", icon: icon2, color: "#D5B8F3" },
                { value: data.UpcomingTrainings || "0", label: "Upcoming Trainings", icon: icon4, color: "#747DE8" },
            ]);
        }
    } catch (error) {
        console.error("Error fetching trainer data:", error);
    }
};
const fetchTotalTraineeChart = async () => {
    try {
      const formData = {
        SPViewMode: "CENTERWISETRAINEE",
        SPUserID: userData.CscUserID,
        SPYear: 0,
        SPMonth: 0,
      };

      const response = await gettraineeDashboradData(formData);
      console.log("API Response:", response);

      if (response?.response?.responseCode === 1) {
        const data = response.response.responseData || [];

      
        const formattedData = data.map((item) => ({
          state: item.Center.trim(), 
          traineeCount: item.TraineeCount,
        }));

        setBarChartData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching trainee data:", error);
    }
  };
  const fetchTotalTraineeModules = async () => {
    debugger;
    try {
      const formData = {
        SPViewMode: "MODULEWISETRAINING",
        SPUserID: userData.CscUserID,
        SPYear:  selectedYear,
        SPMonth: selectedMonth,
      };
  
      const response = await gettraineeDashboradData(formData);
      console.log("API Response:", response);
  
      if (response?.response?.responseCode === 1) {
        const data = response.response.responseData || [];
  
        setModuleTrainingData(data);
      }
    } catch (error) {
      console.error("Error fetching trainee module data:", error);
    }
  };
      
 
  const fetchTotalTraineeModules1212 = async () => {
    debugger;
    try {
      const formData = {
        SPViewMode: "SUPERADMINDASHBAORD",
        SPUserID: userData.CscUserID,
        SPYear:  selectedYear,
        SPMonth: selectedMonth,
      };
  
      const response = await gettraineeDashboradData(formData);
      console.log("API Response:", response);
  
      if (response?.response?.responseCode === 1) {
        const data = response.response.responseData || [];
  
        setModuleTrainingData(data);
      }
    } catch (error) {
      console.error("Error fetching trainee module data:", error);
    }
  };
     

    useEffect(() => {
        fetchTotalAgentDetails();
        fetchTotalTraineeChart();
        // A  fetchTotalTraineeModules();
    }, []);

    useEffect(() => {
      
        fetchTotalTraineeModules();
    }, [[selectedMonth, selectedYear]]);
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
    {moduleTrainingData.map((module, index) => (
      <p key={index} className="number">
        {module.TrainingCount} <br />
        <span className="subtext">{module.TrainingName}</span>
      </p>
    ))}
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
            dataset={barChartData}
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
                dataKey: "traineeCount",
                label: "Number of Trainees",
              },
            ]}
            layout="horizontal"
            margin={{ left: 100 }}
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
      arcLabel: (item) => `${item.value}%`, // Show value inside the slices
      arcLabelMinAngle: 35, // Ensures only large enough slices have labels
      arcLabelRadius: "60%", // Pushes labels outward
      data: moduleTrainingData.length > 0
        ? moduleTrainingData.map((module, index) => ({
            id: index,
            value: module.TrainingCount,
            label: module.TrainingName,
          }))
        : [{ id: 0, value: 1, label: "No Data" }],
    },
  ]}
  sx={{
    [`& .${pieArcLabelClasses.root}`]: {
      fontWeight: "bold",
      fontSize: "12px",
    },
  }}
  width={400}
  height={250}
  style={{ marginLeft: "20px", marginTop: "50px" }}
  slotProps={{
    legend: { hidden: true }, 
  }}
/>
</div>

            </div>
        </div>

    );
};

export default TrainingDashboard;
