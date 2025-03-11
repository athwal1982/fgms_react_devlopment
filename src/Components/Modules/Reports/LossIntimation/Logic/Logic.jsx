import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useState, useEffect } from "react";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { dateToCompanyFormat, dateToSpecificFormat, dateFormatDefault, daysdifference } from "Configration/Utilities/dateformat";
import moment from "moment";
import { getMasterDataBinding } from "../../../Support/ManageTicket/Services/Methods";
import { getSupportTicketCategoryReport } from "../Services/Methods";

function LossIntimationReportLogics() {
  const [formValues, setFormValues] = useState({
    txtCropStageData: null,
    txtLossAt: null,
    txtTicketCategoryType: null,
    txtTicketCategory: null,
    txtFromDate: dateToSpecificFormat(moment().subtract(1, "days"), "YYYY-MM-DD"),
    txtToDate: dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD"),
  });

  const [grievanceReportDataList, setGrievanceReportDataList] = useState(false);
  const [filteredGrievanceReportDataList, setFilteredGrievanceReportDataList] = useState([]);
  const [isLoadingGrievanceReportDataList, setLoadingGrievanceReportDataList] = useState(false);
  const setAlertMessage = AlertMessage();

   const ticketBindingData = getSessionStorage("ticketDataBindingSsnStrg");
   const [cropStageData] = useState([{lable: " Standing Crop Stage", value:"1"},{lable: "Harvested Stage", value:"1"}]);

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

  const getGrievanceReportData = async () => {
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
        cropLossDetailID: formValues.txtLossAt && formValues.txtLossAt.CropLossDetailID ? formValues.txtLossAt.CropLossDetailID : 0,
        ticketCategoryID: formValues.txtTicketCategory && formValues.txtTicketCategory.TicketCategoryID ? formValues.txtTicketCategory.TicketCategoryID : 0,
        supportTicketTypeID: formValues.txtTicketCategoryType && formValues.txtTicketCategoryType.SupportTicketTypeID ? formValues.txtTicketCategoryType.SupportTicketTypeID : 0,
        fromdate: formValues.txtFromDate ? dateToCompanyFormat(formValues.txtFromDate) : "",
        toDate: formValues.txtToDate ? dateToCompanyFormat(formValues.txtToDate) : "",
        ticketHeaderID: 4,
      };
      const result = await getSupportTicketCategoryReport(formData);
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
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };
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
  const getTicketCategoryListData = async (supportTicketTypeID) => {
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
      // AsetIsTicketCategoryList(true);
      // A const formdata = {
      // A  filterID: 4,
      // A  filterID1: 0,
      // A  masterName: "CRPTCKTYP",
      // A  searchText: "#ALL",
      // A  searchCriteria: "AW",
      // A };
      // A const result = await getMasterDataBinding(formdata);
      // A console.log(result, "ticketCategory");
      // A setIsTicketCategoryList(false);
      // A if (result.response.responseCode === 1) {
      // A if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
      // A    setTicketCategoryList(result.response.responseData.masterdatabinding);
      // A } else {
      // A    setTicketCategoryList([]);
      // A  }
      // A } else {
      // A  setAlertMessage({
      // A    type: "error",
      // A    message: result.response.responseMessage,
      // A  });
      // A }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: "Something went Wrong! Error Code : 442",
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

  const updateState = (name, value) => {
    debugger;
    setFormValues({ ...formValues, [name]: value });
    if (name === "txtCropStageData") {
      setFormValues({
        ...formValues,
        txtCropStageData: value,
        txtLossAt: null,
        txtTicketCategoryType: null,
        txtTicketCategory: null,
      });
      if (value) {
        if (value.value === "1") {
          // A getCropStageListData(1);
          getLossAtListData(1);
        } else if (value.value === "2") {
          // A getCropStageListData(2);
          getLossAtListData(2);
        }
      }
    }
    if (name === "txtTicketCategoryType") {
      setFormValues({
        ...formValues,
        txtTicketCategoryType: value,
        txtTicketCategory: null,
      });
      setTicketCategoryList([]);
      if (value) {
        getTicketCategoryListData(value.SupportTicketTypeID, value);
      }
    }

    if (name === "txtLossAt") {
      setFormValues({
        ...formValues,
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
  };

  const getGrievanceReportsList = () => {
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
    getGrievanceReportData();
  };

  const onClickClearSearchFilter = () => {
    setFormValues({
      ...formValues,
      txtCropStageData: null,
      txtLossAt: null,
      txtTicketCategoryType: null,
      txtTicketCategory: null,
      txtFromDate: "",
      txtToDate: "",
    });
    setTicketCategoryList([]);
    setTicketCategoryTypeList([]);
    setLossAtList([]);
  };

  const exportClick = () => {
    const excelParams = {
      fileName: "LossIntimationStatusReport",
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
    isLoadingGrievanceReportDataList,
    onClickClearSearchFilter,
    exportClick,
    ticketCategoryTypeList,
    cropStageData,
    lossAtList,
  };
}

export default LossIntimationReportLogics;
