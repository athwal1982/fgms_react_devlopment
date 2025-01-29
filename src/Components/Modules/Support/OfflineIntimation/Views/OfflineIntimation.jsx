import React, { useState, useEffect } from "react";
import { Form } from "Framework/Components/Layout";
import { Loader, Button } from "Framework/Components/Widgets";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import BizClass from "./OfflineIntimation.module.scss";
import { getSessionStorage, setSessionStorage } from "Components/Common/Login/Auth/auth";
import { dateToSpecificFormat, daysdifference } from "Configration/Utilities/dateformat";
import moment from "moment";

import { generateOfflineSupportTicket } from "../Services/Services";
import { getMasterDataBinding } from "../../../Support/ManageTicket/Services/Methods";
import { getMasterDataBindingDataList, getDistrictByState } from "../../../Support/ManageTicket/Views/Modals/AddTicket/Services/Methods";

function OfflineIntimation() {
  const updateStateForByLocation = (field, value) => {
    setFormValuesForByLocation((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };
  const setAlertMessage = AlertMessage();

  const ticketBindingData = getSessionStorage("ticketDataBindingSsnStrg");
  const [schemeList] = useState([
    { SchemeID: 2, SchemeName: "Weather Based Crop Insurance Scheme(WBCIS)" },
    { SchemeID: 4, SchemeName: "Pradhan Mantri Fasal Bima Yojna(PMFBY)" },
  ]);
  const [seasonForPolicyNumberDropdownDataList] = useState([
    { CropSeasonID: 1, CropSeasonName: "Kharif" },
    { CropSeasonID: 2, CropSeasonName: "Rabi" },
  ]);
  const [selectedOption, setSelectedOption] = useState("4");
  const [selectedOptionCropStage, setSelectedOptionCropStage] = useState("1");
  const [formValidationSupportTicketError, setFormValidationSupportTicketError] = useState({});

  const [stateDropdownDataList, setStateDropdownDataList] = useState([]);
  const [isLoadingStateDropdownDataList, setIsLoadingStateDropdownDataList] = useState(false);
  const getStateListData = async () => {
    try {
      if (getSessionStorage("stateSsnStrg") === null) {
        setIsLoadingStateDropdownDataList(true);
        const formdata = {
          filterID: 0,
          filterID1: 0,
          masterName: "STATEMAS",
          searchText: "#ALL",
          searchCriteria: "AW",
        };
        const result = await getMasterDataBindingDataList(formdata);
        setIsLoadingStateDropdownDataList(false);
        if (result.response.responseCode === 1) {
          if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
            setStateDropdownDataList(result.response.responseData.masterdatabinding);
            setSessionStorage("stateSsnStrg", result.response.responseData.masterdatabinding);
          } else {
            setStateDropdownDataList([]);
            setSessionStorage("stateSsnStrg", []);
          }
        } else {
          setAlertMessage({
            type: "error",
            message: result.response.responseMessage,
          });
        }
      } else {
        setStateDropdownDataList(getSessionStorage("stateSsnStrg"));
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const [formValuesTicketCreation, setFormValuesTicketCreation] = useState({
    txtTicketCategory: null,
    txtTicketCategoryType: null,
    txtCropLossDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
    txtCropLossIntimation: "On-time",
    txtCropLossTime: "",
    txtTicketDescription: "",
    txtLossAt: null,
    txtOtherSubCategory: "",
    txtCropStage: null,
    txtCropHarvestDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
    txtCropName: "",
  });

  const selectedOptionOnClickCropStage = (pselectedOption) => {
    if (pselectedOption === "SCS") {
      setSelectedOptionCropStage("1");
      getCropStageListData(1);
      getLossAtListData(1);
    } else if (pselectedOption === "HS") {
      setSelectedOptionCropStage("2");
      getCropStageListData(2);
      getLossAtListData(2);
    }
    setTicketCategoryTypeList([]);
    setTicketCategoryList([]);
    setFormValuesTicketCreation({
      ...formValuesTicketCreation,
      txtTicketCategoryType: null,
      txtTicketCategory: null,
      txtCropLossDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
      txtCropLossIntimation: "On-time",
      txtCropLossTime: "",
      txtTicketDescription: "",
      txtLossAt: null,
      txtOtherSubCategory: "",
      txtCropStage: null,
      txtCropHarvestDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
      txtCropName: "",
    });
    setStateCropLossIntimation("NA");
  };

  const [ticketCategoryList, setTicketCategoryList] = useState([]);
  const [isLoadingTicketCategoryList, setIsTicketCategoryList] = useState(false);
  const getTicketCategoryListData = async (supportTicketTypeID, data) => {
    console.log(data);
    try {
      if (ticketBindingData) {
        setTicketCategoryList([]);
        setIsTicketCategoryList(true);
        const filterticketBindingData = ticketBindingData.TCKCGZ.filter((data) => {
          return data.SupportTicketTypeID === Number(supportTicketTypeID);
        });
        const sortticketBindingData = filterticketBindingData.sort(dynamicSort(["preference", "TicketCategoryName"]));
        setTicketCategoryList(sortticketBindingData);
        setIsTicketCategoryList(false);
      } else {
        setTicketCategoryList([]);
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };
  const [ticketCategoryTypeList, setTicketCategoryTypeList] = useState([]);
  const [isLoadingTicketCategoryTypeList, setIsTicketCategoryTypeList] = useState(false);
  const getTicketCategoryTypeListData = async (pselectedOption, pCropLossDetailID, pMasterName) => {
    debugger;
    if (ticketBindingData) {
      setIsTicketCategoryTypeList(true);
      if (pMasterName === "TCKTYP") {
        const filterticketBindingData = ticketBindingData.CRPTYP.filter((data) => {
          return data.CategoryHeadID === Number(pselectedOption);
        });
        const sortticketBindingData = filterticketBindingData.sort((a, b) => {
          if (a.SupportTicketTypeName < b.SupportTicketTypeName) return -1;
        });
        setTicketCategoryTypeList(sortticketBindingData);
      } else if (pMasterName === "CRPTYP") {
        const filterticketBindingData = ticketBindingData.CRPTYP.filter((data) => {
          return data.CategoryHeadID === Number(pselectedOption) && data.CropLossDetailID === pCropLossDetailID;
        });
        const sortticketBindingData = filterticketBindingData.sort((a, b) => {
          if (a.SupportTicketTypeName < b.SupportTicketTypeName) return -1;
        });
        setTicketCategoryTypeList(sortticketBindingData);
      }
      setIsTicketCategoryTypeList(false);
    } else {
      setTicketCategoryTypeList([]);
    }
  };

  const [lossAtList, setLossAtList] = useState([]);
  const [isLoadingLossAtList, setIsLoadingLossAtList] = useState(false);
  const getLossAtListData = async (pCropStageID) => {
    try {
      if (ticketBindingData) {
        setIsLoadingLossAtList(true);
        const filterticketBindingData = ticketBindingData.CRPDTL.filter((data) => {
          return data.CropStageID === Number(pCropStageID);
        });
        setLossAtList(filterticketBindingData);
        setIsLoadingLossAtList(false);
      } else {
        setLossAtList([]);
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const [cropStageList, setCropStageList] = useState([]);
  const [isLoadingCropStageList, setIsLoadingCropStageList] = useState(false);
  const getCropStageListData = async (pCropStageID) => {
    try {
      if (ticketBindingData) {
        setIsLoadingCropStageList(true);
        const filterticketBindingData = ticketBindingData.CRPSTG.filter((data) => {
          return data.CropStageID === Number(pCropStageID);
        });
        setCropStageList(filterticketBindingData);
        setIsLoadingCropStageList(false);
      } else {
        setCropStageList([]);
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const validateFieldSupportTicket = (name, value) => {
    let errorsMsg = "";
    const mobileRegex = new RegExp("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$");

    if (name === "txtCallerMobileNumber") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Mobile Number is required!";
      } else if (!mobileRegex.test(value)) {
        errorsMsg = "Mobile Number is not valid!";
      } else if (value.length < 10) {
        errorsMsg = "Enter a valid 10-digit Mobile Number!";
      }
    }

    if (name === "txtFarmerFullName") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Farmer Full Name is required!";
      } else if (value.length > 30) {
        errorsMsg = "Farmer Full Name cannot exceed more than 30 characters!";
      }
    }

    if (name === "txtStateValidateMobile") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "State is required!";
      }
    }

    if (name === "txtDistrictValidateMobile") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "District is required!";
      }
    }

    if (name === "txtSchemeForFarmerInfo") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Scheme is required!";
      }
    }

    if (name === "txtSeasonForLocation") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Season is required!";
      }
    }

    if (name === "txtInsuranceCompany") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Insurance Company is required!";
      }
    }

    if (name === "txtYear") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Year is required!";
      }
    }

    if (name === "txtPolicy") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Policy is required!";
      }
    }

    if (name === "txtApplication") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Application is required!";
      }
    }
    if (name === "txtLossAt") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Loss is required!";
      }
    }
    if (name === "txtTicketCategoryType") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "TicketCategoryType is required!";
      }
    }
    if (name === "txtTicketCategory") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "TicketCategory is required!";
      }
    }
    if (name === "txtOtherSubCategory") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Other Sub Category is required!";
      }
    }
    if (name === "txtCropStage") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "CropStage is required!";
      }
    }
    if (name === "txtCropHarvestDate") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "CropHarvestDate is required!";
      }
    }
    if (name === "txtCropLossDate") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "CropLossDate is required!";
      }
    }
    if (name === "txtCropLossIntimation") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "CropLossIntimation is required!";
      }
    }
    if (name === "txtCropName") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "CropName is required!";
      }
    }
    if (name === "txtTicketDescription") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "TicketDescription is required!";
      }
    }
    return errorsMsg;
  };

  function dynamicSort(properties) {
    return function (a, b) {
      for (let i = 0; i < properties.length; i++) {
        let prop = properties[i];
        if (a[prop] < b[prop]) return -1;
        if (a[prop] > b[prop]) return 1;
      }
      return 0;
    };
  }
  const [stateCropLossIntimation, setStateCropLossIntimation] = useState("YES");
  const [formValidationCounter, setFormValidationCounter] = useState({});

  const updateStateTicketCreation = (name, value) => {
    setFormValuesTicketCreation({ ...formValuesTicketCreation, [name]: value });
    formValidationSupportTicketError[name] = validateFieldSupportTicket(name, value);
    if (name === "txtTicketCategoryType") {
      setFormValuesTicketCreation({
        ...formValuesTicketCreation,
        txtTicketCategoryType: value,
        txtTicketCategory: null,
      });
      setTicketCategoryList([]);
      if (value) {
        getTicketCategoryListData(value.SupportTicketTypeID, value);
      }
    }

    if (name === "txtTicketDescription") {
      formValidationCounter[name] = value ? 500 - value.length : 500;
      setFormValidationCounter({ ...formValidationCounter });
    }

    if (name === "txtLossAt") {
      setFormValuesTicketCreation({
        ...formValuesTicketCreation,
        txtLossAt: value,
        txtTicketCategoryType: null,
        txtTicketCategory: null,
      });
      setTicketCategoryTypeList([]);
      setTicketCategoryList([]);
      if (value) {
        getTicketCategoryTypeListData("4", value.CropLossDetailID, "CRPTYP");
      }
    }
    if (name === "txtCropLossDate") {
      const currentDate = new Date();
      const dateDiffrence = daysdifference(dateToSpecificFormat(currentDate, "YYYY-MM-DD"), dateToSpecificFormat(value, "YYYY-MM-DD"));
      if (dateDiffrence > 3) {
        setFormValuesTicketCreation({
          ...formValuesTicketCreation,
          txtCropLossDate: value,
          txtCropLossIntimation: "Late",
        });
        setStateCropLossIntimation("NO");
      } else {
        setFormValuesTicketCreation({
          ...formValuesTicketCreation,
          txtCropLossDate: value,
          txtCropLossIntimation: "On-time",
        });
        setStateCropLossIntimation("YES");
      }
    }
  };

  const [districtDropdownDataList, setDistrictDropdownDataList] = useState([]);
  const [isLoadingDistrictDropdownDataList, setIsLoadingDistrictDropdownDataList] = useState(false);
  const getDistrictByStateListData = async (pstateAlphaCode) => {
    try {
      setIsLoadingDistrictDropdownDataList(true);
      const formdata = {
        stateAlphaCode: pstateAlphaCode,
      };
      const result = await getDistrictByState(formdata);
      console.log(result, "District Data");
      setIsLoadingDistrictDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          if (Object.keys(result.response.responseData.data).length === 0) {
            setDistrictDropdownDataList([]);
          } else {
            setDistrictDropdownDataList(result.response.responseData.data.hierarchy.level3);
          }
        } else {
          setDistrictDropdownDataList([]);
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

  const handleValidationSupportTicket = () => {
    debugger;
    try {
      const errors = {};
      let formIsValid = true;
      errors["txtFarmerFullName"] = validateFieldSupportTicket("txtFarmerFullName", formValuesMN.txtFarmerFullName);
      errors["txtCallerMobileNumber"] = validateFieldSupportTicket("txtCallerMobileNumber", formValuesMN.txtCallerMobileNumber);

      errors["txtStateValidateMobile"] = validateFieldSupportTicket("txtStateValidateMobile", formValuesMN.txtStateValidateMobile);
      errors["txtDistrictValidateMobile"] = validateFieldSupportTicket("txtDistrictValidateMobile", formValuesMN.txtDistrictValidateMobile);
      errors["txtYear"] = validateFieldSupportTicket("txtYear", formValuesMN.txtYear);
      errors["txtSeasonForLocation"] = validateFieldSupportTicket("txtSeasonForLocation", formValuesMN.txtSeasonForLocation);
      errors["txtSchemeForFarmerInfo"] = validateFieldSupportTicket("txtSchemeForFarmerInfo", formValuesMN.txtSchemeForFarmerInfo);
      errors["txtPolicy"] = validateFieldSupportTicket("txtPolicy", formValuesMN.txtPolicy);
      errors["txtApplication"] = validateFieldSupportTicket("txtApplication", formValuesMN.txtApplication);
      errors["txtInsuranceCompany"] = validateFieldSupportTicket("txtInsuranceCompany", formValuesMN.txtInsuranceCompany);

      errors["txtTicketDescription"] = validateFieldSupportTicket("txtTicketDescription", formValuesTicketCreation.txtTicketDescription);
      errors["txtTicketCategoryType"] = validateFieldSupportTicket("txtTicketCategoryType", formValuesTicketCreation.txtTicketCategoryType);
      errors["txtTicketCategory"] = validateFieldSupportTicket("txtTicketCategory", formValuesTicketCreation.txtTicketCategory);

      errors["txtCropName"] = validateFieldSupportTicket("txtCropName", formValuesTicketCreation.txtCropName);
      errors["txtCropLossIntimation"] = validateFieldSupportTicket("txtCropLossIntimation", formValuesTicketCreation.txtCropLossIntimation);

      errors["txtCropLossDate"] = validateFieldSupportTicket("txtCropLossDate", formValuesTicketCreation.txtCropLossDate);
      errors["txtLossAt"] = validateFieldSupportTicket("txtLossAt", formValuesTicketCreation.txtLossAt);
      errors["txtCropStage"] = validateFieldSupportTicket("txtCropStage", formValuesTicketCreation.txtCropStage);
      if (selectedOptionCropStage === "2") {
        errors["txtCropHarvestDate"] = validateFieldSupportTicket("txtCropHarvestDate", formValuesTicketCreation.txtCropHarvestDate);
      }

      if (
        (formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
          ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 51
          : 0) ||
        (formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
          ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 52
          : 0) ||
        (formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
          ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 53
          : 0) ||
        (formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
          ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 58
          : 0)
      ) {
        errors["txtOtherSubCategory"] = validateFieldSupportTicket("txtOtherSubCategory", formValuesTicketCreation.txtOtherSubCategory);
      }
      if (Object.values(errors).join("").toString()) {
        formIsValid = false;
      }
      console.log("errors", errors);

      setFormValidationSupportTicketError(errors);
      return formIsValid;
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: "Something Went Wrong",
      });
      return false;
    }
  };

  const [formValuesMN, setFormValuesMN] = useState({
    txtCallerMobileNumber: "",
    txtFarmerFullName: "",
    txtStateValidateMobile: null,
    txtDistrictValidateMobile: null,
    txtSchemeForFarmerInfo: null,
    txtSeasonForLocation: null,
    txtInsuranceCompany: null,
    txtYear: null,
    txtPolicy: "",
    txtApplication: "",
  });

  const updateStateMN = (name, value) => {
    debugger;
    setFormValuesMN({ ...formValuesMN, [name]: value });
    formValidationSupportTicketError[name] = validateFieldSupportTicket(name, value);
    if (name === "txtStateValidateMobile") {
      setFormValuesMN({
        ...formValuesMN,
        txtStateValidateMobile: value,
        txtDistrictValidateMobile: null,
      });
      setDistrictDropdownDataList([]);
      if (value) {
        getDistrictByStateListData(value.StateCodeAlpha);
      }
    }
  };

  const [insuranceCompanyList, setInsuranceCompanyList] = useState([]);
  const [isLoadingInsuranceCompanyList, setIsLoadingInsuranceCompanyList] = useState(false);
  const getInsuranceCompanyListData = async () => {
    try {
      setInsuranceCompanyList([]);
      setIsLoadingInsuranceCompanyList(true);
      const formdata = {
        filterID: 124003,
        filterID1: 0,
        masterName: "CMPLST",
        searchText: "#ALL",
        searchCriteria: "",
      };
      const result = await getMasterDataBinding(formdata);
      setIsLoadingInsuranceCompanyList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setInsuranceCompanyList(result.response.responseData.masterdatabinding);
        } else {
          setInsuranceCompanyList([]);
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

  const [yearList, setYearList] = useState([]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearArray = [];
    for (let i = 2024; i <= currentYear; i += 1) {
      yearArray.push({ Name: i.toString(), Value: i.toString() });
    }

    setYearList(yearArray.sort().reverse());
    setSelectedOption("4");
    setSelectedOptionCropStage("1");
    setTicketCategoryTypeList([]);
    setTicketCategoryList([]);
    getLossAtListData(1);
    getCropStageListData(1);
    getStateListData();
    getInsuranceCompanyListData();
  }, []);

  const [isBtndisabled, setisBtndisabled] = useState(0);
  const [btnLoaderSupportTicketActive, setBtnLoaderSupportTicketActive] = useState(false);

  const supportTicketOnClick = async () => {
    debugger;

    if (!handleValidationSupportTicket()) {
      return;
    }

    try {
      const formData = {
        stateMasterID: formValuesMN.txtStateValidateMobile.StateMasterID,
        districtRequestorID: formValuesMN.txtDistrictValidateMobile.level3ID,
        requestorName: formValuesMN.txtFarmerFullName,
        requestorMobileNo: formValuesMN.txtCallerMobileNumber,
        ticketCategoryID: formValuesTicketCreation.txtTicketCategory.TicketCategoryID,
        cropCategoryOthers: formValuesTicketCreation.txtOtherSubCategory,
        cropStageMasterID: formValuesTicketCreation.txtCropStage.CropStageMasterID,
        requestYear: formValuesMN.txtYear.Value,
        requestSeason: formValuesMN.txtSeasonForLocation.CropSeasonID,
        ticketDescription: formValuesTicketCreation.txtTicketDescription,
        lossDate: formValuesTicketCreation.txtCropLossDate,
        lossTime: formValuesTicketCreation.txtCropLossTime,
        postHarvestDate: formValuesTicketCreation.txtCropHarvestDate,
        applicationNo: formValuesMN.txtApplication,
        insuranceCompanyID: formValuesMN.txtInsuranceCompany.CompanyID,
        insurancePolicyNo: formValuesMN.txtPolicy,
        schemeID: formValuesMN.txtSchemeForFarmerInfo.SchemeID,
        onTimeIntimationFlag: stateCropLossIntimation,
        cropName: formValuesTicketCreation.txtCropName,
      };
      setBtnLoaderSupportTicketActive(true);

      const result = await generateOfflineSupportTicket(formData);

      if (result.responseCode === 1) {
        clearFarmerAuthenticationForm();
        setAlertMessage({
          type: "success",
          message: "Offline Intimation ticket saved successfully!",
        });
      } else {
        setAlertMessage({
          type: "error",
          message: result.errorMessage || "Failed to save the ticket.",
        });
      }
    } catch (error) {
      console.error(error);
      setAlertMessage({
        type: "error",
        message: "An error occurred while saving the ticket.",
      });
    } finally {
      setBtnLoaderSupportTicketActive(false);
    }
  };

  const clearFarmerAuthenticationForm = () => {
    setFormValuesMN({
      txtCallerMobileNumber: "",
      txtFarmerFullName: "",
      txtStateValidateMobile: null,
      txtDistrictValidateMobile: null,
      txtSchemeForFarmerInfo: null,
      txtSeasonForLocation: null,
      txtInsuranceCompany: null,
      txtYear: null,
      txtPolicy: "",
      txtApplication: "",
    });

    setFormValuesTicketCreation({
      ...formValuesTicketCreation,
      txtTicketCategory: null,
      txtTicketCategoryType: null,
      txtCropLossDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
      txtCropLossIntimation: "On-Time",
      txtCropLossTime: "",
      txtTicketDescription: "",
      txtLossAt: null,
      txtOtherSubCategory: "",
      txtCropStage: null,
      txtCropHarvestDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
      txtCropName: "",
    });

    setDistrictDropdownDataList([]);
  };

  return (
    <div className={BizClass.Box}>
      <div className={BizClass.Div}>
        <div className={BizClass.InfoDiv}>
          <div className={BizClass.CreationDiv}>
            <div className={BizClass.Title}>
              <h3>Farmer Information</h3>
            </div>
          </div>

          <div className={BizClass.CreationDiv}>
            <div className={BizClass.Content}>
              <Form.Group column={2} controlwidth="20%">
                <Form.InputGroup label="Mobile No." req="true" column={1} errorMsg={formValidationSupportTicketError["txtCallerMobileNumber"]}>
                  <Form.InputControl
                    control="input"
                    name="txtCallerMobileNumber"
                    value={formValuesMN.txtCallerMobileNumber}
                    minLength={10}
                    maxLength={10}
                    onChange={(e) => updateStateMN("txtCallerMobileNumber", e.target.value.replace(/\D/g, ""))}
                  />
                </Form.InputGroup>
                <Form.InputGroup label="Farmer Name" req="true" column={1} errorMsg={formValidationSupportTicketError["txtFarmerFullName"]}>
                  <Form.InputControl
                    control="input"
                    name="txtFarmerFullName"
                    value={formValuesMN.txtFarmerFullName}
                    onChange={(e) => updateStateMN("txtFarmerFullName", e.target.value)}
                  />
                </Form.InputGroup>
              </Form.Group>

              <Form.Group column={3} controlwidth="50%">
                <Form.InputGroup req="true" label="State" errorMsg={formValidationSupportTicketError["txtStateValidateMobile"]}>
                  <Form.InputControl
                    control="select"
                    name="txtStateValidateMobile"
                    value={formValuesMN.txtStateValidateMobile}
                    options={stateDropdownDataList}
                    // A loader={isLoadingStateDropdownDataList ? <Loader /> : null}
                    isLoading={isLoadingStateDropdownDataList}
                    getOptionLabel={(option) => `${option.StateMasterName}`}
                    getOptionValue={(option) => `${option}`}
                    onChange={(e) => updateStateMN("txtStateValidateMobile", e)}
                  />
                </Form.InputGroup>

                <Form.InputGroup label="District" req="true" errorMsg={formValidationSupportTicketError["txtDistrictValidateMobile"]}>
                  <Form.InputControl
                    control="select"
                    name="txtDistrictValidateMobile"
                    value={formValuesMN.txtDistrictValidateMobile}
                    options={districtDropdownDataList}
                    // A loader={isLoadingDistrictDropdownDataList ? <Loader /> : null}
                    isLoading={isLoadingDistrictDropdownDataList}
                    getOptionLabel={(option) => `${option.level3Name}`}
                    getOptionValue={(option) => `${option}`}
                    onChange={(e) => updateStateMN("txtDistrictValidateMobile", e)}
                  />
                </Form.InputGroup>

                <Form.InputGroup label="Year" req="true" errorMsg={formValidationSupportTicketError["txtYear"]}>
                  <Form.InputControl
                    control="select"
                    name="txtYear"
                    options={yearList}
                    value={formValuesMN.txtYear}
                    onChange={(e) => updateStateMN("txtYear", e)}
                    getOptionLabel={(option) => `${option.Name}`}
                    getOptionValue={(option) => `${option}`}
                  />
                </Form.InputGroup>
              </Form.Group>

              <Form.Group column={3} controlwidth="50%">
                <Form.InputGroup label="Season" req="true" errorMsg={formValidationSupportTicketError["txtSeasonForLocation"]}>
                  <Form.InputControl
                    control="select"
                    name="txtSeasonForLocation"
                    value={formValuesMN.txtSeasonForLocation}
                    options={seasonForPolicyNumberDropdownDataList}
                    getOptionLabel={(option) => `${option.CropSeasonName}`}
                    getOptionValue={(option) => `${option}`}
                    onChange={(e) => updateStateMN("txtSeasonForLocation", e)}
                  />
                </Form.InputGroup>

                <Form.InputGroup label="Scheme" req="true" errorMsg={formValidationSupportTicketError["txtSchemeForFarmerInfo"]}>
                  <Form.InputControl
                    control="select"
                    label="Scheme"
                    name="txtSchemeForFarmerInfo"
                    value={formValuesMN.txtSchemeForFarmerInfo}
                    options={schemeList}
                    getOptionLabel={(option) => `${option.SchemeName}`}
                    getOptionValue={(option) => `${option}`}
                    onChange={(e) => updateStateMN("txtSchemeForFarmerInfo", e)}
                  />
                </Form.InputGroup>

                <Form.InputGroup label="Policy No" req="true" errorMsg={formValidationSupportTicketError["txtPolicy"]}>
                  <Form.InputControl
                    control="input"
                    name="txtPolicy"
                    maxLength={20}
                    value={formValuesMN.txtPolicy}
                    onChange={(e) => updateStateMN("txtPolicy", e.target.value)}
                  />
                </Form.InputGroup>
              </Form.Group>
              <Form.Group column={2} controlwidth="50%">
                <Form.InputGroup label="Application No" req="true" errorMsg={formValidationSupportTicketError["txtApplication"]}>
                  <Form.InputControl
                    control="input"
                    name="txtApplication"
                    maxLength={50}
                    value={formValuesMN.txtApplication}
                    onChange={(e) => updateStateMN("txtApplication", e.target.value)}
                  />
                </Form.InputGroup>
                <Form.InputGroup label="Insurance Company" req="true" errorMsg={formValidationSupportTicketError["txtSchemeForFarmerInfo"]}>
                  <Form.InputControl
                    control="select"
                    label=""
                    name="txtInsuranceCompany"
                    loader={isLoadingInsuranceCompanyList ? <Loader /> : null}
                    options={insuranceCompanyList}
                    value={formValuesMN.txtInsuranceCompany}
                    getOptionLabel={(option) => `${option.CompanyName}`}
                    getOptionValue={(option) => `${option}`}
                    onChange={(e) => updateStateMN("txtInsuranceCompany", e)}
                  />
                </Form.InputGroup>
              </Form.Group>
            </div>
            <div className={BizClass.Title}>
              <h3>Ticket Creation</h3>
            </div>
            <div className={BizClass.Content}>
              <Form.Group column="2" controlwidth="360px">
                <Form.InputGroup label="Ticket Type" errorMsg="" column={3}>
                  <ul className={BizClass.ValidateTabGroup}>
                    <button type="button" className={selectedOption === "4" && BizClass.Active}>
                      <div className={BizClass.ValidateTabCheckBox} />
                      <span>Crop Loss Intimation</span>
                    </button>
                  </ul>
                </Form.InputGroup>
                {selectedOption === "4" ? (
                  <Form.InputGroup label="" errorMsg="" column={4}>
                    <ul className={BizClass.ValidateTabGroup}>
                      {(formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
                        ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 51
                        : 0) ||
                      (formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
                        ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 52
                        : 0) ||
                      (formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
                        ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 53
                        : 0) ||
                      (formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
                        ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 58
                        : 0) ? (
                        <button type="button" style={{ border: "none", width: "90px" }} />
                      ) : selectedOptionCropStage === "2" || selectedOptionCropStage === "1" ? (
                        <button type="button" style={{ border: "none", width: "83px" }} />
                      ) : null}

                      <button
                        type="button"
                        className={selectedOptionCropStage === "1" && BizClass.Active}
                        onClick={() => selectedOptionOnClickCropStage("SCS")}
                      >
                        <div className={BizClass.ValidateTabCheckBox} />
                        <span>Standing Crop Stage</span>
                      </button>
                      <button type="button" className={selectedOptionCropStage === "2" && BizClass.Active} onClick={() => selectedOptionOnClickCropStage("HS")}>
                        <div className={BizClass.ValidateTabCheckBox} />
                        <span>Harvested Stage</span>
                      </button>
                    </ul>
                  </Form.InputGroup>
                ) : null}

                {selectedOption === "4" ? (
                  <Form.InputGroup column={3} label="Loss At" req="true" errorMsg={formValidationSupportTicketError["txtLossAt"]}>
                    <Form.InputControl
                      control="select"
                      name="txtLossAt"
                      value={formValuesTicketCreation.txtLossAt}
                      options={lossAtList}
                      // A loader={isLoadingLossAtList ? <Loader /> : null}
                      isLoading={isLoadingLossAtList}
                      getOptionLabel={(option) => `${option.CropStageSelection}`}
                      getOptionValue={(option) => `${option}`}
                      onChange={(e) => updateStateTicketCreation("txtLossAt", e)}
                    />
                  </Form.InputGroup>
                ) : null}
                <Form.InputGroup label="Category" req="true" errorMsg={formValidationSupportTicketError["txtTicketCategoryType"]}>
                  <Form.InputControl
                    control="select"
                    name="txtTicketCategoryType"
                    value={formValuesTicketCreation.txtTicketCategoryType}
                    options={ticketCategoryTypeList}
                    // A loader={isLoadingTicketCategoryTypeList ? <Loader /> : null}
                    isLoading={isLoadingTicketCategoryTypeList}
                    getOptionLabel={(option) => `${option.SupportTicketTypeName}`}
                    getOptionValue={(option) => `${option}`}
                    onChange={(e) => updateStateTicketCreation("txtTicketCategoryType", e)}
                  />
                </Form.InputGroup>
                <Form.InputGroup label="Sub Category" req="true" errorMsg={formValidationSupportTicketError["txtTicketCategory"]}>
                  <Form.InputControl
                    control="select"
                    name="txtTicketCategory"
                    value={formValuesTicketCreation.txtTicketCategory}
                    options={ticketCategoryList}
                    // A loader={isLoadingTicketCategoryList ? <Loader /> : null}
                    isLoading={isLoadingTicketCategoryList}
                    getOptionLabel={(option) => `${option.TicketCategoryName}`}
                    getOptionValue={(option) => `${option}`}
                    onChange={(e) => updateStateTicketCreation("txtTicketCategory", e)}
                  />
                </Form.InputGroup>
                {(formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
                  ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 51
                  : 0) ||
                (formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
                  ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 52
                  : 0) ||
                (formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
                  ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 53
                  : 0) ||
                (formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
                  ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 58
                  : 0) ? (
                  <Form.InputGroup column={3} label="Other Sub Cat." req="true" errorMsg={formValidationSupportTicketError["txtOtherSubCategory"]}>
                    <Form.InputControl
                      control="input"
                      type="text"
                      name="txtOtherSubCategory"
                      value={formValuesTicketCreation.txtOtherSubCategory}
                      onChange={(e) => updateStateTicketCreation(e.target.name, e.target.value)}
                    />
                  </Form.InputGroup>
                ) : null}
                {selectedOption === "4" ? (
                  <Form.InputGroup column={3} label="Crop Stage" req="true" errorMsg={formValidationSupportTicketError["txtCropStage"]}>
                    <Form.InputControl
                      control="select"
                      name="txtCropStage"
                      value={formValuesTicketCreation.txtCropStage}
                      options={cropStageList}
                      // A loader={isLoadingCropStageList ? <Loader /> : null}
                      isLoading={isLoadingCropStageList}
                      getOptionLabel={(option) => `${option.CropStageMaster}`}
                      getOptionValue={(option) => `${option}`}
                      onChange={(e) => updateStateTicketCreation("txtCropStage", e)}
                    />
                  </Form.InputGroup>
                ) : null}
                {selectedOption === "4" ? (
                  <Form.CustomGroup
                    column={4}
                    columntemplate={
                      (formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
                        ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 51
                        : 0) ||
                      (formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
                        ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 52
                        : 0) ||
                      (formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
                        ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 53
                        : 0) ||
                      (formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
                        ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 58
                        : 0)
                        ? "90px 110px 68px 110px 85px auto"
                        : selectedOptionCropStage === "2"
                        ? "75px 110px 60px 110px 85px auto"
                        : selectedOptionCropStage === "1"
                        ? "70px 110px 85px auto"
                        : null
                    }
                  >
                    {selectedOptionCropStage === "2" ? (
                      <Form.InputGroup label="Harvest Date" req="true" errorMsg={formValidationSupportTicketError["txtCropHarvestDate"]}>
                        <Form.InputControl
                          control="input"
                          type="date"
                          name="txtCropHarvestDate"
                          value={formValuesTicketCreation.txtCropHarvestDate}
                          onChange={(e) => updateStateTicketCreation(e.target.name, e.target.value)}
                          max={dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD")}
                          onKeyDown={(e) => e.preventDefault()}
                        />
                        <Form.InputGroup label="">
                          <Form.InputControl
                            control="input"
                            type="text"
                            name="txtCropLossIntimation"
                            value={formValuesTicketCreation.txtCropLossIntimation}
                            onChange={(e) => updateStateTicketCreation(e.target.name, e.target.value)}
                            style={
                              stateCropLossIntimation === "YES" || stateCropLossIntimation === "NA"
                                ? { color: "#3f4254", background: "#ffffff" }
                                : { color: "#ffffff" }
                            }
                            className={
                              stateCropLossIntimation === "YES" || stateCropLossIntimation === "NA"
                                ? BizClass.disabledOnIntimationTextBox
                                : BizClass.disabledLateIntimationTextBox
                            }
                          />
                        </Form.InputGroup>
                      </Form.InputGroup>
                    ) : null}
                    {selectedOptionCropStage === "2" || selectedOptionCropStage === "1" ? (
                      <Form.InputGroup label="Loss Date" req="true" errorMsg={formValidationSupportTicketError["txtCropLossDate"]}>
                        &nbsp;&nbsp;&nbsp;
                        <Form.InputControl
                          control="input"
                          type="date"
                          name="txtCropLossDate"
                          value={formValuesTicketCreation.txtCropLossDate}
                          onChange={(e) => updateStateTicketCreation(e.target.name, e.target.value)}
                          min={dateToSpecificFormat(moment().subtract(1, "months"), "YYYY-MM-DD")}
                          max={dateToSpecificFormat(moment(), "YYYY-MM-DD")}
                          onKeyDown={(e) => e.preventDefault()}
                        />
                      </Form.InputGroup>
                    ) : null}
                    {selectedOptionCropStage === "2" || selectedOptionCropStage === "1" ? (
                      <Form.InputGroup label="">
                        <Form.InputControl
                          control="input"
                          type="text"
                          name="txtCropLossIntimation"
                          value={formValuesTicketCreation.txtCropLossIntimation}
                          onChange={(e) => updateStateTicketCreation(e.target.name, e.target.value)}
                          style={
                            stateCropLossIntimation === "YES" || stateCropLossIntimation === "NA"
                              ? { color: "#3f4254", background: "#ffffff" }
                              : { color: "#ffffff" }
                          }
                          className={
                            stateCropLossIntimation === "YES" || stateCropLossIntimation === "NA"
                              ? BizClass.disabledOnIntimationTextBox
                              : BizClass.disabledLateIntimationTextBox
                          }
                        />
                      </Form.InputGroup>
                    ) : null}
                    <Form.InputGroup label="" req={false} errorMsg={formValidationSupportTicketError["txtCropLossTime"]} style={{ display: "none" }}>
                      <Form.InputControl
                        control="input"
                        type="time"
                        name="txtCropLossTime"
                        value={formValuesTicketCreation.txtCropLossTime}
                        onChange={(e) => updateStateTicketCreation(e.target.name, e.target.value)}
                      />
                    </Form.InputGroup>
                  </Form.CustomGroup>
                ) : null}
                {selectedOption === "4" ? (
                  <Form.InputGroup column={3} req="true" errorMsg={formValidationSupportTicketError["txtCropName"]} label="Crop Name">
                    <Form.InputControl
                      control="input"
                      autoComplete="off"
                      name="txtCropName"
                      value={formValuesTicketCreation.txtCropName}
                      placeholder=""
                      onChange={(e) => updateStateTicketCreation(e.target.name, e.target.value)}
                    />
                  </Form.InputGroup>
                ) : null}
                <Form.InputGroup label="Description" req="true" column={3} row={11} errorMsg={formValidationSupportTicketError["txtTicketDescription"]}>
                  <Form.InputControl
                    control="textarea"
                    row="11"
                    maxLength="500"
                    name="txtTicketDescription"
                    value={formValuesTicketCreation.txtTicketDescription}
                    onChange={(e) => updateStateTicketCreation("txtTicketDescription", e.target.value)}
                  />
                </Form.InputGroup>
              </Form.Group>
            </div>
          </div>
        </div>

        <div className={BizClass.ValidateFormFooterRight}>
          <Button
            className={BizClass.FormFooterButton}
            disabled={isBtndisabled}
            trigger={btnLoaderSupportTicketActive && "true"}
            onClick={() => supportTicketOnClick()}
          >
            Save
          </Button>
          <Button className={BizClass.FormFooterButton} onClick={() => clearFarmerAuthenticationForm()}>
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}

export default OfflineIntimation;
