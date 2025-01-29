import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useState } from "react";
import moment from "moment";
import { dateToCompanyFormat, dateToSpecificFormat, getCurrentDateTimeTick } from "Configration/Utilities/dateformat";
import * as XLSX from "xlsx";
import { getUploadInvoiceData } from "../Services/Methods";

function CallLogDataLogic() {
  const setAlertMessage = AlertMessage();

  const [formValues, setFormValues] = useState({
    txtFromDate: dateToSpecificFormat(moment().subtract(1, "days"), "YYYY-MM-DD"),
    txtToDate: dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD"),
  });

  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
    console.log(params.api);
    setGridApi(params.api);
  };

  const updateState = (name, value) => {
    debugger;
    setFormValues({ ...formValues, [name]: value });
  };

  const onClickClearSearchFilter = () => {
    setFormValues({
      ...formValues,
      txtFromDate: "",
      txtToDate: "",
    });
  };
  const [CallLogHistoryDataList, setCallLogHistoryDataList] = useState(false);
  const [callLogDataListItemSearch, setCallLogDataListItemSearch] = useState("");
  const onChangeCallLogDataList = (val) => {
    debugger;
    setCallLogDataListItemSearch(val);
    gridApi.setQuickFilter(val);
  };
  const downloadExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    // A let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    // A XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    worksheet["!cols"] = [
      { width: 18 },
      { width: 15 },
      { width: 25 },
      { width: 15 },
      { width: 30 },
      { width: 30 },
      { width: 30 },
      { width: 30 },
      { width: 18 },
      { width: 15 },
      { width: 15 },
      { width: 25 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 30 },
      { width: 20 },
    ];
    const UniqueDateTimeTick = getCurrentDateTimeTick();
    XLSX.writeFile(workbook, `BillingData_${UniqueDateTimeTick}.xlsx`);
  };
  const rearrangeAndRenameColumns = (originalData, columnMapping) => {
    return originalData.map((item) => {
      const rearrangedItem = Object.fromEntries(Object.entries(columnMapping).map(([oldColumnName, newColumnName]) => [newColumnName, item[oldColumnName]]));
      return rearrangedItem;
    });
  };

  const [isLoadingCallLogDataList, setCallLogDataList] = useState(false);
  const [filteredCallLogDataList, setFilteredCallLogDataList] = useState([]);

  const getCallLogData = async () => {
    debugger;
    try {
      setCallLogDataList(true);

      const formData = {
        fromdate: formValues.txtFromDate ? dateToCompanyFormat(formValues.txtFromDate) : "",
        todate: formValues.txtToDate ? dateToCompanyFormat(formValues.txtToDate) : "",
      };
      const result = await getUploadInvoiceData(formData);
      setCallLogDataList(false);
      if (result.responseCode === 1) {
        if (callLogDataListItemSearch && callLogDataListItemSearch.toLowerCase().includes("#")) {
          onChangeCallLogDataList("");
        }
        const callLogData = Object.values(result.responseData.invoicedata[0]);
        setCallLogHistoryDataList(callLogData);
        setFilteredCallLogDataList(callLogData);
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

  const getCallLogDataList = () => {
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
    getCallLogData();
  };
  const exportClick = () => {
    debugger;
    // A const excelParams = {
    // A  fileName: "Ticket History",
    // A };
    // A gridApi.exportDataAsExcel(excelParams);
    if (CallLogHistoryDataList.length === 0) {
      setAlertMessage({
        type: "error",
        message: "Data not found to download.",
      });
      return;
    }
    const columnOrder = {
      CustomerNumber: "Customer Number",
      Campaign: "Campaign",
      STATUS: "Status",
      AgentID: "Agent ID",
      CallStartTime: "Call Start Time",
      CallEndTime: "Call End Time",
      AgentCallStartTime: "Agent Call Start Time",
      AgentCallEndTime: "Agent Call End Time",
      CustomerCallSec: "Customer Call Sec",
      QueueSeconds: "Queue Seconds",
      AgentTalkTime: "Agent TalkTime",
      UniqueID: "Unique ID",
      TransferStatus: "Transfer Status",
      CustomerPulse: "Customer Pulse",
      DATE: "Date",
      ICName: "IC name",
      ICStatus: "IC Status",
    };
    const mappedData = CallLogHistoryDataList.map((value) => {
      return {
        CustomerNumber: value.CustomerNumber,
        Campaign: value.Campaign,
        STATUS: value.STATUS,
        AgentID: value.AgentID,
        CallStartTime: value.CallStartTime,
        CallEndTime: value.CallEndTime,
        AgentCallStartTime: value.AgentCallStartTime,
        AgentCallEndTime: value.AgentCallEndTime,
        CustomerCallSec: value.CustomerCallSec,
        QueueSeconds: value.QueueSeconds,
        AgentTalkTime: value.AgentTalkTime,
        UniqueID: value.UniqueID,
        TransferStatus: value.TransferStatus,
        CustomerPulse: value.CustomerPulse,
        DATE: value.DATE,
        ICName: value.ICName,
        ICStatus: value.ICStatus,
      };
    });
    const rearrangedData = rearrangeAndRenameColumns(mappedData, columnOrder);
    downloadExcel(rearrangedData);
  };

  return {
    formValues,
    updateState,
    onGridReady,
    gridApi,
    onClickClearSearchFilter,
    getCallLogDataList,
    isLoadingCallLogDataList,
    filteredCallLogDataList,
    onChangeCallLogDataList,
    exportClick,
  };
}

export default CallLogDataLogic;
