import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import { Convert24FourHourAndMinute, dateToSpecificFormat } from "Configration/Utilities/dateformat";
import moment from "moment";
import "./TrainingList.scss";
import { AlertMessage } from "../../../../Framework/Components/Widgets/Notification/NotificationProvider";
import { getTrainingListData, getTrainerList, setAssignList } from "../Services/Methods";
import _ from "lodash";
import { Modal, Button } from "react-bootstrap";
import Select from "react-select";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";

const TrainingList = () => {
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


  const [trainers, setTrainers] = useState([]);
  const [center, setCenter] = useState([]);

  const [selectedTrainers, setSelectedTrainers] = useState([]);
  const [selectedCenter, setselectedCenter] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null); // Added state for selected training

  // Fetching training data
  const fetchAllTraining = async (page = 1, query = "") => {
    try {
      const response = await getTrainingListData({ page, limit, searchQuery: query });
      let data = response.response.responseData;
      let responseCode = response.response.responseCode;
      if (responseCode === 1) {
        setRowData(data);
        setFilteredData(data);
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
  const fetchAllTrainer = async (MODE) => {
    const formdata = { SPMODE: MODE };

    try {
      const response = await getTrainerList(formdata);
      let data = response.response.responseData;
      let responseCode = response.response.responseCode;

      if (responseCode === 1) {
        if (MODE === "LOCATIONTRAINER") {
          setTrainers(
            data.map((trainer) => ({
              value: trainer.UserID, 
              label: `${trainer.Name} - ${trainer.Center}`,
            }))
          );
        } else if (MODE === "CENTER") {
          setCenter(
            data.map((center) => ({
              value: center.CenterMasterID, 
              label: `${center.Center} - ${center.Center}`,
            }))
          );
        }
      } else {
        if (MODE === "LOCATIONTRAINER") setTrainers([]);
        else if (MODE === "CENTER") setCenter([]);
      }
    } catch (error) {
      console.error("Error fetching trainer data:", error);
    }
  };

  const setTrainer = async () => {
    debugger;
    const selectedTrainerIds = selectedTrainers.map(trainer => trainer.value);

    const selectedCenterId = selectedCenter.length > 0 ? parseInt(selectedCenter[0].value, 10) : null;

    if (!selectedTraining) {
      console.error("No training selected!");
      return;
    }

    const formdata = {
      viewMode: "ASSIGN",
      centerID: selectedCenterId,
      trainingMasterID: selectedTraining.TrainingMasterId,
      userID: selectedTrainerIds.join(","),
      trainingUserAssignmentID: null,
      cSCAppAccessTypeID:accessCode,
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



  const handleShow = async (training) => {
    debugger;

    try {
      await Promise.all([fetchAllTrainer("LOCATIONTRAINER"), fetchAllTrainer("CENTER")]);

      setSelectedTraining(training);
      console.log("this is handleShow data: " + JSON.stringify(training));
      setShowModal(true);
    } catch (error) {
      console.error("Error in handleShow:", error);
    }
  };


  const handleClose = () => {
    setShowModal(false);
    setSelectedTraining(null); // Clear selected training
  };

  const ActionCellRenderer = (props) => {
    return (
      <>
        {accessCode === 999 && (
          <>
            <i
              className="fas fa-save"
              style={{ cursor: "pointer", color: "green", marginRight: "10px" }}
              onClick={() => handleShow(props.data)}
              title="Save"
            ></i>

            <i
              className="fas fa-edit"
              style={{ cursor: "pointer", color: "green" }}
              onClick={() => handleEdit(props.data)}
              title="Edit"
            ></i>
          </>
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

  const handleEdit = (trainingData) => {
    navigate("/CreateNewTraining", { state: trainingData });
    console.log("Clicked Create New Training: ", JSON.stringify(trainingData));
  };

 


  useEffect(() => {
    fetchAllTrainer();
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

            {accessCode === 999 && ( 
              <button
                className="create-agent-button"
                onClick={() => navigate("/CreateNewTraining")}
              >
                Create Training &nbsp; <i className="fas fas fa-arrow-right"></i>
              </button>
            )}
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

            {/* Modal for Training Details */}
            {selectedTraining && (
              <Modal show={showModal} onHide={handleClose} centered className="custom-modal">

                <Modal.Header closeButton className="py-2" style={{ backgroundColor: "#004d00", color: "white" }}>
                  <Modal.Title style={{ fontSize: "1rem" }}>Edit Training Details</Modal.Title>
                  <style>
                    {`
      .btn-close {
        filter: invert(1);
      }
    `}
                  </style>
                </Modal.Header>

                <Modal.Body>
                  <form>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="trainingId" className="form-label small-bold-label">Training ID *</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="trainingId"
                          value={selectedTraining.TrainingMasterId}
                          readOnly
                        />
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="trainingName" className="form-label small-bold-label">Training Name *</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="trainingName"
                          value={selectedTraining.TrainingName}
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="trainingDate" className="form-label small-bold-label">Training Date *</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="trainingDate"
                          value={moment(selectedTraining.TrainingDate).format("DD-MM-YYYY")}
                          readOnly
                        />
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="startTime" className="form-label small-bold-label">Start Time *</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="startTime"
                          value={Convert24FourHourAndMinute(selectedTraining.StartTime)}
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="endTime" className="form-label small-bold-label">End Time *</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="endTime"
                          value={Convert24FourHourAndMinute(selectedTraining.EndTime)}
                          readOnly
                        />
                      </div>


                      <div className="col-md-6">
                        <label htmlFor="trainer" className="form-label small-bold-label">
                          Center *
                        </label>
                        <Select
                          options={center}
                          
                          value={selectedCenter}
                          onChange={(selectedOptions) => setselectedCenter(selectedOptions)}
                          className="basic-multi-select form-control-sm"
                          classNamePrefix="select"
                          placeholder="Select Center"
                        />
                      </div>
                     
                      
                      <div className="col-md-6">
                        <label htmlFor="trainer" className="form-label small-bold-label">
                          Trainee *
                        </label>
                        <Select
                          options={trainers}
                          isMulti
                          value={selectedTrainers}
                          onChange={(selectedOptions) => setSelectedTrainers(selectedOptions)}
                          className="basic-multi-select form-control-sm"
                          classNamePrefix="select"
                          placeholder="Select Trainee(s)"
                        />


                      </div>



                    </div>
                  </form>
                </Modal.Body>

                <Modal.Footer className="py-2" style={{ fontSize: "0.875rem" }}>
                  <Button
                    size="sm"
                    onClick={() => setTrainer()}
                    style={{ backgroundColor: "#004d00", border: "none", pointerEvents: "auto" }}
                  >
                    Assign
                  </Button>

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

export default TrainingList;
