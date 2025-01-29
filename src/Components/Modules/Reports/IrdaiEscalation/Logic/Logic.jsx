import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useState } from "react";
import moment from "moment";
import { dateToCompanyFormat, dateToSpecificFormat, dateFormatDefault, daysdifference } from "Configration/Utilities/dateformat";
import * as XLSX from "xlsx";
import { complaintMailReport } from "../Services/Methods";

function IrdaiEscalationLogics() {
  const [formValues, setFormValues] = useState({
    txtFromDate: dateToSpecificFormat(moment().subtract(1, "days"), "YYYY-MM-DD"),
    txtToDate: dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD"),
  });

  const [irdaiEscalationDataList, setIrdaiEscalationDataList] = useState(false);
  const [filteredIrdaiEscalationDataList, setFilteredIrdaiEscalationDataList] = useState([]);
  const [isLoadingIrdaiEscalationDataList, setLoadingIrdaiEscalationDataList] = useState(false);
  const setAlertMessage = AlertMessage();

  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
    console.log(params.api);
    setGridApi(params.api);
  };

  const [IrdaiEscalationListItemSearch, setIrdaiEscalationListItemSearch] = useState("");
  const onChangeIrdaiEscalationList = (val) => {
    debugger;
    setIrdaiEscalationListItemSearch(val);
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
      { width: 25 },
      { width: 55 },
      { width: 22 },
      { width: 22 },
      { width: 20 },
    ];
    XLSX.writeFile(workbook, "Irdai_Esclation.xlsx");
  };

  const rearrangeAndRenameColumns = (originalData, columnMapping) => {
    return originalData.map((item) => {
      const rearrangedItem = Object.fromEntries(Object.entries(columnMapping).map(([oldColumnName, newColumnName]) => [newColumnName, item[oldColumnName]]));
      return rearrangedItem;
    });
  };

  const getIrdaiEscalationData = async () => {
    debugger;
    try {
      setLoadingIrdaiEscalationDataList(true);

      const formData = {
        fromdate: formValues.txtFromDate ? dateToCompanyFormat(formValues.txtFromDate) : "",
        toDate: formValues.txtToDate ? dateToCompanyFormat(formValues.txtToDate) : "",
      };
      const result = await complaintMailReport(formData);
      setLoadingIrdaiEscalationDataList(false);
      if (result.responseCode === 1) {
        if (IrdaiEscalationListItemSearch && IrdaiEscalationListItemSearch.toLowerCase().includes("#")) {
          onChangeIrdaiEscalationList("");
        }
        setIrdaiEscalationDataList(result.responseData.supportTicket);
        setFilteredIrdaiEscalationDataList(result.responseData.supportTicket);
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

  const getIrdaiEscalationList = () => {
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
    getIrdaiEscalationData();
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
    if (irdaiEscalationDataList.length === 0) {
      setAlertMessage({
        type: "error",
        message: "Data not found to download.",
      });
      return;
    }
    const columnOrder = {
      SupportTicketNo: "Ticket No",
      TicketDate: "Creation Date",
      StatusUpdateTime: "Status Date",
      MailSentOn: "Mail Sent On",
      InsuranceShortCode: "Insurance Company Code",
      InsuranceMasterName: "Insurance Company",
      TicketHeadName: "Type",
      SupportTicketTypeName: "Category",
      StateMasterName: "State",
    };
    const mappedData = irdaiEscalationDataList.map((value) => {
      return {
        SupportTicketNo: value.SupportTicketNo,
        StateMasterName: value.StateMasterName,
        InsuranceShortCode: value.InsuranceShortCode,
        InsuranceMasterName: value.InsuranceMasterName,
        TicketHeadName: value.TicketHeadName,
        SupportTicketTypeName: value.SupportTicketTypeName,
        StatusUpdateTime: value.StatusUpdateTime ? dateToSpecificFormat(value.StatusUpdateTime.split("T")[0], "DD-MM-YYYY") : "",
        TicketDate: value.TicketDate ? dateToSpecificFormat(value.TicketDate.split("T")[0], "DD-MM-YYYY") : "",
        MailSentOn: value.MailSentOn ? dateToSpecificFormat(value.MailSentOn.split("T")[0], "DD-MM-YYYY") : "",
      };
    });
    const rearrangedData = rearrangeAndRenameColumns(mappedData, columnOrder);
    downloadExcel(rearrangedData);
  };

  return {
    irdaiEscalationDataList,
    filteredIrdaiEscalationDataList,
    isLoadingIrdaiEscalationDataList,
    gridApi,
    onGridReady,
    onChangeIrdaiEscalationList,
    IrdaiEscalationListItemSearch,
    getIrdaiEscalationList,
    formValues,
    updateState,
    isLoadingIrdaiEscalationDataList,
    onClickClearSearchFilter,
    exportClick,
  };
}
export default IrdaiEscalationLogics;
