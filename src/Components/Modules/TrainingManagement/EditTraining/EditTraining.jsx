import React, { useEffect, useState } from "react";
import "./EditTraining.scss";
import { AlertMessage } from "../../../../Framework/Components/Widgets/Notification/NotificationProvider";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { getTrainingTypeData, setCSCUpdateTraining, getTrainingListData } from "../Services/Methods";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { IoMdClose } from "react-icons/io";
import fetchAllTraining from "../TrainingList/TrainingList";

const EditTraining = ({ trainingData, onClose }) => {
  const setAlertMessage = AlertMessage();
  const navigate = useNavigate();
  const [trainingTypes, setTrainingTypes] = useState([]);
  const [trainingTitle, setTrainingTitle] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
  const [trainingDate, setTrainingDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [duration, setDuration] = useState("");
  const [trainingLink, setTrainingLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trainingDateErrorMsg, setTrainingDateErrorMsg] = useState("");

  const fetchTrainingTypes = async () => {
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
    fetchTrainingTypes();
    if (trainingData?.TrainingMasterId) {
      setTrainingTitle(trainingData.TrainingTitle || "");
      setSelectedModule(trainingData.TrainingTypeID || "");
      setTrainingLink(trainingData.TrainingLink || "");
      setTrainingDate(new Date(trainingData.TrainingDate));
      setStartTime(trainingData.StartTime || "");
      setEndTime(trainingData.EndTime || "");
      setDuration(trainingData.Duration || "");

      if (trainingData.StartTime && trainingData.EndTime) {
        const start = new Date(`1970-01-01T${trainingData.StartTime}`);
        const end = new Date(`1970-01-01T${trainingData.EndTime}`);
        const durationInHours = (end - start) / (1000 * 60 * 60);
        setDuration(durationInHours);
      }
    }
  }, [trainingData]);


  const calculateEndTime = (start, duration) => {
    if (!start || !duration) return "";
    
    const [hours, minutes] = start.split(":").map(Number);
    const newEndTime = new Date();
    newEndTime.setHours(hours + parseInt(duration), minutes, 0);

    return newEndTime.toTimeString().slice(0, 5); 
  };

  useEffect(() => {
    if (startTime && duration) {
      const newEndTime = calculateEndTime(startTime, duration);
      setEndTime(newEndTime);
    }
  }, [startTime, duration]);

  const handleDurationChange = (e) => {
    setDuration(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const updatedTraining = {
      trainingMasterID: trainingData.TrainingMasterId,
      trainingTypeID: parseInt(selectedModule),
      trainingDate: trainingDate.toISOString().split("T")[0],
      startTime: startTime,
      endTime: endTime,
      duration: parseFloat(duration),
      trainingTitle: trainingTitle,
      trainingLink: trainingLink,
    };

    try {
      const response = await setCSCUpdateTraining(updatedTraining);
      if (response.response.responseCode === 1) {
        setAlertMessage({ type: "success", message: response.response.responseMessage });
        onClose();
        fetchAllTraining();
      } else {
        setAlertMessage({ type: "error", message: response.response.responseMessage });
      }
    } catch (error) {
      setAlertMessage({ type: "error", message: error });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="edittraining-form-wrapper">
      <div className="edittraining-form-container">
        <h5 className="edittraining-heading" style={{ marginBottom: "20px" }}>Edit Training Details</h5>
        <IoMdClose className="close-icon" onClick={onClose} />
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
                {trainingTypes.map((type) => (
                  <option key={type.TrainingID} value={type.TrainingID}>{type.TrainingName}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="edittraining-form-row">
            <div className="edittraining-form-group">
              <label htmlFor="training-date">
                Training Scheduled Date <span className="asteriskCss">&#42;</span>
              </label>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  id="training-date"
                  value={trainingDate || null}
                  onChange={(newDate) => setTrainingDate(newDate)}
                  minDate={new Date()}
                  renderInput={(params) => <TextField {...params} />}
                  disablePast
                />
              </LocalizationProvider>
              <span className="login_ErrorTxt">{trainingDateErrorMsg}</span>
            </div>
            <div className="edittraining-form-group">
              <label>Start Time</label>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
          </div>
          <div className="edittraining-form-row">
            <div className="edittraining-form-group">
              <label>End Time</label>
              <input type="time" value={endTime} disabled />
            </div>
            <div className="edittraining-form-group">
              <label>Duration</label>
              <select value={duration} onChange={handleDurationChange}>
                <option value="">Select Duration</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} Hour{i + 1 > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
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
            <button type="button" onClick={onClose} className="edittraining-cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTraining;
