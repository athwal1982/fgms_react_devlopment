import { React, useState, useEffect, useRef } from "react";
import { InputControl, InputGroup } from "Framework/OldFramework/FormComponents/FormComponents";
import { KrphButton } from  "./Widgets/KrphButton";
import { dateFormatDDMMYY } from "Configration/Utilities/dateformat";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { getMasterDataBindingDataList, getDistrictByState } from "../../Modules/Support/ManageTicket/Views/Modals/AddTicket/Services/Methods";
import { getCropListDistrictWiseDataList, AddCalculatedPremiumData } from "Components/Common/Calculator/Service/Method";
import { krphFarmerCallingHistorydata } from "./Services/Methods";
import BizClass from "./PremiumCalculator.module.scss";

function PremiumCalculator({ objStateData, objDistrictData, formValuesGI, dcryptUNQEID, dcryptUID }) {
  // A const myRef = useRef(null);
  // A const executeScroll = () => myRef.current.scrollIntoView({ behavior: "smooth" });
  const setAlertMessage = AlertMessage();

  const [seasonForCalculatorDropdownDataList] = useState([
    { CropSeasonID: 1, CropSeasonName: "Kharif" },
    { CropSeasonID: 2, CropSeasonName: "Rabi" },
  ]);

  const [schemeList] = useState([
    { SchemeID: 2, SchemeName: "Weather Based Crop Insurance Scheme(WBCIS)" },
    { SchemeID: 4, SchemeName: "Pradhan Mantri Fasal Bima Yojna(PMFBY)" },
  ]);

  const [formValuesForCalculator, setFormValuesForCalculator] = useState({
    txtCallerMobileNumber: "",
    txtStateForCalculator: null,
    txtDistrictForCalculator: null,
    txtSeasonForCalculator: null,
    txtYearForCalculator: null,
    txtSchemeForCalculator: null,
    txtCropForCalculator: null,
    txtAreaInHectareForCalculator: "",
  });
  const [formValidationFarmersError, setFormValidationFarmersError] = useState({});

  const validateFarmersFieldCalculator = (name, value) => {
    let errorsMsg = "";

    if (name === "txtStateForCalculator") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "State is required!";
      }
    }
    if (name === "txtDistrictForCalculator") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "District is required!";
      }
    }
    if (name === "txtSeasonForCalculator") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Season is required!";
      }
    }
    if (name === "txtYearForCalculator") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Year is required!";
      }
    }
    if (name === "txtSchemeForCalculator") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Scheme is required!";
      }
    }
    if (name === "txtCropForCalculator") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Crop is required!";
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

    return errorsMsg;
  };

  const handleFarmersValidationCalculator = () => {
    try {
      const errors = {};
      let formIsValid = true;

      errors["txtStateForCalculator"] = validateFarmersFieldCalculator("txtStateForCalculator", formValuesForCalculator.txtStateForCalculator);
      errors["txtDistrictForCalculator"] = validateFarmersFieldCalculator("txtDistrictForCalculator", formValuesForCalculator.txtDistrictForCalculator);
      errors["txtYearForCalculator"] = validateFarmersFieldCalculator("txtYearForCalculator", formValuesForCalculator.txtYearForCalculator);
      errors["txtSeasonForCalculator"] = validateFarmersFieldCalculator("txtSeasonForCalculator", formValuesForCalculator.txtSeasonForCalculator);
      errors["txtSchemeForCalculator"] = validateFarmersFieldCalculator("txtSchemeForCalculator", formValuesForCalculator.txtSchemeForCalculator);
      errors["txtCropForCalculator"] = validateFarmersFieldCalculator("txtCropForCalculator", formValuesForCalculator.txtCropForCalculator);
      errors["txtAreaInHectareForCalculator"] = validateFarmersFieldCalculator(
        "txtAreaInHectareForCalculator",
        formValuesForCalculator.txtAreaInHectareForCalculator,
      );
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

  const [selectedCropData, setSelectedCropData] = useState({});
  const [selectedCropHeader, setSelectedCropHeader] = useState("");
  const [selectedCalculation, setselectedCalculation] = useState({});
  const updateStateForCalculator = (name, value) => {
    setFormValuesForCalculator({ ...formValuesForCalculator, [name]: value });
    formValidationFarmersError[name] = validateFarmersFieldCalculator(name, value);

    if (name === "txtStateForCalculator") {
      setFormValuesForCalculator({
        ...formValuesForCalculator,
        txtStateForCalculator: value,
        txtDistrictForCalculator: null,
        txtCropForCalculator: null,
      });
      setDistrictForCalculatorDropdownDataList([]);
      setCropForCalculatorDropdownDataList([]);
      if (value) {
        getDistrictByStateForCalculatorListData(value.StateCodeAlpha);
      }
    }
    if (name === "txtDistrictForCalculator") {
      setFormValuesForCalculator({
        ...formValuesForCalculator,
        txtDistrictForCalculator: value,
        txtCropForCalculator: null,
      });

      setCropForCalculatorDropdownDataList([]);
      if (
        value &&
        formValuesForCalculator.txtSeasonForCalculator &&
        formValuesForCalculator.txtYearForCalculator &&
        formValuesForCalculator.txtSchemeForCalculator
      ) {
        getCropDataByDistrictData(value.level3ID);
      } else if (
        value &&
        !formValuesForCalculator.txtSeasonForCalculator &&
        !formValuesForCalculator.txtYearForCalculator &&
        !formValuesForCalculator.txtSchemeForCalculator
      ) {
        setAlertMessage({
          type: "warning",
          message: "Select Season, Year And Scheme",
        });
      }
    }
    if (name === "txtSeasonForCalculator") {
      setFormValuesForCalculator({
        ...formValuesForCalculator,
        txtSeasonForCalculator: value,
        txtDistrictForCalculator: null,
        txtCropForCalculator: null,
      });

      setCropForCalculatorDropdownDataList([]);
    }
    if (name === "txtYearForCalculator") {
      setFormValuesForCalculator({
        ...formValuesForCalculator,
        txtYearForCalculator: value,
        txtDistrictForCalculator: null,
        txtCropForCalculator: null,
      });

      setCropForCalculatorDropdownDataList([]);
    }
    if (name === "txtSchemeForCalculator") {
      setFormValuesForCalculator({
        ...formValuesForCalculator,
        txtSchemeForCalculator: value,
        txtDistrictForCalculator: null,
        txtCropForCalculator: null,
      });

      setCropForCalculatorDropdownDataList([]);
    }
    if (name === "txtCropForCalculator") {
      setFormValuesForCalculator({
        ...formValuesForCalculator,
        txtCropForCalculator: value,
      });
      setSelectedCropData({});
      setSelectedCropData(value);
      setSelectedCropHeader("");
      const cropHeader = `${formValuesForCalculator.txtStateForCalculator.StateMasterName} - ${formValuesForCalculator.txtSeasonForCalculator.CropSeasonName} - ${formValuesForCalculator.txtSchemeForCalculator.SchemeName} - ${formValuesForCalculator.txtYearForCalculator.Name}`;
      setSelectedCropHeader(cropHeader);
    }
  };
  const [stateForCalculatorDropdownDataList, setStateForCalculatorDropdownDataList] = useState([]);
  const [isLoadingStateForCalculatorDropdownDataList, setIsLoadingStateForCalculatorDropdownDataList] = useState(false);
  const getStateForCalculatorListData = async () => {
    try {
      setIsLoadingStateForCalculatorDropdownDataList(true);
      const formdata = {
        filterID: 0,
        filterID1: 0,
        masterName: "STATEMAS",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBindingDataList(formdata);
      console.log(result, "State Data");
      setIsLoadingStateForCalculatorDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setStateForCalculatorDropdownDataList(result.response.responseData.masterdatabinding);
        } else {
          setStateForCalculatorDropdownDataList([]);
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

  const [districtForCalculatorDropdownDataList, setDistrictForCalculatorDropdownDataList] = useState([]);
  const [isLoadingDistrictForCalculatorDropdownDataList, setIsLoadingDistrictForCalculatorDropdownDataList] = useState(false);
  const getDistrictByStateForCalculatorListData = async (pstateAlphaCode) => {
    try {
      setIsLoadingDistrictForCalculatorDropdownDataList(true);
      const formdata = {
        stateAlphaCode: pstateAlphaCode,
      };
      const result = await getDistrictByState(formdata);
      console.log(result, "District Data");
      setIsLoadingDistrictForCalculatorDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          if (Object.keys(result.response.responseData.data).length === 0) {
            setDistrictForCalculatorDropdownDataList([]);
          } else {
            setDistrictForCalculatorDropdownDataList(result.response.responseData.data.hierarchy.level3);
          }
        } else {
          setDistrictForCalculatorDropdownDataList([]);
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

  const [isLoadingCropForCalculatorDropdownDataList, setIsLoadingCropForCalculatorDropdownDataList] = useState(false);
  const [cropForCalculatorDropdownDataList, setCropForCalculatorDropdownDataList] = useState([]);
  const getCropDataByDistrictData = async (pDistrictID) => {
    try {
      let result = "";
      let formData = "";

      const user = getSessionStorage("user");

      const pschemeID =
        formValuesForCalculator.txtSchemeForCalculator.SchemeID === 2 ? "02" : formValuesForCalculator.txtSchemeForCalculator.SchemeID === 4 ? "04" : "";
      const pseasonID =
        formValuesForCalculator.txtSeasonForCalculator.CropSeasonID === 1
          ? "01"
          : formValuesForCalculator.txtSeasonForCalculator.CropSeasonID === 2
            ? "02"
            : "";
      const pstateID =
        formValuesForCalculator.txtStateForCalculator.StateMasterID.toString().length < 2
          ? `0${formValuesForCalculator.txtStateForCalculator.StateMasterID}`
          : formValuesForCalculator.txtStateForCalculator.StateMasterID;
      const pyearID = formValuesForCalculator.txtYearForCalculator.Value.toString().substr(formValuesForCalculator.txtYearForCalculator.Value.length - 2);
      const psssyID = `${pschemeID}${pseasonID}${pstateID}${pyearID}`;

      formData = {
        disctrictID: pDistrictID,
        sssyID: psssyID,
        mobilenumber: user && user.UserMobileNumber ? user.UserMobileNumber : "7906071897",
      };
      setIsLoadingCropForCalculatorDropdownDataList(true);
      result = await getCropListDistrictWiseDataList(formData);
      setIsLoadingCropForCalculatorDropdownDataList(false);
      console.log(result, "result");
      setCropForCalculatorDropdownDataList([]);
      if (result.response.responseCode === 1) {
        if (result.response.responseData.length > 0) {
          setCropForCalculatorDropdownDataList(result.response.responseData);
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

  const SavevalidateFarmerOnClick = async () => {
    debugger;
    try {
      const formData = {
        CallingMasterID: 0,
        callerMobileNumber: formValuesGI.txtMobileCallerNumber ? formValuesGI.txtMobileCallerNumber : "",
        user: dcryptUID,
        callingUniqueID: dcryptUNQEID,
        farmerMobileNumber: formValuesGI.txtMobileCallerNumber ? formValuesGI.txtMobileCallerNumber : "",
        farmerName: formValuesGI.txtFarmerName ? formValuesGI.txtFarmerName : "",
        callStatus: formValuesGI.txtCallStatus && formValuesGI.txtCallStatus.Value ? formValuesGI.txtCallStatus.Value : "",
        reason: formValuesGI.txtReason && formValuesGI.txtReason.Value ? formValuesGI.txtReason.Value : "",
        stateCodeAlpha: formValuesGI.txtState && formValuesGI.txtState.StateCodeAlpha ? formValuesGI.txtState.StateCodeAlpha : "",
        districtCodeAlpha: formValuesGI.txtDistrict && formValuesGI.txtDistrict.level3ID ? formValuesGI.txtDistrict.level3ID : "",
        isRegistered: "P",
      };
      const result = await krphFarmerCallingHistorydata(formData);
      if (result.response.responseCode === 1) {
        console.log("success");
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

  const [btnCalculateState, setbtnCalculateState] = useState(false);
  const [btnLoaderActive, setBtnLoaderActive] = useState(false);
  const SaveCalculatedPremiumData = async (pAreaInhectare, pcalculatedSumInsured) => {
    try {
      const pschemeID =
        formValuesForCalculator.txtSchemeForCalculator.SchemeID === 2 ? "02" : formValuesForCalculator.txtSchemeForCalculator.SchemeID === 4 ? "04" : "";
      const pseasonID =
        formValuesForCalculator.txtSeasonForCalculator.CropSeasonID === 1
          ? "01"
          : formValuesForCalculator.txtSeasonForCalculator.CropSeasonID === 2
            ? "02"
            : "";
      const pstateID =
        formValuesForCalculator.txtStateForCalculator.StateMasterID.toString().length < 2
          ? `0${formValuesForCalculator.txtStateForCalculator.StateMasterID}`
          : formValuesForCalculator.txtStateForCalculator.StateMasterID;
      const pyearID = formValuesForCalculator.txtYearForCalculator.Value.toString().substr(formValuesForCalculator.txtYearForCalculator.Value.length - 2);
      const psssyID = `${pschemeID}${pseasonID}${pstateID}${pyearID}`;
      const formdata = {
        mobileNumber: formValuesGI.txtMobileCallerNumber ? formValuesGI.txtMobileCallerNumber : "",
        districtID: formValuesForCalculator.txtDistrictForCalculator.level3ID ? formValuesForCalculator.txtDistrictForCalculator.level3ID : "",
        stateMasterID: formValuesForCalculator.txtStateForCalculator.StateCodeAlpha ? formValuesForCalculator.txtStateForCalculator.StateCodeAlpha : "",
        year:
          formValuesForCalculator.txtYearForCalculator && formValuesForCalculator.txtYearForCalculator.Value
            ? formValuesForCalculator.txtYearForCalculator.Value
            : 0,
        cropSeasonID:
          formValuesForCalculator.txtSeasonForCalculator && formValuesForCalculator.txtSeasonForCalculator.CropSeasonID
            ? formValuesForCalculator.txtSeasonForCalculator.CropSeasonID
            : 0,
        cropName: selectedCropData.cropName,
        schemeID:
          formValuesForCalculator.txtSchemeForCalculator && formValuesForCalculator.txtSchemeForCalculator.SchemeID
            ? formValuesForCalculator.txtSchemeForCalculator.SchemeID
            : 0,
        selectedCropID: selectedCropData.cropID,
        sSSYID: psssyID,
        insuranceCompanyCode: Number(selectedCropData.insuranceCompanyCode),
        area: pAreaInhectare,
        calculatedPremium: pcalculatedSumInsured,
        description: "",
      };
      const result = await AddCalculatedPremiumData(formdata);
      setBtnLoaderActive(false);
      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });
        setbtnCalculateState(true);
        SavevalidateFarmerOnClick();
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setBtnLoaderActive(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const getCalculatorDataOnClick = () => {
    debugger;
    if (!handleFarmersValidationCalculator()) {
      return;
    }
    setBtnLoaderActive(true);
    const calculatedSumInsured = parseFloat(formValuesForCalculator.txtAreaInHectareForCalculator) * parseFloat(selectedCropData.sumInsured);
    const actualRate = parseFloat(selectedCropData.goiShare) + parseFloat(selectedCropData.stateShare);
    const acturialRate = parseFloat(selectedCropData.farmerShare) + parseFloat(selectedCropData.goiShare) + parseFloat(selectedCropData.stateShare);
    const preminumpaidbyfarmer = (parseFloat(calculatedSumInsured) * parseFloat(selectedCropData.farmerShare)) / 100;
    const preminumpaidbygovt = (parseFloat(calculatedSumInsured) * parseFloat(actualRate)) / 100;
    setselectedCalculation({
      CalculatedSumInsured: calculatedSumInsured,
      ActurialRate: acturialRate,
      Preminumpaidbyfarmer: preminumpaidbyfarmer,
      Preminumpaidbygovt: preminumpaidbygovt,
      AreaInhectare: formValuesForCalculator.txtAreaInHectareForCalculator,
    });
    console.log({
      CalculatedSumInsured: calculatedSumInsured,
      ActurialRate: acturialRate,
      Preminumpaidbyfarmer: preminumpaidbyfarmer,
      Preminumpaidbygovt: preminumpaidbygovt,
      AreaInhectare: formValuesForCalculator.txtAreaInHectareForCalculator,
    });
    // A setTimeout(() => executeScroll(), 0);
    setTimeout(() => {
      SaveCalculatedPremiumData(formValuesForCalculator.txtAreaInHectareForCalculator, calculatedSumInsured);
    }, 500);
  };

  const clearFormOnClick = () => {
    setFormValuesForCalculator({
      ...formValuesForCalculator,
      txtCallerMobileNumber: "",
      txtStateForCalculator: null,
      txtDistrictForCalculator: null,
      txtSeasonForCalculator: null,
      txtYearForCalculator: null,
      txtSchemeForCalculator: null,
      txtCropForCalculator: null,
      txtAreaInHectareForCalculator: "",
    });
    setFormValidationFarmersError({});
    setselectedCalculation({});
    setSelectedCropData({});
    setDistrictForCalculatorDropdownDataList([]);
    setCropForCalculatorDropdownDataList([]);
    setbtnCalculateState(false);
  };

  const [yearList, setYearList] = useState([]);
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearArray = [];
    for (let i = 2018; i <= currentYear; i += 1) {
      yearArray.push({ Name: i.toString(), Value: i.toString() });
    }

    setYearList(yearArray.sort().reverse());
    getStateForCalculatorListData();
  }, []);

  return (
    <div style={{ padding: "0px" }}>
    <div
      style={{
        backgroundColor: "#075307",
        color: "white",
        textAlign: "center",
        padding: "10px",
        fontSize: "22px",
        borderRadius: "10px",
      }}
    >
      INSURANCE PREMIUM CALCULATOR
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
      <div style={{ width: "65%" }}>
        <form>
          <div style={{ marginBottom: "30px" }}>
          <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid #34C759",
        borderRadius: "20px",
        padding: "10px 20px",
        color: "#34C759",
        fontSize: "16px",
        width: "fit-content",
        // AmarginTop:"20px"
      }}
    >
      <span
        className="blinking"
      ></span>
      Call Connected
    </div>
          </div>
          <div style={{ display: "flex", gap: "20px", marginBottom: "15px" }}>
          <div className="col-md-6">
          <div className="form-group">
              <label>Season <span className="asteriskCss">&#42;</span></label>
              <InputGroup>
                                              <InputControl
                                                Input_type="select"
                                                name="txtSeasonForCalculator"
                                                getOptionLabel={(option) => `${option.CropSeasonName}`}
                                                value={formValuesForCalculator.txtSeasonForCalculator}
                                                getOptionValue={(option) => `${option}`}
                                                options={seasonForCalculatorDropdownDataList}
                                                onChange={(e) => updateStateForCalculator("txtSeasonForCalculator", e)}
                                                ControlTxt="Season"
                                                focus="true"
                                              />
                                            </InputGroup>
                                            <span className="login_ErrorTxt">{formValidationFarmersError["txtSeasonForCalculator"]}</span>
            </div>
          </div>
          <div className="col-md-6">
          <div className="form-group">
              <label >Year <span className="asteriskCss">&#42;</span></label>
              <InputGroup>
                                              <InputControl
                                                Input_type="select"
                                                name="txtYearForCalculator"
                                                getOptionLabel={(option) => `${option.Name}`}
                                                value={formValuesForCalculator.txtYearForCalculator}
                                                getOptionValue={(option) => `${option}`}
                                                options={yearList}
                                                onChange={(e) => updateStateForCalculator("txtYearForCalculator", e)}
                                               ControlTxt="Year"
                                              />
                                            </InputGroup>
                                            <span className="login_ErrorTxt">{formValidationFarmersError["txtYearForCalculator"]}</span>
            </div>
          </div>
          </div>
          <div style={{ display: "flex", gap: "20px", marginBottom: "15px" }}>
          <div className="col-md-6">
          <div className="form-group">
              <label >Scheme <span className="asteriskCss">&#42;</span></label>
              <InputGroup>
                                              <InputControl
                                                Input_type="select"
                                                name="txtSchemeForCalculator"
                                                getOptionLabel={(option) => `${option.SchemeName}`}
                                                value={formValuesForCalculator.txtSchemeForCalculator}
                                                getOptionValue={(option) => `${option}`}
                                                options={schemeList}
                                                onChange={(e) => updateStateForCalculator("txtSchemeForCalculator", e)}
                                                ControlTxt="Scheme"
                                                focus="true"
                                              />
                                            </InputGroup>
                                            <span className="login_ErrorTxt">{formValidationFarmersError["txtSchemeForCalculator"]}</span>
            </div>
            </div>
            <div className="col-md-6">
          <div className="form-group">
              <label >State <span className="asteriskCss">&#42;</span></label>
             <InputGroup>
                                       <InputControl
                                         Input_type="select"
                                         name="txtStateForCalculator"
                                         isLoading={isLoadingStateForCalculatorDropdownDataList}
                                         getOptionLabel={(option) => `${option.StateMasterName}`}
                                         value={formValuesForCalculator.txtStateForCalculator}
                                         getOptionValue={(option) => `${option}`}
                                         options={stateForCalculatorDropdownDataList}
                                         ControlTxt="State"
                                         onChange={(e) => updateStateForCalculator("txtStateForCalculator", e)}
                                       />
                                     </InputGroup>
                                     <span className="login_ErrorTxt">{formValidationFarmersError["txtStateForCalculator"]}</span>
            </div>
          </div>
          </div>
          <div style={{ display: "flex", gap: "20px", marginBottom: "15px" }}>
          <div className="col-md-6">
          <div className="form-group">
              <label>District <span className="asteriskCss">&#42;</span></label>
              <InputGroup>
                                       <InputControl
                                         Input_type="select"
                                         name="txtDistrictForCalculator"
                                         isLoading={isLoadingDistrictForCalculatorDropdownDataList}
                                         getOptionLabel={(option) => `${option.level3Name}`}
                                         value={formValuesForCalculator.txtDistrictForCalculator}
                                         getOptionValue={(option) => `${option}`}
                                         options={districtForCalculatorDropdownDataList}
                                         ControlTxt="District"
                                         onChange={(e) => updateStateForCalculator("txtDistrictForCalculator", e)}
                                       />
                                     </InputGroup>
                                     <span className="login_ErrorTxt">{formValidationFarmersError["txtDistrictForCalculator"]}</span>
            </div>
            </div>
            <div className="col-md-6">
            <div className="form-group">
              <label >Crop <span className="asteriskCss">&#42;</span></label>
              <InputGroup>
                                       <InputControl
                                         Input_type="select"
                                         name="txtCropForCalculator"
                                         isLoading={isLoadingCropForCalculatorDropdownDataList}
                                         getOptionLabel={(option) => `${option.cropName}`}
                                         value={formValuesForCalculator.txtCropForCalculator}
                                         getOptionValue={(option) => `${option}`}
                                         options={cropForCalculatorDropdownDataList}
                                         ControlTxt="Crop"
                                         onChange={(e) => updateStateForCalculator("txtCropForCalculator", e)}
                                       />
                                     </InputGroup>
                                     <span className="login_ErrorTxt">{formValidationFarmersError["txtCropForCalculator"]}</span>
            </div>
          </div>
          </div>
          <div style={{ display: "flex", gap: "20px", marginBottom: "15px" }}>
          <div className="col-md-12">
          <div className="form-group">
              <label >Area in Hectare <span className="asteriskCss">&#42;</span></label>
            <InputGroup>
                                      <InputControl
                                        Input_type="input"
                                        name="txtAreaInHectareForCalculator"
                                        value={formValuesForCalculator.txtAreaInHectareForCalculator}
                                         maxlength="3"
                                         minlength="3"
                                         onChange={(e) => updateStateForCalculator("txtAreaInHectareForCalculator", e.target.value)}
                                        autoComplete="off"
                                        
                                      />
                                    </InputGroup>
                                    <span className="login_ErrorTxt">{formValidationFarmersError["txtAreaInHectareForCalculator"]}</span>
            </div>
          </div>
         </div>
          <div style={{ display: "flex", gap: "20px" }}>
            <KrphButton
            type="button"
             varient="primary"
              trigger={btnLoaderActive && "true"}
              onClick={() => getCalculatorDataOnClick()}
            >
              Calculate
            </KrphButton>
            <button
            type="button"
              style={{
                backgroundColor: "white",
                color: "red",
                border: "1px solid #DC2626",
                borderRadius: "15px",
                padding: "10px 35px",
                fontSize: "14px",
              }}
              onClick={() => clearFormOnClick()}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      <div
        style={{
          height: "100%",
          width: "30%",
          // Aborder: "20px solid #16A34A 0px 0px 0px",
          borderTop: "10px solid #16A34A",
          borderRight: "2px solid #16A34A",
          borderBottom: "2px solid #16A34A",
          borderLeft: "2px solid #16A34A",
          borderRadius: "20px 20px 10px 10px",
          padding: "15px 0 100px 0px",
          // AbackgroundColor: "#f9f9f9",
        }}
      >
        <h1
          style={{
            color: "#16A34A",
            textAlign: "center",
            fontSize: "32px",
            marginBottom: "10px",
          }}
        >
          {selectedCalculation && selectedCalculation.Preminumpaidbyfarmer ? `₹ ${selectedCalculation.Preminumpaidbyfarmer}` :  "₹ 0" }
         
        </h1>
        <p
          style={{
            textAlign: "center",
            margin: 0,
            
            fontSize: "16px",
          }}
        >
          Premium Paid By Farmer
        </p>

        <table
          style={{
            width: "100%",
            marginTop: "15px",
            borderSpacing: "0",
            fontSize: "14px",
            padding:"0 0 100px 0",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "8px" }}>Insurance Company</td>
              <td style={{ padding: "8px" }}>{selectedCropData && selectedCropData.insuranceCompanyName ? selectedCropData.insuranceCompanyName :  "................................" }</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{  padding: "8px" }}>Sum Insured(Rs)/Hectare</td>
              <td style={{ padding: "8px" }}>{selectedCropData && selectedCropData.sumInsured ? selectedCropData.sumInsured :  "0" }</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{  padding: "8px" }}>Farmer Share(%)</td>
              <td style={{ padding: "8px" }}>{selectedCropData && selectedCropData.farmerShare ? selectedCropData.farmerShare :  "0" }</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{  padding: "8px" }}>Actuarial Rate(%)</td>
              <td style={{ padding: "8px" }}>{selectedCalculation && selectedCalculation.ActurialRate ? selectedCalculation.ActurialRate :  "0" }</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{  padding: "8px" }}>Cut Off Date</td>
              <td style={{ padding: "8px" }}>{selectedCropData && selectedCropData.cutOfDate ? dateFormatDDMMYY(selectedCropData.cutOfDate.split("T")[0]) :  "................................" }</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{  padding: "8px" }}>Crop</td>
              <td style={{ padding: "8px" }}>{selectedCropData && selectedCropData.cropName ? selectedCropData.cropName :  "................................" }</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{  padding: "8px" }}>Area(Hectare)</td>
              <td style={{ padding: "8px" }}>{selectedCalculation && selectedCalculation.AreaInhectare ? selectedCalculation.AreaInhectare :  "0" }</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{  padding: "8px" }}>Premium Paid By Govt(Rs)</td>
              <td style={{ padding: "8px" }}>{selectedCalculation && selectedCalculation.Preminumpaidbygovt ? selectedCalculation.Preminumpaidbygovt :  "0" }</td>
            </tr>
            <tr>
              <td style={{  padding: "8px" }}>Sum Insured(Rs)</td>
              <td style={{ padding: "8px" }}>{selectedCalculation && selectedCalculation.CalculatedSumInsured ? selectedCalculation.CalculatedSumInsured :  "0" }</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  );
}

export default PremiumCalculator;
