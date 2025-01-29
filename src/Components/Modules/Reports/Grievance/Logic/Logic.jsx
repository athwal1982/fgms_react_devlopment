import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useState } from "react";
import { dateToCompanyFormat, dateFormatDefault, dateToSpecificFormat, daysdifference } from "Configration/Utilities/dateformat";
import moment from "moment";
import { getMasterDataBinding } from "../../../Support/ManageTicket/Services/Methods";
import { getSupportTicketCategoryReport, getSupportTicketCategoryReportMongo } from "../Services/Methods";

function GrievanceReportLogics() {
  const [formValues, setFormValues] = useState({
    txtTicketCategory: null,
    txtTicketCategoryType: null,
    txtFromDate: dateToSpecificFormat(moment().subtract(1, "days"), "YYYY-MM-DD"),
    txtToDate: dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD"),
  });

  const [grievanceReportDataList, setGrievanceReportDataList] = useState(false);
  const [filteredGrievanceReportDataList, setFilteredGrievanceReportDataList] = useState([]);
  const [isLoadingGrievanceReportDataList, setLoadingGrievanceReportDataList] = useState(false);
  const setAlertMessage = AlertMessage();

  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
    console.log(params.api);
    setGridApi(params.api);
  };

  const [grievanceReportListItemSearch, setGrievanceReporListItemSearch] = useState("");
  const onChangeGrievanceReportList = (val) => {
    setGrievanceReporListItemSearch(val);
    gridApi.setQuickFilter(val);
  };

  const getGrievanceReportData = async (pType) => {
    try {
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
      const dateDiffrence = daysdifference(dateFormatDefault(formValues.txtFromDate), dateFormatDefault(formValues.txtToDate));
      if (dateDiffrence > 31) {
        setAlertMessage({
          type: "error",
          message: "1 month date range is allowed only",
        });
        return;
      }
      setLoadingGrievanceReportDataList(true);

      const formData = {
        insuranceCompanyID: 0,
        stateID: 0,
        ticketCategoryID: formValues.txtTicketCategory && formValues.txtTicketCategory.TicketCategoryID ? formValues.txtTicketCategory.TicketCategoryID : 0,
        supportTicketTypeID:
          formValues.txtTicketCategoryType && formValues.txtTicketCategoryType.SupportTicketTypeID ? formValues.txtTicketCategoryType.SupportTicketTypeID : 0,
        fromdate: formValues.txtFromDate ? dateToCompanyFormat(formValues.txtFromDate) : "",
        toDate: formValues.txtToDate ? dateToCompanyFormat(formValues.txtToDate) : "",
        ticketHeaderID: 1,
      };
      let result = [];
      if (pType === "MONGO") {
        result = await getSupportTicketCategoryReportMongo(formData);
      } else {
        result = await getSupportTicketCategoryReport(formData);
      }
      setLoadingGrievanceReportDataList(false);
      if (result.responseCode === 1) {
        if (grievanceReportListItemSearch && grievanceReportListItemSearch.toLowerCase().includes("#")) {
          onChangeGrievanceReportList("");
        }
        setGrievanceReportDataList(result.responseData.supportTicket);
        setFilteredGrievanceReportDataList(result.responseData.supportTicket);
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

  const updateState = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
    if (name === "txtTicketCategoryType") {
      setFormValues({
        ...formValues,
        txtTicketCategoryType: value,
        txtTicketCategory: null,
      });
      setTicketCategoryList([]);
      if (value) {
        getTicketCategoryListData(value.SupportTicketTypeID);
      }
    }
  };

  const getGrievanceReportsList = (pType) => {
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
    getGrievanceReportData(pType);
  };

  const onClickClearSearchFilter = () => {
    setFormValues({
      ...formValues,
      txtTicketCategory: null,
      txtTicketCategoryType: null,
      txtFromDate: "",
      txtToDate: "",
    });
    setTicketCategoryList([]);
  };

  const exportClick = () => {
    const excelParams = {
      fileName: "GrievanceReport",
    };
    gridApi.exportDataAsExcel(excelParams);
  };

  return {
    grievanceReportDataList,
    filteredGrievanceReportDataList,
    isLoadingGrievanceReportDataList,
    gridApi,
    onGridReady,
    onChangeGrievanceReportList,
    grievanceReportListItemSearch,
    getGrievanceReportsList,
    ticketCategoryList,
    isLoadingTicketCategoryList,
    formValues,
    updateState,
    ticketCategoryTypeList,
    isLoadingTicketCategoryTypeList,
    isLoadingGrievanceReportDataList,
    getTicketCategoryTypeListData,
    onClickClearSearchFilter,
    exportClick,
  };
}

export default GrievanceReportLogics;
