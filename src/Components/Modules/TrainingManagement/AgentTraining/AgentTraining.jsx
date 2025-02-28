import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import { Convert24FourHourAndMinute, dateToSpecificFormat } from "Configration/Utilities/dateformat";
import moment from "moment";
import "./AgentTraining.scss";
import { AlertMessage } from "../../../../Framework/Components/Widgets/Notification/NotificationProvider";
import {  getAgentTraining } from "../Services/Methods";
import _ from "lodash";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";

const AgentTraining = () => {
  const setAlertMessage = AlertMessage();
  const navigate = useNavigate();

  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  const userData = getSessionStorage("user");
  const CscUserID = userData.CscUserID;
 


    const fetchAllTrainer = async () => {
        debugger;
      const formData = {
        SPUserID:CscUserID,
        SPMode:"USERTRAINING"
    };
      try {
        const response = await getAgentTraining(formData);
        let data = response.response.responseData;
        let responseCode = response.response.responseCode;
  
        if (responseCode === 1) {
            setRowData(data);
            setFilteredData(data);
  
        } else {
            setRowData([]);
            setFilteredData();
  
        }
      } catch (error) {
        console.error("Error fetching trainer data:", error);
      }
    };
 




 






  
 

    const ActionCellRenderer = (props) => {
        const { TrainingDate, StartTime, EndTime, TrainingLink } = props.data;
      
        // Get the current date & time
        const currentDateTime = moment();
      
        // Convert Training Date & Time to a valid DateTime format
        const trainingStartDateTime = moment(`${TrainingDate} ${StartTime}`, "YYYY-MM-DD HH:mm").subtract(15, "minutes");
  const trainingEndDateTime = moment(`${TrainingDate} ${EndTime}`, "YYYY-MM-DD HH:mm").add(15, "minutes");
      
        // Check if the meeting is active
        const isMeetingActive = currentDateTime.isBetween(trainingStartDateTime, trainingEndDateTime);
      
        return (
          <>
            {TrainingLink && (
              <a
                href={isMeetingActive ? TrainingLink : undefined} // Remove href if disabled
                target={isMeetingActive ? "_blank" : ""}
                rel="noopener noreferrer"
                title="Join Meeting"
                style={{
                  color: isMeetingActive ? "#075307" : "gray",
                  textDecoration: "none",
                  marginRight: "10px",
                  pointerEvents: isMeetingActive ? "auto" : "none", // Fully disables clicking
                  opacity: isMeetingActive ? 1 : 0.5, // Makes it look faded if disabled
                  cursor: isMeetingActive ? "pointer" : "default", // Changes cursor style
                }}
              >
                <i className="fas fa-video"></i>
              </a>
            )}
          </>
        );
      };
      
      
  



  const [columnDefs] = useState([


    {
      headerName: "Action",
      field: "action",
      cellRenderer: ActionCellRenderer,
      width: 100,
      cellStyle: { textAlign: "center" },
    },
  
    {
      headerName: "Training Type",
      field: "TrainingType",
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: "Training Title",
      field: "TrainingTitle",
      sortable: true,
      filter: true,
      width: 200,
    },

    {
      headerName: "Training Date",
      field: "TrainingDate",
      sortable: true,
      filter: true,
      width: 180,
      valueFormatter: (param) =>
        param.value ? moment(param.value).format("DD-MM-YYYY") : "",
    },
    {
      headerName: "Start Time",
      field: "StartTime",
      sortable: true,
      filter: true,
      width: 180,
      valueGetter: (node) =>
        node.data.StartTime ? Convert24FourHourAndMinute(node.data.StartTime) : null,
    },
    {
      headerName: "End Time",
      field: "EndTime",
      sortable: true,
      filter: true,
      width: 180,
      valueGetter: (node) =>
        node.data.EndTime ? Convert24FourHourAndMinute(node.data.EndTime) : null,
    },
   
  ]);


  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderPagination = () => (
    <div className="pagination-container">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <i className="fas fas fa-arrow-left"></i>
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <i className="fas fas fa-arrow-right"></i>
      </button>
    </div>
  );

 



 


  useEffect(() => {
    debugger;

    fetchAllTrainer();

  }, []);

  return (
    <>
  
      <div className="form-wrapper-agent">
        <div className="modify-agent-container">
          <div className="top-actions">
            <div className="search-container">
              {/* <input
                type="text"
                className="search-input"
                placeholder="Search by training details..."
                value={searchQuery}
                onChange={(e) => handleSearchInputChange(e.target.value)}
              /> */}
            </div>

        
          </div>

          <div className="ag-theme-alpine ag-grid-container">
            <AgGridReact
              rowData={rowData}
              columnDefs={[
                { headerName: "S.No", valueGetter: (params) => params.node.rowIndex + 1, width: 80 },
                ...columnDefs,
              ]}
              components={{ ActionCellRenderer }}
              defaultColDef={{
                resizable: true,
                sortable: true,
                headerClass: "custom-header-style-other",
                cellStyle: { border: "1px solid #ECECEC", padding: "5px" },
              }}
              rowHeight={30}
            />

           
         

          </div>

          {renderPagination()}
        </div>
      </div>
    </>
  );
};

export default AgentTraining;
