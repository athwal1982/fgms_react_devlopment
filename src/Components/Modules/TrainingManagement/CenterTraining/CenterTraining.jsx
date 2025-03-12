import React, { useEffect, useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { Convert24FourHourAndMinute } from "Configration/Utilities/dateformat";
import moment from "moment";
import "./CenterTraining.scss";
import { CSCCenterWiseTrainingData } from "../Services/Methods";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import AssignUnassignTrainee from "./AssignUnassignTrainee";
import _ from "lodash";

const CenterTraining = () => {
    const userData = getSessionStorage("user");
    const [rowData, setRowData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [assignUnAssignTraineeModal, setAssignUnAssignTraineeModal] = useState(false);

    const limit = 10;

    const fetchAllCenterWiseTraining = async (page = 1, query = "") => {
        try {
            const response = await CSCCenterWiseTrainingData({
                page,
                limit,
                searchQuery: query,
                SPUserID: userData?.LoginID || 0,
                SPMode: "CENTERTRAINING",
            });

            if (response.response.responseCode === 1) {
                const { result, totalPages } = response.response.responseData;
                setRowData(result);
                setTotalPages(totalPages);
            } else {
                setRowData([]);
            }
        } catch (error) {
            console.error("Error fetching training data:", error);
        }
    };

    useEffect(() => {
        fetchAllCenterWiseTraining(currentPage, searchQuery);
    }, [currentPage]);

    const debouncedSearch = useMemo(() => _.debounce(fetchAllCenterWiseTraining, 500), []);

    const handleSearchInputChange = (query) => {
        setSearchQuery(query);
        debouncedSearch(1, query);
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const toggleAssignUnAssignCenterModal = (data) => {
        setAssignUnAssignTraineeModal(data);
        setShowModal((prev) => !prev);
    };

    const ActionCellRenderer = ({ data }) => (
        <i
            className="fas fa-tasks"
            style={{ cursor: "pointer", color: "green" }}
            onClick={() => toggleAssignUnAssignCenterModal(data)}
            title="Assign/UnAssign Trainee"
        ></i>
    );

    const columnDefs = useMemo(() => [
        {
            headerName: "Action",
            field: "action",
            cellRenderer: ActionCellRenderer,
            width: 100,
            cellStyle: { textAlign: "center" },
        },
        { headerName: "Center Name", field: "Center", sortable: true, filter: true, width: 150 },
        { headerName: "Training Type", field: "TrainingName", sortable: true, filter: true, width: 150 },
        { headerName: "Training Name", field: "TrainingTitle", sortable: true, filter: true, width: 220 },
        { headerName: "Training Link", field: "TrainingLink", sortable: true, filter: true, width: 250 },
        {
            headerName: "Training Date",
            field: "TrainingDate",
            sortable: true,
            filter: true,
            width: 110,
            valueFormatter: ({ value }) => (value ? moment(value).format("DD-MM-YYYY") : ""),
        },
        {
            headerName: "Start Time",
            field: "StartTime",
            sortable: true,
            filter: true,
            width: 100,
            valueGetter: ({ data }) => data.StartTime ? Convert24FourHourAndMinute(data.StartTime) : null,
        },
        {
            headerName: "End Time",
            field: "EndTime",
            sortable: true,
            filter: true,
            width: 100,
            valueGetter: ({ data }) => data.EndTime ? Convert24FourHourAndMinute(data.EndTime) : null,
        },
    ], []);



    return (
        <>
            {showModal && (
                <AssignUnassignTrainee
                    toggleAssignUnAssignCenterModal={toggleAssignUnAssignCenterModal}
                    assignUnAssignTraineeModal={assignUnAssignTraineeModal}
                />
            )}

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
                    </div>

                    <div className="ag-theme-alpine ag-grid-container">
                        <AgGridReact
                            rowData={rowData}
                            columnDefs={[{ headerName: "S.No", valueGetter: (params) => params.node.rowIndex + 1, width: 80 }, ...columnDefs]}
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
                            <i className="fas fas fa-arrow-left"></i>
                        </button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                            <i className="fas fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CenterTraining;
