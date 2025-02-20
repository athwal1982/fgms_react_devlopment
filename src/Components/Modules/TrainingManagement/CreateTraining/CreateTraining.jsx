import React, { useEffect, useState } from "react";
import "./CreateTraining.scss";
import { FaPaperPlane } from "react-icons/fa";
import { getTrainingTypeData } from "../Services/Methods";

const CreateTraining = () => {
  // Define the state to store the training types
  const [trainingTypes, setTrainingTypes] = useState([]);
  
  // Define the state for selected options
  const [selectedModule, setSelectedModule] = useState("");
  const [trainingDate, setTrainingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Function to fetch training types based on the selected module (by MODE and TrainingID)
  const fetchTrainingType = async (body) => {
    try {
      const data = await getTrainingTypeData(body); 
      if(data.response.responseCode == 1 ){
        setTrainingTypes(data); // Assuming data is an array of training types
      }
      setTrainingTypes([]);
        // Assuming data is an array of training types
    } catch (error) {
      console.error("Error fetching training data:", error);
    }
  };

  // Function to handle dropdown value change and fetch the training types
  const handleModuleChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedModule(selectedValue);

    const body = {
      MODE: selectedValue === "#ALL" ? "#ALL" : "BYID",
      TrainingID: selectedValue !== "#ALL" ? selectedValue : null, 
    };

    fetchTrainingType(body);  
  };

  
  useEffect(() => {
    const body = { MODE: "#ALL", TrainingID: null };  
    fetchTrainingType(body);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      selectedModule,
      trainingDate,
      startTime,
      endTime,
    });
  };

  return (
    <>
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
                  onChange={handleModuleChange}  // Update when selection changes
                >
                  <option value="" disabled>
                    Choose Training Type
                  </option>
                  {/* {trainingTypes?.map((type) => (
                    <option key={type.TrainingID} value={type.TrainingID}>
                      {type.name} 
                    </option>
                  ))} */}
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
            <button type="submit" className="submit-btn">
              <FaPaperPlane className="icon" /> Save
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateTraining;
