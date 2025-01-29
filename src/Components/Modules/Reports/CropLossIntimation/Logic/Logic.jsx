import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useState } from "react";
import { dateToCompanyFormat, dateToSpecificFormat, Convert24FourHourAndMinute, dateFormatDefault, daysdifference } from "Configration/Utilities/dateformat";
import moment from "moment";
import * as XLSX from "xlsx";
import { getMasterDataBinding } from "../../../Support/ManageTicket/Services/Methods";
import { getSupportTicketCropLossView } from "../Services/Methods";

function CropLossIntimationReportLogics() {
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

  const getGrievanceReportData = async () => {
    debugger;
    try {
      setLoadingGrievanceReportDataList(true);

      const formData = {
        stateID: "",
        viewTYP: "FILTER",
        supportTicketID: 0,
        ticketCategoryID: formValues.txtTicketCategory && formValues.txtTicketCategory.TicketCategoryID ? formValues.txtTicketCategory.TicketCategoryID : 0,
        supportTicketTypeID:
          formValues.txtTicketCategoryType && formValues.txtTicketCategoryType.SupportTicketTypeID ? formValues.txtTicketCategoryType.SupportTicketTypeID : 0,
        supportTicketNo: "",
        statusID: 0,
        requestorMobileNo: "",
        fromdate: formValues.txtFromDate ? dateToCompanyFormat(formValues.txtFromDate) : "",
        toDate: formValues.txtToDate ? dateToCompanyFormat(formValues.txtToDate) : "",
      };
      const result = await getSupportTicketCropLossView(formData);
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
        message: "Something went Wrong! Error Code : 442",
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
    const dateDiffrence = daysdifference(dateFormatDefault(formValues.txtFromDate), dateFormatDefault(formValues.txtToDate));
    if (dateDiffrence > 31) {
      setAlertMessage({
        type: "error",
        message: "1 month date range is allowed only",
      });
      return;
    }
    getGrievanceReportData();
  };

  const onClickClearSearchFilter = () => {
    setFormValues({
      ...formValues,
      txtTicketCategory: null,
      txtFromDate: "",
      txtToDate: "",
    });
    setTicketCategoryList([]);
  };

  const downloadExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    // A let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    // A XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    worksheet["!cols"] = [
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 25 },
      { width: 26 },
      { width: 12 },
      { width: 30 },
      { width: 12 },
      { width: 20 },
      { width: 25 },
      { width: 25 },
      { width: 20 },
      { width: 25 },
      { width: 40 },
      { width: 18 },
      { width: 22 },
      { width: 22 },
      { width: 40 },
      { width: 18 },
      { width: 50 },
      { width: 15 },
      { width: 15 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 15 },
      { width: 30 },
      { width: 22 },
      { width: 20 },
    ];
    XLSX.writeFile(workbook, "Loss_Intimation.xlsx");
  };

  const rearrangeAndRenameColumns = (originalData, columnMapping) => {
    return originalData.map((item) => {
      const rearrangedItem = Object.fromEntries(Object.entries(columnMapping).map(([oldColumnName, newColumnName]) => [newColumnName, item[oldColumnName]]));
      return rearrangedItem;
    });
  };

  const exportClick = () => {
    // A const excelParams = {
    // A  fileName: "LossIntimationReport",
    // A};
    // A gridApi.exportDataAsExcel(excelParams);
    if (grievanceReportDataList.length === 0) {
      setAlertMessage({
        type: "error",
        message: "Data not found to download.",
      });
      return;
    }
    const columnOrder = {
      CallingUniqueID: "Calling ID",
      NCIPDocketNo: "NCIP Docket No",
      SupportTicketNo: "Ticket No",
      ApplicationNo: "Application No",
      InsurancePolicyNo: "Policy No",
      TicketStatus: "Ticket Status",
      RequestorName: "Farmer Name",
      RequestorMobileNo: "Mobile No",
      StateMasterName: "State",
      DistrictMasterName: "District",
      VillageName: "Village",
      AREA: "Area In Hactare",
      ApplicationCropName: "Application Crop Name",
      InsuranceCompany: "Insurance Company",
      TicketHeadName: "Type",
      TicketTypeName: "Category",
      TicketCategoryName: "Sub Category",
      CropCategoryOthers: "Other Sub Category",
      CropStage: "Crop Stage Type",
      CropStageSelection: "Loss At",
      LossDate: "Loss Date",
      OnTimeIntimationFlag: "Intimation",
      PostHarvestDate: "Harvest Date",
      CropName: "Crop Name",
      Relation: "Relation",
      RelativeName: "Relative Name",
      PolicyPremium: "Policy Premium",
      PolicyArea: "Policy Area",
      PolicyType: "Policy Type",
      LandSurveyNumber: "Land Survey Number",
      LandDivisionNumber: "Land Division Number",
      PlotStateName: "Plot State",
      PlotDistrictName: "Plot District",
      PlotVillageName: "Plot Village",
      ApplicationSource: "Application Source",
      CropShare: "Crop Share",
      IFSCCode: "IFSC Code",
      FarmerShare: "Farmer Share",
      SowingDate: "Sowing Date",
      CreatedBY: "Created By",
      CreatedAt: "Created At",
    };
    const mappedData = grievanceReportDataList.map((value) => {
      return {
        CallingUniqueID: value.CallingUniqueID,
        NCIPDocketNo: value.NCIPDocketNo,
        SupportTicketNo: value.SupportTicketNo,
        ApplicationNo: value.ApplicationNo,
        InsurancePolicyNo: value.InsurancePolicyNo,
        TicketStatus: value.TicketStatus,
        RequestorName: value.RequestorName,
        RequestorMobileNo: value.RequestorMobileNo,
        StateMasterName: value.StateMasterName,
        DistrictMasterName: value.DistrictMasterName,
        VillageName: value.VillageName,
        AREA: value.AREA,
        ApplicationCropName: value.ApplicationCropName,
        InsuranceCompany: value.InsuranceCompany,
        TicketHeadName: value.TicketHeadName,
        TicketTypeName: value.TicketTypeName,
        TicketCategoryName: value.TicketCategoryName,
        CropCategoryOthers: value.CropCategoryOthers,
        CropStage: value.CropStage,
        CropStageSelection: value.CropStageSelection,
        LossDate: value.LossDate ? dateToSpecificFormat(value.LossDate, "DD-MM-YYYY") : "",
        OnTimeIntimationFlag:
          value.OnTimeIntimationFlag && value.OnTimeIntimationFlag === "NO" ? "Late" : value.OnTimeIntimationFlag === "YES" ? "On-time" : null,
        PostHarvestDate: value.PostHarvestDate ? dateToSpecificFormat(value.PostHarvestDate, "DD-MM-YYYY") : "",
        CropName: value.CropName,
        Relation: value.Relation,
        RelativeName: value.RelativeName,
        PolicyPremium: value.PolicyPremium,
        PolicyArea: value.PolicyArea,
        PolicyType: value.PolicyType,
        LandSurveyNumber: value.LandSurveyNumber,
        LandDivisionNumber: value.LandDivisionNumber,
        PlotStateName: value.PlotStateName,
        PlotDistrictName: value.PlotDistrictName,
        PlotVillageName: value.PlotVillageName,
        ApplicationSource: value.ApplicationSource,
        CropShare: value.CropShare,
        IFSCCode: value.IFSCCode,
        FarmerShare: value.FarmerShare,
        SowingDate: value.SowingDate,
        CreatedBY: value.CreatedBY,
        CreatedAt: dateToSpecificFormat(`${value.CreatedAt.split("T")[0]} ${Convert24FourHourAndMinute(value.CreatedAt.split("T")[1])}`, "DD-MM-YYYY HH:mm"),
      };
    });
    const rearrangedData = rearrangeAndRenameColumns(mappedData, columnOrder);
    downloadExcel(rearrangedData);
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

export default CropLossIntimationReportLogics;
