import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useState } from "react";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { checkFarmerByMobileNumber, checkFarmerByAccountNumber } from "../Services/Methods";

function FarmerAuthenticateLogics() {
  const setAlertMessage = AlertMessage();
  const [authenticateMethod, setAuthenticateMethod] = useState("1");
  const [authenticateFarmerData, setAuthenticateFarmerData] = useState([]);

  const [formValues, setFormValues] = useState({
    txtMobileNumber: "",
    txtAccountNumber: "",
    txtAadharNumber: "",
  });

  const [formValidationError, setFormValidationError] = useState({});

  const validateField = (name, value) => {
    let errorsMsg = "";
    const regex = new RegExp("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$");
    if (authenticateMethod === "1") {
      if (name === "txtMobileNumber") {
        if (!value || typeof value === "undefined") {
          errorsMsg = "Mobile Number is required!";
        } else if (value) {
          if (!regex.test(value)) {
            errorsMsg = "Mobile Number is not valid!";
          } else if (value.length < 10) {
            errorsMsg = "Enter Valid 10 digit Mobile Number!";
          }
        }
      }
    }

    if (authenticateMethod === "2") {
      if (name === "txtAccountNumber") {
        if (!value || typeof value === "undefined") {
          errorsMsg = "Account Number is required!";
        } else if (value) {
          if (!regex.test(value)) {
            errorsMsg = "Enter numeric value for Account Number !";
          } else if (value.length < 14) {
            errorsMsg = "Enter Valid 14 digit Account Number!";
          }
        }
      }
      if (name === "txtAadharNumber") {
        if (!value || typeof value === "undefined") {
          errorsMsg = "Aadhar Number is required!";
        } else if (value) {
          if (!regex.test(value)) {
            errorsMsg = "Enter numeric value for Aadhar Number !";
          } else if (value.length < 4) {
            errorsMsg = "Enter last 4 digit of Aadhar Number!";
          }
        }
      }
    }

    return errorsMsg;
  };

  const updateState = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
    formValidationError[name] = validateField(name, value);
  };

  const handleValidation = () => {
    try {
      const errors = {};
      let formIsValid = true;
      errors["txtMobileNumber"] = validateField("txtMobileNumber", formValues.txtMobileNumber);
      errors["txtAccountNumber"] = validateField("txtAccountNumber", formValues.txtAccountNumber);
      errors["txtAadharNumber"] = validateField("txtAadharNumber", formValues.txtAadharNumber);

      if (Object.values(errors).join("").toString()) {
        formIsValid = false;
      }
      setFormValidationError(errors);
      return formIsValid;
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: "Something Went Wrong",
      });
      return false;
    }
  };

  const [btnloaderActive, setBtnloaderActive] = useState(false);
  const handleAuthenticate = async (e, setFarmerAuthenticateModal, setfarmerAuthenticateDataList) => {
    try {
      if (e) e.preventDefault();
      if (!handleValidation()) {
        return;
      }

      debugger;

      setBtnloaderActive(true);
      let result = "";
      let formData = "";
      if (authenticateMethod === "1") {
        formData = {
          mobilenumber: formValues.txtMobileNumber,
        };
        result = await checkFarmerByMobileNumber(formData);
      } else if (authenticateMethod === "2") {
        const userData = getSessionStorage("user");
        formData = {
          mobilenumber: userData.UserMobileNumber || "7906071897",
          accountNumber: formValues.txtAccountNumber,
          aadharNumber: formValues.txtAadharNumber,
        };
        result = await checkFarmerByAccountNumber(formData);
      }

      if (result.response.responseCode === 1) {
        const resultResponse = JSON.parse(result.response.responseData);
        if (resultResponse.data.output === 0) {
          setAlertMessage({
            type: "error",
            message: "Farmer does not exist.",
          });
        } else if (resultResponse.data.output === 1) {
          console.log(resultResponse.data.result);
          if (authenticateMethod === "1") {
            setAuthenticateFarmerData(resultResponse.data.result);
            setfarmerAuthenticateDataList(resultResponse.data.result);
          } else if (authenticateMethod === "2") {
            setAuthenticateFarmerData(resultResponse.data.result[0]);
            setfarmerAuthenticateDataList(resultResponse.data.result[0]);
          }

          setFarmerAuthenticateModal(false);
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }

      setBtnloaderActive(false);
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  return {
    authenticateMethod,
    setAuthenticateMethod,
    formValues,
    formValidationError,
    btnloaderActive,
    handleAuthenticate,
    updateState,
    authenticateFarmerData,
  };
}

export default FarmerAuthenticateLogics;
