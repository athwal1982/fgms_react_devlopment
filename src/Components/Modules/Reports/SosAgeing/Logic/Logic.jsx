import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useState } from "react";
import { dateToCompanyFormat, dateToSpecificFormat, Convert24FourHourAndMinute } from "Configration/Utilities/dateformat";
import * as XLSX from "xlsx";
import { getSupportTicketDetailReport, getSupportTicketDetailReportMongo } from "../Services/Methods";

function SosAgeingLogics() {

  const [SosAgeingDataList, setSosAgeingDataList] = useState(false);

  const [filteredSosAgeingDataList, setFilteredSosAgeingDataList] = useState([]);
  const [isLoadingSosAgeingDataList, setLoadingSosAgeingDataList] = useState(false);


  const setAlertMessage = AlertMessage();


  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
    console.log(params.api);
    setGridApi(params.api);
  };

  const [SosAgeingListItemSearch, setSosAgeingListItemSearch] = useState("");
  const onChangeSosAgeingList = (val) => {
    debugger;
    setSosAgeingListItemSearch(val);
    gridApi.setQuickFilter(val);
  };


  const downloadExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    // A let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    // A XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    worksheet["!cols"] = [
      { width: 15 },
      { width: 20 },
      { width: 20 },
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
      { width: 30 },
      { width: 10 },
      { width: 10 },
      { width: 55 },
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
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 60 },
    ];
    XLSX.writeFile(workbook, "Ticket_History.xlsx");
  };

  const rearrangeAndRenameColumns = (originalData, columnMapping) => {
    return originalData.map((item) => {
      const rearrangedItem = Object.fromEntries(Object.entries(columnMapping).map(([oldColumnName, newColumnName]) => [newColumnName, item[oldColumnName]]));
      return rearrangedItem;
    });
  };


  const getSosAgeingData = async () => {
    debugger;
    try {
      setLoadingSosAgeingDataList(true);

      const formData = { };
      let result = [];
      result = await getSupportTicketDetailReport(formData);
      setLoadingSosAgeingDataList(false);
      if (result.responseCode === 1) {
        if (SosAgeingListItemSearch && SosAgeingListItemSearch.toLowerCase().includes("#")) {
          onChangeSosAgeingList("");
        }
        setSosAgeingDataList(result.responseData.supportTicket);
        setFilteredSosAgeingDataList(result.responseData.supportTicket);
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



  const getSosAgeingList = () => {
    getSosAgeingData();
  };

  const onClickClearSearchFilter = () => {
   console.log();
  };


  const exportClick = () => {
    debugger;
 
      if (SosAgeingDataList.length === 0) {
        setAlertMessage({
          type: "error",
          message: "Data not found to download.",
        });
        return;
      }
      setLoadingSosAgeingDataList(true);
      const columnOrder = {
        CallingUniqueID: "Calling ID",
        NCIPDocketNo: "NCIP Docket No",
        SupportTicketNo: "Ticket No",
        TicketDate: "Creation Date",
        ReOpenDate: "Re-Open Date",
        TicketStatus: "Ticket Status",
        StatusDate: "Status Date",
        StateMasterName: "State",
        DistrictMasterName: "District",
        SubDistrictName: "Sub District",
        TicketHeadName: "Type",
        SupportTicketTypeName: "Category",
        TicketCategoryName: "Sub Category",
        CropSeasonName: "Season",
        RequestYear: "Year",
        InsuranceMasterName: "Insurance Company",
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
        PlotStateName: "Plot State",
        PlotDistrictName: "Plot District",
        PlotVillageName: "Plot Village",
        ApplicationSource: "Application Source",
        CropShare: "Crop Share",
        IFSCCode: "IFSC Code",
        FarmerShare: "Farmer Share",
        SowingDate: "Sowing Date",
        TicketDescription: "Description",
      };
      const mappedData = SosAgeingDataList.map((value) => {
        return {
          CallingUniqueID: value.CallingUniqueID,
          NCIPDocketNo: value.NCIPDocketNo,
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
          InsuranceMasterName: value.InsuranceMasterName,
          TicketHeadName: value.TicketHeadName,
          SupportTicketTypeName: value.SupportTicketTypeName,
          TicketCategoryName: value.TicketCategoryName,
          CropSeasonName: value.CropSeasonName,
          RequestYear: value.RequestYear,
          StatusDate: value.StatusDate ? dateToSpecificFormat(value.StatusDate.split("T")[0], "DD-MM-YYYY") : "",
          TicketDate: value.TicketDate ? dateToSpecificFormat(value.TicketDate.split("T")[0], "DD-MM-YYYY") : "",
          ReOpenDate: value.ReOpenDate ? dateToSpecificFormat(value.ReOpenDate.split("T")[0], "DD-MM-YYYY") : "",
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
          SowingDate: value.SowingDate
            ? dateToSpecificFormat(`${value.SowingDate.split("T")[0]} ${Convert24FourHourAndMinute(value.SowingDate.split("T")[1])}`, "DD-MM-YYYY HH:mm")
            : "",
          TicketDescription: value.TicketDescription,
        };
      });
      const rearrangedData = rearrangeAndRenameColumns(mappedData, columnOrder);
      downloadExcel(rearrangedData);
      setLoadingSosAgeingDataList(false);
  };

  return {
    SosAgeingDataList,
    filteredSosAgeingDataList,
    isLoadingSosAgeingDataList,
    gridApi,
    onGridReady,
    onChangeSosAgeingList,
    SosAgeingListItemSearch,
    getSosAgeingList,
    onClickClearSearchFilter,
    exportClick,
  };
}
export default SosAgeingLogics;
