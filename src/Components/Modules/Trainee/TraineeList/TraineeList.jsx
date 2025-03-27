import React, { useEffect, useState, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import "./TraineeList.scss";
import { FaEdit } from "react-icons/fa";
import { getAllAgent, setCSCUpdateAgentBYID } from "./Services/Methods";
import _ from "lodash";
import { AlertMessage } from "../../../../Framework/Components/Widgets/Notification/NotificationProvider";
import { getTrainerList } from "../../TrainingManagement/Services/Methods";

const TraineeList = () => {
  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const setAlertMessage = AlertMessage();
  const [center, setCenter] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);

  const handleEdit = (agent) => {
    debugger;
    setSelectedAgent(agent);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAgent(null);
  };

  const [columnDefs] = useState([
    {
      headerName: "Action",
      field: "action",
      width: 100,
      cellRendererFramework: (params) => {
        const agent = params.data;
        return (
          <div className="action-icons">
            <FaEdit
              className="icon edit-icon"
              title="Edit"
              onClick={() => handleEdit(agent)}
            />
          </div>
        );
      },
    },
    {
      headerName: "Progress Bar",
      field: "completion_percentage",
      sortable: true,
      filter: true,
      cellRendererFramework: (params) => {
        const percentage = params.value !== null && params.value !== undefined ? params.value : 0;
        let bgColor = "red";
        if (percentage >= 40 && percentage <= 80) bgColor = "orange";
        if (percentage > 80) bgColor = "green";
        return (
          <div style={{ width: "100%", position: "relative", border: "1px solid #ccc", borderRadius: "8px", padding: "0px" }}>
            <div
              style={{
                width: `${percentage}%`,
                backgroundColor: percentage > 0 ? bgColor : "#f0f0f0", 
                height: "20px",
                borderRadius: "8px",
                textAlign: "center",
                color: percentage > 0 ? "black" : "#333",
                fontWeight: "bold",
                lineHeight: "20px",
                transition: "width 0.5s ease-in-out",
              }}
            >
              {`${percentage}%`}
            </div>
          </div>
        );
      },
    },
    
    {
      headerName: "Total Hours",
      field: "total_duration_hours",
      sortable: true,
      filter: true,
      valueGetter: (params) => (params.data.total_duration_hours ? `${params.data.total_duration_hours} hrs` : "0 hrs"),
    },
    {
      headerName: "Total Attendent",
      field: "attended_sessions",
      sortable: true,
      filter: true,
      valueGetter: (params) => (params.data.attended_sessions? `${params.data.attended_sessions} ` : "0"),
    },
    
    {
      headerName: "Status",
      field: "Status",
      sortable: true,
      filter: true,
      cellRendererFramework: (params) => {
        const status = params.data.Status;

        return (
          <div>
            <span>{status === "Y" ? "Enabled" : "Disabled"}</span>
          </div>
        );
      },
    },
    {
      headerName: "Trainee Name",
      field: "Name",
      sortable: true,
      filter: true,
      cellRendererFramework: (params) => {
        if (params.value) {
          return params.value
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
        } else {
          return "NA";
        }
      },
    },
 
    

    {
      headerName: "User Name",
      field: "UserName",
      sortable: true,
      filter: true,
      cellRendererFramework: (params) => (params.value ? params.value : "NA"),
    },
    {
      headerName: "Email ID",
      field: "Email",
      sortable: true,
      filter: true,
      cellRendererFramework: (params) => (params.value ? params.value : "NA"),
    },
    {
      headerName: "Mobile No.",
      field: "MobileNo",
      sortable: true,
      filter: true,
      cellRendererFramework: (params) => (params.value ? params.value : "NA"),
    },
    {
      headerName: "Alternate Mobile No.",
      field: "MobileNumber",
      sortable: true,
      filter: true,
      cellRendererFramework: (params) => (params.value ? params.value : "NA"),
    },
    {
      headerName: "Designation",
      field: "Designation",
      sortable: true,
      filter: true,
      cellRendererFramework: (params) => (params.value ? params.value : "NA"),
    },

    {
      headerName: "DOB",
      field: "DOB",
      sortable: true,
      filter: true,
      cellRendererFramework: (params) => {
        if (params.value) {
          const date = new Date(params.value);
          const day = ("0" + date.getDate()).slice(-2);
          const month = ("0" + (date.getMonth() + 1)).slice(-2);
          const year = date.getFullYear();

          return `${day}-${month}-${year}`;
        } else {
          return "NA";
        }
      },
    },

    {
      headerName: "Experience (Years)",
      field: "Experience",
      sortable: true,
      filter: true,
      cellRendererFramework: (params) => (params.value ? params.value : "NA"),
    },

    {
      headerName: "Qualification",
      field: "Qualification",
      sortable: true,
      filter: true,
      cellRendererFramework: (params) => (params.value ? params.value : "NA"),
    },

    {
      headerName: "Location",
      field: "Center",
      sortable: true,
      filter: true,
      cellRendererFramework: (params) => (params.value ? params.value : "NA"),
    },
    {
      headerName: "Joining Date",
      field: "JoiningDate",
      sortable: true,
      filter: true,
      width: 150,
      cellRendererFramework: (params) => {
        if (params.value) {
          const date = new Date(params.value);
          const day = ("0" + date.getDate()).slice(-2);
          const month = ("0" + (date.getMonth() + 1)).slice(-2);
          const year = date.getFullYear();
          return `${day}-${month}-${year}`;
        } else {
          return "NA";
        }
      },
    },
    {
      headerName: "Exit Date",
      field: "ExitDate",
      sortable: true,
      filter: true,
      width: 150,
      cellRendererFramework: (params) => {
        if (params.value) {
          const date = new Date(params.value);
          const day = ("0" + date.getDate()).slice(-2);
          const month = ("0" + (date.getMonth() + 1)).slice(-2);
          const year = date.getFullYear();
          return `${day}-${month}-${year}`;
        } else {
          return "NA";
        }
      },
    },
    {
      headerName: "Re-Joining Date",
      field: "RejoiningDate",
      sortable: true,
      filter: true,
      width: 150,
      cellRendererFramework: (params) => {
        if (params.value) {
          const date = new Date(params.value);
          const day = ("0" + date.getDate()).slice(-2);
          const month = ("0" + (date.getMonth() + 1)).slice(-2);
          const year = date.getFullYear();
          return `${day}-${month}-${year}`;
        } else {
          return "NA";
        }
      },
    },
    

  ]);

  const fetchAllTrainer = async () => {
    const formData = {
      SPMODE: "CENTER",
      SPCenterID: 0,
    };

    try {
      const response = await getTrainerList(formData);
      let data = response.response.responseData;
      let responseCode = response.response.responseCode;

      if (responseCode === 1) {
        setCenter(
          data.map((center) => ({
            value: center.CenterMasterID,
            label: `${center.Center} - ${center.Center}`,
          })),
        );
      } else {
        setCenter([]);
      }
    } catch (error) {
      console.error("Error fetching center data:", error);
    }
  };

  const getAllAgentData = async (page, query = "", centerMasterID = "") => {
    debugger;
    try {
      const formData = {
        page_size: 10, 
        page_number: page, 
        totalPages: "", 
        searchQuery: query, 
        viewMode: "ALL", 
        userId: "", 
        centerMasterID: centerMasterID, 
      };

      const result = await getAllAgent(formData);
      debugger;
      
      if (result.response.responseCode === 1) {
     
        setRowData(result.response.responseData.traineeList); 
        setFilteredData(result.response.responseData.traineeList);
        setTotalPages(result.response.responseData.totalPages);
      } else {
       
        setRowData([]);
        setFilteredData([]);
        console.error(result.response.responseMessage);
      }
    } catch (error) {

      console.error(error);
    }
  };

  const debounceSearch = useCallback(
    _.debounce((query) => {
      if (query.length >= 4) {
        getAllAgentData(1, query);
      } else {
        getAllAgentData(1);
      }
    }, 500),
    [],
  );

  const handleSearchInputChange = (query) => {
    setSearchQuery(query);
    debounceSearch(query);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      getAllAgentData(newPage, searchQuery, selectedCenter);
    }
  };


  const renderPagination = () => (
    <div className="pagination-container">
      <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
        <i className="fas fas fa-arrow-left"></i>
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        <i className="fas fas fa-arrow-right"></i>
      </button>
    </div>
  );

  const handleSearch = () => {
    setCurrentPage(1); 
    getAllAgentData(1, searchQuery, selectedCenter);
  };

  const handleSubmit = async (e) => {
    debugger;
    e.preventDefault();
    const genderMapping = { Male: "0", Female: "1" };
    try {

      const formData = {
        SPViewMode: "UPDATEBYADMIN",
        SPUserID: selectedAgent.UserID,
        email: selectedAgent.Email,
        gender: genderMapping[selectedAgent.Gender] ?? "",
        experience: parseInt(selectedAgent.Experience, 10) || 0,
        designation: selectedAgent.Designation,
        JoiningDate: e.target.JoiningDate.value,
        ExitDate: e.target.ExitDate.value,
        RejoiningDate: e.target.RejoiningDate.value,
      };




      const result = await setCSCUpdateAgentBYID(formData);


      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });

        handleCloseModal();
        getAllAgentData(currentPage, "", "");
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      console.error("API Error:", error);
      setAlertMessage({
        type: "error",
        message: "Something went wrong. Please try again.",
      });
    }
  };

  useEffect(() => {
    debugger;
    getAllAgentData(currentPage, "", "");
    fetchAllTrainer();
  }, []);

  useEffect(() => {
  }, [isModalOpen]);

  return (
    <>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-btn" onClick={handleCloseModal}>&times;</button>

            <h2>Edit Agent Details</h2>
            <form onSubmit={handleSubmit}>
              <div className="modal-row">
              <div className="modal-input">
                  <label className="Trainee-form-label">Agent ID</label>
                  <input type="text" defaultValue={selectedAgent.UserID} disabled />
                </div>
                <div className="modal-input">
                  <label className="Trainee-form-label">Name</label>
                  <input type="text" defaultValue={selectedAgent.Name}  disabled/>
                </div>
                <div className="modal-input">
                  <label className="Trainee-form-label">Email</label>
                  <input type="email" defaultValue={selectedAgent.Email} disabled />
                </div>
                <div className="modal-input">
                  <label className="Trainee-form-label">Phone</label>
                  <input type="text" defaultValue={selectedAgent.MobileNo} disabled />
                </div>
              </div>


              <div className="modal-row">
              <div className="modal-input">
                  <label className="Trainee-form-label">Center</label>
                  <input type="text" defaultValue={selectedAgent.Center} disabled />
                </div>
                <div className="modal-input">
                  <label className="Trainee-form-label">Designation</label>
                  <input type="text" defaultValue={selectedAgent.Designation} disabled />
                </div>
                <div className="modal-input">
                  <label className="Trainee-form-label">Experience</label>
                  <input type="text" defaultValue={selectedAgent.Experience} disabled />
                </div>
                <div className="modal-input">
                  <label className="Trainee-form-label">Qualification</label>
                  <input type="text" defaultValue={selectedAgent.Qualification} disabled />
                </div>
              </div>


              <div className="modal-row">
              <div className="modal-input">
                  <label className="Trainee-form-label">Gender</label>
                  <input type="text" defaultValue={selectedAgent.Gender} disabled />
                </div>

                <div className="modal-input">
                  <label className="Trainee-form-label">Date of Birth</label>
                  <input type="date" defaultValue={selectedAgent.DOB} disabled />
                </div>
                <div className="modal-input">   <label className="Trainee-form-label">Joining Date</label>
                  <input type="date" name="JoiningDate" defaultValue={selectedAgent.JoiningDate || ""} /></div>
                <div className="modal-input">   <label className="Trainee-form-label">Exit Date</label>
                  <input type="date" name="ExitDate" defaultValue={selectedAgent.ExitDate || ""} /></div>
              
              </div>
              <div className="modal-row">
              <div className="modal-input">   <label className="Trainee-form-label">Re-joining Date</label>
              <input type="date" name="RejoiningDate" defaultValue={selectedAgent.RejoiningDate || ""} /></div>   <div className="modal-input"></div> <div className="modal-input"></div> <div className="modal-input"></div> </div>
          
              <div className="modal-buttons">
                <button type="submit">Update</button>
                <button type="button" onClick={handleCloseModal}>Cancel</button>

              </div>
            </form>
          </div>
        </div>

      )}
      <div className="form-wrapper-agent">
        <div className="modify-agent-container">
          <div className="top-actions">
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Enter at least 4 characters to search..."
                value={searchQuery}
                onChange={(e) => handleSearchInputChange(e.target.value)}
              />
              <select className="styled-dropdown" value={selectedCenter} onChange={(e) => setSelectedCenter(e.target.value)}>
                <option value="">Select Center</option>
                {center.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>

              <button className="styled-button" onClick={handleSearch}>
                Search
              </button>
            </div>
            <div className="color-legend">
              <h6>Progress Bar Status :</h6>
    <span className="legend-item" style={{ backgroundColor: "red" }}>Less than 40%</span>
    <span className="legend-item" style={{ backgroundColor: "orange" }}>40% - 80%</span>
    <span className="legend-item" style={{ backgroundColor: "green" }}>More than 80%</span>
  </div>
          </div>
          <div className="ag-theme-alpine ag-grid-container">
            <AgGridReact
              rowData={filteredData}
              columnDefs={[
                {
                  headerName: "S.No",
                  valueGetter: (params) => params.node.rowIndex + 1,
                  width: 80,
                  headerClass: "custom-header-style",
                },
                ...columnDefs,
              ]}
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

export default TraineeList;


