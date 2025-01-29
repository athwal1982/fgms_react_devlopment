import { React, useState, useEffect, useRef } from "react";
import { PageBar, Form } from "Framework/Components/Layout";
import { Button } from "Framework/Components/Widgets";
import { dateFormatDDMMYY } from "Configration/Utilities/dateformat";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { getMasterDataBindingDataList, getDistrictByState } from "../../Modules/Support/ManageTicket/Views/Modals/AddTicket/Services/Methods";
import { getCropListDistrictWiseDataList,AddCalculatedPremiumData } from "Components/Common/Calculator/Service/Method";
import { krphFarmerCallingHistorydata } from "./Services/Methods";
import BizClass from "./PremiumCalculator.module.scss";

function PremiumCalculator({objStateData,objDistrictData,formValuesGI,dcryptUNQEID,dcryptUID}) {
  
  const myRef = useRef(null);
  const executeScroll = () => myRef.current.scrollIntoView({ behavior: "smooth" });
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
        stateCodeAlpha:
          formValuesGI.txtState && formValuesGI.txtState.StateCodeAlpha ? formValuesGI.txtState.StateCodeAlpha : "",
        districtCodeAlpha:
          formValuesGI.txtDistrict && formValuesGI.txtDistrict.level3ID ? formValuesGI.txtDistrict.level3ID : "",
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
    setTimeout(() => executeScroll(), 0);
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
    <div className={BizClass.PageStart}>
      {/* <PageBar /> */}
      <div className={BizClass.MainSection}>
        <div className={BizClass.ContentBox}>
          <div className={BizClass.FormHeading}>
            <h4>Insurance Premium Calculator</h4>
          </div>
          <div className={BizClass.PrmCalcContainerPnl}>
            <div className={BizClass.ContentSection}>
              <div className={BizClass.FormBox}>
                <div className={BizClass.FormGroupBox}>
                  <Form.InputGroup label="Season" errorMsg={formValidationFarmersError["txtSeasonForCalculator"]} req="true">
                    <Form.InputControl
                      control="select"
                      name="txtSeasonForCalculator"
                      value={formValuesForCalculator.txtSeasonForCalculator}
                      options={seasonForCalculatorDropdownDataList}
                      // A isLoading={isLoadingSeasonForCalculatorDropdownDataList}
                      getOptionLabel={(option) => `${option.CropSeasonName}`}
                      getOptionValue={(option) => `${option}`}
                      onChange={(e) => updateStateForCalculator("txtSeasonForCalculator", e)}
                      focus="true"
                    />
                  </Form.InputGroup>
                </div>
                <div className={BizClass.FormGroupBox}>
                  <Form.InputGroup label="Year" errorMsg={formValidationFarmersError["txtYearForCalculator"]} req="true">
                    <Form.InputControl
                      control="select"
                      name="txtYearForCalculator"
                      value={formValuesForCalculator.txtYearForCalculator}
                      options={yearList}
                      getOptionLabel={(option) => `${option.Name}`}
                      getOptionValue={(option) => `${option}`}
                      onChange={(e) => updateStateForCalculator("txtYearForCalculator", e)}
                    />
                  </Form.InputGroup>
                </div>

                <div className={BizClass.FormGroupBox}>
                  <Form.InputGroup label="Scheme" errorMsg={formValidationFarmersError["txtSchemeForCalculator"]} req="true">
                    <Form.InputControl
                      control="select"
                      name="txtSchemeForCalculator"
                      value={formValuesForCalculator.txtSchemeForCalculator}
                      // A isLoading={isLoadingSchemeListDropdownDataList}
                      options={schemeList}
                      getOptionLabel={(option) => `${option.SchemeName}`}
                      getOptionValue={(option) => `${option}`}
                      onChange={(e) => updateStateForCalculator("txtSchemeForCalculator", e)}
                    />
                  </Form.InputGroup>
                </div>

                <div className={BizClass.FormGroupBox}>
                  <Form.InputGroup label="State" errorMsg={formValidationFarmersError["txtStateForCalculator"]} req="true">
                    <Form.InputControl
                      control="select"
                      name="txtStateForCalculator"
                      value={formValuesForCalculator.txtStateForCalculator}
                      options={stateForCalculatorDropdownDataList}
                      isLoading={isLoadingStateForCalculatorDropdownDataList}
                      getOptionLabel={(option) => `${option.StateMasterName}`}
                      getOptionValue={(option) => `${option}`}
                      onChange={(e) => updateStateForCalculator("txtStateForCalculator", e)}
                    />
                  </Form.InputGroup>
                </div>

                <div className={BizClass.FormGroupBox}>
                  <Form.InputGroup label="District" errorMsg={formValidationFarmersError["txtDistrictForCalculator"]} req="true">
                    <Form.InputControl
                      control="select"
                      name="txtDistrictForCalculator"
                      value={formValuesForCalculator.txtDistrictForCalculator}
                      options={districtForCalculatorDropdownDataList}
                      isLoading={isLoadingDistrictForCalculatorDropdownDataList}
                      getOptionLabel={(option) => `${option.level3Name}`}
                      getOptionValue={(option) => `${option}`}
                      onChange={(e) => updateStateForCalculator("txtDistrictForCalculator", e)}
                    />
                  </Form.InputGroup>
                </div>

                <div className={BizClass.FormGroupBox}>
                  <Form.InputGroup label="Crop" errorMsg={formValidationFarmersError["txtCropForCalculator"]} req="true">
                    <Form.InputControl
                      control="select"
                      name="txtCropForCalculator"
                      value={formValuesForCalculator.txtCropForCalculator}
                      options={cropForCalculatorDropdownDataList}
                      isLoading={isLoadingCropForCalculatorDropdownDataList}
                      getOptionLabel={(option) => `${option.cropName}`}
                      getOptionValue={(option) => `${option}`}
                      onChange={(e) => updateStateForCalculator("txtCropForCalculator", e)}
                    />
                  </Form.InputGroup>
                </div>

                <div className={BizClass.FormGroupBox}>
                  <Form.InputGroup label="Area In Hectare" errorMsg={formValidationFarmersError["txtAreaInHectareForCalculator"]} req="true">
                    <Form.InputControl
                      control="input"
                      maxlength="3"
                      minlength="3"
                      type="text"
                      name="txtAreaInHectareForCalculator"
                      value={formValuesForCalculator.txtAreaInHectareForCalculator}
                      onChange={(e) => updateStateForCalculator("txtAreaInHectareForCalculator", e.target.value)}
                    />
                  </Form.InputGroup>
                </div>
              </div>
              <div className={BizClass.CalculatedData} ref={myRef}>
                {selectedCalculation && Object.keys(selectedCalculation).length > 0 && (
                  <div>
                    <div className={BizClass.DataHeading}>
                      <h4>{selectedCropHeader && selectedCropHeader}</h4>
                    </div>
                    <div className={BizClass.ItemDetailsDiv} style={{ "justify-content": "center" }}>
                      <table className={BizClass.ItemDetailsTable}>
                        <thead>
                          <tr>
                            <th>Insurance Company</th>
                            <th>Sum Insured(Rs)/Hectare</th>
                            <th>Farmer Share(%)</th>
                            <th>Acturial Rate(%)</th>
                            <th>Cut Off Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{selectedCropData && selectedCropData.insuranceCompanyName}</td>
                            <td>{selectedCropData && selectedCropData.sumInsured}</td>
                            <td>{selectedCropData && selectedCropData.farmerShare}</td>
                            <td>{selectedCalculation && selectedCalculation.ActurialRate}</td>
                            <td>{selectedCropData && dateFormatDDMMYY(selectedCropData.cutOfDate.split("T")[0])}</td>
                          </tr>
                        </tbody>
                      </table>
                      <table className={BizClass.ItemDetailsTable}>
                        <thead>
                          <tr>
                            <th>Crop</th>
                            <th>Area(Hectare)</th>
                            <th>Premium Paid By Farmer(Rs)</th>
                            <th>Premium Paid By Govt(Rs)</th>
                            <th>Sum Insured(Rs)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{selectedCropData && selectedCropData.cropName}</td>
                            <td>{selectedCalculation && selectedCalculation.AreaInhectare}</td>
                            <td>{selectedCalculation && selectedCalculation.Preminumpaidbyfarmer}</td>
                            <td>{selectedCalculation && selectedCalculation.Preminumpaidbygovt}</td>
                            <td>{selectedCalculation && selectedCalculation.CalculatedSumInsured}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={BizClass.FooterSection}>
            <Button onClick={() => clearFormOnClick()}>Reset</Button>
            <Button
              className={btnCalculateState ? BizClass.disableCalculatorBtn : ""}
              trigger={btnLoaderActive && "true"}
              onClick={() => getCalculatorDataOnClick()}
            >
              Calculate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PremiumCalculator;
