import React, { useEffect, useState } from "react";
import "./CreateTraining.scss";
import { useNavigate } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";
import { getTrainingTypeData, createTrainingData, getUpcomingTrainings } from "../Services/Methods";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format, isSameDay } from "date-fns";
import { useLocation } from "react-router-dom";

const CreateTraining = ({props}) => {
   const navigate = useNavigate();
  const location = useLocation();
  const trainingData = location.state || {}; 
  const [trainingTypes, setTrainingTypes] = useState([]);
  const [durations, setDurations] = useState([1, 2, 3, 4, 5, 6, 7]);
  const [selectedModule, setSelectedModule] = useState("");
  const [trainingDate, setTrainingDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [duration, setDuration] = useState("");
  const [trainingTitle, setTrainingTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [existingTrainingDates, setExistingTrainingDates] = useState([]);
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipVisible, setTooltipVisible] = useState(false);

  useEffect(() => {
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

    const fetchExistingTrainingDates = async () => {
      try {
        const data = await getUpcomingTrainings();
        console.log(data);
    
        if (data.response.responseCode === 1) {
          const filteredData = data.response.responseData.filter(training => {
            return new Date(training.TrainingDate) >= new Date(); 
          });
          
          setExistingTrainingDates(filteredData);
        } else {
          setExistingTrainingDates([]); 
        }
      } catch (error) {
        console.error("Error fetching existing training dates", error);
      }
    };
    

    fetchTrainingTypes();
    fetchExistingTrainingDates();
  }, []);

  const isHighlightedDate = (date) => {
    return existingTrainingDates.some(trainingDate => isSameDay(trainingDate, date));
  };

  const renderDay = (day, _selectedDate, isInCurrentMonth, dayComponent) => {
    const isHighlighted = isHighlightedDate(day);
    return (
      <div
        style={{
          position: "relative",
          backgroundColor: isHighlighted ? "#ffeb3b" : "transparent",
          borderRadius: "50%",
          width: "36px",
          height: "36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {dayComponent}
      </div>
    );
  };

  const capitalizeText = (text) => {
    if (!text) return text; 
    return text
      .split(" ") 
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) 
      .join(" "); 
  };
  const getDateOnly = (date) => {
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };
  

  const convertToAMPM = (time) => {
    if (!time || !/^\d{2}:\d{2}:\d{2}$/.test(time)) {
      throw new Error("Invalid time format. Please use 'hh:mm:ss' format.");
    }
  
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);
  
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
  
    if (hours === 0) {
      hours = 12;
    }
  
    minutes = minutes.padStart(2, "0");
  
    return `${hours}:${minutes} ${period}`;
  };
  

  const handleMouseEnter = (date) => {
    const training = existingTrainingDates.find(trainingDate => isSameDay(trainingDate, date));
    if (training) {
      setTooltipContent(`Time: ${training.startTime} - ${training.endTime}`);
      setTooltipVisible(true);
    }
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  const updateEndTime = (duration, startTime) => {
    if (!startTime) return;
    const start = new Date(`1970-01-01T${startTime}:00Z`);
    start.setHours(start.getHours() + parseInt(duration));
    const end = start.toISOString().substr(11, 5);
    setEndTime(end);
  };

  const handleDurationChange = (e) => {
    const selectedDuration = e.target.value;
    setDuration(selectedDuration);
    updateEndTime(selectedDuration, startTime);
  };

  const handleStartTimeChange = (e) => {
    const selectedStartTime = e.target.value;
    setStartTime(selectedStartTime);
    if (duration) {
      updateEndTime(duration, selectedStartTime);
    }
  };

  const handleEndTimeChange = (e) => {
    const selectedEndTime = e.target.value;
    setEndTime(selectedEndTime);
    const start = new Date(`1970-01-01T${startTime}:00Z`);
    const end = new Date(`1970-01-01T${selectedEndTime}:00Z`);
    const timeDifference = (end - start) / (1000 * 60 * 60);
    if (timeDifference < duration) {
      setSubmissionStatus("End time must be greater than start time by the selected duration.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedModule || !trainingDate || !startTime || !endTime || !duration || !trainingTitle) {
      setSubmissionStatus("Please fill in all the fields.");
      return;
    }

    const trainingData = {
      TrainingTypeID: selectedModule,
      TrainingDate: trainingDate,
      StartTime: startTime,
      EndTime: endTime,
      Duration: duration,
      TrainingTitle: trainingTitle,
    };

    setIsSubmitting(true);
    setSubmissionStatus("");

    try {
      const response = await createTrainingData(trainingData);
      if (response.response.responseCode === 1) {
        setSubmissionStatus("Training created successfully!");
      } else {
        setSubmissionStatus("Failed to create training. Please try again.");
      }
    } catch (error) {
      setSubmissionStatus("Error submitting the data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  useEffect(() => {
    if (trainingData?.TrainingMasterId) {
      setTrainingTitle(trainingData.TrainingName || "");
      setSelectedModule(trainingData.TrainingTypeID || "");
      setTrainingDate(trainingData.TrainingDate || "");
      setStartTime(trainingData.StartTime || "");
      setEndTime(trainingData.EndTime || "");
      
    
      if (trainingData.StartTime && trainingData.EndTime) {
        const start = new Date(`1970-01-01T${trainingData.StartTime}`);
        const end = new Date(`1970-01-01T${trainingData.EndTime}`);
        const durationInHours = (end - start) / (1000 * 60 * 60);
        setDuration(durationInHours);
      }
    }
  }, [trainingData]);

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="training-module">Training module *</label>
              <select
                id="training-module"
                required
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
              >
                <option value="" disabled>
                  Choose Training Type
                </option>
                {Array.isArray(trainingTypes) && trainingTypes.length === 0 ? (
                  <option disabled>No training types available</option>
                ) : (
                  Array.isArray(trainingTypes) &&
                  trainingTypes.map((type) => (
                    <option key={type.TrainingID} value={type.TrainingID}>
                      {type.TrainingName}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="training-date">Training scheduled date *</label>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  id="training-date"
                  required
                  value={trainingDate}
                  onChange={(newDate) => setTrainingDate(newDate)}
                  minDate={new Date()}
                  renderInput={(params) => <TextField {...params} />}
                  disablePast
                  renderDay={renderDay}
                />
              </LocalizationProvider>
            </div>
            <div
              className="form-group time-group"
              style={{ display: "flex", flexDirection: "row", gap: "20px", marginRight: "0px" }}
            >
              <div>
                <label htmlFor="training-start-time">Training start time *</label>
                <input
                  style={{ width: "200px" }}
                  type="time"
                  id="training-start-time"
                  required
                  value={startTime}
                  onChange={handleStartTimeChange}
                />
              </div>
              <div>
                <label htmlFor="training-end-time">Training end time *</label>
                <input
                  style={{ width: "200px" }}
                  type="time"
                  id="training-end-time"
                  required
                  value={endTime}
                  onChange={handleEndTimeChange}
                />
              </div>
            </div>
          </div>

                     <div className="form-row">
      <div className="scheduled-training-box">
        <h5>Training Booked Slot</h5>
        <table className="training-timetable">
          <thead>
            <tr>
              <th>Training Name</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
            </tr>
          </thead>
          <tbody>
            {existingTrainingDates.map((training, index) => (
              <tr key={index} className={training.isUpcoming ? "highlight-upcoming-training" : ""}>
                <td>{capitalizeText(training.TrainingTitle)}</td>
                <td>{getDateOnly(training.TrainingDate)}</td>
                <td>{convertToAMPM(training.StartTime)}</td>
                <td>{convertToAMPM(training.EndTime)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
   





          <div className="form-row">
            <div className="form-group">
              <label htmlFor="training-duration">Duration *</label>
              <select
                id="training-duration"
                required
                value={duration}
                onChange={handleDurationChange}
              >
                <option value="" disabled>
                  Choose Duration
                </option>
                {durations.map((dur, index) => (
                  <option key={index} value={dur}>
                    {dur} hours
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="training-title">Training Title *</label>
              <input
                type="text"
                id="training-title"
                placeholder="Enter training title"
                required
                value={trainingTitle}
                onChange={(e) => setTrainingTitle(e.target.value)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="training-title">Training Link *</label>
              <input
                type="text"
                id="training-link"
                placeholder="Enter training Link"
                required
                value={trainingTitle}
                onChange={(e) => setTrainingTitle(e.target.value)}
              />
            </div>
          </div>

          <div className="button-group">
  {/* Save Button */}
  <button type="submit" className="submit-btn save-btn" disabled={isSubmitting}>
    {isSubmitting ? "Submitting..." : <><FaPaperPlane className="icon" /> Save</>}
  </button>

  {/* Cancel Button */}
  <button type="button" className="submit-btn cancel-btn" onClick={() => navigate("/TrainingList")}>
    Cancel
  </button>

  {/* Clear Button */}
  <button
    type="button"
    className="submit-btn clear-btn"
    onClick={() => {
      setSelectedModule("");
      setTrainingDate("");
      setStartTime("");
      setEndTime("");
      setDuration("");
      setTrainingTitle("");
    }}
  >
    Clear
  </button>
</div>


        </form>

        {submissionStatus && (
          <div className={`status-message ${submissionStatus.includes("success") ? "success" : "error"}`}>
            {submissionStatus}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateTraining;