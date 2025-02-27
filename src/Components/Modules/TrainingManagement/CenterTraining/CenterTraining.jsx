    import React, { useEffect, useState } from "react";
    import { useNavigate } from "react-router-dom";
    import { AgGridReact } from "ag-grid-react";
    import { Convert24FourHourAndMinute, dateToSpecificFormat } from "Configration/Utilities/dateformat";
    import moment from "moment";
    import "./CenterTraining.scss";
    import { AlertMessage } from "../../../../Framework/Components/Widgets/Notification/NotificationProvider";
    import { getTrainingListData, getTrainerList, setAssignList } from "../Services/Methods";
    import _ from "lodash";
    import { Modal, Button } from "react-bootstrap";
    import Select from "react-select";
    import { getSessionStorage } from "Components/Common/Login/Auth/auth";

    const CenterTraining = () => {
    const setAlertMessage = AlertMessage();
    const navigate = useNavigate();
    const userData = getSessionStorage("user");
    const accessCode = userData.CSCAccessTypeID;
    const [rowData, setRowData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(10);
    const [modalRowData, setModalRowData] = useState([]);


    const [trainers, setTrainers] = useState([]);
    const [center, setCenter] = useState([]);

    const [selectedTrainers, setSelectedTrainers] = useState([]);
    const [selectedCenter, setselectedCenter] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [selectedTraining, setSelectedTraining] = useState(null); // Added state for selected training

    // Fetching training data
    const fetchAllTraining = async (page = 1, query = "") => {
        debugger;
        try {
        const response = await getTrainingListData({ page, limit, searchQuery: query });
        let data = response.response.responseData;
        let responseCode = response.response.responseCode;
        if (responseCode === 1) {
            const updatedData = data.map(item => ({
            ...item,
            Assigned: item.Assigned === 1 ? "Yes" : "No"
            }));
            setRowData(updatedData);
            setFilteredData(updatedData);
            setTotalPages(response.totalPages);
            console.log("this is filteredData see trainingID" + JSON.stringify(data));
        } else {
            setRowData([]);
            setFilteredData([]);
            console.error(response.message);
            console.log("this is filteredData see trainingID" + JSON.stringify(data));
        }
        } catch (error) {
        console.error("Error fetching training data:", error);
        }
    };
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
            }))
            );

        } else {
            setCenter([]);
        }
        } catch (error) {
        console.error("Error fetching trainer data:", error);
        }
    };

    const fetchTrainersByCenter = async (centerId) => {
        debugger;
        try {
        const formData = {
            SPMODE: "TRAINEE",
            SPCenterID: centerId,
        };

        const response = await getTrainerList(formData);
        let data = response.response.responseData;
        let responseCode = response.response.responseCode;

        if (responseCode === 1) {
            setTrainers(
            data.map((trainer) => ({
                value: trainer.UserID,
                label: trainer.Name,
            }))
            );
        } else {
            setTrainers([]);
        }
        } catch (error) {
        console.error("Error fetching trainers:", error);
        }
    };


    const handleCenterChange = (selectedOption) => {
        debugger;
        setselectedCenter(selectedOption);

        if (selectedOption) {
        fetchTrainersByCenter(selectedOption.value);
        }
    };

    const setTrainer = async () => {
        debugger;
        const selectedTrainerIds = selectedTrainers.map(trainer => trainer.value);
        const selectedCenterId = selectedCenter ? parseInt(selectedCenter.value, 10) : null;

        // A const selectedCenterId = selectedCenter.length > 0 ? parseInt(selectedCenter[0].value, 10) : null;

        if (!selectedTraining) {
        console.error("No training selected!");
        return;
        }

        const formdata = {
        viewMode: "ASSIGN",
        centerID: selectedCenterId,
        trainingMasterID: selectedTraining.TrainingMasterId,
        userID: selectedTrainerIds.join(","),
        trainingUserAssignmentID: 0,
        cSCAppAccessTypeID: accessCode,
        };

        console.log("Sending API Data:", formdata);

        try {
        const response = await setAssignList(formdata);
        let responseCode = response.response.responseCode;

        if (responseCode === 1) {
            console.log("Trainer assignment successful!", response.response.responseData);
            setShowModal(false);
            setAlertMessage({
            type: "success",
            message: "Trainer Added Successfully",
            });
        } else {
            setAlertMessage({
            type: "error",
            message: result.response.responseMessage,
            });
            console.error("Trainer assignment failed:", response);
        }
        } catch (error) {
        console.error("Error assigning trainer:", error);
        }
    };

  

    const fetchTrainingData = async () => {
      try {
        const response = await getTrainingListData();
        let data = response.response.responseData;
        if (response.response.responseCode === 1) {
          setModalRowData(data);
        } else {
          setModalRowData([]);
        }
      } catch (error) {
        console.error("Error fetching modal training data:", error);
      }
    };

    const handleShow = async (training) => {
        setSelectedTraining(training);
        setShowModal(true);
        await fetchTrainingData();
      };


    const handleClose = () => {
        setShowModal(false);
        setSelectedTraining(null); 
    };

    const ActionCellRenderer = (props) => {
        return (
        <>
        
            <>
            

                <i
                className="fas fa-tasks"
                style={{ cursor: "pointer", color: "green" }}
                onClick={() => handleShow(props.data)}
                title="Assign Trainee"
                ></i>
            </>
        
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
        headerName: "Assigned",
        field: "Assigned",
        width: 100,
        cellStyle: { textAlign: "center" },
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
        valueFormatter: (param) =>
            param.value ? moment(param.value).format("DD-MM-YYYY") : "",
        },
        {
        headerName: "Start Time",
        field: "StartTime",
        sortable: true,
        filter: true,
        width: 100,
        valueGetter: (node) =>
            node.data.StartTime ? Convert24FourHourAndMinute(node.data.StartTime) : null,
        },
        {
        headerName: "End Time",
        field: "EndTime",
        sortable: true,
        filter: true,
        width: 100,
        valueGetter: (node) =>
            node.data.EndTime ? Convert24FourHourAndMinute(node.data.EndTime) : null,
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
        field: "InsertedDateTime",
        sortable: true,
        filter: true,
        width: 140,
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
    const modalColumnDefs = [
       
        {
          headerName: "Action",
          field: "action",
          width: 100,
          cellRenderer: (params) => (
            <button
              className="btn btn-sm btn-primary"
              onClick={() => console.log("Assigning:", params.data)}
            >
              Assign
            </button>
          ),
        },
        { headerName: "Trainee Name", field: "TraineeName", width: 200 },
      ];


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






    useEffect(() => {
        debugger;

        fetchAllTraining(currentPage);
        fetchAllTrainer();
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

            
            </div>

            <div className="ag-theme-alpine ag-grid-container">
                <AgGridReact
                rowData={filteredData}
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

            
                {selectedTraining && (
                <Modal show={showModal} onHide={handleClose} centered className="custom-modal" size="lg">

                    <Modal.Header closeButton className="py-2" style={{ backgroundColor: "#004d00", color: "white" }}>
                    <Modal.Title style={{ fontSize: "1rem" }}>Assign / UnAssign Trainee</Modal.Title>
                    <style>
                        {`
        .btn-close {
            filter: invert(1);
        }
        `}
                    </style>
                    </Modal.Header>

                    <Modal.Body>
                    <div className="ag-theme-alpine ag-grid-container" style={{ height: 300, width: "100%" }}>
 
<AgGridReact
  rowData={modalRowData}
  columnDefs={[
    { headerName: "S.No", valueGetter: (params) => params.node.rowIndex + 1, width: 100 },
    ...modalColumnDefs,
  ]}
  defaultColDef={{
    resizable: true,
    sortable: true,
    headerClass: "custom-header-style",
    cellStyle: { 
      border: "1px solid #ECECEC", 
      padding: "5px", 
      marginLeft: "20px" 
    },
  }}
  rowHeight={30}
/>

          </div>
        </Modal.Body>

                    <Modal.Footer className="py-2" style={{ fontSize: "0.875rem" }}>
                

                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleClose}
                        style={{ backgroundColor: "#6c757d", border: "none", pointerEvents: "auto" }}
                    >
                        Close
                    </Button>

                    </Modal.Footer>
                </Modal>
                )}


            </div>

            {renderPagination()}
            </div>
        </div>
        </>
    );
    };

    export default CenterTraining;
