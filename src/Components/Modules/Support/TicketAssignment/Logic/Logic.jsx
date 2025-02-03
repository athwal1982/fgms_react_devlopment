import { useState, useEffect } from "react";
import { useId } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import {
  getMasterDataBinding,
  getBulkTicketsList,
  getUserListBinding,
  getUserTicketAssign,
  getUserWiseTicketList,
  getUassignedTicketList,
} from "../Services/Methods";
import { dateFormatDefault, daysdifference, dateToSpecificFormat } from "Configration/Utilities/dateformat";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import moment from "moment";

function TicketAssignmentLogics() {
  const setAlertMessage = AlertMessage();
  const id = useId();
  console.log("This is the UseHook ID : " + id);

  const [ticketCategoryTypeList, setTicketCategoryTypeList] = useState([]);
  const [isLoadingTicketCategoryTypeList, setIsTicketCategoryTypeList] = useState(false);

  const [filterValues, setFilterValues] = useState({
    txtFromDate: dateToSpecificFormat(moment().subtract(1, "days"), "YYYY-MM-DD"),
    txtToDate: dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD"),
    txtState: null,
    txtTicketType: null,
    txtTicketCategory: null,
    txtTicketCategoryType: null,
    txtStatus: null,
  });

  const [gridApiTicket, setGridApiTicket] = useState();
  const [gridReadyTicketCount, setGridReadyTicketCount] = useState();
  const [gridApiUser, setGridApiUser] = useState();

  const [isLoadingUserList, setLoadingUserList] = useState(false);
  const [UserList, setUserList] = useState([]);

  const [isLoadingUserTicketList, setLoadingUserTicketList] = useState(false);
  const [UserTicketList, setUserTicketList] = useState([]);

  const [isLoadingSearchTickets, setLoadingSearchTickets] = useState(false);
  const [SearchTickets, setSearchTickets] = useState([]);

  const [ticketCategoryList, setTicketCategoryList] = useState([]);
  const [isLoadingTicketCategoryList, setIsTicketCategoryList] = useState(false);

  const [isLoadingFarmersticket, setIsLoadingFarmersticket] = useState(false);
  const [totalStatusCount, setTotalStatusCount] = useState("0");
  const [statusCount, setStatusCount] = useState([]);

  const [selectedTickets, setSelectedTickets] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [isLoadingTicketAssignment, setIsLoadingTicketAssignment] = useState(false);

  useEffect(() => {
    debugger;
    getStateListData();
  }, []);

  const [TicketAssignmentModalList, setTicketAssignmentModalList] = useState("");
  const onChangeTicketAssignmentModalList = (val) => {
    debugger;
    setTicketAssignmentModalList(val);
    gridReadyTicketCount.setQuickFilter(val);
  };

  const onGridReadyTicket = (params) => {
    setGridApiTicket(params.api);
  };

  const onGridReadyTicketCount = (params) => {
    setGridReadyTicketCount(params.api);
  };

  const onGridReadyUser = (params) => {
    setGridApiUser(params.api);
  };

  const updateUserTicketCount = (userIds, Ticketlength) => {
    debugger;
    setUserList((prevList) =>
      prevList.map((user) => (userIds.includes(user.AppAccessID) ? { ...user, ticketcount: (user.ticketcount || 0) + Ticketlength } : user)),
    );
  };

  const handleAssignTickets = async () => {
    debugger;
    try {
      const fetchTicket = getSelectedRowDataTicket();
      const fetchUser = getSelectedRowDataUser();

      if (fetchTicket.length === 0) {
        setAlertMessage({
          type: "error",
          message: "Please select at least one ticket.",
        });
        return;
      }

      if (fetchUser.length === 0) {
        setAlertMessage({
          type: "error",
          message: "Please select at least one user.",
        });
        return;
      }
      if (fetchTicket.length > 100) {
        setAlertMessage({
          type: "error",
          message: "You can only assign up to 100 tickets at once.",
        });
        return;
      }

      const ticketIds = fetchTicket.map((data) => data.SupportTicketID).join(",");
      const userIds = fetchUser.map((data) => data.AppAccessID);
      const Ticketlength = fetchTicket.length;

      const userData = getSessionStorage("user");

      if (!userData) {
        throw new Error("User data is missing or invalid.");
      }

      const formdata = {
        viewMode: "ASSIGN",
        AppAccessId: fetchUser[0].AppAccessID,
        InsuranceCompanyId: fetchUser[0].InsuranceCompanyID,
        supportTickets: ticketIds,
      };

      const result = await getUserTicketAssign(formdata);

      if (result.responseCode === 1) {
        updateUserTicketCount(userIds, Ticketlength);

        const UpdatedCount = ticketCount - Ticketlength;

        setTicketCount(UpdatedCount);

        setSearchTickets((prevTickets) => prevTickets.filter((ticket) => !ticketIds.includes(ticket.SupportTicketID)));

        setAlertMessage({
          type: "success",
          message: "Tickets successfully assigned.",
        });
      } else {
        setAlertMessage({
          type: "error",
          message: result.responseMessage || "An error occurred while assigning tickets.",
        });
      }
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: error.message || "An unexpected error occurred.",
      });
    }
  };

  const getSelectedRowDataTicket = () => {
    const selectedNodes = gridApiTicket.getSelectedNodes();
    return selectedNodes.map((node) => node.data);
  };

  const getSelectedRowDataUser = () => {
    const selectedNodes = gridApiUser.getSelectedNodes();
    return selectedNodes.map((node) => node.data);
  };

  const getUserWiseTicketLister = async (AppAccessId) => {
    debugger;
    try {
      setLoadingUserTicketList(true);
      setIsLoadingTicketAssignment(true);
      const formdata = {
        userId: AppAccessId,
        pageSize: 1000000,
        skip: 0,
      };
      const result = await getUserWiseTicketList(formdata);
      setIsLoadingTicketAssignment(false);
      if (result.responseCode === 1) {
        if (TicketAssignmentModalList.includes("#")) {
          setTicketAssignmentModalList("");
        }
        if (TicketAssignmentModalList && TicketAssignmentModalList.toLowerCase().includes("#")) {
          onChangeTicketAssignmentModalList("");
        }

        return result.responseData.ticketList || [];
      } else {
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: error.message || "An error occurred.",
      });
    } finally {
      setLoadingUserTicketList(false);
    }
  };

  const getUserList = async () => {
    try {
      setLoadingUserList(true);
      // A const userData = getSessionStorage("user");
      const formdata = {
        insuranceCompanyID: 0,
        viewTYP: "User",
        stateID: filterValues.txtState && filterValues.txtState.StateMasterID ? filterValues.txtState.StateMasterID.toString() : "0",
        supportTicketID: 0,
        ticketCategoryID: filterValues.txtTicketCategory?.TicketCategoryID ?? 0,
        ticketSourceID: 0,
        supportTicketTypeID: filterValues.txtTicketCategoryType?.SupportTicketTypeID ?? 0,
        supportTicketNo: "",
        statusID: 0,
        fromdate: "",
        toDate: "",
        RequestorMobileNo: "",
        schemeID: 0,
        ticketHeaderID: filterValues.txtTicketType?.TicketTypeID ?? 0,
        pageIndex: 0,
        pageSize: 0,
      };
      const result = await getUserListBinding(formdata);

      if (result.responseCode === 1) {
        setUserList(result.responseData?.ticketList || []);
      } else {
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: error.message || "An error occurred.",
      });
    } finally {
      setLoadingUserList(false);
    }
  };

  const onSearchTickets = async () => {
    debugger;
    try {
      const dateDiffrence = daysdifference(dateFormatDefault(filterValues.txtFromDate), dateFormatDefault(filterValues.txtToDate));
      if (dateDiffrence > 31) {
        setAlertMessage({
          type: "error",
          message: "1 month date range is allowed only",
        });
        return;
      }
      if (filterValues.stateID === null) {
        setAlertMessage({
          type: "error",
          message: "State is Required !",
        });
        return;
      }

      setLoadingSearchTickets(true);

      getUserList();

      const formdata = {
        insuranceCompanyID: 0,
        viewTYP: "Detail",
        stateID: filterValues.txtState && filterValues.txtState.StateMasterID ? filterValues.txtState.StateMasterID.toString() : "0",
        supportTicketID: 0,
        ticketCategoryID: filterValues.txtTicketCategory?.TicketCategoryID ?? 0,
        ticketSourceID: 0,
        supportTicketTypeID: filterValues.txtTicketCategoryType?.SupportTicketTypeID ?? 0,
        supportTicketNo: "",
        statusID: 0,
        fromdate: "",
        toDate: "",
        RequestorMobileNo: "",
        schemeID: 0,
        ticketHeaderID: filterValues.txtTicketType?.TicketTypeID ?? 0,
        pageIndex: 0,
        pageSize: 100,
      };

      const result = await getUassignedTicketList(formdata);

      if (result.responseCode === 1) {
        setSearchTickets(result.responseData?.ticketList || []);
      } else {
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: error.message || "An error occurred.",
      });
    } finally {
      setLoadingSearchTickets(false);
    }
  };

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
      if (result.response.responseCode === 1) {
        const mappedData =
          pselectedOption === "4"
            ? result.response.responseData.masterdatabinding.map((value) => ({
                SupportTicketTypeName:
                  value.SupportTicketTypeID === 13
                    ? `${value.SupportTicketTypeName}(Loss at individual farms)`
                    : value.SupportTicketTypeID === 14
                    ? `${value.SupportTicketTypeName}(Loss at multiple farms)`
                    : value.SupportTicketTypeName,
                SupportTicketTypeID: value.SupportTicketTypeID || "",
              }))
            : result.response.responseData.masterdatabinding;

        setTicketCategoryTypeList(mappedData);
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: error.message || "An error occurred.",
      });
    } finally {
      setIsTicketCategoryTypeList(false);
    }
  };

  const getTicketCategoryListData = async (supportTicketTypeID) => {
    try {
      setIsTicketCategoryList(true);
      const formdata = {
        filterID: supportTicketTypeID,
        filterID1: 0,
        masterName: "TCKCGZ",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBinding(formdata);
      if (result.response.responseCode === 1) {
        setTicketCategoryList(result.response.responseData?.masterdatabinding || []);
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: error.message || "An error occurred.",
      });
    } finally {
      setIsTicketCategoryList(false);
    }
  };

  const [stateList, setStateList] = useState([]);
  const [ticketCount, setTicketCount] = useState();
  const [isLoadingStateList, setIsLoadingStateList] = useState(false);
  const getStateListData = async () => {
    debugger;
    try {
      setStateList([]);
      setIsLoadingStateList(true);

      const formdata = {
        insuranceCompanyID: 0,
        viewTYP: "State",
        stateID: filterValues.txtState && filterValues.txtState.StateMasterID ? filterValues.txtState.StateMasterID.toString() : "0",
        supportTicketID: 0,
        ticketCategoryID: filterValues.txtTicketCategory?.TicketCategoryID ?? 0,
        ticketSourceID: 0,
        supportTicketTypeID: filterValues.txtTicketCategoryType?.SupportTicketTypeID ?? 0,
        supportTicketNo: "",
        statusID: 0,
        fromdate: "",
        toDate: "",
        RequestorMobileNo: "",
        schemeID: 0,
        ticketHeaderID: filterValues.txtTicketType?.TicketTypeID ?? 0,
        pageIndex: 0,
        pageSize: 0,
      };
      const result = await getUassignedTicketList(formdata);
      console.log(result, "State Data");
      setIsLoadingStateList(false);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.ticketList && result.responseData.ticketList.length > 0) {
          setStateList(result.responseData.ticketList);
        } else {
          setStateList([]);
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
    debugger;

    setFilterValues((prevValues) => {
      const updatedValues = { ...prevValues, [name]: value };

      const resetLists = () => {
        setTicketCategoryList([]);
        setTicketCategoryTypeList([]);
      };

      if (name === "txtTicketCategoryType") {
        updatedValues.txtTicketCategory = null;
        resetLists();
        if (value) {
          getTicketCategoryListData(value.SupportTicketTypeID);
        }
      }

      if (name === "txtTicketType") {
        updatedValues.txtTicketCategoryType = null;
        updatedValues.txtTicketCategory = null;
        resetLists();
        if (value) {
          getTicketCategoryTypeListData(value.TicketTypeID);
        }
      }

      if (name === "txtState") {
        setFilterValues({
          ...filterValues,
          txtState: value,
        });
        if (value) {
          setTicketCount(value.TotalCount);
        } else {
          setTicketCount(0);
        }
      }

      return updatedValues;
    });
  };

  const searchTicketListOnClick = async () => {
    try {
      if (filterValues.txtTicketType?.TicketTypeID === "2") {
        setAlertMessage({
          type: "error",
          message: "Ticket status cannot be changed for Information ticket.",
        });
        return;
      }

      if (!filterValues.txtStatus) {
        setAlertMessage({
          type: "error",
          message: "Please select ticket status.",
        });
        return;
      }

      const formData = {
        viewTYP: "LIST",
        ticketCategoryID: filterValues.txtTicketCategory?.TicketCategoryID || 0,
        supportTicketTypeID: filterValues.txtTicketCategoryType?.SupportTicketTypeID || 0,
        statusID: filterValues.txtStatus?.CommonMasterValueID || 0,
        ticketHeaderID: filterValues.txtTicketType?.TicketTypeID || 0,
      };

      setIsLoadingFarmersticket(true);
      const result = await getBulkTicketsList(formData);
      if (result.responseCode === 1) {
        const jsonStatusCount = { Open: "0", InProgress: "0", Resolved: "0", ResolvedInformation: "0", ReOpen: "0" };
        let totalStsCnt = 0;

        if (result.responseData?.supportTicket && result.responseData?.status) {
          setFarmersTicketData(result.responseData.supportTicket);
          setChkIsDisable("NO");
          gridApi?.forEachNode((rowNode) => rowNode.setSelected(false));

          result.responseData.status.forEach((v) => {
            const { TicketStatus, Total } = v;
            if (jsonStatusCount[TicketStatus] !== undefined) {
              jsonStatusCount[TicketStatus] = Total;
              totalStsCnt += Number(Total);
            }
          });

          setTotalStatusCount(totalStsCnt.toString());
          setStatusCount([jsonStatusCount]);
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: error.message || "An error occurred.",
      });
    } finally {
      setIsLoadingFarmersticket(false);
    }
  };

  return {
    onGridReadyTicket,
    ticketCount,
    onGridReadyUser,
    updateFilterState,
    stateList,
    isLoadingStateList,
    ticketCategoryTypeList,
    isLoadingTicketCategoryTypeList,
    ticketCategoryList,
    isLoadingTicketCategoryList,
    searchTicketListOnClick,
    filterValues,
    isLoadingUserList,
    totalStatusCount,
    UserList,
    onSearchTickets,
    SearchTickets,
    isLoadingSearchTickets,
    handleAssignTickets,
    setSelectedTickets,
    setSelectedUser,
    getUserWiseTicketLister,
    UserTicketList,
    isLoadingUserTicketList,
    isLoadingTicketAssignment,
    TicketAssignmentModalList,
    setTicketAssignmentModalList,
    onGridReadyTicketCount,
    onChangeTicketAssignmentModalList,
  };
}

export default TicketAssignmentLogics;
