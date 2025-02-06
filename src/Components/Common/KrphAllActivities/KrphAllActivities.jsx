import { React, useState, useEffect } from "react";
import classNames from "classnames";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { DataGrid, Form, Modal, PageBar } from "Framework/Components/Layout";
import { Loader, Button } from "Framework/Components/Widgets";
import { dateFormatDDMMYY, dateToSpecificFormat, daysdifference, dateToCompanyFormat, Convert24FourHourAndMinute } from "Configration/Utilities/dateformat";
import moment from "moment";
import success from "Framework/Assets/Images/success.png";
import callDisconnected from "Framework/Assets/Images/Call-Disconnected.png";
import { AiOutlineMinusSquare, AiOutlinePlusSquare } from "react-icons/ai";
import { CgFileDocument } from "react-icons/cg";
import { FcViewDetails } from "react-icons/fc";
import BizClass from "./KrphAllActivities.module.scss";
import { getSessionStorage, setSessionStorage, decryptStringData } from "Components/Common/Login/Auth/auth";
import { ticketDataBindingData } from "Components/Common/Welcome/Service/Methods";
import {
  getMasterDataBindingDataList,
  getDistrictByState,
  getLocationMasterDataBindingDataList,
  getBankByDistrictDataList,
  getBranchByBankANDDistrictDataList,
  getLocationHierarchyData,
  getLevel3Data,
  getLevel4Data,
  getLevel5Data,
  getLevel6Data,
  getLevel7Data,
  // A checkFarmerByMobileNumber,
  checkFarmerByAadharNumber,
  checkFarmerByAccountNumber,
  searchPolicy,
  checkFarmerByPolicy,
  getFarmerPolicyDetail,
  // A FarmerTicketSummary,
  getClaimDetailData,
  sendSMSToFarmer,
} from "../../Modules/Support/ManageTicket/Views/Modals/AddTicket/Services/Methods";
import { getCropListDistrictWiseDataList } from "Components/Common/Calculator/Service/Method";
import { getMasterDataBinding } from "../../Modules/Support/ManageTicket/Services/Methods";
import { addKRPHSupportTicketdata,krphFarmerCallingHistorydata,checkKRPHFarmerByMobileNumber,farmerTicketSummaryKRPH,addKRPHFarmerSupportTicketData } from "./Services/Methods";
import { getUserRightData } from "../../Modules/Setup/MenuManagement/Services/Methods";
import PremiumCalculator from "./PremiumCalculator";
import { KrphToggleSwitch } from "./KrphToggleSwitch";
import MyTicketPage from "./MyTicket/index";
function KrphAllActivities() {
  const setAlertMessage = AlertMessage();

  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  const dcryptUID = decryptStringData(params && params.userID ? params.userID : "uID");
  const dcryptUMBLENO = decryptStringData(params && params.mobileNumber ? params.mobileNumber : "uMO");
  const dcryptUNQEID = decryptStringData(params && params.uniqueID ? params.uniqueID : "uNQID");

  const [activeKey, setActiveKey] = useState("TCKT");
  const [activeBtnKey, setActiveBtnKey] = useState("");

  const [objStateData, setobjStateData] = useState();
  const [objDistrictData, setobjDistrictData] = useState();
  const [farmerName, setfarmerName] = useState();
  const [serviceSuccessState, setServiceSuccessState] = useState("UNSUCCESS");
  const [getSupportTicketNo, setgetSupportTicketNo] = useState("");
  const [getCallingMasterID, setgetCallingMasterID] = useState(0);

  const [selectedFarmer, setSelectedFarmer] = useState([]);
  const [fetchfarmersummary, setfetchfarmersummary] = useState("");
  const [farmersTicketSummaryData, setFarmersTicketSummaryData] = useState([]);
  const [stateCropLossIntimation, setStateCropLossIntimation] = useState("NA");
  const [farmerAuthenticateByMobile, setfarmerAuthenticateByMobile] = useState(false);

  const [formValuesGI, setFormValuesGI] = useState({
    txtCallerID: dcryptUNQEID,
    txtMobileCallerNumber: dcryptUMBLENO,
    txtState: null,
    txtDistrict: null,
    txtCallStatus: { ID: 1, Value: "Connected" },
    txtFarmerName: "",
    txtReason: null,
  });
  const [reasonDropdownDataList] = useState([
    { ID: 1, Value: "Caller voice not clear" },
    { ID: 2, Value: "Caller did not provide required details" },
    { ID: 3, Value: "Call disconnected" },
  ]);
  const [callConnectedDropdownDataList] = useState([
    { ID: 1, Value: "Connected" },
    { ID: 2, Value: "Disconnected" },
  ]);

  const [formValidationKRPHError, setFormValidationKRPHError] = useState({});
  const validateKRPHInfoField = (name, value) => {
    let errorsMsg = "";

    if (name === "txtCallStatus") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Call Status is required!";
      }
    }

    if (name === "txtReason") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Reason is required!";
      }
    }

    if (name === "txtState") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "State is required!";
      }
    }
    if (name === "txtDistrict") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "District is required!";
      }
    }
    if (name === "txtFarmerName") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Farmer Name is required!";
      }
    }

    return errorsMsg;
  };

  const handleKRPHInfoValidation = () => {
    try {
      const errors = {};
      let formIsValid = true;
      errors["txtCallStatus"] = validateKRPHInfoField("txtCallStatus", formValuesGI.txtCallStatus);
      if (formValuesGI && formValuesGI.txtCallStatus && formValuesGI.txtCallStatus.ID === 2) {
        errors["txtReason"] = validateKRPHInfoField("txtReason", formValuesGI.txtReason);
      }
      if (formValuesGI && formValuesGI.txtCallStatus && formValuesGI.txtCallStatus.ID === 1) {
      errors["txtState"] = validateKRPHInfoField("txtState", formValuesGI.txtState);
      errors["txtDistrict"] = validateKRPHInfoField("txtDistrict", formValuesGI.txtDistrict);
      errors["txtFarmerName"] = validateKRPHInfoField("txtFarmerName", formValuesGI.txtFarmerName);
      }


      if (Object.values(errors).join("").toString()) {
        formIsValid = false;
      }
      setFormValidationKRPHError(errors);
      return formIsValid;
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: "Something Went Wrong",
      });
      return false;
    }
  };
  const updateStateGI = (name, value) => {
    setFormValuesGI({ ...formValuesGI, [name]: value });
    setFormValidationKRPHError[name] = validateKRPHInfoField(name, value);

    if (name === "txtState") {
      setFormValuesGI({
        ...formValuesGI,
        txtState: value,
        txtDistrict: null,
      });
      setDistrictKRPHDropdownDataList([]);
      setobjStateData({});
      if (value) {
        getDistrictByStateKRPHListData(value.StateCodeAlpha);
      }
    }
    if (name === "txtDistrict") {
      setFormValuesGI({
        ...formValuesGI,
        txtDistrict: value,
      });
      setobjDistrictData({});
      if(farmerAuthenticateByMobile === false) {
        SavevalidateFarmerOnClick(value && value.level3ID ? value.level3ID : "");
      }
    }
    if (name === "txtFarmerName") {
      setFormValuesGI({
        ...formValuesGI,
        txtFarmerName: value,
      });
      setfarmerName(value);
    }
  };
  const OnClickTab = (pType) => {
    if (pType === "TCKT") {
      setActiveKey(pType);
      setActiveBtnKey("");
    } else if (pType === "PRMCAL") {
      setActiveKey(pType);
      setActiveBtnKey("");
    }
  };

  const SavevalidateFarmerDisconnectedOnClick = async () => {
    debugger;
    try {
      const formData = {
        CallingMasterID: getCallingMasterID,
        callerMobileNumber: formValuesGI.txtMobileCallerNumber ? formValuesGI.txtMobileCallerNumber : "",
        user: dcryptUID,
        callingUniqueID: dcryptUNQEID,
        farmerMobileNumber: formValuesGI.txtMobileCallerNumber ? formValuesGI.txtMobileCallerNumber : "",
        farmerName: formValuesGI.txtFarmerName ? formValuesGI.txtFarmerName : "",
        callStatus: formValuesGI.txtCallStatus && formValuesGI.txtCallStatus.Value ? formValuesGI.txtCallStatus.Value : "",
        reason: formValuesGI.txtReason && formValuesGI.txtReason.Value ? formValuesGI.txtReason.Value : "",
        stateCodeAlpha:
          formValuesGI.txtState && formValuesGI.txtState.StateCodeAlpha ? formValuesGI.txtState.StateCodeAlpha : "",
        districtCodeAlpha:
          formValuesGI.txtDistrict && formValuesGI.txtDistrict.level3ID ? formValuesGI.txtDistrict.level3ID : "",
        // A isRegistered: farmerAuthenticateByMobile === true ? "R" : farmerAuthenticateByMobile === false ? "U" : "" ,
        isRegistered: valisRegistered,
      };
      const result = await krphFarmerCallingHistorydata(formData);
      if (result.response.responseCode === 1) {
        setSessionStorage("servicesuccess", "CD");
        setServiceSuccessState("SUCCESS");
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
        return false;
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
      return false;
    }
  };

  const OnClickBtnAction = (pType) => {
    debugger;
    if (!handleKRPHInfoValidation()) {
      return;
    }
    
    if (pType === "BTNNXT") {
      setActiveBtnKey(pType);
       if(farmerAuthenticateByMobile === false) {
        SavevalidateFarmerOnClick(formValuesGI.txtDistrict && formValuesGI.txtDistrict.level3ID ? formValuesGI.txtDistrict.level3ID : "");
       }
    } else if (pType === "BTNSBMT") {
      setActiveBtnKey(pType);
      SavevalidateFarmerDisconnectedOnClick();

    }
  };

  const OnClickBtnReset = () => {
    setActiveKey("TCKT");
    setActiveBtnKey("");
  };

  const [toggleChange, setToggleChange] = useState(false);
  const onToggleChange = () => {
    setToggleChange(!toggleChange);
    if (!toggleChange) OnClickTab("PRMCAL");
    else OnClickTab("TCKT");
  };

  const [stateKRPHDropdownDataList, setStateKRPHDropdownDataList] = useState([]);
  const [isLoadingStateDKRPHropdownDataList, setIsLoadingStateKRPHDropdownDataList] = useState(false);
  const getStateKRPHListData = async () => {
    debugger;
    try {
      setIsLoadingStateKRPHDropdownDataList(true);
      const formdata = {
        filterID: 0,
        filterID1: 0,
        masterName: "STATEMAS",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBindingDataList(formdata);
      setIsLoadingStateKRPHDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setStateKRPHDropdownDataList(result.response.responseData.masterdatabinding);
        } else {
          setStateKRPHDropdownDataList([]);
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

  const [districtKRPHDropdownDataList, setDistrictKRPHDropdownDataList] = useState([]);
  const [isLoadingDistrictKRPHDropdownDataList, setIsLoadingDistrictKRPHDropdownDataList] = useState(false);
  const getDistrictByStateKRPHListData = async (pstateAlphaCode) => {
    try {
      setIsLoadingDistrictKRPHDropdownDataList(true);
      const formdata = {
        stateAlphaCode: pstateAlphaCode,
      };
      const result = await getDistrictByState(formdata);
      setIsLoadingDistrictKRPHDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          if (Object.keys(result.response.responseData.data).length === 0) {
            setDistrictKRPHDropdownDataList([]);
          } else {
            setDistrictKRPHDropdownDataList(result.response.responseData.data.hierarchy.level3);
          }
        } else {
          setDistrictKRPHDropdownDataList([]);
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

  const getticketDataBindingKrphAllActivitiesData = async () => {
    debugger;
    try {
      if (getSessionStorage("ticketDataBindingKrphAllActivitiesSsnStrg") === null) {
        const result = await ticketDataBindingData({});
        if (result.response.responseCode === 1) {
          if (result.response.responseData) {
            console.log(result.response.responseData);
            setSessionStorage("ticketDataBindingKrphAllActivitiesSsnStrg", result.response.responseData);
          } else {
            setSessionStorage("ticketDataBindingKrphAllActivitiesSsnStrg", null);
          }
        } else {
          setAlertMessage({
            type: "error",
            message: result.response.responseMessage,
          });
        }
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const [valisRegistered, setvalisRegistered] = useState("U");
  const validateFarmerByMobileNumberKRPH = async () => {
    debugger;
    try {
      let result = "";
      let formData = "";
      formData = {
        mobilenumber: dcryptUMBLENO ,
      };
      result = await checkKRPHFarmerByMobileNumber(formData);
      setSelectedFarmer([]);
      setfetchfarmersummary("");
      setFarmersTicketSummaryData([]);
      setStateCropLossIntimation("NA");
      if (result.response.responseCode === 1) {
        const parseFarmerData = result.response.responseData;
        if (parseFarmerData.data.output === 1) {
          setSelectedFarmer(parseFarmerData.data.result);
          setfetchfarmersummary(parseFarmerData.data.result.farmerID);
          setfarmerAuthenticateByMobile(true);
          setAlertMessage({
            type: "success",
            message: "Farmer is authenticated.",
          });
          setFormValuesGI({
            ...formValuesGI,
            txtCallerID: dcryptUNQEID,
            txtMobileCallerNumber: dcryptUMBLENO,
            txtState: parseFarmerData.data.result && parseFarmerData.data.result.stateID && parseFarmerData.data.result.state ? {StateCodeAlpha : parseFarmerData.data.result.stateID, StateMasterName: parseFarmerData.data.result.state } : null,
            txtDistrict: parseFarmerData.data.result && parseFarmerData.data.result.districtID && parseFarmerData.data.result.district ? {level3ID : parseFarmerData.data.result.districtID, level3Name: parseFarmerData.data.result.district } : null,
            txtCallStatus: { ID: 1, Value: "Connected" },
            txtFarmerName: parseFarmerData.data.result ? parseFarmerData.data.result.farmerName : "",
            txtReason: null,
          });
          setvalisRegistered("R");
          SavevalidateFarmerRegisteredFarmerOnClick(parseFarmerData.data.result ? parseFarmerData.data.result.farmerName : "", parseFarmerData.data.result && parseFarmerData.data.result.stateID  ? parseFarmerData.data.result.stateID : "", parseFarmerData.data.result && parseFarmerData.data.result.districtID ? parseFarmerData.data.result.districtID : "");
        }
      } else {
        setAlertMessage({
          type: "warning",
          message: result.response.responseMessage,
        });
        setfetchfarmersummary("");
        setfarmerAuthenticateByMobile(false);
        setFormValuesGI({
          ...formValuesGI,
          txtCallerID: dcryptUNQEID,
          txtMobileCallerNumber: dcryptUMBLENO,
          txtState: null,
          txtDistrict: null,
          txtCallStatus: { ID: 1, Value: "Connected" },
          txtFarmerName: "",
          txtReason: null,
        });
        if (result.response.responseCode === 2) {
          setvalisRegistered("D");
        } else {
          setvalisRegistered("U");
        }
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const validateFarmerByMobileNumberCreateTicket = async () => {
    try {
      let result = "";
      let formData = "";
      formData = {
        mobilenumber: formValuesMN && formValuesMN.txtMobileNumber ? formValuesMN.txtMobileNumber : "" ,
      };
      setBtnLoaderActive(true);
      result = await checkKRPHFarmerByMobileNumber(formData);
      setBtnLoaderActive(false);
      setSelectedFarmer([]);
      setfetchfarmersummary("");
      setFarmersTicketSummaryData([]);
      setStateCropLossIntimation("NA");
      if (result.response.responseCode === 1) {
        const parseFarmerData = result.response.responseData;
        if (parseFarmerData.data.output === 1) {
          setSelectedFarmer(parseFarmerData.data.result);
          setfetchfarmersummary(parseFarmerData.data.result.farmerID);
        }
      } else {
        setAlertMessage({
          type: "warning",
          message: result.response.responseMessage,
        });
        setfetchfarmersummary("");
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  // Create Ticket module //
  const [selectedOption, setSelectedOption] = useState("1");
  const [selectedOptionCropStage, setSelectedOptionCropStage] = useState("1");
  const [selectedValidateOption, setSelectedValidateOption] = useState("1");
  const [selectedClaimOrGrievence, setSelectedClaimOrGrievence] = useState("");
  const [claimOrGrievenceDisabled, setClaimOrGrievenceDisabled] = useState(true);
  const [btnEnableSaveOnValidateMN, setBtnEnableSaveOnValidateMN] = useState(false);

  const ticketBindingData = getSessionStorage("ticketDataBindingKrphAllActivitiesSsnStrg");
  const [schemeList] = useState([
    { SchemeID: 2, SchemeName: "Weather Based Crop Insurance Scheme(WBCIS)" },
    { SchemeID: 4, SchemeName: "Pradhan Mantri Fasal Bima Yojna(PMFBY)" },
  ]);

  const [seasonForPolicyNumberDropdownDataList] = useState([
    { CropSeasonID: 1, CropSeasonName: "Kharif" },
    { CropSeasonID: 2, CropSeasonName: "Rabi" },
  ]);
  const [stateForPolicyNumberDropdownDataList, setStateForPolicyNumberDropdownDataList] = useState([]);
  const [yearList, setYearList] = useState([]);
  const [seasonPolicyNumber, setSeasonPolicyNumber] = useState("");
  const [statePolicyNumber, setStatePolicyNumber] = useState("");
  const [yearPolicyNumber, setYearPolicyNumber] = useState("");
  const [filterSeasonListPolicyNumber, setfilterSeasonListPolicyNumber] = useState([]);
  const [filterYearListPolicyNumber, setfilterYearListPolicyNumber] = useState([]);
  // A const [selectedFarmer, setSelectedFarmer] = useState([]);

  const [formValuesMN, setFormValuesMN] = useState({
    txtMobileNumber: dcryptUMBLENO,
  });
  const [formValuesAN, setFormValuesAN] = useState({
    txtAadharNumber: "",
  });

  const [formValuesForPolicyNumber, setFormValuesForPolicyNumber] = useState({
    txtStateForPolicyNumber: null,
    txtDistrictForPolicyNumber: null,
    txtSubDistrictForPolicyNumber: null,
    txtVillageForPolicyNumber: null,
    txtSeasonForPolicyNumber: null,
    txtYearForPolicyNumber: null,
    txtPolicyNumber: "",
    txtSchemeForPolicyNumber: "",
    txtSeasonForPolicyNumber: "",
    txtStateAndYearForPolicyNumber: "",
  });

  const updateStateForPolicyNumber = (name, value) => {
    setFormValuesForPolicyNumber({ ...formValuesForPolicyNumber, [name]: value });
    formValidationFarmersError[name] = validateFarmersField(name, value);
    if (name === "txtPolicyNumber") {
      let yearandstate = "";
      const input = document.getElementById("inputPolicyNumber");
      const chkCharacterPostion = input.selectionStart;

      if (chkCharacterPostion === 2) {
        const pSchemeID = Number(value.substring(0, 2));
        const filterSchemeData = schemeList.filter((data) => {
          return data.SchemeID.toString() === pSchemeID.toString();
        });

        if (filterSchemeData.length > 0) {
          setFormValuesForPolicyNumber({
            ...formValuesForPolicyNumber,
            txtPolicyNumber: value,
            txtSchemeForPolicyNumber: filterSchemeData[0].SchemeName,
          });
        } else {
          setFormValuesForPolicyNumber({
            ...formValuesForPolicyNumber,
            txtPolicyNumber: value,
            txtSchemeForPolicyNumber: "",
          });
        }
      }
      if (chkCharacterPostion === 4) {
        const pSeaesonID = Number(value.substring(2, 4));
        const filterSeasonData = seasonForPolicyNumberDropdownDataList.filter((data) => {
          return data.CropSeasonID.toString() === pSeaesonID.toString();
        });
        if (filterSeasonData.length > 0) {
          setSeasonPolicyNumber(filterSeasonData[0].CropSeasonID);
          setfilterSeasonListPolicyNumber(filterSeasonData);
          setFormValuesForPolicyNumber({
            ...formValuesForPolicyNumber,
            txtPolicyNumber: value,
            txtSeasonForPolicyNumber: filterSeasonData[0].CropSeasonName,
          });
        } else {
          setSeasonPolicyNumber([]);
          setfilterSeasonListPolicyNumber([]);
          setFormValuesForPolicyNumber({
            ...formValuesForPolicyNumber,
            txtPolicyNumber: value,
            txtSeasonForPolicyNumber: "",
          });
        }
      }
      if (chkCharacterPostion === 6) {
        const pStateID = Number(value.substring(4, 6));
        const filterStateData = stateForPolicyNumberDropdownDataList.filter((data) => {
          return data.StateMasterID === pStateID;
        });

        if (filterStateData.length > 0) {
          setStatePolicyNumber(filterStateData[0].StateMasterName);
          setFormValuesForPolicyNumber({
            ...formValuesForPolicyNumber,
            txtPolicyNumber: value,
            txtStateAndYearForPolicyNumber: filterStateData[0].StateMasterName,
          });
        } else {
          setStatePolicyNumber([]);
          setFormValuesForPolicyNumber({
            ...formValuesForPolicyNumber,
            txtPolicyNumber: value,
            txtStateAndYearForPolicyNumber: "",
          });
        }
      }
      if (chkCharacterPostion === 8) {
        const pYearID = `20${value.substring(6, 8)}`;
        const filterYearData = yearList.filter((data) => {
          return data.Value.toString() === pYearID;
        });

        if (filterYearData.length > 0) {
          setYearPolicyNumber(filterYearData[0].Name);
          setfilterYearListPolicyNumber(filterYearData);
          yearandstate = `${statePolicyNumber}-${filterYearData[0].Name}`;
          setFormValuesForPolicyNumber({
            ...formValuesForPolicyNumber,
            txtPolicyNumber: value,
            txtStateAndYearForPolicyNumber: yearandstate,
          });
        } else {
          setYearPolicyNumber([]);
          setfilterYearListPolicyNumber([]);
          yearandstate = `${statePolicyNumber}-`;
          setFormValuesForPolicyNumber({
            ...formValuesForPolicyNumber,
            txtPolicyNumber: value,
            txtStateAndYearForPolicyNumber: yearandstate,
          });
        }
      }
    }
  };

  const updateStateAN = (name, value) => {
    setFormValuesAN({ ...formValuesAN, [name]: value });
  };

  const updateStateMN = (name, value) => {
    setFormValuesMN({ ...formValuesMN, [name]: value });
  };

  const updateState = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
    formValidationFarmersError[name] = validateFarmersField(name, value);
    if (name === "txtState") {
      setFormValues({
        ...formValues,
        txtState: value,
        txtDistrict: null,
        txtBankName: null,
        txtBranchName: null,
      });
      setDistrictDropdownDataList([]);
      setBankDropdownDataList([]);
      setBankBranchDropdownDataList([]);
      if (value) {
        getDistrictByStateListData(value.StateCodeAlpha);
      }
    }

    if (name === "txtDistrict") {
      setFormValues({
        ...formValues,
        txtDistrict: value,
        txtBankName: null,
        txtBranchName: null,
      });
      setBankDropdownDataList([]);
      setBankBranchDropdownDataList([]);
      if (value) {
        getBankByDistrictListData(value.level3ID);
      }
    }
    if (name === "txtBankName") {
      setFormValues({
        ...formValues,
        txtBankName: value,
        txtBranchName: null,
      });
      setBankBranchDropdownDataList([]);
      if (value) {
        getBranchByBankANDDistrictListData(formValues.txtDistrict.level3ID, value.bankID);
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

  const [bankDropdownDataList, setBankDropdownDataList] = useState([]);
  const [isLoadingBankDropdownDataList, setIsLoadingBankDropdownDataList] = useState(false);
  const getBankByDistrictListData = async (pdistrictAlphaCode) => {
    try {
      setIsLoadingBankDropdownDataList(true);
      const formdata = {
        districtAlphaCode: pdistrictAlphaCode,
      };
      const result = await getBankByDistrictDataList(formdata);
      console.log(result, "Bank Data");
      setIsLoadingBankDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          if (Object.keys(result.response.responseData.data).length === 0) {
            setBankDropdownDataList([]);
          } else {
            setBankDropdownDataList(result.response.responseData.data);
          }
        } else {
          setBankDropdownDataList([]);
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

  const [bankBranchDropdownDataList, setBankBranchDropdownDataList] = useState([]);
  const [isLoadingBankBranchDropdownDataList, setIsLoadingBankBranchDropdownDataList] = useState(false);
  const getBranchByBankANDDistrictListData = async (pdistrictAlphaCode, pbankAlphaCode) => {
    try {
      setIsLoadingBankBranchDropdownDataList(true);
      const formdata = {
        districtAlphaCode: pdistrictAlphaCode,
        bankAlphaCode: pbankAlphaCode,
      };
      const result = await getBranchByBankANDDistrictDataList(formdata);
      console.log(result, "Branch Data");
      setIsLoadingBankBranchDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          if (Object.keys(result.response.responseData.data).length === 0) {
            setBankBranchDropdownDataList([]);
          } else {
            setBankBranchDropdownDataList(result.response.responseData.data);
          }
        } else {
          setBankBranchDropdownDataList([]);
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

  const [stateDropdownDataList, setStateDropdownDataList] = useState([]);
  const [isLoadingStateDropdownDataList, setIsLoadingStateDropdownDataList] = useState(false);
  const getStateListData = async () => {
    debugger;
    try {
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
          setStateForPolicyNumberDropdownDataList(result.response.responseData.masterdatabinding);
        } else {
          setStateDropdownDataList([]);
          setStateForPolicyNumberDropdownDataList([]);
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

  const [insuranceCompanyList, setInsuranceCompanyList] = useState([]);
  const [isLoadingInsuranceCompanyList, setIsLoadingInsuranceCompanyList] = useState(false);
  const getInsuranceCompanyListData = async () => {
    try {
      setInsuranceCompanyList([]);
      setIsLoadingInsuranceCompanyList(true);
      const userData = getSessionStorage("user");
      const formdata = {
        filterID: userData && userData.LoginID ? userData.LoginID : 0,
        filterID1: 0,
        masterName: "INSURASIGN",
        searchText: "#ALL",
        searchCriteria: "",
      };
      const result = await getMasterDataBinding(formdata);
      console.log(result, "Insurance Comapny");
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

  const [stateForByLocationDropdownDataList, setStateForByLocationDropdownDataList] = useState([]);
  const [isLoadingStateForByLocationDropdownDataList, setIsLoadingStateForByLocationDropdownDataList] = useState(false);
  const getStateForByLocationListData = async () => {
    try {
      setIsLoadingStateForByLocationDropdownDataList(true);
      const user = getSessionStorage("user");
      const formdata = {
        level: 1,
        filterID: "0",
        userID: user && user.LoginID ? user.LoginID : 0,
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getLocationMasterDataBindingDataList(formdata);
      console.log(result, "State Data");
      setIsLoadingStateForByLocationDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (
          result.response.responseData &&
          result.response.responseData.locationmasterdatabinding &&
          result.response.responseData.locationmasterdatabinding.length > 0
        ) {
          setStateForByLocationDropdownDataList(result.response.responseData.locationmasterdatabinding);
        } else {
          setStateForByLocationDropdownDataList([]);
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

  const [districtForByLocationDropdownDataList, setDistrictForByLocationDropdownDataList] = useState([]);
  const [isLoadingDistrictForByLocationDropdownDataList, setIsLoadingDistrictForByLocationDropdownDataList] = useState(false);
  const getDistrictByStateForByLocationListData = async (pstateAlphaCode) => {
    try {
      setIsLoadingDistrictForByLocationDropdownDataList(true);
      const formdata = {
        level2: pstateAlphaCode,
      };

      const result = await getLevel3Data(formdata);
      console.log(result, "District Data");
      setIsLoadingDistrictForByLocationDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (Object.keys(result.response.responseData.data).length === 0) {
          setDistrictForByLocationDropdownDataList([]);
        } else {
          setDistrictForByLocationDropdownDataList(result.response.responseData.data.hierarchy.level3);
        }
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };
  const [subDistrictForByLocationDropdownDataList, setSubDistrictForByLocationDropdownDataList] = useState([]);
  const [isLoadingSubDistrictForByLocationDropdownDataList, setIsLoadingSubDistrictForByLocationDropdownDataList] = useState(false);
  const getSubDistrictByStateANDDistrictListData = async (plevel3ID) => {
    try {
      setIsLoadingSubDistrictForByLocationDropdownDataList(true);
      const formdata = {
        level3: plevel3ID,
      };
      const result = await getLevel4Data(formdata);
      console.log(result, "SubDistrict Data");

      setIsLoadingSubDistrictForByLocationDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          if (Object.keys(result.response.responseData.data).length === 0) {
            setSubDistrictForByLocationDropdownDataList([]);
          } else {
            setSubDistrictForByLocationDropdownDataList(result.response.responseData.data.hierarchy.level4);
          }
        } else {
          setSubDistrictForByLocationDropdownDataList([]);
        }
      } else {
        setSubDistrictForByLocationDropdownDataList([]);
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

  const getLocationHierarchyListData = async (pStateAlphaCode, pStateMasterID, pSeason, pYear, pScheme) => {
    try {
      const pschemeID =
        pScheme === ""
          ? formValuesForByLocation.txtSchemeForLocation.SchemeID === 2
            ? "02"
            : formValuesForByLocation.txtSchemeForLocation.SchemeID === 4
            ? "04"
            : ""
          : pScheme;
      const pseasonID =
        pSeason === ""
          ? formValuesForByLocation.txtSeasonForLocation.CropSeasonID === 1
            ? "01"
            : formValuesForByLocation.txtSeasonForLocation.CropSeasonID === 2
            ? "02"
            : ""
          : pSeason;
      const pstateID = pStateMasterID.toString().length < 2 ? `0${pStateMasterID}` : pStateMasterID;
      const pyearID =
        pYear === "" ? formValuesForByLocation.txtYearForLocation.Value.toString().substr(formValuesForByLocation.txtYearForLocation.Value.length - 2) : pYear;
      const psssyID = `${pschemeID}${pseasonID}${pstateID}${pyearID}`;

      const formdata = {
        sssyID: psssyID,
      };
      const result = await getLocationHierarchyData(formdata);

      if (result.response.responseCode === 1) {
        if (Object.keys(result.response.responseData.data).length === 0) {
          setlableTalukAnything("SubDistrict");
          setlablelevel5("NyayPanchayat");
          setlablelevel6("GramPanchayat");
          setlableVillageForByLocation("Village");
        } else {
          setlableTalukAnything(result.response.responseData.data[0].level4 ? result.response.responseData.data[0].level4 : null);
          setlablelevel5(result.response.responseData.data[0].level5 ? result.response.responseData.data[0].level5 : null);
          setlablelevel6(result.response.responseData.data[0].level6 ? result.response.responseData.data[0].level6 : null);
          setlableVillageForByLocation("Village");
          getDistrictByStateForByLocationListData(pStateAlphaCode);
        }
      } else {
        setlableTalukAnything("SubDistrict");
        setlablelevel5("NyayPanchayat");
        setlablelevel6("GramPanchayat");
        setlableVillageForByLocation("Village");
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

  const [level5ByLocationDropdownDataList, setlevel5ByLocationDropdownDataList] = useState([]);
  const [isLoadinglevel5ByLocationDropdownDataList, setIsLoadinglevel5ByLocationDropdownDataList] = useState(false);
  const getlevel5ListData = async (psubDistrictAlphaCode, pdistrictAlphaCode) => {
    try {
      setIsLoadinglevel5ByLocationDropdownDataList(true);
      const formdata = {
        districtAlphaCode: pdistrictAlphaCode,
        subDistrictAlphaCode: psubDistrictAlphaCode,
      };
      const result = await getLevel5Data(formdata);
      setIsLoadinglevel5ByLocationDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (Object.keys(result.response.responseData.data).length === 0) {
          setlevel5ByLocationDropdownDataList([]);
        } else {
          setlevel5ByLocationDropdownDataList(result.response.responseData.data.hierarchy.level5);
        }
      } else {
        setlevel5ByLocationDropdownDataList([]);
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

  const [level6ByLocationDropdownDataList, setlevel6ByLocationDropdownDataList] = useState([]);
  const [isLoadinglevel6ByLocationDropdownDataList, setIsLoadinglevel6ByLocationDropdownDataList] = useState(false);
  const getlevel6ListData = async (plevel3, plevel4, plevel5) => {
    try {
      setIsLoadinglevel6ByLocationDropdownDataList(true);
      const formdata = {
        level3: plevel3,
        level4: plevel4,
        level5: plevel5,
      };
      const result = await getLevel6Data(formdata);
      setIsLoadinglevel6ByLocationDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (Object.keys(result.response.responseData.data).length === 0) {
          setlevel6ByLocationDropdownDataList([]);
        } else {
          setlevel6ByLocationDropdownDataList(result.response.responseData.data.hierarchy.level6);
        }
      } else {
        setlevel6ByLocationDropdownDataList([]);
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

  const [villageForByLocationDropdownDataList, setVillageForByLocationDropdownDataList] = useState([]);
  const [isLoadingVillageForByLocationDropdownDataList, setIsLoadingVillageForByLocationDropdownDataList] = useState(false);
  const getlevel7ListData = async (plevel3, plevel4, plevel5, plevel6) => {
    try {
      setIsLoadingVillageForByLocationDropdownDataList(true);
      const formdata = {
        level3: plevel3,
        level4: plevel4,
        level5: plevel5,
        level6: plevel6,
      };
      const result = await getLevel7Data(formdata);
      setIsLoadingVillageForByLocationDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (Object.keys(result.response.responseData.data).length === 0) {
          setVillageForByLocationDropdownDataList([]);
        } else {
          setVillageForByLocationDropdownDataList(result.response.responseData.data.hierarchy.level7);
        }
      } else {
        setVillageForByLocationDropdownDataList([]);
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

  const validateFarmersField = (name, value) => {
    let errorsMsg = "";
    const regex = new RegExp("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$");

    // A if (selectedValidateOption === "1") {
    // A  if (name === "txtMobileNumber") {
    // A    if (!value || typeof value === "undefined") {
    // A      errorsMsg = "Mobile Number is required!";
    // A    } else if (value) {
    // A      if (!regex.test(value)) {
    // A        errorsMsg = "Mobile Number is not valid!";
    // A      } else if (value.length < 10) {
    // A        errorsMsg = "Enter Valid 10 digit Mobile Number!";
    // A      }
    // A    }
    // A  }
    // A }
    if (selectedValidateOption === "2") {
      if (name === "txtAadharNumber") {
        if (!value || typeof value === "undefined") {
          errorsMsg = "Aadhar Number is required!";
        } else if (value) {
          if (!regex.test(value)) {
            errorsMsg = "Enter numeric value for Aadhar Number !";
          } else if (value.length < 12) {
            errorsMsg = "Enter last 12 digit of Aadhar Number!";
          }
        }
      }
    }
    if (selectedValidateOption === "3") {
      if (name === "txtState") {
        if (!value || typeof value === "undefined") {
          errorsMsg = "State is required!";
        }
      }
      if (name === "txtDistrict") {
        if (!value || typeof value === "undefined") {
          errorsMsg = "District is required!";
        }
      }
      if (name === "txtBankName") {
        if (!value || typeof value === "undefined") {
          errorsMsg = "Bank Name is required!";
        }
      }
      if (name === "txtBranchName") {
        if (!value || typeof value === "undefined") {
          errorsMsg = "Branch Name is required!";
        }
      }
      if (name === "txtAccountNumber") {
        if (!value || typeof value === "undefined") {
          errorsMsg = "Account Number is required!";
        } else if (value) {
          if (!regex.test(value)) {
            errorsMsg = "Enter numeric value for Account Number!";
          }
        }
      }
    }
    if (selectedValidateOption === "4") {
      if (name === "txtPolicyNumber") {
        if (!value || typeof value === "undefined") {
          errorsMsg = "Policy Number is required!";
        } else if (value) {
          if (!regex.test(value)) {
            errorsMsg = "Enter numeric value for Policy Number!";
          }
        }
      }
    }
    if (selectedValidateOption === "5") {
      if (name === "txtStateForByLocation") {
        if (!value || typeof value === "undefined") {
          errorsMsg = "State is required!";
        }
      }
      if (name === "txtDistrictForByLocation") {
        if (!value || typeof value === "undefined") {
          errorsMsg = "District is required!";
        }
      }
      if (name === "txtSubDistrictForByLocation") {
        if (!value || typeof value === "undefined") {
          errorsMsg = `${lableTalukAnything} is required`;
        }
      }
      if (name === "txtlevel5ByLocation") {
        if (!value || typeof value === "undefined") {
          errorsMsg = `${lablelevel5} is required`;
        }
      }
      if (name === "txtlevel6ByLocation") {
        if (!value || typeof value === "undefined") {
          errorsMsg = `${lablelevel6} is required`;
        }
      }
      if (name === "txtVillageForByLocation") {
        if (!value || typeof value === "undefined") {
          errorsMsg = "Village is required!";
        }
      }
      if (name === "txtSeasonForLocation") {
        if (!value || typeof value === "undefined") {
          errorsMsg = "Season is required!";
        }
      }
      if (name === "txtYearForLocation") {
        if (!value || typeof value === "undefined") {
          errorsMsg = "Year is required!";
        }
      }
      if (name === "txtSchemeForLocation") {
        if (!value || typeof value === "undefined") {
          errorsMsg = "Scheme is required!";
        }
      }
    }

    return errorsMsg;
  };

  const handleFarmersValidation = () => {
    try {
      const errors = {};
      let formIsValid = true;

      //  A errors["txtMobileNumber"] = validateFarmersField("txtMobileNumber", formValuesMN.txtMobileNumber);
      errors["txtAadharNumber"] = validateFarmersField("txtAadharNumber", formValuesAN.txtAadharNumber);
      errors["txtAccountNumber"] = validateFarmersField("txtAccountNumber", formValues.txtAccountNumber);
      errors["txtStateValidateMobile"] = validateFarmersField("txtStateValidateMobile", formValuesMN.txtStateValidateMobile);
      errors["txtDistrictValidateMobile"] = validateFarmersField("txtDistrictValidateMobile", formValuesMN.txtDistrictValidateMobile);
      errors["txtFarmerName"] = validateFarmersField("txtFarmerName", formValuesMN.txtFarmerName);
      errors["txtReason"] = validateFarmersField("txtReason", formValuesMN.txtReason);
      errors["txtState"] = validateFarmersField("txtState", formValues.txtState);
      errors["txtDistrict"] = validateFarmersField("txtDistrict", formValues.txtDistrict);
      errors["txtBankName"] = validateFarmersField("txtBankName", formValues.txtBankName);
      errors["txtBranchName"] = validateFarmersField("txtBranchName", formValues.txtBranchName);
      errors["txtStateForByLocation"] = validateFarmersField("txtStateForByLocation", formValuesForByLocation.txtStateForByLocation);
      errors["txtDistrictForByLocation"] = validateFarmersField("txtDistrictForByLocation", formValuesForByLocation.txtDistrictForByLocation);
      errors["txtSubDistrictForByLocation"] = validateFarmersField("txtSubDistrictForByLocation", formValuesForByLocation.txtSubDistrictForByLocation);
      errors["txtlevel5ByLocation"] = validateFarmersField("txtlevel5ByLocation", formValuesForByLocation.txtlevel5ByLocation);
      if (lablelevel6 !== null) {
        errors["txtlevel6ByLocation"] = validateFarmersField("txtlevel6ByLocation", formValuesForByLocation.txtlevel6ByLocation);
      }
      errors["txtVillageForByLocation"] = validateFarmersField("txtVillageForByLocation", formValuesForByLocation.txtVillageForByLocation);
      errors["txtYearForLocation"] = validateFarmersField("txtYearForLocation", formValuesForByLocation.txtYearForLocation);
      errors["txtSeasonForLocation"] = validateFarmersField("txtSeasonForLocation", formValuesForByLocation.txtSeasonForLocation);
      errors["txtPolicyNumber"] = validateFarmersField("txtPolicyNumber", formValuesForPolicyNumber.txtPolicyNumber);
      if (Object.values(errors).join("").toString()) {
        formIsValid = false;
      }
      setFormValidationFarmersError(errors);
      return formIsValid;
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: "Something Went Wrong",
      });
      return false;
    }
  };

  const clearInsuranceFields = () => {};
  const [btnLoaderActive, setBtnLoaderActive] = useState(false);

  const validateFarmerByAadharNumber = async () => {
    if (!handleFarmersValidation()) {
      return;
    }
    try {
      let result = "";
      let formData = "";
      formData = {
        aadharID: formValuesAN.txtAadharNumber,
      };
      setBtnLoaderActive(true);
      result = await checkFarmerByAadharNumber(formData);
      setBtnLoaderActive(false);
      console.log(result, "result");
      setSelectedFarmer([]);
      setfetchfarmersummary("");
      setFarmersTicketSummaryData([]);
      setStateCropLossIntimation("NA");
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          if (Object.keys(result.response.responseData.data).length === 0) {
            setSelectedFarmer([]);
            setfetchfarmersummary("");
            if (aadharNoSelect.current) {
              aadharNoSelect.current.focus();
            }
            setAlertMessage({
              type: "warning",
              message: "Farmer Not Registered, Please change Aadhar Number",
            });
          } else {
            setSelectedFarmer(result.response.responseData.data.result);
            // A getfarmersTicketSummaryData(result.response.responseData.data.result.farmerID);
            setfetchfarmersummary(result.response.responseData.data.result.farmerID);
          }
        } else {
          setSelectedFarmer([]);
          setfetchfarmersummary("");
        }
      } else {
        setAlertMessage({
          type: "warning",
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
  const validateFarmerByBankAccountNumber = async () => {
    if (!handleFarmersValidation()) {
      return;
    }
    try {
      let result = "";
      let formData = "";
      formData = {
        branchID: formValues.txtBranchName && formValues.txtBranchName.branchID ? formValues.txtBranchName.branchID : "",
        accountNumber: formValues.txtAccountNumber && formValues.txtAccountNumber ? formValues.txtAccountNumber : "",
      };
      setBtnLoaderActive(true);
      result = await checkFarmerByAccountNumber(formData);
      setBtnLoaderActive(false);
      console.log(result, "result");
      setSelectedFarmer([]);
      setfetchfarmersummary("");
      setFarmersTicketSummaryData([]);
      setStateCropLossIntimation("NA");
      if (result.response.responseCode === 1) {
        if (Object.keys(result.response.responseData.data).length === 0) {
          setSelectedFarmer([]);
          setfetchfarmersummary("");
          setAlertMessage({
            type: "warning",
            message: "Farmer Not Registered, Please change Account Number",
          });
        } else {
          setSelectedFarmer(result.response.responseData.data.result);
          // A getfarmersTicketSummaryData(result.response.responseData.data.result.farmerID);
          setfetchfarmersummary(result.response.responseData.data.result.farmerID);
        }
      } else {
        setAlertMessage({
          type: "warning",
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
  const validateFarmerByPolicyNumber = async () => {
    if (!handleFarmersValidation()) {
      return;
    }
    try {
      let result = "";
      let formData = "";
      setBtnLoaderActive(true);

      formData = {
        policyID: formValuesForPolicyNumber.txtPolicyNumber ? formValuesForPolicyNumber.txtPolicyNumber : "",
        seasonCode: seasonPolicyNumber.toString(),
        yearCode: yearPolicyNumber,
      };
      result = await searchPolicy(formData);
      setBtnLoaderActive(false);
      console.log(result, "result");
      setSelectedFarmer([]);
      setfetchfarmersummary("");
      setFarmersTicketSummaryData([]);
      setStateCropLossIntimation("NA");
      if (result.response.responseCode === 1) {
        const farmersData = Object.values(result.response.responseData.data);
        console.log(Object.values(result.response.responseData.data));
        console.log("data");
        if (farmersData && farmersData.length > 0) {
          setSelectedFarmer(farmersData[0]);
          setFormValuesForFarmerInfo({
            ...formValuesForFarmerInfo,
            txtSeasonForFarmerInfo: {
              CropSeasonID: filterSeasonListPolicyNumber[0].CropSeasonID,
              CropSeasonName: filterSeasonListPolicyNumber[0].CropSeasonName,
            },
            txtYearForFarmerInfo: { Value: filterYearListPolicyNumber[0].Value, Name: filterYearListPolicyNumber[0].Name },
          });
          // A getfarmersTicketSummaryData(farmersData[0].farmerID);
          setfetchfarmersummary(farmersData[0].farmerID);
        } else {
          setSelectedFarmer([]);
          setfetchfarmersummary("");
          setAlertMessage({
            type: "warning",
            message: "Farmer Not Registered",
          });
        }
      } else {
        setAlertMessage({
          type: "warning",
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

  function sortByProperty(property) {
    return function (a, b) {
      if (a[property] > b[property]) return 1;
      if (a[property] < b[property]) return -1;
      return 0;
    };
  }
  const [farmersData, setFarmersData] = useState([]);
  const validateFarmerByLocation = async () => {
    if (!handleFarmersValidation()) {
      return;
    }
    try {
      let result = "";
      let formData = "";
      setBtnLoaderActive(true);

      formData = {
        districtAlphaCode:
          formValuesForByLocation.txtDistrictForByLocation && formValuesForByLocation.txtDistrictForByLocation.level3ID
            ? formValuesForByLocation.txtDistrictForByLocation.level3ID
            : "",
        villageAlphaCode:
          formValuesForByLocation.txtVillageForByLocation && formValuesForByLocation.txtVillageForByLocation.level7ID
            ? formValuesForByLocation.txtVillageForByLocation.level7ID
            : "",
        seasonCode:
          formValuesForByLocation.txtSeasonForLocation && formValuesForByLocation.txtSeasonForLocation.CropSeasonID
            ? formValuesForByLocation.txtSeasonForLocation.CropSeasonID.toString()
            : "",
        yearCode:
          formValuesForByLocation.txtYearForLocation && formValuesForByLocation.txtYearForLocation.Value
            ? formValuesForByLocation.txtYearForLocation.Value.toString()
            : "",
      };
      result = await checkFarmerByPolicy(formData);
      setBtnLoaderActive(false);
      setFarmersData([]);
      setfetchfarmersummary("");
      setFarmersTicketSummaryData([]);
      setStateCropLossIntimation("NA");
      if (result.response.responseCode === 1) {
        const farmersData = Object.values(result.response.responseData.data);
        if (farmersData && farmersData.length > 0) {
          farmersData.sort(sortByProperty("farmerName"));
          const schemaName =
            formValuesForByLocation.txtSchemeForLocation && formValuesForByLocation.txtSchemeForLocation.ShortName
              ? formValuesForByLocation.txtSchemeForLocation.ShortName
              : "";
          if (schemaName !== "") {
            const filterData = farmersData.filter((x) => {
              return x.scheme === formValuesForByLocation.txtSchemeForLocation.ShortName;
            });
            setFarmersData(filterData);
          } else {
            setFarmersData(farmersData);
          }
          toggleModal();
        } else {
          setFarmersData([]);
          setfetchfarmersummary("");
          setAlertMessage({
            type: "warning",
            message: "Farmer Not Registered",
          });
        }
      } else {
        setAlertMessage({
          type: "warning",
          message: "Farmer Not Registered",
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

  const [formValuesForFarmerInfo, setFormValuesForFarmerInfo] = useState({
    txtSeasonForFarmerInfo: null,
    txtYearForFarmerInfo: null,
    txtSchemeForFarmerInfo: null,
  });

  const updateStateForFarmerInfo = (name, value) => {
    setFormValuesForFarmerInfo({ ...formValuesForFarmerInfo, [name]: value });
    formValidationFarmersInfoError[name] = validateFarmersInfoField(name, value);
    debugger;
    //  Aif (name === "txtYearForFarmerInfo") {
    //  A if (value) {
    //  A   if (value.Value < runningCurrentYear) {
    //  A     setSelectedOption("1");
    //  A     setSelectedOptionCropStage("1");
    //  A     setTicketCategoryTypeList([]);
    //  A     setTicketCategoryList([]);
    //  A     setLossAtList([]);
    //  A     setCropStageList([]);
    //  A     getTicketCategoryTypeListData("1", 0, "TCKTYP");
    //  A     setFormValuesTicketCreation({
    //  A       ...formValuesTicketCreation,
    //  A       txtTicketCategoryType: null,
    //  A       txtTicketCategory: null,
    //  A       txtCropLossDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
    //  A       txtCropLossIntimation: "On-time",
    //  A       txtCropLossTime: "",
    //  A       txtTicketDescription: "",
    //  A       txtLossAt: null,
    //  A       txtOtherSubCategory: null,
    //  A       txtCropStage: null,
    //  A       txtCropHarvestDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
    //  A       txtCropName: "",
    //  A     });
    //  A   }
    //  A }
    // A}

    if (name === "txtYearForFarmerInfo") {
      if (value) {
          setSelectedOption("1");
          setSelectedOptionCropStage("1");
          setTicketCategoryTypeList([]);
          setTicketCategoryList([]);
          setLossAtList([]);
          setCropStageList([]);
          getTicketCategoryTypeListData("1", 0, "TCKTYP");
          setFormValuesTicketCreation({
            ...formValuesTicketCreation,
            txtTicketCategoryType: null,
            txtTicketCategory: null,
            txtCropLossDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
            txtCropLossIntimation: "On-time",
            txtCropLossTime: "",
            txtTicketDescription: "",
            txtLossAt: null,
            txtOtherSubCategory: null,
            txtCropStage: null,
            txtCropHarvestDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
            txtCropName: "",
          });
        }
    }
  };

  const validateFarmerOnClick = () => {
    clearInsuranceFields();
    
    if (selectedValidateOption === "1") {
      validateFarmerByMobileNumberCreateTicket();
    } else if (selectedValidateOption === "2") {
      validateFarmerByAadharNumber();
    } else if (selectedValidateOption === "3") {
      validateFarmerByBankAccountNumber();
    } else if (selectedValidateOption === "4") {
      validateFarmerByPolicyNumber();
    } else if (selectedValidateOption === "5") {
      validateFarmerByLocation();
    }
  };

  const updateStateForByLocation = (name, value) => {
    setFormValuesForByLocation({ ...formValuesForByLocation, [name]: value });
    console.log("name , value", name, value);
    if (name === "txtSeasonForLocation") {
      setFormValuesForByLocation({
        ...formValuesForByLocation,
        txtSeasonForLocation: value,
        txtDistrictForByLocation: null,
        txtSubDistrictForByLocation: null,
        txtlevel5ByLocation: null,
        txtlevel6ByLocation: null,
        txtVillageForByLocation: null,
      });
      setDistrictForByLocationDropdownDataList([]);
      setSubDistrictForByLocationDropdownDataList([]);
      setlevel5ByLocationDropdownDataList([]);
      setlevel6ByLocationDropdownDataList([]);
      setVillageForByLocationDropdownDataList([]);
      setlableTalukAnything("SubDistrict");
      setlablelevel5("NyayPanchayat");
      setlablelevel6("GramPanchayat");
      setlableVillageForByLocation("Village");
      if (value) {
        const pSeasonVal = value.CropSeasonID === 1 ? "01" : value.CropSeasonID === 2 ? "02" : "";
        if (
          formValuesForByLocation.txtYearForLocation !== null &&
          formValuesForByLocation.txtSchemeForLocation !== null &&
          formValuesForByLocation.txtStateForByLocation !== null
        ) {
          getLocationHierarchyListData(
            formValuesForByLocation.txtStateForByLocation.StateCodeAlpha,
            formValuesForByLocation.txtStateForByLocation.StateMasterID,
            pSeasonVal,
            "",
            "",
          );
        }
      }
    }
    if (name === "txtYearForLocation") {
      setFormValuesForByLocation({
        ...formValuesForByLocation,
        txtYearForLocation: value,
        txtDistrictForByLocation: null,
        txtSubDistrictForByLocation: null,
        txtlevel5ByLocation: null,
        txtlevel6ByLocation: null,
        txtVillageForByLocation: null,
      });
      setDistrictForByLocationDropdownDataList([]);
      setSubDistrictForByLocationDropdownDataList([]);
      setlevel5ByLocationDropdownDataList([]);
      setlevel6ByLocationDropdownDataList([]);
      setVillageForByLocationDropdownDataList([]);
      setlableTalukAnything("SubDistrict");
      setlablelevel5("NyayPanchayat");
      setlablelevel6("GramPanchayat");
      setlableVillageForByLocation("Village");
      if (value) {
        const pYearVal = value.Value.toString().substr(value.Value.length - 2);
        if (
          formValuesForByLocation.txtSeasonForLocation !== null &&
          formValuesForByLocation.txtSchemeForLocation !== null &&
          formValuesForByLocation.txtStateForByLocation !== null
        ) {
          getLocationHierarchyListData(
            formValuesForByLocation.txtStateForByLocation.StateCodeAlpha,
            formValuesForByLocation.txtStateForByLocation.StateMasterID,
            "",
            pYearVal,
            "",
          );
        }
      }
    }
    if (name === "txtSchemeForLocation") {
      setFormValuesForByLocation({
        ...formValuesForByLocation,
        txtSchemeForLocation: value,
        txtDistrictForByLocation: null,
        txtSubDistrictForByLocation: null,
        txtlevel5ByLocation: null,
        txtlevel6ByLocation: null,
        txtVillageForByLocation: null,
      });
      setDistrictForByLocationDropdownDataList([]);
      setSubDistrictForByLocationDropdownDataList([]);
      setlevel5ByLocationDropdownDataList([]);
      setlevel6ByLocationDropdownDataList([]);
      setVillageForByLocationDropdownDataList([]);
      setlableTalukAnything("SubDistrict");
      setlablelevel5("NyayPanchayat");
      setlablelevel6("GramPanchayat");
      setlableVillageForByLocation("Village");
      if (value) {
        const pShemeVal = value.SchemeID === 2 ? "02" : value.SchemeID === 4 ? "04" : "";
        if (
          formValuesForByLocation.txtYearForLocation !== null &&
          formValuesForByLocation.txtSeasonForLocation !== null &&
          formValuesForByLocation.txtStateForByLocation !== null
        ) {
          getLocationHierarchyListData(
            formValuesForByLocation.txtStateForByLocation.StateCodeAlpha,
            formValuesForByLocation.txtStateForByLocation.StateMasterID,
            "",
            "",
            pShemeVal,
          );
        }
      }
    }
    if (name === "txtStateForByLocation") {
      if (formValuesForByLocation.txtSeasonForLocation === null) {
        setAlertMessage({
          type: "error",
          message: "Pleas Select Season.",
        });
        setFormValuesForByLocation({
          ...formValuesForByLocation,
          txtStateForByLocation: null,
        });
        return;
      }
      if (formValuesForByLocation.txtYearForLocation === null) {
        setAlertMessage({
          type: "error",
          message: "Pleas Select Year.",
        });
        setFormValuesForByLocation({
          ...formValuesForByLocation,
          txtStateForByLocation: null,
        });
        return;
      }
      if (formValuesForByLocation.txtSchemeForLocation === null) {
        setAlertMessage({
          type: "error",
          message: "Pleas Select Scheme.",
        });
        setFormValuesForByLocation({
          ...formValuesForByLocation,
          txtStateForByLocation: null,
        });
        return;
      }
      setFormValuesForByLocation({
        ...formValuesForByLocation,
        txtStateForByLocation: value,
        txtDistrictForByLocation: null,
        txtSubDistrictForByLocation: null,
        txtlevel5ByLocation: null,
        txtlevel6ByLocation: null,
        txtVillageForByLocation: null,
      });
      setDistrictForByLocationDropdownDataList([]);
      setSubDistrictForByLocationDropdownDataList([]);
      setlevel5ByLocationDropdownDataList([]);
      setlevel6ByLocationDropdownDataList([]);
      setVillageForByLocationDropdownDataList([]);
      setlableTalukAnything("SubDistrict");
      setlablelevel5("NyayPanchayat");
      setlablelevel6("GramPanchayat");
      setlableVillageForByLocation("Village");

      if (value) {
        getLocationHierarchyListData(value.StateCodeAlpha, value.StateMasterID, "", "", "");
      }
    }
    if (name === "txtDistrictForByLocation") {
      setFormValuesForByLocation({
        ...formValuesForByLocation,
        txtDistrictForByLocation: value,
        txtSubDistrictForByLocation: null,
        txtlevel5ByLocation: null,
        txtlevel6ByLocation: null,
        txtVillageForByLocation: null,
      });
      setSubDistrictForByLocationDropdownDataList([]);
      setlevel5ByLocationDropdownDataList([]);
      setlevel6ByLocationDropdownDataList([]);
      setVillageForByLocationDropdownDataList([]);
      if (value) {
        getSubDistrictByStateANDDistrictListData(value.level3ID);
      }
    }

    if (name === "txtSubDistrictForByLocation") {
      setFormValuesForByLocation({
        ...formValuesForByLocation,
        txtSubDistrictForByLocation: value,
        txtlevel5ByLocation: null,
        txtlevel6ByLocation: null,
        txtVillageForByLocation: null,
      });
      setlevel5ByLocationDropdownDataList([]);
      setlevel6ByLocationDropdownDataList([]);
      setVillageForByLocationDropdownDataList([]);
      if (value) {
        getlevel5ListData(value.level4ID, formValuesForByLocation.txtDistrictForByLocation.level3ID);
      }
    }
    if (name === "txtlevel5ByLocation") {
      setFormValuesForByLocation({
        ...formValuesForByLocation,
        txtlevel5ByLocation: value,
        txtlevel6ByLocation: null,
        txtVillageForByLocation: null,
      });
      setlevel6ByLocationDropdownDataList([]);
      setVillageForByLocationDropdownDataList([]);
      if (value) {
        if (lablelevel6 === null) {
          getlevel7ListData(
            formValuesForByLocation.txtDistrictForByLocation && formValuesForByLocation.txtDistrictForByLocation.level3ID
              ? formValuesForByLocation.txtDistrictForByLocation.level3ID
              : "",
            formValuesForByLocation.txtSubDistrictForByLocation && formValuesForByLocation.txtSubDistrictForByLocation.level4ID
              ? formValuesForByLocation.txtSubDistrictForByLocation.level4ID
              : "",
            value.level5ID,
            "",
          );
        } else {
          getlevel6ListData(
            formValuesForByLocation.txtDistrictForByLocation.level3ID,
            formValuesForByLocation.txtSubDistrictForByLocation.level4ID,
            value.level5ID,
          );
        }
      }
    }
    if (name === "txtlevel6ByLocation") {
      setFormValuesForByLocation({
        ...formValuesForByLocation,
        txtlevel6ByLocation: value,
        txtVillageForByLocation: null,
      });
      setVillageForByLocationDropdownDataList([]);
      if (value) {
        getlevel7ListData(
          formValuesForByLocation.txtDistrictForByLocation && formValuesForByLocation.txtDistrictForByLocation.level3ID
            ? formValuesForByLocation.txtDistrictForByLocation.level3ID
            : "",
          formValuesForByLocation.txtSubDistrictForByLocation && formValuesForByLocation.txtSubDistrictForByLocation.level4ID
            ? formValuesForByLocation.txtSubDistrictForByLocation.level4ID
            : "",
          formValuesForByLocation.txtlevel5ByLocation && formValuesForByLocation.txtlevel5ByLocation.level5ID
            ? formValuesForByLocation.txtlevel5ByLocation.level5ID
            : "",
          value.level6ID,
        );
      }
    }
  };

  const [selectedInsuranceDetails, setSelectedInsuranceDetails] = useState([]);
  const clearFarmerAuthenticationForm = () => {
    setFormValuesAN({
      ...formValuesMN,
      txtAadharNumber: "",
    });
    setFormValues({
      ...formValues,
      txtState: null,
      txtDistrict: null,
      txtBankName: null,
      txtBranchName: null,
      txtAccountNumber: "",
    });
    setFormValuesForPolicyNumber({
      ...formValuesForPolicyNumber,
      txtStateForPolicyNumber: null,
      txtDistrictForPolicyNumber: null,
      txtSubDistrictForPolicyNumber: null,
      txtVillageForPolicyNumber: null,
      txtSeasonForPolicyNumber: null,
      txtYearForPolicyNumber: null,
      txtPolicyNumber: "",
      txtSchemeForPolicyNumber: "",
      txtSeasonForPolicyNumber: "",
      txtStateAndYearForPolicyNumber: "",
    });
    setFormValuesForByLocation({
      ...formValuesForByLocation,
      txtStateForByLocation: null,
      txtDistrictForByLocation: null,
      txtSubDistrictForByLocation: null,
      txtVillageForByLocation: null,
      txtSeasonForLocation: null,
      txtYearForLocation: null,
      txtSchemeForLocation: null,
      txtlevel5ByLocation: null,
      txtlevel6ByLocation: null,
    });
    setFormValuesForFarmerInfo({
      ...formValuesForFarmerInfo,
      txtSeasonForFarmerInfo: null,
      txtYearForFarmerInfo: null,
      txtSchemeForFarmerInfo: null,
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
      txtOtherSubCategory: null,
      txtCropStage: null,
      txtCropHarvestDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
      txtCropName: "",
    });

    setDistrictDropdownDataList([]);
    setBankDropdownDataList([]);
    setBankBranchDropdownDataList([]);
    setDistrictForByLocationDropdownDataList([]);
    setSubDistrictForByLocationDropdownDataList([]);
    setVillageForByLocationDropdownDataList([]);
    setSelectedFarmer([]);
    setlableTalukAnything("SubDistrict");
    setlableVillageForByLocation("Village");
    setFormValidationFarmersError({});
    setFormValidationFarmersInfoError({});
    setInsuranceCompanyDataGreivence([]);
    setTicketCategoryTypeList([]);
    setTicketCategoryList([]);
    // A  setSelectedOption("1");
    getTicketCategoryTypeListData("1", 0, "TCKTYP");
    setSelectedInsuranceDetails([]);
    // A  setSelectedClaimOrGrievence("");
    // A  setClaimOrGrievenceDisabled(false);
    // A  setfilterSeasonListPolicyNumber([]);
    // A setfilterYearListPolicyNumber([]);
    setSeasonPolicyNumber("");
    setStatePolicyNumber("");
    setYearPolicyNumber("");
    // A  setTicketHistoryData([]);
    setFarmersTicketSummaryData([]);
    setLossAtList([]);
    setCropStageList([]);
    setlablelevel5("NyayPanchayat");
    setlablelevel6("GramPanchayat");
    setlevel5ByLocationDropdownDataList([]);
    setlevel6ByLocationDropdownDataList([]);

    setFormValuesForByNonRegFarmerOrOffline({
      ...formValuesForByNonRegFarmerOrOffline,
      txtStateForByNonRegFarmerOrOffline: null,
      txtDistrictForByNonRegFarmerOrOffline: null,
      txtSubDistrictForByNonRegFarmerOrOffline: null,
      txtVillageForByNonRegFarmerOrOffline: null,
      txtSeasonForNonRegFarmerOrOffline: null,
      txtYearForNonRegFarmerOrOffline: null,
      txtSchemeForNonRegFarmerOrOffline: null,
      txtlevel5ByNonRegFarmerOrOffline: null,
      txtlevel6ByNonRegFarmerOrOffline: null,
      txtAddress: "",
      txtPinCode: "",
      txtAreaInHectareForCalculator: "",
      txtCropForCalculate: null,
      CalculatedSumInsured: ","
    });

    setDistrictForByNonRegFarmerOrOfflineDropdownDataList([]);
    setSubDistrictForByNonRegFarmerOrOfflineDropdownDataList([]);
    setVillageForByNonRegFarmerOrOfflineDropdownDataList([]);

    setlableTalukAnythingNonRegFarmerOrOffline("SubDistrict");
    setlableVillageForByNonRegFarmerOrOffline("Village");

    setlablelevel5NonRegFarmerOrOffline("NyayPanchayat");
    setlablelevel6NonRegFarmerOrOffline("GramPanchayat");
    setlevel5ByNonRegFarmerOrOfflineDropdownDataList([]);
    setlevel6ByNonRegFarmerOrOfflineDropdownDataList([]);

    setFormValidationSupportTicketError({});
    setformValidationFarmersErrorForNonRegFarmerOrOffline({});
    setStateCropLossIntimation("NA");
    setBtnEnableSaveOnValidateMN(false);
    setfetchfarmersummary("");
    setstateYearAndSeason("YRSSNYES");
    setTicketCategoryOtherList([]);
    setgetSupportTicketNo("");
  };

  const clearFormForNonRegisteredFarmer = () => {
    setFormValuesForByNonRegFarmerOrOffline({
      ...formValuesForByNonRegFarmerOrOffline,
      txtStateForByNonRegFarmerOrOffline: null,
      txtDistrictForByNonRegFarmerOrOffline: null,
      txtSubDistrictForByNonRegFarmerOrOffline: null,
      txtVillageForByNonRegFarmerOrOffline: null,
      txtSeasonForNonRegFarmerOrOffline: null,
      txtYearForNonRegFarmerOrOffline: null,
      txtSchemeForNonRegFarmerOrOffline: null,
      txtlevel5ByNonRegFarmerOrOffline: null,
      txtlevel6ByNonRegFarmerOrOffline: null,
      txtAddress: "",
      txtPinCode: "",
      txtAreaInHectareForCalculator: "",
      txtCropForCalculate: null,
      CalculatedSumInsured: ","
    });
    setDistrictForByNonRegFarmerOrOfflineDropdownDataList([]);
    setSubDistrictForByNonRegFarmerOrOfflineDropdownDataList([]);
    setVillageForByNonRegFarmerOrOfflineDropdownDataList([]);

    setlableTalukAnythingNonRegFarmerOrOffline("SubDistrict");
    setlableVillageForByNonRegFarmerOrOffline("Village");

    setlablelevel5NonRegFarmerOrOffline("NyayPanchayat");
    setlablelevel6NonRegFarmerOrOffline("GramPanchayat");
    setlevel5ByNonRegFarmerOrOfflineDropdownDataList([]);
    setlevel6ByNonRegFarmerOrOfflineDropdownDataList([]);
    setformValidationFarmersErrorForNonRegFarmerOrOffline({});
    
    setFormValuesTicketCreation({
      ...formValuesTicketCreation,
      txtTicketCategory: null,
      txtTicketCategoryType: null,
      txtCropLossDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
      txtCropLossIntimation: "On-time",
      txtCropLossTime: "",
      txtTicketDescription: "",
      txtLossAt: null,
      txtOtherSubCategory: null,
      txtCropStage: null,
      txtCropHarvestDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
      txtCropName: "",
    });
    setSelectedOption("1");
    setSelectedOptionCropStage("1");
    setTicketCategoryTypeList([]);
    setTicketCategoryList([]);
    setLossAtList([]);
    setCropStageList([]);
    getTicketCategoryTypeListData("1", 0, "TCKTYP");
    setTicketCategoryOtherList([]);
  };

  const OnClickSelectedValidateOption = (selectedOption) => {
    clearFarmerAuthenticationForm();
    if (selectedOption === "MN") {
      setSelectedValidateOption("1");
    } else if (selectedOption === "AN") {
      setSelectedValidateOption("2");
    } else if (selectedOption === "BAN") {
      setSelectedValidateOption("3");
      getStateListData();
    } else if (selectedOption === "PN") {
      setSelectedValidateOption("4");
    } else if (selectedOption === "BL") {
      setSelectedValidateOption("5");
      getStateForByLocationListData();
    } else if (selectedOption === "NRF") {
      setSelectedValidateOption("6");
      setFormValuesForByNonRegFarmerOrOffline({
        ...formValuesForByLocation,
        txtFarmerNameForNonRegFarmerOrOffline: formValuesGI.txtFarmerName ? formValuesGI.txtFarmerName : "",
        txtMobileForNonRegFarmerOrOffline: dcryptUMBLENO,
        
      });
      getStateForByNonRegFarmerOrOfflineListData();
      getNonRegisteresFarmerDetailsByMobile();
    } else if (selectedOption === "OFFLN") {
      setSelectedValidateOption("7");
      getStateForByNonRegFarmerOrOfflineListData();
      getInsuranceCompanyListData();
    }
  };
  // A const [fetchfarmersummary, setfetchfarmersummary] = useState("");
  // A const [farmersTicketSummaryData, setFarmersTicketSummaryData] = useState([]);
  const [btnLoaderActiveTicketSummary, setBtnLoaderActiveTicketSummary] = useState(false);
  const getfarmersTicketSummaryData = async (pticketRequestorID) => {
    try {
      let result = "";
      let formData = "";

      formData = {
        viewMode: "RQSTID",
        ticketRequestorID: pticketRequestorID,
        mobilenumber: "",
        aadharNumber: "",
        accountNumber: "",
      };
      setBtnLoaderActiveTicketSummary(true);
      result = await farmerTicketSummaryKRPH(formData);
      setBtnLoaderActiveTicketSummary(false);
      console.log(result, "result");
      setFarmersTicketSummaryData([]);
      if (result.response.responseCode.toString() === "1") {
        const farmersTicketData = Object.values(result.response.responseData.data.result);
        if (farmersTicketData && farmersTicketData.length > 0) {
          const filterfarmersTicketData = farmersTicketData.filter((data) => {
            return data.TicketStatusID === 109301 || data.TicketStatusID === 109303;
          });
          let totalStsCnt = 0;
          farmersTicketData.forEach((v) => {
            totalStsCnt += v.Total;
          });
          filterfarmersTicketData.push({ Total: totalStsCnt, TicketStatus: "Total", TicketStatusID: 0 });
          setFarmersTicketSummaryData(filterfarmersTicketData);
          setfetchfarmersummary("");
        } else {
          setFarmersTicketSummaryData([]);
        }
      } else {
        setFarmersTicketSummaryData([]);
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };
  const fetchfarmersTicketSummary = () => {
    getfarmersTicketSummaryData(fetchfarmersummary);
  };

  const [stateYearAndSeason, setstateYearAndSeason] = useState("YRSSNYES");
  const ResetYrSsnSchmApplicationDataOnClick = () => {
    setFormValuesForFarmerInfo({
      ...formValuesForFarmerInfo,
      txtSeasonForFarmerInfo: null,
      txtYearForFarmerInfo: null,
      txtSchemeForFarmerInfo: null,
    });
    setSelectedInsuranceDetails([]);
    setfetchfarmersummary("");
    setFarmersTicketSummaryData([]);
    setstateYearAndSeason("YRSSNYES");
  };

  const [formValidationFarmersInfoError, setFormValidationFarmersInfoError] = useState({});
  const validateFarmersInfoField = (name, value) => {
    let errorsMsg = "";

    if (name === "txtSeasonForFarmerInfo") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Season is required!";
      }
    }

    if (name === "txtYearForFarmerInfo") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Year is required!";
      }
    }

    return errorsMsg;
  };

  const handleFarmersInfoValidation = () => {
    try {
      const errors = {};
      let formIsValid = true;
      errors["txtSeasonForFarmerInfo"] = validateFarmersInfoField("txtSeasonForFarmerInfo", formValuesForFarmerInfo.txtSeasonForFarmerInfo);
      errors["txtYearForFarmerInfo"] = validateFarmersInfoField("txtYearForFarmerInfo", formValuesForFarmerInfo.txtYearForFarmerInfo);

      if (Object.values(errors).join("").toString()) {
        formIsValid = false;
      }
      setFormValidationFarmersInfoError(errors);
      return formIsValid;
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: "Something Went Wrong",
      });
      return false;
    }
  };

  const [insuranceCompanyDataGreivence, setInsuranceCompanyDataGreivence] = useState([]);
  const [btnLoaderFarmerGreivenceInfoActive, setBtnLoaderFarmerGreivenceInfoActive] = useState(false);
  const [isLoadingApplicationNoDataGreivence, setIsLoadingApplicationNodatGreivence] = useState(false);
  const getPolicyOfFarmerGreivenceOnClick = async () => {
    if (!handleFarmersInfoValidation()) {
      return;
    }
    try {
      setBtnLoaderFarmerGreivenceInfoActive(true);
      setIsLoadingApplicationNodatGreivence(true);
      if (selectedFarmer.length === 0 && selectedFarmer.length !== undefined) {
        setAlertMessage({
          type: "error",
          message: "Farmer Authentication is required!",
        });
        setBtnLoaderFarmerGreivenceInfoActive(false);
        setIsLoadingApplicationNodatGreivence(false);
        return;
      }

      let result = "";
      let formData = "";

      formData = {
        mobilenumber: "7776543289",
        seasonID: formValuesForFarmerInfo.txtSeasonForFarmerInfo ? formValuesForFarmerInfo.txtSeasonForFarmerInfo.CropSeasonID.toString() : "",
        year: formValuesForFarmerInfo.txtYearForFarmerInfo ? formValuesForFarmerInfo.txtYearForFarmerInfo.Value.toString() : "",
        farmerID: selectedFarmer ? selectedFarmer.farmerID : "",
      };
      result = await getFarmerPolicyDetail(formData);
      console.log(result, "applicationData Greivence");
      setBtnLoaderFarmerGreivenceInfoActive(false);
      setIsLoadingApplicationNodatGreivence(false);
      setSelectedInsuranceDetails([]);
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          if (Object.keys(result.response.responseData.data).length > 0) {
            const farmersData = Object.values(result.response.responseData.data);
            if (farmersData && farmersData.length > 0) {
              const farmerAndApplicationData = [];
              farmersData.forEach((v) => {
                v.applicationList.forEach((x) => {
                  farmerAndApplicationData.push({
                    mobile: v.mobile,
                    farmerName: v.farmerName,
                    farmerID: v.farmerID,
                    aadharNumber: v.aadharNumber,
                    accountNumber: v.accountNumber,
                    relation: v.relation,
                    relativeName: v.relativeName,
                    resDistrict: v.resDistrict,
                    resState: v.resState,
                    resVillage: v.resVillage,
                    resSubDistrict: v.resSubDistrict,
                    resDistrictID: v.resDistrictID,
                    resStateID: v.resStateID,
                    resVillageID: v.resVillageID,
                    resSubDistrictID: v.resSubDistrictID,
                    policyPremium: parseFloat(v.policyPremium).toFixed(2),
                    policyArea: v.policyArea,
                    policyType: v.policyType,
                    scheme: v.scheme,
                    SchemeName:
                      v.scheme === "WBCIS"
                        ? "Weather Based Crop Insurance Scheme(WBCIS)"
                        : v.scheme === "PMFBY"
                        ? "Pradhan Mantri Fasal Bima Yojna(PMFBY)"
                        : "",
                    SchemeID: v.scheme === "WBCIS" ? 2 : v.scheme === "PMFBY" ? 4 : 0,
                    insuranceCompanyName: v.insuranceCompanyName,
                    policyID: x.policyID,
                    applicationStatus: x.applicationStatus,
                    applicationStatusCode: x.applicationStatusCode,
                    applicationNo: x.applicationNo,
                    landSurveyNumber: x.landSurveyNumber,
                    landDivisionNumber: x.landDivisionNumber,
                    plotStateName: x.plotStateName,
                    plotDistrictName: x.plotDistrictName,
                    plotVillageName: x.plotVillageName,
                    plotDistrictID: x.plotDistrictID,
                    applicationSource: x.applicationSource,
                    cropName: x.cropName,
                    cropShare: parseFloat(x.cropShare).toFixed(3),
                    createdAt: x.createdAt,
                    ifscCode: x.ifscCode,
                    farmerShare: x.farmerShare,
                    sowingDate: x.sowingDate,
                  });
                });
              });
              setInsuranceCompanyDataGreivence(farmerAndApplicationData);
              toggleInsuranceCompanyModalGreivence();
            } else {
              setInsuranceCompanyDataGreivence([]);
              setAlertMessage({
                type: "warning",
                message: "Policy Data not found.",
              });
            }
          } else {
            setInsuranceCompanyDataGreivence([]);
            setAlertMessage({
              type: "warning",
              message: "Policy Data not found.",
            });
          }
        } else {
          setInsuranceCompanyDataGreivence([]);
          setAlertMessage({
            type: "warning",
            message: "Policy Data not found.",
          });
        }
      } else {
        setAlertMessage({
          type: "warning",
          message: "Policy Data not found.",
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
  const [formValidationFarmersError, setFormValidationFarmersError] = useState({});

  const [btnLoaderClaimStatusActive, setBtnLoaderClaimStatusActive] = useState(false);
  const [isLoadingClaimStatusData, setIsLoadingClaimStatusData] = useState(false);
  const getClaimStatusOnClick = async (pApplicationNo) => {
    debugger;
    try {
      setBtnLoaderClaimStatusActive(true);
      setIsLoadingClaimStatusData(true);
      if (selectedFarmer.length === 0 && selectedFarmer.length !== undefined) {
        setAlertMessage({
          type: "error",
          message: "Farmer Authentication is required!",
        });
        setBtnLoaderClaimStatusActive(false);
        setIsLoadingClaimStatusData(false);
        return;
      }

      if (pApplicationNo === undefined || pApplicationNo === "") {
        if (formValues.txtAccountNumber === "" && formValuesAN.txtAadharNumber === "") {
          setAlertMessage({
            type: "error",
            message: "Either Aadhar Number Or Bank Account Number is required!",
          });
          setBtnLoaderClaimStatusActive(false);
          setIsLoadingClaimStatusData(false);
          return;
        }
      }

      let result = "";
      let formData = "";

      formData = {
        year:
          formValuesForFarmerInfo.txtYearForFarmerInfo && formValuesForFarmerInfo.txtYearForFarmerInfo.Value
            ? formValuesForFarmerInfo.txtYearForFarmerInfo.Value.toString()
            : "0",
        season:
          formValuesForFarmerInfo.txtSeasonForFarmerInfo && formValuesForFarmerInfo.txtSeasonForFarmerInfo.CropSeasonID
            ? formValuesForFarmerInfo.txtSeasonForFarmerInfo.CropSeasonID.toString()
            : "0",
        searchType: selectedValidateOption === "2" ? "Aadhar" : selectedValidateOption === "3" ? "Aadhar" : pApplicationNo ? "Application" : "",
        applicationNumber: pApplicationNo,
        branchID: "",
        bankID: "",
        accountNumber: formValues.txtAccountNumber ? formValues.txtAccountNumber : "",
        aadharNumber: formValuesAN.txtAadharNumber ? formValuesAN.txtAadharNumber : "",
      };
      result = await getClaimDetailData(formData);
      setBtnLoaderClaimStatusActive(false);
      setIsLoadingClaimStatusData(false);
      setClaimStatusData([]);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.length > 0) {
          setClaimStatusData(result.response.responseData);
          toggleClaimStatusModal();
          if (pApplicationNo !== undefined && pApplicationNo !== "") {
            toggleInsuranceCompanyModalGreivence();
          }
        } else {
          setClaimStatusData([]);
          setAlertMessage({
            type: "warning",
            message: "Claim Status Data not found.",
          });
        }
      } else {
        setAlertMessage({
          type: "warning",
          message: "Claim Status Data not found.",
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

  const selectedOptionOnClick = (pselectedOption) => {
    if (pselectedOption === "GR") {
      setSelectedOption("1");
      setSelectedOptionCropStage("1");
      setTicketCategoryList([]);
      getTicketCategoryTypeListData("1", 0, "TCKTYP");
    } else if (pselectedOption === "IN") {
      setSelectedOption("2");
      setSelectedOptionCropStage("1");
      setTicketCategoryList([]);
      getTicketCategoryTypeListData("2", 0, "TCKTYP");
    } else if (pselectedOption === "LO") {
      setSelectedOption("4");
      setSelectedOptionCropStage("1");
      setTicketCategoryTypeList([]);
      setTicketCategoryList([]);
      getLossAtListData(1);
      getCropStageListData(1);
    }
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
    setFormValidationSupportTicketError({});
    setStateCropLossIntimation("NA");
  };
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

  const [formValuesTicketCreation, setFormValuesTicketCreation] = useState({
    // A txtDocumentUpload: "",
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

  const validateFieldSupportTicket = (name, value) => {
    let errorsMsg = "";
    // A if (name === "txtDocumentUpload") {
    // A  if (value && typeof value !== "undefined") {
    // A    const regex = new RegExp("^[a-zA-Z0-9_.-]*$");
    // A    if (!regex.test(value.name)) {
    // A      errorsMsg = "Attachment name is not in valid format.";
    // A    }
    // A  }
    // A }
    if (name === "txtTicketCategory") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Please select Ticket Sub Category!";
      }
    }
    if (name === "txtSchemeForFarmerInfo") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Scheme is required!";
      }
    }
    if (name === "txtTicketCategoryType") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Please select Ticket Category!";
      }
    }
    if (name === "txtOtherSubCategory") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Other Sub Cat. is required!";
      }
    }
    if (name === "txtLossAt") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Loss At is required!";
      }
    }
    if (name === "txtCropStage") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Crop Stage is required!";
      }
    }
    if (name === "txtCropLossDate") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "CropLoss Date is required!";
      }
    }
    // A if (name === "txtCropLossTime") {
    // A  if (!value || typeof value === "undefined") {
    // A    errorsMsg = "Crop Loss Time is required!";
    // A  }
    // A }
    if (name === "txtCropHarvestDate") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Harvest Date is required!";
      }
    }
    if (name === "txtCropName") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Crop Name is required!";
      }
    }
    if (name === "txtTicketDescription") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Ticket Description is required!";
      } else if (value.trim().length === 0) {
        errorsMsg = "Ticket Description cannot be only spaces!";
      } else if (value) {
        if (value.length > 500) {
          errorsMsg = "Ticket Description can not exceed more than 500 characters!";
        }
      }
    }

    return errorsMsg;
  };

  const handleValidationSupportTicket = () => {
    try {
      const errors = {};
      let formIsValid = true;

      // A errors["txtDocumentUpload"] = validateFieldSupportTicket("txtDocumentUpload", formValuesTicketCreation.txtDocumentUpload);
      errors["txtSchemeForFarmerInfo"] = validateFieldSupportTicket("txtSchemeForFarmerInfo", formValuesForFarmerInfo.txtSchemeForFarmerInfo);
      errors["txtTicketCategoryType"] = validateFieldSupportTicket("txtTicketCategoryType", formValuesTicketCreation.txtTicketCategoryType);
      errors["txtTicketCategory"] = validateFieldSupportTicket("txtTicketCategory", formValuesTicketCreation.txtTicketCategory);

      if (selectedOption === "4") {
        errors["txtCropLossDate"] = validateFieldSupportTicket("txtCropLossDate", formValuesTicketCreation.txtCropLossDate);
        // A errors["txtCropLossTime"] = validateFieldSupportTicket("txtCropLossTime", formValuesTicketCreation.txtCropLossTime);
        errors["txtLossAt"] = validateFieldSupportTicket("txtLossAt", formValuesTicketCreation.txtLossAt);
        errors["txtCropStage"] = validateFieldSupportTicket("txtCropStage", formValuesTicketCreation.txtCropStage);
        errors["txtCropName"] = validateFieldSupportTicket("txtCropName", formValuesTicketCreation.txtCropName);
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
      }
      errors["txtTicketDescription"] = validateFieldSupportTicket("txtTicketDescription", formValuesTicketCreation.txtTicketDescription);
      if (Object.values(errors).join("").toString()) {
        formIsValid = false;
      }
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
  const [formValidationCounter, setFormValidationCounter] = useState({});
  // A const [stateCropLossIntimation, setStateCropLossIntimation] = useState("NA");
  const updateStateTicketCreation = (name, value) => {
    debugger;
    setFormValuesTicketCreation({ ...formValuesTicketCreation, [name]: value });
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

    if (name === "txtTicketCategory") {
      setFormValuesTicketCreation({
        ...formValuesTicketCreation,
        txtTicketCategory: value,
        txtOtherSubCategory: null,
      });
      setTicketCategoryOtherList([]);
      if (value) {
        getTicketCategoryOtherListData(value.SupportTicketTypeID, value);
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

  const SavevalidateFarmerOnClick = async (pdistrictCodeAlpha) => {
    debugger;
    try {
      const formData = {
        CallingMasterID: getCallingMasterID,
        callerMobileNumber: formValuesGI.txtMobileCallerNumber ? formValuesGI.txtMobileCallerNumber : "",
        user: dcryptUID,
        callingUniqueID: dcryptUNQEID,
        farmerMobileNumber: formValuesMN.txtMobileNumber ? formValuesMN.txtMobileNumber : "",
        farmerName: formValuesGI.txtFarmerName ? formValuesGI.txtFarmerName : "",
        callStatus: formValuesGI.txtCallStatus && formValuesGI.txtCallStatus.Value ? formValuesGI.txtCallStatus.Value : "",
        reason: formValuesGI.txtReason && formValuesGI.txtReason.Value ? formValuesGI.txtReason.Value : "",
        stateCodeAlpha:
          formValuesGI.txtState && formValuesGI.txtState.StateCodeAlpha ? formValuesGI.txtState.StateCodeAlpha : "",
        districtCodeAlpha: pdistrictCodeAlpha,
        isRegistered: valisRegistered,
      };
      const result = await krphFarmerCallingHistorydata(formData);
      if (result.response.responseCode === 1) {
        if(result.response.responseData.CallingMasterID > 0) {
          setgetCallingMasterID(result.response.responseData.CallingMasterID);
        } else {
          setgetCallingMasterID(1);
        }
        
      } else {
        setgetCallingMasterID(1);
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
      return false;
    }
  };

  const SavevalidateFarmerRegisteredFarmerOnClick = async (pFarmerName,pstateCodeAlpha,pdistrictCodeAlpha) => {
    debugger;
    try {
      const formData = {
        CallingMasterID: getCallingMasterID,
        callerMobileNumber: formValuesGI.txtMobileCallerNumber ? formValuesGI.txtMobileCallerNumber : "",
        user: dcryptUID,
        callingUniqueID: dcryptUNQEID,
        farmerMobileNumber: formValuesMN.txtMobileNumber ? formValuesMN.txtMobileNumber : "",
        farmerName: pFarmerName,
        callStatus: formValuesGI.txtCallStatus && formValuesGI.txtCallStatus.Value ? formValuesGI.txtCallStatus.Value : "",
        reason: formValuesGI.txtReason && formValuesGI.txtReason.Value ? formValuesGI.txtReason.Value : "",
        stateCodeAlpha: pstateCodeAlpha,
        districtCodeAlpha: pdistrictCodeAlpha,
        isRegistered: "R",
      };
      const result = await krphFarmerCallingHistorydata(formData);
      if (result.response.responseCode === 1) {
        if(result.response.responseData.CallingMasterID > 0) {
          setgetCallingMasterID(result.response.responseData.CallingMasterID);
        } else {
          setgetCallingMasterID(1);    
        }
      } else {
        setgetCallingMasterID(1);
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
      return false;
    }
  };
  const clearInsuranceFieldsAndTicketCreation = () => {
    setSelectedInsuranceDetails([]);
    setFormValuesForFarmerInfo({
      ...formValuesForFarmerInfo,
      txtSeasonForFarmerInfo: null,
      txtYearForFarmerInfo: null,
      txtSchemeForFarmerInfo: null,
    });
    setFormValuesTicketCreation({
      ...formValuesTicketCreation,
      txtTicketCategory: null,
      txtTicketCategoryType: null,
      txtCropLossDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
      txtCropLossIntimation: "On-time",
      txtCropLossTime: "",
      txtTicketDescription: "",
      txtLossAt: null,
      txtOtherSubCategory: null,
      txtCropStage: null,
      txtCropHarvestDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
      txtCropName: "",
    });
    setSelectedOption("1");
    setSelectedOptionCropStage("1");
    setTicketCategoryTypeList([]);
    setTicketCategoryList([]);
    setLossAtList([]);
    setCropStageList([]);
    getTicketCategoryTypeListData("1", 0, "TCKTYP");
    setstateYearAndSeason("YRSSNYES");
    setTicketCategoryOtherList([]);
  };

  const [isBtndisabled, setisBtndisabled] = useState(0);
  const [btnLoaderSupportTicketActive, setBtnLoaderSupportTicketActive] = useState(false);
  const supportTicketOnClick = async () => {
    debugger;
    try {

      if (selectedValidateOption !== "6" && selectedValidateOption !== "7") {
        if (selectedFarmer.length === 0 && selectedFarmer.length !== undefined) {
          setAlertMessage({
            type: "warning",
            message: "Farmer Authentication is required!",
          });
  
          return;
        }
  
        if (selectedInsuranceDetails.length === 0 && selectedInsuranceDetails.length !== undefined) {
          setAlertMessage({
            type: "warning",
            message: "Insurance Company is required!",
          });
  
          return;
        }
        if (!handleValidationSupportTicket()) {
          return;
        }  
        CreateTicketBAuthOptions();
      } else if(selectedValidateOption === "6") {
        if (!handleFarmersValidationForNonRegFarmerOrOffline()) {
          return;
        }
        CreateTicketNonRegisteredFarmer();      
      }
      
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const SendSMSToFarmerAgaintSupportTicket = async (ptemplateID, pmobileNO, psupportTicketNo) => {
    try {
      const formData = {
        templateID: ptemplateID,
        mobileNO: pmobileNO,
        supportTicketNo: psupportTicketNo,
      };

      const result = await sendSMSToFarmer(formData);
      if (result.response.responseCode === 1) {
        console.log(`Success: TemplateID : ${ptemplateID} ${JSON.stringify(result)}`);
      } else {
        console.log(`Error: TemplateID : ${ptemplateID} ${JSON.stringify(result)}`);
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const CreateTicketBAuthOptions = async() => {
    try {
      let pticketStatusID = 0;
      // A let pticketStatusNoneBMCG = 0;
      let pticketStatus = "";
      let papplicationNo = "";
      let pPolicyID = "";
      let pticketHeaderID = 0;
      const pticketHeaderName =
        selectedOption === "1" ? "Grievance" : selectedOption === "2" ? "Information" : selectedOption === "4" ? "Crop Loss Intimation" : "";
  
      if (selectedOption === "1" || selectedOption === "4") {
       // A pticketStatusID = 109019;
        pticketStatusID = 109301;
        pticketStatus = "Open";
        // A pticketStatusNoneBMCG = "109301";
        pticketHeaderID = Number(selectedOption);
      } else if (selectedOption === "2") {
        // A pticketStatusID = 109025;
        pticketStatusID = 109303;
        pticketStatus = "Resolved";
        // A pticketStatusNoneBMCG = "109303";
        pticketHeaderID = Number(selectedOption);
      }
      if (selectedClaimOrGrievence === "CI") {
        papplicationNo = selectedInsuranceDetails && selectedInsuranceDetails.applicationNo ? selectedInsuranceDetails.applicationNo : "";
        pPolicyID = selectedInsuranceDetails && selectedInsuranceDetails.policyID ? selectedInsuranceDetails.policyID : "";
      } else {
        papplicationNo = selectedInsuranceDetails && selectedInsuranceDetails.applicationNo ? selectedInsuranceDetails.applicationNo : "";
        pPolicyID = selectedInsuranceDetails && selectedInsuranceDetails.policyID ? selectedInsuranceDetails.policyID : "";
      }
      const user = getSessionStorage("user");
      const  pcreationMode =
        selectedValidateOption === "1"
          ? "MOB"
          : selectedValidateOption === "2"
          ? "AAD"
          : selectedValidateOption === "3"
          ? "BNK"
          : selectedValidateOption === "4"
          ? "POL"
          : selectedValidateOption === "5"
          ? "LOC"
          : "";
        let pselectedOptionCropStage = ""  ;  
        if (selectedOption === "4") {
          pselectedOptionCropStage = selectedOptionCropStage === "1" ? "Standing Crop Stage" : selectedOptionCropStage === "2" ? "Harvested Stage" : ""; 
        }  
          
       const formData = {
        creationMode: pcreationMode,
        subCategoryName:
          formValuesTicketCreation.txtOtherSubCategory && formValuesTicketCreation.txtOtherSubCategory.OtherCategoryName
            ? formValuesTicketCreation.txtOtherSubCategory.OtherCategoryName
            : "",
        callerContactNumber: formValuesGI.txtMobileCallerNumber ? formValuesGI.txtMobileCallerNumber : "",
        supportTicketID: 0,
        ticketRequestorID: selectedFarmer ? selectedFarmer.farmerID : "",
        stateCodeAlpha: selectedFarmer && selectedFarmer.stateID ? selectedFarmer.stateID : selectedFarmer.resStateID ? selectedFarmer.resStateID : "",
        districtRequestorID:
          selectedFarmer && selectedFarmer.districtID ? selectedFarmer.districtID : selectedFarmer.resDistrictID ? selectedFarmer.resDistrictID : "",
        villageRequestorID:
          selectedFarmer && selectedFarmer.villageID ? selectedFarmer.villageID : selectedFarmer.resVillageID ? selectedFarmer.resVillageID : "",
        supportTicketNo: "0",
        requestorName: selectedFarmer ? selectedFarmer.farmerName : "",
        requestorMobileNo: selectedFarmer && selectedFarmer.mobile ? selectedFarmer.mobile : "",
        requestorAccountNo: selectedFarmer && selectedFarmer.accountNumber ? selectedFarmer.accountNumber : "",
        requestorAadharNo: selectedFarmer && selectedFarmer.aadharNumber ? selectedFarmer.aadharNumber : "",
        ticketCategoryID:
        formValuesTicketCreation.txtTicketCategoryType && formValuesTicketCreation.txtTicketCategoryType.SupportTicketTypeID
        ? formValuesTicketCreation.txtTicketCategoryType.SupportTicketTypeID
        : 0,
        // A cropCategoryOthers: formValuesTicketCreation.txtOtherSubCategory ? formValuesTicketCreation.txtOtherSubCategory : "",
        cropCategoryOthers:
          formValuesTicketCreation.txtOtherSubCategory && formValuesTicketCreation.txtOtherSubCategory.OtherCategoryName
            ? formValuesTicketCreation.txtOtherSubCategory.OtherCategoryName
            : "",
        cropStageMasterID:
          formValuesTicketCreation.txtCropStage && formValuesTicketCreation.txtCropStage.CropStageMasterID
            ? formValuesTicketCreation.txtCropStage.CropStageMasterID
            : 0,
        cropStageMaster: formValuesTicketCreation.txtCropStage && formValuesTicketCreation.txtCropStage.CropStageMaster
        ? formValuesTicketCreation.txtCropStage.CropStageMaster
        : "",
        cropLossDetailID: formValuesTicketCreation.txtLossAt && formValuesTicketCreation.txtLossAt.CropLossDetailID
        ? formValuesTicketCreation.txtLossAt.CropLossDetailID
        : 0,
        cropStage: pselectedOptionCropStage,
        ticketHeaderID: pticketHeaderID,
        requestYear:
          formValuesForFarmerInfo.txtYearForFarmerInfo && formValuesForFarmerInfo.txtYearForFarmerInfo.Value
            ? formValuesForFarmerInfo.txtYearForFarmerInfo.Value
            : 0,
        requestSeason:
          formValuesForFarmerInfo.txtSeasonForFarmerInfo && formValuesForFarmerInfo.txtSeasonForFarmerInfo.CropSeasonID
            ? formValuesForFarmerInfo.txtSeasonForFarmerInfo.CropSeasonID
            : 0,
  
        ticketDescription: formValuesTicketCreation.txtTicketDescription,
        lossDate: selectedOption !== "4" ? null : formValuesTicketCreation.txtCropLossDate ? dateToCompanyFormat(formValuesTicketCreation.txtCropLossDate) : "",
        lossTime: selectedOption !== "4" ? null : formValuesTicketCreation.txtCropLossTime ? formValuesTicketCreation.txtCropLossTime : "",
        postHarvestDate:
          selectedOption !== "4" || selectedOptionCropStage !== "2"
            ? null
            : formValuesTicketCreation.txtCropHarvestDate
            ? dateToCompanyFormat(formValuesTicketCreation.txtCropHarvestDate)
            : "",
        ticketSourceID: 6,
        ticketSourceName: "CSC",
        ticketStatusID: pticketStatusID,
        ticketStatus: pticketStatus,
        applicationNo: papplicationNo,
        insuranceCompanyID: 0,
        insuranceCompany: selectedInsuranceDetails ? selectedInsuranceDetails.insuranceCompanyName : "",
        insuranceCompanyCode: 0,
        cropSeasonName:
          formValuesForFarmerInfo.txtSeasonForFarmerInfo && formValuesForFarmerInfo.txtSeasonForFarmerInfo.CropSeasonName
            ? formValuesForFarmerInfo.txtSeasonForFarmerInfo.CropSeasonName
            : "",
        ticketCategoryName:
        formValuesTicketCreation.txtTicketCategoryType && formValuesTicketCreation.txtTicketCategoryType.SupportTicketTypeName
        ? formValuesTicketCreation.txtTicketCategoryType.SupportTicketTypeName
        : "",
        ticketSubCategoryID:  formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
        ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID
        : 0,    
        ticketSubCategoryName: formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryName
        ? formValuesTicketCreation.txtTicketCategory.TicketCategoryName
        : "",
        ticketHeadName: pticketHeaderName,
        nyayPanchayatID: formValuesForByLocation && formValuesForByLocation.txtlevel5ByLocation && formValuesForByLocation.txtlevel5ByLocation.level5ID
        ? formValuesForByLocation.txtlevel5ByLocation.level5ID
        : "0",
        nyayPanchayat: formValuesForByLocation && formValuesForByLocation.txtlevel5ByLocation && formValuesForByLocation.txtlevel5ByLocation.level5Name
        ? formValuesForByLocation.txtlevel5ByLocation.level5Name
        : "",
        gramPanchayatID: formValuesForByLocation && formValuesForByLocation.txtlevel6ByLocation && formValuesForByLocation.txtlevel6ByLocation.level6ID
        ? formValuesForByLocation.txtlevel6ByLocation.level6ID
        : "0",
        gramPanchayat: formValuesForByLocation && formValuesForByLocation.txtlevel6ByLocation && formValuesForByLocation.txtlevel6ByLocation.level6Name
        ? formValuesForByLocation.txtlevel6ByLocation.level6Name
        : "",
        businessRelationName: user && user.UserCompanyType ? user.UserCompanyType : "",
        schemeName:
          formValuesForFarmerInfo.txtSchemeForFarmerInfo && formValuesForFarmerInfo.txtSchemeForFarmerInfo.SchemeName
            ? formValuesForFarmerInfo.txtSchemeForFarmerInfo.SchemeName
            : "",
        agentName: user && user.UserDisplayName ? user.UserDisplayName : "",
        createdBY: user && user.UserDisplayName ? user.UserDisplayName : "",
        createdOn: null,
        farmerName: formValuesGI.txtFarmerName ? formValuesGI.txtFarmerName : "",
        callStatus: formValuesGI.txtCallStatus && formValuesGI.txtCallStatus.Value ? formValuesGI.txtCallStatus.Value : "",
        insurancePolicyNo: pPolicyID,
        insurancePolicyDate: formValues.txtPolicyDate ? dateToCompanyFormat(formValues.txtPolicyDate) : "",
        insuranceExpiryDate: formValues.txtPolicyExpiryDate ? dateToCompanyFormat(formValues.txtPolicyExpiryDate) : "",
        agentUserID: user && user.LoginID ? user.LoginID.toString() : "0",
        bankMasterID: 0,
        schemeID:
          formValuesForFarmerInfo.txtSchemeForFarmerInfo && formValuesForFarmerInfo.txtSchemeForFarmerInfo.SchemeID
            ? formValuesForFarmerInfo.txtSchemeForFarmerInfo.SchemeID
            : 0,
        onTimeIntimationFlag: stateCropLossIntimation,
        hasDocument: 0,
        attachmentPath: "",
        callingMasterID: getCallingMasterID,
        cropName: formValuesTicketCreation.txtCropName ? formValuesTicketCreation.txtCropName : "",
        applicationCropName: selectedInsuranceDetails ? selectedInsuranceDetails.cropName : "",
        area: selectedInsuranceDetails ? selectedInsuranceDetails.policyArea : "",
        villageName: selectedInsuranceDetails ? selectedInsuranceDetails.resVillage : "",
        relation: selectedInsuranceDetails ? selectedInsuranceDetails.relation : "",
        relativeName: selectedInsuranceDetails ? selectedInsuranceDetails.relativeName : "",
        stateMasterName: selectedFarmer && selectedFarmer.stateID ? selectedFarmer.state : selectedFarmer.resState ? selectedFarmer.resState : "",
        districtMasterName: selectedInsuranceDetails ? selectedInsuranceDetails.resDistrict : "",
        subDistrictID: selectedInsuranceDetails ? selectedInsuranceDetails.resSubDistrictID : "",
        subDistrictName: selectedInsuranceDetails ? selectedInsuranceDetails.resSubDistrict : "",
        policyPremium: selectedInsuranceDetails ? selectedInsuranceDetails.policyPremium : "",
        policyArea: selectedInsuranceDetails ? selectedInsuranceDetails.policyArea : "",
        policyType: selectedInsuranceDetails ? selectedInsuranceDetails.policyType : "",
        landSurveyNumber: selectedInsuranceDetails ? selectedInsuranceDetails.landSurveyNumber : "",
        landDivisionNumber: selectedInsuranceDetails ? selectedInsuranceDetails.landDivisionNumber : "",
        plotVillageName: selectedInsuranceDetails ? selectedInsuranceDetails.plotVillageName : "",
        plotDistrictName: selectedInsuranceDetails ? selectedInsuranceDetails.plotDistrictName : "",
        plotStateName: selectedInsuranceDetails ? selectedInsuranceDetails.plotStateName : "",
        plotDistrictRequestorID: selectedInsuranceDetails ? selectedInsuranceDetails.plotDistrictID : "",
        applicationSource: selectedInsuranceDetails ? selectedInsuranceDetails.applicationSource : "",
        cropShare: selectedInsuranceDetails ? selectedInsuranceDetails.cropShare : "",
        iFSCCode: selectedInsuranceDetails ? selectedInsuranceDetails.ifscCode : "",
        farmerShare: selectedInsuranceDetails ? selectedInsuranceDetails.farmerShare : "",
        sowingDate: selectedInsuranceDetails ? selectedInsuranceDetails.sowingDate : "",
      };
      setisBtndisabled(1);
      setBtnLoaderSupportTicketActive(true);
      const result = await addKRPHSupportTicketdata(formData);
      setBtnLoaderSupportTicketActive(false);
      setisBtndisabled(0);
      if (result.response.responseCode === 1) {
        if (result.response && result.response.responseData) {
          let pTicketHeadName = "";
          if (selectedOption === "1") {
            pTicketHeadName = "Grievance";
          } else if (selectedOption === "2") {
            pTicketHeadName = "Information";
          } else if (selectedOption === "4") {
            pTicketHeadName = "Crop Loss Intimation";
          }
          setFarmersTicketSummaryData([]);
          setfetchfarmersummary(selectedFarmer ? selectedFarmer.farmerID : "");
          const pMobileNo = selectedFarmer && selectedFarmer.mobile ? selectedFarmer.mobile : "";
          const pSupportTicketNo = result.response.responseData.SupportTicketNo ? result.response.responseData.SupportTicketNo : "";

          if(selectedValidateOption === "5") {
            setSelectedFarmer(selectedFarmer);
          }
          setgetSupportTicketNo(pSupportTicketNo);
          clearInsuranceFieldsAndTicketCreation();
          setSessionStorage("servicesuccess", "TC");
          setServiceSuccessState("SUCCESS");
          // A navigate("/ServiceSuccess");
          let ptemplateID = "";
          // A if (selectedClaimOrGrievence === "CI") {
          // A  if (selectsetfetchfarmersummaryedOption === "1") {
          // A    ptemplateID = "G";
          // A  } else if (selectedOption === "2") {
          // A    ptemplateID = "I";
          // A  }
          // A} else {
          // A  ptemplateID = "G";
          // A}
          if (selectedOption === "1" || selectedOption === "4") {
            ptemplateID = "G";
          } else if (selectedOption === "2") {
            ptemplateID = "I";
          }
            SendSMSToFarmerAgaintSupportTicket(ptemplateID, pMobileNo, pSupportTicketNo);
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

  const CreateTicketNonRegisteredFarmer = async() => {
    try {
      let pticketStatusID = 0;
      // A let pticketStatusNoneBMCG = 0;
      let pticketStatus = "";
      let pticketHeaderID = 0;
      const pticketHeaderName =
        selectedOption === "1" ? "Grievance" : selectedOption === "2" ? "Information" : selectedOption === "4" ? "Crop Loss Intimation" : "";
  
      if (selectedOption === "1" || selectedOption === "4") {
       // A pticketStatusID = 109019;
        pticketStatusID = 109301;
        pticketStatus = "Open";
        // A pticketStatusNoneBMCG = "109301";
        pticketHeaderID = Number(selectedOption);
      } else if (selectedOption === "2") {
        // A pticketStatusID = 109025;
        pticketStatusID = 109303;
        pticketStatus = "Resolved";
        // A pticketStatusNoneBMCG = "109303";
        pticketHeaderID = Number(selectedOption);
      }
      
      const user = getSessionStorage("user");
      
        let pselectedOptionCropStage = ""  ;  
        if (selectedOption === "4") {
          pselectedOptionCropStage = selectedOptionCropStage === "1" ? "Standing Crop Stage" : selectedOptionCropStage === "2" ? "Harvested Stage" : ""; 
        }  
          
       const formData = {
        subCategoryName:
          formValuesTicketCreation.txtOtherSubCategory && formValuesTicketCreation.txtOtherSubCategory.OtherCategoryName
            ? formValuesTicketCreation.txtOtherSubCategory.OtherCategoryName
            : "",
        callerContactNumber: formValuesGI.txtMobileCallerNumber ? formValuesGI.txtMobileCallerNumber : "",
        supportTicketID: 0,
        ticketRequestorID:  "",
        stateCodeAlpha: formValuesForByNonRegFarmerOrOffline.txtStateForByNonRegFarmerOrOffline && formValuesForByNonRegFarmerOrOffline.txtStateForByNonRegFarmerOrOffline.StateCodeAlpha ? formValuesForByNonRegFarmerOrOffline.txtStateForByNonRegFarmerOrOffline.StateCodeAlpha : "",
        districtRequestorID:
        formValuesForByNonRegFarmerOrOffline.txtStateForByNonRegFarmerOrOffline && formValuesForByNonRegFarmerOrOffline.txtDistrictForByNonRegFarmerOrOffline.level3ID ? formValuesForByNonRegFarmerOrOffline.txtDistrictForByNonRegFarmerOrOffline.level3ID : "",
        villageRequestorID:
        formValuesForByNonRegFarmerOrOffline.txtVillageForByNonRegFarmerOrOffline && formValuesForByNonRegFarmerOrOffline.txtVillageForByNonRegFarmerOrOffline.level7ID ? formValuesForByNonRegFarmerOrOffline.txtVillageForByNonRegFarmerOrOffline.level7ID : "",
        farmerSupportTicketNo: "0",
        requestorName: formValuesForByNonRegFarmerOrOffline.txtFarmerNameForNonRegFarmerOrOffline ? formValuesForByNonRegFarmerOrOffline.txtFarmerNameForNonRegFarmerOrOffline : "",
        requestorMobileNo: formValuesForByNonRegFarmerOrOffline.txtMobileForNonRegFarmerOrOffline ? formValuesForByNonRegFarmerOrOffline.txtMobileForNonRegFarmerOrOffline : "",
        requestorAccountNo: "",
        ticketCategoryID:
        formValuesTicketCreation.txtTicketCategoryType && formValuesTicketCreation.txtTicketCategoryType.SupportTicketTypeID
        ? formValuesTicketCreation.txtTicketCategoryType.SupportTicketTypeID
        : 0,
        // A cropCategoryOthers: formValuesTicketCreation.txtOtherSubCategory ? formValuesTicketCreation.txtOtherSubCategory : "",
        cropCategoryOthers:
          formValuesTicketCreation.txtOtherSubCategory && formValuesTicketCreation.txtOtherSubCategory.OtherCategoryName
            ? formValuesTicketCreation.txtOtherSubCategory.OtherCategoryName
            : "",
        cropStageMasterID:
          formValuesTicketCreation.txtCropStage && formValuesTicketCreation.txtCropStage.CropStageMasterID
            ? formValuesTicketCreation.txtCropStage.CropStageMasterID
            : 0,
        cropStageMaster: formValuesTicketCreation.txtCropStage && formValuesTicketCreation.txtCropStage.CropStageMaster
        ? formValuesTicketCreation.txtCropStage.CropStageMaster
        : "",
        cropLossDetailID: formValuesTicketCreation.txtLossAt && formValuesTicketCreation.txtLossAt.CropLossDetailID
        ? formValuesTicketCreation.txtLossAt.CropLossDetailID
        : 0,
        cropStage: pselectedOptionCropStage,
        ticketHeaderID: pticketHeaderID,
        requestYear:
        formValuesForByNonRegFarmerOrOffline.txtYearForNonRegFarmerOrOffline && formValuesForByNonRegFarmerOrOffline.txtYearForNonRegFarmerOrOffline.Value
            ? formValuesForByNonRegFarmerOrOffline.txtYearForNonRegFarmerOrOffline.Value
            : 0,
        requestSeason:
        formValuesForByNonRegFarmerOrOffline.txtSeasonForNonRegFarmerOrOffline && formValuesForByNonRegFarmerOrOffline.txtSeasonForNonRegFarmerOrOffline.CropSeasonID
            ? formValuesForByNonRegFarmerOrOffline.txtSeasonForNonRegFarmerOrOffline.CropSeasonID
            : 0,
  
        ticketDescription: formValuesTicketCreation.txtTicketDescription,
        lossDate: selectedOption !== "4" ? null : formValuesTicketCreation.txtCropLossDate ? dateToCompanyFormat(formValuesTicketCreation.txtCropLossDate) : "",
        lossTime: selectedOption !== "4" ? null : formValuesTicketCreation.txtCropLossTime ? formValuesTicketCreation.txtCropLossTime : "",
        postHarvestDate:
          selectedOption !== "4" || selectedOptionCropStage !== "2"
            ? null
            : formValuesTicketCreation.txtCropHarvestDate
            ? dateToCompanyFormat(formValuesTicketCreation.txtCropHarvestDate)
            : "",
        ticketSourceID: 6,
        ticketSourceName: "CSC",
        ticketStatusID: pticketStatusID,
        ticketStatus: pticketStatus,
        applicationNo: "",
        insuranceCompanyID: 0,
        insuranceCompany: formValuesForByNonRegFarmerOrOffline.txtCropForCalculate && formValuesForByNonRegFarmerOrOffline.txtCropForCalculate.insuranceCompanyName
        ? formValuesForByNonRegFarmerOrOffline.txtCropForCalculate.insuranceCompanyName
        : "",
        insuranceCompanyCode:  formValuesForByNonRegFarmerOrOffline.txtCropForCalculate && formValuesForByNonRegFarmerOrOffline.txtCropForCalculate.insuranceCompanyCode
        ? Number(formValuesForByNonRegFarmerOrOffline.txtCropForCalculate.insuranceCompanyCode)
        : 0,
        cropSeasonName:
        formValuesForByNonRegFarmerOrOffline.txtSeasonForNonRegFarmerOrOffline && formValuesForByNonRegFarmerOrOffline.txtSeasonForNonRegFarmerOrOffline.CropSeasonName
            ? formValuesForByNonRegFarmerOrOffline.txtSeasonForNonRegFarmerOrOffline.CropSeasonName
            : "",
        ticketCategoryName:
        formValuesTicketCreation.txtTicketCategoryType && formValuesTicketCreation.txtTicketCategoryType.SupportTicketTypeName
        ? formValuesTicketCreation.txtTicketCategoryType.SupportTicketTypeName
        : "",
        ticketSubCategoryID:  formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
        ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID
        : 0,    
        ticketSubCategoryName: formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryName
        ? formValuesTicketCreation.txtTicketCategory.TicketCategoryName
        : "",
        ticketHeadName: pticketHeaderName,
        nyayPanchayatID: formValuesForByNonRegFarmerOrOffline && formValuesForByNonRegFarmerOrOffline.txtlevel5ByNonRegFarmerOrOffline && formValuesForByNonRegFarmerOrOffline.txtlevel5ByNonRegFarmerOrOffline.level5ID
        ? formValuesForByNonRegFarmerOrOffline.txtlevel5ByNonRegFarmerOrOffline.level5ID
        : "",
        nyayPanchayat: formValuesForByNonRegFarmerOrOffline && formValuesForByNonRegFarmerOrOffline.txtlevel5ByNonRegFarmerOrOffline && formValuesForByNonRegFarmerOrOffline.txtlevel5ByNonRegFarmerOrOffline.level5Name
        ? formValuesForByNonRegFarmerOrOffline.txtlevel5ByNonRegFarmerOrOffline.level5Name
        : "",
        gramPanchayatID: formValuesForByNonRegFarmerOrOffline && formValuesForByNonRegFarmerOrOffline.txtlevel6ByNonRegFarmerOrOffline && formValuesForByNonRegFarmerOrOffline.txtlevel6ByNonRegFarmerOrOffline.level6ID
        ? formValuesForByNonRegFarmerOrOffline.txtlevel6ByNonRegFarmerOrOffline.level6ID
        : "",
        gramPanchayat: formValuesForByNonRegFarmerOrOffline && formValuesForByNonRegFarmerOrOffline.txtlevel6ByNonRegFarmerOrOffline && formValuesForByNonRegFarmerOrOffline.txtlevel6ByNonRegFarmerOrOffline.level6Name
        ? formValuesForByNonRegFarmerOrOffline.txtlevel6ByNonRegFarmerOrOffline.level6Name
        : "",
        businessRelationName: user && user.UserCompanyType ? user.UserCompanyType : "",
        schemeName:
        formValuesForByNonRegFarmerOrOffline.txtSchemeForNonRegFarmerOrOffline && formValuesForByNonRegFarmerOrOffline.txtSchemeForNonRegFarmerOrOffline.SchemeName
            ? formValuesForByNonRegFarmerOrOffline.txtSchemeForNonRegFarmerOrOffline.SchemeName
            : "",
        agentName: user && user.UserDisplayName ? user.UserDisplayName : "",
        createdBY: user && user.UserDisplayName ? user.UserDisplayName : "",
        createdOn: null,
        farmerName: formValuesForByNonRegFarmerOrOffline.txtFarmerNameForNonRegFarmerOrOffline ? formValuesForByNonRegFarmerOrOffline.txtFarmerNameForNonRegFarmerOrOffline : "",
        callStatus: formValuesGI.txtCallStatus && formValuesGI.txtCallStatus.Value ? formValuesGI.txtCallStatus.Value : "",
        insurancePolicyNo: "",
        agentUserID: user && user.LoginID ? user.LoginID.toString() : "0",
        bankMasterID: 0,
        schemeID:
        formValuesForByNonRegFarmerOrOffline.txtSchemeForNonRegFarmerOrOffline && formValuesForByNonRegFarmerOrOffline.txtSchemeForNonRegFarmerOrOffline.SchemeID
            ? formValuesForByNonRegFarmerOrOffline.txtSchemeForNonRegFarmerOrOffline.SchemeID
            : 0,
        onTimeIntimationFlag: stateCropLossIntimation,
        hasDocument: 0,
        attachmentPath: "",
        pinCode: formValuesForByNonRegFarmerOrOffline.txtPinCode ? formValuesForByNonRegFarmerOrOffline.txtPinCode : "",
	      address: formValuesForByNonRegFarmerOrOffline.txtAddress ? formValuesForByNonRegFarmerOrOffline.txtAddress : "",
        callingMasterID: getCallingMasterID,
        cropName: formValuesTicketCreation.txtCropName ? formValuesTicketCreation.txtCropName : "",
        applicationCropName:  formValuesForByNonRegFarmerOrOffline.txtCropForCalculate && formValuesForByNonRegFarmerOrOffline.txtCropForCalculate.cropName
        ? formValuesForByNonRegFarmerOrOffline.txtCropForCalculate.cropName
        : "",
        cropID: formValuesForByNonRegFarmerOrOffline.txtCropForCalculate && formValuesForByNonRegFarmerOrOffline.txtCropForCalculate.cropID
        ? formValuesForByNonRegFarmerOrOffline.txtCropForCalculate.cropID
        : "",
        area:  formValuesForByNonRegFarmerOrOffline.txtAreaInHectareForCalculator ? Number(formValuesForByNonRegFarmerOrOffline.txtAreaInHectareForCalculator) : "0",
        calculatedPremium: formValuesForByNonRegFarmerOrOffline.CalculatedSumInsured ? Number(formValuesForByNonRegFarmerOrOffline.CalculatedSumInsured) : "0",
        villageName: formValuesForByNonRegFarmerOrOffline.txtVillageForByNonRegFarmerOrOffline && formValuesForByNonRegFarmerOrOffline.txtVillageForByNonRegFarmerOrOffline.level7Name ? formValuesForByNonRegFarmerOrOffline.txtVillageForByNonRegFarmerOrOffline.level7Name : "",
        relation:  "",
        relativeName: "",
        stateMasterName:  formValuesForByNonRegFarmerOrOffline.txtStateForByNonRegFarmerOrOffline && formValuesForByNonRegFarmerOrOffline.txtStateForByNonRegFarmerOrOffline.StateMasterName ? formValuesForByNonRegFarmerOrOffline.txtStateForByNonRegFarmerOrOffline.StateMasterName : "",
        districtMasterName: formValuesForByNonRegFarmerOrOffline.txtDistrictForByNonRegFarmerOrOffline && formValuesForByNonRegFarmerOrOffline.txtDistrictForByNonRegFarmerOrOffline.level3Name ? formValuesForByNonRegFarmerOrOffline.txtDistrictForByNonRegFarmerOrOffline.level3Name : "",
        subDistrictID: formValuesForByNonRegFarmerOrOffline.txtSubDistrictForByNonRegFarmerOrOffline && formValuesForByNonRegFarmerOrOffline.txtSubDistrictForByNonRegFarmerOrOffline.level4ID ? formValuesForByNonRegFarmerOrOffline.txtSubDistrictForByNonRegFarmerOrOffline.level4ID : "",
        subDistrictName: formValuesForByNonRegFarmerOrOffline.txtSubDistrictForByNonRegFarmerOrOffline && formValuesForByNonRegFarmerOrOffline.txtSubDistrictForByNonRegFarmerOrOffline.level4Name ? formValuesForByNonRegFarmerOrOffline.txtSubDistrictForByNonRegFarmerOrOffline.level4Name : "",
        policyPremium:  "0",
        policyArea:  "0",
        policyType: "",
        landSurveyNumber:  "",
        landDivisionNumber: "",
        plotVillageName:  formValuesForByNonRegFarmerOrOffline.txtVillageForByNonRegFarmerOrOffline && formValuesForByNonRegFarmerOrOffline.txtVillageForByNonRegFarmerOrOffline.level7Name ? formValuesForByNonRegFarmerOrOffline.txtVillageForByNonRegFarmerOrOffline.level7Name : "",
        plotDistrictName:   formValuesForByNonRegFarmerOrOffline.txtDistrictForByNonRegFarmerOrOffline && formValuesForByNonRegFarmerOrOffline.txtDistrictForByNonRegFarmerOrOffline.level3Name ? formValuesForByNonRegFarmerOrOffline.txtDistrictForByNonRegFarmerOrOffline.level3Name : "",
        plotStateName:  formValuesForByNonRegFarmerOrOffline.txtStateForByNonRegFarmerOrOffline && formValuesForByNonRegFarmerOrOffline.txtStateForByNonRegFarmerOrOffline.StateMasterName ? formValuesForByNonRegFarmerOrOffline.txtStateForByNonRegFarmerOrOffline.StateMasterName : "",
        applicationSource:  "",
        cropShare: "",
        iFSCCode:  "",
        farmerShare:  "",
        sowingDate:  "",
      };
      setisBtndisabled(1);
      setBtnLoaderSupportTicketActive(true);
      const result = await addKRPHFarmerSupportTicketData(formData);
      setBtnLoaderSupportTicketActive(false);
      setisBtndisabled(0);
      if (result.response.responseCode === 1) {
        if (result.response && result.response.responseData) {
          const pSupportTicketNo = result.response.responseData.SupportTicketNo ? result.response.responseData.SupportTicketNo : "";
          setgetSupportTicketNo(pSupportTicketNo);
          setNonRegisteredFarmerDetails([{SupportTicketID : result.response.responseData.SupportTicketID ,SupportTicketNo: result.response.responseData.SupportTicketNo }]);
          clearFormForNonRegisteredFarmer();
          setSessionStorage("servicesuccess", "TC");
          setServiceSuccessState("SUCCESS");
          // A navigate("/ServiceSuccess");
          
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

  const [formValues, setFormValues] = useState({
    txtState: null,
    txtDistrict: null,
    txtBankName: null,
    txtBranchName: null,
    txtAccountNumber: "",
  });

  const [lableTalukAnything, setlableTalukAnything] = useState("SubDistrict");
  const [lableVillageForByLocation, setlableVillageForByLocation] = useState("Village");
  const [lablelevel5, setlablelevel5] = useState("NyayPanchayat");
  const [lablelevel6, setlablelevel6] = useState("GramPanchayat");

  const [formValuesForByLocation, setFormValuesForByLocation] = useState({
    txtStateForByLocation: null,
    txtDistrictForByLocation: null,
    txtSubDistrictForByLocation: null,
    txtVillageForByLocation: null,
    txtYearForLocation: null,
    txtSeasonForLocation: null,
    txtSchemeForLocation: null,
    txtlevel5ByLocation: null,
    txtlevel6ByLocation: null,
  });

  const [lableTalukAnythingNonRegFarmerOrOffline, setlableTalukAnythingNonRegFarmerOrOffline] = useState("SubDistrict");
  const [lableVillageForByNonRegFarmerOrOffline, setlableVillageForByNonRegFarmerOrOffline] = useState("Village");
  const [lablelevel5NonRegFarmerOrOffline, setlablelevel5NonRegFarmerOrOffline] = useState("NyayPanchayat");
  const [lablelevel6NonRegFarmerOrOffline, setlablelevel6NonRegFarmerOrOffline] = useState("GramPanchayat");

  const [formValuesForByNonRegFarmerOrOffline, setFormValuesForByNonRegFarmerOrOffline] = useState({
    txtMobileForNonRegFarmerOrOffline: "",
    txtFarmerNameForNonRegFarmerOrOffline:"",
    txtStateForByNonRegFarmerOrOffline: null,
    txtDistrictForByNonRegFarmerOrOffline: null,
    txtSubDistrictForByNonRegFarmerOrOffline: null,
    txtVillageForByNonRegFarmerOrOffline: null,
    txtYearForNonRegFarmerOrOffline: null,
    txtSeasonForNonRegFarmerOrOffline: null,
    txtSchemeForNonRegFarmerOrOffline: null,
    txtlevel5ByNonRegFarmerOrOffline: null,
    txtlevel6ByNonRegFarmerOrOffline: null,
    txtAddress: "",
    txtPinCode: "",
    txtAreaInHectareForCalculator: "",
    CalculatedSumInsured: "",
  });

  const [stateForByNonRegFarmerOrOfflineDropdownDataList, setStateForByNonRegFarmerOrOfflineDropdownDataList] = useState([]);
  const [isLoadingStateForByNonRegFarmerOrOfflineDropdownDataList, setIsLoadingStateForByNonRegFarmerOrOfflineDropdownDataList] = useState(false);
  const getStateForByNonRegFarmerOrOfflineListData = async () => {
    try {
      setIsLoadingStateForByNonRegFarmerOrOfflineDropdownDataList(true);
      const user = getSessionStorage("user");
      const formdata = {
        level: 1,
        filterID: "0",
        userID: user && user.LoginID ? user.LoginID : 0,
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getLocationMasterDataBindingDataList(formdata);
      console.log(result, "State Data");
      setIsLoadingStateForByNonRegFarmerOrOfflineDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (
          result.response.responseData &&
          result.response.responseData.locationmasterdatabinding &&
          result.response.responseData.locationmasterdatabinding.length > 0
        ) {
          setStateForByNonRegFarmerOrOfflineDropdownDataList(result.response.responseData.locationmasterdatabinding);
        } else {
          setStateForByNonRegFarmerOrOfflineDropdownDataList([]);
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

  const [districtForByNonRegFarmerOrOfflineDropdownDataList, setDistrictForByNonRegFarmerOrOfflineDropdownDataList] = useState([]);
  const [isLoadingDistrictForByNonRegFarmerOrOfflineDropdownDataList, setIsLoadingDistrictForByNonRegFarmerOrOfflineDropdownDataList] = useState(false);
  const getDistrictByStateForByNonRegFarmerOrOfflineListData = async (pstateAlphaCode) => {
    try {
      setIsLoadingDistrictForByNonRegFarmerOrOfflineDropdownDataList(true);
      const formdata = {
        level2: pstateAlphaCode,
      };

      const result = await getLevel3Data(formdata);
      console.log(result, "District Data");
      setIsLoadingDistrictForByNonRegFarmerOrOfflineDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (Object.keys(result.response.responseData.data).length === 0) {
          setDistrictForByNonRegFarmerOrOfflineDropdownDataList([]);
        } else {
          setDistrictForByNonRegFarmerOrOfflineDropdownDataList(result.response.responseData.data.hierarchy.level3);
        }
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };
  const [subDistrictForByNonRegFarmerOrOfflineDropdownDataList, setSubDistrictForByNonRegFarmerOrOfflineDropdownDataList] = useState([]);
  const [isLoadingSubDistrictForByNonRegFarmerOrOfflineDropdownDataList, setIsLoadingSubDistrictForByNonRegFarmerOrOfflineDropdownDataList] = useState(false);
  const getSubDistrictByStateANDDistrictNonRegFarmerOrOfflineListData = async (plevel3ID) => {
    try {
      setIsLoadingSubDistrictForByNonRegFarmerOrOfflineDropdownDataList(true);
      const formdata = {
        level3: plevel3ID,
      };
      const result = await getLevel4Data(formdata);
      console.log(result, "SubDistrict Data");

      setIsLoadingSubDistrictForByNonRegFarmerOrOfflineDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          if (Object.keys(result.response.responseData.data).length === 0) {
            setSubDistrictForByNonRegFarmerOrOfflineDropdownDataList([]);
          } else {
            setSubDistrictForByNonRegFarmerOrOfflineDropdownDataList(result.response.responseData.data.hierarchy.level4);
          }
        } else {
          setSubDistrictForByNonRegFarmerOrOfflineDropdownDataList([]);
        }
      } else {
        setSubDistrictForByNonRegFarmerOrOfflineDropdownDataList([]);
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

  const getNonRegFarmerOrOfflineHierarchyListData = async (pStateAlphaCode, pStateMasterID, pSeason, pYear, pScheme) => {
    try {
      const pschemeID =
        pScheme === ""
          ? formValuesForByNonRegFarmerOrOffline.txtSchemeForNonRegFarmerOrOffline.SchemeID === 2
            ? "02"
            : formValuesForByNonRegFarmerOrOffline.txtSchemeForNonRegFarmerOrOffline.SchemeID === 4
            ? "04"
            : ""
          : pScheme;
      const pseasonID =
        pSeason === ""
          ? formValuesForByNonRegFarmerOrOffline.txtSeasonForNonRegFarmerOrOffline.CropSeasonID === 1
            ? "01"
            : formValuesForByNonRegFarmerOrOffline.txtSeasonForNonRegFarmerOrOffline.CropSeasonID === 2
            ? "02"
            : ""
          : pSeason;
      const pstateID = pStateMasterID.toString().length < 2 ? `0${pStateMasterID}` : pStateMasterID;
      const pyearID =
        pYear === ""
          ? formValuesForByNonRegFarmerOrOffline.txtYearForNonRegFarmerOrOffline.Value.toString().substr(
              formValuesForByNonRegFarmerOrOffline.txtYearForNonRegFarmerOrOffline.Value.length - 2,
            )
          : pYear;
      const psssyID = `${pschemeID}${pseasonID}${pstateID}${pyearID}`;

      const formdata = {
        sssyID: psssyID,
      };
      const result = await getLocationHierarchyData(formdata);

      if (result.response.responseCode === 1) {
        if (Object.keys(result.response.responseData.data).length === 0) {
          setlableTalukAnythingNonRegFarmerOrOffline("SubDistrict");
          setlablelevel5NonRegFarmerOrOffline("NyayPanchayat");
          setlablelevel6NonRegFarmerOrOffline("GramPanchayat");
          setlableVillageForByNonRegFarmerOrOffline("Village");
        } else {
          setlableTalukAnythingNonRegFarmerOrOffline(result.response.responseData.data[0].level4 ? result.response.responseData.data[0].level4 : null);
          setlablelevel5NonRegFarmerOrOffline(result.response.responseData.data[0].level5 ? result.response.responseData.data[0].level5 : null);
          setlablelevel6NonRegFarmerOrOffline(result.response.responseData.data[0].level6 ? result.response.responseData.data[0].level6 : null);
          setlableVillageForByNonRegFarmerOrOffline("Village");
          getDistrictByStateForByNonRegFarmerOrOfflineListData(pStateAlphaCode);
        }
      } else {
        setlableTalukAnythingNonRegFarmerOrOffline("SubDistrict");
        setlablelevel5NonRegFarmerOrOffline("NyayPanchayat");
        setlablelevel6NonRegFarmerOrOffline("GramPanchayat");
        setlableVillageForByNonRegFarmerOrOffline("Village");
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

  const [level5ByNonRegFarmerOrOfflineDropdownDataList, setlevel5ByNonRegFarmerOrOfflineDropdownDataList] = useState([]);
  const [isLoadinglevel5ByNonRegFarmerOrOfflineDropdownDataList, setIsLoadinglevel5ByNonRegFarmerOrOfflineDropdownDataList] = useState(false);
  const getlevel5NonRegFarmerOrOfflineListData = async (psubDistrictAlphaCode, pdistrictAlphaCode) => {
    try {
      setIsLoadinglevel5ByNonRegFarmerOrOfflineDropdownDataList(true);
      const formdata = {
        districtAlphaCode: pdistrictAlphaCode,
        subDistrictAlphaCode: psubDistrictAlphaCode,
      };
      const result = await getLevel5Data(formdata);
      setIsLoadinglevel5ByNonRegFarmerOrOfflineDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (Object.keys(result.response.responseData.data).length === 0) {
          setlevel5ByNonRegFarmerOrOfflineDropdownDataList([]);
        } else {
          setlevel5ByNonRegFarmerOrOfflineDropdownDataList(result.response.responseData.data.hierarchy.level5);
        }
      } else {
        setlevel5ByNonRegFarmerOrOfflineDropdownDataList([]);
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

  const [level6ByNonRegFarmerOrOfflineDropdownDataList, setlevel6ByNonRegFarmerOrOfflineDropdownDataList] = useState([]);
  const [isLoadinglevel6ByNonRegFarmerOrOfflineDropdownDataList, setIsLoadinglevel6ByNonRegFarmerOrOfflineDropdownDataList] = useState(false);
  const getlevel6NonRegFarmerOrOfflineListData = async (plevel3, plevel4, plevel5) => {
    try {
      setIsLoadinglevel6ByNonRegFarmerOrOfflineDropdownDataList(true);
      const formdata = {
        level3: plevel3,
        level4: plevel4,
        level5: plevel5,
      };
      const result = await getLevel6Data(formdata);
      setIsLoadinglevel6ByNonRegFarmerOrOfflineDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (Object.keys(result.response.responseData.data).length === 0) {
          setlevel6ByNonRegFarmerOrOfflineDropdownDataList([]);
        } else {
          setlevel6ByNonRegFarmerOrOfflineDropdownDataList(result.response.responseData.data.hierarchy.level6);
        }
      } else {
        setlevel6ByNonRegFarmerOrOfflineDropdownDataList([]);
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

  const [villageForByNonRegFarmerOrOfflineDropdownDataList, setVillageForByNonRegFarmerOrOfflineDropdownDataList] = useState([]);
  const [isLoadingVillageForByNonRegFarmerOrOfflineDropdownDataList, setIsLoadingVillageForByNonRegFarmerOrOfflineDropdownDataList] = useState(false);
  const getlevel7NonRegFarmerOrOfflineListData = async (plevel3, plevel4, plevel5, plevel6) => {
    try {
      setIsLoadingVillageForByNonRegFarmerOrOfflineDropdownDataList(true);
      const formdata = {
        level3: plevel3,
        level4: plevel4,
        level5: plevel5,
        level6: plevel6,
      };
      const result = await getLevel7Data(formdata);
      setIsLoadingVillageForByNonRegFarmerOrOfflineDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (Object.keys(result.response.responseData.data).length === 0) {
          setVillageForByNonRegFarmerOrOfflineDropdownDataList([]);
        } else {
          setVillageForByNonRegFarmerOrOfflineDropdownDataList(result.response.responseData.data.hierarchy.level7);
        }
      } else {
        setVillageForByNonRegFarmerOrOfflineDropdownDataList([]);
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
  const [isInsuranceCompanyNull, setIsInsuranceCompanyNull] = useState("YES");

  const [cropForNonRegFarmerOrOfflineDropdownDataList, setCropForNonRegFarmerOrOfflineDropdownDataList] = useState([]);
  const [isLoadingCropForNonRegFarmerOrOfflineDropdownDataList, setIsLoadingCropForNonRegFarmerOrOfflineDropdownDataList] = useState(false);
  const getCropDataByDistrictData = async (pDistrictID) => {
    try {
      let result = "";
      let formData = "";

      const user = getSessionStorage("user");

      const pschemeID =
        formValuesForByNonRegFarmerOrOffline.txtSchemeForNonRegFarmerOrOffline &&
        formValuesForByNonRegFarmerOrOffline.txtSchemeForNonRegFarmerOrOffline.SchemeID === 2
          ? "02"
          : formValuesForByNonRegFarmerOrOffline.txtSchemeForNonRegFarmerOrOffline.SchemeID === 4
          ? "04"
          : "";
      const pseasonID =
        formValuesForByNonRegFarmerOrOffline.txtSeasonForNonRegFarmerOrOffline &&
        formValuesForByNonRegFarmerOrOffline.txtSeasonForNonRegFarmerOrOffline.CropSeasonID === 1
          ? "01"
          : formValuesForByNonRegFarmerOrOffline.txtSeasonForNonRegFarmerOrOffline.CropSeasonID === 2
          ? "02"
          : "";
      const pstateID =
        formValuesForByNonRegFarmerOrOffline.txtStateForByNonRegFarmerOrOffline &&
        formValuesForByNonRegFarmerOrOffline.txtStateForByNonRegFarmerOrOffline.StateMasterID.toString().length < 2
          ? `0${formValuesForByNonRegFarmerOrOffline.txtStateForByNonRegFarmerOrOffline.StateMasterID}`
          : formValuesForByNonRegFarmerOrOffline.txtStateForByNonRegFarmerOrOffline.StateMasterID;
      const pyearID =
        formValuesForByNonRegFarmerOrOffline.txtYearForNonRegFarmerOrOffline &&
        formValuesForByNonRegFarmerOrOffline.txtYearForNonRegFarmerOrOffline.Value.toString().substr(
          formValuesForByNonRegFarmerOrOffline.txtYearForNonRegFarmerOrOffline.Value.length - 2,
        );
      const psssyID = `${pschemeID}${pseasonID}${pstateID}${pyearID}`;

      formData = {
        disctrictID: pDistrictID,
        sssyID: psssyID,
        mobilenumber: user && user.UserMobileNumber ? user.UserMobileNumber : "7906071897",
      };
      setIsLoadingCropForNonRegFarmerOrOfflineDropdownDataList(true);
      result = await getCropListDistrictWiseDataList(formData);
      setIsLoadingCropForNonRegFarmerOrOfflineDropdownDataList(false);
      console.log(result, "result");
      setCropForNonRegFarmerOrOfflineDropdownDataList([]);
      if (result.response.responseCode === 1) {
        if (result.response.responseData.length > 0) {
          setCropForNonRegFarmerOrOfflineDropdownDataList(result.response.responseData);
        }
      }
    } catch (error) {
      // A console.log(error);
      // A setAlertMessage({
      // A  type: "error",
      // A  message: "Something went Wrong! Error Code : 442",
      // A });
    }
  };

  const getCalculatorDataOnClick = (value,pCropForCalculate) => {
    debugger;
    if (value || typeof value !== "undefined") {
      if (formValuesForByNonRegFarmerOrOffline.txtCropForCalculate && formValuesForByNonRegFarmerOrOffline.txtCropForCalculate.sumInsured) {
        const calculatedSumInsured =
          parseFloat(value) * parseFloat(formValuesForByNonRegFarmerOrOffline.txtCropForCalculate.sumInsured);
        const actualRate =
          parseFloat(formValuesForByNonRegFarmerOrOffline.txtCropForCalculate.goiShare) + parseFloat(formValuesForByNonRegFarmerOrOffline.txtCropForCalculate.stateShare);
        const acturialRate =
          parseFloat(formValuesForByNonRegFarmerOrOffline.txtCropForCalculate.farmerShare) +
          parseFloat(formValuesForByNonRegFarmerOrOffline.txtCropForCalculate.goiShare) +
          parseFloat(formValuesForByNonRegFarmerOrOffline.txtCropForCalculate.stateShare);
        const preminumpaidbyfarmer = (parseFloat(calculatedSumInsured) * parseFloat(formValuesForByNonRegFarmerOrOffline.txtCropForCalculate.farmerShare)) / 100;
        const preminumpaidbygovt = (parseFloat(calculatedSumInsured) * parseFloat(actualRate)) / 100;
        setFormValuesForByNonRegFarmerOrOffline({
          ...formValuesForByNonRegFarmerOrOffline,
          CalculatedSumInsured: calculatedSumInsured,
          txtCropForCalculate: pCropForCalculate,
          txtAreaInHectareForCalculator: value,
          
        });
        console.log({
          CalculatedSumInsured: calculatedSumInsured,
          ActurialRate: acturialRate,
          Preminumpaidbyfarmer: preminumpaidbyfarmer,
          Preminumpaidbygovt: preminumpaidbygovt,
          AreaInhectare: value,
        });

        // A setTimeout(() => executeScroll(), 0);
      } else {
        setAlertMessage({
          type: "error",
          message: "Select Crop Season Name .",
        });
      }
    }
  };

  const validateFarmersFieldForNonRegFarmerOrOffline = (name, value) => {
    let errorsMsg = "";
    const regex = new RegExp("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$");


    if (selectedValidateOption === "6") {
      if (name === "txtMobileForNonRegFarmerOrOffline") {
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
      if (name === "txtFarmerNameForNonRegFarmerOrOffline") {
        if (!value || typeof value === "undefined") {
          errorsMsg = "Farmer Name is required!";
        }
      }
      if (name === "txtStateForByNonRegFarmerOrOffline") {
        if (!value || typeof value === "undefined") {
          errorsMsg = "State is required!";
        }
      }
      if (name === "txtDistrictForByNonRegFarmerOrOffline") {
        if (!value || typeof value === "undefined") {
          errorsMsg = "District is required!";
        }
      }
      if (name === "txtSubDistrictForByNonRegFarmerOrOffline") {
        if (!value || typeof value === "undefined") {
          errorsMsg = `${lableTalukAnythingNonRegFarmerOrOffline} is required`;
        }
      }
      if (name === "txtlevel5ByNonRegFarmerOrOffline") {
        if (!value || typeof value === "undefined") {
          errorsMsg = `${lablelevel5NonRegFarmerOrOffline} is required`;
        }
      }
      if (name === "txtlevel6ByNonRegFarmerOrOffline") {
        if (!value || typeof value === "undefined") {
          errorsMsg = `${lablelevel6NonRegFarmerOrOffline} is required`;
        }
      }
      if (name === "txtVillageForByNonRegFarmerOrOffline") {
        if (!value || typeof value === "undefined") {
          errorsMsg = "Village is required!";
        }
      }
      if (name === "txtSeasonForNonRegFarmerOrOffline") {
        if (!value || typeof value === "undefined") {
          errorsMsg = "Season is required!";
        }
      }
      if (name === "txtYearForNonRegFarmerOrOffline") {
        if (!value || typeof value === "undefined") {
          errorsMsg = "Year is required!";
        }
      }
      if (name === "txtSchemeForNonRegFarmerOrOffline") {
        if (!value || typeof value === "undefined") {
          errorsMsg = "Scheme is required!";
        }
      }
      if (name === "txtAreaInHectareForCalculator") {
        if (!value || typeof value === "undefined") {
          errorsMsg = "Area is required!";
        } else if (value) {
          const regex = new RegExp("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$");
          if (!regex.test(value)) {
            errorsMsg = "Area should be numeric!";
          }
        }
      }
    }

    return errorsMsg;
  };

  const handleFarmersValidationForNonRegFarmerOrOffline = () => {
    try {
      const errors = {};
      let formIsValid = true;

      errors["txtMobileForNonRegFarmerOrOffline"] = validateFarmersFieldForNonRegFarmerOrOffline("txtMobileForNonRegFarmerOrOffline", formValuesForByNonRegFarmerOrOffline.txtMobileForNonRegFarmerOrOffline);
      errors["txtFarmerNameForNonRegFarmerOrOffline"] = validateFarmersFieldForNonRegFarmerOrOffline("txtFarmerNameForNonRegFarmerOrOffline", formValuesForByNonRegFarmerOrOffline.txtFarmerNameForNonRegFarmerOrOffline);
      errors["txtStateForByNonRegFarmerOrOffline"] = validateFarmersFieldForNonRegFarmerOrOffline("txtStateForByNonRegFarmerOrOffline", formValuesForByNonRegFarmerOrOffline.txtStateForByNonRegFarmerOrOffline);
      errors["txtDistrictForByNonRegFarmerOrOffline"] = validateFarmersFieldForNonRegFarmerOrOffline("txtDistrictForByNonRegFarmerOrOffline", formValuesForByNonRegFarmerOrOffline.txtDistrictForByNonRegFarmerOrOffline);
     
      errors["txtSubDistrictForByNonRegFarmerOrOffline"] = validateFarmersFieldForNonRegFarmerOrOffline("txtSubDistrictForByNonRegFarmerOrOffline", formValuesForByNonRegFarmerOrOffline. txtSubDistrictForByNonRegFarmerOrOffline);
      errors["txtlevel5ByNonRegFarmerOrOffline"] = validateFarmersFieldForNonRegFarmerOrOffline("txtlevel5ByNonRegFarmerOrOffline", formValuesForByNonRegFarmerOrOffline.txtlevel5ByNonRegFarmerOrOffline);
      if (lablelevel6NonRegFarmerOrOffline !== null) {
        errors["txtlevel6ByNonRegFarmerOrOffline"] = validateFarmersFieldForNonRegFarmerOrOffline("txtlevel6ByNonRegFarmerOrOffline", formValuesForByNonRegFarmerOrOffline.txtlevel6ByNonRegFarmerOrOffline);
      }
      errors["txtVillageForByNonRegFarmerOrOffline"] = validateFarmersFieldForNonRegFarmerOrOffline("txtVillageForByNonRegFarmerOrOffline", formValuesForByNonRegFarmerOrOffline.txtVillageForByNonRegFarmerOrOffline);
      errors["txtYearForNonRegFarmerOrOffline"] = validateFarmersFieldForNonRegFarmerOrOffline("txtYearForNonRegFarmerOrOffline", formValuesForByNonRegFarmerOrOffline.txtYearForNonRegFarmerOrOffline);
      errors["txtSeasonForNonRegFarmerOrOffline"] = validateFarmersFieldForNonRegFarmerOrOffline("txtSeasonForNonRegFarmerOrOffline", formValuesForByNonRegFarmerOrOffline.txtSeasonForNonRegFarmerOrOffline);
      errors["txtSchemeForNonRegFarmerOrOffline"] = validateFarmersFieldForNonRegFarmerOrOffline("txtSchemeForNonRegFarmerOrOffline", formValuesForByNonRegFarmerOrOffline.txtSchemeForNonRegFarmerOrOffline);
      if (Object.values(errors).join("").toString()) {
        formIsValid = false;
      }
      setformValidationFarmersErrorForNonRegFarmerOrOffline(errors);
      return formIsValid;
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: "Something Went Wrong",
      });
      return false;
    }
  };

  const [formValidationFarmersErrorForNonRegFarmerOrOffline, setformValidationFarmersErrorForNonRegFarmerOrOffline] = useState({});
  const updateStateForByNonRegFarmerOrOffline = (name, value) => {
    debugger;
    setFormValuesForByNonRegFarmerOrOffline({ ...formValuesForByNonRegFarmerOrOffline, [name]: value });
    formValidationFarmersErrorForNonRegFarmerOrOffline[name] = validateFarmersFieldForNonRegFarmerOrOffline(name, value);
    
    if (name === "txtSeasonForNonRegFarmerOrOffline") {
      setFormValuesForByNonRegFarmerOrOffline({
        ...formValuesForByNonRegFarmerOrOffline,
        txtSeasonForNonRegFarmerOrOffline: value,
        txtDistrictForByNonRegFarmerOrOffline: null,
        txtSubDistrictForByNonRegFarmerOrOffline: null,
        txtlevel5ByNonRegFarmerOrOffline: null,
        txtlevel6ByNonRegFarmerOrOffline: null,
        txtVillageForByNonRegFarmerOrOffline: null,
      });
      setDistrictForByNonRegFarmerOrOfflineDropdownDataList([]);
      setSubDistrictForByNonRegFarmerOrOfflineDropdownDataList([]);
      setlevel5ByNonRegFarmerOrOfflineDropdownDataList([]);
      setlevel6ByNonRegFarmerOrOfflineDropdownDataList([]);
      setVillageForByNonRegFarmerOrOfflineDropdownDataList([]);
      setlableTalukAnythingNonRegFarmerOrOffline("SubDistrict");
      setlablelevel5NonRegFarmerOrOffline("NyayPanchayat");
      setlablelevel6NonRegFarmerOrOffline("GramPanchayat");
      setlableVillageForByNonRegFarmerOrOffline("Village");
      if (value) {
        const pSeasonVal = value.CropSeasonID === 1 ? "01" : value.CropSeasonID === 2 ? "02" : "";
        if (
          formValuesForByNonRegFarmerOrOffline.txtYearForNonRegFarmerOrOffline !== null && formValuesForByNonRegFarmerOrOffline.txtYearForNonRegFarmerOrOffline !== undefined &&
          formValuesForByNonRegFarmerOrOffline.txtSchemeForNonRegFarmerOrOffline !== null && formValuesForByNonRegFarmerOrOffline.txtSchemeForNonRegFarmerOrOffline !== undefined &&
          formValuesForByNonRegFarmerOrOffline.txtStateForByNonRegFarmerOrOffline !== null && formValuesForByNonRegFarmerOrOffline.txtStateForByNonRegFarmerOrOffline !== undefined
        ) {
          getNonRegFarmerOrOfflineHierarchyListData(
            formValuesForByNonRegFarmerOrOffline.txtStateForByNonRegFarmerOrOffline.StateCodeAlpha,
            formValuesForByNonRegFarmerOrOffline.txtStateForByNonRegFarmerOrOffline.StateMasterID,
            pSeasonVal,
            "",
            "",
          );
        }
      }
    }
    if (name === "txtYearForNonRegFarmerOrOffline") {
      setFormValuesForByNonRegFarmerOrOffline({
        ...formValuesForByNonRegFarmerOrOffline,
        txtYearForNonRegFarmerOrOffline: value,
        txtDistrictForByNonRegFarmerOrOffline: null,
        txtSubDistrictForByNonRegFarmerOrOffline: null,
        txtlevel5ByNonRegFarmerOrOffline: null,
        txtlevel6ByNonRegFarmerOrOffline: null,
        txtVillageForByNonRegFarmerOrOffline: null,
      });
      setDistrictForByNonRegFarmerOrOfflineDropdownDataList([]);
      setSubDistrictForByNonRegFarmerOrOfflineDropdownDataList([]);
      setlevel5ByNonRegFarmerOrOfflineDropdownDataList([]);
      setlevel6ByNonRegFarmerOrOfflineDropdownDataList([]);
      setVillageForByNonRegFarmerOrOfflineDropdownDataList([]);
      setlableTalukAnythingNonRegFarmerOrOffline("SubDistrict");
      setlablelevel5NonRegFarmerOrOffline("NyayPanchayat");
      setlablelevel6("GramPanchayat");
      setlableVillageForByNonRegFarmerOrOffline("Village");
      if (value) {
        const pYearVal = value.Value.toString().substr(value.Value.length - 2);
        if (
          formValuesForByNonRegFarmerOrOffline.txtSeasonForNonRegFarmerOrOffline !== null && formValuesForByNonRegFarmerOrOffline.txtSeasonForNonRegFarmerOrOffline !== undefined &&
          formValuesForByNonRegFarmerOrOffline.txtSchemeForNonRegFarmerOrOffline !== null && formValuesForByNonRegFarmerOrOffline.txtSchemeForNonRegFarmerOrOffline !== undefined &&
          formValuesForByNonRegFarmerOrOffline.txtStateForByNonRegFarmerOrOffline !== null &&  formValuesForByNonRegFarmerOrOffline.txtStateForByNonRegFarmerOrOffline !== undefined
        ) {
          getNonRegFarmerOrOfflineHierarchyListData(
            formValuesForByNonRegFarmerOrOffline.txtStateForByNonRegFarmerOrOffline.StateCodeAlpha,
            formValuesForByNonRegFarmerOrOffline.txtStateForByNonRegFarmerOrOffline.StateMasterID,
            "",
            pYearVal,
            "",
          );
        }
      }
    }
    if (name === "txtSchemeForNonRegFarmerOrOffline") {
      setFormValuesForByNonRegFarmerOrOffline({
        ...formValuesForByNonRegFarmerOrOffline,
        txtSchemeForNonRegFarmerOrOffline: value,
        txtDistrictForByNonRegFarmerOrOffline: null,
        txtSubDistrictForByNonRegFarmerOrOffline: null,
        txtlevel5ByNonRegFarmerOrOffline: null,
        txtlevel6ByNonRegFarmerOrOffline: null,
        txtVillageForByNonRegFarmerOrOffline: null,
      });
      setDistrictForByNonRegFarmerOrOfflineDropdownDataList([]);
      setSubDistrictForByNonRegFarmerOrOfflineDropdownDataList([]);
      setlevel5ByNonRegFarmerOrOfflineDropdownDataList([]);
      setlevel6ByNonRegFarmerOrOfflineDropdownDataList([]);
      setVillageForByNonRegFarmerOrOfflineDropdownDataList([]);
      setlableTalukAnythingNonRegFarmerOrOffline("SubDistrict");
      setlablelevel5NonRegFarmerOrOffline("NyayPanchayat");
      setlablelevel6NonRegFarmerOrOffline("GramPanchayat");
      setlableVillageForByNonRegFarmerOrOffline("Village");
      if (value) {
        const pShemeVal = value.SchemeID === 2 ? "02" : value.SchemeID === 4 ? "04" : "";
        if (
          formValuesForByNonRegFarmerOrOffline.txtYearForNonRegFarmerOrOffline !== null && formValuesForByNonRegFarmerOrOffline.txtYearForNonRegFarmerOrOffline !== undefined &&
          formValuesForByNonRegFarmerOrOffline.txtSeasonForNonRegFarmerOrOffline !== null && formValuesForByNonRegFarmerOrOffline.txtSeasonForNonRegFarmerOrOffline !== undefined &&
          formValuesForByNonRegFarmerOrOffline.txtStateForByNonRegFarmerOrOffline !== null && formValuesForByNonRegFarmerOrOffline.txtStateForByNonRegFarmerOrOffline !== undefined
        ) {
          getNonRegFarmerOrOfflineHierarchyListData(
            formValuesForByNonRegFarmerOrOffline.txtStateForByNonRegFarmerOrOffline.StateCodeAlpha,
            formValuesForByNonRegFarmerOrOffline.txtStateForByNonRegFarmerOrOffline.StateMasterID,
            "",
            "",
            pShemeVal,
          );
        }
      }
    }
    if (name === "txtStateForByNonRegFarmerOrOffline") {
      if (formValuesForByNonRegFarmerOrOffline.txtSeasonForNonRegFarmerOrOffline === null) {
        setAlertMessage({
          type: "error",
          message: "Pleas Select Season.",
        });
        setFormValuesForByNonRegFarmerOrOffline({
          ...formValuesForByNonRegFarmerOrOffline,
          txtStateForByNonRegFarmerOrOffline: null,
        });
        return;
      }
      if (formValuesForByNonRegFarmerOrOffline.txtYearForNonRegFarmerOrOffline === null) {
        setAlertMessage({
          type: "error",
          message: "Pleas Select Year.",
        });
        setFormValuesForByNonRegFarmerOrOffline({
          ...formValuesForByNonRegFarmerOrOffline,
          txtStateForByNonRegFarmerOrOffline: null,
        });
        return;
      }
      if (formValuesForByNonRegFarmerOrOffline.txtSchemeForNonRegFarmerOrOffline === null) {
        setAlertMessage({
          type: "error",
          message: "Pleas Select Scheme.",
        });
        setFormValuesForByNonRegFarmerOrOffline({
          ...formValuesForByNonRegFarmerOrOffline,
          txtStateForByNonRegFarmerOrOffline: null,
        });
        return;
      }
      setFormValuesForByNonRegFarmerOrOffline({
        ...formValuesForByNonRegFarmerOrOffline,
        txtStateForByNonRegFarmerOrOffline: value,
        txtDistrictForByNonRegFarmerOrOffline: null,
        txtSubDistrictForByNonRegFarmerOrOffline: null,
        txtlevel5ByNonRegFarmerOrOffline: null,
        txtlevel6ByNonRegFarmerOrOffline: null,
        txtVillageForByNonRegFarmerOrOffline: null,
      });
      setDistrictForByNonRegFarmerOrOfflineDropdownDataList([]);
      setSubDistrictForByNonRegFarmerOrOfflineDropdownDataList([]);
      setlevel5ByNonRegFarmerOrOfflineDropdownDataList([]);
      setlevel6ByNonRegFarmerOrOfflineDropdownDataList([]);
      setVillageForByNonRegFarmerOrOfflineDropdownDataList([]);
      setlableTalukAnythingNonRegFarmerOrOffline("SubDistrict");
      setlablelevel5NonRegFarmerOrOffline("NyayPanchayat");
      setlablelevel6NonRegFarmerOrOffline("GramPanchayat");
      setlableVillageForByNonRegFarmerOrOffline("Village");

      if (value) {
        getNonRegFarmerOrOfflineHierarchyListData(value.StateCodeAlpha, value.StateMasterID, "", "", "");
      }
    }
    if (name === "txtDistrictForByNonRegFarmerOrOffline") {
      setFormValuesForByNonRegFarmerOrOffline({
        ...formValuesForByNonRegFarmerOrOffline,
        txtDistrictForByNonRegFarmerOrOffline: value,
        txtSubDistrictForByNonRegFarmerOrOffline: null,
        txtlevel5ByNonRegFarmerOrOffline: null,
        txtlevel6ByNonRegFarmerOrOffline: null,
        txtVillageForByNonRegFarmerOrOffline: null,
      });
      setSubDistrictForByNonRegFarmerOrOfflineDropdownDataList([]);
      setlevel5ByNonRegFarmerOrOfflineDropdownDataList([]);
      setlevel6ByNonRegFarmerOrOfflineDropdownDataList([]);
      setVillageForByNonRegFarmerOrOfflineDropdownDataList([]);
      setCropForNonRegFarmerOrOfflineDropdownDataList([]);
      if (value) {
        getSubDistrictByStateANDDistrictNonRegFarmerOrOfflineListData(value.level3ID);
      }
      if (
        value &&
        formValuesForByNonRegFarmerOrOffline.txtSeasonForNonRegFarmerOrOffline &&
        formValuesForByNonRegFarmerOrOffline.txtYearForNonRegFarmerOrOffline &&
        formValuesForByNonRegFarmerOrOffline.txtSchemeForNonRegFarmerOrOffline
      ) {
        getCropDataByDistrictData(value.level3ID);
      } else if (
        value &&
        !formValuesForByNonRegFarmerOrOffline.txtSeasonForNonRegFarmerOrOffline &&
        !formValuesForByNonRegFarmerOrOffline.txtYearForNonRegFarmerOrOffline &&
        !formValuesForByNonRegFarmerOrOffline.txtSchemeForNonRegFarmerOrOffline
      ) {
        setAlertMessage({
          type: "warning",
          message: "Select Season, Year And Scheme",
        });
      }
    }

    if (name === "txtSubDistrictForByNonRegFarmerOrOffline") {
      setFormValuesForByNonRegFarmerOrOffline({
        ...formValuesForByNonRegFarmerOrOffline,
        txtSubDistrictForByNonRegFarmerOrOffline: value,
        txtlevel5ByNonRegFarmerOrOffline: null,
        txtlevel6ByNonRegFarmerOrOffline: null,
        txtVillageForByNonRegFarmerOrOffline: null,
      });
      setlevel5ByNonRegFarmerOrOfflineDropdownDataList([]);
      setlevel6ByNonRegFarmerOrOfflineDropdownDataList([]);
      setVillageForByNonRegFarmerOrOfflineDropdownDataList([]);
      if (value) {
        getlevel5NonRegFarmerOrOfflineListData(value.level4ID, formValuesForByNonRegFarmerOrOffline.txtDistrictForByNonRegFarmerOrOffline.level3ID);
      }
    }
    if (name === "txtlevel5ByNonRegFarmerOrOffline") {
      setFormValuesForByNonRegFarmerOrOffline({
        ...formValuesForByNonRegFarmerOrOffline,
        txtlevel5ByNonRegFarmerOrOffline: value,
        txtlevel6ByNonRegFarmerOrOffline: null,
        txtVillageForByNonRegFarmerOrOffline: null,
      });
      setlevel6ByNonRegFarmerOrOfflineDropdownDataList([]);
      setVillageForByNonRegFarmerOrOfflineDropdownDataList([]);
      if (value) {
        if (lablelevel6NonRegFarmerOrOffline === null) {
          getlevel7NonRegFarmerOrOfflineListData(
            formValuesForByNonRegFarmerOrOffline.txtDistrictForByNonRegFarmerOrOffline &&
              formValuesForByNonRegFarmerOrOffline.txtDistrictForByNonRegFarmerOrOffline.level3ID
              ? formValuesForByNonRegFarmerOrOffline.txtDistrictForByNonRegFarmerOrOffline.level3ID
              : "",
            formValuesForByNonRegFarmerOrOffline.txtSubDistrictForByNonRegFarmerOrOffline &&
              formValuesForByNonRegFarmerOrOffline.txtSubDistrictForByNonRegFarmerOrOffline.level4ID
              ? formValuesForByNonRegFarmerOrOffline.txtSubDistrictForByNonRegFarmerOrOffline.level4ID
              : "",
            value.level5ID,
            "",
          );
        } else {
          getlevel6NonRegFarmerOrOfflineListData(
            formValuesForByNonRegFarmerOrOffline.txtDistrictForByNonRegFarmerOrOffline.level3ID,
            formValuesForByNonRegFarmerOrOffline.txtSubDistrictForByNonRegFarmerOrOffline.level4ID,
            value.level5ID,
          );
        }
      }
    }
    if (name === "txtlevel6ByNonRegFarmerOrOffline") {
      setFormValuesForByNonRegFarmerOrOffline({
        ...formValuesForByNonRegFarmerOrOffline,
        txtlevel6ByNonRegFarmerOrOffline: value,
        txtVillageForByNonRegFarmerOrOffline: null,
      });
      setVillageForByNonRegFarmerOrOfflineDropdownDataList([]);
      if (value) {
        getlevel7NonRegFarmerOrOfflineListData(
          formValuesForByNonRegFarmerOrOffline.txtDistrictForByNonRegFarmerOrOffline &&
            formValuesForByNonRegFarmerOrOffline.txtDistrictForByNonRegFarmerOrOffline.level3ID
            ? formValuesForByNonRegFarmerOrOffline.txtDistrictForByNonRegFarmerOrOffline.level3ID
            : "",
          formValuesForByNonRegFarmerOrOffline.txtSubDistrictForByNonRegFarmerOrOffline &&
            formValuesForByNonRegFarmerOrOffline.txtSubDistrictForByNonRegFarmerOrOffline.level4ID
            ? formValuesForByNonRegFarmerOrOffline.txtSubDistrictForByNonRegFarmerOrOffline.level4ID
            : "",
          formValuesForByNonRegFarmerOrOffline.txtlevel5ByNonRegFarmerOrOffline &&
            formValuesForByNonRegFarmerOrOffline.txtlevel5ByNonRegFarmerOrOffline.level5ID
            ? formValuesForByNonRegFarmerOrOffline.txtlevel5ByNonRegFarmerOrOffline.level5ID
            : "",
          value.level6ID,
        );
      }
    }
    if( name === "txtAreaInHectareForCalculator") {
      setFormValuesForByNonRegFarmerOrOffline({
        ...formValuesForByNonRegFarmerOrOffline,
        txtAreaInHectareForCalculator: value,
        CalculatedSumInsured: "",
      });

      if (value) {
        getCalculatorDataOnClick(value, formValuesForByNonRegFarmerOrOffline.txtCropForCalculate);
      }
    }
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

  const [ticketCategoryOtherList, setTicketCategoryOtherList] = useState([]);
  const [isLoadingTicketCategoryOtherList, setIsTicketCategoryOtherList] = useState(false);
  const getTicketCategoryOtherListData = async (supportTicketTypeID, data) => {
    try {
      if (ticketBindingData) {
        setTicketCategoryOtherList([]);
        setIsTicketCategoryOtherList(true);
        if (data.TicketCategoryID === 51) {
          const filterticketBindingData = ticketBindingData.CRPOTH.filter((data) => {
            return data.OtherCategory1 === Number(supportTicketTypeID);
          });
          setTicketCategoryOtherList(filterticketBindingData);
        } else if (data.TicketCategoryID === 52) {
          const filterticketBindingData = ticketBindingData.CRPOTH.filter((data) => {
            return data.OtherCategory2 === Number(supportTicketTypeID);
          });
          setTicketCategoryOtherList(filterticketBindingData);
        } else if (data.TicketCategoryID === 53) {
          const filterticketBindingData = ticketBindingData.CRPOTH.filter((data) => {
            return data.OtherCategory3 === Number(supportTicketTypeID);
          });
          setTicketCategoryOtherList(filterticketBindingData);
        } else if (data.TicketCategoryID === 58) {
          const filterticketBindingData = ticketBindingData.CRPOTH.filter((data) => {
            return data.OtherCategory4 === Number(supportTicketTypeID);
          });
          setTicketCategoryOtherList(filterticketBindingData);
        }
        setIsTicketCategoryOtherList(false);
      } else {
        setTicketCategoryOtherList([]);
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
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

  const [openModal, setOpenModal] = useState(false);
  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
    console.log(params.api);
    setGridApi(params.api);
  };

  const onChangeFarmersDetails = (val) => {
    gridApi.setQuickFilter(val);
  };

  const onCellDoubleClicked = (event) => {
    setSelectedFarmer(event.data);
    console.log(event.data);

    setFormValuesForFarmerInfo({
      ...formValuesForFarmerInfo,
      txtSeasonForFarmerInfo: {
        CropSeasonID: formValuesForByLocation.txtSeasonForLocation.CropSeasonID,
        CropSeasonName: formValuesForByLocation.txtSeasonForLocation.CropSeasonName,
      },
      txtYearForFarmerInfo: { Value: formValuesForByLocation.txtYearForLocation.Value, Name: formValuesForByLocation.txtYearForLocation.Name },
      txtSchemeForFarmerInfo: event.data && event.data.scheme ? schemeList.find((x) => x.ShortName === event.data.scheme) : null,
    });
    // A getfarmersTicketSummaryData(event.data.farmerID);
    setfetchfarmersummary(event.data.farmerID);
    toggleModal();
  };

  const [openInsuranceCompanyModalGreivence, setOpenInsuranceCompanyModalGreivence] = useState(false);
  const toggleInsuranceCompanyModalGreivence = () => {
    setOpenInsuranceCompanyModalGreivence(!openInsuranceCompanyModalGreivence);
  };

  const onCellDoubleClickedDetailsGreivence = (event) => {
    setSelectedOption("1");
    setSelectedClaimOrGrievence("GR");
    setClaimOrGrievenceDisabled(true);
    setSelectedInsuranceDetails(event.data);
    if (event.data && event.data.scheme) {
      setFormValuesForFarmerInfo({
        ...formValuesForFarmerInfo,
        txtSchemeForFarmerInfo: { SchemeID: event.data.SchemeID, SchemeName: event.data.SchemeName },
      });
    }
    setTicketCategoryTypeList([]);
    setTicketCategoryList([]);
    setLossAtList([]);
    setCropStageList([]);
    setFormValuesTicketCreation({
      ...formValuesTicketCreation,
      txtTicketCategory: null,
      txtTicketCategoryType: null,
      txtCropLossDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
      txtCropLossIntimation: "On-time",
      txtCropLossTime: "",
      txtTicketDescription: "",
      txtLossAt: null,
      txtOtherSubCategory: null,
      txtCropStage: null,
      txtCropHarvestDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
      txtCropName: "",
    });
    setstateYearAndSeason("YRSSNNO");
    getTicketCategoryTypeListData("1", 0, "TCKTYP");
    toggleInsuranceCompanyModalGreivence();
  };

  const [openCustomeWindow, setopenCustomeWindow] = useState("S");
  const [customeWindowWidth, setCustomeWindowWidth] = useState("45.7vw");
  const [customeWindowHeight, setCustomeWindowHeight] = useState("60vh");
  const OnClickCustomeWindow = (ptype) => {
    if (ptype === "S") {
      setopenCustomeWindow("B");
      setCustomeWindowWidth("92.5vw");
      setCustomeWindowHeight("95.5vh");
    } else if (ptype === "B") {
      setopenCustomeWindow("S");
      setCustomeWindowWidth("45.7vw");
      setCustomeWindowHeight("60vh");
    }
  };
  const onChangeClamStatus = (val) => {
    gridApiClaimStatus.setQuickFilter(val);
  };

  const [gridApiClaimStatus, setGridApiClaimStatus] = useState();
  const onGridReadyClaimStatus = (params) => {
    console.log(params.api);
    setGridApiClaimStatus(params.api);
  };

  const [claimStatusData, setClaimStatusData] = useState([]);
  const [openClaimStatusModal, setOpenClaimStatusModal] = useState(false);
  const toggleClaimStatusModal = () => {
    setOpenClaimStatusModal(!openClaimStatusModal);
  };

  const [selectedData, setSelectedData] = useState();
  const [openMyTicketModal, setOpenMyTicketModal] = useState(false);
  const openMyTicketPage = (data) => {
    debugger;
    if (data !== null) {
      setSelectedData(data);
    } else {
      setSelectedData(null);
    }
    setOpenMyTicketModal(!openMyTicketModal);
    const userData = getSessionStorage("user");
    getUserRightDataList(userData && userData.LoginID ? userData.LoginID : 0, 102);
  };

  const getUserRightDataList = async (pUserID, pMenuMasterID) => {
    try {
      const formdata = {
        userID: pUserID,
        menuMasterID: pMenuMasterID,
      };
      const result = await getUserRightData(formdata);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.UserProfileRight.length > 0) {
          setSessionStorage("UserRights", result.response.responseData.UserProfileRight);
          
        } else {
          setSessionStorage("UserRights", []);
        }
      } else {
        setSessionStorage("UserRights", []);
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const [isLoadingTicketHistory, setIsLoadingTicketHistory] = useState(false);
  const getTicketHistoryOnClick = async (pTicketStatusID) => {
    try {
      setIsLoadingTicketHistory(true);
      if (selectedFarmer.length === 0 && selectedFarmer.length !== undefined) {
        setAlertMessage({
          type: "error",
          message: "Farmer Authentication is required!",
        });
        setIsLoadingTicketHistory(false);
        return;
      }

      const pticketRequestorID = selectedFarmer && selectedFarmer.farmerID ? selectedFarmer.farmerID : "";

      if (pticketRequestorID === "") {
        setAlertMessage({
          type: "error",
          message: "farmerID is required!",
        });
        setIsLoadingTicketHistory(false);
        return;
      }
      const formData = {
        viewMode: "RQSTLST",
        ticketRequestorID: pticketRequestorID,
        mobilenumber: "",
        aadharNumber: "",
        accountNumber: "",
      };
      const result = await farmerTicketSummaryKRPH(formData);
      setIsLoadingTicketHistory(false);
      if (result.response.responseCode.toString() === "1") {
        const farmersTicketData = Object.values(result.response.responseData.data.result);
        if (farmersTicketData && farmersTicketData.length > 0) {
          let filterData = [];
          if (pTicketStatusID === 109301) {
            filterData = farmersTicketData.filter((data) => {
              return data.TicketStatusID === 109301;
            });
          }
          if (pTicketStatusID === 109303) {
            filterData = farmersTicketData.filter((data) => {
              return data.TicketStatusID === 109303;
            });
          }
          if (pTicketStatusID === 0) {
            filterData = farmersTicketData;
          }
          setTicketHistoryData(filterData);
          toggleTicketHistoryModal();
        } else {
          setTicketHistoryData([]);
          setAlertMessage({
            type: "warning",
            message: "Ticket data not found",
          });
        }
      } else {
        setTicketHistoryData([]);
        setAlertMessage({
          type: "warning",
          message: "Ticket data not found",
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
  
  const [nonRegisteredFarmerDetails,setNonRegisteredFarmerDetails] = useState([]);
  const getNonRegisteresFarmerDetailsByMobile = async () => {
    try {
      
      const formData = {
        viewMode: "MOBILE",
        ticketRequestorID: "",
        mobilenumber: formValuesGI && formValuesGI.txtMobileCallerNumber ? formValuesGI.txtMobileCallerNumber : "",
        aadharNumber: "",
        accountNumber: "",
      };
      const result = await farmerTicketSummaryKRPH(formData);
      
      if (result.response.responseCode.toString() === "1") {
        const farmersTicketData = Object.values(result.response.responseData.data.result);
        if (farmersTicketData && farmersTicketData.length > 0) {
          setNonRegisteredFarmerDetails(farmersTicketData);
          setFormValuesForByNonRegFarmerOrOffline({
            ...formValuesForByNonRegFarmerOrOffline,
            txtFarmerNameForNonRegFarmerOrOffline: result.response.responseData && result.response.responseData.data.result[0].farmerName ? result.response.responseData.data.result[0].farmerName : "",
            txtMobileForNonRegFarmerOrOffline: dcryptUMBLENO,          
            
          });

        } else {
          setNonRegisteredFarmerDetails([]);
          
        }
      } else {
        setNonRegisteredFarmerDetails([]);
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const [gridApiTicketHistory, setGridApiTicketHistory] = useState();
  const onGridReadyTicketHistory = (params) => {
    console.log(params.api);
    setGridApiTicketHistory(params.api);
  };

  const onChangeTicketHistory = (val) => {
    gridApiTicketHistory.setQuickFilter(val);
  };

  const [ticketHistoryData, setTicketHistoryData] = useState([]);
  const [openTicketHistoryModal, setOpenTicketHistoryModal] = useState(false);
  const toggleTicketHistoryModal = () => {
    setOpenTicketHistoryModal(!openTicketHistoryModal);
  };

  const [formValidationSupportTicketError, setFormValidationSupportTicketError] = useState({});

  // A const [runningCurrentYear, setRunningCurrentYear] = useState("");
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    // A setRunningCurrentYear(currentYear);
    const yearArray = [];
    for (let i = 2018; i <= currentYear; i += 1) {
      yearArray.push({ Name: i.toString(), Value: i.toString() });
    }
    setYearList(yearArray.sort().reverse());
    getTicketCategoryTypeListData("1", 0, "TCKTYP");
    validateFarmerByMobileNumberKRPH();
    getticketDataBindingKrphAllActivitiesData();
    getStateKRPHListData();
  }, []);

  const servicesuccessData = getSessionStorage("servicesuccess");

  const CreateMoreBtnOnClick = () => {
    debugger;
    setServiceSuccessState("UNSUCCESS");
  };

  return (
    <>
      {serviceSuccessState === "UNSUCCESS" ?
      <div className={BizClass.Box}>
        <div className={BizClass.Div}>
          <div className={BizClass.InfoDiv}>
            <div className={BizClass.CreationDiv}>
              <div className={BizClass.Title}>
                <h3>Caller Information</h3>
              </div>
              <div className={BizClass.CreationDiv}>
                <div className={BizClass.Content}>
                  <div className={BizClass.ContainerPnl}>
                    <Form.Group column={4} controlwidth="25%">
                      <Form.InputGroup label="Caller ID" req="true">
                        <Form.InputControl
                          control="input"
                          name="txtCallerID"
                          value={formValuesGI.txtCallerID}
                          onChange={(e) => updateStateGI("txtCallerID", e.target.value.replace(/\D/g, ""))}
                          disabled={true}
                        />
                      </Form.InputGroup>
                      <Form.InputGroup label="Caller Mobile Number" req="true">
                        <Form.InputControl
                          control="input"
                          name="txtMobileCallerNumber"
                          value={formValuesGI.txtMobileCallerNumber}
                          onChange={(e) => updateStateGI("txtMobileCallerNumber", e.target.value.replace(/\D/g, ""))}
                          disabled={true}
                          autoComplete="off"
                        />
                      </Form.InputGroup>
                      <Form.InputGroup label="Call Status" req="true" errorMsg={formValidationKRPHError["txtCallStatus"]}>
                        <Form.InputControl
                          control="select"
                          name="txtCallStatus"
                          value={formValuesGI.txtCallStatus}
                          options={callConnectedDropdownDataList}
                          getOptionLabel={(option) => `${option.Value}`}
                          getOptionValue={(option) => `${option}`}
                          onChange={(e) => updateStateGI("txtCallStatus", e)}
                        />
                      </Form.InputGroup>
                      {formValuesGI && formValuesGI.txtCallStatus && formValuesGI.txtCallStatus.ID === 1 ? (
                        <Form.InputGroup label="1">
                          <Form.InputControl control="" />
                        </Form.InputGroup>
                      ) : null}
                      {formValuesGI && formValuesGI.txtCallStatus && formValuesGI.txtCallStatus.ID === 2 ? (
                        <Form.InputGroup label="Reason" req="true" errorMsg={formValidationKRPHError["txtReason"]}>
                          <Form.InputControl
                            control="select"
                            name="txtReason"
                            value={formValuesGI.txtReason}
                            options={reasonDropdownDataList}
                            getOptionLabel={(option) => `${option.Value}`}
                            getOptionValue={(option) => `${option}`}
                            onChange={(e) => updateStateGI("txtReason", e)}
                          />
                        </Form.InputGroup>
                      ) : null}
                      <Form.InputGroup req={formValuesGI && formValuesGI.txtCallStatus && formValuesGI.txtCallStatus.ID === 1 ? "true" :"false"} label="State" errorMsg={formValidationKRPHError["txtState"]}>
                        <Form.InputControl
                          control="select"
                          name="txtState"
                          value={formValuesGI.txtState}
                          options={stateKRPHDropdownDataList}
                          isLoading={isLoadingStateDKRPHropdownDataList}
                          getOptionLabel={(option) => `${option.StateMasterName}`}
                          getOptionValue={(option) => `${option}`}
                          onChange={(e) => updateStateGI("txtState", e)}
                          isDisabled ={farmerAuthenticateByMobile}
                        />
                      </Form.InputGroup>

                      <Form.InputGroup label="District" req={formValuesGI && formValuesGI.txtCallStatus && formValuesGI.txtCallStatus.ID === 1 ? "true" :"false" } errorMsg={formValidationKRPHError["txtDistrict"]}>
                        <Form.InputControl
                          control="select"
                          name="txtDistrict"
                          value={formValuesGI.txtDistrict}
                          options={districtKRPHDropdownDataList}
                          isLoading={isLoadingDistrictKRPHDropdownDataList}
                          getOptionLabel={(option) => `${option.level3Name}`}
                          getOptionValue={(option) => `${option}`}
                          onChange={(e) => updateStateGI("txtDistrict", e)}
                          isDisabled ={farmerAuthenticateByMobile}
                        />
                      </Form.InputGroup>
                      <Form.InputGroup label="Farmer Name" req={formValuesGI && formValuesGI.txtCallStatus && formValuesGI.txtCallStatus.ID === 1 ? "true" :"false" } errorMsg={formValidationKRPHError["txtFarmerName"]}>
                        <Form.InputControl
                          control="input"
                          name="txtFarmerName"
                          value={formValuesGI.txtFarmerName}
                          onChange={(e) => updateStateGI("txtFarmerName", e.target.value)}
                          autoComplete="off"
                          disabled ={farmerAuthenticateByMobile}
                        />
                      </Form.InputGroup>
                    </Form.Group>
                    {formValuesGI && formValuesGI.txtCallStatus && formValuesGI.txtCallStatus.ID === 1 ? (
                      <div className={BizClass.toggleContainerKrphCenter}>
                        <KrphToggleSwitch leftText={"Generate Ticket"} rightText={"Premium Calculator"} callback={onToggleChange} checked={toggleChange} />{" "}
                      </div>
                    ) : null}
                    {/* {formValuesGI && formValuesGI.txtCallStatus && formValuesGI.txtCallStatus.ID === 1 ? (
                      <div className={BizClass.SummaryBoardCenter}>
                        <div className={BizClass.SummaryBoard}>
                          <div
                            className={activeKey === "TCKT" ? classNames(BizClass.ScoreBoardTicketActive) : classNames(BizClass.ScoreBoardTicket)}
                            onClick={() => OnClickTab("TCKT")}
                          >
                            <span>Generate Ticket</span>
                          </div>
                          <div
                            className={activeKey === "PRMCAL" ? classNames(BizClass.ScoreBoardPrmCalcActive) : classNames(BizClass.ScoreBoardPrmCalc)}
                            onClick={() => OnClickTab("PRMCAL")}
                          >
                            <span>Premium Calculator</span>
                          </div>
                        </div>
                      </div>
                    ) : null} */}
                    <div className={BizClass.ValidateFormFooterBG}>
                      <div className={BizClass.ValidateFormFooter}>
                        <Button className={BizClass.FormFooterButton} onClick={() => OnClickBtnReset()}>
                          Reset
                        </Button>
                        {formValuesGI && formValuesGI.txtCallStatus && formValuesGI.txtCallStatus.ID === 1 ? (
                          <Button className={BizClass.FormFooterButton}   onClick={() => OnClickBtnAction("BTNNXT")}>
                            Next
                          </Button>
                        ) : formValuesGI && formValuesGI.txtCallStatus && formValuesGI.txtCallStatus.ID === 2 ? (
                          <Button className={BizClass.FormFooterButton}   onClick={() => OnClickBtnAction("BTNSBMT")}>
                            Submit
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <br />
                  {formValuesGI && formValuesGI.txtCallStatus && formValuesGI.txtCallStatus.ID === 1 ? (
                    <>
                      {formValuesGI &&
                      formValuesGI.txtCallStatus &&
                      formValuesGI.txtCallStatus.ID === 1 &&
                      activeKey === "PRMCAL" &&
                      activeBtnKey === "BTNNXT" ? (
                        <PremiumCalculator objStateData={objStateData} objDistrictData={objDistrictData} formValuesGI={formValuesGI} dcryptUNQEID={dcryptUNQEID} dcryptUID={dcryptUID} />
                      ) : null}{" "}
                    </>
                  ) : null}
                  {formValuesGI && formValuesGI.txtCallStatus && formValuesGI.txtCallStatus.ID === 1 && activeKey === "TCKT" && activeBtnKey === "BTNNXT" ? (
                     <>
                     {openModal && (
                       <FarmerListModal
                         toggleModal={toggleModal}
                         farmersData={farmersData}
                         onGridReady={onGridReady}
                         onCellDoubleClicked={onCellDoubleClicked}
                         onChangeFarmersDetails={onChangeFarmersDetails}
                       />
                     )}
                     {openInsuranceCompanyModalGreivence && (
                       <InsuranceCompanyModalGreivence
                         toggleInsuranceCompanyModalGreivence={toggleInsuranceCompanyModalGreivence}
                         // A onGridReadySupportTicketGreivence={onGridReadySupportTicketGreivence}
                         onCellDoubleClickedDetailsGreivence={onCellDoubleClickedDetailsGreivence}
                         insuranceCompanyDataGreivence={insuranceCompanyDataGreivence}
                         isLoadingApplicationNoDataGreivence={isLoadingApplicationNoDataGreivence}
                         getClaimStatusOnClick={getClaimStatusOnClick}
                       />
                     )}
                     {openTicketHistoryModal && (
                       <TicketHistoryModal
                         toggleTicketHistoryModal={toggleTicketHistoryModal}
                         selectedFarmer={selectedFarmer}
                         ticketHistoryData={ticketHistoryData}
                         onGridReadyTicketHistory={onGridReadyTicketHistory}
                         isLoadingTicketHistory={isLoadingTicketHistory}
                         onChangeTicketHistory={onChangeTicketHistory}
                         openMyTicketPage={openMyTicketPage}
                       />
                     )}
                     {openClaimStatusModal && (
                       <ClaimStatusModal
                         toggleClaimStatusModal={toggleClaimStatusModal}
                         onGridReadyClaimStatus={onGridReadyClaimStatus}
                         claimStatusData={claimStatusData}
                         onChangeClamStatus={onChangeClamStatus}
                         isLoadingClaimStatusData={isLoadingClaimStatusData}
                         openCustomeWindow={openCustomeWindow}
                         OnClickCustomeWindow={OnClickCustomeWindow}
                         customeWindowWidth={customeWindowWidth}
                         customeWindowHeight={customeWindowHeight}
                       />
                     )}
                     {openMyTicketModal && <MyTicketPage showfunc={openMyTicketPage} selectedData={selectedData} />}
                     <div className={BizClass.CreateTicketeBox}>
                       <div className={BizClass.Div}>
                         <div className={BizClass.ValidateBox}>
                           <div className={BizClass.ValidateTitle}>
                             <h3>Farmer Authentication</h3>
                           </div>
                           <div className={BizClass.ValidateContent}>
                             <div className={BizClass.validateFormHorizontal}>
                               <Form.InputGroup errorMsg="">
                                 <ul className={BizClass.ValidateTabGroup}>
                                   <button
                                     type="button"
                                     className={selectedValidateOption === "1" && BizClass.Active}
                                    // A className={
                                    // A   selectedValidateOption === "1" && farmerAuthenticateByMobile === true
                                    // A     ? classNames(BizClass.Active,BizClass.disabledradioFarmerAuthenticationBoxWithouOpacity)
                                    // A     : selectedValidateOption === "1"
                                    // A     ? BizClass.Active
                                    // A     : null
                                    // A  }
                                     onClick={() => OnClickSelectedValidateOption("MN")}
                                   >
                                     <div className={BizClass.ValidateTabCheckBox} />
                                     <span>Farmer Mobile Number</span>
                                   </button>
                                   <button
                                     type="button"
                                    className={selectedValidateOption === "2" && BizClass.Active}
                                    // A  className={
                                    // A selectedValidateOption === "2" && farmerAuthenticateByMobile === false
                                    // A     ? BizClass.Active
                                    // A     : farmerAuthenticateByMobile === true
                                    // A     ? BizClass.disabledradioFarmerAuthenticationBox
                                    // A     : null
                                    // A }
                                     onClick={() => OnClickSelectedValidateOption("AN")}
                                     style={{ minWidth: "0px", width: "150px" }}
                                   >
                                     <div className={BizClass.ValidateTabCheckBox} />
                                     <span>Aadhar Number</span>
                                   </button>
                                   <button
                                     type="button"
                                    className={selectedValidateOption === "3" && BizClass.Active}
                                    // A className={
                                    // A   selectedValidateOption === "3" && farmerAuthenticateByMobile === false
                                    // A     ? BizClass.Active
                                    // A     : farmerAuthenticateByMobile === true
                                    // A     ? BizClass.disabledradioFarmerAuthenticationBox
                                    // A     : null
                                    // A }
                                     onClick={() => OnClickSelectedValidateOption("BAN")}
                                     style={{ minWidth: "0px", width: "160px" }}
                                   >
                                     <div className={BizClass.ValidateTabCheckBox} />
                                     <span>Bank A/C Number</span>
                                   </button>
                                   <button
                                     type="button"
                                     className={selectedValidateOption === "4" && BizClass.Active}
                                    // A  className={
                                    // A   selectedValidateOption === "4" && farmerAuthenticateByMobile === false
                                    // A    ? BizClass.Active
                                    // A     : farmerAuthenticateByMobile === true
                                    // A     ? BizClass.disabledradioFarmerAuthenticationBox
                                    // A     : null
                                    // A }
                                     onClick={() => OnClickSelectedValidateOption("PN")}
                                     style={{ minWidth: "0px", width: "150px" }}
                                   >
                                     <div className={BizClass.ValidateTabCheckBox} />
                                     <span>Policy Number</span>
                                   </button>
                                   <button
                                     type="button"
                                     className={selectedValidateOption === "5" && BizClass.Active}
                                    // A className={
                                    // A   selectedValidateOption === "5" && farmerAuthenticateByMobile === false
                                    // A     ? BizClass.Active
                                    // A     : farmerAuthenticateByMobile === true
                                    // A     ? BizClass.disabledradioFarmerAuthenticationBox
                                    // A     : null
                                    // A }
                                     onClick={() => OnClickSelectedValidateOption("BL")}
                                     style={{ minWidth: "0px", width: "140px" }}
                                   >
                                     <div className={BizClass.ValidateTabCheckBox} />
                                     <span>By Location</span>
                                   </button>
                                   <button
                                     type="button"
                                     className={selectedValidateOption === "6" && BizClass.Active}
                                    // A  className={
                                    // A   selectedValidateOption === "6" && farmerAuthenticateByMobile === false
                                    // A     ? BizClass.Active
                                    // A     : farmerAuthenticateByMobile === true
                                    // A     ? BizClass.disabledradioFarmerAuthenticationBox
                                    // A     : null
                                    // A }
                                     onClick={() => OnClickSelectedValidateOption("NRF")}
                                   >
                                     <div className={BizClass.ValidateTabCheckBox} />
                                     <span>Non-Registered Farmer</span>
                                   </button>
                                   <button
                                     type="button"
                                    className={selectedValidateOption === "7" && BizClass.Active}
                                    // A  className={
                                    // A   selectedValidateOption === "7" && farmerAuthenticateByMobile === false
                                    // A     ? BizClass.Active
                                    // A     : farmerAuthenticateByMobile === true
                                    // A     ? BizClass.disabledradioFarmerAuthenticationBox
                                    // A     : null
                                    // A }
                                     onClick={() => OnClickSelectedValidateOption("OFFLN")}
                                     style={{ minWidth: "0px", width: "120px", display:"none" }}
                                   >
                                     <div className={BizClass.ValidateTabCheckBox} />
                                     <span>Offline</span>
                                   </button>
                                 </ul>
                               </Form.InputGroup>
                             </div>
                             <form className={selectedValidateOption !== "6" && selectedValidateOption !== "7" ? BizClass.ValidateForm : ""}>
                               {selectedValidateOption === "1" && (
                                 <div className={BizClass.ValidateControlGroup}>
                                   <Form.Group column="1" controlwidth="auto">
                                     <Form.InputGroup label="Farmer Mobile Number" req="true" errorMsg={formValidationFarmersError["txtMobileNumber"]}>
                                       <Form.InputControl
                                         control="input"
                                         name="txtMobileNumber"
                                         value={formValuesMN.txtMobileNumber}
                                         minLength={10}
                                         maxLength={10}
                                         onChange={(e) => updateStateMN("txtMobileNumber", e.target.value)}
                                         autoComplete="off"
                                       />
                                     </Form.InputGroup>
                                   </Form.Group>
                                 </div>
                               )}
                               {selectedValidateOption === "2" && (
                                 <div className={BizClass.ValidateControlGroup}>
                                   <Form.Group column="1" controlwidth="auto">
                                     <Form.InputGroup label="Aadhar Number" req="true" errorMsg={formValidationFarmersError["txtAadharNumber"]}>
                                       <Form.InputControl
                                         control="input"
                                         name="txtAadharNumber"
                                         minLength={12}
                                         maxLength={12}
                                         value={formValuesAN.txtAadharNumber}
                                         onChange={(e) => updateStateAN("txtAadharNumber", e.target.value)}
                                         autoComplete="off"
                                       />
                                     </Form.InputGroup>
                                   </Form.Group>
                                 </div>
                               )}
                               {selectedValidateOption === "3" && (
                                 <div className={BizClass.ValidateControlGroup}>
                                   <Form.Group column={4} controlwidth="25%">
                                     <Form.InputGroup label="State" req="true" errorMsg={formValidationFarmersError["txtState"]}>
                                       <Form.InputControl
                                         control="select"
                                         name="txtState"
                                         value={formValues.txtState}
                                         options={stateDropdownDataList}
                                         loader={isLoadingStateDropdownDataList ? <Loader /> : null}
                                         isLoading={isLoadingStateDropdownDataList}
                                         getOptionLabel={(option) => `${option.StateMasterName}`}
                                         getOptionValue={(option) => `${option}`}
                                         onChange={(e) => updateState("txtState", e)}
                                         focus="true"
                                       />
                                     </Form.InputGroup>
                                     <Form.InputGroup label="District" req="true" errorMsg={formValidationFarmersError["txtDistrict"]}>
                                       <Form.InputControl
                                         control="select"
                                         name="txtDistrict"
                                         value={formValues.txtDistrict}
                                         options={districtDropdownDataList}
                                         loader={isLoadingDistrictDropdownDataList ? <Loader /> : null}
                                         isLoading={isLoadingDistrictDropdownDataList}
                                         getOptionLabel={(option) => `${option.level3Name}`}
                                         getOptionValue={(option) => `${option}`}
                                         onChange={(e) => updateState("txtDistrict", e)}
                                       />
                                     </Form.InputGroup>
                                     <Form.InputGroup label="Bank Name" req="true" errorMsg={formValidationFarmersError["txtBankName"]}>
                                       <Form.InputControl
                                         control="select"
                                         name="txtBankName"
                                         value={formValues.txtBankName}
                                         options={bankDropdownDataList}
                                         loader={isLoadingBankDropdownDataList ? <Loader /> : null}
                                         isLoading={isLoadingBankDropdownDataList}
                                         getOptionLabel={(option) => `${option.bankName}`}
                                         getOptionValue={(option) => `${option}`}
                                         onChange={(e) => updateState("txtBankName", e)}
                                       />
                                     </Form.InputGroup>
                                     <Form.InputGroup label="Bank Branch" req="true" errorMsg={formValidationFarmersError["txtBranchName"]}>
                                       <Form.InputControl
                                         control="select"
                                         name="txtBranchName"
                                         value={formValues.txtBranchName}
                                         options={bankBranchDropdownDataList}
                                         loader={isLoadingBankBranchDropdownDataList ? <Loader /> : null}
                                         isLoading={isLoadingBankBranchDropdownDataList}
                                         getOptionLabel={(option) => `${option.branchName}`}
                                         getOptionValue={(option) => `${option}`}
                                         onChange={(e) => updateState("txtBranchName", e)}
                                       />
                                     </Form.InputGroup>
                                     <Form.InputGroup label="Account Number" errorMsg={formValidationFarmersError["txtAccountNumber"]}>
                                       <Form.InputControl
                                         control="input"
                                         label="Account Number"
                                         name="txtAccountNumber"
                                         minLength={14}
                                         maxLength={18}
                                         value={formValues.txtAccountNumber}
                                         onChange={(e) => updateState("txtAccountNumber", e.target.value.replace(/\D/g, ""))}
                                       />
                                     </Form.InputGroup>
                                   </Form.Group>
                                 </div>
                               )}
                               {selectedValidateOption === "4" && (
                                 <div className={BizClass.ValidateControlGroup}>
                                   <Form.Group column={4} controlwidth="auto">
                                     <Form.InputGroup label="Policy Number" req="true" errorMsg={formValidationFarmersError["txtPolicyNumber"]}>
                                       <Form.InputControl
                                         id="inputPolicyNumber"
                                         control="input"
                                         name="txtPolicyNumber"
                                         minLength={19}
                                         maxLength={19}
                                         onPaste={(e) => {
                                           e.preventDefault();
                                           return false;
                                         }}
                                         onCopy={(e) => {
                                           e.preventDefault();
                                           return false;
                                         }}
                                         value={formValuesForPolicyNumber.txtPolicyNumber}
                                         onChange={(e) => updateStateForPolicyNumber("txtPolicyNumber", e.target.value)}
                                         autoComplete="off"
                                       />
                                     </Form.InputGroup>
                                     <Form.InputGroup label="Scheme">
                                       <Form.InputControl
                                         control="input"
                                         name="txtSchemeForPolicyNumber"
                                         value={formValuesForPolicyNumber.txtSchemeForPolicyNumber}
                                         onChange={(e) => updateStateForPolicyNumber("txtSchemeForPolicyNumber", e.target.value)}
                                         disabled={true}
                                       />
                                     </Form.InputGroup>
                                     <Form.InputGroup label="Season">
                                       <Form.InputControl
                                         control="input"
                                         name="txtSeasonForPolicyNumber"
                                         value={formValuesForPolicyNumber.txtSeasonForPolicyNumber}
                                         onChange={(e) => updateStateForPolicyNumber("txtSeasonForPolicyNumber", e.target.value)}
                                         disabled={true}
                                       />
                                     </Form.InputGroup>
                                     <Form.InputGroup label="State & Year">
                                       <Form.InputControl
                                         control="input"
                                         name="txtStateAndYearForPolicyNumber"
                                         value={formValuesForPolicyNumber.txtStateAndYearForPolicyNumber}
                                         onChange={(e) => updateStateForPolicyNumber("txtStateAndYearForPolicyNumber", e.target.value)}
                                         disabled={true}
                                       />
                                     </Form.InputGroup>
                                   </Form.Group>
                                 </div>
                               )}
                               {selectedValidateOption === "5" && (
                                 <div className={BizClass.ValidateControlGroup}>
                                   <Form.Group column={4} controlwidth="25%">
                                     <Form.InputGroup label="Season" req="true" errorMsg={formValidationFarmersError["txtSeasonForLocation"]}>
                                       <Form.InputControl
                                         control="select"
                                         name="txtSeasonForLocation"
                                         value={formValuesForByLocation.txtSeasonForLocation}
                                         options={seasonForPolicyNumberDropdownDataList}
                                         getOptionLabel={(option) => `${option.CropSeasonName}`}
                                         getOptionValue={(option) => `${option}`}
                                         onChange={(e) => updateStateForByLocation("txtSeasonForLocation", e)}
                                       />
                                     </Form.InputGroup>
                                     <Form.InputGroup label="Year" req="true" errorMsg={formValidationFarmersError["txtYearForLocation"]}>
                                       <Form.InputControl
                                         control="select"
                                         name="txtYearForLocation"
                                         value={formValuesForByLocation.txtYearForLocation}
                                         options={yearList}
                                         getOptionLabel={(option) => `${option.Name}`}
                                         getOptionValue={(option) => `${option}`}
                                         onChange={(e) => updateStateForByLocation("txtYearForLocation", e)}
                                       />
                                     </Form.InputGroup>
                                     <Form.InputGroup label="Scheme" req="true" errorMsg={formValidationFarmersError["txtSchemeForLocation"]}>
                                       <Form.InputControl
                                         control="select"
                                         name="txtSchemeForLocation"
                                         value={formValuesForByLocation.txtSchemeForLocation}
                                         options={schemeList}
                                         getOptionLabel={(option) => `${option.SchemeName}`}
                                         getOptionValue={(option) => `${option}`}
                                         onChange={(e) => updateStateForByLocation("txtSchemeForLocation", e)}
                                       />
                                     </Form.InputGroup>
                                     <Form.InputGroup label="State" req="true" errorMsg={formValidationFarmersError["txtStateForByLocation"]}>
                                       <Form.InputControl
                                         control="select"
                                         name="txtStateForByLocation"
                                         value={formValuesForByLocation.txtStateForByLocation}
                                         options={stateForByLocationDropdownDataList}
                                         loader={isLoadingStateForByLocationDropdownDataList ? <Loader /> : null}
                                         getOptionLabel={(option) => `${option.StateMasterName}`}
                                         getOptionValue={(option) => `${option}`}
                                         onChange={(e) => updateStateForByLocation("txtStateForByLocation", e)}
                                         focus="true"
                                       />
                                     </Form.InputGroup>
                                     <Form.InputGroup label="District" req="true" errorMsg={formValidationFarmersError["txtDistrictForByLocation"]}>
                                       <Form.InputControl
                                         control="select"
                                         name="txtDistrictForByLocation"
                                         value={formValuesForByLocation.txtDistrictForByLocation}
                                         options={districtForByLocationDropdownDataList}
                                         loader={isLoadingDistrictForByLocationDropdownDataList ? <Loader /> : null}
                                         getOptionLabel={(option) => `${option.level3Name}`}
                                         getOptionValue={(option) => `${option}`}
                                         onChange={(e) => updateStateForByLocation("txtDistrictForByLocation", e)}
                                       />
                                     </Form.InputGroup>
                                     <Form.InputGroup label={lableTalukAnything} req="true" errorMsg={formValidationFarmersError["txtSubDistrictForByLocation"]}>
                                       <Form.InputControl
                                         control="select"
                                         name="txtSubDistrictForByLocation"
                                         value={formValuesForByLocation.txtSubDistrictForByLocation}
                                         options={subDistrictForByLocationDropdownDataList}
                                         loader={isLoadingSubDistrictForByLocationDropdownDataList ? <Loader /> : null}
                                         getOptionLabel={(option) => `${option.level4Name}`}
                                         getOptionValue={(option) => `${option}`}
                                         onChange={(e) => updateStateForByLocation("txtSubDistrictForByLocation", e)}
                                       />
                                     </Form.InputGroup>
               
                                     <Form.InputGroup label={lablelevel5} req="true" errorMsg={formValidationFarmersError["txtlevel5ByLocation"]}>
                                       <Form.InputControl
                                         control="select"
                                         name="txtlevel5ByLocation"
                                         value={formValuesForByLocation.txtlevel5ByLocation}
                                         options={level5ByLocationDropdownDataList}
                                         loader={isLoadinglevel5ByLocationDropdownDataList ? <Loader /> : null}
                                         getOptionLabel={(option) => `${option.level5Name}`}
                                         getOptionValue={(option) => `${option}`}
                                         onChange={(e) => updateStateForByLocation("txtlevel5ByLocation", e)}
                                       />
                                     </Form.InputGroup>
               
                                     {lablelevel6 === null ? null : (
                                       <Form.InputGroup label={lablelevel6} req="true" errorMsg={formValidationFarmersError["txtlevel6ByLocation"]}>
                                         <Form.InputControl
                                           control="select"
                                           name="txtlevel6ByLocation"
                                           value={formValuesForByLocation.txtlevel6ByLocation}
                                           options={level6ByLocationDropdownDataList}
                                           loader={isLoadinglevel6ByLocationDropdownDataList ? <Loader /> : null}
                                           getOptionLabel={(option) => `${option.level6Name}`}
                                           getOptionValue={(option) => `${option}`}
                                           onChange={(e) => updateStateForByLocation("txtlevel6ByLocation", e)}
                                         />
                                       </Form.InputGroup>
                                     )}
                                     <Form.InputGroup label={lableVillageForByLocation} req="true" errorMsg={formValidationFarmersError["txtVillageForByLocation"]}>
                                       <Form.InputControl
                                         control="select"
                                         name="txtVillageForByLocation"
                                         value={formValuesForByLocation.txtVillageForByLocation}
                                         options={villageForByLocationDropdownDataList}
                                         loader={isLoadingVillageForByLocationDropdownDataList ? <Loader /> : null}
                                         getOptionLabel={(option) => `${option.level7Name}`}
                                         getOptionValue={(option) => `${option}`}
                                         onChange={(e) => updateStateForByLocation("txtVillageForByLocation", e)}
                                       />
                                     </Form.InputGroup>
                                   </Form.Group>
                                 </div>
                               )}
                               {selectedValidateOption !== "6" && selectedValidateOption !== "7" ? (
                                 <div className={BizClass.ValidateFormFooter}>
                                     <Button className={BizClass.FormFooterButton} trigger={btnLoaderActive && "true"} onClick={() => validateFarmerOnClick()}>
                                       Validate
                                     </Button> 
                                 </div>
                               ) : null}
                             </form>
                           </div>
                         </div>
                       </div>
                       <div className={BizClass.Div}>
                         <div className={BizClass.InfoDiv}>
                           <div className={BizClass.FarmerInfoDiv}>
                             <div className={BizClass.Title}>
                               <h3>Farmer Information</h3>
                             </div>
                             {selectedValidateOption !== "6" && selectedValidateOption !== "7" ? (
                               <div className={BizClass.Content}>
                                 <Form.Group column="3" controlwidth="360px">
                                   <Form.InputGroup label="Farmer Name">
                                     <p className={BizClass.ContentPresenter}>{selectedFarmer && selectedFarmer.farmerName}</p>
                                   </Form.InputGroup>
                                   <Form.InputGroup label="Mobile No">
                                     <p className={BizClass.ContentPresenter}>{selectedFarmer && selectedFarmer.mobile}</p>
                                   </Form.InputGroup>
                                   <Form.InputGroup label="State">
                                     <p className={BizClass.ContentPresenter}>
                                       {selectedFarmer && selectedFarmer.state
                                         ? selectedFarmer.state
                                         : selectedFarmer.stateName
                                         ? selectedFarmer.stateName
                                         : selectedFarmer.resState
                                         ? selectedFarmer.resState
                                         : ""}
                                     </p>
                                   </Form.InputGroup>
                                   <Form.InputGroup label="District">
                                     <p className={BizClass.ContentPresenter}>
                                       {selectedFarmer && selectedFarmer.district
                                         ? selectedFarmer.district
                                         : selectedFarmer.districtName
                                         ? selectedFarmer.districtName
                                         : selectedFarmer.resDistrict
                                         ? selectedFarmer.resDistrict
                                         : ""}
                                     </p>
                                   </Form.InputGroup>
                                   <Form.InputGroup label="Taluka">
                                     <p className={BizClass.ContentPresenter}>
                                       {selectedFarmer && selectedFarmer.subDistrict
                                         ? selectedFarmer.subDistrict
                                         : selectedFarmer.resSubDistrict
                                         ? selectedFarmer.resSubDistrict
                                         : ""}
                                     </p>
                                   </Form.InputGroup>
                                   <Form.InputGroup label="Village">
                                     <p className={BizClass.ContentPresenter}>
                                       {selectedFarmer && selectedFarmer.village
                                         ? selectedFarmer.village
                                         : selectedFarmer.villageName
                                         ? selectedFarmer.villageName
                                         : selectedFarmer.resVillage
                                         ? selectedFarmer.resVillage
                                         : ""}
                                     </p>
                                   </Form.InputGroup>
                                 </Form.Group>
                                 <div className={BizClass.ContentDiv}>
                                   <div className={BizClass.fetch_claim_reset_btn}>
                                     <Form.Group column="2" controlwidth="360px">
                                       <Form.CustomGroup column={4} columntemplate="140px 140px auto">
                                         <Form.InputGroup label="" req="true" errorMsg={formValidationFarmersInfoError["txtYearForFarmerInfo"]}>
                                           <Form.InputControl
                                             control="select"
                                             label="Year"
                                             name="txtYearForFarmerInfo"
                                             value={formValuesForFarmerInfo.txtYearForFarmerInfo}
                                             options={yearList}
                                             getOptionLabel={(option) => `${option.Name}`}
                                             getOptionValue={(option) => `${option}`}
                                             onChange={(e) => updateStateForFarmerInfo("txtYearForFarmerInfo", e)}
                                             isDisabled={stateYearAndSeason === "YRSSNNO"}
                                           />
                                         </Form.InputGroup>
                                         <Form.InputGroup label="" req="true" errorMsg={formValidationFarmersInfoError["txtSeasonForFarmerInfo"]}>
                                           <Form.InputControl
                                             control="select"
                                             label="Season"
                                             name="txtSeasonForFarmerInfo"
                                             value={formValuesForFarmerInfo.txtSeasonForFarmerInfo}
                                             options={seasonForPolicyNumberDropdownDataList}
                                             getOptionLabel={(option) => `${option.CropSeasonName}`}
                                             getOptionValue={(option) => `${option}`}
                                             onChange={(e) => updateStateForFarmerInfo("txtSeasonForFarmerInfo", e)}
                                             isDisabled={stateYearAndSeason === "YRSSNNO"}
                                           />
                                         </Form.InputGroup>
                                         <Form.InputGroup label="" req="true" errorMsg={formValidationFarmersInfoError["txtSchemeForFarmerInfo"]}>
                                           <Form.InputControl
                                             control="select"
                                             label="Scheme"
                                             name="txtSchemeForFarmerInfo"
                                             value={formValuesForFarmerInfo.txtSchemeForFarmerInfo}
                                             options={schemeList}
                                             getOptionLabel={(option) => `${option.SchemeName}`}
                                             getOptionValue={(option) => `${option}`}
                                             onChange={(e) => updateStateForFarmerInfo("txtSchemeForFarmerInfo", e)}
                                             isDisabled={true}
                                           />
                                         </Form.InputGroup>
                                       </Form.CustomGroup>
                                     </Form.Group>
                                     <Form.Group column="3" controlwidth="">
                                       <div className={BizClass.InputBox} style={{ display: "flex" }}>
                                         <Button
                                           className={BizClass.Button}
                                           trigger={btnLoaderFarmerGreivenceInfoActive && "true"}
                                           onClick={() => getPolicyOfFarmerGreivenceOnClick()}
                                         >
                                           Fetch Details
                                         </Button>
                                         <Button className={BizClass.Button} trigger={btnLoaderClaimStatusActive && "true"} onClick={() => getClaimStatusOnClick()}>
                                           Claim Status
                                         </Button>
                                         <Button className={BizClass.Button} onClick={() => ResetYrSsnSchmApplicationDataOnClick()}>
                                           Reset
                                         </Button>
                                       </div>
                                     </Form.Group>
                                   </div>
                                   <Form.Group column="3" controlwidth="360px" style={{ background: "#d6dbdf", padding: "5px", "border-radius": "4px" }}>
                                     <Form.InputGroup label="Insurance Company">
                                       <p className={BizClass.ContentPresenter}>
                                         {selectedInsuranceDetails && selectedInsuranceDetails.insuranceCompanyName ? selectedInsuranceDetails.insuranceCompanyName : ""}
                                       </p>
                                     </Form.InputGroup>
                                     <Form.InputGroup label="Application No.">
                                       <p className={BizClass.ContentPresenter}>
                                         {selectedClaimOrGrievence === "CI"
                                           ? selectedInsuranceDetails && selectedInsuranceDetails.applicationNo
                                             ? selectedInsuranceDetails.applicationNo
                                             : ""
                                           : selectedInsuranceDetails && selectedInsuranceDetails.applicationNo
                                           ? selectedInsuranceDetails.applicationNo
                                           : ""}
                                       </p>
                                     </Form.InputGroup>
                                     <Form.InputGroup label="Farmer Premium">
                                       <p className={BizClass.ContentPresenter}>
                                         {selectedClaimOrGrievence === "CI"
                                           ? selectedInsuranceDetails && selectedInsuranceDetails.farmerPremium
                                             ? selectedInsuranceDetails.farmerPremium
                                             : ""
                                           : selectedInsuranceDetails && selectedInsuranceDetails.policyPremium
                                           ? selectedInsuranceDetails.policyPremium
                                           : ""}
                                       </p>
                                     </Form.InputGroup>
                                     <Form.InputGroup label="Village">
                                       <p className={BizClass.ContentPresenter}>
                                         {selectedClaimOrGrievence === "CI"
                                           ? selectedInsuranceDetails && selectedInsuranceDetails.plotVillageName
                                             ? selectedInsuranceDetails.plotVillageName
                                             : ""
                                           : selectedInsuranceDetails && selectedInsuranceDetails.plotVillageName
                                           ? selectedInsuranceDetails.plotVillageName
                                           : ""}
                                       </p>
                                     </Form.InputGroup>
                                     <Form.InputGroup label="Area In Hactare">
                                       <p className={BizClass.ContentPresenter}>
                                         {selectedClaimOrGrievence === "CI"
                                           ? selectedInsuranceDetails && selectedInsuranceDetails.area
                                             ? selectedInsuranceDetails.area
                                             : ""
                                           : selectedInsuranceDetails && selectedInsuranceDetails.policyArea
                                           ? selectedInsuranceDetails.policyArea
                                           : ""}
                                       </p>
                                     </Form.InputGroup>
                                     <Form.InputGroup label="Crop Name">
                                       <p className={BizClass.ContentPresenter}>
                                         {selectedClaimOrGrievence === "CI"
                                           ? selectedInsuranceDetails && selectedInsuranceDetails.cropName
                                             ? selectedInsuranceDetails.cropName
                                             : ""
                                           : selectedInsuranceDetails && selectedInsuranceDetails.cropName
                                           ? selectedInsuranceDetails.cropName
                                           : ""}
                                       </p>
                                     </Form.InputGroup>
                                   </Form.Group>
                                 </div>
                               </div>
                             ) : (
                               <div className={BizClass.Content}>
                                 <Form.Group column="4" controlwidth="360px">
                                 <Form.InputGroup req="true" label="Farmer Mobile No." errorMsg={formValidationFarmersErrorForNonRegFarmerOrOffline["txtMobileForNonRegFarmerOrOffline"]}>
                                         <Form.InputControl
                                           control="input"
                                           type="text"
                                           name="txtMobileForNonRegFarmerOrOffline"
                                           value={formValuesForByNonRegFarmerOrOffline.txtMobileForNonRegFarmerOrOffline}
                                           maxLength={10}
                                           minLength={10}
                                           onChange={(e) => updateStateForByNonRegFarmerOrOffline("txtMobileForNonRegFarmerOrOffline", e.target.value.replace(/\D/g, ""))}
                                           disabled={nonRegisteredFarmerDetails && nonRegisteredFarmerDetails.length > 0}
                                        />
                                       </Form.InputGroup>
                                       <Form.InputGroup req="true" label="Farmer Name" errorMsg={formValidationFarmersErrorForNonRegFarmerOrOffline["txtFarmerNameForNonRegFarmerOrOffline"]}>
                                         <Form.InputControl
                                           control="input"
                                           type="text"
                                           name="txtFarmerNameForNonRegFarmerOrOffline"
                                           value={formValuesForByNonRegFarmerOrOffline.txtFarmerNameForNonRegFarmerOrOffline}
                                           onChange={(e) => updateStateForByNonRegFarmerOrOffline("txtFarmerNameForNonRegFarmerOrOffline", e.target.value)}
                                           disabled={nonRegisteredFarmerDetails && nonRegisteredFarmerDetails.length > 0}
                                        />
                                       </Form.InputGroup>    
                                   <Form.InputGroup label="Season" req="true" errorMsg={formValidationFarmersErrorForNonRegFarmerOrOffline["txtSeasonForNonRegFarmerOrOffline"]}>
                                     <Form.InputControl
                                       control="select"
                                       name="txtSeasonForNonRegFarmerOrOffline"
                                       value={formValuesForByNonRegFarmerOrOffline.txtSeasonForNonRegFarmerOrOffline}
                                       options={seasonForPolicyNumberDropdownDataList}
                                       getOptionLabel={(option) => `${option.CropSeasonName}`}
                                       getOptionValue={(option) => `${option}`}
                                       onChange={(e) => updateStateForByNonRegFarmerOrOffline("txtSeasonForNonRegFarmerOrOffline", e)}
                                       
                                    />
                                   </Form.InputGroup>
                                   <Form.InputGroup label="Year" req="true" errorMsg={formValidationFarmersErrorForNonRegFarmerOrOffline["txtYearForNonRegFarmerOrOffline"]}>
                                     <Form.InputControl
                                       control="select"
                                       name="txtYearForNonRegFarmerOrOffline"
                                       value={formValuesForByNonRegFarmerOrOffline.txtYearForNonRegFarmerOrOffline}
                                       options={yearList}
                                       getOptionLabel={(option) => `${option.Name}`}
                                       getOptionValue={(option) => `${option}`}
                                       onChange={(e) => updateStateForByNonRegFarmerOrOffline("txtYearForNonRegFarmerOrOffline", e)}
                                       
                                     />
                                   </Form.InputGroup>
                                   <Form.InputGroup label="Scheme" req="true" errorMsg={formValidationFarmersErrorForNonRegFarmerOrOffline["txtSchemeForNonRegFarmerOrOffline"]}>
                                     <Form.InputControl
                                       control="select"
                                       name="txtSchemeForNonRegFarmerOrOffline"
                                       value={formValuesForByNonRegFarmerOrOffline.txtSchemeForNonRegFarmerOrOffline}
                                       options={schemeList}
                                       getOptionLabel={(option) => `${option.SchemeName}`}
                                       getOptionValue={(option) => `${option}`}
                                       onChange={(e) => updateStateForByNonRegFarmerOrOffline("txtSchemeForNonRegFarmerOrOffline", e)}
                                       
                                     />
                                   </Form.InputGroup>
                                   <Form.InputGroup label="State" req="true" errorMsg={formValidationFarmersErrorForNonRegFarmerOrOffline["txtStateForByNonRegFarmerOrOffline"]}>
                                     <Form.InputControl
                                       control="select"
                                       name="txtStateForByNonRegFarmerOrOffline"
                                       value={formValuesForByNonRegFarmerOrOffline.txtStateForByNonRegFarmerOrOffline}
                                       options={stateForByNonRegFarmerOrOfflineDropdownDataList}
                                       loader={isLoadingStateForByNonRegFarmerOrOfflineDropdownDataList ? <Loader /> : null}
                                       getOptionLabel={(option) => `${option.StateMasterName}`}
                                       getOptionValue={(option) => `${option}`}
                                       onChange={(e) => updateStateForByNonRegFarmerOrOffline("txtStateForByNonRegFarmerOrOffline", e)}
                                       
                                     />
                                   </Form.InputGroup>
                                   <Form.InputGroup label="District" req="true" errorMsg={formValidationFarmersErrorForNonRegFarmerOrOffline["txtDistrictForByNonRegFarmerOrOffline"]}>
                                     <Form.InputControl
                                       control="select"
                                       name="txtDistrictForByNonRegFarmerOrOffline"
                                       value={formValuesForByNonRegFarmerOrOffline.txtDistrictForByNonRegFarmerOrOffline}
                                       options={districtForByNonRegFarmerOrOfflineDropdownDataList}
                                       loader={isLoadingDistrictForByNonRegFarmerOrOfflineDropdownDataList ? <Loader /> : null}
                                       getOptionLabel={(option) => `${option.level3Name}`}
                                       getOptionValue={(option) => `${option}`}
                                       onChange={(e) => updateStateForByNonRegFarmerOrOffline("txtDistrictForByNonRegFarmerOrOffline", e)}
                                       
                                     />
                                   </Form.InputGroup>
                                   <Form.InputGroup
                                     label={lableTalukAnythingNonRegFarmerOrOffline}
                                     req="true"
                                     errorMsg={formValidationFarmersErrorForNonRegFarmerOrOffline["txtSubDistrictForByNonRegFarmerOrOffline"]}
                                   >
                                     <Form.InputControl
                                       control="select"
                                       name="txtSubDistrictForByNonRegFarmerOrOffline"
                                       value={formValuesForByNonRegFarmerOrOffline.txtSubDistrictForByNonRegFarmerOrOffline}
                                       options={subDistrictForByNonRegFarmerOrOfflineDropdownDataList}
                                       loader={isLoadingSubDistrictForByNonRegFarmerOrOfflineDropdownDataList ? <Loader /> : null}
                                       getOptionLabel={(option) => `${option.level4Name}`}
                                       getOptionValue={(option) => `${option}`}
                                       onChange={(e) => updateStateForByNonRegFarmerOrOffline("txtSubDistrictForByNonRegFarmerOrOffline", e)}
                                       
                                     />
                                   </Form.InputGroup>
               
                                   <Form.InputGroup
                                     label={lablelevel5NonRegFarmerOrOffline}
                                     req="true"
                                     errorMsg={formValidationFarmersErrorForNonRegFarmerOrOffline["txtlevel5ByNonRegFarmerOrOffline"]}
                                   >
                                     <Form.InputControl
                                       control="select"
                                       name="txtlevel5ByNonRegFarmerOrOffline"
                                       value={formValuesForByNonRegFarmerOrOffline.txtlevel5ByNonRegFarmerOrOffline}
                                       options={level5ByNonRegFarmerOrOfflineDropdownDataList}
                                       loader={isLoadinglevel5ByNonRegFarmerOrOfflineDropdownDataList ? <Loader /> : null}
                                       getOptionLabel={(option) => `${option.level5Name}`}
                                       getOptionValue={(option) => `${option}`}
                                       onChange={(e) => updateStateForByNonRegFarmerOrOffline("txtlevel5ByNonRegFarmerOrOffline", e)}
                                       
                                     />
                                   </Form.InputGroup>
               
                                   {lablelevel6NonRegFarmerOrOffline === null ? null : (
                                     <Form.InputGroup
                                       label={lablelevel6NonRegFarmerOrOffline}
                                       req="true"
                                       errorMsg={formValidationFarmersErrorForNonRegFarmerOrOffline["txtlevel6ByNonRegFarmerOrOffline"]}
                                     >
                                       <Form.InputControl
                                         control="select"
                                         name="txtlevel6ByNonRegFarmerOrOffline"
                                         value={formValuesForByNonRegFarmerOrOffline.txtlevel6ByNonRegFarmerOrOffline}
                                         options={level6ByNonRegFarmerOrOfflineDropdownDataList}
                                         loader={isLoadinglevel6ByNonRegFarmerOrOfflineDropdownDataList ? <Loader /> : null}
                                         getOptionLabel={(option) => `${option.level6Name}`}
                                         getOptionValue={(option) => `${option}`}
                                         onChange={(e) => updateStateForByNonRegFarmerOrOffline("txtlevel6ByNonRegFarmerOrOffline", e)}
                                         
                                      />
                                     </Form.InputGroup>
                                   )}
                                   <Form.InputGroup
                                     label={lableVillageForByNonRegFarmerOrOffline}
                                     req="true"
                                     errorMsg={formValidationFarmersErrorForNonRegFarmerOrOffline["txtVillageForByNonRegFarmerOrOffline"]}
                                   >
                                     <Form.InputControl
                                       control="select"
                                       name="txtVillageForByNonRegFarmerOrOffline"
                                       value={formValuesForByNonRegFarmerOrOffline.txtVillageForByNonRegFarmerOrOffline}
                                       options={villageForByNonRegFarmerOrOfflineDropdownDataList}
                                       loader={isLoadingVillageForByNonRegFarmerOrOfflineDropdownDataList ? <Loader /> : null}
                                       getOptionLabel={(option) => `${option.level7Name}`}
                                       getOptionValue={(option) => `${option}`}
                                       onChange={(e) => updateStateForByNonRegFarmerOrOffline("txtVillageForByNonRegFarmerOrOffline", e)}
                                       
                                    />
                                   </Form.InputGroup>
                                   {selectedValidateOption === "6" ? (
                                     <>
                                       <Form.InputGroup req="false" label="PinCode">
                                         <Form.InputControl
                                           control="input"
                                           type="text"
                                           name="txtPinCode"
                                           value={formValuesForByNonRegFarmerOrOffline.txtPinCode}
                                           maxLength={6}
                                           minLength={6}
                                           onChange={(e) => updateStateForByNonRegFarmerOrOffline("txtPinCode", e.target.value.replace(/\D/g, ""))}
                                           
                                         />
                                       </Form.InputGroup>
                                       <Form.InputGroup column={3} row={1} label="Address">
                                         <Form.InputControl
                                           control="textarea"
                                           name="txtAddress"
                                           value={formValuesForByNonRegFarmerOrOffline.txtAddress}
                                           onChange={(e) => updateStateForByNonRegFarmerOrOffline("txtAddress", e.target.value)}
                                           
                                         />
                                       </Form.InputGroup>
                                       <Form.InputGroup req="false" label="Crop"  errorMsg={formValidationFarmersErrorForNonRegFarmerOrOffline["txtCropForCalculate"]}>
                                         <Form.InputControl
                                           control="select"
                                           name="txtCropForCalculate"
                                           value={formValuesForByNonRegFarmerOrOffline.txtCropForCalculate}
                                           options={cropForNonRegFarmerOrOfflineDropdownDataList}
                                           isLoading={isLoadingCropForNonRegFarmerOrOfflineDropdownDataList}
                                           getOptionLabel={(option) => `${option.cropName}`}
                                           getOptionValue={(option) => `${option}`}
                                           onChange={(e) => updateStateForByNonRegFarmerOrOffline("txtCropForCalculate", e)}
                                           
                                         />
                                       </Form.InputGroup>
                                       <Form.InputGroup label="Insurance Company" col={1}>
                                         <p className={BizClass.ContentPresenter}>
                                           {formValuesForByNonRegFarmerOrOffline.txtCropForCalculate &&
                                           formValuesForByNonRegFarmerOrOffline.txtCropForCalculate.insuranceCompanyName
                                             ? formValuesForByNonRegFarmerOrOffline.txtCropForCalculate.insuranceCompanyName
                                             : ""}
                                         </p>
                                       </Form.InputGroup>
                                       <Form.InputGroup label="Area In Hectare"  req="false"
                                        errorMsg={formValidationFarmersErrorForNonRegFarmerOrOffline["txtAreaInHectareForCalculator"]}>
                                         <Form.InputControl
                                           control="input"
                                           maxlength="6"
                                           minlength="3"
                                           type="text"
                                           name="txtAreaInHectareForCalculator"
                                           value={formValuesForByNonRegFarmerOrOffline.txtAreaInHectareForCalculator}
                                           onChange={(e) => updateStateForByNonRegFarmerOrOffline("txtAreaInHectareForCalculator", e.target.value)}
                                          
                                         />
                                       </Form.InputGroup>
                                       <Form.InputGroup label="Premiums">
                                         <p className={BizClass.ContentPresenter}>
                                           {formValuesForByNonRegFarmerOrOffline.CalculatedSumInsured && formValuesForByNonRegFarmerOrOffline.CalculatedSumInsured
                                             ? formValuesForByNonRegFarmerOrOffline.CalculatedSumInsured
                                             : ""}
                                         </p>
                                       </Form.InputGroup>{" "}
                                     </>
                                   ) : null}
                                   {selectedValidateOption === "7" ? (
                                     <>
                                       <Form.InputGroup label="Insurance Company" req="true" errorMsg={formValidationFarmersErrorForNonRegFarmerOrOffline["txtInsuranceCompany"]}>
                                         <Form.InputControl
                                           control="select"
                                           label=""
                                           name="txtInsuranceCompany"
                                           loader={isLoadingInsuranceCompanyList ? <Loader /> : null}
                                           options={insuranceCompanyList}
                                           value={formValuesForByNonRegFarmerOrOffline.txtInsuranceCompany}
                                           getOptionLabel={(option) => `${option.CompanyName}`}
                                           getOptionValue={(option) => `${option}`}
                                           onChange={(e) => updateStateForByNonRegFarmerOrOffline("txtInsuranceCompany", e)}
                                         />
                                       </Form.InputGroup>
                                       <Form.InputGroup label="Policy No" req="true" errorMsg={formValidationFarmersErrorForNonRegFarmerOrOffline["txtPolicy"]}>
                                         <Form.InputControl
                                           control="input"
                                           name="txtPolicy"
                                           maxLength={20}
                                           value={formValuesForByNonRegFarmerOrOffline.txtPolicy}
                                           onChange={(e) => updateStateForByNonRegFarmerOrOffline("txtPolicy", e.target.value)}
                                         />
                                       </Form.InputGroup>{" "}
                                       <Form.InputGroup label="Application No" req="true" errorMsg={formValidationFarmersErrorForNonRegFarmerOrOffline["txtApplication"]}>
                                         <Form.InputControl
                                           control="input"
                                           name="txtApplication"
                                           maxLength={50}
                                           value={formValuesForByNonRegFarmerOrOffline.txtApplication}
                                           onChange={(e) => updateStateForByNonRegFarmerOrOffline("txtApplication", e.target.value)}
                                         />
                                       </Form.InputGroup>
                                     </>
                                   ) : null}
                                 </Form.Group>
                               </div>
                             )}
                           </div>
                           {selectedValidateOption !== "6" && selectedValidateOption !== "7" ? (
                             <div className={BizClass.ValidateBox}>
                               <div className={BizClass.ValidateTitle}>
                                 <h3>Farmer Ticket Summary And Tick History</h3>{" "}
                                 {fetchfarmersummary !== "" ? (
                                   <Button trigger={btnLoaderActiveTicketSummary && "true"} className={BizClass.FormFooterButton} onClick={() => fetchfarmersTicketSummary()}>
                                     Show Old Tickets
                                   </Button>
                                 ) : null}
                               </div>
                               <div className={BizClass.Farmer_Ticket_Box}>
                                 {/* {isLoadingPageData ? <Loader /> : null} */}
                                 <div className={BizClass.Farmer_Ticket_SummaryBoard}>
                                   {farmersTicketSummaryData && farmersTicketSummaryData.length > 0 ? (
                                     farmersTicketSummaryData.map((x) => {
                                       return (
                                         <button className={BizClass.Farmer_Ticket_ScoreBoard} type="button" onClick={() => getTicketHistoryOnClick(x.TicketStatusID)}>
                                           <div>
                                             <span>{x.TicketStatus}</span>
                                             <span>{x.Total}</span>
                                           </div>
                                         </button>
                                       );
                                     })
                                   ) : (
                                     <>
                                       <div className={BizClass.Farmer_Ticket_ScoreBoard}>
                                         <span>Open</span>
                                         <span>0</span>
                                       </div>
                                       <div className={BizClass.Farmer_Ticket_ScoreBoard}>
                                         <span>Resolved</span>
                                         <span>0</span>
                                       </div>
                                       <div className={BizClass.Farmer_Ticket_ScoreBoard}>
                                         <span>Total</span>
                                         <span>0</span>
                                       </div>
                                     </>
                                   )}
                                 </div>
                               </div>
                             </div>
                           ) : null}
                           <div className={BizClass.CreationDiv}>
                             <div className={BizClass.Title}>
                               <h3>Ticket Creation</h3>
                             </div>
                             <div className={BizClass.Content}>
                               <Form.Group column="2" controlwidth="360px">
                                 <Form.InputGroup label="Ticket Type" errorMsg="" column={3}>
                                   <ul className={BizClass.ValidateTabGroup}>
                                     <button type="button" className={selectedOption === "1" && BizClass.Active} onClick={() => selectedOptionOnClick("GR")}>
                                       <div className={BizClass.ValidateTabCheckBox} />
                                       <span>Grievance</span>
                                     </button>
                                     <button type="button" className={selectedOption === "2" && BizClass.Active} onClick={() => selectedOptionOnClick("IN")}>
                                       <div className={BizClass.ValidateTabCheckBox} />
                                       <span>Information</span>
                                     </button>
                                     {(formValuesForFarmerInfo.txtYearForFarmerInfo &&
                      formValuesForFarmerInfo.txtYearForFarmerInfo.Value &&
                      formValuesForFarmerInfo.txtYearForFarmerInfo.Value <= 2023) ? null :
                      <button type="button" className={selectedOption === "4" && BizClass.Active} onClick={() => selectedOptionOnClick("LO")}>
                          <div className={BizClass.ValidateTabCheckBox} />
                          <span>Crop Loss Intimation</span>
                        </button> }
                                     {/* {formValuesForFarmerInfo.txtYearForFarmerInfo &&
                                     formValuesForFarmerInfo.txtYearForFarmerInfo.Value &&
                                     formValuesForFarmerInfo.txtYearForFarmerInfo.Value < runningCurrentYear ? null : (
                                       <button type="button" className={selectedOption === "4" && BizClass.Active} onClick={() => selectedOptionOnClick("LO")}>
                                         <div className={BizClass.ValidateTabCheckBox} />
                                         <span>Crop Loss Intimation</span>
                                       </button>
                                     )} */}
                                   </ul>
                                 </Form.InputGroup>
                                 {selectedOption === "4" ? (
                                   <Form.InputGroup label="" req="true" errorMsg="" column={4}>
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
                                         <button type="button" style={{ border: "none", width: "102px" }} />
                                       ) : selectedOptionCropStage === "2" || selectedOptionCropStage === "1" ? (
                                         <button type="button" style={{ border: "none", width: "84px" }} />
                                       ) : null}
               
                                       <button
                                         type="button"
                                         className={selectedOptionCropStage === "1" && BizClass.Active}
                                         onClick={() => selectedOptionOnClickCropStage("SCS")}
                                       >
                                         <div className={BizClass.ValidateTabCheckBox} />
                                         <span>Standing Crop Stage</span>
                                       </button>
                                       <button
                                         type="button"
                                         className={selectedOptionCropStage === "2" && BizClass.Active}
                                         onClick={() => selectedOptionOnClickCropStage("HS")}
                                       >
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
                                   <Form.InputGroup column={3} req="true" label="Other Sub Cat." errorMsg={formValidationSupportTicketError["txtOtherSubCategory"]}>
                                     <Form.InputControl
                                       control="select"
                                       name="txtOtherSubCategory"
                                       value={formValuesTicketCreation.txtOtherSubCategory}
                                       options={ticketCategoryOtherList}
                                       isLoading={isLoadingTicketCategoryOtherList}
                                       getOptionLabel={(option) => `${option.OtherCategoryName}`}
                                       getOptionValue={(option) => `${option}`}
                                       onChange={(e) => updateStateTicketCreation("txtOtherSubCategory", e)}
                                     />
                                   </Form.InputGroup>
                                 ) : null}
                                 {selectedOption === "4" ? (
                                   <Form.InputGroup column={3} req="true" label="Crop Stage" errorMsg={formValidationSupportTicketError["txtCropStage"]}>
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
                                       <Form.InputGroup label="Harvest Date" style={{paddingLeft:"9px"}} req="true" errorMsg={formValidationSupportTicketError["txtCropHarvestDate"]}>
                                         <Form.InputControl
                                           control="input"
                                           type="date"
                                           name="txtCropHarvestDate"
                                           style={{ width: "100px" }}
                                           value={formValuesTicketCreation.txtCropHarvestDate}
                                           onChange={(e) => updateStateTicketCreation(e.target.name, e.target.value)}
                                           max={dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD")}
                                           onKeyDown={(e) => e.preventDefault()}
                                         />
                                       </Form.InputGroup>
                                     ) : null}
                                     {selectedOptionCropStage === "2" || selectedOptionCropStage === "1" ? (
                                       <Form.InputGroup label="Loss Date" style={{paddingLeft:"12px"}} req="true" errorMsg={formValidationSupportTicketError["txtCropLossDate"]}>
                                         <Form.InputControl
                                           control="input"
                                           type="date"
                                           name="txtCropLossDate"
                                           style={{ width: "100px" }}
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
                                   <p className={BizClass.CounterDesc}>
                                     {formValuesTicketCreation.txtTicketDescription && formValuesTicketCreation.txtTicketDescription.length
                                       ? formValuesTicketCreation.txtTicketDescription.length
                                       : 0}{" "}
                                     / {500}
                                   </p>
                                 </Form.InputGroup>
                               </Form.Group>
                               <br />
                               <div className={BizClass.ValidateFormFooterBG}>
                                 <div className={BizClass.ValidateFormFooter}>
                                   <Button
                                     className={isBtndisabled === 0 ? BizClass.FormFooterButton : classNames(BizClass.disableFormFooterButton, BizClass.FormFooterButton)}
                                     disabled={isBtndisabled}
                                     trigger={btnLoaderSupportTicketActive && "true"}
                                     onClick={() => supportTicketOnClick()}
                                   >
                                     Submit
                                   </Button>
                                   <Button className={BizClass.FormFooterButton} onClick={() => clearAddTicketForm()} style={{display:"none"}}>
                                     Clear
                                   </Button>
                                 </div>
                               </div>
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>
                   </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> : <div className="ServiceSuccessPage__Div">
      <div className="ServiceSuccessPage__ContentBox">
      {servicesuccessData && servicesuccessData === "TC" ?
        <h2>Success!</h2> : <h2>Unfortunately!</h2> }
        <p>
        {servicesuccessData && servicesuccessData === "TC"
            ? `Thanks, a ticket has been generated"
              with Ticket No. ${getSupportTicketNo}`
            : servicesuccessData === "CD"
             ? "Call is disconnected"
             :""
            }
        </p>
        {servicesuccessData && servicesuccessData === "TC" ? <>
        <p>if you want to Create more ticket then Click on Create More Button <Button onClick={() => CreateMoreBtnOnClick()}>Create More</Button> </p>
        <p>Otherwise Please Close The Tab, Please ask for the feedback to the farmer</p></> : <><p>Please Close The Tab</p></> }
      </div>
      {servicesuccessData && servicesuccessData === "TC" ?
      <img src={success} alt="Success" /> : <img src={callDisconnected} alt="Call-Disconnected" />  }
      
      
    </div>}
    </>
  );
}

export default KrphAllActivities;

function FarmerListModal({ toggleModal, farmersData, onGridReady, onCellDoubleClicked, onChangeFarmersDetails }) {
    return (
      <Modal
        title={`Farmer List - Number Of Records(${farmersData && farmersData.length > 0 ? farmersData.length : 0})`}
        varient="bottom"
        show={toggleModal}
        width="100vw"
        right={0}
        height="60vh"
      >
        <Modal.Body>
          <div className={BizClass.ModalBox}>
            <PageBar>
              <PageBar.Search onChange={(e) => onChangeFarmersDetails(e.target.value)} />
            </PageBar>
            <DataGrid
              rowData={farmersData}
              onGridReady={onGridReady}
              rowSelection="single"
              suppressRowClickSelection="true"
              onCellDoubleClicked={(event) => onCellDoubleClicked(event)}
            >
              <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
              <DataGrid.Column field="mobile" headerName="Mobile No" width="120px" />
              <DataGrid.Column field="farmerName" headerName="Farmer Name" width="190px" />
              <DataGrid.Column field="relation" headerName="Relation" width="140px" />
              <DataGrid.Column field="relativeName" headerName="Relative Name" width="180px" />
              <DataGrid.Column field="resState" headerName="State Name" width="150px" />
              <DataGrid.Column field="resDistrict" headerName="District Name" width="140px" />
              <DataGrid.Column field="resVillage" headerName="Village Name" width="160px" />
              <DataGrid.Column
                field="policyPremium"
                headerName="Policy Premium"
                width="140px"
                cellRenderer={(node) => {
                  return node.data && node.data.policyPremium ? parseFloat(node.data.policyPremium).toFixed(2) : null;
                }}
              />
              <DataGrid.Column
                field="policyArea"
                headerName="Policy Area"
                width="135px"
                cellRenderer={(node) => {
                  return node.data && node.data.policyArea ? parseFloat(node.data.policyArea).toFixed(4) : null;
                }}
              />
              <DataGrid.Column
                field="#"
                headerName="Land Survey Number"
                width="180"
                cellRenderer={(node) => {
                  return node.data.applicationList.length > 0 ? node.data.applicationList[0].landSurveyNumber : null;
                }}
              />
              <DataGrid.Column
                field="#"
                headerName="Land Division Number"
                width="180"
                cellRenderer={(node) => {
                  return node.data.applicationList.length > 0 ? node.data.applicationList[0].landDivisionNumber : null;
                }}
              />
              <DataGrid.Column
                field="#"
                headerName="Application Status"
                width="190"
                cellRenderer={(node) => {
                  return node.data.applicationList.length > 0 ? node.data.applicationList[0].applicationStatus : null;
                }}
              />
            </DataGrid>
          </div>
        </Modal.Body>
        <Modal.Footer />
      </Modal>
    );
  }
  
  const actionTemplateGreivence = (props) => {
    return (
      <div style={{ display: "flex", gap: "4px", marginTop: "2px" }}>
        <CgFileDocument
          style={{ fontSize: "16px", color: "#000000", cursor: "pointer" }}
          onClick={() => props.toggleClaimStatusModal(props.data)}
          title="Cliam Status"
        />
      </div>
    );
  };
  
  function InsuranceCompanyModalGreivence({
    toggleInsuranceCompanyModalGreivence,
    onCellDoubleClickedDetailsGreivence,
    // A onGridReadySupportTicketGreivence,
    insuranceCompanyDataGreivence,
    isLoadingApplicationNoDataGreivence,
    getClaimStatusOnClick,
  }) {
    const toggleClaimStatusModal = (data) => {
      getClaimStatusOnClick(data.applicationNo);
    };
    return (
      <Modal title="Grievance" varient="bottom" width="100vw" show={toggleInsuranceCompanyModalGreivence} right={0} height="60vh">
        <Modal.Body>
          <div className={BizClass.ModalBox}>
            <PageBar>
              <PageBar.Search />
            </PageBar>
            <DataGrid
              rowData={insuranceCompanyDataGreivence}
              loader={isLoadingApplicationNoDataGreivence ? <Loader /> : null}
              rowSelection="single"
              suppressRowClickSelection="true"
              // A onGridReady={onGridReadySupportTicketGreivence}
              onCellDoubleClicked={(event) => onCellDoubleClickedDetailsGreivence(event)}
              components={{
                actionTemplate: actionTemplateGreivence,
              }}
              tooltipShowDelay={500}
              tooltipMouseTrack={true}
              tooltipInteraction={true}
            >
              <DataGrid.Column
                headerName="Action"
                lockPosition="1"
                pinned="left"
                width={80}
                cellRenderer="actionTemplate"
                cellRendererParams={{
                  toggleClaimStatusModal,
                }}
              />
              <DataGrid.Column field="insuranceCompanyName" headerName="Insurance Company Name" width="280px" headerTooltip="Name of the insurance company" />
              <DataGrid.Column
                field="policyID"
                headerName="Policy Number"
                width="180"
                headerTooltip="Policy no.: <scheme code><season code><state code><YY><Insurance policy>"
                // A cellRenderer={(node) => {
                // A  return node.data.applicationList.length > 0 ? node.data.applicationList[0].policyID : null;
                // A }}
              />
              <DataGrid.Column
                field="policyPremium"
                headerName="Total Premium"
                width="132px"
                headerTooltip="Total Premium of policy for all the applications against the policy"
              />
              <DataGrid.Column
                field="policyArea"
                headerName="Total Area"
                width="110px"
                headerTooltip="Total Area of policy in hectare, for all the applications against the policy"
              />
              <DataGrid.Column
                field="applicationNo"
                headerName="Application Number"
                width="170"
                headerTooltip="Application number against respective land and crop. It may be multiple against the same policy ID for different land"
                // A cellRenderer={(node) => {
                // A  return node.data.applicationList.length > 0 ? node.data.applicationList[0].applicationNo : null;
                // A  }}
              />
              <DataGrid.Column
                field="#"
                headerName="Scheme"
                width="275"
                headerTooltip="Scheme"
                cellRenderer={(node) => {
                  return node.data.scheme === "WBCIS"
                    ? "Weather Based Crop Insurance Scheme(WBCIS)"
                    : node.data.scheme === "PMFBY"
                    ? "Pradhan Mantri Fasal Bima Yojna(PMFBY)"
                    : "";
                }}
              />
              <DataGrid.Column
                field="cropName"
                headerName="Crop Name"
                width="140"
                headerTooltip="Crop Covered for the particular application against the policy"
                // A cellRenderer={(node) => {
                // A  return node.data.applicationList.length > 0 ? node.data.applicationList[0].cropName : null;
                // A }}
              />
              <DataGrid.Column
                field="farmerShare"
                headerName="Premium Share"
                width="140"
                headerTooltip="Premium Share of particular Application"
                // A cellRenderer={(node) => {
                // A  return node.data.applicationList.length > 0 ? node.data.applicationList[0].farmerShare : null;
                // A }}
              />
              <DataGrid.Column
                field="cropShare"
                headerName="Area covered under Application"
                width="235"
                headerTooltip="sowing crop area in land"
                // A cellRenderer={(node) => {
                // A  return node.data.applicationList.length > 0 ? node.data.applicationList[0].cropShare : null;
                // A }}
              />
              <DataGrid.Column
                field="landSurveyNumber"
                headerName="Land Number"
                width="125"
                headerTooltip="Registered Number of Total Land (Khata Number)"
                // A cellRenderer={(node) => {
                // A  return node.data.applicationList.length > 0 ? node.data.applicationList[0].landSurveyNumber : null;
                // A }}
              />
              <DataGrid.Column
                field="landDivisionNumber"
                headerName="Division Number"
                width="140"
                headerTooltip="Division number against of that particular Land"
                // A cellRenderer={(node) => {
                // A  return node.data.applicationList.length > 0 ? node.data.applicationList[0].landDivisionNumber : null;
                // A }}
              />
  
              <DataGrid.Column
                field="applicationSource"
                headerName="Source"
                width="90"
                headerTooltip="Source of the application submitted by Farmer"
                // A cellRenderer={(node) => {
                // A  return node.data.applicationList.length > 0 ? node.data.applicationList[0].applicationSource : null;
                // A  }}
              />
              <DataGrid.Column
                field="applicationStatus"
                headerName="Application Status"
                width="190"
                headerTooltip="Status of the application submitted by farmer"
                // A cellRenderer={(node) => {
                // A  return node.data.applicationList.length > 0 ? node.data.applicationList[0].applicationStatus : null;
                // A }}
              />
            </DataGrid>
          </div>
        </Modal.Body>
        <Modal.Footer />
      </Modal>
    );
  }
  
  function ClaimStatusModal({
    toggleClaimStatusModal,
    onGridReadyClaimStatus,
    claimStatusData,
    onChangeClamStatus,
    isLoadingClaimStatusDataData,
    openCustomeWindow,
    OnClickCustomeWindow,
    customeWindowWidth,
    customeWindowHeight,
  }) {
    return (
      <Modal
        title="Claim Status"
        varient="bottom"
        width={customeWindowWidth}
        show={toggleClaimStatusModal}
        left="90px"
        bottom="12.5px"
        height={customeWindowHeight}
      >
        <Modal.Header>
          <span style={{ width: "100%" }} />
          {openCustomeWindow === "S" ? (
            <AiOutlinePlusSquare title="Maximize The Window" style={{ cursor: "pointer", fontSize: "20px" }} onClick={() => OnClickCustomeWindow("S")} />
          ) : openCustomeWindow === "B" ? (
            <AiOutlineMinusSquare title="Minimize The Window" style={{ cursor: "pointer", fontSize: "20px" }} onClick={() => OnClickCustomeWindow("B")} />
          ) : null}
        </Modal.Header>
        <Modal.Body>
          <div className={BizClass.ModalBox}>
            <PageBar>
              <PageBar.Search onChange={(e) => onChangeClamStatus(e.target.value)} />
            </PageBar>
            <DataGrid
              rowData={claimStatusData}
              loader={isLoadingClaimStatusDataData ? <Loader /> : null}
              rowSelection="single"
              suppressRowClickSelection="true"
              onGridReady={onGridReadyClaimStatus}
            >
              <DataGrid.Column field="applicationNo" headerName="Application Number" width="175px" />
              <DataGrid.Column
                field="claimDate"
                headerName="Claim Date"
                width="115px"
                cellRenderer={(node) => {
                  return dateFormatDDMMYY(node.data.claimDate);
                }}
              />
              <DataGrid.Column field="amount" headerName="Claim Amount" width="135px" />
              <DataGrid.Column field="ClaimType" headerName="Claim Type" width="150px" />
              <DataGrid.Column field="UtrNumber" headerName="UTR Number" width="140px" />
              <DataGrid.Column field="aadharPaymentAccountNumber" headerName="Payment To Account Number" width="220px" />
              <DataGrid.Column field="aadharPaymentBankName" headerName="Payment To Bank Name" width="220px" />
              <DataGrid.Column field="aadharPaymentFarmerName" headerName="Farmer Name" width="290px" />
              <DataGrid.Column
                field="aadharPaymentAadharNumber"
                headerName="Aadhar Number"
                width="140px"
                valueGetter={(node) => {
                  return node.data.aadharPaymentAadharNumber ? node.data.aadharPaymentAadharNumber.replace(/.(?=.{4})/g, "x") : null;
                }}
              />
              <DataGrid.Column field="ClaimStatus" headerName="Claim Status" width="220px" />
              <DataGrid.Column field="paymentMode" headerName="Payment Mode" width="140px" />
              <DataGrid.Column field="Status" headerName="Status" width="155px" />
            </DataGrid>
          </div>
        </Modal.Body>
        <Modal.Footer />
      </Modal>
    );
  }

  const cellActionTemplate = (props) => {
    return (
      <div style={{ display: "flex", gap: "4px", marginTop: "2px" }}>
        <FcViewDetails
          style={{ fontSize: "16px", color: "#000000", cursor: "pointer" }}
          onClick={() => props.toggleSupportTicketDetailsModal(props.data)}
          title="Ticket Details"
        />
      </div>
    );
  };
  
  function TicketHistoryModal({
    toggleTicketHistoryModal,
    ticketHistoryData,
    selectedFarmer,
    onGridReadyTicketHistory,
    isLoadingTicketHistory,
    onChangeTicketHistory,
    openMyTicketPage,
  }) {
    const toggleSupportTicketDetailsModal = (data) => {
      openMyTicketPage(data);
    };
  
    return (
      <Modal
        title={`Ticket History - ${selectedFarmer ? selectedFarmer.farmerName : ""}(${selectedFarmer ? selectedFarmer.mobile : ""})`}
        varient="bottom"
        width="94vw"
        show={toggleTicketHistoryModal}
        right={0}
        height="60vh"
      >
        <Modal.Body>
          <div className={BizClass.ModalBox}>
            <PageBar>
              <PageBar.Search onChange={(e) => onChangeTicketHistory(e.target.value)} />
            </PageBar>
            <DataGrid
              rowData={ticketHistoryData}
              loader={isLoadingTicketHistory ? <Loader /> : null}
              onGridReady={onGridReadyTicketHistory}
              components={{
                actionTemplate: cellActionTemplate,
              }}
            >
              <DataGrid.Column
              headerName="Action"
              lockPosition="1"
              pinned="left"
              width={80}
              cellRenderer="actionTemplate"
              cellRendererParams={{
                toggleSupportTicketDetailsModal,
              }}
            />
              <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
              <DataGrid.Column field="SupportTicketNo" headerName="Ticket No" width="150px" />
              <DataGrid.Column field="TicketStatus" headerName="Ticket Status" width="120px" />
              <DataGrid.Column field="TicketHeadName" headerName="Type" width="150px" />
              <DataGrid.Column field="TicketTypeName" headerName="Category" width="160px" />
              <DataGrid.Column field="TicketCategoryName" headerName="Sub Category" width="190px" />
              <DataGrid.Column field="CreatedBY" headerName="Created By" width="160px" />
              <DataGrid.Column
                field="#"
                headerName="Created At"
                width="125px"
                valueGetter={(node) => {
                  // A return node.data.CreatedAt ? `${dateFormat(node.data.CreatedAt.split("T")[0])} ${tConvert(node.data.CreatedAt.split("T")[1])}` : null;
                  return node.data.CreatedAt
                    ? dateToSpecificFormat(
                        `${node.data.CreatedAt.split("T")[0]} ${Convert24FourHourAndMinute(node.data.CreatedAt.split("T")[1])}`,
                        "DD-MM-YYYY HH:mm",
                      )
                    : null;
                }}
              />
              <DataGrid.Column field="InsuranceCompany" headerName="Insurance Company" width="290px" />
              <DataGrid.Column field="ApplicationNo" headerName="Application No" width="190px" />
              <DataGrid.Column field="InsurancePolicyNo" headerName="Policy No" width="160px" />
              <DataGrid.Column field="StateMasterName" headerName="State" width="160px" />
            </DataGrid>
          </div>
        </Modal.Body>
        <Modal.Footer />
      </Modal>
    );
  }
