import { React, useState, useEffect } from "react";
import "./EditAgent.scss";
import { AlertMessage } from "../../../../Framework/Components/Widgets/Notification/NotificationProvider";
import { setUpdateUser, getAllRegion } from "./Services/Methods";

const EditAgent = ({ user, onClose }) => {
  const setAlertMessage = AlertMessage();
  const [regions, setRegions] = useState([]);

  const showAlert = (type, message) => {
    setAlertMessage({ type, message });
  };

  const [formData, setFormData] = useState({
    agentID: user.UserID || "",
    DisplayName: user.DisplayName || "",
    mobile: user.MobileNo || "",
    designation: user.Designation || "",
    email: user.Email || "",
    CSCAgentMasterID: user.CSCAgentMasterID || "",
    UserName: user.UserName || "",
    UserLoginID: user.UserLoginID || "",
    Name: user.Name || "",
    Status: user.Status || "",
    Location: user.Location || "",
    InsertedDateTime: user.InsertedDateTime || "",
    Id: user.Id || "",
    DOB: user.DOB || "",
    MobileNumber: user.MobileNumber || "",
    Qualification: user.Qualification || "",
    Experience: user.Experience || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    debugger;
    e.preventDefault();
    try {
      const requestData = {
        SPUserRefId: String(formData.agentID),
        SPDOB: new Date(formData.DOB).toLocaleDateString("en-GB").replace(/\//g, "-"),
        SPMobileNumber: formData.mobile,
        SPQualification: formData.Qualification,
        SPExperience: formData.Experience,
        SPDesignation: formData.designation,
        SPLocation: formData.Location,
        SPGender: formData.gender,
        SPEmail: formData.email,
      };

      const result = await setUpdateUser(requestData);
      if (result.response.responseCode === 1) {
        showAlert("success", "Trainee Updated Successfully!");
        onClose();
      } else {
        console.error(result.response.responseMessage);
      }
    } catch (error) {
      showAlert("error", "Error occurred while updating agent details.");
    }
  };

  const fetchRegions = async () => {
    const response = await getAllRegion({});
    if (response.response.responseCode === 1) {
      setRegions(response.response.responseData.regions);
    } else {
      console.error("Error fetching regions:", response.response.responseMessage);
      setRegions([]);
    }
  };

  useEffect(() => {
    debugger;
    fetchRegions();
  }, []);

  return (
    <div className="EditAgent-popup-overlay">
      <div className="EditAgent-popup-container">
        <h4>Modify Trainee Details</h4>
        <div className="EditAgent-container">
          <form className="EditAgent-form" onSubmit={handleSubmit}>
            <div className="EditAgent-form-row">
              <div className="EditAgent-form-group">
                <label className="EditAgent-form-label" htmlFor="agentID">Agent ID *</label>
                <input type="text" id="agentID" name="agentID" value={formData.agentID} readOnly />
              </div>
              <div className="EditAgent-form-group">
                <label className="EditAgent-form-label" htmlFor="DisplayName">Name *</label>
                <input type="text" id="DisplayName" name="DisplayName" value={formData.DisplayName} onChange={handleChange} />
              </div>
              <div className="EditAgent-form-group">
                <label className="EditAgent-form-label" htmlFor="Status">Agent Status *</label>
                <input type="text" id="Status" name="Status" value={formData.Status === "Y" ? "Enabled" : "Disabled"} readOnly />
              </div>
            </div>
            <div className="EditAgent-form-actions">
              <button type="button" onClick={onClose} className="EditAgent-cancel-button">Cancel</button>
              <button type="submit" className="EditAgent-submit-btn">Modify Agent</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAgent;
