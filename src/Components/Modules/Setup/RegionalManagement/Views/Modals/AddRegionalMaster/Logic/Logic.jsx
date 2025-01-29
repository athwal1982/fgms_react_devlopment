import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useState } from "react";
// Anil import { GetMasterDataBinding, addUserRegionalOfficeMaster } from "../Service/Methods";
import { addUserRegionalOfficeMaster } from "../Service/Methods";

function AddRegionalMasterOfficeLogics() {
  const setAlertMessage = AlertMessage();
  const [btnloaderActive, setBtnLoaderActive] = useState(false);
  const [formValues, setFormValues] = useState({
    txtRegionOfficeName: "",
    txtbankInsuranceMasterType: null,
    txtBankMasterType: null,
    txtInsuranceMasterType: null,
  });
  // Anil const [BankMasterID, setBankMasterID] = useState([]);
  // Anil const [isLoadingBankType, setIsLoadingBnakType] = useState(false);
  // Anil const [InsuranceMasterID, setInsuranceMasterID] = useState([]);
  // Anil const [isLoadingInsuranceType, setIsLoadingInsuranceType] = useState(false);
  const [formValidationError, setFormValidationError] = useState({});
  // Anil const [bankMasterDisabled, setbankMasterDisabled] = useState(true);
  // Anil const [insuranceMasterDisabled, setinsuranceMasterDisabled] = useState(true);

  // Anil const getBankTypeID = async () => {
  // Anil  try {
  // Anil    setIsLoadingBnakType(true);
  // Anil    const result = await GetMasterDataBinding({ filterID: 124004, filterID1: 0, masterName: "CMPLST", searchText: "#ALL", searchCriteria: "AW" });
  // Anil    console.log(result);
  // Anil    setIsLoadingBnakType(false);
  // Anil    setBankMasterID(result.response);
  // Anil  } catch (error) {
  // Anil    console.log(error);
  // Anil    setAlertMessage({
  // Anil      type: "error",
  // Anil      message: error,
  // Anil    });
  // Anil  }
  // Anil };

  // Anil const getInsuranceTypeID = async () => {
  // Anil  try {
  // Anil    setIsLoadingInsuranceType(true);
  // Anil    const result = await GetMasterDataBinding({ filterID: 124003, filterID1: 0, masterName: "CMPLST", searchText: "#ALL", searchCriteria: "" });
  // Anil    console.log(result);
  // Anil    setIsLoadingInsuranceType(false);
  // Anil    setInsuranceMasterID(result.response);
  // Anil  } catch (error) {
  // Anil    console.log(error);
  // Anil    setAlertMessage({
  // Anil      type: "error",
  // Anil      message: error,
  // Anil    });
  // Anil  }
  // Anil};

  const validateField = (name, value) => {
    let errorsMsg = "";

    if (name === "txtRegionOfficeName") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Cannot be empty";
      }
    }
    // Anil if (name === "txtbankInsuranceMasterType") {
    // Anil  if (!value || typeof value === "undefined") {
    // Anil    errorsMsg = "Cannot be empty";
    // Anil  }
    // Anil }

    // Anil if (name === "txtBankMasterType") {
    // Anil  const BankName = formValues.txtbankInsuranceMasterType && formValues.txtbankInsuranceMasterType.Name ? formValues.txtbankInsuranceMasterType.Name : "";
    // Anil  if (!value || typeof value === "undefined") {
    // Anil    if (BankName === "Bank") {
    // Anil      errorsMsg = "Cannot be empty";
    // Anil    }
    // Anil  }
    // Anil }

    // Anil if (name === "txtInsuranceMasterType") {
    // Anil  const InsuranceName =
    // Anil    formValues.txtbankInsuranceMasterType && formValues.txtbankInsuranceMasterType.Name ? formValues.txtbankInsuranceMasterType.Name : "";
    // Anil  if (!value || typeof value === "undefined") {
    // Anil    if (InsuranceName === "Insurance Company") {
    // Anil      errorsMsg = "Cannot be empty";
    // Anil    }
    // Anil  }
    // Anil  }

    return errorsMsg;
  };

  const handleValidation = () => {
    try {
      const errors = {};
      let formIsValid = true;
      errors["txtRegionOfficeName"] = validateField("txtRegionOfficeName", formValues.txtRegionOfficeName);
      // Anil errors["txtbankInsuranceMasterType"] = validateField("txtbankInsuranceMasterType", formValues.txtbankInsuranceMasterType);
      // Anil errors["txtBankMasterType"] = validateField("txtBankMasterType", formValues.txtBankMasterType);
      // Anil errors["txtInsuranceMasterType"] = validateField("txtInsuranceMasterType", formValues.txtInsuranceMasterType);

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
    // Anil setBankMasterID([]);
    // Anil setInsuranceMasterID([]);
    // Anil console.log(name, value);
    // Anil if (value && value.Value === 1) {
    // Anil  getBankTypeID();
    // Anil  setbankMasterDisabled(false);
    // Anil  setinsuranceMasterDisabled(true);
    // Anil }
    // Anil if (value && value.Value === 2) {
    // Anil  getInsuranceTypeID();
    // Anil  setinsuranceMasterDisabled(false);
    // Anil  setbankMasterDisabled(true);
    // Anil }
  };

  const clearForm = () => {
    setFormValues({
      // Anil txtBankMasterType: null,
      // Anil txtInsuranceMasterType: null,
      txtRegionOfficeName: "",
    });
    // Anil setbankMasterDisabled(true);
    // Anil setinsuranceMasterDisabled(true);
    // AnilsetBankMasterID([]);
    // Anil setInsuranceMasterID([]);
  };

  const handleSave = async (e, updateUserData) => {
    debugger;
    if (e) e.preventDefault();
    if (!handleValidation()) {
      return;
    }

    try {
      let formData = {};
      formData = {
        regionalOfficeID: 0,
        regionOfficeName: formValues.txtRegionOfficeName ? formValues.txtRegionOfficeName : "",
      };

      // Anil if (formValues.txtbankInsuranceMasterType.Value === 1) {
      // Anil  formData = {
      // Anil    regionalOfficeID: 0,
      // Anil    bankMasterID: formValues.txtBankMasterType && formValues.txtBankMasterType.CompanyID ? formValues.txtBankMasterType.CompanyID : null,
      // Anil    regionOfficeName: formValues.txtRegionOfficeName ? formValues.txtRegionOfficeName : "",
      // Anil     insuranceMasterID: 0,
      // Anil  };
      // Anil }

      // Anil if (formValues.txtbankInsuranceMasterType.Value === 2) {
      // Anil  formData = {
      // Anil    regionalOfficeID: 0,
      // Anil    bankMasterID: 0,
      // Anil    regionOfficeName: formValues.txtRegionOfficeName ? formValues.txtRegionOfficeName : "",
      // Anil    insuranceMasterID:
      // Anil      formValues.txtInsuranceMasterType && formValues.txtInsuranceMasterType.CompanyID ? formValues.txtInsuranceMasterType.CompanyID : null,
      // Anil  };
      //  }

      setBtnLoaderActive(true);
      const result = await addUserRegionalOfficeMaster(formData);
      setBtnLoaderActive(false);
      if (result.response.responseCode === 1) {
        if (result.response && result.response.responseData) {
          const newlyAddedUser = [
            {
              RegionalOfficeID: result.response.responseData.RegionalOfficeID,
              RegionOfficeName: formValues.txtRegionOfficeName ? formValues.txtRegionOfficeName : "",
            },
          ];
          updateUserData(newlyAddedUser);
          // Anil if (formValues.txtbankInsuranceMasterType.Value === 1) {
          // Anil  const newlyAddedUser = [
          // Anil    {
          // Anil      RegionalOfficeID: result.response.responseData.RegionalOfficeID,
          // Anil      BankMasterName: formValues.txtBankMasterType && formValues.txtBankMasterType.CompanyName ? formValues.txtBankMasterType.CompanyName : "",
          // Anil      RegionOfficeName: formValues.txtRegionOfficeName ? formValues.txtRegionOfficeName : "",
          // Anil    },
          // Anil  ];
          // Anil  updateUserData(newlyAddedUser);
          // Anil }
          // Anil if (formValues.txtbankInsuranceMasterType.Value === 2) {
          // Anil  const newlyAddedUser = [
          // Anil    {
          // Anil      RegionalOfficeID: result.response.responseData.RegionalOfficeID,
          // Anil      InsuranceMasterName:
          // Anil        formValues.txtInsuranceMasterType && formValues.txtInsuranceMasterType.CompanyName ? formValues.txtInsuranceMasterType.CompanyName : "",
          // Anil      RegionOfficeName: formValues.txtRegionOfficeName ? formValues.txtRegionOfficeName : "",
          // Anil    },
          // Anil  ];
          // Anil  updateUserData(newlyAddedUser);
          // Anil }
          // Anil }

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
    // Anil BankMasterID,
    // Anil isLoadingBankType,
    // Anil InsuranceMasterID,
    // Anil isLoadingInsuranceType,
    formValidationError,
    // Anil bankMasterDisabled,
    // Anil insuranceMasterDisabled,
  };
}

export default AddRegionalMasterOfficeLogics;
