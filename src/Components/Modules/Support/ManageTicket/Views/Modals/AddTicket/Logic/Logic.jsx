import { useEffect, useState, useRef } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { getSessionStorage, setSessionStorage } from "Components/Common/Login/Auth/auth";
import { dateToSpecificFormat, daysdifference, getCurrentDateTimeTick } from "Configration/Utilities/dateformat";
import moment from "moment";
import {
  getMasterDataBindingDataList,
  getLocationMasterDataBindingDataList,
  getDistrictByState,
  getBankByDistrictDataList,
  getBranchByBankANDDistrictDataList,
  getSubDistrictByStateANDDistrictDataList,
  getVillageListBYSubDistrictAndDistrictDataList,
  checkFarmerByMobileNumber,
  checkFarmerByAadharNumber,
  checkFarmerByAccountNumber,
  checkFarmerByPolicy,
  getAppInsuranceDetails,
  getFarmerPolicyDetail,
  addSupportTicket,
  sendSMSToFarmer,
  searchPolicy,
  FarmerTicketSummary,
  getClaimDetailData,
  getLocationHierarchyData,
  getLevel3Data,
  getLevel4Data,
  getLevel5Data,
  getLevel6Data,
  getLevel7Data,
  UploadDocumentData,
  farmerCallingHistoryData,
} from "../Services/Methods";
// A import { getfarmerTicketsList } from "../../../../Services/Methods";

function AddTicketLogics() {
  const [selectedOption, setSelectedOption] = useState("1");
  const [selectedOptionCropStage, setSelectedOptionCropStage] = useState("1");
  const [selectedValidateOption, setSelectedValidateOption] = useState("1");
  const [selectedClaimOrGrievence, setSelectedClaimOrGrievence] = useState("");
  const [claimOrGrievenceDisabled, setClaimOrGrievenceDisabled] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const ticketBindingData = getSessionStorage("ticketDataBindingSsnStrg");
  const [btnEnableSaveOnValidateMN, setBtnEnableSaveOnValidateMN] = useState(false);
  const [reasonDropdownDataList] = useState([
    { ID: 1, Value: "Caller voice not clear" },
    { ID: 2, Value: "Caller did not provide required details" },
    { ID: 3, Value: "Call disconnected" },
  ]);
  const [callConnectedDropdownDataList] = useState([
    { ID: 1, Value: "Connected" },
    { ID: 2, Value: "Disconnected" },
  ]);
  const [radioFarmerAuthentication, setRadioFarmerAuthentication] = useState(false);
  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  const [openInsuranceCompanyModal, setOpenInsuranceCompanyModal] = useState(false);
  const toggleInsuranceCompanyModal = () => {
    setOpenInsuranceCompanyModal(!openInsuranceCompanyModal);
  };

  const [openClaimStatusModal, setOpenClaimStatusModal] = useState(false);
  const toggleClaimStatusModal = () => {
    setOpenClaimStatusModal(!openClaimStatusModal);
  };

  const [openInsuranceCompanyModalGreivence, setOpenInsuranceCompanyModalGreivence] = useState(false);
  const toggleInsuranceCompanyModalGreivence = () => {
    setOpenInsuranceCompanyModalGreivence(!openInsuranceCompanyModalGreivence);
  };

  const [openTicketHistoryModal, setOpenTicketHistoryModal] = useState(false);
  const toggleTicketHistoryModal = () => {
    setOpenTicketHistoryModal(!openTicketHistoryModal);
  };

  const setAlertMessage = AlertMessage();
  const fileRef = useRef(null);
  const mobileNoSelect = useRef();
  const aadharNoSelect = useRef();

  const [formValues, setFormValues] = useState({
    txtState: null,
    txtDistrict: null,
    txtBankName: null,
    txtBranchName: null,
    txtAccountNumber: "",
  });

  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
    console.log(params.api);
    setGridApi(params.api);
  };

  const [gridApiTicketHistory, setGridApiTicketHistory] = useState();
  const onGridReadyTicketHistory = (params) => {
    console.log(params.api);
    setGridApiTicketHistory(params.api);
  };

  const [gridApiClaimStatus, setGridApiClaimStatus] = useState();
  const onGridReadyClaimStatus = (params) => {
    console.log(params.api);
    setGridApiClaimStatus(params.api);
  };

  const [formValidationFarmersError, setFormValidationFarmersError] = useState({});
  const [formValidationFarmersInfoError, setFormValidationFarmersInfoError] = useState({});
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
            setStateForPolicyNumberDropdownDataList(result.response.responseData.masterdatabinding);
            setSessionStorage("stateSsnStrg", result.response.responseData.masterdatabinding);
          } else {
            setStateDropdownDataList([]);
            setStateForPolicyNumberDropdownDataList([]);
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

  const [lableTalukAnythingForPolicyNumber, setlableTalukAnythingForPolicyNumber] = useState("SubDistrict");
  const [lableVillageForPolicyNumber, setlableVillageForPolicyNumber] = useState("Village");

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

  const [districtForPolicyNumberDropdownDataList, setDistrictForPolicyNumberDropdownDataList] = useState([]);
  const [isLoadingDistrictForPolicyNumberDropdownDataList, setIsLoadingDistrictForPolicyNumberDropdownDataList] = useState(false);
  const getDistrictByStateForPolicyNumberListData = async (pstateAlphaCode) => {
    try {
      setIsLoadingDistrictForPolicyNumberDropdownDataList(true);
      const formdata = {
        stateAlphaCode: pstateAlphaCode,
      };
      const result = await getDistrictByState(formdata);
      console.log(result, "District Data");
      setIsLoadingDistrictForPolicyNumberDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          if (Object.keys(result.response.responseData.data).length === 0) {
            setDistrictForPolicyNumberDropdownDataList([]);
          } else {
            setDistrictForPolicyNumberDropdownDataList(result.response.responseData.data.hierarchy.level3);
          }
        } else {
          setDistrictForPolicyNumberDropdownDataList([]);
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

  const [subDistrictForPolicyNumberDropdownDataList, setSubDistrictForPolicyNumberDropdownDataList] = useState([]);
  const [isLoadingSubDistrictForPolicyNumberDropdownDataList, setIsLoadingSubDistrictForPolicyNumberDropdownDataList] = useState(false);
  const getSubDistrictByStateANDDistrictForPolicyNumberListData = async (pstateAlphaCode, pdistrictAlphaCode) => {
    try {
      setIsLoadingSubDistrictForPolicyNumberDropdownDataList(true);
      const formdata = {
        districtAlphaCode: pdistrictAlphaCode,
        stateAlphaCode: pstateAlphaCode,
      };
      const result = await getSubDistrictByStateANDDistrictDataList(formdata);
      console.log(result, "SubDistrict Data");
      setIsLoadingSubDistrictForPolicyNumberDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          if (Object.keys(result.response.responseData.data).length === 0) {
            setSubDistrictForPolicyNumberDropdownDataList([]);
          } else {
            setSubDistrictForPolicyNumberDropdownDataList(result.response.responseData.data);
          }
        } else {
          setSubDistrictForPolicyNumberDropdownDataList([]);
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

  const [villageForPolicyNumberDropdownDataList, setVillageForPolicyNumberDropdownDataList] = useState([]);
  const [isLoadingVillageForPolicyNumberDropdownDataList, setIsLoadingVillageForPolicyNumberDropdownDataList] = useState(false);
  const getVillageListBYSubDistrictAndDistrictForPolicyNumberListData = async (pdistrictAlphaCode, psubDistrictAlphaCode) => {
    try {
      setIsLoadingVillageForPolicyNumberDropdownDataList(true);
      const formdata = {
        districtAlphaCode: pdistrictAlphaCode,
        subDistrictAlphaCode: psubDistrictAlphaCode,
      };
      const result = await getVillageListBYSubDistrictAndDistrictDataList(formdata);
      console.log(result, "Village Data");
      setIsLoadingVillageForPolicyNumberDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          if (Object.keys(result.response.responseData.data).length === 0) {
            setVillageForPolicyNumberDropdownDataList([]);
          } else {
            const mappedData = result.response.responseData.data.map((value) => {
              return {
                label: `${value.level7Name} - ${value.level6Name} - ${value.level5Name}`,
                value: value.level7ID,
              };
            });

            setVillageForPolicyNumberDropdownDataList(mappedData);
          }
        } else {
          setVillageForPolicyNumberDropdownDataList([]);
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

  // A const [schemeList, setSchemeList] = useState([]);
  const [schemeList] = useState([
    { SchemeID: 2, SchemeName: "Weather Based Crop Insurance Scheme(WBCIS)" },
    { SchemeID: 4, SchemeName: "Pradhan Mantri Fasal Bima Yojna(PMFBY)" },
  ]);
  // A const [seasonForPolicyNumberDropdownDataList, setSeasonForPolicyNumberDropdownDataList] = useState([]);
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
  const updateStateForPolicyNumber = (name, value) => {
    setFormValuesForPolicyNumber({ ...formValuesForPolicyNumber, [name]: value });

    if (name === "txtStateForPolicyNumber") {
      setFormValuesForPolicyNumber({
        ...formValues,
        txtStateForPolicyNumber: value,
        txtDistrictForPolicyNumber: null,
        txtSubDistrictForPolicyNumber: null,
        txtVillageForPolicyNumber: null,
      });
      setDistrictForPolicyNumberDropdownDataList([]);
      setSubDistrictForPolicyNumberDropdownDataList([]);
      setVillageForPolicyNumberDropdownDataList([]);
      setlableTalukAnythingForPolicyNumber("SubDistrict");
      setlableVillageForPolicyNumber("Village");

      if (value) {
        setlableTalukAnythingForPolicyNumber(value.Level4Name ? value.Level4Name : "SubDistrict");
        setlableVillageForPolicyNumber(`
        Village${value.Level6Name ? ` -  ${value.Level6Name}` : ""}${value.Level5Name ? ` -  ${value.Level5Name}` : ""}
        `);

        getDistrictByStateForPolicyNumberListData(value.StateCodeAlpha);
      }
    }
    if (name === "txtDistrictForPolicyNumber") {
      setFormValuesForPolicyNumber({
        ...formValuesForPolicyNumber,
        txtDistrictForPolicyNumber: value,
        txtSubDistrictForPolicyNumber: null,
        txtVillageForPolicyNumber: null,
      });
      setSubDistrictForPolicyNumberDropdownDataList([]);
      setVillageForPolicyNumberDropdownDataList([]);
      if (value) {
        getSubDistrictByStateANDDistrictForPolicyNumberListData(formValuesForPolicyNumber.txtStateForPolicyNumber.StateCodeAlpha, value.level3ID);
      }
    }

    if (name === "txtSubDistrictForPolicyNumber") {
      setFormValuesForPolicyNumber({
        ...formValuesForPolicyNumber,
        txtSubDistrictForPolicyNumber: value,
        txtVillageForPolicyNumber: null,
      });
      setVillageForPolicyNumberDropdownDataList([]);
      if (value) {
        getVillageListBYSubDistrictAndDistrictForPolicyNumberListData(formValuesForPolicyNumber.txtDistrictForPolicyNumber.level3ID, value.level4ID);
      }
    }

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

  // A const [isLoadingStateForPolicyNumberDropdownDataList, setIsLoadingStateForPolicyNumberDropdownDataList] = useState(false);
  // A const getStateForPolicyNumberListData = async () => {
  // A  try {
  // A    setIsLoadingStateForPolicyNumberDropdownDataList(true);
  // A    const formdata = {
  // A      filterID: 0,
  // A      filterID1: 0,
  // A      masterName: "STATEMAS",
  // A      searchText: "#ALL",
  // A      searchCriteria: "AW",
  // A    };
  // A    const result = await getMasterDataBindingDataList(formdata);
  // A    console.log(result, "State Data");
  // A    setIsLoadingStateForPolicyNumberDropdownDataList(false);
  // A    if (result.response.responseCode === 1) {
  // A      if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
  // A        setStateForPolicyNumberDropdownDataList(result.response.responseData.masterdatabinding);
  // A      } else {
  // A        setStateForPolicyNumberDropdownDataList([]);
  // A      }
  // A    } else {
  // A      setAlertMessage({
  // A        type: "error",
  // A        message: result.response.responseMessage,
  // A      });
  // A   }
  // A  } catch (error) {
  // A    console.log(error);
  // A    setAlertMessage({
  // A      type: "error",
  // A      message: error,
  // A    });
  // A  }
  // };

  // A const [isLoadingSeasonForPolicyNumberDropdownDataList, setIsLoadingSeasonForPolicyNumberDropdownDataList] = useState(false);
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
    txtYearForLocation: null,
    txtSeasonForLocation: null,
    txtSchemeForLocation: null,
    txtlevel5ByLocation: null,
    txtlevel6ByLocation: null,
  });

  const [districtForByLocationDropdownDataList, setDistrictForByLocationDropdownDataList] = useState([]);
  const [isLoadingDistrictForByLocationDropdownDataList, setIsLoadingDistrictForByLocationDropdownDataList] = useState(false);
  const getDistrictByStateForByLocationListData = async (pstateAlphaCode) => {
    try {
      setIsLoadingDistrictForByLocationDropdownDataList(true);
      // A const user = getSessionStorage("user");
      // A const formdata = {
      // A  level: 2,
      // A  filterID: pstateAlphaCode.toString(),
      // A  userID: user && user.LoginID ? user.LoginID : 0,
      // A  searchText: "#ALL",
      // A  searchCriteria: "AW",
      // A };
      const formdata = {
        level2: pstateAlphaCode,
      };

      // A const result = await getLocationMasterDataBindingDataList(formdata);
      const result = await getLevel3Data(formdata);
      console.log(result, "District Data");
      setIsLoadingDistrictForByLocationDropdownDataList(false);
      if (result.response.responseCode === 1) {
        // A  if (
        // A    result.response.responseData &&
        // A    result.response.responseData.locationmasterdatabinding &&
        // A    result.response.responseData.locationmasterdatabinding.length > 0
        // A  ) {
        // A    setDistrictForByLocationDropdownDataList(result.response.responseData.locationmasterdatabinding);
        // A  } else {
        // A    setDistrictForByLocationDropdownDataList([]);
        // A  }
        // A } else {
        // A  setAlertMessage({
        // A    type: "error",
        // A    message: result.response.responseMessage,
        // A  });
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
  // A const getSubDistrictByStateANDDistrictListData = async (pdistrictAlphaCode, pstateAlphaCode) => {
  const getSubDistrictByStateANDDistrictListData = async (plevel3ID) => {
    try {
      setIsLoadingSubDistrictForByLocationDropdownDataList(true);
      // A const user = getSessionStorage("user");
      // Aconst formdata = {
      // A  level: 3,
      // A  filterID: pdistrictAlphaCode.toString(),
      // A  userID: user && user.LoginID ? user.LoginID : 0,
      // A  searchText: "#ALL",
      // A  searchCriteria: "AW",
      // A};
      // A const result = await getLocationMasterDataBindingDataList(formdata);
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
        // A if (
        // A  result.response.responseData &&
        // A  result.response.responseData.locationmasterdatabinding &&
        // A  result.response.responseData.locationmasterdatabinding.length > 0
        // A) {
        // A  setSubDistrictForByLocationDropdownDataList(result.response.responseData.locationmasterdatabinding);
        // A} else {
        // A  setSubDistrictForByLocationDropdownDataList([]);
        // A }
        if (result.response.responseData) {
          // A if (Object.keys(result.response.responseData.data).length === 0) {
          // A  setSubDistrictForByLocationDropdownDataList([]);
          // A} else {
          // A  // A setSubDistrictForByLocationDropdownDataList(result.response.responseData.data);
          // A  const mappedData = result.response.responseData.data.map((value) => {
          // A    return {
          // A      SubDistrictMasterName: value.level4Name,
          // A      SubDistrictMasterCode: value.level4ID,
          // A    };
          // A  });
          // A  setSubDistrictForByLocationDropdownDataList(mappedData);
          // A }
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
  // A const getVillageListBYSubDistrictAndDistrictListData = async (psubDistrictAlphaCode, pdistrictAlphaCode) => {
  // A  try {
  // A    setIsLoadingVillageForByLocationDropdownDataList(true);
  // A    // A const user = getSessionStorage("user");
  // A    // Aconst formdata = {
  // A    // A  level: 4,
  // A    // A  filterID: psubDistrictAlphaCode.toString(),
  // A    // A  userID: user && user.LoginID ? user.LoginID : 0,
  // A    // A  searchText: "#ALL",
  // A    // A  searchCriteria: "AW",
  // A    // A };
  // A    // A const result = await getLocationMasterDataBindingDataList(formdata);
  // A    const formdata = {
  // A      districtAlphaCode: pdistrictAlphaCode,
  // A      subDistrictAlphaCode: psubDistrictAlphaCode,
  // A    };
  // A    const result = await getVillageListBYSubDistrictAndDistrictDataList(formdata);
  // A    console.log(result, "Village Data");
  // A    setIsLoadingVillageForByLocationDropdownDataList(false);
  // A    if (result.response.responseCode === 1) {
  // A      // A if (
  // A      // A  result.response.responseData &&
  // A      // A  result.response.responseData.locationmasterdatabinding &&
  // A      // A  result.response.responseData.locationmasterdatabinding.length > 0
  // A     // A) {
  // A      // A  setVillageForByLocationDropdownDataList(result.response.responseData.locationmasterdatabinding);
  // A      // A} else {
  // A      // A  setVillageForByLocationDropdownDataList([]);
  // A      // A}
  // A      if (Object.keys(result.response.responseData.data).length === 0) {
  // A        setVillageForByLocationDropdownDataList([]);
  // A      } else {
  // A        const mappedData = result.response.responseData.data.map((value) => {
  // A          return {
  // A            VillageName: `${value.level7Name} - ${value.level6Name} - ${value.level5Name}`,
  // A            VillageAlphCode: value.level7ID,
  // A          };
  // A        });

  // A        setVillageForByLocationDropdownDataList(mappedData);
  // A      }
  // A    } else {
  // A      setVillageForByLocationDropdownDataList([]);
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
  // A };

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
  //   }
  // };

  const validateFarmersField = (name, value) => {
    let errorsMsg = "";
    const regex = new RegExp("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$");

    if (selectedValidateOption === "1") {
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
      if (btnEnableSaveOnValidateMN === true) {
        if (name === "txtReason") {
          if (!value || typeof value === "undefined") {
            errorsMsg = "Reason is required!";
          }
        }
        if (formValuesMN && formValuesMN.txtCallStatus && formValuesMN.txtCallStatus.ID === 1) {
          if (name === "txtFarmerName") {
            if (!value || typeof value === "undefined") {
              errorsMsg = "Farmer Name is required!";
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
        }
      }
    }
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
          errorsMsg = `${lableTalukAnything} is required!`;
        }
      }
      if (name === "txtlevel5ByLocation") {
        if (!value || typeof value === "undefined") {
          errorsMsg = `${lablelevel5} is required!`;
        }
      }
      if (name === "txtlevel6ByLocation") {
        if (!value || typeof value === "undefined") {
          errorsMsg = `${lablelevel6} is required!`;
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

  const updateStateForByLocation = (name, value) => {
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
    try {
      if (getSessionStorage("stateByLocationSsnStrg") === null) {
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
            setSessionStorage("stateByLocationSsnStrg", result.response.responseData.locationmasterdatabinding);
          } else {
            setStateForByLocationDropdownDataList([]);
          }
        } else {
          setAlertMessage({
            type: "error",
            message: result.response.responseMessage,
          });
        }
      } else {
        setStateForByLocationDropdownDataList(getSessionStorage("stateByLocationSsnStrg"));
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const [formValidationCounter, setFormValidationCounter] = useState({});
  const [formValuesTicketCreation, setFormValuesTicketCreation] = useState({
    // A txtDocumentUpload: "",
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
  const [formValuesCallerInformation, setFormValuesCallerInformation] = useState({
    txtCallerMobileNumber: "",
  });

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
      // A setTicketCategoryList([]);
      // A setIsTicketCategoryList(true);
      // A const formdata = {
      // A   filterID: supportTicketTypeID,
      // A  filterID1: 0,
      // A  masterName: "TCKCGZ",
      // A  searchText: "#ALL",
      // A  searchCriteria: "AW",
      // A };
      // A const result = await getMasterDataBindingDataList(formdata);
      // A console.log(result, "ticketCategory");
      // A setIsTicketCategoryList(false);
      // A if (result.response.responseCode === 1) {
      // A  if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
      // A    setTicketCategoryList(result.response.responseData.masterdatabinding);
      // A  } else {
      // A    setTicketCategoryList([]);
      // A  }
      // A } else {
      // A  setAlertMessage({
      // A    type: "error",
      // A    message: result.response.responseMessage,
      // A  });
      // A}
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
    // A try {
    // A  setIsTicketCategoryTypeList(true);
    // A  const formdata = {
    // A    filterID: pselectedOption,
    // A    filterID1: pCropLossDetailID,
    // A    masterName: pMasterName, // A "TCKTYP",
    // A    searchText: "#ALL",
    // A    searchCriteria: "AW",
    // A  };
    // A  const result = await getMasterDataBindingDataList(formdata);
    // A  console.log(result, "ticktCategoryType");
    // A  setIsTicketCategoryTypeList(false);
    // A  if (result.response.responseCode === 1) {
    // A    if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
    // A      setTicketCategoryTypeList(result.response.responseData.masterdatabinding);
    // A    } else {
    // A      setTicketCategoryTypeList([]);
    // A    }
    // A  } else {
    // A    setAlertMessage({
    // A      type: "error",
    // A      message: result.response.responseMessage,
    // A    });
    // A  }
    // A} catch (error) {
    // A  console.log(error);
    // A  setAlertMessage({
    // A    type: "error",
    // A    message: error,
    // A  });
    // A}
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
      // A setIsLoadingLossAtList(true);
      // A const formdata = {
      // A  filterID: pCropStageID,
      // A  filterID1: 0,
      // A  masterName: "CRPDTL",
      // A  searchText: "#ALL",
      // A  searchCriteria: "AW",
      // A};
      // A const result = await getMasterDataBindingDataList(formdata);
      // A setIsLoadingLossAtList(false);
      // A setLossAtList([]);
      // A if (result.response.responseCode === 1) {
      // A if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
      // A    setLossAtList(result.response.responseData.masterdatabinding);
      // A  } else {
      // A    setLossAtList([]);
      // A  }
      // A} else {
      // A  setAlertMessage({
      // A    type: "error",
      // A    message: result.response.responseMessage,
      // A  });
      // }
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
      // A setIsLoadingCropStageList(true);
      // A const formdata = {
      // A  filterID: pCropStageID,
      // A  filterID1: 0,
      // A  masterName: "CRPSTG",
      // A  searchText: "#ALL",
      // A  searchCriteria: "AW",
      // A };
      // A const result = await getMasterDataBindingDataList(formdata);
      // A setIsLoadingCropStageList(false);
      // A setCropStageList([]);
      // A if (result.response.responseCode === 1) {
      // A  if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
      // A    setCropStageList(result.response.responseData.masterdatabinding);
      // A  } else {
      // A    setCropStageList([]);
      // A  }
      // A} else {
      // A  setAlertMessage({
      // A    type: "error",
      // A    message: result.response.responseMessage,
      //   });
      // }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const [formValidationSupportTicketError, setFormValidationSupportTicketError] = useState({});

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
    if (name === "txtCallerMobileNumber") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Caller Mobile Number is required!";
      } else if (value) {
        if (value.length < 10) {
          errorsMsg = "Enter Valid 10 digit Caller Mobile Number!";
        }
      }
    }
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
      } else if (value) {
        if (value.length > 500) {
          errorsMsg = "Ticket Description can not exceed more than 500 characters!";
        }
      }
    }

    return errorsMsg;
  };
  const [formValuesForFarmerInfo, setFormValuesForFarmerInfo] = useState({
    txtSeasonForFarmerInfo: null,
    txtYearForFarmerInfo: null,
    txtSchemeForFarmerInfo: null,
  });
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
  const handleValidationSupportTicket = () => {
    try {
      const errors = {};
      let formIsValid = true;

      // A errors["txtDocumentUpload"] = validateFieldSupportTicket("txtDocumentUpload", formValuesTicketCreation.txtDocumentUpload);
      errors["txtCallerMobileNumber"] = validateFieldSupportTicket("txtCallerMobileNumber", formValuesCallerInformation.txtCallerMobileNumber);
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

  const [stateCropLossIntimation, setStateCropLossIntimation] = useState("NA");
  const updateStateTicketCreation = (name, value) => {
    debugger;
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

  const updateStateCallerInformation = (name, value) => {
    setFormValuesCallerInformation({ ...formValuesCallerInformation, [name]: value });
    formValidationSupportTicketError[name] = validateFieldSupportTicket(name, value);
  };

 // A const [runningCurrentYear, setRunningCurrentYear] = useState("");
  useEffect(() => {
    const currentYear = new Date().getFullYear();
   // A  setRunningCurrentYear(currentYear);
    const yearArray = [];
    for (let i = 2018; i <= currentYear; i += 1) {
      yearArray.push({ Name: i.toString(), Value: i.toString() });
    }

    setYearList(yearArray.sort().reverse());
    // A getSeasonForPolicyNumberListData();
    // A getSchemeListData();
    getStateListData();
    // A getStateForPolicyNumberListData();
    getStateForByLocationListData();
    getTicketCategoryTypeListData("1", 0, "TCKTYP");
  }, []);

  const [selectedFarmer, setSelectedFarmer] = useState([]);

  const [formValuesMN, setFormValuesMN] = useState({
    txtMobileNumber: null,
    txtStateValidateMobile: null,
    txtDistrictValidateMobile: null,
    txtCallStatus: { ID: 1, Value: "Connected" },
    txtFarmerName: "",
    txtReason: null,
  });

  const updateStateMN = (name, value) => {
    debugger;
    setFormValuesMN({ ...formValuesMN, [name]: value });
    formValidationFarmersError[name] = validateFarmersField(name, value);
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

  const [formValuesAN, setFormValuesAN] = useState({
    txtAadharNumber: null,
  });

  const updateStateAN = (name, value) => {
    setFormValuesAN({ ...formValuesAN, [name]: value });
    formValidationFarmersError[name] = validateFarmersField(name, value);
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

  const [selectedInsuranceDetails, setSelectedInsuranceDetails] = useState([]);
  const [insuranceCompanyData, setInsuranceCompanyData] = useState([]);
  const [insuranceCompanyDataGreivence, setInsuranceCompanyDataGreivence] = useState([]);
  const [ticketHistoryData, setTicketHistoryData] = useState([]);
  const [farmersTicketSummaryData, setFarmersTicketSummaryData] = useState([]);
  const [claimStatusData, setClaimStatusData] = useState([]);
  const clearFarmerAuthenticationForm = () => {
    setFormValuesMN({
      ...formValuesMN,
      txtMobileNumber: "",
      txtStateValidateMobile: null,
      txtDistrictValidateMobile: null,
      txtCallStatus: { ID: 1, Value: "Connected" },
      txtFarmerName: "",
      txtReason: null,
    });
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
    setFormValuesCallerInformation({
      ...formValuesCallerInformation,
      txtCallerMobileNumber: "",
    });
    setDistrictDropdownDataList([]);
    setBankDropdownDataList([]);
    setBankBranchDropdownDataList([]);
    setDistrictForPolicyNumberDropdownDataList([]);
    setSubDistrictForPolicyNumberDropdownDataList([]);
    setVillageForPolicyNumberDropdownDataList([]);
    setDistrictForByLocationDropdownDataList([]);
    setSubDistrictForByLocationDropdownDataList([]);
    setVillageForByLocationDropdownDataList([]);
    setSelectedFarmer([]);
    setlableTalukAnything("SubDistrict");
    setlableTalukAnythingForPolicyNumber("SubDistrict");
    setlableVillageForByLocation("Village");
    setlableVillageForPolicyNumber("Village");
    setFormValidationFarmersError({});
    setFormValidationFarmersInfoError({});
    setInsuranceCompanyData([]);
    setInsuranceCompanyDataGreivence([]);
    setTicketCategoryTypeList([]);
    setTicketCategoryList([]);
    setSelectedOption("1");
    getTicketCategoryTypeListData("1", 0, "TCKTYP");
    setSelectedInsuranceDetails([]);
    setSelectedClaimOrGrievence("");
    setClaimOrGrievenceDisabled(false);
    setfilterSeasonListPolicyNumber([]);
    setfilterYearListPolicyNumber([]);
    setSeasonPolicyNumber("");
    setStatePolicyNumber("");
    setYearPolicyNumber("");
    setTicketHistoryData([]);
    setFarmersTicketSummaryData([]);
    setLossAtList([]);
    setCropStageList([]);
    setlablelevel5("NyayPanchayat");
    setlablelevel6("GramPanchayat");
    setlevel5ByLocationDropdownDataList([]);
    setlevel6ByLocationDropdownDataList([]);
    setFormValidationSupportTicketError({});
    setStateCropLossIntimation("NA");
    setBtnEnableSaveOnValidateMN(false);
    setfetchfarmersummary("");
    setstateYearAndSeason("YRSSNYES");
    setRadioFarmerAuthentication(false);
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
    } else if (selectedOption === "PN") {
      setSelectedValidateOption("4");
    } else if (selectedOption === "BL") {
      setSelectedValidateOption("5");
    }
  };

  const handleFarmersValidation = () => {
    try {
      const errors = {};
      let formIsValid = true;

      errors["txtMobileNumber"] = validateFarmersField("txtMobileNumber", formValuesMN.txtMobileNumber);
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
      result = await FarmerTicketSummary(formData);
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
          // A setAlertMessage({
          // A  type: "error",
          // A  message: result.response.responseMessage,
          // A });
        }
      } else {
        setFarmersTicketSummaryData([]);
        // A setAlertMessage({
        // A  type: "error",
        // A  message: result.response.responseMessage,
        // A });
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
    debugger;
    getfarmersTicketSummaryData(fetchfarmersummary);
  };

  const [fetchfarmersummary, setfetchfarmersummary] = useState("");
  const [valisRegistered, setvalisRegistered] = useState("");
  const [btnLoaderActive, setBtnLoaderActive] = useState(false);
  const validateFarmerByMobileNumber = async () => {
    if (!handleFarmersValidation()) {
      return;
    }
    try {
      let result = "";
      let formData = "";
      formData = {
        mobilenumber: formValuesMN.txtMobileNumber,
      };
      setBtnLoaderActive(true);
      result = await checkFarmerByMobileNumber(formData);
      setBtnLoaderActive(false);
      setSelectedFarmer([]);
      setfetchfarmersummary("");
      setFarmersTicketSummaryData([]);
      setStateCropLossIntimation("NA");
      if (result.response.responseCode === 1) {
        const parseFarmerData = result.response.responseData;
        if (parseFarmerData.data.output === 1) {
          setSelectedFarmer(parseFarmerData.data.result);
          // A getfarmersTicketSummaryData(parseFarmerData.data.result.farmerID);
          setfetchfarmersummary(parseFarmerData.data.result.farmerID);
          setBtnEnableSaveOnValidateMN(false);
        }
      } else {
        if (mobileNoSelect.current) {
          mobileNoSelect.current.focus();
        }
        setAlertMessage({
          type: "warning",
          message: result.response.responseMessage,
        });
        setBtnEnableSaveOnValidateMN(true);
        setRadioFarmerAuthentication(true);
        setfetchfarmersummary("");
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

  const clearInputFarmerAuthenticateMN = () => {
    setFormValuesMN({
      ...formValuesMN,
      txtMobileNumber: "",
      txtStateValidateMobile: null,
      txtDistrictValidateMobile: null,
      txtCallStatus: { ID: 1, Value: "Connected" },
      txtFarmerName: "",
      txtReason: null,
    });
    setBtnEnableSaveOnValidateMN(false);
    setvalisRegistered("");
    setRadioFarmerAuthentication(false);
  };

  const [btnLoaderActiveValidateMN, setBtnLoaderActiveValidateMN] = useState(false);
  const SavevalidateFarmerOnClick = async () => {
    debugger;
    if (!handleFarmersValidation()) {
      return;
    }
    try {
      const formData = {
        callerMobileNumber: formValuesMN.txtMobileNumber ? formValuesMN.txtMobileNumber : "",
        farmerMobileNumber: "",
        farmerName: formValuesMN.txtFarmerName ? formValuesMN.txtFarmerName : "",
        callStatus: formValuesMN.txtCallStatus && formValuesMN.txtCallStatus.Value ? formValuesMN.txtCallStatus.Value : "",
        reason: formValuesMN.txtReason && formValuesMN.txtReason.Value ? formValuesMN.txtReason.Value : "",
        stateCodeAlpha:
          formValuesMN.txtStateValidateMobile && formValuesMN.txtStateValidateMobile.StateCodeAlpha ? formValuesMN.txtStateValidateMobile.StateCodeAlpha : "",
        districtCodeAlpha:
          formValuesMN.txtDistrictValidateMobile && formValuesMN.txtDistrictValidateMobile.level3ID ? formValuesMN.txtDistrictValidateMobile.level3ID : "",
        isRegistered: valisRegistered,
      };
      setBtnLoaderActiveValidateMN(true);
      const result = await farmerCallingHistoryData(formData);
      setBtnLoaderActiveValidateMN(false);
      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });
        clearInputFarmerAuthenticateMN();
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
  const [farmersData, setFarmersData] = useState([]);
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
  const validateFarmerByLocation = async () => {
    if (!handleFarmersValidation()) {
      return;
    }

    try {
      let result = "";
      let formData = "";
      setBtnLoaderActive(true);

      // A formData = {
      // A  districtAlphaCode: formValuesForByLocation.txtDistrictForByLocation
      // A    ? formValuesForByLocation.txtDistrictForByLocation.DistrictCodeAlpha.toString()
      // A    : "",
      // A  villageAlphaCode: formValuesForByLocation.txtVillageForByLocation ? formValuesForByLocation.txtVillageForByLocation.level7ID.toString() : "",
      // A  seasonCode: formValuesForByLocation.txtSeasonForLocation ? formValuesForByLocation.txtSeasonForLocation.CropSeasonID.toString() : "",
      // A  yearCode: formValuesForByLocation.txtYearForLocation ? formValuesForByLocation.txtYearForLocation.Value.toString() : "",
      // A };
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
      console.log(result, "result");
      setFarmersData([]);
      setfetchfarmersummary("");
      setFarmersTicketSummaryData([]);
      setStateCropLossIntimation("NA");
      if (result.response.responseCode === 1) {
        const farmersData = Object.values(result.response.responseData.data);
        console.log(Object.values(result.response.responseData.data));
        console.log("data");
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
            console.log("filterData", filterData);
            setFarmersData(filterData);
            // Neha setFarmersData(farmersData.find((x) => x.schemeName === formValuesForByLocation.txtSchemeForLocation.ShortName));
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
  const onChangeFarmersDetails = (val) => {
    gridApi.setQuickFilter(val);
  };

  const onChangeTicketHistory = (val) => {
    gridApiTicketHistory.setQuickFilter(val);
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
  const onCellDoubleClickedDetails = (event) => {
    setSelectedOption("2");

    setClaimOrGrievenceDisabled(false);
    setSelectedClaimOrGrievence("CI");
    setSelectedInsuranceDetails(event.data);
    if (event.data && event.data.scheme) {
      setFormValuesForFarmerInfo({
        ...formValuesForFarmerInfo,
        txtSchemeForFarmerInfo: event.data && event.data.scheme ? schemeList.find((x) => x.ShortName === event.data.schemeName) : null,
      });
    }
    setTicketCategoryList([]);
    getTicketCategoryTypeListData("2", 0, "TCKTYP");
    toggleInsuranceCompanyModal();
  };

  const onCellDoubleClickedDetailsGreivence = (event) => {
    setSelectedOption("1");
    setSelectedClaimOrGrievence("GR");
    setClaimOrGrievenceDisabled(true);
    setSelectedInsuranceDetails(event.data);
    if (event.data && event.data.scheme) {
      // A const scheme = event.data && event.data.scheme ? schemeList.find((x) => x.ShortName === event.data.scheme) : null;
      // A if (scheme !== null) {
      // A  if (formValuesForFarmerInfo.txtSchemeForFarmerInfo === null) {
      // A    setFormValuesForFarmerInfo({
      // A      ...formValuesForFarmerInfo,
      // A      txtSchemeForFarmerInfo: scheme,
      // A    });
      // A  }
      // A }
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

  const clearInsuranceFields = () => {
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
    setTicketCategoryList([]);
    setFormValuesCallerInformation({
      ...formValuesCallerInformation,
      txtCallerMobileNumber: "",
    });
  };

  const validateFarmerOnClick = () => {
    clearInsuranceFields();
    if (selectedValidateOption === "1") {
      validateFarmerByMobileNumber();
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

  const [btnLoaderFarmerInfoActive, setBtnLoaderFarmerInfoActive] = useState(false);
  const [isLoadingApplicationNoData, setIsLoadingApplicationNodata] = useState(false);

  const getPolicyOfFarmerOnClick = async () => {
    if (!handleFarmersInfoValidation()) {
      return;
    }
    try {
      setBtnLoaderFarmerInfoActive(true);
      setIsLoadingApplicationNodata(true);
      if (selectedFarmer.length === 0 && selectedFarmer.length !== undefined) {
        setAlertMessage({
          type: "error",
          message: "Farmer Authentication is required!",
        });
        setBtnLoaderFarmerInfoActive(false);
        setIsLoadingApplicationNodata(false);
        return;
      }

      let result = "";
      let formData = "";

      const pSeasionID =
        formValuesForFarmerInfo.txtSeasonForFarmerInfo.CropSeasonID === 1
          ? "01"
          : formValuesForFarmerInfo.txtSeasonForFarmerInfo.CropSeasonID === 2
          ? "02"
          : "";

      formData = {
        mobilenumber: "8956238456",
        disctrictID: selectedFarmer ? selectedFarmer.districtID : 0,
        seasonID: pSeasionID,
        year: formValuesForFarmerInfo.txtYearForFarmerInfo ? formValuesForFarmerInfo.txtYearForFarmerInfo.Value.toString() : "",
        farmerID: selectedFarmer ? selectedFarmer.farmerID : "",
      };
      result = await getAppInsuranceDetails(formData);
      console.log(result, "applicationData");
      setBtnLoaderFarmerInfoActive(false);
      setIsLoadingApplicationNodata(false);
      setSelectedInsuranceDetails([]);
      if (result.response.responseCode === 1) {
        const aryayInsuranceCompany = [];
        if (result.response.responseData && result.response.responseData.data) {
          if (Object.keys(result.response.responseData.data).length > 0) {
            if (result.response.responseData.data.output === 0) {
              setInsuranceCompanyData([]);
              setAlertMessage({
                type: "warning",
                message: "Policy Data not found.",
              });
            } else {
              aryayInsuranceCompany.push(result.response.responseData.data.result);

              setInsuranceCompanyData(aryayInsuranceCompany[0]);
              toggleInsuranceCompanyModal();
            }
          } else {
            setInsuranceCompanyData([]);
            setAlertMessage({
              type: "warning",
              message: "Policy Data not found..",
            });
          }
        } else {
          setInsuranceCompanyData([]);
          setAlertMessage({
            type: "warning",
            message: "Policy Data not found..",
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

  const [btnLoaderFarmerGreivenceInfoActive, setBtnLoaderFarmerGreivenceInfoActive] = useState(false);
  const [isLoadingApplicationNoDatGreivence, setIsLoadingApplicationNodatGreivence] = useState(false);

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

  const [btnLoaderTicketHistoryActive, setBtnLoaderTicketHistoryActive] = useState(false);
  const [isLoadingTicketHistory, setIsLoadingTicketHistory] = useState(false);
  const getTicketHistoryOnClick = async (pTicketStatusID) => {
    try {
      setBtnLoaderTicketHistoryActive(true);
      setIsLoadingTicketHistory(true);
      if (selectedFarmer.length === 0 && selectedFarmer.length !== undefined) {
        setAlertMessage({
          type: "error",
          message: "Farmer Authentication is required!",
        });
        setBtnLoaderTicketHistoryActive(false);
        setIsLoadingTicketHistory(false);
        return;
      }

      const pticketRequestorID = selectedFarmer && selectedFarmer.farmerID ? selectedFarmer.farmerID : "";

      if (pticketRequestorID === "") {
        setAlertMessage({
          type: "error",
          message: "farmerID is required!",
        });
        setBtnLoaderTicketHistoryActive(false);
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
      const result = await FarmerTicketSummary(formData);
      setBtnLoaderTicketHistoryActive(false);
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

  // A const getTicketHistoryOnClick = async (pTicketStatusID) => {
  // A
  // A  try {
  // A    setBtnLoaderTicketHistoryActive(true);
  // A    setIsLoadingTicketHistory(true);
  // A    if (selectedFarmer.length === 0 && selectedFarmer.length !== undefined) {
  // A      setAlertMessage({
  // A        type: "error",
  // A        message: "Farmer Authentication is required!",
  // A      });
  // A      setBtnLoaderTicketHistoryActive(false);
  // A      setIsLoadingTicketHistory(false);
  // A      return;
  // A    }

  // A    const pFarmerMobileNo = selectedFarmer && selectedFarmer.mobile ? selectedFarmer.mobile : "";

  // A    if (pFarmerMobileNo === "") {
  // A      setAlertMessage({
  // A        type: "error",
  // A        message: "Farmer Mobile No is required!",
  // A      });
  // A      setBtnLoaderTicketHistoryActive(false);
  // A      setIsLoadingTicketHistory(false);
  // A      return;
  // A    }

  // A    const formData = {
  // A      insuranceCompanyID: 0,
  // A      viewTYP: "MOBILE",
  // A      stateID: "",
  // A      supportTicketID: 0,
  // A      ticketCategoryID: 0,
  // A      ticketSourceID: 0,
  // A      supportTicketTypeID: 0,
  // A      supportTicketNo: "",
  // A      statusID: 0,
  // A      fromdate: "",
  // A      toDate: "",
  // A      RequestorMobileNo: pFarmerMobileNo,
  // A      schemeID: 0,
  // A      ticketHeaderID: 0,
  // A    };
  // A    const result = await getfarmerTicketsList(formData);
  // A    setBtnLoaderTicketHistoryActive(false);
  // A    setIsLoadingTicketHistory(false);
  // A    if (result.responseCode === 1) {
  // A      if (result.responseData.supportTicket.length > 0) {
  // A        let filterData = [];
  // A        if (pTicketStatusID === 109301) {
  // A         filterData = result.responseData.supportTicket.filter((data) => {
  // A            return data.TicketStatusID === 109301;
  // A          });
  // A        }
  // A        if (pTicketStatusID === 109303) {
  // A          filterData = result.responseData.supportTicket.filter((data) => {
  // A            return data.TicketStatusID === 109303;
  // A          });
  // A        }
  // A        if (pTicketStatusID === 0) {
  // A          filterData = result.responseData.supportTicket;
  // A        }
  // A        // A setTicketHistoryData(result.responseData.supportTicket);
  // A        setTicketHistoryData(filterData);
  // A        toggleTicketHistoryModal();
  // A      } else {
  // A        setTicketHistoryData([]);
  // A        setAlertMessage({
  // A          type: "warning",
  // A          message: "Ticket data not found",
  // A        });
  // A      }
  // A    } else {
  // A      setTicketHistoryData([]);
  // A      setAlertMessage({
  // A        type: "warning",
  // A        message: "Ticket data not found",
  // A      });
  // A    }
  // A  } catch (error) {
  // A    console.log(error);
  // A    setAlertMessage({
  // A      type: "error",
  // A      message: error,
  // A    });
  // A  }
  // A };

  const [btnLoaderClaimStatusActive, setBtnLoaderClaimStatusActive] = useState(false);
  const [isLoadingClaimStatusData, setIsLoadingClaimStatusData] = useState(false);
  const getClaimStatusOnClick = async (pApplicationNo) => {
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

  const onChangeClamStatus = (val) => {
    gridApiClaimStatus.setQuickFilter(val);
  };

  // A const clearFormTicketCreation = () => {
  // A  setFormValuesTicketCreation({
  // A    ...formValuesTicketCreation,
  // A    txtTicketCategory: null,
  // A    txtTicketCategoryType: null,
  // A    txtCropLossDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
  // A    txtCropLossTime: "",
  // A    txtTicketDescription: "",
  // A    txtLossAt: null,
  // A    txtLossAt: null,
  // A    txtOtherSubCategory: null,
  // A    txtCropStage: null,
  // A    txtCropHarvestDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
  // A  });
  // A  setSelectedFarmer([]);
  // A };

  const clearAddTicketForm = () => {
    clearFarmerAuthenticationForm();
  };

  const dateToCompanyFormat = (date) => {
    try {
      const format = "yyyy-MM-dd".toUpperCase();
      const d = new Date(date);
      const convertedDate = moment(d).format(format);
      return convertedDate;
    } catch {
      return "";
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
  const handleResetFile = async () => {
    fileRef.current.value = null;
    setFormValidationSupportTicketError({});
  };

  const [isBtndisabled, setisBtndisabled] = useState(0);
  const [btnLoaderSupportTicketActive, setBtnLoaderSupportTicketActive] = useState(false);
  // A const supportTicketOnClick = async (updateFarmersTickets, updateFarmersTicketsStatusCount, showfunc) => {
  const supportTicketOnClick = async (updateFarmersTickets, showfunc) => {
    debugger;
    try {
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
      const pAttachment =
        formValuesTicketCreation.txtDocumentUpload && formValuesTicketCreation.txtDocumentUpload ? formValuesTicketCreation.txtDocumentUpload : "";
      const UniqueDateTimeTick = getCurrentDateTimeTick();
      let pAttachmentName = "";
      let phasDocument = 0;
      let pAttachmentPath = "";
      if (pAttachment !== "") {
        phasDocument = 1;
        const val = pAttachment.name;
        const valExtension = val.substring(val.lastIndexOf(".")).toLowerCase().slice(1);
        const valSpilt = val.split(".");
        const ValOrgName = valSpilt[0].toString();
        pAttachmentName = `${UniqueDateTimeTick}_${ValOrgName}.${valExtension}`;
        pAttachmentPath = `krph_documents/${pAttachmentName}`;
        switch (valExtension) {
          case "jpeg":
          case "jpg":
          case "png":
          case "pdf":
            break;
          default:
            setAlertMessage({
              type: "error",
              message: "Please select only jpeg,jpg,png,pdf extension attachment.",
            });
            return;
        }
        if (pAttachment.size > 2000000) {
          setAlertMessage({
            type: "error",
            message: "Please upload less than 2MB or 2MB attachment!",
          });
          return;
        }
      }

      let pticketStatusID = 0;
      let pticketStatusNoneBMCG = 0;
      let pticketStatus = "";
      let papplicationNo = "";
      let pPolicyID = "";
      let pticketHeaderID = 0;

      if (selectedOption === "1" || selectedOption === "4") {
        pticketStatusID = 109019;
        pticketStatus = "Open";
        pticketStatusNoneBMCG = "109301";
        // A pticketHeaderID = 1;
        pticketHeaderID = Number(selectedOption);
      } else if (selectedOption === "2") {
        pticketStatusID = 109025;
        pticketStatus = "Resolved";
        pticketStatusNoneBMCG = "109303";
        // A pticketHeaderID = 2;
        pticketHeaderID = Number(selectedOption);
      }
      if (selectedClaimOrGrievence === "CI") {
        // A papplicationNo = selectedInsuranceDetails ? selectedInsuranceDetails.applicationNo : "";
        // A pPolicyID = selectedInsuranceDetails ? selectedInsuranceDetails.policyID : "";
        papplicationNo = selectedInsuranceDetails && selectedInsuranceDetails.applicationNo ? selectedInsuranceDetails.applicationNo : "";
        pPolicyID = selectedInsuranceDetails && selectedInsuranceDetails.policyID ? selectedInsuranceDetails.policyID : "";
      } else {
        // A papplicationNo = selectedInsuranceDetails && selectedInsuranceDetails.applicationList ? selectedInsuranceDetails.applicationList[0].applicationNo : "";
        // A pPolicyID = selectedInsuranceDetails && selectedInsuranceDetails.applicationList ? selectedInsuranceDetails.applicationList[0].policyID : "";
        papplicationNo = selectedInsuranceDetails && selectedInsuranceDetails.applicationNo ? selectedInsuranceDetails.applicationNo : "";
        pPolicyID = selectedInsuranceDetails && selectedInsuranceDetails.policyID ? selectedInsuranceDetails.policyID : "";
      }

      const user = getSessionStorage("user");
      const formData = {
        subCategoryName:
          formValuesTicketCreation.txtOtherSubCategory && formValuesTicketCreation.txtOtherSubCategory.OtherCategoryName
            ? formValuesTicketCreation.txtOtherSubCategory.OtherCategoryName
            : "",
        callerContactNumber: formValuesCallerInformation.txtCallerMobileNumber ? formValuesCallerInformation.txtCallerMobileNumber : "",
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
        requestorAadharNo: selectedFarmer && selectedFarmer.aadharNumber4 ? selectedFarmer.aadharNumber4 : "",
        ticketCategoryID:
          formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
            ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID
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
        ticketStatusID: pticketStatusID,
        applicationNo: papplicationNo,
        insuranceCompanyID: 0,
        companyName: selectedInsuranceDetails ? selectedInsuranceDetails.insuranceCompanyName : "",
        companyCode: 0,
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
        hasDocument: phasDocument,
        attachmentPath: pAttachment != "" ? pAttachmentPath : "",
        cropName: formValuesTicketCreation.txtCropName ? formValuesTicketCreation.txtCropName : "",
        applicationCropName: selectedInsuranceDetails ? selectedInsuranceDetails.cropName : "",
        area: selectedInsuranceDetails ? selectedInsuranceDetails.policyArea : "",
        villageName: selectedInsuranceDetails ? selectedInsuranceDetails.resVillage : "",
        relation: selectedInsuranceDetails ? selectedInsuranceDetails.relation : "",
        relativeName: selectedInsuranceDetails ? selectedInsuranceDetails.relativeName : "",
        districtName: selectedInsuranceDetails ? selectedInsuranceDetails.resDistrict : "",
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
      const result = await addSupportTicket(formData);
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
          const newlyAddedTicket = [
            {
              CallerContactNumber: formValuesCallerInformation.txtCallerMobileNumber ? formValuesCallerInformation.txtCallerMobileNumber : "",
              AgentName: user && user.UserDisplayName ? user.UserDisplayName : "",
              AgentUserID: user && user.LoginID ? user.LoginID.toString() : "0",
              ApplicationNo: formValues.txtApplicatioNo ? formValues.txtApplicatioNo.applicationNo : "",
              CreatedAt: moment().utcOffset("+05:30").format("YYYY-MM-DDTHH:mm:ss"),
              CreatedBY: user && user.UserDisplayName ? user.UserDisplayName : "",
              BusinessRelationName: user && user.UserCompanyType ? user.UserCompanyType : "",
              InsuranceCompany: formData.companyName,
              InsuranceCompanyID: result.response.responseData.InsuranceCompany ? result.response.responseData.InsuranceCompany : 0,
              InsuranceExpiryDate: "",
              InsurancePolicyDate: "",
              InsurancePolicyNo: pPolicyID,
              RequestorMobileNo: selectedFarmer && selectedFarmer.mobile ? selectedFarmer.mobile : "",
              RequestorName: formData.requestorName,
              RequestorUniqueNo: "0",
              SupportTicketID: result.response.responseData.SupportTicketID,
              TicketCategoryID:
                formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
                  ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID
                  : 0,
              TicketCategoryName: formValuesTicketCreation.txtTicketCategory ? formValuesTicketCreation.txtTicketCategory.TicketCategoryName : "",
              TicketDescription: formValuesTicketCreation.txtTicketDescription,
              LossDate:
                selectedOption !== "4" ? null : formValuesTicketCreation.txtCropLossDate ? dateToCompanyFormat(formValuesTicketCreation.txtCropLossDate) : "",
              LossTime: selectedOption !== "4" ? null : formValuesTicketCreation.txtCropLossTime ? formValuesTicketCreation.txtCropLossTime : "",
              TicketRequestorID: selectedFarmer ? selectedFarmer.farmerID : 0,
              StateMasterName: selectedFarmer && selectedFarmer.state ? selectedFarmer.state : selectedFarmer.resState ? selectedFarmer.resState : "",
              SupportTicketNo: result.response.responseData.SupportTicketNo ? result.response.responseData.SupportTicketNo : "",
              RequestorMobileNo: selectedFarmer && selectedFarmer.mobile ? selectedFarmer.mobile : "",
              TicketHeadName: pTicketHeadName,
              TicketSourceID: 6,
              TicketSourceName: "CSC",
              TicketStatus: pticketStatus,
              TicketStatusID: pticketStatusNoneBMCG,
              BMCGCode: pticketStatusID,
              TicketTypeName:
                formValuesTicketCreation.txtTicketCategoryType && formValuesTicketCreation.txtTicketCategoryType.SupportTicketTypeName
                  ? formValuesTicketCreation.txtTicketCategoryType.SupportTicketTypeName
                  : "",
              RequestYear:
                formValuesForFarmerInfo.txtYearForFarmerInfo && formValuesForFarmerInfo.txtYearForFarmerInfo.Value
                  ? formValuesForFarmerInfo.txtYearForFarmerInfo.Value
                  : 0,
              RequestSeason:
                formValuesForFarmerInfo.txtSeasonForFarmerInfo && formValuesForFarmerInfo.txtSeasonForFarmerInfo.CropSeasonID
                  ? formValuesForFarmerInfo.txtSeasonForFarmerInfo.CropSeasonID
                  : 0,
              Scheme:
                formValuesForFarmerInfo.txtSchemeForFarmerInfo && formValuesForFarmerInfo.txtSchemeForFarmerInfo.SchemeName
                  ? formValuesForFarmerInfo.txtSchemeForFarmerInfo.SchemeName
                  : "",
              ApplicationNo: papplicationNo,
              HasDocument: phasDocument,
              AttachmentPath: pAttachment != "" ? `krph_documents/${pAttachmentName}` : "",
              CropName: formValuesTicketCreation.txtCropName ? formValuesTicketCreation.txtCropName : "",
              ApplicationCropName: selectedInsuranceDetails ? selectedInsuranceDetails.cropName : "",
              AREA: selectedInsuranceDetails ? selectedInsuranceDetails.policyArea : "",
              VillageName: selectedInsuranceDetails ? selectedInsuranceDetails.resVillage : "",
              Relation: selectedInsuranceDetails ? selectedInsuranceDetails.relation : "",
              RelativeName: selectedInsuranceDetails ? selectedInsuranceDetails.relativeName : "",
              DistrictMasterName: selectedInsuranceDetails ? selectedInsuranceDetails.resDistrict : "",
              SubDistrictID: selectedInsuranceDetails ? selectedInsuranceDetails.resSubDistrictID : "",
              SubDistrictName: selectedInsuranceDetails ? selectedInsuranceDetails.resSubDistrict : "",
              PolicyPremium: selectedInsuranceDetails ? selectedInsuranceDetails.policyPremium : "",
              PolicyArea: selectedInsuranceDetails ? selectedInsuranceDetails.policyArea : "",
              PolicyType: selectedInsuranceDetails ? selectedInsuranceDetails.policyType : "",
              LandSurveyNumber: selectedInsuranceDetails ? selectedInsuranceDetails.landSurveyNumber : "",
              LandDivisionNumber: selectedInsuranceDetails ? selectedInsuranceDetails.landDivisionNumber : "",
              PlotVillageName: selectedInsuranceDetails ? selectedInsuranceDetails.plotVillageName : "",
              PlotDistrictName: selectedInsuranceDetails ? selectedInsuranceDetails.plotDistrictName : "",
              plotStateName: selectedInsuranceDetails ? selectedInsuranceDetails.plotStateName : "",
              plotDistrictRequestorID: selectedInsuranceDetails ? selectedInsuranceDetails.plotDistrictID : "",
              ApplicationSource: selectedInsuranceDetails ? selectedInsuranceDetails.applicationSource : "",
              CropShare: selectedInsuranceDetails ? selectedInsuranceDetails.cropShare : "",
              IFSCCode: selectedInsuranceDetails ? selectedInsuranceDetails.ifscCode : "",
              FarmerShare: selectedInsuranceDetails ? selectedInsuranceDetails.farmerShare : "",
              SowingDate: selectedInsuranceDetails ? selectedInsuranceDetails.sowingDate : "",
              IsNewlyAdded: true,
            },
          ];
          updateFarmersTickets(newlyAddedTicket);
          // A updateFarmersTicketsStatusCount();
          console.log(newlyAddedTicket);
          setAlertMessage({
            type: "success",
            message: result.response.responseMessage,
          });
          // ************Close right now
          // A clearFormTicketCreation();
          // A showfunc();
          // ***************************
          console.log(showfunc);

          if (pAttachment !== "") {
            const formDataDoc = new FormData();
            formDataDoc.append("ImageName", pAttachmentName);
            formDataDoc.append("ImgPath", pAttachmentPath);
            formDataDoc.append("files", pAttachment);

            try {
              const resultDoc = await UploadDocumentData(formDataDoc);
              console.log(resultDoc);
              handleResetFile();
            } catch (error) {
              console.log(error);
            }
          }
          clearInsuranceFieldsAndTicketCreation();
          // A getfarmersTicketSummaryData(selectedFarmer ? selectedFarmer.farmerID : "");
          setFarmersTicketSummaryData([]);
          setfetchfarmersummary(selectedFarmer ? selectedFarmer.farmerID : "");
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
            const pMobileNo = selectedFarmer && selectedFarmer.mobile ? selectedFarmer.mobile : "";
            const pSupportTicketNo = result.response.responseData.SupportTicketNo ? result.response.responseData.SupportTicketNo : "";
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
      txtOtherSubCategory: null,
      txtCropStage: null,
      txtCropHarvestDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
      txtCropName: "",
    });
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
      txtOtherSubCategory: null,
      txtCropStage: null,
      txtCropHarvestDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
      txtCropName: "",
    });
    setStateCropLossIntimation("NA");
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

  const [stateYearAndSeason, setstateYearAndSeason] = useState("YRSSNYES");
  const ResetYrSsnSchmApplicationDataOnClick = () => {
    setFormValuesForFarmerInfo({
      ...formValuesForFarmerInfo,
      txtSeasonForFarmerInfo: null,
      txtYearForFarmerInfo: null,
      txtSchemeForFarmerInfo: null,
    });
    setSelectedInsuranceDetails([]);
    setstateYearAndSeason("YRSSNYES");
  };

  return {
    selectedValidateOption,
    setSelectedValidateOption,
    selectedOption,
    setSelectedOption,
    openModal,
    toggleModal,
    yearList,
    formValues,
    setFormValues,
    updateState,
    stateDropdownDataList,
    isLoadingStateDropdownDataList,
    districtDropdownDataList,
    isLoadingDistrictDropdownDataList,
    bankDropdownDataList,
    isLoadingBankDropdownDataList,
    bankBranchDropdownDataList,
    isLoadingBankBranchDropdownDataList,
    formValuesForPolicyNumber,
    setFormValuesForPolicyNumber,
    updateStateForPolicyNumber,
    lableTalukAnythingForPolicyNumber,
    lableVillageForPolicyNumber,
    stateForPolicyNumberDropdownDataList,
    // A isLoadingStateForPolicyNumberDropdownDataList,
    districtForPolicyNumberDropdownDataList,
    isLoadingDistrictForPolicyNumberDropdownDataList,
    subDistrictForPolicyNumberDropdownDataList,
    isLoadingSubDistrictForPolicyNumberDropdownDataList,
    villageForPolicyNumberDropdownDataList,
    isLoadingVillageForPolicyNumberDropdownDataList,
    seasonForPolicyNumberDropdownDataList,
    // A isLoadingSeasonForPolicyNumberDropdownDataList,
    lableTalukAnything,
    lableVillageForByLocation,
    updateStateForByLocation,
    formValuesForByLocation,
    stateForByLocationDropdownDataList,
    isLoadingStateForByLocationDropdownDataList,
    districtForByLocationDropdownDataList,
    isLoadingDistrictForByLocationDropdownDataList,
    subDistrictForByLocationDropdownDataList,
    isLoadingSubDistrictForByLocationDropdownDataList,
    villageForByLocationDropdownDataList,
    isLoadingVillageForByLocationDropdownDataList,
    OnClickSelectedValidateOption,
    formValuesMN,
    formValuesAN,
    setFormValuesAN,
    updateStateMN,
    updateStateAN,
    validateFarmerOnClick,
    mobileNoSelect,
    aadharNoSelect,
    selectedFarmer,
    formValidationFarmersError,
    btnLoaderActive,
    onChangeFarmersDetails,
    onGridReady,
    onCellDoubleClicked,
    formValuesForFarmerInfo,
    formValidationFarmersInfoError,
    farmersData,
    btnLoaderFarmerInfoActive,
    updateStateForFarmerInfo,
    getPolicyOfFarmerOnClick,
    insuranceCompanyData,
    isLoadingApplicationNoData,
    updateStateTicketCreation,
    formValuesTicketCreation,
    ticketCategoryList,
    isLoadingTicketCategoryList,
    ticketCategoryTypeList,
    isLoadingTicketCategoryTypeList,
    formValidationSupportTicketError,
    btnLoaderSupportTicketActive,
    supportTicketOnClick,
    selectedOptionOnClick,
    openInsuranceCompanyModal,
    toggleInsuranceCompanyModal,
    onCellDoubleClickedDetails,
    selectedInsuranceDetails,
    formValidationCounter,
    btnLoaderFarmerGreivenceInfoActive,
    isLoadingApplicationNoDatGreivence,
    getPolicyOfFarmerGreivenceOnClick,
    openInsuranceCompanyModalGreivence,
    insuranceCompanyDataGreivence,
    toggleInsuranceCompanyModalGreivence,
    onCellDoubleClickedDetailsGreivence,
    selectedClaimOrGrievence,
    claimOrGrievenceDisabled,
    clearAddTicketForm,
    schemeList,
    // A isLoadingSchemeListDropdownDataList,
    openTicketHistoryModal,
    getTicketHistoryOnClick,
    btnLoaderTicketHistoryActive,
    toggleTicketHistoryModal,
    ticketHistoryData,
    isLoadingTicketHistory,
    onGridReadyTicketHistory,
    onChangeTicketHistory,
    isBtndisabled,
    farmersTicketSummaryData,
    getClaimStatusOnClick,
    btnLoaderClaimStatusActive,
    openClaimStatusModal,
    toggleClaimStatusModal,
    claimStatusData,
    isLoadingClaimStatusData,
    onGridReadyClaimStatus,
    onChangeClamStatus,
    openCustomeWindow,
    OnClickCustomeWindow,
    customeWindowWidth,
    customeWindowHeight,
    selectedOptionCropStage,
    selectedOptionOnClickCropStage,
    lossAtList,
    isLoadingLossAtList,
    cropStageList,
    isLoadingCropStageList,
    lablelevel5,
    level5ByLocationDropdownDataList,
    isLoadinglevel5ByLocationDropdownDataList,
    lablelevel6,
    level6ByLocationDropdownDataList,
    isLoadinglevel6ByLocationDropdownDataList,
    formValuesCallerInformation,
    updateStateCallerInformation,
    handleResetFile,
    fileRef,
    stateCropLossIntimation,
    btnEnableSaveOnValidateMN,
    btnLoaderActiveValidateMN,
    SavevalidateFarmerOnClick,
    clearInputFarmerAuthenticateMN,
    reasonDropdownDataList,
    callConnectedDropdownDataList,
    btnLoaderActiveTicketSummary,
    fetchfarmersummary,
    fetchfarmersTicketSummary,
    // A runningCurrentYear,
    stateYearAndSeason,
    ResetYrSsnSchmApplicationDataOnClick,
    radioFarmerAuthentication,
    ticketCategoryOtherList,
    isLoadingTicketCategoryOtherList,
  };
}

export default AddTicketLogics;
