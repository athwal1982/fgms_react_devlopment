import React, { useEffect, useState, useCallback, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "./CenterTrainee.scss";

const CenterTrainee = () => {
    const [rowData, setRowData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const getAllAgentData = useCallback(async (page, query = "", centerMasterID = "") => {
        try {
            const formData = {
                page_size: 10,
                page_number: page,
                totalPages: "",
                searchQuery: query,
                viewMode: "ALL",
                userId: "",
                centerMasterID,
            };
            const result = await getAllAgent(formData);
            if (result.response.responseCode === 1) {
                const { traineeList, totalPages } = result.response.responseData;
                setRowData(traineeList);
                setTotalPages(totalPages);
            } else {
                setRowData([]);
                console.error(result.response.responseMessage);
            }
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        getAllAgentData(currentPage);
    }, [currentPage, getAllAgentData]);

    const columnDefs = useMemo(() => [
        {
            headerName: "Status",
            field: "Status",
            sortable: true,
            filter: true,
            cellRenderer: ({ data }) => <span>{data.Status === "Y" ? "Enabled" : "Disabled"}</span>,
        },
        {
            headerName: "Trainee Name",
            field: "Name",
            sortable: true,
            filter: true,
            cellRenderer: ({ value }) => value 
                ? value.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ") 
                : "NA",
        },
        { headerName: "User Name", field: "UserName", sortable: true, filter: true, cellRenderer: ({ value }) => value || "NA" },
        { headerName: "Email ID", field: "Email", sortable: true, filter: true, cellRenderer: ({ value }) => value || "NA" },
        { headerName: "Mobile No.", field: "MobileNo", sortable: true, filter: true, cellRenderer: ({ value }) => value || "NA" },
        { headerName: "Alternate Mobile No.", field: "MobileNumber", sortable: true, filter: true, cellRenderer: ({ value }) => value || "NA" },
        { headerName: "Designation", field: "Designation", sortable: true, filter: true, cellRenderer: ({ value }) => value || "NA" },
        {
            headerName: "DOB",
            field: "DOB",
            sortable: true,
            filter: true,
            cellRenderer: ({ value }) => value ? new Date(value).toLocaleDateString("en-GB") : "NA",
        },
        { headerName: "Experience (Years)", field: "Experience", sortable: true, filter: true, cellRenderer: ({ value }) => value || "NA" },
        { headerName: "Qualification", field: "Qualification", sortable: true, filter: true, cellRenderer: ({ value }) => value || "NA" },
        { headerName: "Location", field: "Location", sortable: true, filter: true, cellRenderer: ({ value }) => value || "NA" },
        {
            headerName: "Joining Date",
            field: "JoiningDate",
            sortable: true,
            filter: true,
            width: 150,
            cellRenderer: ({ value }) => value ? new Date(value).toLocaleDateString("en-GB") : "NA",
        },
        {
            headerName: "Exit Date",
            field: "ExitDate",
            sortable: true,
            filter: true,
            width: 150,
            cellRenderer: ({ value }) => value ? new Date(value).toLocaleDateString("en-GB") : "NA",
        },
    ], []);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
        getAllAgentData(1, e.target.value);
    };

    return (
        <div className="form-wrapper-agent">
            <div className="modify-agent-container">
                <div className="top-actions">
                    <div className="search-container">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search by trainee..."
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                        />
                    </div>
                </div>

                <div className="ag-theme-alpine ag-grid-container">
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={[
                            { 
                                headerName: "S.No", 
                                valueGetter: ({ node }) => node.rowIndex + 1, 
                                width: 80, 
                                headerClass: "custom-header-style" 
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

                <div className="pagination-container">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        <i className="fas fa-arrow-left"></i>
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                        <i className="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CenterTrainee;
