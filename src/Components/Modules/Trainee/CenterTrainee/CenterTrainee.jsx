import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { Convert24FourHourAndMinute } from "Configration/Utilities/dateformat";
import moment from "moment";
import "./CenterTrainee.scss";
import _ from "lodash";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";

const CenterTrainee = () => {
    const userData = getSessionStorage("user");
    const [rowData, setRowData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(10);


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



    const [columnDefs] = useState([


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
            field: "Location",
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


    ]);


    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
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

    const handleSearchInputChange = (query) => {
        setSearchQuery(query);
        fetchAllCenterWiseTraining(1, query);
    };


    useEffect(() => {
        debugger;
        getAllAgentData(currentPage, "", "");
    }, []);

    return (
        <>

            <div className="form-wrapper-agent">
                <div className="modify-agent-container">
                    <div className="top-actions">
                        <div className="search-container">
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search by trainee..."
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

export default CenterTrainee;
