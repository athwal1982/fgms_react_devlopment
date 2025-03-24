import React, { useEffect, useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { Convert24FourHourAndMinute } from "Configration/Utilities/dateformat";
import moment from "moment";
import "./AgentTraining.scss";
import { getAgentTraining } from "../Services/Methods";
import _ from "lodash";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";

const AgentTraining = () => {

    const [rowData, setRowData] = useState([]);
     const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const userData = getSessionStorage("user");
    const CscUserID = userData.CscUserID;

    const page_size = 10;

    const fetchAllTrainer = async (page_number = 1, query = "") => {
        try {
            const formData = {
                page_number,
                page_size,
                searchQuery: query,
                SPUserID: CscUserID,
                SPMode: "USERTRAINING"
            };
            const response = await getAgentTraining(formData);
    
            let data = response.response.responseData.result;
            let responseCode = response.response.responseCode || 0;
            let totalPages = response.response.responseData.totalPages;
    
            if (responseCode === 1) {
                const transformedData = data.map(item => {
                    const minutes = parseInt(item.Duration, 10) || 0;
                    const hours = Math.floor(minutes / 60);
                    const remainingMinutes = minutes % 60;
                    const formattedDuration = hours > 0 
                        ? `${hours} hrs ${remainingMinutes} mins`
                        : `${remainingMinutes} mins`;
    
                    return {
                        ...item,
                        IsPresent: item.IsPresent === "Y" ? "Present" : item.IsPresent === "N" ? "Absent" : item.IsPresent,
                        Duration: formattedDuration
                    };
                });
                setRowData(transformedData);
                setTotalPages(totalPages);
            } else {
                setRowData([]);
            }
        } catch (error) {
            console.error("Error fetching trainer data:", error);
            setRowData([]);
        }
    };
    

    const ActionCellRenderer = (props) => {
        const { TrainingDate, StartTime, EndTime, TrainingLink } = props.data;

        const currentDateTime = moment();

        const trainingStartDateTime = moment(`${TrainingDate} ${StartTime}`, "YYYY-MM-DD HH:mm").subtract(15, "minutes");
        const trainingEndDateTime = moment(`${TrainingDate} ${EndTime}`, "YYYY-MM-DD HH:mm").add(15, "minutes");


        const isMeetingActive = currentDateTime.isBetween(trainingStartDateTime, trainingEndDateTime);

        return (
            <>
                {TrainingLink && (
                    <a
                        href={isMeetingActive ? TrainingLink : undefined}
                        target={isMeetingActive ? "_blank" : ""}
                        rel="noopener noreferrer"
                        title="Join Meeting"
                        style={{
                            color: isMeetingActive ? "#075307" : "gray",
                            textDecoration: "none",
                            marginRight: "10px",
                            pointerEvents: isMeetingActive ? "auto" : "none",
                            opacity: isMeetingActive ? 1 : 0.5,
                            cursor: isMeetingActive ? "pointer" : "default",
                        }}
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
        // A {
        //  A   headerName: "Progress",
        //  A   field: "ProgressValue",
        //  A   width: 180,
        //  A   cellRenderer: (params) => <ProgressBar value={params.value} />,
        // A },
        {
            headerName: "Training Title",
            field: "TrainingTitle",
            sortable: true,
            filter: true,
            width: 150,
        },

        {
            headerName: "Training Date",
            field: "TrainingDate",
            sortable: true,
            filter: true,
            width: 140,
            valueFormatter: (param) =>
                param.value ? moment(param.value).format("DD-MM-YYYY") : "",
        },
        {
            headerName: "Start Time",
            field: "StartTime",
            sortable: true,
            filter: true,
            width: 140,
            valueGetter: (node) =>
                node.data.StartTime ? Convert24FourHourAndMinute(node.data.StartTime) : null,
        },
        {
            headerName: "End Time",
            field: "EndTime",
            sortable: true,
            filter: true,
            width: 140,
            valueGetter: (node) =>
                node.data.EndTime ? Convert24FourHourAndMinute(node.data.EndTime) : null,
        },
        {
            headerName: "Attendance Status",
            field: "IsPresent",
            sortable: true,
            filter: true,
            width: 150,
        },
        {
            headerName: "Number of Hours",
            field: "Duration",
            sortable: true,
            filter: true,
            width: 150,
        },
        {
            headerName: "Assessment  Score",
            field: "OptedMarks",
            sortable: true,
            filter: true,
            width: 150,
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

    useEffect(() => {
        debugger;
        fetchAllTrainer(currentPage, searchQuery);
    }, [currentPage]);

        const debouncedSearch = useMemo(() => _.debounce(fetchAllTrainer, 500), []);
    
        const handleSearchInputChange = (query) => {
            setSearchQuery(query);
            debouncedSearch(1, query);
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
                                placeholder="Search by training details..."
                                value={searchQuery}
                                onChange={(e) => handleSearchInputChange(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="ag-theme-alpine ag-grid-container">
                        <AgGridReact
                            rowData={rowData}
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


// A const ProgressBar = ({ value = 65 }) => {
//  A   const percentage = value || 0; 
//   A  const color = percentage < 50 ? "red" : "green"; 

//    A return (
//     A    <div style={{ width: "100%", backgroundColor: "#ddd", borderRadius: "25px", position: "relative", overflow: "hidden" }}>
//      A       <div
//         A        style={{
//              A       width: `${percentage}%`,
//               A      backgroundColor: color,
//                A     height: "15px",
//                 A    transition: "width 0.5s ease-in-out",
//                 A    display: "flex",
//                 A    alignItems: "center",
//                A     justifyContent: "center",
//               A      color: "white",
//               A      fontSize: "12px",
//                A     fontWeight: "bold",
//             A    }}
//           A  >
//               A  {percentage}%
//            A </div>
//        A </div>
//  A   );
// A  };
