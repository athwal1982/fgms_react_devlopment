import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "./TraineeList.scss";
import { FaEdit } from "react-icons/fa";
import { getAllAgent, statusUpdate } from "./Services/Methods";
import _ from "lodash";
import "@fortawesome/fontawesome-free/css/all.min.css";
import EditAgent from "../EditAgent/EditAgent";
import { AlertMessage } from "../../../../Framework/Components/Widgets/Notification/NotificationProvider";



const TraineeList = () => {
  const navigate = useNavigate();
  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const setAlertMessage = AlertMessage();

  const [columnDefs] = useState([
    {
      headerName: "Action",
      field: "action",
      width: 100,
      cellRendererFramework: (params) => {
        const agent = params.data;
        const status = agent.Status;
  
        // A const handleStatusToggle = () => {
        //  A  toggleAgentStatus(agent.Id, status);
        // A };
  
        return (
          <div className="action-icons">
            <FaEdit
              className="icon edit-icon"
              title="Edit"
              onClick={() => handleEdit(agent.UserID)}
            />
            {/* <FaBan
              className={`icon disable-icon ${status === "Y" ? "enabled" : "disabled"}`}
              title={status === "Y" ? "Disable" : "Enable"}
              onClick={handleStatusToggle}
            /> */}
          </div>
        );
      },
    },



    
    /* { headerName: "Trainee Name", field: "DisplayName", sortable: true, filter: true },
    { headerName: "User Name", field: "UserName", sortable: true, filter: true },
    { headerName: "Email ID", field: "EmailID", sortable: true, filter: true },
    { headerName: "Mobile No.", field: "MobileNo", sortable: true, filter: true },
    { headerName: "Alternate Mobile No.", field: "MobileNumber", sortable: true, filter: true },
    { headerName: "Designation", field: "Designation", sortable: true, filter: true },
    { headerName: "Company Name", field: "CompanyName", sortable: true, filter: true },
    { headerName: "Company Type", field: "CompanyType", sortable: true, filter: true },
    { headerName: "DOB", field: "DOB", sortable: true, filter: true },
    { headerName: "Experience (Years)", field: "Experience", sortable: true, filter: true },
    { headerName: "Profile Name", field: "ProfileName", sortable: true, filter: true },
    { headerName: "Qualification", field: "Qualification", sortable: true, filter: true },
    { headerName: "Region", field: "Region", sortable: true, filter: true },
    { headerName: "State", field: "State", sortable: true, filter: true },
    { headerName: "City", field: "City", sortable: true, filter: true },
    { headerName: "Location", field: "Location", sortable: true, filter: true },
    { headerName: "Location Type", field: "LocationType", sortable: true, filter: true },
    {
      headerName: "Status",
      field: "Status",
      sortable: true,
      filter: true,
      cellRendererFramework: (params) => {
        const status = params.data.Status;
        let circleColor = "gray";
        let statusText = "NA";
  
        if (status === "Y") {
          circleColor = "green";
          statusText = "Enabled";
        } else if (status === "N") {
          circleColor = "red";
          statusText = "Disabled";
        }
  
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: circleColor,
              }}
            ></div>
            <span>{statusText}</span>
          </div>
        );
      },
    }, */

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
    }
    ,

    {
      headerName: "Trainee Name", 
      field: "Name", 
      sortable: true, 
      filter: true,
      cellRendererFramework: (params) => {
        if (params.value) {
          return params.value
            .split(" ") 
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) 
            .join(" "); 
        } else {
          return "NA";
        }
      }
    },
    
    
    { 
      headerName: "User Name", 
      field: "UserName", 
      sortable: true, 
      filter: true,
      cellRendererFramework: (params) => params.value ? params.value : "NA"
    },
    { 
      headerName: "Email ID", 
      field: "Email", 
      sortable: true, 
      filter: true,
      cellRendererFramework: (params) => params.value ? params.value : "NA"
    },
    { 
      headerName: "Mobile No.", 
      field: "MobileNo", 
      sortable: true, 
      filter: true,
      cellRendererFramework: (params) => params.value ? params.value : "NA"
    },
    { 
      headerName: "Alternate Mobile No.", 
      field: "MobileNumber", 
      sortable: true, 
      filter: true,
      cellRendererFramework: (params) => params.value ? params.value : "NA"
    },
    { 
      headerName: "Designation", 
      field: "Designation", 
      sortable: true, 
      filter: true,
      cellRendererFramework: (params) => params.value ? params.value : "NA"
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
      }
    },
    
    { 
      headerName: "Experience (Years)", 
      field: "Experience", 
      sortable: true, 
      filter: true,
      cellRendererFramework: (params) => params.value ? params.value : "NA"
    },
    
    { 
      headerName: "Qualification", 
      field: "Qualification", 
      sortable: true, 
      filter: true,
      cellRendererFramework: (params) => params.value ? params.value : "NA"
    },
    // A { 
    // A   headerName: "Region", 
    // A   field: "Region", 
    // A   sortable: true, 
    // A   filter: true,
    // A   cellRendererFramework: (params) => params.value ? params.value : "NA"
    // A },
    // A { 
    // A   headerName: "State", 
    // A   field: "State", 
    // A   sortable: true, 
    // A   filter: true,
    // A   cellRendererFramework: (params) => params.value ? params.value : "NA"
    // A },
    // A { 
    // A   headerName: "City", 
    // A   field: "City", 
    // A   sortable: true, 
    // A   filter: true,
    // A   cellRendererFramework: (params) => params.value ? params.value : "NA"
    // A },
    { 
      headerName: "Location", 
      field: "Location", 
      sortable: true, 
      filter: true,
      cellRendererFramework: (params) => params.value ? params.value : "NA"
    },
    // A { 
    // A  headerName: "Location Type", 
    // A  field: "LocationType", 
    // A  sortable: true, 
    // A  filter: true,
    // A  cellRendererFramework: (params) => params.value ? params.value : "NA"
    // A},
    
  ]);
  

  const handleStatusUpdate = async()=>{
    debugger;
    try{
      const formData = {
        SPUserRefId: String(formData.UserID),
        Status:formData.Status
        
      };
      const result = await statusUpdate(formData);
      if (result.response.responseCode === 1) {
        setAlertMessage({ type: "success", message: "Update Success" });
      }else{
        setAlertMessage({ type: "error", message: "Error Update" });

      }

      
    }catch(err){
      console.log(err);
    }
  };
  

  const handleEdit = async (UserID) => {
    debugger;
    try {
      const formData = {
        page_size:10,
        page_number: 1,
        totalPages: "",
        searchQuery: "",
        viewMode: "BYID",
        userId: UserID,
      };
      const result = await getAllAgent(formData);
      if (result.response.responseCode === 1) {
        setSelectedUser(result.response.responseData.traineeList[0]);
        setIsModalOpen(true);
      } else {
        setSelectedUser([]);
        console.error(result.response.responseMessage);
      }
    } catch (error) {
      console.error(error);
    }
   
  };
 









  const getAllAgentData = async (page, query = "") => {
    debugger;
    try {
      const formData = {
        page_size:10,
        page_number: page,
        totalPages: "",
        searchQuery: query,
        viewMode: "ALL",
        userId: "",
      };
      const result = await getAllAgent(formData);
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

  useEffect(() => {
    debugger;
    getAllAgentData(currentPage);
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
          </div>
          <div className="ag-theme-alpine ag-grid-container">
          <AgGridReact
  rowData={filteredData}
 
  columnDefs={[
    { 
      headerName: "S.No", 
      valueGetter: (params) => params.node.rowIndex + 1, 
      width: 80 ,
      headerClass: "custom-header-style",
    }, ...columnDefs,

   
  ]}
  defaultColDef={{ resizable: true, sortable: true ,  headerClass: "custom-header-style-other",  cellStyle: { border: "1px solid #ECECEC", padding: "5px" },}}
  rowHeight={30} 
/>
          </div>
          {renderPagination()}
        </div>
      </div>
      {isModalOpen && (
        <EditAgent user={selectedUser} onClose={() => setIsModalOpen(false)} />
      )}

    </>
  );
};

export default TraineeList;
