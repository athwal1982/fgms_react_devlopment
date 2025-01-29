import { useEffect, useState } from "react";
import moment from "moment";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { dateToSpecificFormat, Convert24FourHourAndMinute, dateFormatDefault, daysdifference } from "Configration/Utilities/dateformat";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
// A import { getfarmerTicketsList, getMasterDataBinding, getfarmerTicketsListPagging } from "../Services/Methods";
import { getMasterDataBinding, getfarmerTicketsListPagging, getAssignedTicketList } from "../Services/Methods";
import { getMasterDataBindingDataList } from "../Views/Modals/AddTicket/Services/Methods";

function ManageTicketLogics() {
  const setAlertMessage = AlertMessage();
  const navigate = useNavigate();
  const [farmerAuthenticateDataList, setfarmerAuthenticateDataList] = useState([]);
  const [isDataCleared, setIsDataCleared] = useState(false);
  const [isDataClearedEsclated, setIsDataClearedEsclated] = useState(false);

  const [filterValues, setFilterValues] = useState({
    SearchByFilter: null,
    txtSearchFilter: "",
  });
  const [formValues, setFormValues] = useState({
    txtTicketType: null,
    txtTicketCategory: null,
    txtTicketCategoryType: null,
    txtTicketSource: null,
    txtStatus: null,
    txtInsuranceCompany: null,
    txtState: null,
    txtDistrict: null,
    txtFromDate: "",
    txtToDate: "",
    txtScheme: null,
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
  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
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
      { width: 25 },
      { width: 26 },
      { width: 12 },
      { width: 15 },
      { width: 30 },
      { width: 12 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 40 },
      { width: 18 },
      { width: 22 },
      { width: 22 },
      { width: 30 },
      { width: 12 },
      { width: 12 },
      { width: 22 },
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
      { width: 12 },
      { width: 22 },
      { width: 20 },
    ];
    XLSX.writeFile(
      workbook,
      `Ticket_Data_${dateToSpecificFormat(formValues.txtFromDate, "DD-MM-YYYY")}_To_${dateToSpecificFormat(formValues.txtToDate, "DD-MM-YYYY")}.xlsx`,
    );
    setAlertMessage({
      type: "success",
      message: "Ticket data downloaded successfully.",
    });
  };

  const rearrangeAndRenameColumns = (originalData, columnMapping) => {
    return originalData.map((item) => {
      const rearrangedItem = Object.fromEntries(Object.entries(columnMapping).map(([oldColumnName, newColumnName]) => [newColumnName, item[oldColumnName]]));
      return rearrangedItem;
    });
  };

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageChange = (page) => {
    debugger;
    setCurrentPage(page);
    // ... do something with `page`
    if (viewTypeMode === "FILTER" && page >= 1) {
      getFarmersTickets("FILTER", "", page, 20);
    } else if (viewTypeMode === "ESCAL" && page >= 1) {
      getFarmersTickets("ESCAL", "", page, 20);
    } else if (viewTypeMode === "DEFESCAL" && page >= 1) {
      getFarmersTickets("DEFESCAL", "", page, 20);
    } else if (viewTypeMode === "MOBILE" && page >= 1) {
      searchByMobileTicketsOnClick(page, 20);
    }
  };
  const [isLoadingFarmersticket, setIsLoadingFarmersticket] = useState(false);
  const [farmersTicketData, setFarmersTicketData] = useState([]);
  const [satatusCount, setSatatusCount] = useState({});
  const [totalSatatusCount, settotalSatatusCount] = useState("0");
  const [viewTypeMode, setViewTypeMode] = useState([]);
  const [esclatedCount, setEsclatedCount] = useState("0");
  const [showHideDownload, setshowHideDownload] = useState(true);
  const [showHideManageTicket, setshowHideManageTicket] = useState(false);
  const getFarmersTickets = async (pviewTYP, pType, pageIndex, pageSize) => {
    debugger;
    setViewTypeMode(pviewTYP);
    let TicketStatusID = 0;
    if (pType === "") {
      TicketStatusID = formValues.txtStatus && formValues.txtStatus.CommonMasterValueID ? formValues.txtStatus.CommonMasterValueID : 0;
    } else if (pType === "DEFAULTFILTER") {
      TicketStatusID = 109301;
    }

    if (showHideDownload === false) {
      const dateDiffrence = daysdifference(dateFormatDefault(formValues.txtFromDate), dateFormatDefault(formValues.txtToDate));
      if (formValues.txtFromDate === "") {
        setAlertMessage({
          type: "error",
          message: "Please Select From Date",
        });
        return;
      }
      if (formValues.txtFromDate) {
        if (formValues.txtToDate) {
          if (formValues.txtFromDate > formValues.txtToDate) {
            setAlertMessage({
              type: "error",
              message: "From Date must be less than To Date",
            });
            return;
          }
        } else {
          setAlertMessage({
            type: "error",
            message: "Please select To Date",
          });
          return;
        }
      }

      if (dateDiffrence + 1 > 7) {
        setAlertMessage({
          type: "error",
          message: "7 days is allowed only to download.",
        });
        return;
      }
    }

    try {
      const userData = getSessionStorage("user");
      const ChkBRHeadTypeID = userData && userData.BRHeadTypeID ? userData.BRHeadTypeID.toString() : "0";
      const ChkAppAccessTypeID = userData && userData.AppAccessTypeID ? userData.AppAccessTypeID.toString() : "0";
      const formData = {
        insuranceCompanyID: formValues.txtInsuranceCompany && formValues.txtInsuranceCompany.CompanyID ? formValues.txtInsuranceCompany.CompanyID : 0,
        viewTYP: pviewTYP,
        stateID: formValues.txtState && formValues.txtState.length > 0 ? formValues.txtState.map((x) => x.value.toString()).join(",") : "",
        districtID: formValues.txtDistrict && formValues.txtDistrict.length > 0 ? formValues.txtDistrict.map((x) => x.value.toString()).join(",") : "",
        supportTicketID: 0,
        ticketCategoryID: formValues.txtTicketCategory && formValues.txtTicketCategory.TicketCategoryID ? formValues.txtTicketCategory.TicketCategoryID : 0,
        ticketSourceID: 0,
        supportTicketTypeID:
          formValues.txtTicketCategoryType && formValues.txtTicketCategoryType.SupportTicketTypeID ? formValues.txtTicketCategoryType.SupportTicketTypeID : 0,
        supportTicketNo: "",
        applicationNo: "",
        statusID: TicketStatusID,
        fromdate: formValues.txtFromDate ? dateToCompanyFormat(formValues.txtFromDate) : "",
        toDate: formValues.txtToDate ? dateToCompanyFormat(formValues.txtToDate) : "",
        RequestorMobileNo: "",
        schemeID: 0,
        ticketHeaderID: formValues.txtTicketType && formValues.txtTicketType.TicketTypeID ? formValues.txtTicketType.TicketTypeID : 0,
        pageIndex: showHideDownload === false ? -1 : pageIndex,
        pageSize: pageSize,
      };
      setIsLoadingFarmersticket(true);
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
          if (pviewTYP === "ESCAL") {
            setEsclatedCount(result.responseData.supportTicket.length);
          }
          setFarmersTicketData(result.responseData.supportTicket);

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
          if (pviewTYP === "ESCAL") {
            setTotalPages(Math.ceil(result.responseData.supportTicket.length / 20));
          } else {
            setTotalPages(Math.ceil(totalStsCnt / 20));
          }
          settotalSatatusCount(totalStsCnt.toString());
          setSatatusCount([jsonStatusCnt]);
          if (showHideDownload === false) {
            if (result.responseData.supportTicket.length > 0) {
              setTimeout(() => {
                // A const excelParams = {
                // A  fileName: `Ticket_Data_${dateToSpecificFormat(formValues.txtFromDate, "DD-MM-YYYY")}`,
                // A };
                // A gridApi.exportDataAsExcel(excelParams);
                const columnOrder = {
                  SupportTicketNo: "Ticket No",
                  ApplicationNo: "Application No",
                  InsurancePolicyNo: "Policy No",
                  TicketStatus: "Ticket Status",
                  CallerContactNumber: "Caller Mobile No",
                  RequestorName: "Farmer Name",
                  RequestorMobileNo: "Mobile No",
                  StateMasterName: "State",
                  DistrictMasterName: "District",
                  SubDistrictName: "Sub District",
                  InsuranceCompany: "Insurance Company",
                  TicketHeadName: "Type",
                  TicketTypeName: "Category",
                  TicketCategoryName: "Sub Category",
                  SchemeName: "Scheme",
                  RequestSeason: "Season",
                  RequestYear: "Year",
                  ApplicationCropName: "Crop Name",
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
                  LossDate: "Crop Loss At",
                  CreatedBY: "Created By",
                  CreatedAt: "Created At",
                };
                const mappedData = result.responseData.supportTicket.map((value) => {
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
                    SchemeName: value.SchemeName,
                    RequestSeason: value.RequestSeason && value.RequestSeason === 1 ? "Kharif" : value.RequestSeason === 2 ? "Rabi" : "",
                    RequestYear: value.RequestYear,
                    ApplicationCropName: value.ApplicationCropName,
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
                      ? dateToSpecificFormat(
                          `${value.SowingDate.split("T")[0]} ${Convert24FourHourAndMinute(value.SowingDate.split("T")[1])}`,
                          "DD-MM-YYYY HH:mm",
                        )
                      : "",
                    LossDate: value.LossDate ? dateToSpecificFormat(value.LossDate.split("T")[0], "DD-MM-YYYY") : "",
                    CreatedBY: value.CreatedBY,
                    CreatedAt: value.CreatedAt
                      ? dateToSpecificFormat(
                          `${value.CreatedAt.split("T")[0]} ${Convert24FourHourAndMinute(value.CreatedAt.split("T")[1])}`,
                          "DD-MM-YYYY HH:mm",
                        )
                      : "",
                  };
                });
                const rearrangedData = rearrangeAndRenameColumns(mappedData, columnOrder);
                downloadExcel(rearrangedData);
              }, 1000);
            } else {
              setAlertMessage({
                type: "error",
                message: "Data not found to download",
              });
            }
          }
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

  // A const getFarmersTicketsStatusCount = async (pviewTYP) => {
  // A  try {
  // A    const formData = {
  // A      insuranceCompanyID: formValues.txtInsuranceCompany && formValues.txtInsuranceCompany.CompanyID ? formValues.txtInsuranceCompany.CompanyID : 0,
  // A      viewTYP: pviewTYP,
  // A      stateID: formValues.txtState && formValues.txtState.length > 0 ? formValues.txtState.map((x) => x.value.toString()).join(",") : "",
  // A      supportTicketID: 0,
  // A      ticketCategoryID: formValues.txtTicketCategory && formValues.txtTicketCategory.TicketCategoryID ? formValues.txtTicketCategory.TicketCategoryID : 0,
  // A      ticketSourceID: 0,
  // A      supportTicketTypeID:
  // A        formValues.txtTicketCategoryType && formValues.txtTicketCategoryType.SupportTicketTypeID ? formValues.txtTicketCategoryType.SupportTicketTypeID : 0,
  // A      supportTicketNo: "",
  // A      applicationNo: "",
  // A      statusID: formValues.txtStatus && formValues.txtStatus.CommonMasterValueID ? formValues.txtStatus.CommonMasterValueID : 0,
  // A      fromdate: formValues.txtFromDate ? dateToCompanyFormat(formValues.txtFromDate) : "",
  // A      toDate: formValues.txtToDate ? dateToCompanyFormat(formValues.txtToDate) : "",
  // A      RequestorMobileNo: "",
  // A      schemeID: 0,
  // A      ticketHeaderID: 0,
  // A    };

  // A    const result = await getfarmerTicketsList(formData);
  // A    let totalStsCnt = 0;
  // A    const jsonStatusCnt = { Open: "0", InProgress: "0", Resolved: "0", ResolvedInformation: "0", ReOpen: "0" };
  // A    if (result.responseCode === 1) {
  // A      if (result.responseData && result.responseData.supportTicket && result.responseData.status) {
  // A        result.responseData.status.forEach((v) => {
  // A          if (v.TicketStatus === "Open") {
  // A            jsonStatusCnt.Open = v.Total;
  // A          }
  // A          if (v.TicketStatus === "In-Progress") {
  // A            jsonStatusCnt.InProgress = v.Total;
  // A          }
  // A          if (v.TicketStatus === "Re-Open") {
  // A            jsonStatusCnt.ReOpen = v.Total;
  // A          }
  // A          if (v.TicketStatus === "Resolved") {
  // A            jsonStatusCnt.Resolved = v.Total;
  // A          }
  // A          if (v.TicketStatus === "Resolved(Information)") {
  // A            jsonStatusCnt.ResolvedInformation = v.Total;
  // A          }
  // A          totalStsCnt += Number(v.Total);
  // A        });
  // A        settotalSatatusCount(totalStsCnt.toString());
  // A        setSatatusCount([jsonStatusCnt]);
  // A      } else {
  // A        settotalSatatusCount(totalStsCnt.toString());
  // A        setSatatusCount([jsonStatusCnt]);
  // A      }
  // A    } else {
  // A      setAlertMessage({
  // A        type: "error",
  // A        message: result.responseMessage,
  // A      });
  // A      settotalSatatusCount(totalStsCnt.toString());
  // A      setSatatusCount([jsonStatusCnt]);
  // A    }
  // A  } catch (error) {
  // A    console.log(error);
  // A    setAlertMessage({
  // A      type: "error",
  // A      message: error,
  // A    });
  // A  }
  // A};

  // A const getFarmersTicketsWithOutLoader = async () => {
  // A  try {
  // A    const formData = {
  // A      insuranceCompanyID: formValues.txtInsuranceCompany && formValues.txtInsuranceCompany.CompanyID ? formValues.txtInsuranceCompany.CompanyID : 0,
  // A      viewTYP: "FILTER",
  // A      stateID: formValues.txtState && formValues.txtState.length > 0 ? formValues.txtState.map((x) => x.value.toString()).join(",") : "",
  // A      supportTicketID: 0,
  // A      ticketCategoryID: formValues.txtTicketCategory && formValues.txtTicketCategory.TicketCategoryID ? formValues.txtTicketCategory.TicketCategoryID : 0,
  // A      ticketSourceID: 0,
  // A      supportTicketTypeID:
  // A        formValues.txtTicketCategoryType && formValues.txtTicketCategoryType.SupportTicketTypeID ? formValues.txtTicketCategoryType.SupportTicketTypeID : 0,
  // A      supportTicketNo: "",
  // A      applicationNo: "",
  // A      statusID: formValues.txtStatus && formValues.txtStatus.CommonMasterValueID ? formValues.txtStatus.CommonMasterValueID : 0,
  // A      fromdate: formValues.txtFromDate ? dateToCompanyFormat(formValues.txtFromDate) : "",
  // A      toDate: formValues.txtToDate ? dateToCompanyFormat(formValues.txtToDate) : "",
  // A      RequestorMobileNo: "",
  // A      schemeID: 0,
  // A      ticketHeaderID: formValues.txtTicketType && formValues.txtTicketType.TicketTypeID ? formValues.txtTicketType.TicketTypeID : 0,
  // A    };

  // A    const result = await getfarmerTicketsList(formData);

  // A   let totalStsCnt = 0;
  // A    const jsonStatusCnt = { Open: "0", InProgress: "0", Resolved: "0", ResolvedInformation: "0", ReOpen: "0" };
  // A    if (result.responseCode === 1) {
  // A      if (result.responseData && result.responseData.supportTicket && result.responseData.status) {
  // A        setFarmersTicketData(result.responseData.supportTicket);

  //  A       result.responseData.status.forEach((v) => {
  //  A         if (v.TicketStatus === "Open") {
  //  A           jsonStatusCnt.Open = v.Total;
  //  A         }
  //  A         if (v.TicketStatus === "In-Progress") {
  //  A           jsonStatusCnt.InProgress = v.Total;
  //  A         }
  //  A         if (v.TicketStatus === "Re-Open") {
  //  A           jsonStatusCnt.ReOpen = v.Total;
  //  A         }
  //  A         if (v.TicketStatus === "Resolved") {
  //  A           jsonStatusCnt.Resolved = v.Total;
  //  A         }
  //  A         if (v.TicketStatus === "Resolved(Information)") {
  //  A           jsonStatusCnt.ResolvedInformation = v.Total;
  //  A         }
  //  A         totalStsCnt += Number(v.Total);
  //  A       });
  //  A       settotalSatatusCount(totalStsCnt.toString());
  //  A       setSatatusCount([jsonStatusCnt]);
  //  A     } else {
  //  A       settotalSatatusCount(totalStsCnt.toString());
  //  A       setSatatusCount([jsonStatusCnt]);
  //  A     }
  //  A   } else {
  //  A     setAlertMessage({
  //  A       type: "error",
  //  A       message: result.responseMessage,
  //  A     });
  //  A     settotalSatatusCount(totalStsCnt.toString());
  //  A     setSatatusCount([jsonStatusCnt]);
  //  A   }
  //  A } catch (error) {
  //  A   console.log(error);
  //  A   setAlertMessage({
  //  A     type: "error",
  //  A     message: error,
  //  A  });
  //  A }
  // };

  //  A const updateFarmersTicketsStatusCount = () => {
  //  A getFarmersTicketsStatusCount("FILTER");
  //  A};

  const updateFilterState = (name, value) => {
    setFilterValues({ ...filterValues, [name]: value });
  };

  const searchByMobileTicketsOnClick = async (pageIndex, pageSize) => {
    debugger;
    try {
      let ticketNoVal = "";
      let mobileNoVal = "";
      let applicationNoVal = "";
      let pviewTYP = "";

      if (!filterValues.SearchByFilter) {
        setAlertMessage({
          type: "error",
          message: "Please select search type.",
        });
        return;
      }
      const regex = new RegExp("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$");
      if (filterValues.SearchByFilter.value === "1") {
        if (filterValues.txtSearchFilter.length === 0) {
          setAlertMessage({
            type: "error",
            message: "Please enter Mobile No.",
          });
          return;
        }

        if (!regex.test(filterValues.txtSearchFilter)) {
          setAlertMessage({
            type: "error",
            message: "Please enter Valid Mobile No.",
          });
          return;
        }
        if (filterValues.txtSearchFilter.length < 10 || filterValues.txtSearchFilter.length > 10) {
          setAlertMessage({
            type: "error",
            message: "Please enter Valid 10 digit mobile No.",
          });
          return;
        }

        mobileNoVal = filterValues.txtSearchFilter;
        pviewTYP = "MOBILE";
      } else if (filterValues.SearchByFilter.value === "2") {
        if (filterValues.txtSearchFilter.length === 0) {
          setAlertMessage({
            type: "error",
            message: "Please enter Ticket No.",
          });
          return;
        }

        if (!regex.test(filterValues.txtSearchFilter)) {
          setAlertMessage({
            type: "error",
            message: "Please enter numeric value for Ticket No.",
          });
          return;
        }
        ticketNoVal = filterValues.txtSearchFilter;
        pviewTYP = "TICKET";
      } else if (filterValues.SearchByFilter.value === "3") {
        if (filterValues.txtSearchFilter.length === 0) {
          setAlertMessage({
            type: "error",
            message: "Please enter Application No.",
          });
          return;
        }
        if (!regex.test(filterValues.txtSearchFilter)) {
          setAlertMessage({
            type: "error",
            message: "Please enter numeric value for Application No",
          });
          return;
        }
        applicationNoVal = filterValues.txtSearchFilter;
        pviewTYP = "APPNO";
      }

      setViewTypeMode(pviewTYP);

      const formData = {
        insuranceCompanyID: 0,
        viewTYP: pviewTYP,
        stateID: "",
        districtID: "",
        supportTicketID: 0,
        ticketCategoryID: 0,
        ticketSourceID: 0,
        supportTicketTypeID: 0,
        supportTicketNo: ticketNoVal,
        applicationNo: applicationNoVal,
        statusID: 0,
        fromdate: "",
        toDate: "",
        RequestorMobileNo: mobileNoVal,
        schemeID: 0,
        ticketHeaderID: 0,
        pageIndex: pageIndex,
        pageSize: pageSize,
      };
      setIsLoadingFarmersticket(true);
      const result = await getfarmerTicketsListPagging(formData);
      setIsLoadingFarmersticket(false);
      let totalStsCnt = 0;
      const jsonStatusCnt = { Open: "0", InProgress: "0", Resolved: "0", ResolvedInformation: "0", ReOpen: "0" };
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
              if (v.TicketStatus === "Resolved") {
                jsonStatusCnt.Resolved = v.Total;
              }
              if (v.TicketStatus === "Resolved(Information)") {
                jsonStatusCnt.ResolvedInformation = v.Total;
              }
              totalStsCnt += Number(v.Total);
            });
            setTotalPages(Math.ceil(result.responseData.supportTicket.length / 20));
            settotalSatatusCount(totalStsCnt.toString());
            setSatatusCount([jsonStatusCnt]);
            setFarmersTicketData(result.responseData.supportTicket);
          } else {
            settotalSatatusCount(totalStsCnt.toString());
            setSatatusCount([jsonStatusCnt]);
            setFarmersTicketData([]);
          }
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

  useEffect(() => {
    console.log(farmersTicketData, "comes");
  }, [farmersTicketData]);

  const [ticketSourceList, setTicketSourceList] = useState([]);
  const [isLoadingTicketSourceList, setIsTicketSourceList] = useState(false);
  const getTicketSourceListData = async () => {
    try {
      setTicketSourceList([]);
      setIsTicketSourceList(true);
      const formdata = {
        filterID: 0,
        filterID1: 0,
        masterName: "TCKTSRC",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBinding(formdata);
      setIsTicketSourceList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setTicketSourceList(result.response.responseData.masterdatabinding);
        } else {
          setTicketSourceList([]);
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

  const updateFarmersTickets = (newlyAddedTicket) => {
    if (gridApi) {
      const rowData = [];
      if (newlyAddedTicket && newlyAddedTicket.length > 0) {
        newlyAddedTicket.forEach((data) => {
          rowData.push(data);
        });
      }
      gridApi.forEachNode((node) => rowData.push(node.data));
      gridApi.setRowData(rowData);
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
      setIsLoadingStateList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          const mappedData = [];
          result.response.responseData.masterdatabinding.forEach((v) => {
            mappedData.push({
              label: v.StateMasterName,
              value: v.StateMasterID,
            });
          });
          setStateList(mappedData);
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

  const [districtList, setDistrictList] = useState([]);
  const [isLoadingDistrictList, setIsLoadingDistrictList] = useState(false);
  const getDistrictByStateListData = async (statemasterid) => {
    debugger;
    try {
      setIsLoadingDistrictList(true);
      const userData = getSessionStorage("user");
      const formdata = {
        filterID: userData && userData.LoginID ? userData.LoginID : 0,
        filterID1: 0,
        masterName: "DISTASIGN",
        searchText: statemasterid,
        searchCriteria: "AW",
      };
      const result = await getMasterDataBinding(formdata);
      setIsLoadingDistrictList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          const mappedData = [];
          result.response.responseData.masterdatabinding.forEach((v) => {
            mappedData.push({
              label: v.DistrictMasterName,
              value: v.DistrictMasterID,
            });
          });
          setDistrictList(mappedData);
        } else {
          setDistrictList([]);
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

  const [schemeList, setSchemeList] = useState([]);
  const [isLoadingSchemeListDropdownDataList, setIsLoadingSchemeListDropdownDataList] = useState(false);
  const getSchemeListData = async () => {
    try {
      setIsLoadingSchemeListDropdownDataList(true);
      const formdata = {
        filterID: 0,
        filterID1: 0,
        masterName: "SCHEME",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBindingDataList(formdata);
      setIsLoadingSchemeListDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setSchemeList(result.response.responseData.masterdatabinding);
        } else {
          setSchemeList([]);
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
    debugger;
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

    if (name === "txtTicketType") {
      setFormValues({
        ...formValues,
        txtTicketType: value,
        txtTicketCategoryType: null,
        txtTicketCategory: null,
      });
      setTicketCategoryTypeList([]);
      setTicketCategoryList([]);
      getTicketCategoryTypeListData(value.TicketTypeID);
    }

    if (showHideDownload === false) {
      if (name === "txtState") {
        setFormValues({
          ...formValues,
          txtState: value,
          txtDistrict: null,
        });
        setDistrictList([]);
        if (value) {
          const pStateIds = value && value.length > 0 ? value.map((x) => x.value.toString()).join(",") : "";
          if (pStateIds !== "") {
            getDistrictByStateListData(pStateIds);
          }
        }
      }
    }
  };

  const refereshFarmerTicket = () => {
    getFarmersTickets("FILTER", "", 1, 20);
  };

  const ClearTicketFilters = () => {
    setFormValues({
      ...formValues,
      txtTicketType: null,
      txtTicketCategory: null,
      txtTicketCategoryType: null,
      txtTicketSource: null,
      txtStatus: null,
      txtInsuranceCompany: null,
      txtState: null,
      txtDistrict: null,
      txtScheme: null,
      txtFromDate: "",
      txtToDate: "",
      txtScheme: null,
    });
    setTicketCategoryTypeList([]);
    setTicketCategoryList([]);
    setIsDataCleared(true);
    setDistrictList([]);
  };

  const ClearTicketFiltersForEscalated = () => {
    setFormValues({
      ...formValues,
      txtTicketType: null,
      txtTicketCategory: null,
      txtTicketCategoryType: null,
      txtTicketSource: null,
      txtStatus: null,
      txtInsuranceCompany: null,
      txtState: null,
      txtDistrict: null,
      txtScheme: null,
      txtFromDate: "",
      txtToDate: "",
      txtScheme: null,
    });
    setTicketCategoryTypeList([]);
    setTicketCategoryList([]);
    setIsDataClearedEsclated(true);
    setDistrictList([]);
  };

  const SetTicketFiltersTab = () => {
    setFormValues({
      ...formValues,
      txtTicketType: null,
      txtTicketCategory: null,
      txtTicketCategoryType: null,
      txtTicketSource: null,
      txtStatus: null,
      txtInsuranceCompany: null,
      txtState: null,
      txtDistrict: null,
      txtScheme: null,
      txtFromDate: "",
      txtToDate: "",
      txtScheme: null,
    });
    setTicketCategoryTypeList([]);
    setTicketCategoryList([]);
    setDistrictList([]);
  };

  const onClickEscalation = () => {
    ClearTicketFiltersForEscalated();
    getFarmersTickets("ESCAL", "", 1, 20);
  };

  const getOneDayTicketData = async () => {
    debugger;
    setshowHideDownload(false);
    SetTicketFiltersTab();
    settotalSatatusCount("0");
    setSatatusCount([{ Open: "0", InProgress: "0", Resolved: "0", ResolvedInformation: "0", ReOpen: "0" }]);
    setFarmersTicketData([]);
  };

  const getFilterTicketsClick = async () => {
    debugger;
    setshowHideDownload(true);
    SetTicketFiltersTab();
    settotalSatatusCount("0");
    setSatatusCount([{ Open: "0", InProgress: "0", Resolved: "0", ResolvedInformation: "0", ReOpen: "0" }]);
    setFarmersTicketData([]);
  };

  const OpenReplyOnMultipleTiketsForm = () => {
    navigate("/ReplyOnMultipleTikets");
  };

  useEffect(() => {
    debugger;
    if (isDataCleared === true) {
      getFarmersTickets("FILTER", "", 1, 20);
    }
    setIsDataCleared(false);

    if (isDataClearedEsclated === true) {
      getFarmersTickets("ESCAL", "", 1, 20);
    }
    setIsDataClearedEsclated(false);
  }, [formValues]);

  const onClickViewManageTickets = () => {
    debugger;
    setshowHideManageTicket(true);
    const userData = getSessionStorage("user");
    const ChkBRHeadTypeID = userData && userData.BRHeadTypeID ? userData.BRHeadTypeID.toString() : "0";
    const ChkAppAccessTypeID = userData && userData.AppAccessTypeID ? userData.AppAccessTypeID.toString() : "0";
    if (ChkBRHeadTypeID === "124001" && ChkAppAccessTypeID === "503") {
      getFarmersTickets("DEFESCAL", "DEFAULTFILTER", 1, 20);
    }
    getTicketSourceListData();
    getTicketStatusListData();
    getInsuranceCompanyListData();
    getStateListData();
    getSchemeListData();
  };

  return {
    farmersTicketData,
    isLoadingFarmersticket,
    farmerAuthenticateDataList,
    setfarmerAuthenticateDataList,
    ticketCategoryList,
    isLoadingTicketCategoryList,
    updateState,
    formValues,
    updateFarmersTickets,
    ticketCategoryTypeList,
    isLoadingTicketCategoryTypeList,
    getFarmersTickets,
    getTicketCategoryListData,
    getTicketCategoryTypeListData,
    refereshFarmerTicket,
    ClearTicketFilters,
    getTicketSourceListData,
    ticketSourceList,
    isLoadingTicketSourceList,
    getTicketStatusListData,
    ticketStatusList,
    isLoadingTicketStatusList,
    insuranceCompanyList,
    isLoadingInsuranceCompanyList,
    getInsuranceCompanyListData,
    stateList,
    isLoadingStateList,
    getStateListData,
    updateFilterState,
    searchByMobileTicketsOnClick,
    getSchemeListData,
    schemeList,
    isLoadingSchemeListDropdownDataList,
    satatusCount,
    totalSatatusCount,
    // A updateFarmersTicketsStatusCount,
    filterValues,
    setFilterValues,
    // A getFarmersTicketsWithOutLoader,
    onClickEscalation,
    viewTypeMode,
    esclatedCount,
    onGridReady,
    getOneDayTicketData,
    getFilterTicketsClick,
    showHideDownload,
    OpenReplyOnMultipleTiketsForm,
    totalPages,
    currentPage,
    handlePageChange,
    showHideManageTicket,
    onClickViewManageTickets,
    isLoadingDistrictList,
    districtList,
  };
}

export default ManageTicketLogics;
