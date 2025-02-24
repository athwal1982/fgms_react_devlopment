import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import { Convert24FourHourAndMinute, dateToSpecificFormat } from "Configration/Utilities/dateformat";
import moment from "moment";
import "./TrainingList.scss";
import { getTrainingListData } from "../Services/Methods";
import _ from "lodash"; 

const TrainingList = () => {
  const navigate = useNavigate();
  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  // Fetching training data
  const fetchAllTraining = async (page = 1, query = "") => {
    try {
      const response = await getTrainingListData({ page, limit, searchQuery: query });
      let data = response.response.responseData;
      let responseCode = response.response.responseCode;
      if (responseCode === 1) {
        setRowData(data);
        setFilteredData(data);
        setTotalPages(response.totalPages);
      } else {
        setRowData([]);
        setFilteredData([]);
        console.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching training data:", error);
    }
  };

  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: (params) => params.node.rowIndex + 1,
      width: 80,
    },
    {
      headerName: "Training Type",
      field: "TrainingName", // Change from 'trainingType' to 'TrainingName' based on the response
      sortable: true,
      filter: true,
      width: 150,
    },
    {
      headerName: "Training Date",
      field: "TrainingDate", // Use 'TrainingDate' instead of 'trainingDate'
      sortable: true,
      filter: true,
      width: 110,
      valueFormatter: (param) =>
        param.value ? moment(param.value).format("DD-MM-YYYY") : "",
    },
    {
      headerName: "Start Time",
      field: "StartTime", // Use 'StartTime' as per the response
      sortable: true,
      filter: true,
      width: 100,
      valueGetter: (node) =>
        node.data.StartTime ? Convert24FourHourAndMinute(node.data.StartTime) : null,
    },
    {
      headerName: "End Time",
      field: "EndTime", // Use 'EndTime' as per the response
      sortable: true,
      filter: true,
      width: 100,
      valueGetter: (node) =>
        node.data.EndTime ? Convert24FourHourAndMinute(node.data.EndTime) : null,
    },
    {
      headerName: "Created By",
      field: "CreatedBy", // Use 'CreatedBy' from the response
      sortable: true,
      filter: true,
      width: 160,
    },
    {
      headerName: "Created On",
      field: "InsertedDateTime", // Use 'InsertedDateTime' for creation date
      sortable: true,
      filter: true,
      width: 140,
      valueGetter: (params) =>
        params.node.rowIndex + 1,
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
      field: "UpdatedBy", // Use 'UpdatedBy' from the response
      sortable: true,
      filter: true,
      width: 160,
    },
    {
      headerName: "Updated On",
      field: "UpdateDateTime", // Use 'UpdateDateTime' from the response
      sortable: true,
      filter: true,
      width: 160,
    },
  ]);
  

  // Pagination handler
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

  /* A const toggleTrainingStatus = async (trainingId, currentStatus) => {
    try {
      const newStatus = currentStatus === 0 ? 1 : 0;
      const result = await statusUpdate({ trainingId, status: newStatus });
      if (result.success) {
        setFilteredData((prevData) =>
          prevData.map((training) =>
            training._id === trainingId ? { ...training, status: newStatus } : training
          )
        );
      } else {
        console.error("Failed to update training status");
      }
    } catch (error) {
      console.error("Error updating training status:", error);
    }
  }; */

  const handleEdit = (trainingId) => {
    navigate(`/CreateNewTraining?trainingId=${trainingId}`);
  };

  useEffect(() => {
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

            <button className="create-agent-button" onClick={() => navigate("/CreateNewTraining")}>
              Create Training &nbsp; <i className="fas fas fa-arrow-right"></i>
            </button>
          </div>

          <div className="ag-theme-alpine ag-grid-container">
            <AgGridReact
              rowData={filteredData}
              columnDefs={[
                { headerName: "S.No", valueGetter: (params) => params.node.rowIndex + 1, width: 80 },
                ...columnDefs,
              ]}
              defaultColDef={{ resizable: true, sortable: true }}
              rowHeight={30}
            />
          </div>

          {renderPagination()}
        </div>
      </div>
    </>
  );
};

export default TrainingList;
