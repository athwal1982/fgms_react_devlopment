import React, { useState, useEffect } from "react";
import "./UpdateProfile.scss";
import { getAgentDetails, UpdateAgentProfile } from "../Services/Methods";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { AlertMessage } from "../../../../Framework/Components/Widgets/Notification/NotificationProvider";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    agentID: "",
    fullName: "",
    email: "",
    mobile: "",
    designation: "",
    region: "",
    state: "",
    city: "",
    qualification: "",
    experience: "",
    gender: "",
    dob: "",
    location: "",
    type: "",
    agentStatus: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const setAlertMessage = AlertMessage();
  const userData = getSessionStorage("user");
  const CscUserID = userData.CscUserID;

  const fetchAgentDetails = async () => {
    try {
      const response = await getAgentDetails({ SPUserID: CscUserID });
      const data = response.response.responseData[0];
      const responseCode = response.response.responseCode;

      if (responseCode === 1) {
        setFormData({
          agentID: data.UserID || "",
          fullName: data.Name || "",
          email: data.Email || "",
          mobile: data.MobileNo || data.MobileNumber || "",
          designation: data.Designation || "",
          region: data.Center || "",
          state: "",
          city: "",
          qualification: data.Qualification || "",
          experience: data.Experience || "",
          gender: data.Gender == 0 ? "Male" : data.Gender == 1 ? "Female" : "Other",
          dob: data.DOB || "",
          location: "",
          type: data.CSCAppAccessTypeID || "",
          agentStatus: data.Status || "",
        });
      }
    } catch (error) {
      console.error("Error fetching agent data:", error);
    }
  };

  const validateForm = () => {
    let errors = {};

    if (!formData.email || formData.email === "") {
      errors.email = "Email cannot be empty";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Enter a valid email address";
    }

    if (!formData.gender || formData.gender === "") {
      errors.gender = "Please select gender";
    }

    if (!formData.experience || formData.experience === "") {
      errors.experience = "Experience cannot be empty";
    } else if (isNaN(formData.experience) || parseInt(formData.experience) < 0) {
      errors.experience = "Enter a valid number";
    }

    if (!formData.designation || formData.designation === "") {
      errors.designation = "Designation cannot be empty";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const updateAgentProfile = async () => {
    debugger;
    if (!validateForm()) return;

    const genderMapping = {
      Male: 0,
      Female: 1,
      Other: 2,
    };

    const payload = {
        SPViewMode: "UPDATEBYAGENT",
        SPUserID: formData.agentID,
        email: formData.email,
        gender: String(genderMapping[formData.gender] ?? ""), 
        experience: parseInt(formData.experience, 10) || 0, 
        designation: formData.designation,
        JoiningDate: "",
        RejoiningDate:"",
        ExitDate: "",
      };
      

    try {
      const response = await UpdateAgentProfile(payload);
      const responseCode = response.response.responseCode;

      if (responseCode === 1) {
        setAlertMessage({
          message: "Profile updated successfully",
          type: "success",
         
        });
        navigate("/AgentTrainings");
      } else {
        setAlertMessage({
          message: "Failed to update profile",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setAlertMessage({
        message: "Something went wrong. Please try again.",
        type: "error",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateAgentProfile();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name] && value !== "") {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  useEffect(() => {
    fetchAgentDetails();
  }, []);

  return (
    <div className="update-profile-container">
      <div className="update-profile-card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label  className="UpdateProfile-form-label">Agent ID</label>
              <input type="text" name="agentID" value={formData.agentID} disabled />
            </div>
            <div className="form-group">
              <label  className="UpdateProfile-form-label">Full Name</label>
              <input type="text" name="fullName" value={formData.fullName} disabled />
            </div>
            <div className="form-group">
              <label  className="UpdateProfile-form-label">Mobile Number</label>
              <input type="text" name="mobile" value={formData.mobile} disabled />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label  className="UpdateProfile-form-label">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label  className="UpdateProfile-form-label">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <span className="error">{errors.gender}</span>}
            </div>

            <div className="form-group">
              <label  className="UpdateProfile-form-label">Experience</label>
              <input type="text" name="experience" value={formData.experience} onChange={handleChange} />
              {errors.experience && <span className="error">{errors.experience}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label  className="UpdateProfile-form-label">Designation</label>
              <input type="text" name="designation" value={formData.designation} onChange={handleChange} />
              {errors.designation && <span className="error">{errors.designation}</span>}
            </div>
            <div className="form-group"></div>
            <div className="form-group"></div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
             Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
