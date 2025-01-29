import { useEffect, useState } from "react";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import moment from "moment";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { getfarmerTicketsListInsuranceCompany, getMasterDataBinding } from "../Services/Methods";
import { getMasterDataBindingDataList } from "../Views/Modals/AddTicket/Services/Methods";

function InsuranceCompManageTicketLogics() {
  const setAlertMessage = AlertMessage();
  const [farmerAuthenticateDataListInsuranceComp, setfarmerAuthenticateDataListInsuranceComp] = useState([]);
  const [isDataCleared, setIsDataCleared] = useState(false);
  const [isDataClearedEsclated, setIsDataClearedEsclated] = useState(false);

  const [filterValuesInsuranceComp, setFilterValuesInsuranceComp] = useState({
    SearchByFilterInsuranceComp: null,
    txtSearchFilterInsuranceComp: "",
  });

  const [formValuesInsuranceComp, setformValuesInsuranceComp] = useState({
    txtTicketType: null,
    txtTicketCategory: null,
    txtTicketCategoryType: null,
    txtTicketSource: null,
    txtStatus: null,
    txtFromDate: "",
    txtToDate: "",
    txtSchemeInsuranceComp: null,
  });

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

  const [isLoadingFarmersticketInsuranceComp, setIsLoadingFarmersticketInsuranceComp] = useState(false);
  const [farmersTicketDataInsuranceComp, setFarmersTicketDataInsuranceComp] = useState([]);
  const [satatusCountInsuranceComp, setSatatusCountInsuranceComp] = useState({});
  const [totalSatatusCountInsuranceComp, settotalSatatusCountInsuranceComp] = useState("0");
  const [viewTypeModeInsuranceComp, setViewTypeModeInsuranceComp] = useState([]);
  const [esclatedCountInsuranceComp, setEsclatedCountInsuranceComp] = useState("0");
  const getFarmersTicketsInsuranceComp = async (pviewTYP) => {
    try {
      setViewTypeModeInsuranceComp(pviewTYP);
      const user = getSessionStorage("user");
      const ChUserRelationID = user && user.UserRelationID ? user.UserRelationID.toString() : 0;
      const formData = {
        insuranceCompanyID: ChUserRelationID,
        viewTYP: pviewTYP,
        stateID:
          formValuesInsuranceComp.txtStateInsuranceCompany && formValuesInsuranceComp.txtStateInsuranceCompany.StateMasterID
            ? formValuesInsuranceComp.txtStateInsuranceCompany.StateMasterID.toString()
            : "",
        supportTicketID: 0,
        ticketCategoryID:
          formValuesInsuranceComp.txtTicketCategory && formValuesInsuranceComp.txtTicketCategory.TicketCategoryID
            ? formValuesInsuranceComp.txtTicketCategory.TicketCategoryID
            : 0,
        ticketSourceID: 0,
        supportTicketTypeID:
          formValuesInsuranceComp.txtTicketCategoryType && formValuesInsuranceComp.txtTicketCategoryType.SupportTicketTypeID
            ? formValuesInsuranceComp.txtTicketCategoryType.SupportTicketTypeID
            : 0,
        supportTicketNo: "",
        statusID:
          formValuesInsuranceComp.txtStatus && formValuesInsuranceComp.txtStatus.CommonMasterValueID
            ? formValuesInsuranceComp.txtStatus.CommonMasterValueID
            : 0,
        fromdate: formValuesInsuranceComp.txtFromDate ? dateToCompanyFormat(formValuesInsuranceComp.txtFromDate) : "",
        toDate: formValuesInsuranceComp.txtToDate ? dateToCompanyFormat(formValuesInsuranceComp.txtToDate) : "",
        RequestorMobileNo: "",
        schemeID: 0,
        ticketHeaderID:
          formValuesInsuranceComp.txtTicketType && formValuesInsuranceComp.txtTicketType.TicketTypeID ? formValuesInsuranceComp.txtTicketType.TicketTypeID : 0,
      };
      setIsLoadingFarmersticketInsuranceComp(true);
      const result = await getfarmerTicketsListInsuranceCompany(formData);
      console.log(result, "result");
      setIsLoadingFarmersticketInsuranceComp(false);
      let totalStsCnt = 0;
      const jsonStatusCnt = { Open: "0", InProgress: "0", ResolvedGrievance: "0", ResolvedInformation: "0", ReOpen: "0" };
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.supportTicket && result.responseData.status) {
          setFarmersTicketDataInsuranceComp(result.responseData.supportTicket);
          if (pviewTYP === "ESCAL") {
            setEsclatedCountInsuranceComp(result.responseData.supportTicket.length);
          }
          result.responseData.status.forEach((v) => {
            if (v.TicketStatus === "Open") {
              jsonStatusCnt.Open = v.Total;
            }
            if (v.TicketStatus === "In-Progress") {
              jsonStatusCnt.InProgress = v.Total;
            }
            if (v.TicketStatus === "Re-Open") {
              jsonStatusCnt.ReOpen = v.Total;
            }
            if (v.TicketStatus === "Resolved(Grievance)") {
              jsonStatusCnt.ResolvedGrievance = v.Total;
            }
            if (v.TicketStatus === "Resolved(Information)") {
              jsonStatusCnt.ResolvedInformation = v.Total;
            }
            totalStsCnt += v.Total;
          });
          settotalSatatusCountInsuranceComp(totalStsCnt.toString());
          setSatatusCountInsuranceComp([jsonStatusCnt]);
        } else {
          settotalSatatusCountInsuranceComp(totalStsCnt.toString());
          setSatatusCountInsuranceComp([jsonStatusCnt]);
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
        settotalSatatusCountInsuranceComp(totalStsCnt.toString());
        setSatatusCountInsuranceComp([jsonStatusCnt]);
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const updateFilterStateInsuranceComp = (name, value) => {
    setFilterValuesInsuranceComp({ ...filterValuesInsuranceComp, [name]: value });
  };

  const searchByMobileTicketsInsuranceCompOnClick = async () => {
    try {
      let ticketNoVal = "";
      let mobileNoVal = "";
      let pviewTYP = "";

      if (!filterValuesInsuranceComp.SearchByFilterInsuranceComp) {
        setAlertMessage({
          type: "error",
          message: "Please select search type.",
        });
        return;
      }

      if (filterValuesInsuranceComp.SearchByFilterInsuranceComp.value === "1") {
        const regex = new RegExp("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$");
        if (filterValuesInsuranceComp.txtSearchFilterInsuranceComp.length === 0) {
          setAlertMessage({
            type: "error",
            message: "Please enter Mobile No.",
          });
          return;
        }

        if (!regex.test(filterValuesInsuranceComp.txtSearchFilterInsuranceComp)) {
          setAlertMessage({
            type: "error",
            message: "Please enter Valid Mobile No.",
          });
          return;
        }
        if (filterValuesInsuranceComp.txtSearchFilterInsuranceComp.length < 10 || filterValuesInsuranceComp.txtSearchFilterInsuranceComp.length > 10) {
          setAlertMessage({
            type: "error",
            message: "Please enter Valid 10 digit mobile No.",
          });
          return;
        }

        mobileNoVal = filterValuesInsuranceComp.txtSearchFilterInsuranceComp;
        pviewTYP = "MOBILE";
      } else if (filterValuesInsuranceComp.SearchByFilterInsuranceComp.value === "2") {
        if (filterValuesInsuranceComp.txtSearchFilterInsuranceComp.length === 0) {
          setAlertMessage({
            type: "error",
            message: "Please enter Ticket No.",
          });
          return;
        }
        ticketNoVal = filterValuesInsuranceComp.txtSearchFilterInsuranceComp;
        pviewTYP = "TICKET";
      }
      const user = getSessionStorage("user");
      const ChUserRelationID = user && user.UserRelationID ? user.UserRelationID.toString() : 0;
      const formData = {
        insuranceCompanyID: ChUserRelationID,
        viewTYP: pviewTYP,
        stateID: "",
        supportTicketID: 0,
        ticketCategoryID: 0,
        ticketSourceID: 0,
        supportTicketTypeID: 0,
        supportTicketNo: ticketNoVal,
        statusID: 0,
        fromdate: "",
        toDate: "",
        RequestorMobileNo: mobileNoVal,
        schemeID: 0,
        ticketHeaderID: 0,
      };
      setIsLoadingFarmersticketInsuranceComp(true);
      const result = await getfarmerTicketsListInsuranceCompany(formData);
      console.log(result, "result");
      setIsLoadingFarmersticketInsuranceComp(false);
      let totalStsCnt = 0;
      const jsonStatusCnt = { Open: "0", InProgress: "0", ResolvedGrievance: "0", ResolvedInformation: "0", ReOpen: "0" };
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.supportTicket && result.responseData.status) {
          if (result.responseData.supportTicket.length > 0 && result.responseData.status.length > 0) {
            result.responseData.status.forEach((v) => {
              if (v.TicketStatus === "Open") {
                jsonStatusCnt.Open = v.Total;
              }
              if (v.TicketStatus === "In-Progress") {
                jsonStatusCnt.InProgress = v.Total;
              }
              if (v.TicketStatus === "Re-Open") {
                jsonStatusCnt.ReOpen = v.Total;
              }
              if (v.TicketStatus === "Resolved(Grievance)") {
                jsonStatusCnt.ResolvedGrievance = v.Total;
              }
              if (v.TicketStatus === "Resolved(Information)") {
                jsonStatusCnt.ResolvedInformation = v.Total;
              }
              totalStsCnt += v.Total;
            });
            settotalSatatusCountInsuranceComp(totalStsCnt.toString());
            setSatatusCountInsuranceComp([jsonStatusCnt]);
            setFarmersTicketDataInsuranceComp(result.responseData.supportTicket);
          } else {
            settotalSatatusCountInsuranceComp(totalStsCnt.toString());
            setSatatusCountInsuranceComp([jsonStatusCnt]);
            setFarmersTicketDataInsuranceComp([]);
          }
        } else {
          settotalSatatusCountInsuranceComp(totalStsCnt.toString());
          setSatatusCountInsuranceComp([jsonStatusCnt]);
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
        settotalSatatusCountInsuranceComp(totalStsCnt.toString());
        setSatatusCountInsuranceComp([jsonStatusCnt]);
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
    console.log(farmersTicketDataInsuranceComp, "comes");
  }, [farmersTicketDataInsuranceComp]);

  const [ticketSourceListInsuranceComp, setTicketSourceListInsuranceComp] = useState([]);
  const [isLoadingTicketSourceListInsuranceComp, setIsTicketSourceListInsuranceComp] = useState(false);
  const getTicketSourceListDataInsuranceComp = async () => {
    try {
      setTicketSourceListInsuranceComp([]);
      setIsTicketSourceListInsuranceComp(true);
      const formdata = {
        filterID: 0,
        filterID1: 0,
        masterName: "TCKTSRC",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBinding(formdata);
      console.log(result, "ticketSourceList");
      setIsTicketSourceListInsuranceComp(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setTicketSourceListInsuranceComp(result.response.responseData.masterdatabinding);
        } else {
          setTicketSourceListInsuranceComp([]);
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

  const [ticketCategoryListInsuranceComp, setTicketCategoryListInsuranceComp] = useState([]);
  const [isLoadingTicketCategoryListInsuranceComp, setIsTicketCategoryListInsuranceComp] = useState(false);
  const getTicketCategoryListDataInsuranceComp = async (supportTicketID) => {
    try {
      setTicketCategoryListInsuranceComp([]);
      setIsTicketCategoryListInsuranceComp(true);
      const formdata = {
        filterID: supportTicketID || 0,
        filterID1: 0,
        masterName: "TCKCGZ",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBinding(formdata);
      console.log(result, "ticketCategory");
      setIsTicketCategoryListInsuranceComp(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setTicketCategoryListInsuranceComp(result.response.responseData.masterdatabinding);
        } else {
          setTicketCategoryListInsuranceComp([]);
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

  const updateFarmersTickets = (newlyAddedTicket) => {
    console.log(newlyAddedTicket);
    console.log(farmersTicketDataInsuranceComp, "farmersData");
    farmersTicketDataInsuranceComp.unshift(newlyAddedTicket);
    setFarmersTicketDataInsuranceComp([]);
    setFarmersTicketDataInsuranceComp(farmersTicketDataInsuranceComp);
  };

  const [ticketCategoryTypeListInsuranceComp, setTicketCategoryTypeListInsuranceComp] = useState([]);
  const [isLoadingTicketCategoryTypeListInsuranceComp, setIsTicketCategoryTypeListInsuranceComp] = useState(false);
  const getTicketCategoryTypeListDataInsuranceComp = async (supportTicketID) => {
    try {
      setIsTicketCategoryTypeListInsuranceComp(true);
      const formdata = {
        filterID: supportTicketID || 0,
        filterID1: 0,
        masterName: "TCKTYP",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBinding(formdata);
      console.log(result, "ticktCategoryType");
      setIsTicketCategoryTypeListInsuranceComp(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setTicketCategoryTypeListInsuranceComp(result.response.responseData.masterdatabinding);
        } else {
          setTicketCategoryTypeListInsuranceComp([]);
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

  const [ticketStatusListInsuranceComp, setTicketStatusListInsuranceComp] = useState([]);
  const [isLoadingTicketStatusListInsuranceComp, setIsTicketStatusListInsuranceComp] = useState(false);
  const getTicketStatusListDataInsuranceComp = async () => {
    try {
      setTicketStatusListInsuranceComp([]);
      setIsTicketStatusListInsuranceComp(true);
      const formdata = {
        filterID: 109,
        filterID1: 0,
        masterName: "COMMVAL",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBinding(formdata);
      console.log(result, "ticketStatus");
      setIsTicketStatusListInsuranceComp(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setTicketStatusListInsuranceComp(result.response.responseData.masterdatabinding);
        } else {
          setTicketStatusListInsuranceComp([]);
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

  const [regionalOfficeList, setRegionalOfficeList] = useState([]);
  const [isLoadingRegionalOfficeList, setIsLoadingRegionalOfficeList] = useState(false);
  const getRegionalOfficeListData = async () => {
    try {
      const user = getSessionStorage("user");
      const ChUserRelationID = user && user.UserRelationID ? user.UserRelationID.toString() : 0;
      setRegionalOfficeList([]);
      setIsLoadingRegionalOfficeList(true);
      const formdata = {
        filterID: ChUserRelationID,
        filterID1: 0,
        masterName: "REGIONMAS",
        searchText: "#ALL",
        searchCriteria: "",
      };
      const result = await getMasterDataBinding(formdata);
      console.log(result, "Regional Office");
      setIsLoadingRegionalOfficeList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setRegionalOfficeList(result.response.responseData.masterdatabinding);
        } else {
          setRegionalOfficeList([]);
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

  const [stateInsuranceCompanyList, setStateInsuranceCompanyList] = useState([]);
  const [isLoadingStateInsuranceCompanyList, setIsLoadingStateInsuranceCompanyList] = useState(false);
  const getStateInsuranceCompanyListData = async (RegionMASID) => {
    try {
      setStateInsuranceCompanyList([]);
      setIsLoadingStateInsuranceCompanyList(true);
      const formdata = {
        filterID: RegionMASID,
        filterID1: 0,
        masterName: "REGASSIGN",
        searchText: "#ALL",
        searchCriteria: "",
      };
      const result = await getMasterDataBinding(formdata);
      console.log(result, "State Data");
      setIsLoadingStateInsuranceCompanyList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setStateInsuranceCompanyList(result.response.responseData.masterdatabinding);
        } else {
          setStateInsuranceCompanyList([]);
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

  const [schemeListInsuranceComp, setSchemeListInsuranceComp] = useState([]);
  const [isLoadingSchemeListInsuranceCompDropdownDataList, setIsLoadingSchemeListInsuranceCompDropdownDataList] = useState(false);
  const getSchemeListDataInsuranceComp = async () => {
    try {
      setIsLoadingSchemeListInsuranceCompDropdownDataList(true);
      const formdata = {
        filterID: 0,
        filterID1: 0,
        masterName: "SCHEME",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBindingDataList(formdata);
      console.log(result, "Scheme Data");
      setIsLoadingSchemeListInsuranceCompDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setSchemeListInsuranceComp(result.response.responseData.masterdatabinding);
        } else {
          setSchemeListInsuranceComp([]);
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

  const updateStateInsuranceComp = (name, value) => {
    setformValuesInsuranceComp({ ...formValuesInsuranceComp, [name]: value });

    if (name === "txtTicketCategoryType") {
      setformValuesInsuranceComp({
        ...formValuesInsuranceComp,
        txtTicketCategoryType: value,
        txtTicketCategory: null,
      });
      setTicketCategoryListInsuranceComp([]);
      if (value) {
        getTicketCategoryListDataInsuranceComp(value.SupportTicketTypeID);
      }
    }

    if (name === "txtTicketType") {
      setformValuesInsuranceComp({
        ...formValuesInsuranceComp,
        txtTicketType: value,
        txtTicketCategoryType: null,
        txtTicketCategory: null,
      });
      setTicketCategoryTypeListInsuranceComp([]);
      setTicketCategoryListInsuranceComp([]);
      getTicketCategoryTypeListDataInsuranceComp(value.TicketTypeID);
    }
    if (name === "txtRegionalOffice") {
      setformValuesInsuranceComp({
        ...formValuesInsuranceComp,
        txtRegionalOffice: value,
        txtStateInsuranceCompany: null,
      });
      setStateInsuranceCompanyList([]);
      if (value) {
        getStateInsuranceCompanyListData(value.RegionalOfficeID);
      }
    }
  };

  const refereshFarmerTicketInsuranceComp = () => {
    getFarmersTicketsInsuranceComp("FILTER");
  };

  const ClearTicketFiltersTicketInsuranceComp = () => {
    setformValuesInsuranceComp({
      ...formValuesInsuranceComp,
      txtTicketType: null,
      txtTicketCategory: null,
      txtTicketCategoryType: null,
      txtTicketSource: null,
      txtStatus: null,
      txtFromDate: "",
      txtToDate: "",
      txtSchemeInsuranceComp: null,
    });
    setTicketCategoryTypeListInsuranceComp([]);
    setTicketCategoryListInsuranceComp([]);
    setIsDataCleared(true);
  };

  const ClearTicketFiltersInsuranceCompForEscalated = () => {
    setformValuesInsuranceComp({
      ...formValuesInsuranceComp,
      txtTicketType: null,
      txtTicketCategory: null,
      txtTicketCategoryType: null,
      txtTicketSource: null,
      txtStatus: null,
      txtFromDate: "",
      txtToDate: "",
      txtSchemeInsuranceComp: null,
    });
    setTicketCategoryTypeListInsuranceComp([]);
    setTicketCategoryListInsuranceComp([]);
    setIsDataClearedEsclated(true);
  };

  const onClickEscalationInsuranceComp = () => {
    ClearTicketFiltersInsuranceCompForEscalated();
    getFarmersTicketsInsuranceComp("ESCAL");
  };

  useEffect(() => {
    if (isDataCleared === true) {
      getFarmersTicketsInsuranceComp("FILTER");
    }
    setIsDataCleared(false);
    if (isDataClearedEsclated === true) {
      getFarmersTicketsInsuranceComp("ESCAL");
    }
    setIsDataClearedEsclated(false);
  }, [formValuesInsuranceComp]);

  return {
    farmersTicketDataInsuranceComp,
    isLoadingFarmersticketInsuranceComp,
    farmerAuthenticateDataListInsuranceComp,
    setfarmerAuthenticateDataListInsuranceComp,
    ticketCategoryListInsuranceComp,
    isLoadingTicketCategoryListInsuranceComp,
    updateStateInsuranceComp,
    formValuesInsuranceComp,
    updateFarmersTickets,
    ticketCategoryTypeListInsuranceComp,
    isLoadingTicketCategoryTypeListInsuranceComp,
    getFarmersTicketsInsuranceComp,
    ClearTicketFiltersTicketInsuranceComp,
    getTicketCategoryListDataInsuranceComp,
    getTicketCategoryTypeListDataInsuranceComp,
    refereshFarmerTicketInsuranceComp,
    getTicketSourceListDataInsuranceComp,
    ticketSourceListInsuranceComp,
    isLoadingTicketSourceListInsuranceComp,
    getTicketStatusListDataInsuranceComp,
    ticketStatusListInsuranceComp,
    isLoadingTicketStatusListInsuranceComp,
    regionalOfficeList,
    isLoadingRegionalOfficeList,
    getRegionalOfficeListData,
    stateInsuranceCompanyList,
    isLoadingStateInsuranceCompanyList,
    getSchemeListDataInsuranceComp,
    schemeListInsuranceComp,
    isLoadingSchemeListInsuranceCompDropdownDataList,
    satatusCountInsuranceComp,
    totalSatatusCountInsuranceComp,
    filterValuesInsuranceComp,
    updateFilterStateInsuranceComp,
    setFilterValuesInsuranceComp,
    onClickEscalationInsuranceComp,
    viewTypeModeInsuranceComp,
    esclatedCountInsuranceComp,
    searchByMobileTicketsInsuranceCompOnClick,
  };
}

export default InsuranceCompManageTicketLogics;
