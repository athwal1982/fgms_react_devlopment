import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import { Convert24FourHourAndMinute, dateToSpecificFormat } from "Configration/Utilities/dateformat";
import moment from "moment";
import "./AgentTraining.scss";
import { AlertMessage } from "../../../../Framework/Components/Widgets/Notification/NotificationProvider";
import { getTrainingListData, getTrainerList, setAssignList } from "../Services/Methods";
import _ from "lodash";
import { Modal, Button } from "react-bootstrap";
import Select from "react-select";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";

const AgentTraining = () => {
  const setAlertMessage = AlertMessage();
  const navigate = useNavigate();
  const userData = getSessionStorage("user");
  const accessCode = userData.CSCAccessTypeID;
  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);


 

  const fetchAllTraining = async (page = 1, query = "") => {
    debugger;
    try {
      const response = await getTrainingListData({ page, limit, searchQuery: query });
      let data = response.response.responseData;
      let responseCode = response.response.responseCode;
      if (responseCode === 1) {
        const updatedData = data.map(item => ({
          ...item,
          Assigned: item.Assigned === 1 ? "Yes" : "No"
        }));
        setRowData(updatedData);
        setFilteredData(updatedData);
        setTotalPages(response.totalPages);
      } else {
        setRowData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Error fetching training data:", error);
    }
  };
 




 






  
 

  const ActionCellRenderer = (props) => {
    return (
      <>
      
      {props.data.TrainingLink && (
            <a
              href={props.data.TrainingLink}
              target="_blank"
              rel="noopener noreferrer"
              title="Join Meeting"
              style={{ color: "#075307", textDecoration: "none", marginRight: "10px" }}
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
      width: 150,
    },
    {
      headerName: "Training Title",
      field: "TrainingTitle",
      sortable: true,
      filter: true,
      width: 150,
    },
    {
      headerName: "Training Link",
      field: "TrainingLink",
      sortable: true,
      filter: true,
      width: 250,
    },
    {
      headerName: "Training Date",
      field: "TrainingDate",
      sortable: true,
      filter: true,
      width: 110,
      valueFormatter: (param) =>
        param.value ? moment(param.value).format("DD-MM-YYYY") : "",
    },
    {
      headerName: "Start Time",
      field: "StartTime",
      sortable: true,
      filter: true,
      width: 100,
      valueGetter: (node) =>
        node.data.StartTime ? Convert24FourHourAndMinute(node.data.StartTime) : null,
    },
    {
      headerName: "End Time",
      field: "EndTime",
      sortable: true,
      filter: true,
      width: 100,
      valueGetter: (node) =>
        node.data.EndTime ? Convert24FourHourAndMinute(node.data.EndTime) : null,
    },
    {
      headerName: "Created By",
      field: "CreatedBy",
      sortable: true,
      filter: true,
      width: 160,
    },
    {
      headerName: "Created On",
      field: "InsertedDateTime",
      sortable: true,
      filter: true,
      width: 140,
      valueGetter: (node) => {
        return node.data.InsertedDateTime
          ? dateToSpecificFormat(
            `${node.data.InsertedDateTime.split("T")[0]} ${Convert24FourHourAndMinute(
              node.data.InsertedDateTime.split("T")[1]
            )}`,
            "DD-MM-YYYY HH:mm"
          )
          : null;
      },
    },
    {
      headerName: "Updated By",
      field: "UpdatedBy",
      sortable: true,
      filter: true,
      width: 160,
    },
    {
      headerName: "Updated On",
      field: "UpdateDateTime",
      sortable: true,
      filter: true,
      width: 160,
      valueGetter: (node) => {
        return node.data.UpdateDateTime
          ? dateToSpecificFormat(
            `${node.data.UpdateDateTime.split("T")[0]} ${Convert24FourHourAndMinute(
              node.data.UpdateDateTime.split("T")[1]
            )}`,
            "DD-MM-YYYY HH:mm"
          )
          : null;
      },
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

  const handleSearchInputChange = (query) => {
    setSearchQuery(query);
    fetchAllTraining(1, query);
  };



 


  useEffect(() => {
    debugger;

    fetchAllTraining(currentPage);

  }, [currentPage]);

  return (
    <>
  
      <div className="form-wrapper-agent">
        <div className="modify-agent-container">
          <div className="top-actions">
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search by training details..."
                value={searchQuery}
                onChange={(e) => handleSearchInputChange(e.target.value)}
              />
            </div>

            {accessCode === 999 && (
              <button
                className="create-agent-button"
                onClick={() => navigate("/CreateNewTraining")}
              >
                Create Training &nbsp; <i className="fas fas fa-arrow-right"></i>
              </button>
            )}
          </div>

          <div className="ag-theme-alpine ag-grid-container">
            <AgGridReact
              rowData={filteredData}
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
