import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useState, useEffect } from "react";
import { dateToCompanyFormat, dateToSpecificFormat, Convert24FourHourAndMinute, dateFormatDefault, daysdifference } from "Configration/Utilities/dateformat";
import moment from "moment";
import * as XLSX from "xlsx";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { getMasterDataBinding } from "../../../Support/ManageTicket/Services/Methods";
import { getSupportFarmerTicketCropLossView } from "../Services/Methods";

function TicketsByFarmerReportLogics() {
  const [formValues, setFormValues] = useState({
    txtFromDate: dateToSpecificFormat(moment().subtract(1, "days"), "YYYY-MM-DD"),
    txtToDate: dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD"),
    txtState: null,
    SearchByFilter: null,
    txtSearchFilter: "",
  });

  const searchByoptionsFilter = [
    { value: "1", label: "Mobile No" },
  ];

  const [ticketsByFarmerDataList, setTicketsByFarmerDataList] = useState(false);
  const [filteredTicketsByFarmerDataList, setFilteredTicketsByFarmerDataList] = useState([]);
  const [isLoadingTicketsByFarmerDataList, setLoadingTicketsByFarmerDataList] = useState(false);
  const setAlertMessage = AlertMessage();

  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
    console.log(params.api);
    setGridApi(params.api);
  };

  const [ticketsByFarmerListItemSearch, setTicketsByFarmerListItemSearch] = useState("");
  const onChangeTicketsByFarmerList = (val) => {
    setTicketsByFarmerListItemSearch(val);
    gridApi.setQuickFilter(val);
  };

  const getTicketsByFarmertData = async () => {
    debugger;
    try {
      setLoadingTicketsByFarmerDataList(true);

      const formData = {
        stateID: formValues.txtState && formValues.txtState.StateMasterID ? formValues.txtState.StateMasterID.toString() : "",
        viewTYP: "",
        requestorMobileNo: formValues && formValues.txtSearchFilter ? formValues.txtSearchFilter : "",
        fromdate: formValues.txtFromDate ? dateToCompanyFormat(formValues.txtFromDate) : "",
        toDate: formValues.txtToDate ? dateToCompanyFormat(formValues.txtToDate) : "",
      };
      const result = await getSupportFarmerTicketCropLossView(formData);
      setLoadingTicketsByFarmerDataList(false);
      if (result.responseCode === 1) {
        if (ticketsByFarmerListItemSearch && ticketsByFarmerListItemSearch.toLowerCase().includes("#")) {
          onChangeTicketsByFarmerList("");
        }
        setTicketsByFarmerDataList(result.responseData.supportTicket);
        setFilteredTicketsByFarmerDataList(result.responseData.supportTicket);
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

  const updateState = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
    if (name === "txtSearchFilter") {
      onChangeTicketsByFarmerList(value);
    }
  };

  const getTicketsByFarmerList = () => {
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
    if (formValues.SearchByFilter) {
      if (formValues.SearchByFilter.value === "1") {
        const regex = new RegExp("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$");
        if (formValues.txtSearchFilter.length === 0) {
          setAlertMessage({
            type: "error",
            message: "Please enter mobile No.",
          });
          return;
        }

        if (!regex.test(formValues.txtSearchFilter)) {
          setAlertMessage({
            type: "error",
            message: "Please enter Valid mobile no.",
          });
          return;
        }
        if (formValues.txtSearchFilter.length < 10 || formValues.txtSearchFilter.length > 10) {
          setAlertMessage({
            type: "error",
            message: "Please enter Valid 10 digit mobile no.",
          });
          return;
        }
      } 
    }
    getTicketsByFarmertData();
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
    XLSX.writeFile(workbook, "Tickets_By_Farmer.xlsx");
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
    if (ticketsByFarmerDataList.length === 0) {
      setAlertMessage({
        type: "error",
        message: "Data not found to download.",
      });
      return;
    }
    const columnOrder = {
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
    const mappedData = ticketsByFarmerDataList.map((value) => {
      return {
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

    
      useEffect(() => {
        getStateListData();
      }, []);
  

  return {
    ticketsByFarmerDataList,
    filteredTicketsByFarmerDataList,
    isLoadingTicketsByFarmerDataList,
    gridApi,
    onGridReady,
    onChangeTicketsByFarmerList,
    ticketsByFarmerListItemSearch,
    stateList,
    isLoadingStateList,
    searchByoptionsFilter,
    formValues,
    updateState,
    isLoadingTicketsByFarmerDataList,
    getTicketsByFarmerList,
    onClickClearSearchFilter,
    exportClick,
  };
}

export default TicketsByFarmerReportLogics;
