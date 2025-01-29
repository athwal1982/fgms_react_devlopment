import { useState, useEffect } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import moment from "moment";
import { dateToCompanyFormat, dateToSpecificFormat, dateFormatDefault, daysdifference } from "Configration/Utilities/dateformat";
import * as XLSX from "xlsx";
import { cSCInboundVoiceSelectApi } from "../Services/Methods";

function CSCInboundVoiceLogics() {
  const [formValues, setFormValues] = useState({
    txtFromDate: dateToSpecificFormat(moment().subtract(1, "days"), "YYYY-MM-DD"),
    txtToDate: dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD"),
  });

  const [CSCInboundVoiceDataList, setCSCInboundVoiceDataList] = useState(false);
  const [filteredCSCInboundVoiceDataList, setFilteredCSCInboundVoiceDataList] = useState([]);
  const [isLoadingCSCInboundVoiceDataList, setLoadingCSCInboundVoiceDataList] = useState(false);
  const setAlertMessage = AlertMessage();

  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
    console.log(params.api);
    setGridApi(params.api);
  };

  const [CSCInboundVoiceListItemSearch, setCSCInboundVoiceListItemSearch] = useState("");
  const onChangeCSCInboundVoiceList = (val) => {
    debugger;
    setCSCInboundVoiceListItemSearch(val);
    gridApi.setQuickFilter(val);
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
      { width: 15 },
      { width: 20 },
      { width: 18 },
      { width: 22 },
      { width: 22 },
      { width: 15 },
      { width: 35 },
      { width: 35 },
      { width: 22 },
      { width: 35 },
      { width: 20 },
    ];
    XLSX.writeFile(workbook, "CSC_Inbound_Calls.xlsx");
  };

  const rearrangeAndRenameColumns = (originalData, columnMapping) => {
    return originalData.map((item) => {
      const rearrangedItem = Object.fromEntries(Object.entries(columnMapping).map(([oldColumnName, newColumnName]) => [newColumnName, item[oldColumnName]]));
      return rearrangedItem;
    });
  };

  const getCSCInboundVoiceData = async () => {
    debugger;
    try {
      setLoadingCSCInboundVoiceDataList(true);

      const formData = {
        fromDate: formValues.txtFromDate ? dateToCompanyFormat(formValues.txtFromDate) : "",
        toDate: formValues.txtToDate ? dateToCompanyFormat(formValues.txtToDate) : "",
        batchID: "",
      };
      const result = await cSCInboundVoiceSelectApi(formData);
      setLoadingCSCInboundVoiceDataList(false);
      if (result.responseCode === 1) {
        if (CSCInboundVoiceListItemSearch && CSCInboundVoiceListItemSearch.toLowerCase().includes("#")) {
          onChangeCSCInboundVoiceList("");
        }
        setCSCInboundVoiceDataList(result.responseData.data.report);
        setFilteredCSCInboundVoiceDataList(result.responseData.data.report);
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

  const getCSCInboundVoiceList = () => {
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
    getCSCInboundVoiceData();
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
    if (CSCInboundVoiceDataList.length === 0) {
      setAlertMessage({
        type: "error",
        message: "Data not found to download.",
      });
      return;
    }
    const columnOrder = {
      BatchID: "BatchID",
      CustomerNumber: "Customer Number",
      State: "State",
      District: "District",
      CallDateTime: "Call Date Time",
      CallStatus: "Call Status",
      Languages: "Languages",
      LangRes: "LangRes",
      UserName: "User Name",
      Reason: "Reason",
      PathTaken: "Path Taken",
      CallSummary: "Call Summary",
      AudioFile: "Audio File",
      InsertDateTime: "Created At",
    };
    const mappedData = CSCInboundVoiceDataList.map((value) => {
      return {
        BatchID: value.BatchID,
        CustomerNumber: value.CustomerNumber,
        State: value.State,
        District: value.District,
        CallDateTime: value.CallDateTime,
        CallStatus: value.CallStatus,
        Durations: value.Durations,
        Languages: value.Languages,
        LangRes: value.LangRes,
        UserName: value.UserName,
        Reason: value.Reason,
        PathTaken: value.PathTaken,
        CallSummary: value.CallSummary,
        AudioFile: value.AudioFile,
        InsertDateTime: value.InsertDateTime ? dateToSpecificFormat(value.InsertDateTime.split("T")[0], "DD-MM-YYYY HH:MM") : "",
      };
    });
    const rearrangedData = rearrangeAndRenameColumns(mappedData, columnOrder);
    downloadExcel(rearrangedData);
  };

  return {
    CSCInboundVoiceDataList,
    filteredCSCInboundVoiceDataList,
    isLoadingCSCInboundVoiceDataList,
    gridApi,
    onGridReady,
    onChangeCSCInboundVoiceList,
    CSCInboundVoiceListItemSearch,
    getCSCInboundVoiceList,
    formValues,
    updateState,
    isLoadingCSCInboundVoiceDataList,
    onClickClearSearchFilter,
    exportClick,
  };
}
export default CSCInboundVoiceLogics;
