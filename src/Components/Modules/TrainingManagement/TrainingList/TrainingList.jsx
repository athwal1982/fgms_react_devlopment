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

  const [columnDefs] = useState([
    {
      headerName: "Action",
      field: "action",
      width: 100,
    },
    
    {
      headerName: "Training Type",
      field: "TrainingName",
      sortable: true,
      filter: true,
      width: 150,
    },
    {
      headerName: "Training Date",
      field: "TrainingDate",
      sortable: true,
      filter: true,
      width: 110,
      valueFormatter: (param) => (param.value ? moment(param.value).format("DD-MM-YYYY") : "")
    },
    {
      headerName: "Start Time",
      field: "#",
      sortable: true,
      filter: true,
      width: 100,
      valueGetter: (node) => {
        return node.data.StartTime ? Convert24FourHourAndMinute(node.data.StartTime) : null;
      }
    },
    {
      headerName: "End Time",
      field: "#",
      sortable: true,
      filter: true,
      width: 100,
      valueGetter: (node) => {
        return node.data.EndTime ? Convert24FourHourAndMinute(node.data.EndTime) : null;
      }
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
      field: "#",
      sortable: true,
      filter: true,
      width: 140,
      valueGetter: (params) => params.node.rowIndex + 1,
      valueGetter:(node) => {
                              // A return node.data.CreatedAt ? `${dateFormat(node.data.CreatedAt.split("T")[0])} ${tConvert(node.data.CreatedAt.split("T")[1])}` : null;
                              return node.data.InsertedDateTime
                                ? dateToSpecificFormat(
                                    `${node.data.InsertedDateTime.split("T")[0]} ${Convert24FourHourAndMinute(node.data.InsertedDateTime.split("T")[1])}`,
                                    "DD-MM-YYYY HH:mm",
                                  )
                                : null;
                            }
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
    },
  
  ]);

  

  const handleEdit = (userId) => {
    navigate(`/CreateNewAgent?userId=${userId}`); 
  };


  const handleCreateTraining = () => {
    navigate("/CreateNewTraining");
  };

  const getAllTrainingData = async (page, query = "") => {
    try {
      const formData = {
        page_size:10,
        page_number: page,
        totalPages: "",
        searchQuery: query,
        viewMode: "ALL",
        userId: "",
      };
      const result = await getTrainingListData(formData);
      if (result.response.responseCode === 1) {
        setRowData(result.response.responseData);
        setFilteredData(result.response.responseData);
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
    getAllTrainingData(currentPage);
  }, [currentPage]);

  const debounceSearch = useCallback(
    _.debounce((query) => {
      if (query.length >= 4) {
        getAllTrainingData(1, query);
      } else {
        getAllTrainingData(1);
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
    </>
  );
};

export default TrainingList;
