import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useState } from "react";
import moment from "moment";
import { dateToCompanyFormat, dateToSpecificFormat, dateFormatDefault, daysdifference } from "Configration/Utilities/dateformat";
import * as XLSX from "xlsx";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { getSupportTicketHistoryReport } from "../Services/Methods";
import { getMasterDataBinding } from "../../../Support/ManageTicket/Services/Methods";

function TicketStatusHistoryLogics() {
  const [formValues, setFormValues] = useState({
    txtFromDate: dateToSpecificFormat(moment().subtract(1, "days"), "YYYY-MM-DD"),
    txtToDate: dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD"),
    txtInsuranceCompany: null,
    txtState: null,
  });

  const [ticketStatusDataList, setTicketStatusDataList] = useState(false);
  const [filteredTicketStatusDataList, setFilteredTicketStatusDataList] = useState([]);
  const [isLoadingTicketStatusDataList, setLoadingTicketStatusDataList] = useState(false);
  const setAlertMessage = AlertMessage();

  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
    console.log(params.api);
    setGridApi(params.api);
  };

  const [ticketStatusListItemSearch, setTicketStatusListItemSearch] = useState("");
  const onChangeTicketStatusList = (val) => {
    debugger;
    setTicketStatusListItemSearch(val);
    gridApi.setQuickFilter(val);
  };

  const [insuranceCompanyList, setInsuranceCompanyList] = useState([]);
  const [isLoadingInsuranceCompanyList, setIsLoadingInsuranceCompanyList] = useState(false);
  const getInsuranceCompanyListData = async () => {
    try {
      setInsuranceCompanyList([]);
      setIsLoadingInsuranceCompanyList(true);
      const userData = getSessionStorage("user");
      const formdata = {
        filterID: userData && userData.LoginID ? userData.LoginID : 0,
        filterID1: 0,
        masterName: "INSURASIGN",
        searchText: "#ALL",
        searchCriteria: "",
      };
      const result = await getMasterDataBinding(formdata);
      console.log(result, "Insurance Company");
      setIsLoadingInsuranceCompanyList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setInsuranceCompanyList(result.response.responseData.masterdatabinding);
        } else {
          setInsuranceCompanyList([]);
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

  const [stateList, setStateList] = useState([]);
  const [isLoadingStateList, setIsLoadingStateList] = useState(false);
  const getStateListData = async () => {
    try {
      setStateList([]);
      setIsLoadingStateList(true);
      const userData = getSessionStorage("user");
      const formdata = {
        filterID: userData && userData.LoginID ? userData.LoginID : 0,
        filterID1: 0,
        masterName: "STATASIGN",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBinding(formdata);
      console.log(result, "State Data");
      setIsLoadingStateList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setStateList(result.response.responseData.masterdatabinding);
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

  const downloadExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    worksheet["!cols"] = [
      { width: 20 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 12 },
      { width: 25 },
      { width: 25 },
      { width: 20 },
      { width: 25 },
      { width: 30 },
      { width: 10 },
    ];
    XLSX.writeFile(workbook, "Ticket_Status_History.xlsx");
  };

  const rearrangeAndRenameColumns = (originalData, columnMapping) => {
    return originalData.map((item) => {
      const rearrangedItem = Object.fromEntries(Object.entries(columnMapping).map(([oldColumnName, newColumnName]) => [newColumnName, item[oldColumnName]]));
      return rearrangedItem;
    });
  };

  const getTicketStatusData = async () => {
    debugger;
    try {
      const dateDiffrence = daysdifference(dateFormatDefault(formValues.txtFromDate), dateFormatDefault(formValues.txtToDate));
      if (dateDiffrence > 31) {
        setAlertMessage({
          type: "error",
          message: "1 month date range is allowed only",
        });
        return;
      }
      setLoadingTicketStatusDataList(true);

      const formData = {
        ticketHeaderID: 0,
        supportTicketTypeID: 0,
        ticketCategoryID: 0,
        insuranceCompanyID:
          formValues.txtInsuranceCompany && formValues.txtInsuranceCompany.CompanyID ? formValues.txtInsuranceCompany.CompanyID.toString() : "#ALL",
        stateID: formValues.txtState && formValues.txtState.StateMasterID ? formValues.txtState.StateMasterID.toString() : "#ALL",
        fromdate: formValues.txtFromDate ? dateToCompanyFormat(formValues.txtFromDate) : "",
        toDate: formValues.txtToDate ? dateToCompanyFormat(formValues.txtToDate) : "",
      };
      const result = await getSupportTicketHistoryReport(formData);
      setLoadingTicketStatusDataList(false);
      if (result.responseCode === 1) {
        if (ticketStatusListItemSearch && ticketStatusListItemSearch.toLowerCase().includes("#")) {
          onChangeTicketStatusList("");
        }
        setTicketStatusDataList(result.responseData.supportTicket);
        setFilteredTicketStatusDataList(result.responseData.supportTicket);
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

  const updateState = (name, value) => {
    debugger;
    setFormValues({ ...formValues, [name]: value });
  };

  const getTicketStatusList = () => {
    if (formValues.txtFromDate) {
      if (formValues.txtToDate) {
        if (formValues.txtFromDate > formValues.txtToDate) {
          setAlertMessage({
            type: "warning",
            message: "From date must be less than To Date",
          });
          return;
        }
      } else {
        setAlertMessage({
          type: "warning",
          message: "Please select To Date",
        });
        return;
      }
    }
    getTicketStatusData();
  };

  const onClickClearSearchFilter = () => {
    setFormValues({
      ...formValues,
      txtFromDate: "",
      txtToDate: "",
    });
  };

  const exportClick = () => {
    debugger;
    if (ticketStatusDataList.length === 0) {
      setAlertMessage({
        type: "error",
        message: "Data not found to download.",
      });
      return;
    }
    const columnOrder = {
      SupportTicketNo: "Ticket No",
      OPEN: "Open Date",
      Inprogress: "In-Progress",
      Resolved: "Resolved",
      ReOpen: "Re-Open",
      Inprogress1: "In-Progress - 1",
      Resolved1: "Resolved - 1",
      ReOpen1: "Re-Open - 1",
      Inprogress2: "In-Progress - 2",
      Resolved2: "Resolved - 2",
      ReOpen2: "Re-Open - 2",
    };
    const mappedData = ticketStatusDataList.map((value) => {
      return {
        SupportTicketNo: value.SupportTicketNo,
        OPEN: value.OPEN ? dateToSpecificFormat(value.OPEN.split("T")[0], "DD-MM-YYYY") : "",
        Inprogress: value.Inprogress ? dateToSpecificFormat(value.Inprogress.split("T")[0], "DD-MM-YYYY") : "",
        Resolved: value.Resolved ? dateToSpecificFormat(value.Resolved.split("T")[0], "DD-MM-YYYY") : "",
        ReOpen: value.ReOpen ? dateToSpecificFormat(value.ReOpen.split("T")[0], "DD-MM-YYYY") : "",
        Inprogress1: value.Inprogress1 ? dateToSpecificFormat(value.Inprogress1.split("T")[0], "DD-MM-YYYY") : "",
        Resolved1: value.Resolved1 ? dateToSpecificFormat(value.Resolved1.split("T")[0], "DD-MM-YYYY") : "",
        ReOpen1: value.ReOpen1 ? dateToSpecificFormat(value.ReOpen1.split("T")[0], "DD-MM-YYYY") : "",
        Inprogress2: value.Inprogress2 ? dateToSpecificFormat(value.Inprogress2.split("T")[0], "DD-MM-YYYY") : "",
        Resolved2: value.Resolved2 ? dateToSpecificFormat(value.Resolved2.split("T")[0], "DD-MM-YYYY") : "",
        ReOpen2: value.ReOpen2 ? dateToSpecificFormat(value.ReOpen2.split("T")[0], "DD-MM-YYYY") : "",
      };
    });

    const finalData = rearrangeAndRenameColumns(mappedData, columnOrder);

    downloadExcel(finalData);
  };

  return {
    getTicketStatusList,
    exportClick,
    onClickClearSearchFilter,
    formValues,
    updateState,
    ticketStatusDataList,
    filteredTicketStatusDataList,
    isLoadingTicketStatusDataList,
    isLoadingInsuranceCompanyList,
    getInsuranceCompanyListData,
    insuranceCompanyList,
    isLoadingStateList,
    getStateListData,
    stateList,
    ticketStatusListItemSearch,
    onChangeTicketStatusList,
    onGridReady,
  };
}

export default TicketStatusHistoryLogics;
