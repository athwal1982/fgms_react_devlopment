import { useEffect, useState } from "react";
import moment from "moment";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { dateToSpecificFormat, Convert24FourHourAndMinute, dateFormatDefault, daysdifference } from "Configration/Utilities/dateformat";
import * as XLSX from "xlsx";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { getMasterDataBinding } from "../../Support/ManageTicket/Services/Methods";
import { getMasterDataBindingDataList } from "../../Support/ManageTicket/Views/Modals/AddTicket/Services/Methods";
import { getFarmerSupportTicketViewCSCData } from "../Service/Method";

function FarmerEnquiryTicketsLogics() {
  const setAlertMessage = AlertMessage();
  const [farmerAuthenticateDataList, setfarmerAuthenticateDataList] = useState([]);

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
      { width: 25 },
      { width: 26 },
      { width: 12 },
      { width: 15 },
      { width: 30 },
      { width: 12 },
      { width: 20 },
      { width: 40 },
      { width: 18 },
      { width: 22 },
      { width: 22 },
      { width: 40 },
      { width: 18 },
      { width: 50 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 22 },
      { width: 20 },
    ];
    XLSX.writeFile(
      workbook,
      `Unregistered_Farmer_Ticket_Data_${dateToSpecificFormat(formValues.txtFromDate, "DD-MM-YYYY")}_To_${dateToSpecificFormat(
        formValues.txtToDate,
        "DD-MM-YYYY",
      )}.xlsx`,
    );
  };

  const rearrangeAndRenameColumns = (originalData, columnMapping) => {
    return originalData.map((item) => {
      const rearrangedItem = Object.fromEntries(Object.entries(columnMapping).map(([oldColumnName, newColumnName]) => [newColumnName, item[oldColumnName]]));
      return rearrangedItem;
    });
  };
  const [isLoadingFarmersticket, setIsLoadingFarmersticket] = useState(false);
  const [farmersTicketData, setFarmersTicketData] = useState([]);
  const [satatusCount, setSatatusCount] = useState({});
  const [totalSatatusCount, settotalSatatusCount] = useState("0");
  const [showHideDownload, setshowHideDownload] = useState(true);
  const getFarmersTickets = async (pviewTYP) => {
    debugger;
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
      const formData = {
        insuranceCompanyID: formValues.txtInsuranceCompany && formValues.txtInsuranceCompany.CompanyID ? formValues.txtInsuranceCompany.CompanyID : 0,
        viewTYP: pviewTYP,
        stateID: formValues.txtState && formValues.txtState.length > 0 ? formValues.txtState.map((x) => x.value.toString()).join(",") : "",
        supportTicketID: 0,
        ticketCategoryID: formValues.txtTicketCategory && formValues.txtTicketCategory.TicketCategoryID ? formValues.txtTicketCategory.TicketCategoryID : 0,
        ticketSourceID: 0,
        supportTicketTypeID:
          formValues.txtTicketCategoryType && formValues.txtTicketCategoryType.SupportTicketTypeID ? formValues.txtTicketCategoryType.SupportTicketTypeID : 0,
        supportTicketNo: "",
        statusID: 0,
        fromdate: formValues.txtFromDate ? dateToCompanyFormat(formValues.txtFromDate) : "",
        toDate: formValues.txtToDate ? dateToCompanyFormat(formValues.txtToDate) : "",
        schemeID: 0,
        ticketHeaderID: formValues.txtTicketType && formValues.txtTicketType.TicketTypeID ? formValues.txtTicketType.TicketTypeID : 0,
      };
      setIsLoadingFarmersticket(true);
      const result = await getFarmerSupportTicketViewCSCData(formData);
      console.log(result, "result");
      setIsLoadingFarmersticket(false);
      let totalStsCnt = 0;
      const jsonStatusCnt = { Open: "0", InProgress: "0", Resolved: "0", ReOpen: "0" };
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.supportTicket && result.response.responseData.status) {
          setFarmersTicketData(result.response.responseData.supportTicket);

          result.response.responseData.status.forEach((v) => {
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
            totalStsCnt += Number(v.Total);
          });
          settotalSatatusCount(totalStsCnt.toString());
          setSatatusCount([jsonStatusCnt]);
          if (showHideDownload === false) {
            if (result.response.responseData.supportTicket.length > 0) {
              setTimeout(() => {
                // A const excelParams = {
                // A  fileName: `Ticket_Data_${dateToSpecificFormat(formValues.txtFromDate, "DD-MM-YYYY")}`,
                // A };
                // A gridApi.exportDataAsExcel(excelParams);
                const columnOrder = {
                  FarmerSupportTicketNo: "Ticket No",
                  ApplicationNo: "Application No",
                  InsurancePolicyNo: "Policy No",
                  TicketStatus: "Ticket Status",
                  CallerContactNumber: "Caller Mobile No",
                  RequestorName: "Farmer Name",
                  MobileNumber: "Mobile No",
                  StateMasterName: "State",
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
                  CreatedBY: "Created By",
                  CreatedAt: "Created At",
                };
                const mappedData = result.response.responseData.supportTicket.map((value) => {
                  return {
                    FarmerSupportTicketNo: value.FarmerSupportTicketNo,
                    ApplicationNo: value.ApplicationNo,
                    InsurancePolicyNo: value.InsurancePolicyNo,
                    TicketStatus: value.TicketStatus,
                    CallerContactNumber: value.CallerContactNumber,
                    RequestorName: value.RequestorName,
                    MobileNumber: value.MobileNumber,
                    StateMasterName: value.StateMasterName,
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
          message: result.response.responseMessage,
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

  const getFarmersTicketsStatusCount = async (pviewTYP) => {
    try {
      const formData = {
        insuranceCompanyID: formValues.txtInsuranceCompany && formValues.txtInsuranceCompany.CompanyID ? formValues.txtInsuranceCompany.CompanyID : 0,
        viewTYP: pviewTYP,
        stateID: formValues.txtState && formValues.txtState.length > 0 ? formValues.txtState.map((x) => x.value.toString()).join(",") : "",
        supportTicketID: 0,
        ticketCategoryID: formValues.txtTicketCategory && formValues.txtTicketCategory.TicketCategoryID ? formValues.txtTicketCategory.TicketCategoryID : 0,
        ticketSourceID: 0,
        supportTicketTypeID:
          formValues.txtTicketCategoryType && formValues.txtTicketCategoryType.SupportTicketTypeID ? formValues.txtTicketCategoryType.SupportTicketTypeID : 0,
        supportTicketNo: "",
        statusID: formValues.txtStatus && formValues.txtStatus.CommonMasterValueID ? formValues.txtStatus.CommonMasterValueID : 0,
        fromdate: formValues.txtFromDate ? dateToCompanyFormat(formValues.txtFromDate) : "",
        toDate: formValues.txtToDate ? dateToCompanyFormat(formValues.txtToDate) : "",
        RequestorMobileNo: "",
        schemeID: 0,
        ticketHeaderID: 0,
      };

      const result = await getFarmerSupportTicketViewCSCData(formData);
      let totalStsCnt = 0;
      const jsonStatusCnt = { Open: "0", InProgress: "0", Resolved: "0", ReOpen: "0" };
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.supportTicket && result.response.responseData.status) {
          result.response.responseData.status.forEach((v) => {
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
          message: result.response.responseMessage,
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

  const getFarmersTicketsWithOutLoader = async () => {
    try {
      const formData = {
        insuranceCompanyID: formValues.txtInsuranceCompany && formValues.txtInsuranceCompany.CompanyID ? formValues.txtInsuranceCompany.CompanyID : 0,
        viewTYP: "FILTER",
        stateID: formValues.txtState && formValues.txtState.length > 0 ? formValues.txtState.map((x) => x.value.toString()).join(",") : "",
        supportTicketID: 0,
        ticketCategoryID: formValues.txtTicketCategory && formValues.txtTicketCategory.TicketCategoryID ? formValues.txtTicketCategory.TicketCategoryID : 0,
        ticketSourceID: 0,
        supportTicketTypeID:
          formValues.txtTicketCategoryType && formValues.txtTicketCategoryType.SupportTicketTypeID ? formValues.txtTicketCategoryType.SupportTicketTypeID : 0,
        supportTicketNo: "",
        statusID: formValues.txtStatus && formValues.txtStatus.CommonMasterValueID ? formValues.txtStatus.CommonMasterValueID : 0,
        fromdate: formValues.txtFromDate ? dateToCompanyFormat(formValues.txtFromDate) : "",
        toDate: formValues.txtToDate ? dateToCompanyFormat(formValues.txtToDate) : "",
        RequestorMobileNo: "",
        schemeID: 0,
        ticketHeaderID: formValues.txtTicketType && formValues.txtTicketType.TicketTypeID ? formValues.txtTicketType.TicketTypeID : 0,
      };

      const result = await getFarmerSupportTicketViewCSCData(formData);
      console.log(result, "result");

      let totalStsCnt = 0;
      const jsonStatusCnt = { Open: "0", InProgress: "0", Resolved: "0", ReOpen: "0" };
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.supportTicket && result.response.responseData.status) {
          setFarmersTicketData(result.response.responseData.supportTicket);

          result.response.responseData.status.forEach((v) => {
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
          message: result.response.responseMessage,
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

  const updateFarmersTicketsStatusCount = () => {
    getFarmersTicketsStatusCount("FILTER");
  };

  const updateFilterState = (name, value) => {
    setFilterValues({ ...filterValues, [name]: value });
  };

  const searchByMobileTicketsOnClick = async () => {
    debugger;
    try {
      let ticketNoVal = "";
      let mobileNoVal = "";
      let pviewTYP = "";

      if (!filterValues.SearchByFilter) {
        setAlertMessage({
          type: "error",
          message: "Please select search type.",
        });
        return;
      }

      if (filterValues.SearchByFilter.value === "1") {
        const regex = new RegExp("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$");
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
        ticketNoVal = filterValues.txtSearchFilter;
        pviewTYP = "TICKET";
      }

      const formData = {
        insuranceCompanyID: 0,
        viewTYP: pviewTYP,
        stateID: "",
        supportTicketID: 0,
        ticketCategoryID: 0,
        ticketSourceID: 0,
        supportTicketTypeID: 0,
        supportTicketNo: ticketNoVal,
        statusID: 0,
        fromdate: "",
        toDate: "",
        RequestorMobileNo: mobileNoVal,
        schemeID: 0,
        ticketHeaderID: 0,
      };
      setIsLoadingFarmersticket(true);
      const result = await getFarmerSupportTicketViewCSCData(formData);
      console.log(result, "result");
      setIsLoadingFarmersticket(false);
      let totalStsCnt = 0;
      const jsonStatusCnt = { Open: "0", InProgress: "0", Resolved: "0", ReOpen: "0" };
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.supportTicket && result.response.responseData.status) {
          if (result.response.responseData.supportTicket.length > 0 && result.response.responseData.status.length > 0) {
            result.response.responseData.status.forEach((v) => {
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
              totalStsCnt += Number(v.Total);
            });
            settotalSatatusCount(totalStsCnt.toString());
            setSatatusCount([jsonStatusCnt]);
            setFarmersTicketData(result.response.responseData.supportTicket);
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
          message: result.response.responseMessage,
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
      console.log(result, "ticketSourceList");
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
      console.log(result, "ticktCategoryType");
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
      console.log(result, "ticketStatus");
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
      console.log(result, "Insurance Comapny");
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
      console.log(result, "Scheme Data");
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
  };

  const refereshFarmerTicket = () => {
    getFarmersTickets("FILTER", "");
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
      txtScheme: null,
      txtFromDate: "",
      txtToDate: "",
      txtScheme: null,
    });
    setTicketCategoryTypeList([]);
    setTicketCategoryList([]);
    getFarmersTickets("FILTER");
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
      txtScheme: null,
      txtFromDate: "",
      txtToDate: "",
      txtScheme: null,
    });
    setTicketCategoryTypeList([]);
    setTicketCategoryList([]);
  };

  const getOneDayTicketData = async () => {
    debugger;
    setshowHideDownload(false);
    SetTicketFiltersTab();
  };

  const getFilterTicketsClick = async () => {
    debugger;
    setshowHideDownload(true);
    SetTicketFiltersTab();
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
    updateFarmersTicketsStatusCount,
    filterValues,
    setFilterValues,
    getFarmersTicketsWithOutLoader,
    onGridReady,
    getOneDayTicketData,
    getFilterTicketsClick,
    showHideDownload,
  };
}

export default FarmerEnquiryTicketsLogics;
