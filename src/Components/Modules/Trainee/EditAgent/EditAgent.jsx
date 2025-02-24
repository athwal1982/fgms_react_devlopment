import { React, useState, useEffect  } from "react";
import "./EditAgent.scss";
import { AlertMessage } from "../../../../Framework/Components/Widgets/Notification/NotificationProvider";
import {setUpdateUser, getAllRegion} from "./Services/Methods";

const EditAgent = ({ user, onClose }) => {
  debugger;
  const setAlertMessage = AlertMessage();

  const [regions, setRegions] = useState([]);

  const showAlert = (type, message) => {
    setAlertMessage({ type, message });
  };

  const [formData, setFormData] = useState({
    "agentID": user.UserID || "",
    "DisplayName": user.DisplayName || "",
    "mobile": user.MobileNo || "",
    "designation": user.Designation || "",
    "email": user.Email || "",
    "CSCAgentMasterID": user.CSCAgentMasterID || "",
    "UserName": user.UserName || "",
    "UserLoginID": user.UserLoginID || "",
    "Name": user.Name || "",
    "Status": user.Status || "",
    "Location": user.Location || "",
    "InsertedDateTime": user.InsertedDateTime || "",
    "Id": user.Id || "",
    "DOB": user.DOB || "",
    "MobileNumber": user.MobileNumber || "",
    "Qualification": user.Qualification || "",
    "Experience": user.Experience || ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    debugger;
    e.preventDefault();

    try {
      
      const requestData = {
      SPUserRefId: String(formData.agentID),
      SPDOB:  new Date(formData.DOB).toLocaleDateString("en-GB").replace(/\//g, "-"),
      SPMobileNumber: formData.mobile,
      SPQualification: formData.Qualification,
      SPExperience: formData.Experience,
      SPDesignation: formData.designation,
      SPLocation: formData.Location,
      SPGender: formData.gender,
      SPEmail:formData.email
      };
     
      const result = await setUpdateUser(requestData);
        if (result.response.responseCode === 1) {
          setAlertMessage({ type: "success", message: "Trainee Updated Successfully!" });
          onClose(); 
        } else {
          console.error(result.response.responseMessage);
        }
    } catch (error) {
      showAlert("error", "Error occurred while updating agent details.");
    }
  };
  const fetchRegions = async () => {
    debugger;
    const formdata= {};
    const response = await getAllRegion(formdata);

    if (response.response.responseCode === 1 )
    {
      setRegions(response.response.responseData.regions);
    } else {  
      console.error(
        "Error fetching regions:",
        response.response.responseMessage,
      );
      setRegions([]);
    }
  };

  useEffect(() => {
    debugger;
    fetchRegions();
  }, []);

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h4>Modify Trainee Details</h4>
        <div className="container-EditAgent">
          <form className="agent-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="agentID">Agent ID *</label>
                <input
                  type="text"
                  id="agentID"
                  name="agentID"
                  placeholder="Enter Agent ID"
                  value={formData.agentID}
                  onChange={handleChange}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label htmlFor="DisplayName">Name *</label>
                <input
                  type="text"
                  id="DisplayName"
                  name="DisplayName"
                  placeholder="Name"
                  value={formData.DisplayName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="Status">Agent Status *</label>
                <input
                  type="text"
                  id="Status"
                  name="Status"
                  value={formData.Status == "Y" ? "Enabled" : formData.Status == "N" ? "Disabled" : ""}
                  onChange={handleChange}
                  readOnly
                />
              </div>
            </div>

            <div className="form-row">
            <div className="form-group">
    <label htmlFor="gender">Gender *</label>
    <select
      id="gender"
      name="gender"
      value={formData.gender || ""}
      onChange={handleChange}
      required
    >
      <option value="" disabled>
        Select Gender
      </option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      <option value="Other">Other</option>
    </select>
  </div>
              <div className="form-group">
                <label htmlFor="email">Agent Email Id *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter Email-Id"
                  value={formData.email}
                  onChange={handleChange}
                  
                />
              </div>
              <div className="form-group">
                <label htmlFor="DOB">Date of Birth *</label>
                <input
                  type="date"
                  id="DOB"
                  name="DOB"
                  value={formData.DOB}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="mobile">Mobile Number *</label>
                <input
                  type="text"
                  id="mobile"
                  name="mobile"
                  placeholder="Enter Mobile Number"
                  value={formData.mobile}
                  onChange={handleChange}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label htmlFor="Qualification">Qualification *</label>
                <input
                  type="text"
                  id="Qualification"
                  name="Qualification"
                  placeholder="Enter Qualification"
                  value={formData.Qualification}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="Experience">Experience *</label>
                <input
                  type="text"
                  id="Experience"
                  name="Experience"
                  placeholder="Enter Experience"
                  value={formData.Experience}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="designation">Designation *</label>
                <input
                  type="text"
                  id="designation"
                  name="designation"
                  placeholder="Enter Designation"
                  value={formData.designation}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="Location">Location *</label>
                <input
                  type="text"
                  id="Location"
                  name="Location"
                  placeholder="Enter Location"
                  value={formData.Location}
                  onChange={handleChange}
                />
              </div>
              {/* <div className="form-group">
                <label htmlFor="region">Region *</label>
                <input
                  type="text"
                  id="region"
                  name="region"
                  placeholder="Enter Region"
                  value={formData.region}
                  onChange={handleChange}
                />
              </div> */}
             {/* <div className="form-group">
                <label htmlFor="region">Region *</label>
                <select
                  id="region"
                  name="region"
                  value={formData.region} 
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    {formData.region ? "Select a region" : "Choose Region"} 
                  </option>
                  {regions.map((region) => (
                    <option key={region.RegionName} value={region.RegionName}>
                      {region.RegionName}
                    </option>
                  ))}
                </select>
              </div> */}
            </div>
            {/* <div className="form-row">
              <div className="form-group">
                <label htmlFor="designation">State *</label>
                <input
                  type="text"
                  id="State"
                  name="State"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="Location">City *</label>
                <input
                  type="text"
                  id="City"
                  name="City"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
               
              </div>
            </div> */}
            <div className="form-actions">
              <button type="button" onClick={onClose} className="cancel-button">
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                Modify Agent
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAgent;
