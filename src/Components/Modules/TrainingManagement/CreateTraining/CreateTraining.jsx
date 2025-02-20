import React from "react";
import "./CreateTraining.scss";
import { FaPaperPlane } from "react-icons/fa";
import {getTrainingTypeData} from "../Services/Methods";

const CreateTraining = () => {
  return (
    <>
      <div className="form-wrapper">
        <div className="form-container">
          <form>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="training-module">Training module *</label>
                <select id="training-module" required>
                  <option value="" disabled selected>
                    Choose Training Type
                  </option>
                  <option value="module-1">Module 1</option>
                  <option value="module-2">Module 2</option>
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
                />
              </div>
              <div
                className="form-group time-group"
                style={{ display: "flex", flexDirection: "row", gap: "20px" ,marginRight: "0px"}}
              >
                <div>
                  <label htmlFor="training-start-time">
                    Training start time *
                  </label>
                  <input
                    style={{ width: "200px" }}
                    type="time"
                    id="training-start-time"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="training-end-time">Training end time *</label>
                  <input
                    style={{ width: "200px" }}
                    type="time"
                    id="training-end-time"
                    required
                  />
                </div>
              </div>
            </div>
            <button  className="submit-btn">
              <FaPaperPlane className="icon" /> Save
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateTraining;
