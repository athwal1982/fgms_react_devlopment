import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "./TrainingList.scss";
import { FaEdit, FaBan } from "react-icons/fa";
// A import EditAgent from "../EditAgent/EditAgent";
import { getAllAgent, statusUpdate } from "../../Trainee/TraineeList/Services/Methods";
// A import { changeToCapitalize } from "../../../Service/Utilities/Utils";
import _ from "lodash"; 

const TrainingList = () => {
  const navigate = useNavigate();
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [adminList, setAdminList] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [selectedSupervisor, setSelectedSupervisor] = useState("");
  const [supervisorList, setSupervisorList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  const [columnDefs] = useState([
    {
      headerName: "Action",
      field: "action",
      width: 100,
      cellRendererFramework: (params) => {
        const agent = params.data;
        const status = agent.status;
  
        // Handle Enable/Disable action
        const handleStatusToggle = () => {
          toggleAgentStatus(agent._id, status); // Use the function defined in the component
        };
  
        return (
          <div className="action-icons">
            <FaEdit
              className="icon edit-icon"
              title="Edit"
              onClick={() => handleEdit(agent._id)}
            />
          
            
            {/* Enable/Disable button */}
            <FaBan
              className={`icon disable-icon ${status === 0 ? "enabled" : "disabled"}`}
              title={status === 0 ? "Disable" : "Enable"}
              onClick={handleStatusToggle}
            />
          </div>
        );
      },
    },
    
    {
      headerName: "Training Type",
      field: "#",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Training Date",
      field: "#",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Start Time",
      field: "#",
      sortable: true,
      filter: true,
    },
    {
      headerName: "End Time",
      field: "#",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Created BY",
      field: "#",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Created On",
      field: "#",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Updated BY",
      field: "#",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Updated On",
      field: "#",
      sortable: true,
      filter: true,
    },
  
  ]);

  const handleFilterApply = async (adminId, supervisorId) => {
    try {
      const formData = {
        page: 1,  
        limit: 10, 
        adminId: adminId,
        supervisorId: supervisorId,
        role:3
      };
  
      const result = await getAllAgent(formData); 
      if (result.response.responseCode === 1) {
        setFilteredData(result.response.responseData.agents);
        setTotalPages(result.response.responseData.totalPages); 
      } else {
        setFilteredData([]);
        console.error(result.response.responseMessage);
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleEdit = (userId) => {
    navigate(`/CreateNewAgent?userId=${userId}`); 
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    setSelectedAgent(null);
  };

  const handleCreateTraining = () => {
    navigate("/CreateNewTraining");
  };

  const getAllAdmins = async () => {
    try {
      const formData = {
        page: 1,
        limit: 10000000,
        searchQuery: "",
        role: 1,
      };
      const result = await getAllAgent(formData);
      if (result.response.responseCode === 1) {
        setAdminList(result.response.responseData.agents);
      } else {
        setAdminList([]);
        console.error(result.response.responseMessage);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getSupervisorsByAdmin = async (adminId) => {
    try {
      const result = await getAllAgent({
        page: 1,
        limit: 100000,
        searchQuery: "",
        role: 2,
        adminId: adminId,
      });
      if (result.response.responseCode === 1) {
        setSupervisorList(result.response.responseData.agents);
      } else {
        setSupervisorList([]);
        console.error(result.response.responseMessage);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAllAgentData = async (page, query = "") => {
    try {
      const formData = {
        page: page,
        limit: 10,
        searchQuery: query,
        role: 3,
      };
      const result = await getAllAgent(formData);
      if (result.response.responseCode === 1) {
        setRowData(result.response.responseData.agents);
        setFilteredData(result.response.responseData.agents);
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

  useEffect(() => {
    getAllAgentData(currentPage);
    getAllAdmins();
  }, [currentPage]);

  const debounceSearch = useCallback(
    _.debounce((query) => {
      if (query.length >= 4) {
        getAllAgentData(1, query);
      } else {
        getAllAgentData(1);
      }
    }, 500),
    []
  );

  const handleSearchInputChange = (query) => {
    setSearchQuery(query);
    debounceSearch(query);
  };

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

  const handleAdminFilterChange = (adminId) => {
    if (adminId) {
      getSupervisorsByAdmin(adminId);
    } else {
      setSupervisorList([]);
      setSelectedSupervisor("");
    }
  };

  const toggleAgentStatus = async (agentId, currentStatus) => {
    try {
      const newStatus = currentStatus === 0 ? 1 : 0;
  
      const result = await statusUpdate({ agentId, status: newStatus });
  
      if (result.success) {
        setFilteredData((prevData) =>
          prevData.map((agent) =>
            agent._id === agentId ? { ...agent, status: newStatus } : agent
          )
        );
      } else {
        console.error("Failed to update agent status");
      }
    } catch (error) {
      console.error("Error updating agent status:", error);
    }
  };

  const handleAdminChange = (e) => {
    const adminId = e.target.value;
    setSelectedAdmin(adminId);
    handleAdminFilterChange(adminId);
  };

  const handleSupervisorChange = (e) => {
    setSelectedSupervisor(e.target.value);
  };

  
  

  return (
    <>
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
            </div>

            <button className="create-agent-button" onClick={handleCreateTraining}>
              Create Training &nbsp; <i className="fas fas fa-arrow-right"></i>
            </button>
          </div>
          <div className="ag-theme-alpine ag-grid-container">
          <AgGridReact
  rowData={filteredData}
 
  columnDefs={[
    { 
      headerName: "S.No", 
      valueGetter: (params) => params.node.rowIndex + 1, 
      width: 80 ,
      cellStyle: { marginLeft: "20px" } 
    }, ...columnDefs,

   
  ]}
  defaultColDef={{ resizable: true, sortable: true, cellStyle: { marginLeft: "15px" }  }}
  rowHeight={30} 
/>
          </div>
          {renderPagination()}
        </div>
      </div>

      {isPopupOpen && (
        <EditAgent agentData={selectedAgent} onClose={handleClosePopup} />
      )}
    </>
  );
};

export default TrainingList;
