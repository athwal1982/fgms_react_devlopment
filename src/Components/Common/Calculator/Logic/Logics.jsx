import { useEffect, useRef, useState } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { getMasterDataBindingDataList, getDistrictByState } from "../../../Modules/Support/ManageTicket/Views/Modals/AddTicket/Services/Methods";
import { getCropListDistrictWiseDataList, AddCalculatedPremiumData } from "../Service/Method";

function CalculatorLogics() {
  const setAlertMessage = AlertMessage();

  const myRef = useRef(null);

  const executeScroll = () => myRef.current.scrollIntoView({ behavior: "smooth" });

  const [seasonForCalculatorDropdownDataList] = useState([
    { CropSeasonID: 1, CropSeasonName: "Kharif" },
    { CropSeasonID: 2, CropSeasonName: "Rabi" },
  ]);
  // A const [seasonForCalculatorDropdownDataList, setSeasonForCalculatorDropdownDataList] = useState([]);
  // A const [isLoadingSeasonCalculatorDropdownDataList, setIsLoadingSeasonForCalculatorDropdownDataList] = useState(false);
  // A const getSeasonForCalculatorListData = async () => {
  // A  try {
  // A    setIsLoadingSeasonForCalculatorDropdownDataList(true);
  // A    const formdata = {
  // A      filterID: 0,
  // A      filterID1: 0,
  // A      masterName: "SEASON",
  // A      searchText: "#ALL",
  // A      searchCriteria: "AW",
  // A    };
  // A    const result = await getMasterDataBindingDataList(formdata);
  // A    console.log(result, "Season Data");
  // A    setIsLoadingSeasonForCalculatorDropdownDataList(false);
  // A    if (result.response.responseCode === 1) {
  // A      if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
  // A        setSeasonForCalculatorDropdownDataList(result.response.responseData.masterdatabinding);
  // A      } else {
  // A        setSeasonForCalculatorDropdownDataList([]);
  // A      }
  // A    } else {
  // A      setAlertMessage({
  // A        type: "error",
  // A        message: result.response.responseMessage,
  // A      });
  // A    }
  // A  } catch (error) {
  // A    console.log(error);
  // A    setAlertMessage({
  // A      type: "error",
  // A      message: error,
  // A    });
  //   }
  // };

  const [schemeList] = useState([
    { SchemeID: 2, SchemeName: "Weather Based Crop Insurance Scheme(WBCIS)" },
    { SchemeID: 4, SchemeName: "Pradhan Mantri Fasal Bima Yojna(PMFBY)" },
  ]);
  // A const [schemeList, setSchemeList] = useState([]);
  // A const [isLoadingSchemeListDropdownDataList, setIsLoadingSchemeListDropdownDataList] = useState(false);
  // A const getSchemeListData = async () => {
  // A  try {
  // A    setIsLoadingSchemeListDropdownDataList(true);
  // A    const formdata = {
  // A      filterID: 0,
  // A      filterID1: 0,
  // A      masterName: "SCHEME",
  // A      searchText: "#ALL",
  // A      searchCriteria: "AW",
  // A    };
  // A    const result = await getMasterDataBindingDataList(formdata);
  // A    console.log(result, "Scheme Data");
  // A    setIsLoadingSchemeListDropdownDataList(false);
  // A    if (result.response.responseCode === 1) {
  // A      if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
  // A        setSchemeList(result.response.responseData.masterdatabinding);
  // A      } else {
  // A        setSchemeList([]);
  // A      }
  // A    } else {
  // A      setAlertMessage({
  // A        type: "error",
  // A        message: result.response.responseMessage,
  // A      });
  // A    }
  // A  } catch (error) {
  // A    console.log(error);
  // A    setAlertMessage({
  // A      type: "error",
  // A      message: error,
  // A    });
  // A  }
  // A};

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

  const validateFarmersField = (name, value) => {
    let errorsMsg = "";
    if (name === "txtCallerMobileNumber") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Mobile Number is required!";
      } else if (value) {
        const isValidIndianMobile = /^[6-9]\d{9}$/.test(value);
        const isAllSameDigit = /^(\d)\1{9}$/.test(value);

        if (!isValidIndianMobile) {
          errorsMsg = "Enter a valid 10-digit mobile number";
        } else if (isAllSameDigit) {
          errorsMsg = "Mobile Number cannot be all the same digit!";
        }
      }
    }

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

  const [selectedCropData, setSelectedCropData] = useState({});
  const [selectedCropHeader, setSelectedCropHeader] = useState("");
  const [selectedCalculation, setselectedCalculation] = useState({});
  const updateStateForCalculator = (name, value) => {
    setFormValuesForCalculator({ ...formValuesForCalculator, [name]: value });
    formValidationFarmersError[name] = validateFarmersField(name, value);

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

  const [yearList, setYearList] = useState([]);

  const handleFarmersValidation = () => {
    try {
      const errors = {};
      let formIsValid = true;

      errors["txtCallerMobileNumber"] = validateFarmersField("txtCallerMobileNumber", formValuesForCalculator.txtCallerMobileNumber);
      errors["txtStateForCalculator"] = validateFarmersField("txtStateForCalculator", formValuesForCalculator.txtStateForCalculator);
      errors["txtDistrictForCalculator"] = validateFarmersField("txtDistrictForCalculator", formValuesForCalculator.txtDistrictForCalculator);
      errors["txtYearForCalculator"] = validateFarmersField("txtYearForCalculator", formValuesForCalculator.txtYearForCalculator);
      errors["txtSeasonForCalculator"] = validateFarmersField("txtSeasonForCalculator", formValuesForCalculator.txtSeasonForCalculator);
      errors["txtSchemeForCalculator"] = validateFarmersField("txtSchemeForCalculator", formValuesForCalculator.txtSchemeForCalculator);
      errors["txtCropForCalculator"] = validateFarmersField("txtCropForCalculator", formValuesForCalculator.txtCropForCalculator);
      errors["txtAreaInHectareForCalculator"] = validateFarmersField("txtAreaInHectareForCalculator", formValuesForCalculator.txtAreaInHectareForCalculator);
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
        mobileNumber: formValuesForCalculator.txtCallerMobileNumber ? formValuesForCalculator.txtCallerMobileNumber : "",
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
    if (!handleFarmersValidation()) {
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

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearArray = [];
    for (let i = 2018; i <= currentYear; i += 1) {
      yearArray.push({ Name: i.toString(), Value: i.toString() });
    }

    setYearList(yearArray.sort().reverse());
    // A getSeasonForCalculatorListData();
    // A getSchemeListData();
    getStateForCalculatorListData();
  }, []);

  return {
    yearList,
    formValidationFarmersError,
    updateStateForCalculator,
    formValuesForCalculator,
    btnLoaderActive,
    stateForCalculatorDropdownDataList,
    isLoadingStateForCalculatorDropdownDataList,
    districtForCalculatorDropdownDataList,
    isLoadingDistrictForCalculatorDropdownDataList,
    seasonForCalculatorDropdownDataList,
    // AisLoadingSeasonCalculatorDropdownDataList,
    schemeList,
    // A isLoadingSchemeListDropdownDataList,
    cropForCalculatorDropdownDataList,
    isLoadingCropForCalculatorDropdownDataList,
    getCalculatorDataOnClick,
    clearFormOnClick,
    selectedCropData,
    selectedCropHeader,
    selectedCalculation,
    myRef,
    btnCalculateState,
  };
}

export default CalculatorLogics;
