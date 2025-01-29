import { useEffect, useState } from "react";
import { sha256 } from "crypto-hash";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import moment from "moment";
import { getSessionStorage, validatePassword, encryptStringData } from "Components/Common/Login/Auth/auth";
import { getBrHeadTypeData, addNewUser, getReferenceTypeData, getMasterDataBinding, GetUserInsCompAssignManage } from "../Services/Methods";
import { GetUserStateAssignManage } from "../../AssignStateListModal/Service/Methods";

function AddUserLogics() {
  const [formValues, setFormValues] = useState({
    txtDisplayName: "",
    txtLoginName: "",
    txtPassword: "",
    txtUserType: null,
    txtLocationType: null,
    txtReferenceType: { Name: "BR", Value: "BR" },
    txtBRHeadType: null,
    isRequiredBRHead: false,
    txtUserReference: null,
    txtMobileNo: "",
    txtEmailID: "",
    txtState: null,
  });
  const [locationType, setLocationType] = useState([]);
  const setAlertMessage = AlertMessage();
  const [filterLocationType, setFilterLocationType] = useState([]);
  const [isLoadingLocationType, setIsLoadingLocationType] = useState(false);
  const getLocationType = async () => {
    debugger;
    try {
      setIsLoadingLocationType(true);
      const userData = getSessionStorage("user");
      const formdata = {
        filterID: userData && userData.LoginID ? userData.LoginID : 0,
        filterID1: 0,
        masterName: "LOCTYP",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBinding(formdata);
      console.log(result);
      setIsLoadingLocationType(false);
      if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
        setLocationType(result.response.responseData.masterdatabinding);
        setFilterLocationType(result.response.responseData.masterdatabinding);
      } else {
        setLocationType([]);
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };
  const [BrHeadType, setBrHeadType] = useState([]);
  const [isLoadingBrHeadType, setIsLoadingBrHeadtype] = useState(false);

  const getBrHeadType = async () => {
    debugger;
    try {
      setIsLoadingBrHeadtype(true);
      const userData = getSessionStorage("user");
      const pAppAccessTypeID = userData ? userData.AppAccessTypeID : 0;
      let pfilterID1 = 0;
      if (pAppAccessTypeID === 999) {
        pfilterID1 = 0;
      } else {
        pfilterID1 = userData ? userData.BRHeadTypeID : 0;
      }
      const formData = {
        filterID: "124",
        filterID1: pfilterID1,
        masterName: "COMMVAL",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getBrHeadTypeData(formData);
      console.log(result);
      setIsLoadingBrHeadtype(false);

      if (result.response && result.response.length > 0) {
        setBrHeadType(result.response);
        getLocationType();
      } else {
        setBrHeadType([]);
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const [userType, setUserType] = useState([]);
  const [isLoadingUserType, setIsLoadingUserType] = useState(false);
  const getUserType = async () => {
    debugger;
    try {
      setIsLoadingUserType(true);
      const userData = getSessionStorage("user");
      const formdata = {
        filterID: userData && userData.LoginID ? userData.LoginID : 0,
        filterID1: 0,
        masterName: "ACCTYP",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBinding(formdata);
      console.log(result);
      setIsLoadingBrHeadtype(false);
      if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
        setUserType(result.response.responseData.masterdatabinding);
        getBrHeadType();
      } else {
        setUserType([]);
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
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

  const [selectedState, setSelectedState] = useState([]);
  const [isLoadingSelectedState, setIsLoadingSelectedState] = useState(false);
  const getState = async () => {
    debugger;
    try {
      setIsLoadingSelectedState(true);
      const formdata = {
        filterID: 0,
        filterID1: 0,
        masterName: "STATEMAS",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBinding(formdata);
      console.log(result);
      setIsLoadingSelectedState(false);
      if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
        setSelectedState(result.response.responseData.masterdatabinding);
      } else {
        setSelectedState([]);
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };
  const [referenceType, setReferenceType] = useState([]);
  const [isLoadingReferenceType, setIsLoadingReferenceType] = useState(false);
  const getreferenceType = async (bmcgCode) => {
    debugger;
    try {
      setIsLoadingReferenceType(true);

      // Anil const userData = getSessionStorage("user");
      // Anil let pfilterID1 = 0;
      // Anil if (userData.BRHeadTypeID.toString() === "124003") {
      // Anil  pfilterID1 = userData.UserRelationID;
      // Anil }

      const userData = getSessionStorage("user");
      const pAppAccessTypeID = userData ? userData.AppAccessTypeID : 0;
      let pfilterID1 = 0;
      if (pAppAccessTypeID === 999) {
        pfilterID1 = 0;
      } else {
        pfilterID1 = userData ? userData.UserRelationID : 0;
      }

      const formData = {
        filterID: bmcgCode || "0",
        filterID1: pfilterID1,
        masterName: "CMPLST",
        searchText: "#ALL",
        searchCriteria: "",
      };

      const result = await getReferenceTypeData(formData);
      setIsLoadingReferenceType(false);
      console.log(result, "txtReferenceType");
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.masterdatabinding) {
          setReferenceType(result.responseData.masterdatabinding);
        } else {
          setReferenceType([]);
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
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

  const validateField = (name, value) => {
    let errorsMsg = "";
    if (name === "txtDisplayName") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Can not be empty";
      }
    }
    if (name === "txtLoginName") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Can not be empty";
      } else {
        const regex = new RegExp("^[a-zA-Z0-9_]*$");
        if (!regex.test(value)) {
          errorsMsg = "Not valid";
        }
      }
    }
    if (name === "txtPassword") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Can not be empty";
      } else if (value) {
        const ErrorPwd = validatePassword(value);
        if (ErrorPwd !== "") {
          errorsMsg = ErrorPwd;
        }
      }
    }
    if (name === "txtUserType") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Can not be empty";
      }
    }
    if (name === "txtLocationType") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Can not be empty";
      }
    }
    if (name === "txtReferenceType") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Can not be empty";
      }
    }
    if (name === "txtBRHeadType") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Can not be empty";
      }
    }
    if (name === "txtState") {
      if (
        formValues.txtBRHeadType &&
        formValues.txtBRHeadType.BMCGCode.toString() === "124005" &&
        formValues.txtUserType &&
        formValues.txtUserType.AppAccessTypeID.toString() === "999"
      ) {
        if (!value || typeof value === "undefined") {
          errorsMsg = "Can not be empty";
        }
      }
    }
    if (name === "txtUserReference") {
      if (formValues.txtBRHeadType && formValues.txtBRHeadType.BMCGCode.toString() === "124003") {
        if (!value || typeof value === "undefined") {
          errorsMsg = "Can not be empty";
        }
      }
    }
    if (name === "txtMobileNo") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Can not be empty";
      } else {
        const regex = new RegExp("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$");
        if (!regex.test(value)) {
          errorsMsg = "Not valid";
        }
      }
    }
    if (name === "txtEmailID") {
      const regex = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
      if (!regex.test(value)) {
        errorsMsg = "Email ID is not valid";
      }
    }

    return errorsMsg;
  };

  const [disableBRHeadType, setdisableBRHeadType] = useState(false);
  const [formValidationError, setFormValidationError] = useState({});
  const [lblUserReference, setlblUserReference] = useState("User Reference");
  const updateState = (name, value) => {
    debugger;
    setFormValues({ ...formValues, [name]: value });
    formValidationError[name] = validateField(name, value);
    if (name === "txtReferenceType") {
      setFormValues({
        ...formValues,
        txtReferenceType: value,
        txtBRHeadType: null,
        txtUserReference: null,
        txtState: null,
      });
      setReferenceType([]);
      setBrHeadType([]);
    }
    if (name === "txtBRHeadType") {
      debugger;
      formValues.txtUserReference = null;
      setFormValues({
        ...formValues,
        txtBRHeadType: value,
        txtUserReference: null,
        txtState: null,
      });
      getreferenceType(value && value.BMCGCode);
      setSelectedState([]);
      if (value != null) {
        setlblUserReference(value.CommonMasterValue);
        if (value.BMCGCode.toString() === "124005") {
          getState();
        }
      } else {
        setlblUserReference("User Reference");
        setReferenceType([]);
      }
    }
    if (name === "txtUserType") {
      debugger;
      if (value && value.AppAccessTypeID.toString() === "495") {
        setFormValues({
          ...formValues,
          txtUserType: value,
          txtBRHeadType: { CommonMasterValueID: 124303, CommonMasterValue: "Insurance Company", BMCGCode: 124003 },
          txtUserReference: null,
          txtLocationType: null,
          txtState: null,
        });
        setdisableBRHeadType(true);
        setReferenceType([]);
        getreferenceType(124003);
      } else if (value && value.AppAccessTypeID.toString() === "472") {
        console.log("value &&", value.AppAccessTypeID.toString());
        setFormValues({
          ...formValues,
          txtUserType: value,
          txtBRHeadType: null,
          txtUserReference: null,
          txtLocationType: null,
          txtState: null,
        });
        setdisableBRHeadType(false);
        setReferenceType([]);
        if (value && value.BMCGCode) {
          getreferenceType(value.BMCGCode);
        }
        const userData = getSessionStorage("user");
        const varfilter = locationType.filter((x) => x.LocationTypeID.toString() !== userData.LocationTypeID.toString());
        setFilterLocationType([]);
        setFilterLocationType(varfilter);
      } else {
        setFormValues({
          ...formValues,
          txtUserType: value,
          txtBRHeadType: null,
          txtUserReference: null,
          txtLocationType: null,
          txtState: null,
        });
        setdisableBRHeadType(false);
        setReferenceType([]);
        if (value && value.BMCGCode) {
          getreferenceType(value.BMCGCode);
        }
        setFilterLocationType([]);
        setFilterLocationType(locationType);
      }
    }
  };

  const handleValidation = () => {
    try {
      const errors = {};
      let formIsValid = true;
      errors["txtDisplayName"] = validateField("txtDisplayName", formValues.txtDisplayName);
      errors["txtLoginName"] = validateField("txtLoginName", formValues.txtLoginName);
      errors["txtPassword"] = validateField("txtPassword", formValues.txtPassword);
      errors["txtUserType"] = validateField("txtUserType", formValues.txtUserType);
      errors["txtLocationType"] = validateField("txtLocationType", formValues.txtLocationType);
      errors["txtReferenceType"] = validateField("txtReferenceType", formValues.txtReferenceType);
      errors["txtBRHeadType"] = validateField("txtBRHeadType", formValues.txtBRHeadType);
      errors["txtUserReference"] = validateField("txtUserReference", formValues.txtUserReference);
      errors["txtMobileNo"] = validateField("txtMobileNo", formValues.txtMobileNo);
      errors["txtEMailID"] = validateField("txtEMailID", formValues.txtEMailID);
      errors["txtState"] = validateField("txtState", formValues.txtState);

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

  const clearForm = () => {
    setFormValues({
      txtDisplayName: "",
      txtLoginName: "",
      txtPassword: "",
      txtUserType: null,
      txtLocationType: null,
      txtReferenceType: { Name: "BR", Value: "BR" },
      txtBRHeadType: null,
      isRequiredBRHead: false,
      txtUserReference: null,
      txtMobileNo: "",
      txtEmailID: "",
    });
    setReferenceType([]);
    setlblUserReference("User Reference");
    setdisableBRHeadType(false);
  };

  const [btnLoaderActive, setBtnLoaderActive] = useState(false);
  const handleSave = async (e, updateUserData) => {
    if (e) e.preventDefault();
    if (!handleValidation()) {
      return;
    }
    debugger;
    try {
      const encryptUserName = encryptStringData(formValues.txtLoginName ? formValues.txtLoginName : "");
      const hashPass = await sha256(formValues.txtPassword ? formValues.txtPassword : "");
      const formData = {
        appAccessID: 0,
        userDisplayName: formValues.txtDisplayName ? formValues.txtDisplayName : "",
        appAccessUserName: encryptUserName,
        appAccessPWD: hashPass,
        appAccessTypeID: formValues.txtUserType && formValues.txtUserType.AppAccessTypeID ? formValues.txtUserType.AppAccessTypeID : 0,
        locationTypeID: formValues.txtLocationType && formValues.txtLocationType.LocationTypeID ? formValues.txtLocationType.LocationTypeID : 0,
        userMobileNumber: formValues.txtMobileNo ? formValues.txtMobileNo : "",
        emailAddress: formValues.txtEmailID ? formValues.txtEmailID : "",
        appAccessLevel: "APP",
        web_App: 0,
        window_App: 0,
        mobile_App: 0,
        web_API: 0,
        activeStatus: "Y",
        userRelationType: formValues.txtReferenceType && formValues.txtReferenceType.Value ? formValues.txtReferenceType.Value.toString() : "",
        brHeadTypeID: formValues.txtBRHeadType && formValues.txtBRHeadType.BMCGCode ? formValues.txtBRHeadType.BMCGCode : null,
        userRelationID:
          formValues.txtBRHeadType.BMCGCode.toString() !== "124003"
            ? formValues.txtBRHeadType.CommonMasterValueID
            : formValues.txtUserReference && formValues.txtUserReference.CompanyID
            ? formValues.txtUserReference.CompanyID
            : 0,
        ipAllowed: 0,
        imeiAllowed: 0,
        macAddAllowed: 0,
        mobileAllowed: 0,
      };
      setBtnLoaderActive(true);
      const result = await addNewUser(formData);
      const userData = getSessionStorage("user");
      if (result.response.responseCode === 1) {
        debugger;
        if (result.response && result.response.responseData) {
          const newlyAddedUser = [
            {
              AppAccessID: result.response.responseData.AppAccessID,
              UserDisplayName: formData.userDisplayName,
              AppAccessUserName: formValues.txtLoginName ? formValues.txtLoginName : "",
              UserType: formValues.txtUserType && formValues.txtUserType.AppAccessName ? formValues.txtUserType.AppAccessName : "",
              UserCompanyType: formValues.txtBRHeadType && formValues.txtBRHeadType.CommonMasterValue ? formValues.txtBRHeadType.CommonMasterValue : "",
              CompanyName:
                formValues.txtBRHeadType && formValues.txtBRHeadType.BMCGCode !== "124003"
                  ? formValues.txtBRHeadType.CommonMasterValue
                  : formValues.txtUserReference && formValues.txtUserReference.CompanyName
                  ? formValues.txtUserReference.CompanyName
                  : "",
              ActiveStatus: "Y",
              BRTypeID: formValues.txtBRHeadType && formValues.txtBRHeadType.BMCGCode ? formValues.txtBRHeadType.BMCGCode : "",
              BRHeadTypeID: formValues.txtBRHeadType && formValues.txtBRHeadType.CommonMasterValueID ? formValues.txtBRHeadType.CommonMasterValueID : "",
              LocationTypeID: formValues.txtLocationType && formValues.txtLocationType.LocationTypeID ? formValues.txtLocationType.LocationTypeID : 0,
              LocationMasterName:
                formValues.txtLocationType && formValues.txtLocationType.LocationMasterName ? formValues.txtLocationType.LocationMasterName : "",
              AssignmentFlag: 0,
              UserRelationID: formValues.txtUserReference && formValues.txtUserReference.CompanyID ? formValues.txtUserReference.CompanyID : "",
              EmailAddress: formValues.txtEmailID ? formValues.txtEmailID : "",
              UserMobileNumber: formValues.txtMobileNo ? formValues.txtMobileNo : "",
              InsertUserID: userData ? userData.LoginID : 0,
              InsertedTime: moment().utcOffset("+05:30").format("YYYY-MM-DDTHH:mm:ss"),
              IsNewlyAdded: true,
            },
          ];
          updateUserData(newlyAddedUser);
          if (formData.brHeadTypeID.toString() === "124003") {
            const formdata = {
              viewMode: "ASSIGN",
              userInsuranceID: "0",
              appAccessID: result.response.responseData.AppAccessID,
              insuranceCompanyID: formValues.txtUserReference && formValues.txtUserReference.CompanyID ? formValues.txtUserReference.CompanyID : 0,
            };

            const result1 = await GetUserInsCompAssignManage(formdata);
            console.log(result1, "result1");

            if (result1.responseCode === 1) {
              console.log(result1.responseData);
            }
          }
          if (
            formData.brHeadTypeID.toString() === "124005" &&
            formValues.txtUserType.AppAccessTypeID.toString() === "999" &&
            formValues.txtLocationType.LocationTypeID.toString() === "1"
          ) {
            const formdata = {
              viewMode: "ASSIGN",
              userStateID: "",
              appAccessID: result.response.responseData.AppAccessID,
              stateMasterID: formValues.txtState && formValues.txtState.StateMasterID ? formValues.txtState.StateMasterID : 0,
            };

            const result2 = await GetUserStateAssignManage(formdata);
            console.log(result2, "result2");

            if (result2.responseCode === 1) {
              console.log(result2.responseData);
            }
          }
        }
        setBtnLoaderActive(false);
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });
        clearForm();
      } else {
        setBtnLoaderActive(false);
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

  useEffect(() => {
    getUserType();
  }, []);

  return {
    formValues,
    isLoadingSelectedState,
    selectedState,
    setFormValues,
    updateState,
    handleSave,
    isLoadingBrHeadType,
    BrHeadType,
    btnLoaderActive,
    formValidationError,
    referenceType,
    isLoadingReferenceType,
    lblUserReference,
    userType,
    isLoadingUserType,
    disableBRHeadType,
    isLoadingLocationType,
    locationType,
    filterLocationType,
  };
}

export default AddUserLogics;
