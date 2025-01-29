import { useState, useEffect } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import moment from "moment";
import { dateToCompanyFormat, dateToSpecificFormat, dateFormatDefault, daysdifference } from "Configration/Utilities/dateformat";
import * as XLSX from "xlsx";
import { aggregrationSupportTicketReport } from "../Services/Methods";

function DashboardTicketCountLogics() {
  const [formValues, setFormValues] = useState({
    txtYearFilter: null,
    txtMonthFilter: null,
  });

  const [monthList] = useState([
    { label: "Jan", value: 1 },
    { label: "Feb", value: 2 },
    { label: "Mar", value: 3 },
    { label: "Apr", value: 4 },
    { label: "May", value: 5 },
    { label: "Jun", value: 6 },
    { label: "Jul", value: 7 },
    { label: "Aug", value: 8 },
    { label: "Sep", value: 9 },
    { label: "Oct", value: 10 },
    { label: "Nov", value: 11 },
    { label: "Dec", value: 12 },
  ]);
  const [yearList, setYearList] = useState([]);

  const [DashboardTicketCountDataList, setDashboardTicketCountDataList] = useState(false);
  const [filteredDashboardTicketCountDataList, setFilteredDashboardTicketCountDataList] = useState([]);
  const [isLoadingDashboardTicketCountDataList, setLoadingDashboardTicketCountDataList] = useState(false);
  const setAlertMessage = AlertMessage();

  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
    console.log(params.api);
    setGridApi(params.api);
  };

  const [DashboardTicketCountListItemSearch, setDashboardTicketCountListItemSearch] = useState("");
  const onChangeDashboardTicketCountList = (val) => {
    debugger;
    setDashboardTicketCountListItemSearch(val);
    gridApi.setQuickFilter(val);
  };

  const downloadExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    // A let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    // A XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    // Calculate totals for each numeric column
    const totals = {};
    const columnKeys = Object.keys(data[0]); // Assumes all rows have the same keys

    columnKeys.forEach((key) => {
      if (typeof data[0][key] === "number") {
        totals[key] = data.reduce((sum, row) => sum + (row[key] || 0), 0); // Sum values in each column
      } else {
        totals[key] = "Total"; // Label for non-numeric columns
      }
    });

    // Append totals row to worksheet
    XLSX.utils.sheet_add_json(worksheet, [totals], { skipHeader: true, origin: -1 });
    worksheet["!cols"] = [{ width: 60 }, { width: 15 }, { width: 15 }, { width: 15 }, { width: 20 }, { width: 15 }, { width: 15 }];
    XLSX.writeFile(
      workbook,
      `Dashboard_Ticket_Count${formValues.txtYearFilter && formValues.txtYearFilter.label ? `_${formValues.txtYearFilter.label}` : ""}${
        formValues.txtMonthFilter && formValues.txtMonthFilter.label ? `_${formValues.txtMonthFilter.label}` : ""
      }.xlsx`,
    );
  };

  const rearrangeAndRenameColumns = (originalData, columnMapping) => {
    return originalData.map((item) => {
      const rearrangedItem = Object.fromEntries(Object.entries(columnMapping).map(([oldColumnName, newColumnName]) => [newColumnName, item[oldColumnName]]));
      return rearrangedItem;
    });
  };

  const getDashboardTicketCountData = async () => {
    debugger;
    try {
      let formattedStartDate = "";
      let formattedEndDate = "";
      if (formValues.txtYearFilter !== null && formValues.txtMonthFilter !== null) {
        const year = formValues.txtYearFilter.value;
        const month = formValues.txtMonthFilter.value;
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        formattedStartDate = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}-${String(startDate.getDate()).padStart(2, "0")}`;
        formattedEndDate = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;
      }

      setLoadingDashboardTicketCountDataList(true);

      const formData = {
        fromdate: formattedStartDate,
        toDate: formattedEndDate,
      };
      const result = await aggregrationSupportTicketReport(formData);
      setLoadingDashboardTicketCountDataList(false);
      if (result.responseCode === 1) {
        if (DashboardTicketCountListItemSearch && DashboardTicketCountListItemSearch.toLowerCase().includes("#")) {
          onChangeDashboardTicketCountList("");
        }
        setDashboardTicketCountDataList(result.responseData.status);
        setFilteredDashboardTicketCountDataList(result.responseData.status);
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

  const getDashboardTicketCountList = () => {
    if (formValues.txtYearFilter !== null && formValues.txtMonthFilter === null) {
      setAlertMessage({
        type: "error",
        message: "Please select month",
      });
      return;
    }
    if (formValues.txtMonthFilter !== null && formValues.txtYearFilter === null) {
      setAlertMessage({
        type: "error",
        message: "Please select year",
      });
      return;
    }
    getDashboardTicketCountData();
  };

  const onClickClearSearchFilter = () => {
    setFormValues({
      ...formValues,
      txtYearFilter: null,
      txtMonthFilter: null,
    });
  };

  const exportClick = () => {
    debugger;
    // A const excelParams = {
    // A  fileName: "Ticket History",
    // A };
    // A gridApi.exportDataAsExcel(excelParams);
    if (DashboardTicketCountDataList.length === 0) {
      setAlertMessage({
        type: "error",
        message: "Data not found to download.",
      });
      return;
    }
    const columnOrder = {
      InsuranceMasterName: "Insurance Company",
      OPEN: "Open",
      InProgress: "In-Progress",
      Resolved: "Resolved",
      ResolvedInformation: "Resolved(Information)",
      ReOpen: "Re-Open",
      Total: "Total",
    };
    const mappedData = DashboardTicketCountDataList.map((value) => {
      return {
        InsuranceMasterName: value.InsuranceMasterName,
        OPEN: value.OPEN ? Number(value.OPEN) : 0,
        InProgress: value.InProgress ? Number(value.InProgress) : 0,
        Resolved: value.Resolved ? Number(value.Resolved) : 0,
        ResolvedInformation: value.ResolvedInformation ? Number(value.ResolvedInformation) : 0,
        ReOpen: value.ReOpen ? Number(value.ReOpen) : 0,
        Total:
          (value.OPEN ? Number(value.OPEN) : 0) +
          (value.InProgress ? Number(value.InProgress) : 0) +
          (value.Resolved ? Number(value.Resolved) : 0) +
          (value.ResolvedInformation ? Number(value.ResolvedInformation) : 0) +
          (value.ReOpen ? Number(value.ReOpen) : 0),
      };
    });
    const rearrangedData = rearrangeAndRenameColumns(mappedData, columnOrder);
    downloadExcel(rearrangedData);
  };

  useEffect(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const yearArray = [];
    for (let i = 2023; i <= currentYear; i += 1) {
      yearArray.push({ label: i.toString(), value: i.toString() });
    }
    setYearList(yearArray.sort().reverse());
  }, []);
  return {
    DashboardTicketCountDataList,
    filteredDashboardTicketCountDataList,
    isLoadingDashboardTicketCountDataList,
    gridApi,
    onGridReady,
    onChangeDashboardTicketCountList,
    DashboardTicketCountListItemSearch,
    getDashboardTicketCountList,
    formValues,
    updateState,
    isLoadingDashboardTicketCountDataList,
    onClickClearSearchFilter,
    exportClick,
    monthList,
    yearList,
  };
}
export default DashboardTicketCountLogics;
