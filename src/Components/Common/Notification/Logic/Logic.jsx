import { useEffect, useState } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import {
  getMasterDataBindingDataList,
  // A getDistrictByState,
  // A getSubDistrictByStateANDDistrictDataList,
  // A getVillageListBYSubDistrictAndDistrictDataList,
  getLocationHierarchyData,
  getLevel3Data,
  getLevel4Data,
  getLevel5Data,
  getLevel6Data,
  getLevel7Data,
} from "../../../Modules/Support/ManageTicket/Views/Modals/AddTicket/Services/Methods";

import { getNotificationCropListVillageWiseDataList } from "../Service/Method";

function NotificationLogics() {
  const setAlertMessage = AlertMessage();

  const [openModal, setOpenModal] = useState(false);
  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
    console.log(params.api);
    setGridApi(params.api);
  };

  const onChangeNotificationDetails = (val) => {
    gridApi.setQuickFilter(val);
  };

  const [seasonForPolicyNumberDropdownDataList] = useState([
    { CropSeasonID: 1, CropSeasonName: "Kharif" },
    { CropSeasonID: 2, CropSeasonName: "Rabi" },
  ]);
  // A const [seasonForPolicyNumberDropdownDataList, setSeasonForPolicyNumberDropdownDataList] = useState([]);
  // A const [isLoadingSeasonPolicyNumberDropdownDataList, setIsLoadingSeasonForPolicyNumberDropdownDataList] = useState(false);
  // A const getSeasonForPolicyNumberListData = async () => {
  // A  try {
  // A    setIsLoadingSeasonForPolicyNumberDropdownDataList(true);
  // A    const formdata = {
  // A      filterID: 0,
  // A      filterID1: 0,
  // A      masterName: "SEASON",
  // A      searchText: "#ALL",
  // A      searchCriteria: "AW",
  // A    };
  // A    const result = await getMasterDataBindingDataList(formdata);
  // A    console.log(result, "Season Data");
  // A    setIsLoadingSeasonForPolicyNumberDropdownDataList(false);
  // A    if (result.response.responseCode === 1) {
  // A      if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
  // A        setSeasonForPolicyNumberDropdownDataList(result.response.responseData.masterdatabinding);
  // A      } else {
  // A        setSeasonForPolicyNumberDropdownDataList([]);
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
  //     });
  //   }
  // };

  const [lableTalukAnything, setlableTalukAnything] = useState("SubDistrict");
  const [lableVillageForByLocation, setlableVillageForByLocation] = useState("Village");
  const [lablelevel5, setlablelevel5] = useState("NyayPanchayat");
  const [lablelevel6, setlablelevel6] = useState("GramPanchayat");
  const [formValuesForByLocation, setFormValuesForByLocation] = useState({
    txtStateForByLocation: null,
    txtDistrictForByLocation: null,
    txtSubDistrictForByLocation: null,
    txtVillageForByLocation: null,
    txtSeasonForLocation: null,
    txtYearForLocation: null,
    txtSchemeForLocation: null,
  });

  const [formValidationFarmersError, setFormValidationFarmersError] = useState({});

  const [districtForByLocationDropdownDataList, setDistrictForByLocationDropdownDataList] = useState([]);
  const [isLoadingDistrictForByLocationDropdownDataList, setIsLoadingDistrictForByLocationDropdownDataList] = useState(false);
  const getDistrictByStateForByLocationListData = async (pstateAlphaCode) => {
    try {
      setIsLoadingDistrictForByLocationDropdownDataList(true);
      // A const formdata = {
      // A  stateAlphaCode: pstateAlphaCode,
      // A };
      const formdata = {
        level2: pstateAlphaCode,
      };
      // A const result = await getDistrictByState(formdata);
      const result = await getLevel3Data(formdata);
      console.log(result, "District Data");
      setIsLoadingDistrictForByLocationDropdownDataList(false);
      if (result.response.responseCode === 1) {
        // A if (result.response.responseData) {
        // A  if (Object.keys(result.response.responseData.data).length === 0) {
        // A    setDistrictForByLocationDropdownDataList([]);
        // A  } else {
        // A    setDistrictForByLocationDropdownDataList(result.response.responseData.data.hierarchy.level3);
        // A  }
        // A} else {
        // A  setDistrictForByLocationDropdownDataList([]);
        // A }
        if (Object.keys(result.response.responseData.data).length === 0) {
          setDistrictForByLocationDropdownDataList([]);
        } else {
          setDistrictForByLocationDropdownDataList(result.response.responseData.data.hierarchy.level3);
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

  const [subDistrictForByLocationDropdownDataList, setSubDistrictForByLocationDropdownDataList] = useState([]);
  const [isLoadingSubDistrictForByLocationDropdownDataList, setIsLoadingSubDistrictForByLocationDropdownDataList] = useState(false);
  // A const getSubDistrictByStateANDDistrictListData = async (pstateAlphaCode, pdistrictAlphaCode) => {
  const getSubDistrictByStateANDDistrictListData = async (plevel3ID) => {
    try {
      setIsLoadingSubDistrictForByLocationDropdownDataList(true);
      // A const formdata = {
      // A  districtAlphaCode: pdistrictAlphaCode,
      // A  stateAlphaCode: pstateAlphaCode,
      // A };
      const formdata = {
        level3: plevel3ID,
      };
      // A const result = await getSubDistrictByStateANDDistrictDataList(formdata);
      const result = await getLevel4Data(formdata);
      console.log(result, "SubDistrict Data");
      setIsLoadingSubDistrictForByLocationDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          // A if (Object.keys(result.response.responseData.data).length === 0) {
          // A  setSubDistrictForByLocationDropdownDataList([]);
          // A} else {
          // A  setSubDistrictForByLocationDropdownDataList(result.response.responseData.data);
          // A}
          if (Object.keys(result.response.responseData.data).length === 0) {
            setSubDistrictForByLocationDropdownDataList([]);
          } else {
            setSubDistrictForByLocationDropdownDataList(result.response.responseData.data.hierarchy.level4);
          }
        } else {
          setSubDistrictForByLocationDropdownDataList([]);
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

  const getLocationHierarchyListData = async (pStateAlphaCode, pStateMasterID, pSeason, pYear, pScheme) => {
    debugger;
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
          // A setlableVillageForByLocation(`
          // A Village${result.response.responseData.data[0].level6 ? ` -  ${result.response.responseData.data[0].level6}` : ""}${
          // A  result.response.responseData.data[0].level5 ? ` -  ${result.response.responseData.data[0].level5}` : ""
          // A }
          // A `);
          // A getDistrictByStateForByLocationListData(pStateMasterID);
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
  // A const getVillageListBYSubDistrictAndDistrictListData = async (pdistrictAlphaCode, psubDistrictAlphaCode) => {
  // A  try {
  // A    setIsLoadingVillageForByLocationDropdownDataList(true);
  // A    const formdata = {
  // A      districtAlphaCode: pdistrictAlphaCode,
  // A      subDistrictAlphaCode: psubDistrictAlphaCode,
  // A    };
  // A    const result = await getVillageListBYSubDistrictAndDistrictDataList(formdata);
  // A    console.log(result, "Village Data");
  // A    setIsLoadingVillageForByLocationDropdownDataList(false);
  // A    if (result.response.responseCode === 1) {
  // A      if (result.response.responseData) {
  // A        if (Object.keys(result.response.responseData.data).length === 0) {
  // A          setVillageForByLocationDropdownDataList([]);
  // A        } else {
  // A          const mappedData = result.response.responseData.data.map((value) => {
  // A            return {
  // A              label: `${value.level7Name} - ${value.level6Name} - ${value.level5Name}`,
  // A              value: value.level7ID,
  // A           };
  // A          });

  // A          setVillageForByLocationDropdownDataList(mappedData);
  // A        }
  // A      } else {
  // A        setVillageForByLocationDropdownDataList([]);
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

    return errorsMsg;
  };

  const updateStateForByLocation = (name, value) => {
    debugger;
    setFormValuesForByLocation({ ...formValuesForByLocation, [name]: value });
    console.log("name , value", name, value);
    formValidationFarmersError[name] = validateFarmersField(name, value);
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
        // A setlableTalukAnything(value.Level4Name ? value.Level4Name : "SubDistrict");
        // A setlablelevel5(value.Level5Name ? value.Level5Name : "NyayPanchayat");
        // A setlablelevel6(value.Level6Name ? value.Level6Name : "GramPanchayat");
        // A setlableVillageForByLocation(`
        // A Village${value.Level5Name ? ` -  ${value.Level5Name}` : ""}${value.Level6Name ? ` -  ${value.Level6Name}` : ""}
        // A  `);
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
        // A getSubDistrictByStateANDDistrictListData(value.DistrictMasterCode);
        // A getSubDistrictByStateANDDistrictListData(value.DistrictCodeAlpha, formValuesForByLocation.txtStateForByLocation.StateCodeAlpha);
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
        // A getVillageListBYSubDistrictAndDistrictListData(value.SubDistrictMasterCode);
        // A getlevel5ListData(value.SubDistrictMasterCode, formValuesForByLocation.txtDistrictForByLocation.DistrictCodeAlpha);
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
        // A getlevel6ListData(
        // A  formValuesForByLocation.txtDistrictForByLocation.DistrictCodeAlpha,
        // A  formValuesForByLocation.txtSubDistrictForByLocation.SubDistrictMasterCode,
        // A  value.level5ID,
        // A );
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
        // A getVillageListBYSubDistrictAndDistrictListData(value.SubDistrictMasterCode, formValuesForByLocation.txtDistrictForByLocation.DistrictCodeAlpha);
        // A getlevel7ListData(
        // A  formValuesForByLocation.txtDistrictForByLocation.DistrictCodeAlpha,
        // A  formValuesForByLocation.txtSubDistrictForByLocation.SubDistrictMasterCode,
        // A  formValuesForByLocation.txtlevel5ByLocation.level5ID,
        // A  value.level6ID,
        // A );
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

  const [stateForByLocationDropdownDataList, setStateForByLocationDropdownDataList] = useState([]);
  const [isLoadingStateForByLocationDropdownDataList, setIsLoadingStateForByLocationDropdownDataList] = useState(false);
  const getStateForByLocationListData = async () => {
    debugger;
    try {
      setIsLoadingStateForByLocationDropdownDataList(true);
      const formdata = {
        filterID: 0,
        filterID1: 0,
        masterName: "STATEMAS",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBindingDataList(formdata);
      console.log(result, "State Data");
      setIsLoadingStateForByLocationDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setStateForByLocationDropdownDataList(result.response.responseData.masterdatabinding);
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

  const [yearList, setYearList] = useState([]);

  const handleFarmersValidation = () => {
    try {
      const errors = {};
      let formIsValid = true;

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
      errors["txtYearForLocation"] = validateFarmersField("txtYearForLocation", formValuesForByLocation.txtYearForLocation);
      errors["txtSeasonForLocation"] = validateFarmersField("txtSeasonForLocation", formValuesForByLocation.txtSeasonForLocation);
      errors["txtSchemeForLocation"] = validateFarmersField("txtSchemeForLocation", formValuesForByLocation.txtSchemeForLocation);
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

  const [btnLoaderActive, setBtnLoaderActive] = useState(false);
  const [notificationData, setNotificationData] = useState([]);
  const getNotificationDataOnClick = async () => {
    debugger;
    if (!handleFarmersValidation()) {
      return;
    }
    try {
      debugger;
      let result = "";
      let formData = "";

      const user = getSessionStorage("user");

      const pschemeID =
        formValuesForByLocation.txtSchemeForLocation.SchemeID === 2 ? "02" : formValuesForByLocation.txtSchemeForLocation.SchemeID === 4 ? "04" : "";
      const pseasonID =
        formValuesForByLocation.txtSeasonForLocation.CropSeasonID === 1 ? "01" : formValuesForByLocation.txtSeasonForLocation.CropSeasonID === 2 ? "02" : "";
      const pstateID =
        formValuesForByLocation.txtStateForByLocation.StateMasterID.toString().length < 2
          ? `0${formValuesForByLocation.txtStateForByLocation.StateMasterID}`
          : formValuesForByLocation.txtStateForByLocation.StateMasterID;
      const pyearID = formValuesForByLocation.txtYearForLocation.Value.toString().substr(formValuesForByLocation.txtYearForLocation.Value.length - 2);
      const psssyID = `${pschemeID}${pseasonID}${pstateID}${pyearID}`;

      formData = {
        // A villageAlphaCode: formValuesForByLocation.txtVillageForByLocation ? formValuesForByLocation.txtVillageForByLocation.value.toString() : "",
        villageAlphaCode:
          formValuesForByLocation.txtVillageForByLocation && formValuesForByLocation.txtVillageForByLocation.level7ID
            ? formValuesForByLocation.txtVillageForByLocation.level7ID
            : "",
        sssyID: psssyID,
        mobileNo: user && user.UserMobileNumber ? user.UserMobileNumber : "",
      };
      setBtnLoaderActive(true);
      result = await getNotificationCropListVillageWiseDataList(formData);
      setBtnLoaderActive(false);
      console.log(result, "result");
      setNotificationData([]);
      if (result.response.responseCode === 1) {
        if (result.response.responseData.data.length === 0) {
          setAlertMessage({
            type: "warning",
            message: "Notification Not Found",
          });
        } else {
          setNotificationData(result.response.responseData.data);
          toggleModal();
        }
      } else {
        setAlertMessage({
          type: "warning",
          message: "Notification Not Found",
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

  const clearFormOnClick = () => {
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
    setDistrictForByLocationDropdownDataList([]);
    setSubDistrictForByLocationDropdownDataList([]);
    setVillageForByLocationDropdownDataList([]);
    setlableVillageForByLocation("Village");
    setlableTalukAnything("SubDistrict");
    setlablelevel5("NyayPanchayat");
    setlablelevel6("GramPanchayat");
    setlevel5ByLocationDropdownDataList([]);
    setlevel6ByLocationDropdownDataList([]);
    setFormValidationFarmersError({});
  };

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearArray = [];
    for (let i = 2018; i <= currentYear; i += 1) {
      yearArray.push({ Name: i.toString(), Value: i.toString() });
    }

    setYearList(yearArray.sort().reverse());
    // A getSeasonForPolicyNumberListData();
    // A getSchemeListData();
    getStateForByLocationListData();
  }, []);

  return {
    openModal,
    toggleModal,
    yearList,
    formValidationFarmersError,
    updateStateForByLocation,
    formValuesForByLocation,
    btnLoaderActive,
    lableTalukAnything,
    lableVillageForByLocation,
    stateForByLocationDropdownDataList,
    isLoadingStateForByLocationDropdownDataList,
    districtForByLocationDropdownDataList,
    isLoadingDistrictForByLocationDropdownDataList,
    subDistrictForByLocationDropdownDataList,
    isLoadingSubDistrictForByLocationDropdownDataList,
    villageForByLocationDropdownDataList,
    isLoadingVillageForByLocationDropdownDataList,
    seasonForPolicyNumberDropdownDataList,
    // A isLoadingSeasonPolicyNumberDropdownDataList,
    schemeList,
    // A isLoadingSchemeListDropdownDataList,
    onGridReady,
    getNotificationDataOnClick,
    notificationData,
    onChangeNotificationDetails,
    clearFormOnClick,
    lablelevel5,
    level5ByLocationDropdownDataList,
    isLoadinglevel5ByLocationDropdownDataList,
    lablelevel6,
    level6ByLocationDropdownDataList,
    isLoadinglevel6ByLocationDropdownDataList,
  };
}
export default NotificationLogics;
