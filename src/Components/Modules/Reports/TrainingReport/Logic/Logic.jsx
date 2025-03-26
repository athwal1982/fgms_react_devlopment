import { useState, useEffect } from "react";
import { getTrainerList } from "../../../TrainingManagement/Services/Methods";
import { getTrainingReport } from "../Services/Methods";

function TrainingReportLogic() {
  debugger;
  const [gridApi, setGridApi] = useState();
  const [centerMasterID, setCenterMasterID] = useState();
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState();
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState();
  const [reportData, setReportData] = useState([]);
  const months = [
    { name: "January", value: 1 },
    { name: "February", value: 2 },
    { name: "March", value: 3 },
    { name: "April", value: 4 },
    { name: "May", value: 5 },
    { name: "June", value: 6 },
    { name: "July", value: 7 },
    { name: "August", value: 8 },
    { name: "September", valu: 9 },
    { name: "October", value: 10 },
    { name: "November", value: 11 },
    { name: "December", value: 12 },
  ];

  const years = [2025, 2024, 2023, 2022];

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const fetchAllTrainer = async () => {
    debugger;
    try {
      const response = await getTrainerList({ SPMODE: "CENTER", SPCenterID: 0 });
      let data = response.response.responseData;
      if (response.response.responseCode === 1) {
        setCenterMasterID(response.response.responseData.map(center => center.CenterMasterID));
        /*   A setCenters(
             data.map((center) => ({
               value: center.CenterMasterID,
               label: center.Center,
             }))
           ); */
        setCenters(data);

      } else {
        setCenters([]);
      }
    } catch (error) {
      console.error("Error fetching center data:", error);
    }
  };




  useEffect(() => {
    debugger;
    fetchAllTrainer();
  }, []);
 



  return {
    gridApi,
    onGridReady,
    centers,
    selectedCenter,
    setSelectedCenter,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    months,
    years,
    reportData,
    centerMasterID, setCenterMasterID,
  };
}

export default TrainingReportLogic;
