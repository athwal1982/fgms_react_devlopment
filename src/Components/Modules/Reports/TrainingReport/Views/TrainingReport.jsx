import React, { useState } from "react";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import PropTypes from "prop-types";
import * as XLSX from "xlsx"; 
import BizClass from "./TrainingReport.module.scss";
import TrainingReportLogic from "../Logic/Logic";
import { getTrainingReport } from "../Services/Methods";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";


const TrainingReport = () => {
  const {
    centers,
    selectedCenter,
    setSelectedCenter,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    months,
    years,
  } = TrainingReportLogic();
   const setAlertMessage = AlertMessage();
  
  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(""); 
  const fetchReport = async () => {
    const formData = {
      SPViewMode: "SUPERADMINREPORT",
      SPMonth: selectedMonth?.value,
      SPYear: selectedYear?.value ? parseInt(selectedYear.value, 10) : null,
      SPCenterMasterID: selectedCenter?.value || 0,
    };

    try {
      const response = await getTrainingReport(formData);
      if (response.responseCode === 1) {
        setReportData(response.responseData);
        setFilteredData(response.responseData);
      } else {
        setReportData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
    }
  };
  
  const handleLocalSearch = (query) => {
    setSearchQuery(query);
    
    if (query.trim() === "") {
      setFilteredData(reportData);
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = reportData.filter((row) =>
        Object.values(row).some(
          (value) => value && value.toString().toLowerCase().includes(lowerQuery)
        )
      );
      setFilteredData(filtered);
    }
  };

  const exportToXLS = () => {
    if (!reportData.length) {
      setAlertMessage({
        type: "error",
        message: "No Records to Download",
      });
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Training Report");


    XLSX.writeFile(workbook, "Training_Report.xlsx");
  };

  return (
    <div className={BizClass.PageStart}>
      <PageBar>
        <PageBar.Select
          label="Year"
          options={years.map((year) => ({ value: year, label: year }))}
          value={selectedYear || ""}
          onChange={(newValue) => setSelectedYear(newValue)}
        />

        <PageBar.Select
          label="Month"
          options={months.map((month) => ({ value: month.value, label: month.name }))}
          value={selectedMonth || ""}
          onChange={(newValue) => setSelectedMonth(newValue)}
        />

        <PageBar.Select
          label="Center"
          options={centers.map((center) => ({ value: center.CenterMasterID, label: center.Center }))}
          value={selectedCenter || ""}
          onChange={(newValue) => setSelectedCenter(newValue)}
        />

        <PageBar.Search   value={searchQuery} onChange={(e) => handleLocalSearch(e.target.value)} onClick={fetchReport} />
     
        <PageBar.Button onClick={() => { setSelectedMonth(""); setSelectedYear(""); setSelectedCenter(""); }} title="Clear">
          Clear
        </PageBar.Button>
        <PageBar.ExcelButton onClick={exportToXLS}>Export</PageBar.ExcelButton>
      </PageBar>

      <DataGrid rowData={filteredData} pagination={true}>
  <DataGrid.Column 
    headerName="Sr. No." 
    width={100} 
    valueGetter={(params) => params.node.rowIndex + 1} 
  />
  <DataGrid.Column field="agent_name" headerName="Agent Name" width={150} />
  <DataGrid.Column field="agent_number" headerName="Agent Number" width={150} />
  <DataGrid.Column field="CenterName" headerName="Center Name" width={150} />
  <DataGrid.Column field="date_of_joining" headerName="Date of Joining" width={150} />
  <DataGrid.Column 
    field="IsPresent" 
    headerName="Present" 
    width={100}  
    valueGetter={(params) => {
      if (params.data.IsPresent === "Y") return "Present";
      if (params.data.IsPresent === "N") return "Absent";
      return params.data.IsPresent; 
    }}
  />
  <DataGrid.Column field="TrainingScore" headerName="Score" width={100} />
  <DataGrid.Column field="TrainingTitle" headerName="Training Title" width={200} />
  <DataGrid.Column field="TrainingMeetingLink" headerName="Meeting Link" width={300} />
  <DataGrid.Column field="training_hours" headerName="Training Hours" width={100} />
  <DataGrid.Column field="training_type" headerName="Training Type" width={150} />
  <DataGrid.Column field="date" headerName="Training Date" width={150} />
</DataGrid>

    </div>
  );
};

TrainingReport.propTypes = {
  centers: PropTypes.array.isRequired,
  selectedCenter: PropTypes.string.isRequired,
  setSelectedCenter: PropTypes.func.isRequired,
  selectedYear: PropTypes.string.isRequired,
  setSelectedYear: PropTypes.func.isRequired,
  selectedMonth: PropTypes.string.isRequired,
  setSelectedMonth: PropTypes.func.isRequired,
  months: PropTypes.array.isRequired,
  years: PropTypes.array.isRequired,
  reportData: PropTypes.array.isRequired,
};

export default TrainingReport;
