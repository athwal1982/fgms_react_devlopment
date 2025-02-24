import React, { useEffect, useState } from "react";
import "./CreateTraining.scss";
import { FaPaperPlane } from "react-icons/fa";
import { getTrainingTypeData, createTrainingData } from "../Services/Methods";

const CreateTraining = () => {
  const [trainingTypes, setTrainingTypes] = useState([]);
  const [durations, setDurations] = useState([1, 2, 3, 4, 5, 6, 7]);
  const [selectedModule, setSelectedModule] = useState("");
  const [trainingDate, setTrainingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [duration, setDuration] = useState("");
  const [trainingTitle, setTrainingTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState("");

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

    fetchTrainingTypes();
  }, []);

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
              <input
                type="date"
                id="training-date"
                placeholder="22/11/2024"
                required
                value={trainingDate}
                onChange={(e) => setTrainingDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
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

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : <><FaPaperPlane className="icon" /> Save</>}
          </button>
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
