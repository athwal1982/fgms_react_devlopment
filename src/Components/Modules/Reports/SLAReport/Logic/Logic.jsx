import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useState } from "react";
import moment from "moment";
import { dateToCompanyFormat, dateToSpecificFormat, getCurrentDateTimeTick, dateFormatDefault, daysdifference } from "Configration/Utilities/dateformat";
import * as XLSX from "xlsx";
import { fetchSLAReport } from "../Services/Methods";

function SLAReportLogic() {
  const setAlertMessage = AlertMessage();

  const [formValues, setFormValues] = useState({
    txtFromDate: dateToSpecificFormat(moment().subtract(2, "days"), "YYYY-MM-DD"),
    txtToDate: dateToSpecificFormat(moment().subtract(1, "days"), "YYYY-MM-DD"),
    txtTicketCategory: null,
  });

  const [ticketCategoryList] = useState([
    { label: "Monthly", value: "MONTH" },
    { label: "Daily", value: "" },
  ]);

  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
    console.log(params.api);
    setGridApi(params.api);
  };

  const updateState = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
    if (name === "txtTicketCategory") {
      setFilteredSLACallDataList([]);
      setSLACallReportDataList([]);
    }
  };

  const onClickClearSearchFilter = () => {
    setFormValues({
      txtFromDate: "",
      txtToDate: "",
      txtTicketCategory: null,
    });
  };

  const [SLACallReportDataList, setSLACallReportDataList] = useState([]);
  const [SLACallDataListItemSearch, setSLACallDataListItemSearch] = useState("");
  const onChangeSLACallDataList = (val) => {
    setSLACallDataListItemSearch(val);
    gridApi.setQuickFilter(val);
  };

  const downloadExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    worksheet["!cols"] = [{ width: 18 }, { width: 20 }, { width: 25 }, { width: 25 }, { width: 25 }, { width: 25 }, { width: 25 }];
    const UniqueDateTimeTick = getCurrentDateTimeTick();
    XLSX.writeFile(workbook, `SLAReport_${UniqueDateTimeTick}.xlsx`);
  };

  const rearrangeAndRenameColumns = (originalData, columnMapping) => {
    return originalData.map((item) => {
      const rearrangedItem = Object.fromEntries(Object.entries(columnMapping).map(([oldColumnName, newColumnName]) => [newColumnName, item[oldColumnName]]));
      return rearrangedItem;
    });
  };

  const [isLoadingSLACallDataList, setSLACallDataList] = useState(false);
  const [filteredSLACallDataList, setFilteredSLACallDataList] = useState([]);

  const getSLACallData = async () => {
    debugger;

    try {
      setSLACallDataList(true);
      if (!validateForm()) {
        setSLACallDataList(false);
        return;
      }
      const formData = {
        startDate: formValues.txtFromDate ? dateToCompanyFormat(formValues.txtFromDate) : "",
        endDate: formValues.txtToDate ? dateToCompanyFormat(formValues.txtToDate) : "",
        report_type: formValues.txtTicketCategory ? formValues.txtTicketCategory.value : null,
      };
      const result = await fetchSLAReport(formData.startDate, formData.endDate, formData.report_type);
      setSLACallDataList(false);
      if (result.responseCode === 1) {
        if (SLACallDataListItemSearch && SLACallDataListItemSearch.toLowerCase().includes("#")) {
          onChangeSLACallDataList("");
        }
        setSLACallReportDataList(result.responseData.data);
        setFilteredSLACallDataList(result.responseData.data);
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

  const validateForm = () => {
    if (!formValues.txtTicketCategory) {
      setAlertMessage({
        type: "error",
        message: "Please select Monthly Or Daily.",
      });
      return false;
    }
    return true;
  };

  const getSLACallDataList = () => {
    if (!validateForm()) {
      return;
    }
    debugger;
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
    getSLACallData();
  };

  const exportClick = () => {
    if (SLACallReportDataList.length === 0) {
      setAlertMessage({
        type: "error",
        message: "Data not found to download.",
      });
      return;
    }
    const columnOrder = {
      cs_date: "Date",
      // A user_group: "User Group",
      uptime: "System Uptime (%)",
      asa: "Avg Speed To Answer(%)",
      aht: "Avg Handle Time (%)",
      rating: "Call Quality Score (%)",
      training: "Training (Hours)",
      seat: "Seat Utilization(%)",
    };
    const mappedData = SLACallReportDataList.map((value) => {
      return {
        cs_date: value.cs_date,
        // A user_group: value.user_group,
        asa: value.asa,
        uptime: value.uptime,
        aht: value.aht,
        training: value.training,
        rating: value.rating,
        seat: value.seat,
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
    getSLACallDataList,
    isLoadingSLACallDataList,
    filteredSLACallDataList,
    onChangeSLACallDataList,
    exportClick,
    ticketCategoryList,
  };
}

export default SLAReportLogic;
