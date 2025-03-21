import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import { Convert24FourHourAndMinute, dateToSpecificFormat } from "Configration/Utilities/dateformat";
import moment from "moment";
import "./TrainingList.scss";
import { AlertMessage } from "../../../../Framework/Components/Widgets/Notification/NotificationProvider";
import { getTrainingListData, getTrainerList, setAssignList, getTrainingTypeData, setCSCUpdateTraining } from "../Services/Methods";
import _ from "lodash";
import { Modal, Button } from "react-bootstrap";
import Select from "react-select";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import AssignUnAssignCenter from "./AssignUnAssignCenter";
import AssignUnassginTraineeByAdmin from "./AssignUnassginTraineeByAdmin.jsx";
import TrainingDetailsPopUp from "./TrainingDetailsPopUp";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { FaEdit } from "react-icons/fa";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { IoMdClose } from "react-icons/io";
import AgentScore from "./AgentScore";

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
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [selectedTrainingDetails, setSelectedTrainingDetails] = useState(null);
  const [trainingTypes, setTrainingTypes] = useState([]);
  const [trainingTitle, setTrainingTitle] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
  const [trainingDate, setTrainingDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [duration, setDuration] = useState("");
  const [trainingLink, setTrainingLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
    const [totalMinutes, setTotalMinutes] = useState(null);
    const [openAgentScoreModal, setOpenAgentScoreModal] = useState(false);
    const [selectedAgentData, setSelectedAgentData] = useState(null);
    

    const toggleAgentScoreModal = (data) => {
      setSelectedTrainingDetails(data);
      setOpenAgentScoreModal(!openAgentScoreModal);
    };

  const toggleTrainingByAdminModal = (data) => {
    setSelectedTrainingDetails(data);
    setOpentrainingByAdminModal(!opentrainingByAdminModal);
    settrainingByAdminModal(data);
  };




  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const toggleEditTrainingModal = (data) => {
    debugger;
    setSelectedData(data);
    setEditModalOpen(true);
  };

  const fetchAllTraining = async (page = 1, query = "") => {
    debugger;
    try {
      const response = await getTrainingListData({ page, limit, searchQuery: query });
      let data = response.response.responseData.items;
      let responseCode = response.response.responseCode;
      if (responseCode === 1) {

        setRowData(data);
        setFilteredData(data);
        setTotalPages(response.response.responseData.totalPages);
      } else {
        setRowData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Error fetching training data:", error);
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

    try {
      const response = await setAssignList(formdata);
      let responseCode = response.response.responseCode;

      if (responseCode === 1) {
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
      }
    } catch (error) {
      console.error("Error assigning trainer:", error);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedTraining(null);
  };

  const ActionCellRenderer = (props) => {
    const { TrainingDate, StartTime } = props.data;
    const currentTime = new Date(); 
  
    const trainingDateObj = new Date(TrainingDate);
    const trainingDateOnly = new Date(trainingDateObj.getFullYear(), trainingDateObj.getMonth(), trainingDateObj.getDate());
  
    const trainingDatePlus7 = new Date(trainingDateOnly);
    trainingDatePlus7.setDate(trainingDatePlus7.getDate() + 6);
  
    const [hours, minutes, seconds] = StartTime.split(":").map(Number);
    const startTimeObj = new Date(trainingDateObj); // Clone training date
    startTimeObj.setHours(hours, minutes, seconds, 0); // Set time
  
    const currentDateOnly = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate());
  
    const isStarted = trainingDateOnly <= currentDateOnly && startTimeObj <= currentTime;
    const isWithin7Days = currentDateOnly <= trainingDatePlus7;
  
    return (
      <>
        {isWithin7Days && ( // Hide these icons after 7 days
          <>
            <i
              className="fa fa-tasks"
              style={{ cursor: "pointer", color: "green", marginRight: "10px" }}
              onClick={() => toggleAssignUnAssignCenterModal(props.data)}
              title="Assign/Unassign Center"
            ></i>
            <i
              className="fa fa-user-graduate"
              style={{ cursor: "pointer", color: "green", marginRight: "10px" }}
              onClick={() => toggleAssignUnAssignTraineeByAdminModal(props.data)}
              title="Assign/Unassign Trainee"
            ></i>
            <i
              className="fa fa-bookmark"
              style={{ cursor: "pointer", color: "green", marginRight: "10px" }}
              onClick={() => toggleTrainingByAdminModal(props.data)}
              title="Mark Training"
            ></i>
         <i
  className="fa fa-chart-line"
  style={{ cursor: "pointer", color: "green", marginRight: "10px" }}
  onClick={() => toggleAgentScoreModal(props.data)} 
  title="Add Score"
></i>

          </>
        )}
        {!isStarted && ( // Hide edit icon if training has started
          <i
            className="fa fa-edit"
            style={{
              cursor: "pointer",
              color: "green",
              marginRight: "10px",
            }}
            onClick={() => toggleEditTrainingModal(props.data)}
            title="Edit Training"
          ></i>
        )}
      </>
    );
  };
  
  
  
  
  
  

  const [columnDefs] = useState([


    {
      headerName: "Action",
      field: "action",
      cellRenderer: ActionCellRenderer,
      width: 120,
      cellStyle: { textAlign: "center" },
    },
    {
      headerName: "Training Status",
      field: "ExpiredFlag",
      sortable: true,
      filter: true,
      width: 150,
      valueGetter: (params) => (params.data.ExpiredFlag === 0 ? "Active" : "Expired"),
    },

    {
      headerName: "Training Type",
      field: "TrainingType",
      sortable: true,
      filter: true,
      width: 150,
    },
    {
      headerName: "Training Title",
      field: "TrainingTitle",
      sortable: true,
      filter: true,
      width: 150,
    },
    {
      headerName: "Training Link",
      field: "TrainingLink",
      sortable: true,
      filter: true,
      width: 250,
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



  const handleSearchInputChange = _.debounce((query) => {
    setSearchQuery(query);
    fetchAllTraining(1, query);
  }, 500);

  const [assignUnAssignCenterModal, setAssignUnAssignCenterModal] =
    useState(false);
  const [openAssignUnAssignCenterModal, setOpenAssignAssignCenterModal] =
    useState(false);
  const toggleAssignUnAssignCenterModal = (data) => {
    debugger;
    setOpenAssignAssignCenterModal(!openAssignUnAssignCenterModal);

    setAssignUnAssignCenterModal(data);
  };

  const [assignUnAssignTraineeByAdminModal, setAssignUnAssignTraineeByAdminModal] =
    useState(false);
  const [trainingByAdminModal, settrainingByAdminModal] =
    useState(false);
  const [openAssignUnAssignTraineeByAdminModal, setOpenAssignAssignTraineeByAdminModal] =
    useState(false);
  const [opentrainingByAdminModal, setOpentrainingByAdminModal] =
    useState(false);
  const toggleAssignUnAssignTraineeByAdminModal = (data) => {
    debugger;
    setOpenAssignAssignTraineeByAdminModal(!openAssignUnAssignTraineeByAdminModal);

    setAssignUnAssignTraineeByAdminModal(data);
  };


  useEffect(() => {
    debugger;
    fetchAllTraining(currentPage, searchQuery);

  }, [currentPage, searchQuery]);

  // A edit code



  const fetchTrainingTypes = async () => {
    debugger;
    try {
      const data = await getTrainingTypeData({ MODE: "#ALL", TrainingID: null });
      if (data.response.responseCode === 1) {
        const responseData = data.response.responseData;
        if (Array.isArray(responseData)) {
          setTrainingTypes(responseData);
        } else {
          setTrainingTypes([]);
        }
      }
    } catch (error) {
      setTrainingTypes([]);
    }
  };

  useEffect(() => {
    debugger;
    fetchTrainingTypes();
    if (selectedData?.TrainingMasterId) {
      setTrainingTitle(selectedData.TrainingTitle || "");
      setSelectedModule(selectedData.TrainingTypeID || "");
      setTrainingLink(selectedData.TrainingLink || "");
      setTrainingDate(new Date(selectedData.TrainingDate));
      setStartTime(selectedData.StartTime || "");
      setEndTime(selectedData.EndTime || "");
      setTotalMinutes(selectedData.Duration || "" );

      const startDate = new Date(`1970-01-01T${selectedData.StartTime}`);
      const endDate = new Date(`1970-01-01T${selectedData.EndTime}`);
      const diffInMinutes = Math.floor((endDate - startDate) / (1000 * 60));
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;
      setDuration(`${hours}hrs ${minutes}min`);
    
      if (selectedData.startTime && selectedData.endTime) {
       
        calculateDuration(selectedData.startTime, selectedData.endTime);
      }
      
    }
  }, [selectedData]);
  


 
  





 

  const handleSubmit = async (e) => {
    debugger;
    e.preventDefault();
    setIsSubmitting(true);

   
    const startDate = new Date(`1970-01-01T${startTime}`);
    const endDate = new Date(`1970-01-01T${endTime}`);

    if (endDate <= startDate) {
        setAlertMessage({ type: "error", message: "Enter a valid time. End time cannot be before start time." });
        setIsSubmitting(false);
        return;
    }

    const updatedTraining = {
        trainingMasterID: selectedData.TrainingMasterId,
        trainingTypeID: parseInt(selectedModule),
        trainingDate: trainingDate.toISOString().split("T")[0],
        startTime: startTime,
        endTime: endTime,
        duration: totalMinutes,
        trainingTitle: trainingTitle,
        trainingLink: trainingLink,
    };

    try {
        const response = await setCSCUpdateTraining(updatedTraining);
        if (response.response.responseCode === 1) {
            setAlertMessage({ type: "success", message: response.response.responseMessage });
            setEditModalOpen(false);
            fetchAllTraining("", "");
        } else {
            setAlertMessage({ type: "error", message: response.response.responseMessage });
        }
    } catch (error) {
        setAlertMessage({ type: "error", message: error });
    } finally {
        setIsSubmitting(false);
    }
};



  


  const calculateDuration = (start, end) => {
    debugger;
    if (!start || !end) {
        setDuration("");
        setTotalMinutes(null);
        return;
    }

    const startDate = new Date(`1970-01-01T${start}`);
    const endDate = new Date(`1970-01-01T${end}`);

    if (endDate <= startDate) {
        
        setTotalMinutes(null);
        return;
    }

    const diffInMinutes = Math.floor((endDate - startDate) / (1000 * 60));
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    const totalCalculatedMinutes = hours * 60 + minutes;

    console.log(`Calculated Duration: ${hours}h ${minutes}m`);
    setDuration(`${hours}hrs ${minutes}min`);
    setTotalMinutes(totalCalculatedMinutes); 
};
  const handleStartTimeChange = (value) => {
    setStartTime(value);
    calculateDuration(value, endTime);
  };

  const handleEndTimeChange = (value) => {
    setEndTime(value);
    
    if (startTime) {
      const start = new Date(`1970-01-01T${startTime}`);
      const end = new Date(`1970-01-01T${endTime}`);

      if (end <= start) {
      
        return;
      }
    }

    calculateDuration(startTime, value);
  };


  return (
    <>
      {  isEditModalOpen && (
      <div className="edittraining-form-wrapper">
        <div className="edittraining-form-container">
          <div className="header-color">
            <h5 className="edittraining-heading" style={{ marginBottom: "8px" }}>
              Edit Training Details
            </h5>
            <IoMdClose className="close-icon" onClick={() => setEditModalOpen(false)} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="edittraining-form-row">
              <div className="edittraining-form-group">
                <label>Training Title</label>
                <input type="text" value={trainingTitle} onChange={(e) => setTrainingTitle(e.target.value)} />
              </div>
              <div className="edittraining-form-group">
                <label>Training Type</label>
                <select value={selectedModule} onChange={(e) => setSelectedModule(e.target.value)}>
                  <option value="">Choose Training Type</option>
                  {trainingTypes?.map((type) => (
                    <option key={type.TrainingID} value={type.TrainingID}>
                      {type.TrainingName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="edittraining-form-row">
              <div className="edittraining-form-group">
                <label htmlFor="training-date">
                  Training Scheduled Date 
                </label>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    id="training-date"
                    value={trainingDate || null}
                    onChange={(newDate) => setTrainingDate(newDate)}
                    minDate={new Date()}
                  />
                </LocalizationProvider>
              </div>
              <div className="edittraining-form-group">
                <label>Start Time</label>
                <input type="time" value={startTime} onChange={(e) => handleStartTimeChange(e.target.value)} required />
              </div>
            </div>

            <div className="edittraining-form-row">
              <div className="edittraining-form-group">
                <label>End Time</label>
                <input type="time" value={endTime} onChange={(e) => handleEndTimeChange(e.target.value)} />
              </div>
              <div className="edittraining-form-group">
                <label>Duration</label>
                <input style={{ width: "300px" }} type="text" value={duration} disabled />
              </div>
            </div>

            <div className="edittraining-form-row">
              <div className="edittraining-form-group" style={{ marginTop: "-80px" }}>
                <label>Training Link</label>
                <input type="text" value={trainingLink} onChange={(e) => setTrainingLink(e.target.value)} />
              </div>
            </div>

            <div className="edittraining-button-group">
              <button type="submit" disabled={isSubmitting} className="edittraining-submit-btn">
                {isSubmitting ? "Updating..." : <><FaEdit /> Update</>}
              </button>
              <button type="button" onClick={() => setEditModalOpen(false)} className="edittraining-cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

      {openAssignUnAssignCenterModal && (
        <AssignUnAssignCenter
          toggleAssignUnAssignCenterModal={toggleAssignUnAssignCenterModal}
          assignUnAssignCenterModal={assignUnAssignCenterModal}
        />
      )}
      {openAssignUnAssignTraineeByAdminModal && (
        <AssignUnassginTraineeByAdmin
          toggleAssignUnAssignTraineeByAdminModal={toggleAssignUnAssignTraineeByAdminModal}
          assignUnAssignTraineeByAdminModal={assignUnAssignTraineeByAdminModal}
        />
      )}
      {opentrainingByAdminModal && (
        <TrainingDetailsPopUp
          toggleTrainingByAdminModal={toggleTrainingByAdminModal}
          trainingByAdminModal={trainingByAdminModal}
          trainingDetails={selectedTrainingDetails}
        />
      )}

{openAgentScoreModal && (
        <AgentScore
          toggleAgentScoreModal={toggleAgentScoreModal}
          agentScoreModal={openAgentScoreModal}
          trainingDetails={selectedTrainingDetails}
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


            <button
              className="create-agent-button"
              onClick={() => navigate("/CreateNewTraining")}
            >
              Create Training &nbsp; <i className="fas fas fa-arrow-right"></i>
            </button>

          </div>

          <div className="ag-theme-alpine ag-grid-container">
            <AgGridReact
              rowData={Array.isArray(filteredData) ? filteredData : []}
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
              <Modal AgentScore={showModal} onHide={handleClose} centered className="custom-modal" size="lg">
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
                      <div className="col-md-4">
                        <label htmlFor="trainingId" className="form-label small-bold-label">Training ID *</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="trainingId"
                          value={selectedTraining.TrainingMasterId}
                          readOnly
                        />
                      </div>

                      <div className="col-md-4">
                        <label htmlFor="trainingName" className="form-label small-bold-label">Training Name *</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="trainingName"
                          value={selectedTraining.TrainingName}
                          readOnly
                        />
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="trainingDate" className="form-label small-bold-label">Training Date *</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="trainingDate"
                          value={moment(selectedTraining.TrainingDate).format("DD-MM-YYYY")}
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="row mb-3">


                      <div className="col-md-4">
                        <label htmlFor="startTime" className="form-label small-bold-label">Start Time *</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="startTime"
                          value={Convert24FourHourAndMinute(selectedTraining.StartTime)}
                          readOnly
                        />
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="endTime" className="form-label small-bold-label">End Time *</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="endTime"
                          value={Convert24FourHourAndMinute(selectedTraining.EndTime)}
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="row mb-3">



                      <div className="col-md-4">
                        <label htmlFor="center" className="form-label small-bold-label">
                          Center *
                        </label>
                        <Select
                          options={center}
                          value={selectedCenter}
                          onChange={handleCenterChange}
                          className="basic-multi-select form-control-sm"
                          classNamePrefix="select"
                          placeholder="Select Center"
                        />
                      </div>

                      <div className="col-md-4">
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


