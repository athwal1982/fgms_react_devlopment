import { useState, useEffect } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import moment from "moment";
import { dateToCompanyFormat, dateToSpecificFormat, dateFormatDefault, daysdifference, Convert24FourHourAndMinute } from "Configration/Utilities/dateformat";
import * as XLSX from "xlsx";
import { farmerSelectCallingHistory } from "../Services/Methods";
import { getMasterDataBindingDataList } from "../../../Support/ManageTicket/Views/Modals/AddTicket/Services/Methods";

function FarmerCallingHistoryLogics() {
  const [formValues, setFormValues] = useState({
    txtFromDate: dateToSpecificFormat(moment().subtract(1, "days"), "YYYY-MM-DD"),
    txtToDate: dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD"),
    txtState: null,
  });

  const [FarmerCallingHistoryDataList, setFarmerCallingHistoryDataList] = useState(false);
  const [filteredFarmerCallingHistoryDataList, setFilteredFarmerCallingHistoryDataList] = useState([]);
  const [isLoadingFarmerCallingHistoryDataList, setLoadingFarmerCallingHistoryDataList] = useState(false);
  const setAlertMessage = AlertMessage();

  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
    console.log(params.api);
    setGridApi(params.api);
  };

  const [FarmerCallingHistoryListItemSearch, setFarmerCallingHistoryListItemSearch] = useState("");
  const onChangeFarmerCallingHistoryList = (val) => {
    debugger;
    setFarmerCallingHistoryListItemSearch(val);
    gridApi.setQuickFilter(val);
  };

  const downloadExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    // A let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    // A XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    worksheet["!cols"] = [{ width: 20 },{ width: 20 }, { width: 10 }, { width: 25 }, { width: 15 }, { width: 15 }, { width: 35 }, { width: 35 }, { width: 20 }];
    XLSX.writeFile(workbook, "Farmer_Calling_History.xlsx");
  };

  const rearrangeAndRenameColumns = (originalData, columnMapping) => {
    return originalData.map((item) => {
      const rearrangedItem = Object.fromEntries(Object.entries(columnMapping).map(([oldColumnName, newColumnName]) => [newColumnName, item[oldColumnName]]));
      return rearrangedItem;
    });
  };

  const getFarmerCallingHistoryData = async () => {
    debugger;
    try {
      setLoadingFarmerCallingHistoryDataList(true);

      const formData = {
        fromDate: formValues.txtFromDate ? dateToCompanyFormat(formValues.txtFromDate) : "",
        toDate: formValues.txtToDate ? dateToCompanyFormat(formValues.txtToDate) : "",
        stateCodeAlpha: formValues.txtState && formValues.txtState.StateCodeAlpha ? formValues.txtState.StateCodeAlpha : "",
      };
      const result = await farmerSelectCallingHistory(formData);
      setLoadingFarmerCallingHistoryDataList(false);
      if (result.responseCode === 1) {
        if (FarmerCallingHistoryListItemSearch && FarmerCallingHistoryListItemSearch.toLowerCase().includes("#")) {
          onChangeFarmerCallingHistoryList("");
        }
        setFarmerCallingHistoryDataList(result.responseData.report);
        setFilteredFarmerCallingHistoryDataList(result.responseData.report);
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

  const getFarmerCallingHistoryList = () => {
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
    getFarmerCallingHistoryData();
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
    // A const excelParams = {
    // A  fileName: "Ticket History",
    // A };
    // A gridApi.exportDataAsExcel(excelParams);
    if (FarmerCallingHistoryDataList.length === 0) {
      setAlertMessage({
        type: "error",
        message: "Data not found to download.",
      });
      return;
    }
    const columnOrder = {
      CallingUniqueID: "Calling ID",
      CallerMobileNumber: "Caller Mobile No.",
      CallStatus: "Call Status",
      FarmerName: "Farmer Name",
      StateMasterName: "State",
      DistrictMasterName: "District",
      IsRegistered: "Is Registred",
      Reason: "Reason",
      InsertDateTime: "Created At",
    };
    const mappedData = FarmerCallingHistoryDataList.map((value) => {
      return {
        CallingUniqueID: value.CallingUniqueID,
        CallerMobileNumber: value.CallerMobileNumber,
        CallStatus: value.CallStatus,
        FarmerName: value.FarmerName,
        StateMasterName: value.StateMasterName,
        DistrictMasterName: value.DistrictMasterName,
        IsRegistered: value.IsRegistered
          ? value.IsRegistered === "U"
            ? "Unregistred Farmer"
            : value.IsRegistered === "R"
            ? "Registred Farmer"
            : value.IsRegistered === "D"
            ? "Farmer registred with duplicate number"
            : ""
          : "",
        Reason: value.Reason,
        InsertDateTime: value.InsertDateTime
        ? dateToSpecificFormat(`${value.InsertDateTime.split("T")[0]} ${Convert24FourHourAndMinute(value.InsertDateTime.split("T")[1])}`, "DD-MM-YYYY HH:mm")
        : "",
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
      const formdata = {
        filterID: 0,
        filterID1: 0,
        masterName: "STATEMAS",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBindingDataList(formdata);
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
    debugger;
    getStateListData();
  }, []);

  return {
    FarmerCallingHistoryDataList,
    filteredFarmerCallingHistoryDataList,
    isLoadingFarmerCallingHistoryDataList,
    stateList,
    isLoadingStateList,
    gridApi,
    onGridReady,
    onChangeFarmerCallingHistoryList,
    FarmerCallingHistoryListItemSearch,
    getFarmerCallingHistoryList,
    formValues,
    updateState,
    isLoadingFarmerCallingHistoryDataList,
    onClickClearSearchFilter,
    exportClick,
  };
}
export default FarmerCallingHistoryLogics;
