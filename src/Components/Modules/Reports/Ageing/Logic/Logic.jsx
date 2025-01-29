import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useState } from "react";
import { dateToSpecificFormat, Convert24FourHourAndMinute } from "Configration/Utilities/dateformat";
import * as XLSX from "xlsx";
import { getSupportTicketAgeingReport, getSupportAgeingReportDetail } from "../Services/Methods";

function AgeingReportLogics() {
  const [formValues, setFormValues] = useState({
    txtReportFilter: null,
  });

  const reportFilterList = [
    { Value: "Insurance", Name: "Insurance" },
    { Value: "State", Name: "State" },
    { Value: "Category", Name: "Category" },
    { Value: "Status", Name: "All" },
  ];

  const [filteredAgeingReportDataList, setFilteredAgeingReportDataList] = useState([]);
  const [isLoadingAgeingReportDataList, setLoadingAgeingReportDataList] = useState(false);
  const setAlertMessage = AlertMessage();

  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
    console.log(params.api);
    setGridApi(params.api);
  };
  const downloadExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    // A let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    // A XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    worksheet["!cols"] = [
      { width: 20 },
      { width: 15 },
      { width: 15 },
      { width: 20 },
      { width: 20 },
      { width: 25 },
      { width: 25 },
      { width: 20 },
      { width: 25 },
      { width: 15 },
      { width: 15 },
      { width: 55 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 20 },
      { width: 30 },
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
      { width: 80 },
    ];
    XLSX.writeFile(workbook, "Ageing(Grievance)_Ticket_Details.xlsx");
  };

  const rearrangeAndRenameColumns = (originalData, columnMapping) => {
    return originalData.map((item) => {
      const rearrangedItem = Object.fromEntries(Object.entries(columnMapping).map(([oldColumnName, newColumnName]) => [newColumnName, item[oldColumnName]]));
      return rearrangedItem;
    });
  };

  const getAgeingReportsList = async (pViewMode) => {
    try {
      setLoadingAgeingReportDataList(true);

      const formData = {
        viewMode: pViewMode,
      };

      const result = await getSupportTicketAgeingReport(formData);
      setLoadingAgeingReportDataList(false);
      if (result.responseCode === 1) {
        setFilteredAgeingReportDataList(result.responseData.supportTicket);
        if (gridApi) {
          console.log(gridApi);
        }
      } else {
        setFilteredAgeingReportDataList([]);
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const onClickAgeingReport = () => {
    if (formValues.txtReportFilter === null) {
      setAlertMessage({
        type: "warning",
        message: "Please select report type",
      });
      return;
    }
    getAgeingReportsList(formValues.txtReportFilter.Value);
  };

  const updateState = (name, value) => {
    debugger;
    setFormValues({ ...formValues, [name]: value });
    if (name === "txtReportFilter") {
      setFormValues({
        ...formValues,
        txtReportFilter: value,
      });
      setFilteredAgeingReportDataList([]);
    }
  };

  const exportClick = () => {
    const excelParams = {
      fileName: "Ageing(Grievance)",
    };
    gridApi.exportDataAsExcel(excelParams);
  };

  const exportAgeingTicketListClick = () => {
    debugger;
    if (ageingTicketCountList.length === 0) {
      setAlertMessage({
        type: "error",
        message: "Data not found to download.",
      });
      return;
    }
    const columnOrder = {
      SupportTicketNo: "Ticket No",
      TicketDate: "Creation Date",
      TicketStatus: "Ticket Status",
      StateMasterName: "State",
      DistrictMasterName: "District",
      SubDistrictName: "Sub District",
      TicketHeadName: "Type",
      TicketTypeName: "Category",
      TicketCategoryName: "Sub Category",
      CropSeasonName: "Season",
      RequestYear: "Year",
      InsuranceCompany: "Insurance Company",
      ApplicationNo: "Application No",
      InsurancePolicyNo: "Policy No",
      CallerContactNumber: "Caller Mobile No.",
      RequestorName: "Farmer Name",
      RequestorMobileNo: "Mobile No",
      Relation: "Relation",
      RelativeName: "Relative Name",
      PolicyPremium: "Policy Premium",
      PolicyArea: "Policy Area",
      PolicyType: "Policy Type",
      LandSurveyNumber: "Land Survey Number",
      LandDivisionNumber: "Land Division Number",
      PlotVillageName: "Plot Village",
      PlotDistrictName: "Plot District Name",
      ApplicationSource: "Application Source",
      CropShare: "Crop Share",
      IFSCCode: "IFSC Code",
      FarmerShare: "Farmer Share",
      SowingDate: "Sowing Date",
      TicketDescription: "Description",
    };
    const mappedData = ageingTicketCountList.map((value) => {
      return {
        SupportTicketNo: value.SupportTicketNo,
        ApplicationNo: value.ApplicationNo,
        InsurancePolicyNo: value.InsurancePolicyNo,
        TicketStatus: value.TicketStatus,
        CallerContactNumber: value.CallerContactNumber,
        RequestorName: value.RequestorName,
        RequestorMobileNo: value.RequestorMobileNo,
        StateMasterName: value.StateMasterName,
        DistrictMasterName: value.DistrictMasterName,
        SubDistrictName: value.SubDistrictName,
        InsuranceCompany: value.InsuranceCompany,
        TicketHeadName: value.TicketHeadName,
        TicketTypeName: value.TicketTypeName,
        TicketCategoryName: value.TicketCategoryName,
        CropSeasonName: value.CropSeasonName,
        RequestYear: value.RequestYear,
        TicketDate: value.Created ? dateToSpecificFormat(value.Created.split("T")[0], "DD-MM-YYYY") : "",
        Relation: value.Relation,
        RelativeName: value.RelativeName,
        PolicyPremium: value.PolicyPremium,
        PolicyArea: value.PolicyArea,
        PolicyType: value.PolicyType,
        LandSurveyNumber: value.LandSurveyNumber,
        LandDivisionNumber: value.LandDivisionNumber,
        PlotVillageName: value.PlotVillageName,
        PlotDistrictName: value.PlotDistrictName,
        ApplicationSource: value.ApplicationSource,
        CropShare: value.CropShare,
        IFSCCode: value.IFSCCode,
        FarmerShare: value.FarmerShare,
        SowingDate: value.SowingDate
          ? dateToSpecificFormat(`${value.SowingDate.split("T")[0]} ${Convert24FourHourAndMinute(value.SowingDate.split("T")[1])}`, "DD-MM-YYYY HH:mm")
          : "",
        TicketDescription: value.TicketDescription,
      };
    });
    const rearrangedData = rearrangeAndRenameColumns(mappedData, columnOrder);
    downloadExcel(rearrangedData);
  };

  const [ageingTicketCountList, setageingTicketCountList] = useState([]);
  const [isLoadingAgeingTicketCountList, setIsLoadingAgeingTicketCountList] = useState(false);
  const getAgeingReportsDetailsList = async (pViewMode, pFilterID, pageingPeriodsID, pticketStatusID) => {
    try {
      setIsLoadingAgeingTicketCountList(true);
      debugger;
      const formData = {
        viewMode: pViewMode,
        stateID: pViewMode === "S" ? pFilterID : 0,
        insuranceCompanyID: pViewMode === "I" ? pFilterID : 0,
        categoryID: pViewMode === "C" ? pFilterID : 0,
        ageingPeriodsID: pageingPeriodsID ? pageingPeriodsID.toString() : "",
        ticketStatusID: pViewMode === "All" ? pFilterID : 0,
      };

      const result = await getSupportAgeingReportDetail(formData);
      setIsLoadingAgeingTicketCountList(false);
      if (result.responseCode === 1) {
        if (result.responseData.supportTicket && result.responseData.supportTicket.length > 0) {
          setageingTicketCountList(result.responseData.supportTicket);
        } else {
          setageingTicketCountList([]);
        }
      } else {
        setageingTicketCountList([]);
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
    filteredAgeingReportDataList,
    isLoadingAgeingReportDataList,
    reportFilterList,
    formValues,
    updateState,
    onGridReady,
    onClickAgeingReport,
    exportClick,
    ageingTicketCountList,
    isLoadingAgeingTicketCountList,
    getAgeingReportsDetailsList,
    exportAgeingTicketListClick,
  };
}

export default AgeingReportLogics;
