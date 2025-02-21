import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import { FaEdit, FaBan } from "react-icons/fa";
import { getTrainingListData } from "../Services/Methods";
import _ from "lodash";

const TrainingList = () => {
  const navigate = useNavigate();
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
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
      console.log(response.response, "responseresponse");
      let data = response.response;
      if (data.responseCode === 1) {
        setRowData(response.data);
        setFilteredData(response.data);
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

  // Columns definitions
  const [columnDefs] = useState([
    /* {
      headerName: "Action",
      field: "action",
      width: 100,
      cellRendererFramework: (params) => {
        const training = params.data;
        const status = training.status;

        const handleStatusToggle = () => {
          toggleTrainingStatus(training._id, status);
        };

        return (
          <div className="action-icons">
            <FaEdit
              className="icon edit-icon"
              title="Edit"
              onClick={() => handleEdit(training._id)}
            />
            <FaBan
              className={`icon disable-icon ${status === 0 ? "enabled" : "disabled"}`}
              title={status === 0 ? "Disable" : "Enable"}
              onClick={handleStatusToggle}
            />
          </div>
        );
      },
    }, */
    {
      headerName: "Training Type",
      field: "trainingType",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Training Date",
      field: "trainingDate",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Start Time",
      field: "startTime",
      sortable: true,
      filter: true,
    },
    {
      headerName: "End Time",
      field: "endTime",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Created By",
      field: "createdBy",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Created On",
      field: "createdOn",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Updated By",
      field: "updatedBy",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Updated On",
      field: "updatedOn",
      sortable: true,
      filter: true,
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
