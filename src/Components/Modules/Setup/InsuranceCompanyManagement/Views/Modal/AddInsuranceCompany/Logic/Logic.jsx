import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useState } from "react";
import { addInsuranceMaster } from "../Service/Methods";

function AddInsuranceCompanyLogics() {
  const setAlertMessage = AlertMessage();
  const [btnloaderActive, setBtnLoaderActive] = useState(false);
  const [formValues, setFormValues] = useState({
    txtInsuranceCompanyName: "",
    txtInsuranceCompanyCode: "",
  });

  const [formValidationError, setFormValidationError] = useState({});
  const validateField = (name, value) => {
    let errorsMsg = "";

    if (name === "txtInsuranceCompanyName") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Insurance Company is required!";
      }
    }
    if (name === "txtInsuranceCompanyCode") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Insurance Company Code is required!";
      }
    }
    return errorsMsg;
  };

  const handleValidation = () => {
    try {
      const errors = {};
      let formIsValid = true;
      errors["txtInsuranceCompanyName"] = validateField("txtInsuranceCompanyName", formValues.txtInsuranceCompanyName);
      errors["txtInsuranceCompanyCode"] = validateField("txtInsuranceCompanyCode", formValues.txtInsuranceCompanyCode);
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

  const updateState = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
    formValidationError[name] = validateField(name, value);
  };

  const clearForm = () => {
    setFormValues({
      txtInsuranceCompanyName: "",
      txtInsuranceCompanyCode: "",
    });
  };

  const handleSave = async (e, updateInsuranceCompanyData) => {
    debugger;
    if (e) e.preventDefault();
    if (!handleValidation()) {
      return;
    }

    try {
      let formData = {};
      formData = {
        insuranceMasterName: formValues.txtInsuranceCompanyName ? formValues.txtInsuranceCompanyName : "",
        insuranceShortCode: formValues.txtInsuranceCompanyCode ? formValues.txtInsuranceCompanyCode : "",
      };
      setBtnLoaderActive(true);
      const result = await addInsuranceMaster(formData);
      setBtnLoaderActive(false);
      if (result.response.responseCode === 1) {
        if (result.response && result.response.responseData) {
          const newlyAddedInsuranceCompany = [
            {
              InsuranceMasterID: result.response.responseData.InsuranceMasterID,
              InsuranceMasterName: formValues.txtInsuranceCompanyName ? formValues.txtInsuranceCompanyName : "",
              InsuranceShortCode: formValues.txtInsuranceCompanyCode ? formValues.txtInsuranceCompanyCode : "",
              IsNewlyAdded: true,
            },
          ];
          updateInsuranceCompanyData(newlyAddedInsuranceCompany);
          setAlertMessage({
            type: "success",
            message: result.response.responseMessage,
          });
          clearForm();
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  return {
    formValues,
    setFormValues,
    updateState,
    btnloaderActive,
    handleSave,
    formValidationError,
  };
}

export default AddInsuranceCompanyLogics;
