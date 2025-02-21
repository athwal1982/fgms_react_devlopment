import React, { useEffect, useState } from "react";
import "./CreateTraining.scss";
import { FaPaperPlane } from "react-icons/fa";
import { getTrainingTypeData, createTrainingData } from "../Services/Methods"; // Added createTrainingData function

const CreateTraining = () => {
  const [trainingTypes, setTrainingTypes] = useState([]);
  
  // Define the state for selected options
  const [selectedModule, setSelectedModule] = useState("");
  const [trainingDate, setTrainingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState(""); 
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const currentDate = new Date().toISOString().split("T")[0];
  const fetchTrainingType = async (body) => {
    try {
      const data = await getTrainingTypeData(body);
      console.log(data);
      if (data.response.responseCode === 1) {
        setTrainingTypes(data.response.responseData); // Assuming data is an array of training types
      } else {
        setTrainingTypes([]);
      }
    } catch (error) {
      console.error("Error fetching training data:", error);
    }
  };

  // Use effect to fetch training types on initial load
  useEffect(() => {
    const body = { MODE: "#ALL", TrainingID: null };
    fetchTrainingType(body);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any required fields are empty
    if (!selectedModule || !trainingDate || !startTime || !endTime) {
      setSubmissionStatus("Please fill in all the fields.");
      return;
    }

    const trainingData = {
      TrainingTypeID: selectedModule,
      TrainingDate: trainingDate,
      StartTime: startTime,
      EndTime: endTime,
    };
    console.log(JSON.stringify(trainingData));

    setIsSubmitting(true); // Start submitting state
    setSubmissionStatus(""); // Clear previous submission status

    try {
      const response = await createTrainingData(trainingData);
      console.log(response, "dsdfdfdf");

      if (response.response.responseCode === 1) {
        setSubmissionStatus("Training created successfully!");
      } else {
        setSubmissionStatus("Failed to create training. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting the training data:", error);
      setSubmissionStatus("Error submitting the data. Please try again.");
    } finally {
      setIsSubmitting(false); // End submitting state
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
                onChange={(e) => setSelectedModule(e.target.value)} // Directly set state on change
              >
                <option value="" disabled>
                  Choose Training Type
                </option>
                {trainingTypes?.map((type) => (
                  <option key={type.TrainingID} value={type.TrainingID}>
                    {type.TrainingName}
                  </option>
                ))}
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
      min={currentDate} 
    />
            </div>
            <div
              className="form-group time-group"
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "20px",
                marginRight: "0px",
              }}
            >
              <div>
                <label htmlFor="training-start-time">Training start time *</label>
                <input
                  style={{ width: "200px" }}
                  type="time"
                  id="training-start-time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
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
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting} // Disable button during submission
          >
            <FaPaperPlane className="icon" /> {isSubmitting ? "Saving..." : "Save"}
          </button>
        </form>
        {submissionStatus && <p className="submission-status">{submissionStatus}</p>} {/* Display submission status */}
      </div>
    </div>
  );
};

export default CreateTraining;
