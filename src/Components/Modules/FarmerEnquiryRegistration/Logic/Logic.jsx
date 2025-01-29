import { useEffect, useState, useRef } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { dateToSpecificFormat, dateToCompanyFormat, daysdifference } from "Configration/Utilities/dateformat";
import moment from "moment";
import publicIp from "public-ip";
import { useNavigate } from "react-router-dom";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { getCropListDistrictWiseDataList } from "../../../Common/Calculator/Service/Method";
import {
  addFarmer,
  checkFarmerexists,
  getEnquiryTicketReview,
  addEnquiryTicketReview,
  addFarmerSupportTicket,
  checkFarmerUpdateInDbData,
} from "../Service/Method";
import {
  getMasterDataBindingDataList,
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
  // NehaaddSupportTicket,
} from "../../Support/ManageTicket/Views/Modals/AddTicket/Services/Methods";

function FarmerEnquiryRegistrationLogics() {
  const navigate = useNavigate();
  const [selectedValidateOption, setSelectedValidateOption] = useState("1");
  const [selectedClaimOrGrievence, setSelectedClaimOrGrievence] = useState("");
  const [claimOrGrievenceDisabled, setClaimOrGrievenceDisabled] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [isLoadingEnquiryList, setIsLoadingEnquiryList] = useState(false);
  const [addFormActive, setAddFormActive] = useState(false);
  const [selectedTabEnqGreivCropLoss, setSelectedTabEnqGreivCropLoss] = useState("1");
  const [selectedOptionCropStage, setSelectedOptionCropStage] = useState("1");
  const [chkNewOrExtingFarmer, setchkNewOrExtingFarmer] = useState("");
  const [isInsuranceCompanyNull, setIsInsuranceCompanyNull] = useState("YES");
  const toggleModal = () => {
    setOpenModal(!openModal);
  };
  const [value, setValue] = useState("");
  const [wordcount, setWordcount] = useState(0);
  // A const myRef = useRef(null);
  const [formValidationSupportTicketError, setFormValidationSupportTicketError] = useState({});
  // A const executeScroll = () => myRef.current.scrollIntoView({ behavior: "smooth" });
  const [openInsuranceCompanyModal, setOpenInsuranceCompanyModal] = useState(false);
  const toggleInsuranceCompanyModal = () => {
    setOpenInsuranceCompanyModal(!openInsuranceCompanyModal);
  };
  const [genderList, setGenderList] = useState([]);
  const [openInsuranceCompanyModalGreivence, setOpenInsuranceCompanyModalGreivence] = useState(false);
  const toggleInsuranceCompanyModalGreivence = () => {
    setOpenInsuranceCompanyModalGreivence(!openInsuranceCompanyModalGreivence);
  };
  const [selectedEnquiry, setSelectedEnquiry] = useState({});
  const [EnquiryPopup, setEnquiryPopup] = useState(false);
  const setAlertMessage = AlertMessage();

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
      // A console.log(error);
      // A setAlertMessage({
      // A  type: "error",
      // A  message: "Something went Wrong! Error Code : 442",
      // A });
    }
  };
  const [enquiryGridApi, setEnquiryGridApi] = useState();
  const onEnquiryGridReady = (params) => {
    setEnquiryGridApi(params.api);
  };

  const [searchEnquiryText, setsearchEnquiryText] = useState("");
  const onSearchEnquiry = (val) => {
    setsearchEnquiryText(val);
    enquiryGridApi.setQuickFilter(val);
    enquiryGridApi.refreshCells();
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
      // A console.log(error);
      // A setAlertMessage({
      // A  type: "error",
      // A  message: "Something went Wrong! Error Code : 442",
      // A });
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
      // A console.log(error);
      // A setAlertMessage({
      // A  type: "error",
      // A  message: "Something went Wrong! Error Code : 442",
      // A });
    }
  };

  const activityStatusFilterData = [
    { Name: "Open", Value: 109301 },
    { Name: "Resolved", Value: 109303 },
  ];
  const [searchFormValues, setSearchFormValues] = useState({
    txtEmployeeFilter: null,
    txtActivityStatusFilter: null,
  });

  const updateSearchFormState = (name, value) => {
    setSearchFormValues({ ...searchFormValues, [name]: value });
  };

  const [enquiryDataList, setEnquiryDataList] = useState([]);
  const [filterEnquiryDataList, setFilterEnquiryDataList] = useState([]);
  const getEnquiryListData = async (message) => {
    try {
      const formdata = {
        viewMode: "LIST",
        ticketRequestorID: "",
        mobilenumber: "",
        aadharNumber: "",
        accountNumber: "",
      };
      debugger;
      setIsLoadingEnquiryList(true);
      const result = await checkFarmerexists(formdata);
      console.log(result, "Enquiry list");
      setIsLoadingEnquiryList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          if (Object.keys(result.response.responseData && result.response.responseData.data.result).length === 0) {
            setEnquiryDataList([]);
            setFilterEnquiryDataList([]);
          } else {
            setEnquiryDataList(result.response.responseData.data.result);
            setFilterEnquiryDataList(result.response.responseData.data.result);
            console.log(enquiryDataList);
          }
        } else {
          setBankBranchDropdownDataList([]);
        }
      } else if (result.response.responseCode !== 1) {
        if (message) {
          setAlertMessage({
            type: "error",
            message: result.response.responseMessage,
          });
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

  const [stateDropdownDataList, setStateDropdownDataList] = useState([]);
  const [isLoadingStateDropdownDataList, setIsLoadingStateDropdownDataList] = useState(false);
  const getStateListData = async () => {
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
      console.log(result, "State Data");
      setIsLoadingStateDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setStateDropdownDataList(result.response.responseData.masterdatabinding);
        } else {
          setStateDropdownDataList([]);
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      // A console.log(error);
      // A setAlertMessage({
      // A  type: "error",
      // A  message: "Something went Wrong! Error Code : 442",
      // A });
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
      // A console.log(error);
      // A setAlertMessage({
      // A  type: "error",
      // A  message: "Something went Wrong! Error Code : 442",
      // A });
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
      // A console.log(error);
      // A setAlertMessage({
      // A  type: "error",
      // A  message: "Something went Wrong! Error Code : 442",
      // A });
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
      // A console.log(error);
      // A setAlertMessage({
      // A  type: "error",
      // A  message: "Something went Wrong! Error Code : 442",
      // A });
    }
  };

  // A const updateFarmersTickets = (data) => {
  const updateFarmersTickets = (newlyAddedFarmerEnquiry, penquiryGridApi) => {
    debugger;
    // A enquiryDataList.unshift(data);

    // A if (enquiryGridApi) {
    // A  enquiryGridApi.setRowData(filterEnquiryDataList);
    // A}
    // A console.log("filterEnquiryDataList", filterEnquiryDataList);
    // A console.log(enquiryDataList, "enquiryDataList");
    // A console.log(data, "*****updateFarmersTickets Data*****");
    if (penquiryGridApi) {
      const rowData = [];
      if (newlyAddedFarmerEnquiry && newlyAddedFarmerEnquiry.length > 0) {
        newlyAddedFarmerEnquiry.forEach((data) => {
          rowData.push(data);
        });
      }
      penquiryGridApi.forEachNode((node) => rowData.push(node.data));
      penquiryGridApi.setRowData(rowData);
    }
  };

  const [schemeList, setSchemeList] = useState([]);
  const [seasonForPolicyNumberDropdownDataList, setSeasonForPolicyNumberDropdownDataList] = useState([]);
  const [stateForPolicyNumberDropdownDataList, setStateForPolicyNumberDropdownDataList] = useState([]);
  const [yearList, setYearList] = useState({});
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
  };
  useEffect(() => {
    getEnquiryListData(false);
  }, []);
  useEffect(() => {}, [selectedEnquiry]);

  const [isLoadingStateForPolicyNumberDropdownDataList, setIsLoadingStateForPolicyNumberDropdownDataList] = useState(false);
  const getStateForPolicyNumberListData = async () => {
    try {
      setIsLoadingStateForPolicyNumberDropdownDataList(true);
      const formdata = {
        filterID: 0,
        filterID1: 0,
        masterName: "STATEMAS",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBindingDataList(formdata);
      console.log(result, "State Data");
      setIsLoadingStateForPolicyNumberDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setStateForPolicyNumberDropdownDataList(result.response.responseData.masterdatabinding);
        } else {
          setStateForPolicyNumberDropdownDataList([]);
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      // A console.log(error);
      // A setAlertMessage({
      // A  type: "error",
      // A  message: "Something went Wrong! Error Code : 442",
      // A });
    }
  };
  const [farmerIDNoDropdownDataList, setFarmerIDNoDropdownDataList] = useState(false);
  const [isLoadingFarmerIDNoDropdownDataList, setIsLoadingFarmerIDNoDropdownDataList] = useState(false);
  const getFarmerIDNoListData = async () => {
    try {
      setIsLoadingFarmerIDNoDropdownDataList(true);
      const formdata = {
        filterID: 123,
        filterID1: 0,
        masterName: "COMMVAL",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBindingDataList(formdata);
      console.log(result, "Farmer ID");
      setIsLoadingFarmerIDNoDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setFarmerIDNoDropdownDataList(result.response.responseData.masterdatabinding);
        } else {
          setFarmerIDNoDropdownDataList([]);
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      // A console.log(error);
      // A setAlertMessage({
      // A  type: "error",
      // A  message: "Something went Wrong! Error Code : 442",
      // A });
    }
  };
  const [farmerTypeDropdownDataList, setFarmerTypeDropdownDataList] = useState(false);
  const [isLoadingFarmerTypeDropdownDataList, setIsLoadingFarmerTypeDropdownDataList] = useState(false);
  const getFarmerTypeListData = async () => {
    try {
      setIsLoadingFarmerTypeDropdownDataList(true);
      const formdata = {
        filterID: 126,
        filterID1: 0,
        masterName: "COMMVAL",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBindingDataList(formdata);
      console.log(result, "Farmer Type");
      setIsLoadingFarmerTypeDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setFarmerTypeDropdownDataList(result.response.responseData.masterdatabinding);
        } else {
          setFarmerTypeDropdownDataList([]);
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      // A console.log(error);
      // A setAlertMessage({
      // A  type: "error",
      // A  message: "Something went Wrong! Error Code : 442",
      // A });
    }
  };
  const [casteTypeDropdownDataList, setCasteTypeDropdownDataList] = useState(false);
  const [isLoadingCasteTypeDropdownDataList, setIsLoadingCasteTypeDropdownDataList] = useState(false);
  const getCasteTypeListData = async () => {
    try {
      setIsLoadingCasteTypeDropdownDataList(true);
      const formdata = {
        filterID: 125,
        filterID1: 0,
        masterName: "COMMVAL",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBindingDataList(formdata);
      console.log(result, "Farmer Type");
      setIsLoadingCasteTypeDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setCasteTypeDropdownDataList(result.response.responseData.masterdatabinding);
        } else {
          setCasteTypeDropdownDataList([]);
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      // A console.log(error);
      // A setAlertMessage({
      // A  type: "error",
      // A  message: "Something went Wrong! Error Code : 442",
      // A });
    }
  };
  const [farmerCategoryDropdownDataList, setFarmerCategoryDropdownDataList] = useState(false);
  const [isLoadingFarmerCategoryDropdownDataList, setIsLoadingFarmerCategoryeDropdownDataList] = useState(false);
  const getFarmerCategoryListData = async () => {
    try {
      setIsLoadingFarmerCategoryeDropdownDataList(true);
      const formdata = {
        filterID: 128,
        filterID1: 0,
        masterName: "COMMVAL",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBindingDataList(formdata);
      console.log(result, "Farmer Type");
      setIsLoadingFarmerCategoryeDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setFarmerCategoryDropdownDataList(result.response.responseData.masterdatabinding);
        } else {
          setFarmerCategoryDropdownDataList([]);
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      // A console.log(error);
      // A setAlertMessage({
      // A  type: "error",
      // A  message: "Something went Wrong! Error Code : 442",
      // A });
    }
  };
  const [relationShipDropdownDataList, setRelationShipDropdownDataList] = useState(false);
  const [isLoadingRelationShipDropdownDataList, setIsLoadingRelationShipDropdownDataList] = useState(false);
  const getRelationShipListData = async () => {
    try {
      setIsLoadingRelationShipDropdownDataList(true);
      const formdata = {
        filterID: 127,
        filterID1: 0,
        masterName: "COMMVAL",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBindingDataList(formdata);
      console.log(result, "Farmer Type");
      setIsLoadingRelationShipDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setRelationShipDropdownDataList(result.response.responseData.masterdatabinding);
        } else {
          setRelationShipDropdownDataList([]);
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      // A console.log(error);
      // A setAlertMessage({
      // A  type: "error",
      // A  message: "Something went Wrong! Error Code : 442",
      // A });
    }
  };

  const [isLoadingSeasonForPolicyNumberDropdownDataList, setIsLoadingSeasonForPolicyNumberDropdownDataList] = useState(false);
  const getSeasonForPolicyNumberListData = async () => {
    try {
      setIsLoadingSeasonForPolicyNumberDropdownDataList(true);
      const formdata = {
        filterID: 0,
        filterID1: 0,
        masterName: "SEASON",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBindingDataList(formdata);
      console.log(result, "Season Data");
      setIsLoadingSeasonForPolicyNumberDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setSeasonForPolicyNumberDropdownDataList(result.response.responseData.masterdatabinding);
        } else {
          setSeasonForPolicyNumberDropdownDataList([]);
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      // A console.log(error);
      // A setAlertMessage({
      // A  type: "error",
      // A  message: "Something went Wrong! Error Code : 442",
      // A });
    }
  };

  const [lableTalukAnything, setlableTalukAnything] = useState("SubDistrict");
  const [lableVillageForByLocation, setlableVillageForByLocation] = useState("Village");

  const [formValuesForByLocation, setFormValuesForByLocation] = useState({
    txtFarmerMasterID: 0,
    txtFarmerFullName: "",
    txtRelationShip: "",
    txtRelationShipID: null,
    txtMobileNumber: "",
    txtCasteID: null,
    txtFarmerTypeID: null,
    txtFarmerCategoryID: null,
    txtFarmerIDNo: null,
    txtFarmerIDNoValue: "",
    txtAge: 0,
    txtGender: [
      { Name: "Male", Value: 1 },
      { Name: "Female", Value: 2 },
      { Name: "Others", Value: 3 },
    ],
    txtPinCode: "",
    txtAddress: "",
    txtBank: null,
    txtBranch: null,
    txtAadharNumber: "",
    txtAccountNumber: "",
    txtStateForByLocation: null,
    txtDistrictForByLocation: null,
    txtSubDistrictForByLocation: null,
    txtVillageForByLocation: null,
    txtSeasonForLocation: null,
    txtYearForLocation: null,
    txtSchemeForLocation: null,
    txtCropForCalculate: null,
    txtAreaInHectareForCalculator: "",
    txtTicketCategoryType: null,
    txtTicketCategory: null,
    txtCropLossDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
    txtCropLossIntimation: "On-Time",
    txtCropLossTime: "",
    txtLossAt: null,
    txtOtherSubCategory: "",
    txtCropStage: null,
    txtCropHarvestDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
    txtTicketDescription: "",
    txtCallerMobileNumber: "",
  });

  const [districtForByLocationDropdownDataList, setDistrictForByLocationDropdownDataList] = useState([]);
  const [isLoadingDistrictForByLocationDropdownDataList, setIsLoadingDistrictForByLocationDropdownDataList] = useState(false);
  const getDistrictByStateForByLocationListData = async (pstateAlphaCode) => {
    try {
      setIsLoadingDistrictForByLocationDropdownDataList(true);
      const formdata = {
        stateAlphaCode: pstateAlphaCode,
      };
      const result = await getDistrictByState(formdata);
      console.log(result, "District Data");
      setIsLoadingDistrictForByLocationDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          if (Object.keys(result.response.responseData.data).length === 0) {
            setDistrictForByLocationDropdownDataList([]);
          } else {
            setDistrictForByLocationDropdownDataList(result.response.responseData.data.hierarchy.level3);
          }
        } else {
          setDistrictForByLocationDropdownDataList([]);
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      // A console.log(error);
      // A setAlertMessage({
      // A  type: "error",
      // A  message: "Something went Wrong! Error Code : 442",
      // A });
    }
  };

  const [subDistrictForByLocationDropdownDataList, setSubDistrictForByLocationDropdownDataList] = useState([]);
  const [isLoadingSubDistrictForByLocationDropdownDataList, setIsLoadingSubDistrictForByLocationDropdownDataList] = useState(false);
  const getSubDistrictByStateANDDistrictListData = async (pstateAlphaCode, pdistrictAlphaCode) => {
    try {
      setIsLoadingSubDistrictForByLocationDropdownDataList(true);
      const formdata = {
        districtAlphaCode: pdistrictAlphaCode,
        stateAlphaCode: pstateAlphaCode,
      };
      const result = await getSubDistrictByStateANDDistrictDataList(formdata);
      console.log(result, "SubDistrict Data");
      setIsLoadingSubDistrictForByLocationDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          if (Object.keys(result.response.responseData.data).length === 0) {
            setSubDistrictForByLocationDropdownDataList([]);
          } else {
            setSubDistrictForByLocationDropdownDataList(result.response.responseData.data);
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
      // A console.log(error);
      // A setAlertMessage({
      // A  type: "error",
      // A  message: "Something went Wrong! Error Code : 442",
      // A });
    }
  };

  const [villageForByLocationDropdownDataList, setVillageForByLocationDropdownDataList] = useState([]);
  const [isLoadingVillageForByLocationDropdownDataList, setIsLoadingVillageForByLocationDropdownDataList] = useState(false);
  const getVillageListBYSubDistrictAndDistrictListData = async (pdistrictAlphaCode, psubDistrictAlphaCode) => {
    try {
      setIsLoadingVillageForByLocationDropdownDataList(true);
      const formdata = {
        districtAlphaCode: pdistrictAlphaCode,
        subDistrictAlphaCode: psubDistrictAlphaCode,
      };
      const result = await getVillageListBYSubDistrictAndDistrictDataList(formdata);
      console.log(result, "Village Data");
      setIsLoadingVillageForByLocationDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          if (Object.keys(result.response.responseData.data).length === 0) {
            setVillageForByLocationDropdownDataList([]);
          } else {
            const mappedData = result.response.responseData.data.map((value) => {
              return {
                label: `${value.level7Name} - ${value.level6Name} - ${value.level5Name}`,
                value: value.level7ID,
              };
            });

            setVillageForByLocationDropdownDataList(mappedData);
          }
        } else {
          setVillageForByLocationDropdownDataList([]);
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      // A console.log(error);
      // A setAlertMessage({
      // A  type: "error",
      // A  message: "Something went Wrong! Error Code : 442",
      // A });
    }
  };

  const [isLoadingSchemeListDropdownDataList, setIsLoadingSchemeListDropdownDataList] = useState(false);
  const getSchemeListData = async () => {
    try {
      setIsLoadingSchemeListDropdownDataList(true);
      const formdata = {
        filterID: 0,
        filterID1: 0,
        masterName: "SCHEME",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBindingDataList(formdata);
      console.log(result, "Scheme Data");
      setIsLoadingSchemeListDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setSchemeList(result.response.responseData.masterdatabinding);
        } else {
          setSchemeList([]);
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      // A console.log(error);
      // A setAlertMessage({
      // A  type: "error",
      // A  message: "Something went Wrong! Error Code : 442",
      // A });
    }
  };

  const validateFarmersField = (name, value) => {
    let errorsMsg = "";
    const regex = new RegExp("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$");

    if (selectedValidateOption === "1") {
      if (name === "txtValMobileNumber") {
        if (!value || typeof value === "undefined") {
          errorsMsg = "Mobile Number is required!";
        } else if (value) {
          if (!regex.test(value)) {
            errorsMsg = "Mobile Number is not valid!";
          } else if (Number(value.toString().substr(0, 1)) < 5) {
            errorsMsg = "Enter Valid  Mobile Number!";
          } else if (value.length < 10) {
            errorsMsg = "Enter Valid 10 digit Mobile Number!";
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
          errorsMsg = "Sub District is required!";
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
    }

    return errorsMsg;
  };

  const [cropForCalculatorDropdownDataList, setCropForCalculatorDropdownDataList] = useState([]);
  const [isLoadingCropForCalculatorDropdownDataList, setIsLoadingCropForCalculatorDropdownDataList] = useState(false);
  const getCropDataByDistrictData = async (pDistrictID) => {
    try {
      let result = "";
      let formData = "";

      const user = getSessionStorage("user");

      const pschemeID =
        formValuesForByLocation.txtSchemeForLocation && formValuesForByLocation.txtSchemeForLocation.SchemeID === 2
          ? "02"
          : formValuesForByLocation.txtSchemeForLocation.SchemeID === 4
          ? "04"
          : "";
      const pseasonID =
        formValuesForByLocation.txtSeasonForLocation && formValuesForByLocation.txtSeasonForLocation.CropSeasonID === 1
          ? "01"
          : formValuesForByLocation.txtSeasonForLocation.CropSeasonID === 2
          ? "02"
          : "";
      const pstateID =
        formValuesForByLocation.txtStateForByLocation && formValuesForByLocation.txtStateForByLocation.StateMasterID.toString().length < 2
          ? `0${formValuesForByLocation.txtStateForByLocation.StateMasterID}`
          : formValuesForByLocation.txtStateForByLocation.StateMasterID;
      const pyearID =
        formValuesForByLocation.txtYearForLocation &&
        formValuesForByLocation.txtYearForLocation.Value.toString().substr(formValuesForByLocation.txtYearForLocation.Value.length - 2);
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
      // A console.log(error);
      // A setAlertMessage({
      // A  type: "error",
      // A  message: "Something went Wrong! Error Code : 442",
      // A });
    }
  };
  const validateFieldSupportTicket = (name, value) => {
    let errorsMsg = "";

    const regex = new RegExp("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$");
    // A if (name === "txtPinCode") {
    // A  if (!value || typeof value === "undefined") {
    // A    errorsMsg = "Required.....!";
    // A  }
    // A }
    if (name === "txtMobileNumber") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Mobile Number is required!";
      } else if (value) {
        debugger;
        if (!regex.test(value)) {
          errorsMsg = "Mobile Number is not valid!";
        } else if (value.length < 10) {
          errorsMsg = "Enter Valid 10 digit Mobile Number!";
        }
      }
    }
    if (name === "txtCallerMobileNumber") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Caller Mobile Number is required!";
      } else if (value) {
        if (value.length < 10) {
          errorsMsg = "Enter Valid 10 digit Caller Mobile Number!";
        }
      }
    }
    // A if (name === "txtCasteID") {
    // A  if (!value || typeof value === "undefined") {
    // A    errorsMsg = "Caste is required!";
    // A  }
    // A }

    // A if (name === "txtFarmerTypeID") {
    // A  if (!value || typeof value === "undefined") {
    // A    errorsMsg = "Farmer Type is required!";
    // A  }
    // A }

    // A if (name === "txtFarmerCategoryID") {
    // A  if (!value || typeof value === "undefined") {
    // A    errorsMsg = "Farmer Category is required!";
    // A  }
    // A }

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
        errorsMsg = "Sub District is required!";
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

    if (name === "txtFarmerFullName") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Required.....!";
      } else if (value) {
        if (value.length > 30) {
          errorsMsg = "Farmer Full Name can not exceed more than 30 characters!";
        }
      }
    }
    // A if (name === "txtRelationShipID") {
    // A  if (!value || typeof value === "undefined") {
    // A    errorsMsg = "Required.....!";
    // A  }
    // A }

    // A if (name === "txtRelationShip") {
    // A  if (!value || typeof value === "undefined") {
    // A    errorsMsg = "Required.....!";
    // A  } else if (value) {
    // A    if (value.length > 20) {
    // A      errorsMsg = "Ticket Description can not exceed more than 30 characters!";
    // A    }
    // A  }
    // A }
    if (name === "txtTicketDescription") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Required.....!";
      } else if (value) {
        if (value.length > 500) {
          errorsMsg = "Ticket Description can not exceed more than 500 characters!";
        }
      }
    }

    if (name === "txtCropForCalculator") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Crop is required!";
      }
    }

    if (name === "txtGender") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Gender is required!";
      }
    }

    // A if (name === "txtAge") {
    // A  if (!value || typeof value === "undefined") {
    // A    errorsMsg = "Age is required!";
    // A  } else if (value) {
    // A    const regex = new RegExp("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$");
    // A    if (!regex.test(value)) {
    // A      errorsMsg = "Age should be numeric!";
    // A    }
    // A  }
    // A }
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
    if (name === "txtTicketCategoryType") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Please select Ticket Category!";
      }
    }
    if (name === "txtTicketCategory") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Please select Ticket Sub Category!";
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
    return errorsMsg;
  };

  const [ticketCategoryTypeList, setTicketCategoryTypeList] = useState([]);
  const [isLoadingTicketCategoryTypeList, setIsTicketCategoryTypeList] = useState(false);
  const getTicketCategoryTypeListData = async (pselectedOption, pCropLossDetailID, pMasterName) => {
    try {
      setIsTicketCategoryTypeList(true);
      const formdata = {
        filterID: pselectedOption,
        filterID1: pCropLossDetailID,
        masterName: pMasterName, // A "TCKTYP",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBindingDataList(formdata);
      console.log(result, "ticktCategoryType");
      setIsTicketCategoryTypeList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setTicketCategoryTypeList(result.response.responseData.masterdatabinding);
        } else {
          setTicketCategoryTypeList([]);
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

  const [ticketCategoryList, setTicketCategoryList] = useState([]);
  const [isLoadingTicketCategoryList, setIsTicketCategoryList] = useState(false);
  const getTicketCategoryListData = async (supportTicketTypeID, data) => {
    console.log(data);
    try {
      setTicketCategoryList([]);
      setIsTicketCategoryList(true);
      const formdata = {
        filterID: supportTicketTypeID,
        filterID1: 0,
        masterName: "TCKCGZ",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBindingDataList(formdata);
      console.log(result, "ticketCategory");
      setIsTicketCategoryList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setTicketCategoryList(result.response.responseData.masterdatabinding);
        } else {
          setTicketCategoryList([]);
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
  const [stateCropLossIntimation, setStateCropLossIntimation] = useState("NA");
  const updateStateForByLocation = (name, value) => {
    console.log("name ,", name, "value", value);
    debugger;
    if (name === "txtStateForByLocation") {
      setFormValuesForByLocation({
        ...formValuesForByLocation,
        txtStateForByLocation: value,
        txtDistrictForByLocation: null,
        txtSubDistrictForByLocation: null,
        txtVillageForByLocation: null,
      });
      setDistrictForByLocationDropdownDataList([]);
      setCropForCalculatorDropdownDataList([]);
      setSubDistrictForByLocationDropdownDataList([]);
      setVillageForByLocationDropdownDataList([]);
      setlableTalukAnything("SubDistrict");
      setlableVillageForByLocation("Village");
      if (value) {
        setlableTalukAnything(value.Level4Name ? value.Level4Name : "SubDistrict");
        setlableVillageForByLocation(`
        Village${value.Level6Name ? ` -  ${value.Level6Name}` : ""}${value.Level5Name ? ` -  ${value.Level5Name}` : ""}
        `);

        getDistrictByStateForByLocationListData(value.StateCodeAlpha);
        setCropForCalculatorDropdownDataList([]);
      }
    } else if (name === "txtDistrictForByLocation") {
      setFormValuesForByLocation({
        ...formValuesForByLocation,
        txtDistrictForByLocation: value,
        txtSubDistrictForByLocation: null,
        txtVillageForByLocation: null,
      });
      setSubDistrictForByLocationDropdownDataList([]);
      setVillageForByLocationDropdownDataList([]);
      setCropForCalculatorDropdownDataList([]);
      if (value) {
        getSubDistrictByStateANDDistrictListData(formValuesForByLocation.txtStateForByLocation.StateCodeAlpha, value.level3ID);
      }
    } else if (name === "txtSubDistrictForByLocation") {
      setFormValuesForByLocation({
        ...formValuesForByLocation,
        txtSubDistrictForByLocation: value,
        txtVillageForByLocation: null,
      });
      setVillageForByLocationDropdownDataList([]);
      if (value) {
        getVillageListBYSubDistrictAndDistrictListData(formValuesForByLocation.txtDistrictForByLocation.level3ID, value.level4ID);
      }
    } else if (name === "txtTicketCategoryType") {
      setFormValuesForByLocation({
        ...formValuesForByLocation,
        txtTicketCategoryType: value,
        txtTicketCategory: null,
      });
      setTicketCategoryList([]);
      if (value) {
        getTicketCategoryListData(value.SupportTicketTypeID, value);
      }
    } else if (name === "txtLossAt") {
      setFormValuesForByLocation({
        ...formValuesForByLocation,
        txtLossAt: value,
        txtTicketCategoryType: null,
        txtTicketCategory: null,
      });
      setTicketCategoryTypeList([]);
      setTicketCategoryList([]);
      if (value) {
        getTicketCategoryTypeListData("4", value.CropLossDetailID, "CRPTYP");
      }
    } else if (name === "txtCropLossDate") {
      const currentDate = new Date();
      const dateDiffrence = daysdifference(dateToSpecificFormat(currentDate, "YYYY-MM-DD"), dateToSpecificFormat(value, "YYYY-MM-DD"));
      if (dateDiffrence > 3) {
        setFormValuesForByLocation({
          ...formValuesForByLocation,
          txtCropLossDate: value,
          txtCropLossIntimation: "Late",
        });
        setStateCropLossIntimation("NO");
      } else {
        setFormValuesForByLocation({
          ...formValuesForByLocation,
          txtCropLossDate: value,
          txtCropLossIntimation: "On-time",
        });
        setStateCropLossIntimation("YES");
      }
    } else if (name === "txtSeasonForLocation" || name === "txtDistrictForByLocation" || name === "txtYearForLocation" || name === "txtSchemeForLocation") {
      if (
        value &&
        formValuesForByLocation.txtSeasonForLocation !== null &&
        formValuesForByLocation.txtYearForLocation !== null &&
        formValuesForByLocation.txtSchemeForLocation !== null &&
        formValuesForByLocation.txtDistrictForByLocation !== null
      ) {
        getCropDataByDistrictData(formValuesForByLocation.txtDistrictForByLocation.level3ID);
      } else {
        setCropForCalculatorDropdownDataList([]);
        setFormValuesForByLocation({
          ...formValuesForByLocation,
          [name]: value,
        });
      }
    } else {
      setFormValuesForByLocation({
        ...formValuesForByLocation,
        [name]: value,
      });
    }

    formValidationSupportTicketError[name] = validateFieldSupportTicket(name, value);
  };
  const getCalculatorDataOnClick = (value) => {
    debugger;
    if (value || typeof value !== "undefined") {
      if (formValuesForByLocation.txtCropForCalculate && formValuesForByLocation.txtCropForCalculate.sumInsured) {
        const calculatedSumInsured =
          parseFloat(formValuesForByLocation.txtAreaInHectareForCalculator) * parseFloat(formValuesForByLocation.txtCropForCalculate.sumInsured);
        const actualRate =
          parseFloat(formValuesForByLocation.txtCropForCalculate.goiShare) + parseFloat(formValuesForByLocation.txtCropForCalculate.stateShare);
        const acturialRate =
          parseFloat(formValuesForByLocation.txtCropForCalculate.farmerShare) +
          parseFloat(formValuesForByLocation.txtCropForCalculate.goiShare) +
          parseFloat(formValuesForByLocation.txtCropForCalculate.stateShare);
        const preminumpaidbyfarmer = (parseFloat(calculatedSumInsured) * parseFloat(formValuesForByLocation.txtCropForCalculate.farmerShare)) / 100;
        const preminumpaidbygovt = (parseFloat(calculatedSumInsured) * parseFloat(actualRate)) / 100;
        setFormValuesForByLocation({
          ...formValuesForByLocation,
          CalculatedSumInsured: calculatedSumInsured,
        });
        console.log({
          CalculatedSumInsured: calculatedSumInsured,
          ActurialRate: acturialRate,
          Preminumpaidbyfarmer: preminumpaidbyfarmer,
          Preminumpaidbygovt: preminumpaidbygovt,
          AreaInhectare: formValuesForByLocation.txtAreaInHectareForCalculator,
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

  const [stateForByLocationDropdownDataList, setStateForByLocationDropdownDataList] = useState([]);
  const [isLoadingStateForByLocationDropdownDataList, setIsLoadingStateForByLocationDropdownDataList] = useState(false);
  const getStateForByLocationListData = async () => {
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
      // A console.log(error);
      // A setAlertMessage({
      // A  type: "error",
      // A  message: "Something went Wrong! Error Code : 442",
      // A });
    }
  };

  const [lossAtList, setLossAtList] = useState([]);
  const [isLoadingLossAtList, setIsLoadingLossAtList] = useState(false);
  const getLossAtListData = async (pCropStageID) => {
    try {
      setIsLoadingLossAtList(true);
      const formdata = {
        filterID: pCropStageID,
        filterID1: 0,
        masterName: "CRPDTL",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBindingDataList(formdata);
      setIsLoadingLossAtList(false);
      setLossAtList([]);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setLossAtList(result.response.responseData.masterdatabinding);
        } else {
          setLossAtList([]);
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

  const [cropStageList, setCropStageList] = useState([]);
  const [isLoadingCropStageList, setIsLoadingCropStageList] = useState(false);
  const getCropStageListData = async (pCropStageID) => {
    try {
      setIsLoadingCropStageList(true);
      const formdata = {
        filterID: pCropStageID,
        filterID1: 0,
        masterName: "CRPSTG",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBindingDataList(formdata);
      setIsLoadingCropStageList(false);
      setCropStageList([]);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setCropStageList(result.response.responseData.masterdatabinding);
        } else {
          setCropStageList([]);
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
    try {
      const errors = {};
      let formIsValid = true;

      errors["txtFarmerFullName"] = validateFieldSupportTicket("txtFarmerFullName", formValuesForByLocation.txtFarmerFullName);
      // A errors["txtRelationShip"] = validateFieldSupportTicket("txtRelationShip", formValuesForByLocation.txtRelationShip);
      // A errors["txtRelationShipID"] = validateFieldSupportTicket("txtRelationShipID", formValuesForByLocation.txtRelationShipID);
      errors["txtMobileNumber"] = validateFieldSupportTicket("txtMobileNumber", formValuesForByLocation.txtMobileNumber);
      // A errors["txtCasteID"] = validateFieldSupportTicket("txtCasteID", formValuesForByLocation.txtCasteID);
      // A errors["txtFarmerTypeID"] = validateFieldSupportTicket("txtFarmerTypeID", formValuesForByLocation.txtFarmerTypeID);
      // A errors["txtFarmerCategoryID"] = validateFieldSupportTicket("txtFarmerCategoryID", formValuesForByLocation.txtFarmerCategoryID);
      // A errors["txtAge"] = validateFieldSupportTicket("txtAge", formValuesForByLocation.txtAge);
      errors["txtGender"] = validateFieldSupportTicket("txtGender", formValuesForByLocation.txtGender);
      // A errors["txtPinCode"] = validateFieldSupportTicket("txtPinCode", formValuesForByLocation.txtPinCode);
      errors["txtStateForByLocation"] = validateFieldSupportTicket("txtStateForByLocation", formValuesForByLocation.txtStateForByLocation);
      errors["txtDistrictForByLocation"] = validateFieldSupportTicket("txtDistrictForByLocation", formValuesForByLocation.txtDistrictForByLocation);
      errors["txtSubDistrictForByLocation"] = validateFieldSupportTicket("txtSubDistrictForByLocation", formValuesForByLocation.txtSubDistrictForByLocation);
      errors["txtVillageForByLocation"] = validateFieldSupportTicket("txtVillageForByLocation", formValuesForByLocation.txtVillageForByLocation);
      errors["txtSeasonForLocation"] = validateFieldSupportTicket("txtSeasonForLocation", formValuesForByLocation.txtSeasonForLocation);
      errors["txtYearForLocation"] = validateFieldSupportTicket("txtYearForLocation", formValuesForByLocation.txtYearForLocation);
      errors["txtSchemeForLocation"] = validateFieldSupportTicket("txtSchemeForLocation", formValuesForByLocation.txtSchemeForLocation);
      errors["txtTicketDescription"] = validateFieldSupportTicket("txtTicketDescription", formValuesForByLocation.txtTicketDescription);
      errors["txtCropForCalculate"] = validateFieldSupportTicket("txtCropForCalculate", formValuesForByLocation.txtCropForCalculate);
      errors["txtAreaInHectareForCalculator"] = validateFieldSupportTicket(
        "txtAreaInHectareForCalculator",
        formValuesForByLocation.txtAreaInHectareForCalculator,
      );
      if (selectedTabEnqGreivCropLoss === "3") {
        errors["txtCropLossDate"] = validateFieldSupportTicket("txtCropLossDate", formValuesForByLocation.txtCropLossDate);
        // A errors["txtCropLossTime"] = validateFieldSupportTicket("txtCropLossTime", formValuesForByLocation.txtCropLossTime);
        errors["txtLossAt"] = validateFieldSupportTicket("txtLossAt", formValuesForByLocation.txtLossAt);
        errors["txtCropStage"] = validateFieldSupportTicket("txtCropStage", formValuesForByLocation.txtCropStage);
        if (selectedOptionCropStage === "2") {
          errors["txtCropHarvestDate"] = validateFieldSupportTicket("txtCropHarvestDate", formValuesForByLocation.txtCropHarvestDate);
        }

        if (
          (formValuesForByLocation.txtTicketCategory && formValuesForByLocation.txtTicketCategory.TicketCategoryID
            ? formValuesForByLocation.txtTicketCategory.TicketCategoryID === 51
            : 0) ||
          (formValuesForByLocation.txtTicketCategory && formValuesForByLocation.txtTicketCategory.TicketCategoryID
            ? formValuesForByLocation.txtTicketCategory.TicketCategoryID === 52
            : 0) ||
          (formValuesForByLocation.txtTicketCategory && formValuesForByLocation.txtTicketCategory.TicketCategoryID
            ? formValuesForByLocation.txtTicketCategory.TicketCategoryID === 53
            : 0) ||
          (formValuesForByLocation.txtTicketCategory && formValuesForByLocation.txtTicketCategory.TicketCategoryID
            ? formValuesForByLocation.txtTicketCategory.TicketCategoryID === 58
            : 0)
        ) {
          errors["txtOtherSubCategory"] = validateFieldSupportTicket("txtOtherSubCategory", formValuesForByLocation.txtOtherSubCategory);
        }
      }
      errors["txtCallerMobileNumber"] = validateFieldSupportTicket("txtCallerMobileNumber", formValuesForByLocation.txtCallerMobileNumber);
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

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearArray = [];
    for (let i = 2022; i <= currentYear; i += 1) {
      yearArray.push({ Name: i.toString(), Value: i.toString() });
    }
    setGenderList([
      { Name: "Male", Value: 1 },
      { Name: "Female", Value: 2 },
      { Name: "Others", Value: 3 },
    ]);
    setYearList(yearArray.sort().reverse());
    getSeasonForPolicyNumberListData();
    getSchemeListData();
    getStateListData();
    getStateForPolicyNumberListData();
    getStateForByLocationListData();
    getFarmerIDNoListData();
    getFarmerTypeListData();
    getCasteTypeListData();
    getFarmerCategoryListData();
    getRelationShipListData();
    // A getTicketCategoryTypeListData("1");
    setFormValuesForByLocation({
      ...formValuesForByLocation,
      // A txtYearForLocation: yearArray[0],
      txtGender: { Name: "Male", Value: 1 },
    });
  }, []);
  useEffect(() => {
    if (
      formValuesForByLocation.txtSeasonForLocation &&
      formValuesForByLocation.txtYearForLocation &&
      formValuesForByLocation.txtSchemeForLocation &&
      formValuesForByLocation.txtDistrictForByLocation
    ) {
      getCropDataByDistrictData(formValuesForByLocation.txtDistrictForByLocation.level3ID);
    } else {
      setCropForCalculatorDropdownDataList([]);
    }
  }, [formValuesForByLocation]);
  const [selectedFarmer, setSelectedFarmer] = useState([]);
  const [formValuesMN, setFormValuesMN] = useState({
    txtValMobileNumber: null,
  });

  const updateStateMN = (name, value) => {
    setFormValuesMN({ ...formValuesMN, [name]: value });
    formValidationFarmersError[name] = validateFarmersField(name, value);
    setAddFormActive(false);
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
  const [formValuesForFarmerInfo, setFormValuesForFarmerInfo] = useState({
    txtSeasonForFarmerInfo: null,
    txtYearForFarmerInfo: null,
    txtSchemeForFarmerInfo: null,
  });

  const clearFarmerAuthenticationForm = () => {
    setFormValuesMN({
      ...formValuesMN,
      txtValMobileNumber: "",
    });
    setAddFormActive(false);
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
      txtFarmerMasterID: 0,
      txtFarmerFullName: "",
      txtRelationShip: "",
      txtRelationShipID: null,
      txtMobileNumber: "",
      txtCasteID: null,
      txtFarmerTypeID: null,
      txtFarmerCategoryID: null,
      txtFarmerIDNo: null,
      txtFarmerIDNoValue: "",
      txtAge: 0,
      txtGender: [
        { Name: "Male", Value: 1 },
        { Name: "Female", Value: 2 },
        { Name: "Others", Value: 3 },
      ],
      txtPinCode: "",
      txtAddress: "",
      txtBank: null,
      txtBranch: null,
      txtAadharNumber: "",
      txtAccountNumber: "",
      txtStateForByLocation: null,
      txtDistrictForByLocation: null,
      txtSubDistrictForByLocation: null,
      txtVillageForByLocation: null,
      txtSeasonForLocation: null,
      txtYearForLocation: null,
      txtSchemeForLocation: null,
      txtCropForCalculate: null,
      txtAreaInHectareForCalculator: "",
      txtTicketCategoryType: null,
      txtTicketCategory: null,
      txtCropLossDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
      txtCropLossIntimation: "On-Time",
      txtCropLossTime: "",
      txtLossAt: null,
      txtOtherSubCategory: "",
      txtCropStage: null,
      txtCropHarvestDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
      txtTicketDescription: "",
      txtCallerMobileNumber: "",
    });
    setFormValuesForFarmerInfo({
      ...formValuesForFarmerInfo,
      txtSeasonForFarmerInfo: null,
      txtYearForFarmerInfo: null,
      txtSchemeForFarmerInfo: null,
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
    getTicketCategoryTypeListData("1", 0, "TCKTYP");
    setSelectedInsuranceDetails([]);
    setSelectedClaimOrGrievence("");
    setClaimOrGrievenceDisabled(false);
    setLossAtList([]);
    setCropStageList([]);
    setchkNewOrExtingFarmer("");
    setStateCropLossIntimation("NA");
  };

  const OnClickSelectedValidateOption = (selectedOption) => {
    clearFarmerAuthenticationForm();
    if (selectedOption === "MN") {
      setSelectedValidateOption("1");
    } else if (selectedOption === "AN") {
      setSelectedValidateOption("2");
    } else if (selectedOption === "BAN") {
      setSelectedValidateOption("3");
    } else if (selectedOption === "BL") {
      setSelectedValidateOption("4");
    }
  };
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

  const handleFarmersValidation = () => {
    try {
      const errors = {};
      let formIsValid = true;

      errors["txtValMobileNumber"] = validateFarmersField("txtValMobileNumber", formValuesMN.txtValMobileNumber);
      errors["txtAadharNumber"] = validateFarmersField("txtAadharNumber", formValuesAN.txtAadharNumber);
      errors["txtAccountNumber"] = validateFarmersField("txtAccountNumber", formValues.txtAccountNumber);
      errors["txtState"] = validateFarmersField("txtState", formValues.txtState);
      errors["txtDistrict"] = validateFarmersField("txtDistrict", formValues.txtDistrict);
      errors["txtBankName"] = validateFarmersField("txtBankName", formValues.txtBankName);
      errors["txtBranchName"] = validateFarmersField("txtBranchName", formValues.txtBranchName);
      errors["txtStateForByLocation"] = validateFarmersField("txtStateForByLocation", formValuesForByLocation.txtStateForByLocation);
      errors["txtDistrictForByLocation"] = validateFarmersField("txtDistrictForByLocation", formValuesForByLocation.txtDistrictForByLocation);
      errors["txtSubDistrictForByLocation"] = validateFarmersField("txtSubDistrictForByLocation", formValuesForByLocation.txtSubDistrictForByLocation);
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

  const [getFarmerTicketRequestorID, setGetFarmerTicketRequestorID] = useState("");
  const [btnLoaderActive, setBtnLoaderActive] = useState(false);
  const validateFarmerByMobileNumber = async () => {
    if (!handleFarmersValidation()) {
      return;
    }
    try {
      let result = "";

      let formData = "";

      formData = {
        mobilenumber: formValuesMN.txtValMobileNumber,
      };
      setBtnLoaderActive(true);
      result = await checkFarmerByMobileNumber(formData);
      setBtnLoaderActive(false);
      console.log(result, "result");
      setStateCropLossIntimation("NA");
      debugger;
      if (result.response.responseCode.toString() === "0") {
        const formdata1 = {
          viewMode: "MOBILE",
          ticketRequestorID: "",
          mobilenumber: formValuesMN.txtValMobileNumber,
          aadharNumber: "",
          accountNumber: "",
        };
        debugger;
        const result1 = await checkFarmerexists(formdata1);

        if (result1.response && result1.response.responseCode.toString() === "0") {
          setAddFormActive(true);
          setchkNewOrExtingFarmer("NW");
          setIsInsuranceCompanyNull("YES");
          setSelectedTabEnqGreivCropLoss("1");
          setFormValuesForByLocation({
            ...formValuesForByLocation,
            txtMobileNumber: formValuesMN.txtValMobileNumber,
            txtCallerMobileNumber: formValuesMN.txtValMobileNumber,
          });
        } else {
          // A setAddFormActive(false);
          // A setAlertMessage({
          // A  type: "warning",
          // A  message: result1.response.responseMessage,
          // A });
          setAddFormActive(true);
          setSelectedOptionCropStage("1");
          setTicketCategoryList([]);
          if (result1.response.responseData.data.result.length > 0) {
            setGetFarmerTicketRequestorID(result1.response.responseData.data.result[0].farmerID);
            setFormValuesForByLocation({
              ...formValuesForByLocation,
              txtCallerMobileNumber: formValuesMN.txtValMobileNumber,
              txtMobileNumber: result1.response.responseData.data.result[0].mobile,
              txtFarmerFullName: result1.response.responseData.data.result[0].farmerName,
              txtGender:
                result1.response.responseData && result1.response.responseData.data.result[0].GenderID
                  ? {
                      value: result1.response.responseData.data.result[0].GenderID,
                      Name: result1.response.responseData.data.result[0].gender,
                    }
                  : null,
              txtStateForByLocation:
                result1.response.responseData && result1.response.responseData.data.result[0].StateCodeAlpha
                  ? {
                      StateMasterID: result1.response.responseData.data.result[0].StateMasterID,
                      StateCodeAlpha: result1.response.responseData.data.result[0].StateCodeAlpha,
                      StateMasterName: result1.response.responseData.data.result[0].StateMasterName,
                    }
                  : null,
              txtDistrictForByLocation:
                result1.response.responseData && result1.response.responseData.data.result[0].districtID
                  ? {
                      level3ID: result1.response.responseData.data.result[0].districtID,
                      level3Name: result1.response.responseData.data.result[0].district,
                    }
                  : null,
              txtSubDistrictForByLocation:
                result1.response.responseData && result1.response.responseData.data.result[0].subDistrictID
                  ? {
                      level4ID: result1.response.responseData.data.result[0].subDistrictID,
                      level4Name: result1.response.responseData.data.result[0].subDistrict,
                    }
                  : null,
              txtVillageForByLocation:
                result1.response.responseData && result1.response.responseData.data.result[0].villageID
                  ? {
                      value: result1.response.responseData.data.result[0].villageID,
                      label: result1.response.responseData.data.result[0].village,
                    }
                  : null,
              txtPinCode: result1.response.responseData.data.result[0].resPincode,
              txtAddress: result1.response.responseData.data.result[0].Address,
              txtYearForLocation:
                result1.response.responseData && result1.response.responseData.data.result[0].Years
                  ? {
                      Value: result1.response.responseData.data.result[0].Years,
                      Name: result1.response.responseData.data.result[0].Years,
                    }
                  : null,
              txtSeasonForLocation:
                result1.response.responseData && result1.response.responseData.data.result[0].CropSeasonID
                  ? {
                      CropSeasonID: result1.response.responseData.data.result[0].CropSeasonID,
                      CropSeasonName: result1.response.responseData.data.result[0].CropSeasonName,
                    }
                  : null,
              txtSchemeForLocation:
                result1.response.responseData && result1.response.responseData.data.result[0].SchemeID
                  ? {
                      SchemeID: result1.response.responseData.data.result[0].SchemeID,
                      SchemeName: result1.response.responseData.data.result[0].SchemeName,
                    }
                  : null,
              txtCropForCalculate:
                result1.response.responseData && result1.response.responseData.data.result[0].SelectedCropID
                  ? {
                      cropID: result1.response.responseData.data.result[0].SelectedCropID,
                      cropName: result1.response.responseData.data.result[0].CropName,
                      insuranceCompanyCode: result1.response.responseData.data.result[0].InsuranceCompanyID,
                      insuranceCompanyName: result1.response.responseData.data.result[0].InsuranceMasterName,
                    }
                  : null,
              txtAreaInHectareForCalculator: result1.response.responseData.data.result[0].Area,
              CalculatedSumInsured: result1.response.responseData.data.result[0].CalculatedPremium,
              txtTicketCategoryType: null,
              txtTicketCategory: null,
              txtCropLossDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
              txtCropLossIntimation: "On-Time",
              txtCropLossTime: "",
              txtLossAt: null,
              txtOtherSubCategory: "",
              txtCropStage: null,
              txtCropHarvestDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
              txtTicketDescription:
                result1.response.responseData.data.result[0].InsuranceCompanyID === null ? result1.response.responseData.data.result[0].Description : null,
            });
            setSelectedEnquiry(result1.response.responseData.data.result[0]);
            setchkNewOrExtingFarmer("OD");
            if (
              result1.response.responseData.data.result[0].InsuranceCompanyID === null &&
              result1.response.responseData.data.result[0].InsuranceMasterName === null
            ) {
              setIsInsuranceCompanyNull("YES");
              setSelectedTabEnqGreivCropLoss("1");
              getCropDataByDistrictData(result1.response.responseData.data.result[0].districtID);
            } else {
              setIsInsuranceCompanyNull("NO");
              setSelectedTabEnqGreivCropLoss("2");
              getTicketCategoryTypeListData("1", 0, "TCKTYP");
            }
          }
        }
      } else if (result.response.responseCode.toString() === "1") {
        setAddFormActive(false);
        setAlertMessage({
          type: "warning",
          message: "Farmer Already Exists",
        });
      } else if (result.response.responseCode.toString() === "2") {
        setAddFormActive(false);
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

      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          if (Object.keys(result.response.responseData.data).length === 0) {
            if (aadharNoSelect.current) {
              aadharNoSelect.current.focus();
            }
            setAlertMessage({
              type: "warning",
              message: "Farmer Not Registered, Please change Aadhar Number",
            });
          }
        }
      } else {
        setAlertMessage({
          type: "warning",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      // A console.log(error);
      // A setAlertMessage({
      // A  type: "error",
      // A  message: "Something went Wrong! Error Code : 442",
      // A });
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

      if (result.response.responseCode === 1) {
        if (Object.keys(result.response.responseData.data).length === 0) {
          setAlertMessage({
            type: "warning",
            message: "Farmer Not Registered, Please change Account Number",
          });
        }
      } else {
        setAlertMessage({
          type: "warning",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      // A console.log(error);
      // A setAlertMessage({
      // A  type: "error",
      // A  message: "Something went Wrong! Error Code : 442",
      // A });
    }
  };

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
        districtAlphaCode: formValuesForByLocation.txtDistrictForByLocation ? formValuesForByLocation.txtDistrictForByLocation.level3ID.toString() : "",
        villageAlphaCode: formValuesForByLocation.txtVillageForByLocation ? formValuesForByLocation.txtVillageForByLocation.value.toString() : "",
        seasonCode: formValuesForByLocation.txtSeasonForLocation ? formValuesForByLocation.txtSeasonForLocation.CropSeasonID.toString() : "",
        yearCode: formValuesForByLocation.txtYearForLocation ? formValuesForByLocation.txtYearForLocation.Value.toString() : "",
      };
      result = await checkFarmerByPolicy(formData);
      setBtnLoaderActive(false);
      console.log(result, "result");
      setFarmersData([]);
      if (result.response.responseCode === 1) {
        const farmersData = Object.values(result.response.responseData.data);
        console.log(Object.values(result.response.responseData.data));
        console.log("data");
        if (farmersData && farmersData.length > 0) {
          setFarmersData(farmersData);
          toggleModal();
        } else {
          setFarmersData([]);
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
      // A console.log(error);
      // A setAlertMessage({
      // A  type: "error",
      // A  message: "Something went Wrong! Error Code : 442",
      // A });
    }
  };

  const onChangeFarmersDetails = (val) => {
    gridApi.setQuickFilter(val);
  };

  const onCellDoubleClicked = () => {
    setFormValuesForFarmerInfo({
      ...formValuesForFarmerInfo,
      txtSeasonForFarmerInfo: {
        CropSeasonID: formValuesForByLocation.txtSeasonForLocation.CropSeasonID,
        CropSeasonName: formValuesForByLocation.txtSeasonForLocation.CropSeasonName,
      },
      txtYearForFarmerInfo: { Value: formValuesForByLocation.txtYearForLocation.Value, Name: formValuesForByLocation.txtYearForLocation.Name },
    });
    toggleModal();
  };

  const onCellDoubleClickedDetails = (event) => {
    setClaimOrGrievenceDisabled(false);
    setSelectedClaimOrGrievence("CI");
    setSelectedInsuranceDetails(event.data);
    setTicketCategoryList([]);
    getTicketCategoryTypeListData("2", 0, "TCKTYP");
    toggleInsuranceCompanyModal();
  };

  const onCellDoubleClickedDetailsGreivence = (event) => {
    setSelectedClaimOrGrievence("GR");
    setClaimOrGrievenceDisabled(true);
    setSelectedInsuranceDetails(event.data);
    setTicketCategoryList([]);
    getTicketCategoryTypeListData("1", 0, "TCKTYP");
    toggleInsuranceCompanyModalGreivence();
  };

  const updateStateForFarmerInfo = (name, value) => {
    setFormValuesForFarmerInfo({ ...formValuesForFarmerInfo, [name]: value });
    formValidationFarmersInfoError[name] = validateFarmersInfoField(name, value);
  };

  const clearInsuranceFields = () => {
    setSelectedInsuranceDetails([]);
    setFormValuesForFarmerInfo({
      ...formValuesForFarmerInfo,
      txtSeasonForFarmerInfo: null,
      txtYearForFarmerInfo: null,
      txtSchemeForFarmerInfo: null,
    });

    setTicketCategoryList([]);
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
        if (result.response.responseData) {
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
      // A console.log(error);
      // A setAlertMessage({
      // A  type: "error",
      // A  message: "Something went Wrong! Error Code : 442",
      // A });
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
            console.log(Object.values(result.response.responseData.data));
            console.log("data");
            if (farmersData && farmersData.length > 0) {
              setInsuranceCompanyDataGreivence(farmersData);
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
              message: "Policy Data not found..",
            });
          }
        } else {
          setInsuranceCompanyDataGreivence([]);
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
      // A console.log(error);
      // A setAlertMessage({
      // A  type: "error",
      // A  message: "Something went Wrong! Error Code : 442",
      // A });
    }
  };

  const clearAddTicketForm = () => {
    clearFarmerAuthenticationForm();
    getEnquiryListData();
  };

  const [isBtndisabled, setisBtndisabled] = useState(0);
  const [btnLoaderSupportTicketActive, setBtnLoaderSupportTicketActive] = useState(false);
  const farmerEnquiryOnClick = async (penquiryGridApi) => {
    debugger;
    try {
      console.log("formValuesForByLocation", formValuesForByLocation);
      if (!handleValidationSupportTicket()) {
        return;
      }
      console.log("formValuesForByLocation", formValuesForByLocation);
      const user = getSessionStorage("user");
      const formData = {
        callerContactNumber: formValuesForByLocation.txtCallerMobileNumber ? formValuesForByLocation.txtCallerMobileNumber : "",
        farmerMasterID: 0,
        addMode: "MOBILE",
        // A farmerId: "",
        farmerId: 0,
        farmerFullName: formValuesForByLocation.txtFarmerFullName,
        relationShipID:
          formValuesForByLocation.txtRelationShipID && formValuesForByLocation.txtRelationShipID.CommonMasterValueID
            ? Number(formValuesForByLocation.txtRelationShipID.CommonMasterValueID)
            : 0,
        relationShip: formValuesForByLocation.txtRelationShip ? formValuesForByLocation.txtRelationShip : "",
        mobileNumber: formValuesForByLocation.txtMobileNumber ? formValuesForByLocation.txtMobileNumber : "",
        casteID:
          formValuesForByLocation.txtCasteID && formValuesForByLocation.txtCasteID.CommonMasterValueID
            ? Number(formValuesForByLocation.txtCasteID.CommonMasterValueID)
            : 0,
        farmerTypeID:
          formValuesForByLocation.txtFarmerTypeID && formValuesForByLocation.txtFarmerTypeID.CommonMasterValueID
            ? Number(formValuesForByLocation.txtFarmerTypeID.CommonMasterValueID)
            : 0,
        farmerCategoryID:
          formValuesForByLocation.txtFarmerCategoryID && formValuesForByLocation.txtFarmerCategoryID.CommonMasterValueID
            ? Number(formValuesForByLocation.txtFarmerCategoryID.CommonMasterValueID)
            : 0,
        farmerIDType:
          formValuesForByLocation.txtFarmerIDNo && formValuesForByLocation.txtFarmerIDNo.CommonMasterValueID
            ? Number(formValuesForByLocation.txtFarmerIDNo.CommonMasterValueID)
            : 0,
        districtID: formValuesForByLocation.txtDistrictForByLocation.level3ID ? formValuesForByLocation.txtDistrictForByLocation.level3ID : "",
        stateId: formValuesForByLocation.txtStateForByLocation.StateCodeAlpha ? formValuesForByLocation.txtStateForByLocation.StateCodeAlpha : "",
        age: formValuesForByLocation.txtAge ? Number(formValuesForByLocation.txtAge) : 0,
        gender: formValuesForByLocation.txtGender && formValuesForByLocation.txtGender.Value ? formValuesForByLocation.txtGender.Value.toString() : "",
        district: formValuesForByLocation.txtDistrictForByLocation.level3Name ? formValuesForByLocation.txtDistrictForByLocation.level3Name : "",
        villageId: formValuesForByLocation.txtVillageForByLocation.value ? formValuesForByLocation.txtVillageForByLocation.value : "",
        village: formValuesForByLocation.txtVillageForByLocation.label ? formValuesForByLocation.txtVillageForByLocation.label : "",
        subDistrictId: formValuesForByLocation.txtSubDistrictForByLocation.level4ID ? formValuesForByLocation.txtSubDistrictForByLocation.level4ID : "",
        subDistrict: formValuesForByLocation.txtSubDistrictForByLocation.level4Name ? formValuesForByLocation.txtSubDistrictForByLocation.level4Name : "",
        pinCode: formValuesForByLocation.txtPinCode ? formValuesForByLocation.txtPinCode : "",
        address: formValuesForByLocation.txtAddress ? formValuesForByLocation.txtAddress : "",
        bankId: "",
        bankName: "",
        branchId: "",
        branchName: "",
        aadharNumber: formValuesForByLocation.txtFarmerIDNoValue ? formValuesForByLocation.txtFarmerIDNoValue : "",
        year:
          formValuesForByLocation.txtYearForLocation && formValuesForByLocation.txtYearForLocation.Value
            ? formValuesForByLocation.txtYearForLocation.Value
            : "",
        cropSeasonId:
          formValuesForByLocation.txtSeasonForLocation && formValuesForByLocation.txtSeasonForLocation.CropSeasonID
            ? Number(formValuesForByLocation.txtSeasonForLocation.CropSeasonID)
            : 0,
        schemeId:
          formValuesForByLocation.txtSchemeForLocation && formValuesForByLocation.txtSchemeForLocation.SchemeID
            ? Number(formValuesForByLocation.txtSchemeForLocation.SchemeID)
            : 0,
        selectedCropId:
          formValuesForByLocation.txtCropForCalculate && formValuesForByLocation.txtCropForCalculate.cropID
            ? formValuesForByLocation.txtCropForCalculate.cropID
            : "",
        cropName:
          formValuesForByLocation.txtCropForCalculate && formValuesForByLocation.txtCropForCalculate.cropName
            ? formValuesForByLocation.txtCropForCalculate.cropName
            : "",
        sSSYId:
          formValuesForByLocation.txtCropForCalculate && formValuesForByLocation.txtCropForCalculate.sssyID
            ? formValuesForByLocation.txtCropForCalculate.sssyID
            : "",
        insuranceCompanyCode:
          formValuesForByLocation.txtCropForCalculate && formValuesForByLocation.txtCropForCalculate.insuranceCompanyCode
            ? Number(formValuesForByLocation.txtCropForCalculate.insuranceCompanyCode)
            : 0,
        area: formValuesForByLocation.txtAreaInHectareForCalculator ? Number(formValuesForByLocation.txtAreaInHectareForCalculator) : 0,
        calculatedPremium: formValuesForByLocation.CalculatedSumInsured ? Number(formValuesForByLocation.CalculatedSumInsured) : 0,
        accountNumber: "",
        description: formValuesForByLocation.txtTicketDescription ? formValuesForByLocation.txtTicketDescription : "",
      };
      console.log("formdata", formData);
      console.log("formValuesForByLocation", formValuesForByLocation);
      const tt = moment().utcOffset("+05:30").format("YYYY-MM-DDTHH:mm:ss");
      console.log(tt);
      setisBtndisabled(1);
      setBtnLoaderSupportTicketActive(true);
      const result = await addFarmer(formData);
      setBtnLoaderSupportTicketActive(false);
      setisBtndisabled(0);
      debugger;
      if (result.response.responseCode === 1) {
        if (result.response && result.response.responseData) {
          const newlyAddedFarmerEnquiry = [
            {
              farmerID: result.response.responseData.FarmerID,
              farmerMasterID: result.response.responseData.FarmerMasterID,
              CallerContactNumber: formValuesForByLocation.txtCallerMobileNumber ? formValuesForByLocation.txtCallerMobileNumber : "",
              farmerName: formValuesForByLocation.txtFarmerFullName ? formValuesForByLocation.txtFarmerFullName : "",
              mobileNumber: formValuesForByLocation.txtMobileNumber ? formValuesForByLocation.txtMobileNumber : "",
              Description: formValuesForByLocation.txtTicketDescription ? formValuesForByLocation.txtTicketDescription : "",
              InsuranceMasterName:
                formValuesForByLocation.txtCropForCalculate && formValuesForByLocation.txtCropForCalculate.insuranceCompanyName
                  ? formValuesForByLocation.txtCropForCalculate.insuranceCompanyName
                  : "",
              StateMasterName: formValuesForByLocation.txtStateForByLocation.StateMasterName
                ? formValuesForByLocation.txtStateForByLocation.StateMasterName
                : "",
              SubDistrict: formValuesForByLocation.txtSubDistrictForByLocation.level4Name ? formValuesForByLocation.txtSubDistrictForByLocation.level4Name : "",
              Village: formValuesForByLocation.txtVillageForByLocation.label ? formValuesForByLocation.txtVillageForByLocation.label : "",
              EnquiryStatus: "Open",
              gender: formValuesForByLocation.txtGender && formValuesForByLocation.txtGender.Value ? formValuesForByLocation.txtGender.Value.toString() : "",
              Years:
                formValuesForByLocation.txtYearForLocation && formValuesForByLocation.txtYearForLocation.Value
                  ? formValuesForByLocation.txtYearForLocation.Value
                  : "",
              VillageID: formValuesForByLocation.txtVillageForByLocation.value ? formValuesForByLocation.txtVillageForByLocation.value : "",
              Village: formValuesForByLocation.txtVillageForByLocation.label ? formValuesForByLocation.txtVillageForByLocation.label : "",
              UserType: user && user.UserCompanyType ? user.UserCompanyType : "",
              TicketStatusID: 109301,
              SubDistrictID: formValuesForByLocation.txtSubDistrictForByLocation.level4ID ? formValuesForByLocation.txtSubDistrictForByLocation.level4ID : "",
              StateMasterID: formValuesForByLocation.txtStateForByLocation.StateCodeAlpha ? formValuesForByLocation.txtStateForByLocation.StateCodeAlpha : "",
              SelectedCropID:
                formValuesForByLocation.txtCropForCalculate && formValuesForByLocation.txtCropForCalculate.cropID
                  ? formValuesForByLocation.txtCropForCalculate.cropID
                  : "",
              CropName:
                formValuesForByLocation.txtCropForCalculate && formValuesForByLocation.txtCropForCalculate.cropName
                  ? formValuesForByLocation.txtCropForCalculate.cropName
                  : "",
              SchemeID:
                formValuesForByLocation.txtSchemeForLocation && formValuesForByLocation.txtSchemeForLocation.SchemeID
                  ? Number(formValuesForByLocation.txtSchemeForLocation.SchemeID)
                  : 0,
              SSSYID:
                formValuesForByLocation.txtCropForCalculate && formValuesForByLocation.txtCropForCalculate.sssyID
                  ? formValuesForByLocation.txtCropForCalculate.sssyID
                  : "",
              PinCode: formValuesForByLocation.txtPinCode ? formValuesForByLocation.txtPinCode : "",
              DistrictID: formValuesForByLocation.txtDistrictForByLocation.level3ID ? formValuesForByLocation.txtDistrictForByLocation.level3ID : "",
              District: formValuesForByLocation.txtDistrictForByLocation.level3Name ? formValuesForByLocation.txtDistrictForByLocation.level3Name : "",
              CreatedBY: user && user.UserDisplayName ? user.UserDisplayName : "",
              CreatedAt: moment().utcOffset("+05:30").format("YYYY-MM-DDTHH:mm:ss"),
              CalculatedPremium: formValuesForByLocation.CalculatedSumInsured ? Number(formValuesForByLocation.CalculatedSumInsured) : 0,
              Age: formValuesForByLocation.txtAge ? Number(formValuesForByLocation.txtAge) : 0,
              Area: formValuesForByLocation.txtAreaInHectareForCalculator ? Number(formValuesForByLocation.txtAreaInHectareForCalculator) : 0,
              Address: formValuesForByLocation.txtAddress ? formValuesForByLocation.txtAddress : "",
              IsNewlyAdded: true,
            },
          ];
          updateFarmersTickets(newlyAddedFarmerEnquiry, penquiryGridApi);
          setAlertMessage({
            type: "success",
            message: result.response.responseMessage,
          });
          setSelectedTabEnqGreivCropLoss("2");
          setchkNewOrExtingFarmer("OD");
          setIsInsuranceCompanyNull("NO");
          setFormValuesForByLocation({
            ...formValuesForByLocation,
            txtTicketDescription: "",
          });
          setGetFarmerTicketRequestorID(result.response.responseData.FarmerID);
          getTicketCategoryTypeListData("1", 0, "TCKTYP");
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

  const farmerEnquiryUpdateOnClick = async () => {
    debugger;
    try {
      if (!handleValidationSupportTicket()) {
        return;
      }
      const formData = {
        farmerMasterID: selectedEnquiry && selectedEnquiry.farmerMasterID ? selectedEnquiry.farmerMasterID : 0,
        year:
          formValuesForByLocation.txtYearForLocation && formValuesForByLocation.txtYearForLocation.Value
            ? formValuesForByLocation.txtYearForLocation.Value
            : "",
        cropSeasonID:
          formValuesForByLocation.txtSeasonForLocation && formValuesForByLocation.txtSeasonForLocation.CropSeasonID
            ? Number(formValuesForByLocation.txtSeasonForLocation.CropSeasonID)
            : 0,
        schemeID:
          formValuesForByLocation.txtSchemeForLocation && formValuesForByLocation.txtSchemeForLocation.SchemeID
            ? Number(formValuesForByLocation.txtSchemeForLocation.SchemeID)
            : 0,
        selectedCropID:
          formValuesForByLocation.txtCropForCalculate && formValuesForByLocation.txtCropForCalculate.cropID
            ? formValuesForByLocation.txtCropForCalculate.cropID
            : "",
        cropName:
          formValuesForByLocation.txtCropForCalculate && formValuesForByLocation.txtCropForCalculate.cropName
            ? formValuesForByLocation.txtCropForCalculate.cropName
            : "",
        sssyID:
          formValuesForByLocation.txtCropForCalculate && formValuesForByLocation.txtCropForCalculate.sssyID
            ? formValuesForByLocation.txtCropForCalculate.sssyID
            : "",
        insuranceCompanyCode:
          formValuesForByLocation.txtCropForCalculate && formValuesForByLocation.txtCropForCalculate.insuranceCompanyCode
            ? Number(formValuesForByLocation.txtCropForCalculate.insuranceCompanyCode)
            : 0,
        area: formValuesForByLocation.txtAreaInHectareForCalculator ? Number(formValuesForByLocation.txtAreaInHectareForCalculator) : 0,
        calculatedPremium: formValuesForByLocation.CalculatedSumInsured ? Number(formValuesForByLocation.CalculatedSumInsured) : 0,
      };
      setisBtndisabled(1);
      setBtnLoaderSupportTicketActive(true);
      const result = await checkFarmerUpdateInDbData(formData);
      setBtnLoaderSupportTicketActive(false);
      setisBtndisabled(0);
      debugger;
      if (result.response.responseCode === 1) {
        if (result.response && result.response.responseData) {
          setAlertMessage({
            type: "success",
            message: result.response.responseMessage,
          });
          selectedEnquiry.Years =
            formValuesForByLocation.txtYearForLocation && formValuesForByLocation.txtYearForLocation.Value
              ? formValuesForByLocation.txtYearForLocation.Value
              : "";
          selectedEnquiry.CropSeasonID =
            formValuesForByLocation.txtSeasonForLocation && formValuesForByLocation.txtSeasonForLocation.CropSeasonID
              ? Number(formValuesForByLocation.txtSeasonForLocation.CropSeasonID)
              : 0;
          selectedEnquiry.CropSeasonName =
            formValuesForByLocation.txtSeasonForLocation && formValuesForByLocation.txtSeasonForLocation.CropSeasonName
              ? Number(formValuesForByLocation.txtSeasonForLocation.CropSeasonName)
              : "";
          selectedEnquiry.SchemeID =
            formValuesForByLocation.txtSchemeForLocation && formValuesForByLocation.txtSchemeForLocation.SchemeID
              ? Number(formValuesForByLocation.txtSchemeForLocation.SchemeID)
              : 0;
          selectedEnquiry.SchemeName =
            formValuesForByLocation.txtSchemeForLocation && formValuesForByLocation.txtSchemeForLocation.SchemeName
              ? Number(formValuesForByLocation.txtSchemeForLocation.SchemeName)
              : "";
          selectedEnquiry.SelectedCropID =
            formValuesForByLocation.txtCropForCalculate && formValuesForByLocation.txtCropForCalculate.cropID
              ? Number(formValuesForByLocation.txtCropForCalculate.cropID)
              : 0;
          selectedEnquiry.CropName =
            formValuesForByLocation.txtCropForCalculate && formValuesForByLocation.txtCropForCalculate.cropName
              ? Number(formValuesForByLocation.txtCropForCalculate.cropName)
              : "";
          selectedEnquiry.InsuranceCompanyID =
            formValuesForByLocation.txtCropForCalculate && formValuesForByLocation.txtCropForCalculate.insuranceCompanyCode
              ? Number(formValuesForByLocation.txtCropForCalculate.insuranceCompanyCode)
              : 0;
          selectedEnquiry.InsuranceMasterName =
            formValuesForByLocation.txtCropForCalculate && formValuesForByLocation.txtCropForCalculate.insuranceCompanyName
              ? formValuesForByLocation.txtCropForCalculate.insuranceCompanyName
              : "";
          selectedEnquiry.Area = formValuesForByLocation.txtAreaInHectareForCalculator ? Number(formValuesForByLocation.txtAreaInHectareForCalculator) : 0;
          selectedEnquiry.CalculatedPremium = formValuesForByLocation.CalculatedSumInsured ? Number(formValuesForByLocation.CalculatedSumInsured) : 0;
          const mappedData = enquiryDataList.map((data) => {
            if (data.farmerMasterID.toString() === selectedEnquiry.farmerMasterID.toString()) {
              data.InsuranceMasterName = selectedEnquiry.InsuranceMasterName;
              data.InsuranceCompanyID = selectedEnquiry.InsuranceCompanyID;
            }
            return data;
          });

          setFilterEnquiryDataList(mappedData);
          setEnquiryDataList(mappedData);
          setSelectedTabEnqGreivCropLoss("2");
          setchkNewOrExtingFarmer("OD");
          setIsInsuranceCompanyNull("NO");
          setFormValuesForByLocation({
            ...formValuesForByLocation,
            txtTicketDescription: "",
          });
          setGetFarmerTicketRequestorID(selectedEnquiry.farmerID);
          getTicketCategoryTypeListData("1", 0, "TCKTYP");
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

  const supportTicketGrievenceAndCropLossIntimationOnClick = async () => {
    debugger;
    try {
      if (!handleValidationSupportTicket()) {
        return;
      }
      let pticketHeaderID = 0;
      if (selectedTabEnqGreivCropLoss === "2") {
        pticketHeaderID = 1;
      } else if (selectedTabEnqGreivCropLoss === "3") {
        pticketHeaderID = 4;
      }
      const user = getSessionStorage("user");
      const formData = {
        callerContactNumber: formValuesForByLocation.txtCallerMobileNumber ? formValuesForByLocation.txtCallerMobileNumber : "",
        farmerSupportTicketID: 0,
        farmerTicketRequestorID: getFarmerTicketRequestorID,
        stateCodeAlpha: formValuesForByLocation.txtStateForByLocation.StateCodeAlpha ? formValuesForByLocation.txtStateForByLocation.StateCodeAlpha : "",
        districtRequestorID: formValuesForByLocation.txtDistrictForByLocation.level3ID ? formValuesForByLocation.txtDistrictForByLocation.level3ID : "",
        villageRequestorID: formValuesForByLocation.txtVillageForByLocation.value ? formValuesForByLocation.txtVillageForByLocation.value : "",
        farmerSupportTicketNo: "0",
        requestorName: formValuesForByLocation.txtFarmerFullName ? formValuesForByLocation.txtFarmerFullName : "",
        requestorMobileNo: formValuesForByLocation.txtMobileNumber ? formValuesForByLocation.txtMobileNumber : "",
        requestorAccountNo: "",
        requestorAadharNo: "",
        ticketCategoryID:
          formValuesForByLocation.txtTicketCategory && formValuesForByLocation.txtTicketCategory.TicketCategoryID
            ? formValuesForByLocation.txtTicketCategory.TicketCategoryID
            : 0,
        cropCategoryOthers: formValuesForByLocation.txtOtherSubCategory ? formValuesForByLocation.txtOtherSubCategory : "",
        cropStageMasterID:
          formValuesForByLocation.txtCropStage && formValuesForByLocation.txtCropStage.CropStageMasterID
            ? formValuesForByLocation.txtCropStage.CropStageMasterID
            : 0,
        ticketHeaderID: pticketHeaderID,
        requestYear:
          formValuesForByLocation.txtYearForLocation && formValuesForByLocation.txtYearForLocation.Value ? formValuesForByLocation.txtYearForLocation.Value : 0,
        requestSeason:
          formValuesForByLocation.txtSeasonForLocation && formValuesForByLocation.txtSeasonForLocation.CropSeasonID
            ? Number(formValuesForByLocation.txtSeasonForLocation.CropSeasonID)
            : 0,
        ticketDescription: formValuesForByLocation.txtTicketDescription,
        lossDate:
          selectedTabEnqGreivCropLoss !== "3"
            ? null
            : formValuesForByLocation.txtCropLossDate
            ? dateToCompanyFormat(formValuesForByLocation.txtCropLossDate)
            : "",
        lossTime: "",
        postHarvestDate:
          selectedTabEnqGreivCropLoss !== "3" || selectedOptionCropStage !== "2"
            ? null
            : formValuesForByLocation.txtCropHarvestDate
            ? dateToCompanyFormat(formValuesForByLocation.txtCropHarvestDate)
            : "",
        ticketSourceID: 6,
        ticketStatusID: 109019,
        applicationNo: "",
        insuranceCompanyID: 0,
        companyName:
          formValuesForByLocation.txtCropForCalculate && formValuesForByLocation.txtCropForCalculate.insuranceCompanyName
            ? formValuesForByLocation.txtCropForCalculate.insuranceCompanyName
            : "",
        companyCode: 0,
        insurancePolicyNo: "",
        insurancePolicyDate: "",
        insuranceExpiryDate: "",
        bankMasterID: 0,
        agentUserID: user && user.LoginID ? user.LoginID.toString() : "0",
        schemeID:
          formValuesForByLocation.txtSchemeForLocation && formValuesForByLocation.txtSchemeForLocation.SchemeID
            ? Number(formValuesForByLocation.txtSchemeForLocation.SchemeID)
            : 0,
        hasDocument: 0,
        onTimeIntimationFlag: stateCropLossIntimation,
      };
      setisBtndisabled(1);
      setBtnLoaderSupportTicketActive(true);
      const result = await addFarmerSupportTicket(formData);
      setBtnLoaderSupportTicketActive(false);
      setisBtndisabled(0);
      if (result.response.responseCode === 1) {
        if (result.response && result.response.responseData) {
          setAlertMessage({
            type: "success",
            message: result.response.responseMessage,
          });

          clearFarmerAuthenticationForm();
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

  const supportTicketOnClick = async (enquiryGridApi) => {
    if (!handleValidationSupportTicket()) {
      return;
    }

    if (selectedTabEnqGreivCropLoss === "1") {
      if (chkNewOrExtingFarmer !== "NW" && isInsuranceCompanyNull === "YES") {
        farmerEnquiryUpdateOnClick();
      } else if (chkNewOrExtingFarmer === "NW" && isInsuranceCompanyNull === "YES") {
        farmerEnquiryOnClick(enquiryGridApi);
      }
    } else {
      supportTicketGrievenceAndCropLossIntimationOnClick();
    }
  };

  const [addForm, setaddForm] = useState(false);
  const OpenAddForm = () => {
    console.log(addForm, "*****addform******");
    setaddForm(!addForm);
  };

  const [selectedTicketEnquiry, setSelectedTicketEnquiry] = useState([]);
  const [isLoadingSelectedTicketEnquiry, setIsLoadingSelectedTicketEnquiry] = useState(false);
  const getEnquiryTicket = async (pticketData, pPageIndex, pPageSize) => {
    try {
      setIsLoadingSelectedTicketEnquiry(true);
      const formdata = {
        farmerMasterID: pticketData && pticketData.farmerMasterID ? pticketData.farmerMasterID : selectedEnquiry.farmerMasterID,
        pageIndex: pPageIndex,
        pageSize: pPageSize,
      };
      console.log(formdata, "formdata");
      const result = await getEnquiryTicketReview(formdata);
      console.log(result, "chat List");
      setIsLoadingSelectedTicketEnquiry(false);
      if (result.responseCode === 1) {
        if (result.responseData.Ticket && result.responseData.Ticket.length > 0) {
          setSelectedTicketEnquiry(result.responseData.Ticket);
        } else {
          setSelectedTicketEnquiry([]);
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      // A console.log(error);
      // A setAlertMessage({
      // A  type: "error",
      // A  message: "Something went Wrong! Error Code : 442",
      // A });
    }
  };
  const closeEnquiry = () => {
    setEnquiryPopup(!EnquiryPopup);
  };
  const EnquiryDetails = (data) => {
    debugger;

    console.log("data", data.data);
    setSelectedEnquiry(data.data);
    setValue("");
    setWordcount(0);
    if (data.data) {
      getEnquiryTicket(data.data, 1, -1);
      setEnquiryPopup(!EnquiryPopup);
    }
  };
  useEffect(() => {}, [selectedTicketEnquiry]);
  const updateTicketHistorytData = (addedData) => {
    if (addedData.IsNewlyAdded === true) {
      selectedTicketEnquiry.unshift(addedData);
    }
    console.log(addedData);
    setSelectedTicketEnquiry([]);
    setSelectedTicketEnquiry(selectedTicketEnquiry);
  };
  const [btnLoaderActive1, setBtnLoaderActive1] = useState(false);
  const handleSave = async (e) => {
    debugger;
    if (e) e.preventDefault();
    let popUpMsg = "";
    if (value === "" || value === "<p><p>") {
      popUpMsg = "Ticket comment is required!";
      setAlertMessage({
        type: "warning",
        message: popUpMsg,
      });
      return;
    }

    try {
      // Anil Code not in use
      // Anil let SaveTicketStatusID = "0";
      // Anil SaveTicketStatusID = ticketData.TicketStatusID;

      const formData = {
        ticketHistoryID: 0,
        farmerMasterID: selectedTicketEnquiry && selectedTicketEnquiry[0].FarmerMasterID ? selectedTicketEnquiry[0].FarmerMasterID : 0,
        agentUserID: selectedTicketEnquiry && selectedTicketEnquiry[0].AgentUserID ? selectedTicketEnquiry[0].AgentUserID : "0",
        ticketStatusID: 109303,
        ticketDescription: value,
        hasDocument: 0,
      };
      setBtnLoaderActive1(true);
      const result = await addEnquiryTicketReview(formData);
      setBtnLoaderActive1(false);
      if (result.response.responseCode === 1) {
        if (result.response && result.response.responseData && result.response.responseData.TicketHistoryID) {
          const ip = await publicIp.v4();
          const user = getSessionStorage("user");
          const newlyAddedEntry = {
            CreatedBY: user && user.UserDisplayName ? user.UserDisplayName.toString() : "",
            AgentUserID: selectedTicketEnquiry.AgentUserID ? selectedTicketEnquiry.AgentUserID : "0",
            HasDocument: 0,
            InsertIPAddress: ip,
            InsertUserID: user && user.LoginID ? user.LoginID.toString() : "0",
            farmerMasterID: selectedTicketEnquiry.farmerMasterID,
            TicketDescription: value,
            TicketHistoryDate: moment().utcOffset("+05:30").format("YYYY-MM-DDTHH:mm:ss"),
            TicketStatusID: 109303,
            EnquiryStatus: "Resolved",
            IsNewlyAdded: true,
          };
          updateTicketHistorytData(newlyAddedEntry);

          selectedTicketEnquiry.TicketStatusID = 109303;
          selectedTicketEnquiry.EnquiryStatus = "Resolved";
          selectedEnquiry.TicketStatusID = 109303;
          selectedEnquiry.EnquiryStatus = "Resolved";

          setValue("");
          setWordcount(0);

          setAlertMessage({
            type: "success",
            message: result.response.responseMessage,
          });
        }
      } else {
        setAlertMessage({
          type: "warning",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      // A console.log(error);
      // A setAlertMessage({
      // A  type: "error",
      // A  message: "Something went Wrong! Error Code : 442",
      // A });
    }
  };

  const selectedTabEnqGreivCropLossOnClick = (pselectedTab) => {
    if (pselectedTab === "1") {
      setSelectedTabEnqGreivCropLoss("1");
      setSelectedOptionCropStage("1");
      setTicketCategoryList([]);
      getTicketCategoryTypeListData("1", 0, "TCKTYP");
    } else if (pselectedTab === "2") {
      setSelectedTabEnqGreivCropLoss("2");
      setSelectedOptionCropStage("1");
      setTicketCategoryList([]);
      getTicketCategoryTypeListData("1", 0, "TCKTYP");
    } else if (pselectedTab === "3") {
      setSelectedTabEnqGreivCropLoss("3");
      setSelectedOptionCropStage("1");
      setTicketCategoryTypeList([]);
      setTicketCategoryList([]);
      getLossAtListData(1);
      getCropStageListData(1);
    }
    setFormValuesForByLocation({
      ...formValuesForByLocation,
      txtTicketCategoryType: null,
      txtTicketCategory: null,
      txtCropLossDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
      txtCropLossIntimation: "On-time",
      txtCropLossTime: "",
      txtLossAt: null,
      txtOtherSubCategory: "",
      txtCropStage: null,
      txtCropHarvestDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
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
    setFormValuesForByLocation({
      ...formValuesForByLocation,
      txtTicketCategoryType: null,
      txtTicketCategory: null,
      txtCropLossDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
      txtCropLossIntimation: "On-time",
      txtCropLossTime: "",
      txtLossAt: null,
      txtOtherSubCategory: "",
      txtCropStage: null,
      txtCropHarvestDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
    });
    setStateCropLossIntimation("NA");
  };

  const OpenViewFarmerEnquiryTiketsForm = () => {
    navigate("/FarmerEnquiryTickets");
  };
  return {
    selectedEnquiry,
    isLoadingSelectedTicketEnquiry,
    selectedTicketEnquiry,
    selectedValidateOption,
    setSelectedValidateOption,
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
    isLoadingStateForPolicyNumberDropdownDataList,
    districtForPolicyNumberDropdownDataList,
    isLoadingDistrictForPolicyNumberDropdownDataList,
    subDistrictForPolicyNumberDropdownDataList,
    isLoadingSubDistrictForPolicyNumberDropdownDataList,
    villageForPolicyNumberDropdownDataList,
    isLoadingVillageForPolicyNumberDropdownDataList,
    seasonForPolicyNumberDropdownDataList,
    isLoadingSeasonForPolicyNumberDropdownDataList,
    farmerTypeDropdownDataList,
    isLoadingFarmerTypeDropdownDataList,
    casteTypeDropdownDataList,
    isLoadingCasteTypeDropdownDataList,
    farmerCategoryDropdownDataList,
    isLoadingFarmerCategoryDropdownDataList,
    relationShipDropdownDataList,
    isLoadingRelationShipDropdownDataList,
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
    ticketCategoryList,
    ticketCategoryTypeList,
    isLoadingTicketCategoryTypeList,
    formValidationSupportTicketError,
    btnLoaderSupportTicketActive,
    supportTicketOnClick,
    openInsuranceCompanyModal,
    toggleInsuranceCompanyModal,
    onCellDoubleClickedDetails,
    selectedInsuranceDetails,
    genderList,
    btnLoaderFarmerGreivenceInfoActive,
    isLoadingApplicationNoDatGreivence,
    getPolicyOfFarmerGreivenceOnClick,
    openInsuranceCompanyModalGreivence,
    insuranceCompanyDataGreivence,
    toggleInsuranceCompanyModalGreivence,
    cropForCalculatorDropdownDataList,
    isLoadingCropForCalculatorDropdownDataList,
    onCellDoubleClickedDetailsGreivence,
    selectedClaimOrGrievence,
    claimOrGrievenceDisabled,
    clearAddTicketForm,
    schemeList,
    isLoadingSchemeListDropdownDataList,
    isLoadingFarmerIDNoDropdownDataList,
    farmerIDNoDropdownDataList,
    isBtndisabled,
    addFormActive,
    getCalculatorDataOnClick,
    OpenAddForm,
    addForm,
    filterEnquiryDataList,
    searchEnquiryText,
    onSearchEnquiry,
    isLoadingEnquiryList,
    onEnquiryGridReady,
    EnquiryPopup,
    EnquiryDetails,
    closeEnquiry,
    value,
    setValue,
    wordcount,
    setWordcount,
    btnLoaderActive1,
    handleSave,
    getEnquiryListData,
    updateSearchFormState,
    searchFormValues,
    activityStatusFilterData,
    updateFarmersTickets,
    selectedTabEnqGreivCropLoss,
    selectedTabEnqGreivCropLossOnClick,
    isLoadingTicketCategoryList,
    selectedOptionCropStage,
    selectedOptionOnClickCropStage,
    lossAtList,
    isLoadingLossAtList,
    cropStageList,
    isLoadingCropStageList,
    chkNewOrExtingFarmer,
    OpenViewFarmerEnquiryTiketsForm,
    enquiryGridApi,
    isInsuranceCompanyNull,
    stateCropLossIntimation,
  };
}
export default FarmerEnquiryRegistrationLogics;
