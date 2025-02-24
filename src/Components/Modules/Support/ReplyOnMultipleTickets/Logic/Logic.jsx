import { useState } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { getMasterDataBinding } from "../Services/Methods";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { getfarmerTicketsListPagging, getAssignedTicketList } from "../../ManageTicket/Services/Methods";

function ReplyOnMultipleTicketsLogics() {
  const setAlertMessage = AlertMessage();

  const [filterValues, setFilterValues] = useState({
    txtTicketType: null,
    txtTicketCategory: null,
    txtTicketCategoryType: null,
    txtStatus: null,
  });

  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const [isLoadingFarmersticket, setIsLoadingFarmersticket] = useState(false);
  const [farmersTicketData, setFarmersTicketData] = useState([]);
  const [satatusCount, setSatatusCount] = useState({});
  const [totalSatatusCount, settotalSatatusCount] = useState("0");
  const [chkisDisable, setchkisDisable] = useState("NO");
  const [ticketCategoryTypeList, setTicketCategoryTypeList] = useState([]);
  const [isLoadingTicketCategoryTypeList, setIsTicketCategoryTypeList] = useState(false);
  const getTicketCategoryTypeListData = async (pselectedOption) => {
    try {
      setIsTicketCategoryTypeList(true);
      const formdata = {
        filterID: pselectedOption,
        filterID1: 0,
        masterName: "TCKTYP",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBinding(formdata);
      setIsTicketCategoryTypeList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          if (pselectedOption === "4") {
            const mappedData = result.response.responseData.masterdatabinding.map((value) => {
              return {
                SupportTicketTypeName:
                  value.SupportTicketTypeID === 13
                    ? `${value.SupportTicketTypeName}(Loss at individual farms)`
                    : value.SupportTicketTypeID === 14
                      ? `${value.SupportTicketTypeName}(Loss at multiple farms)`
                      : value.SupportTicketTypeName,
                SupportTicketTypeID: value.SupportTicketTypeID ? value.SupportTicketTypeID : "",
              };
            });
            setTicketCategoryTypeList(mappedData);
          } else {
            setTicketCategoryTypeList(result.response.responseData.masterdatabinding);
          }
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
  const getTicketCategoryListData = async (supportTicketTypeID) => {
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
      const result = await getMasterDataBinding(formdata);
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

  const updateFilterState = (name, value) => {
    setFilterValues({ ...filterValues, [name]: value });
    if (name === "txtTicketCategoryType") {
      setFilterValues({
        ...filterValues,
        txtTicketCategoryType: value,
        txtTicketCategory: null,
      });
      setTicketCategoryList([]);
      if (value) {
        getTicketCategoryListData(value.SupportTicketTypeID);
      }
    }

    if (name === "txtTicketType") {
      setFilterValues({
        ...filterValues,
        txtTicketType: value,
        txtTicketCategoryType: null,
        txtTicketCategory: null,
      });
      setTicketCategoryTypeList([]);
      setTicketCategoryList([]);
      getTicketCategoryTypeListData(value.TicketTypeID);
    }
  };

  const searchTicketListOnClick = async () => {
    debugger;
    try {
      if (filterValues.txtTicketType !== null) {
        if (filterValues.txtTicketType.TicketTypeID === "2") {
          setAlertMessage({
            type: "error",
            message: "Ticket status cant not be changed for Information ticket.",
          });
          return;
        }
      }
      if (filterValues.txtStatus === null) {
        setAlertMessage({
          type: "error",
          message: "Please select ticket status.",
        });
        return;
      }
      // A const formData = {
      // A  viewTYP: "LIST",
      // A  ticketCategoryID:
      // A    filterValues.txtTicketCategory && filterValues.txtTicketCategory.TicketCategoryID ? filterValues.txtTicketCategory.TicketCategoryID : 0,
      // A  supportTicketTypeID:
      // A    filterValues.txtTicketCategoryType && filterValues.txtTicketCategoryType.SupportTicketTypeID
      // A      ? filterValues.txtTicketCategoryType.SupportTicketTypeID
      // A      : 0,
      // A  statusID: filterValues.txtStatus && filterValues.txtStatus.CommonMasterValueID ? filterValues.txtStatus.CommonMasterValueID : 0,
      // A  ticketHeaderID: filterValues.txtTicketType && filterValues.txtTicketType.TicketTypeID ? filterValues.txtTicketType.TicketTypeID : 0,
      // A};
      const userData = getSessionStorage("user");
      const ChkBRHeadTypeID = userData && userData.BRHeadTypeID ? userData.BRHeadTypeID.toString() : "0";
      const ChkAppAccessTypeID = userData && userData.AppAccessTypeID ? userData.AppAccessTypeID.toString() : "0";
      
      const formData = {
        insuranceCompanyID: 0,
        viewTYP: "FILTER",
        stateID: "",
        districtID: "",
        supportTicketID: 0,
        ticketCategoryID:
          filterValues.txtTicketCategory && filterValues.txtTicketCategory.TicketCategoryID ? filterValues.txtTicketCategory.TicketCategoryID : 0,
        ticketSourceID: 0,
        supportTicketTypeID:
          filterValues.txtTicketCategoryType && filterValues.txtTicketCategoryType.SupportTicketTypeID
            ? filterValues.txtTicketCategoryType.SupportTicketTypeID
            : 0,
        supportTicketNo: "",
        applicationNo: "",
        statusID: filterValues.txtStatus && filterValues.txtStatus.CommonMasterValueID ? filterValues.txtStatus.CommonMasterValueID : 0,
        fromdate: "",
        toDate: "",
        RequestorMobileNo: "",
        schemeID: 0,
        ticketHeaderID: filterValues.txtTicketType && filterValues.txtTicketType.TicketTypeID ? filterValues.txtTicketType.TicketTypeID : 0,
        pageIndex: 1,
        pageSize: 1000,
      };
      setIsLoadingFarmersticket(true);
      // A const result = await getBulkTicketsList(formData);
      // A const result = await getfarmerTicketsListPagging(formData);
      let result = [];
            if (ChkBRHeadTypeID === "124003" && ChkAppAccessTypeID === "503") {
              result = await getAssignedTicketList(formData);
            } else {
              result = await getfarmerTicketsListPagging(formData);
            }
      setIsLoadingFarmersticket(false);
      let totalStsCnt = 0;
      const jsonStatusCnt = { Open: "0", InProgress: "0", Resolved: "0", ResolvedInformation: "0", ReOpen: "0" };
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.supportTicket && result.responseData.status) {
          setFarmersTicketData(result.responseData.supportTicket);
          setchkisDisable("NO");
          if (gridApi) {
            gridApi.forEachNode(function (rowNode) {
              rowNode.setSelected(false);
            });
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
            if (v.TicketStatus === "Resolved") {
              jsonStatusCnt.Resolved = v.Total;
            }
            if (v.TicketStatus === "Resolved(Information)") {
              jsonStatusCnt.ResolvedInformation = v.Total;
            }
            totalStsCnt += Number(v.Total);
          });
          settotalSatatusCount(totalStsCnt.toString());
          setSatatusCount([jsonStatusCnt]);
        } else {
          settotalSatatusCount(totalStsCnt.toString());
          setSatatusCount([jsonStatusCnt]);
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
        settotalSatatusCount(totalStsCnt.toString());
        setSatatusCount([jsonStatusCnt]);
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const [ticketStatusList, setTicketStatusList] = useState([]);
  const [isLoadingTicketStatusList, setIsTicketStatusList] = useState(false);
  const getTicketStatusListData = async () => {
    try {
      setTicketStatusList([]);
      setIsTicketStatusList(true);
      const formdata = {
        filterID: 109,
        filterID1: 0,
        masterName: "COMMVAL",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBinding(formdata);
      setIsTicketStatusList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setTicketStatusList(result.response.responseData.masterdatabinding);
        } else {
          setTicketStatusList([]);
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

  return {
    farmersTicketData,
    setFarmersTicketData,
    isLoadingFarmersticket,
    ticketCategoryList,
    isLoadingTicketCategoryList,
    ticketCategoryTypeList,
    isLoadingTicketCategoryTypeList,
    getTicketCategoryListData,
    getTicketCategoryTypeListData,
    getTicketStatusListData,
    ticketStatusList,
    isLoadingTicketStatusList,
    updateFilterState,
    searchTicketListOnClick,
    satatusCount,
    totalSatatusCount,
    filterValues,
    setFilterValues,
    onGridReady,
    gridApi,
    chkisDisable,
    setchkisDisable,
    setSatatusCount,
    settotalSatatusCount,
    setFarmersTicketData,
  };
}

export default ReplyOnMultipleTicketsLogics;
