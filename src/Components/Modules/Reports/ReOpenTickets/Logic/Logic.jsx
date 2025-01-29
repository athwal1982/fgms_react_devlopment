import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useState } from "react";
import moment from "moment";
import { dateToCompanyFormat, dateToSpecificFormat, getCurrentDateTimeTick } from "Configration/Utilities/dateformat";
import * as XLSX from "xlsx";
import { convert } from "html-to-text";
import { GetSupportTicketReopenDetailReport } from "../Services/Methods";

function ReOpenTicketsLogic() {
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

  const [reOpenTicketsDataList, setReOpenTicketsDataList] = useState(false);
  const [reOpenTicketsDataListItemSearch, setReOpenTicketsDataListItemSearch] = useState("");
  const onChangeReOpenTicketsDataList = (val) => {
    debugger;
    setReOpenTicketsDataListItemSearch(val);
    gridApi.setQuickFilter(val);
  };

  const downloadExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    worksheet["!cols"] = [
      { width: 18 },
      { width: 22 },
      { width: 22 },
      { width: 55 },
      { width: 15 },
      { width: 12 },
      { width: 12 },
      { width: 18 },
      { width: 35 },
      { width: 18 },
      { width: 18 },
      { width: 18 },
      { width: 25 },
      { width: 25 },
      { width: 28 },
      { width: 15 },
      { width: 55 },
      { width: 15 },
      { width: 200 },
    ];
    const uniqueDateTimeTick = getCurrentDateTimeTick();
    XLSX.writeFile(workbook, `ReOpenTickets_${uniqueDateTimeTick}.xlsx`);
  };

  const rearrangeAndRenameColumns = (originalData, columnMapping) => {
    return originalData.map((item) => {
      const rearrangedItem = Object.fromEntries(Object.entries(columnMapping).map(([oldColumnName, newColumnName]) => [newColumnName, item[oldColumnName]]));
      return rearrangedItem;
    });
  };

  const [isLoadingReOpenTicketsDataList, setReOpenTicketsDataListLoading] = useState(false);
  const [filteredReOpenTicketsDataList, setFilteredReOpenTicketsDataList] = useState([]);

  const getReOpenTicketsData = async () => {
    debugger;
    try {
      setReOpenTicketsDataListLoading(true);

      const formData = {
        stateID: "#ALL",
        insuranceCompanyID: "#ALL",
        fromdate: formValues.txtFromDate ? dateToCompanyFormat(formValues.txtFromDate) : "",
        todate: formValues.txtToDate ? dateToCompanyFormat(formValues.txtToDate) : "",
      };
      const result = await GetSupportTicketReopenDetailReport(formData);
      setReOpenTicketsDataListLoading(false);
      if (result.responseCode === 1) {
        if (reOpenTicketsDataListItemSearch && reOpenTicketsDataListItemSearch.toLowerCase().includes("#")) {
          onChangeReOpenTicketsDataList("");
        }
        const reOpenTicketsData = Object.values(result.responseData.supportTicket).map((ticket) => {
          return {
            ...ticket,
            REOpenDate: ticket.REOpenDate ? moment(ticket.REOpenDate).format("DD-MM-YYYY") : "",
            TicketDate: ticket.TicketDate ? moment(ticket.TicketDate).format("DD-MM-YYYY") : "",
            StatusDate: ticket.StatusDate ? moment(ticket.StatusDate).format("DD-MM-YYYY") : "",
          };
        });
        setReOpenTicketsDataList(reOpenTicketsData);
        setFilteredReOpenTicketsDataList(reOpenTicketsData);
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

  const getReOpenTicketsDataList = () => {
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
    // A const dateDiffrence = daysdifference(dateFormatDefault(formValues.txtFromDate), dateFormatDefault(formValues.txtToDate));
    // A if (dateDiffrence > 31) {
    // A  setAlertMessage({
    // A    type: "error",
    // A    message: "1 month date range is allowed only",
    // A  });
    // A  return;
    // A }
    getReOpenTicketsData();
  };

  const exportClick = () => {
    debugger;
    if (reOpenTicketsDataList.length === 0) {
      setAlertMessage({
        type: "error",
        message: "Data not found to download.",
      });
      return;
    }

    const columnOrder = {
      SupportTicketNo: "Support Ticket No",
      ApplicationNo: "Application No",
      InsurancePolicyNo: "Insurance Policy No",
      InsuranceMasterName: "Insurance Company",
      REOpenDate: "Re-Open Date",
      RequestYear: "Year",
      CropSeasonName: "Season",
      RequestYear: "Year",
      RequestorMobileNo: "Mobile No",
      RequestorName: "Farmer Name",
      StateMasterName: "State",
      DistrictMasterName: "District",
      StatusDate: "Status Date",
      TicketHeadName: "Type",
      SupportTicketTypeName: "Category",
      TicketCategoryName: "Sub Category",
      TicketDate: "Ticket Date",
      TicketDescription: "Description",
      TicketStatus: "Ticket Status",
      Remarks: "Remarks",
    };

    const options = {
      wordwrap: 130,
      // ...
    };

    const mappedData = reOpenTicketsDataList.map((value) => {
      return {
        ApplicationNo: value.ApplicationNo,
        CallerContactNumber: value.CallerContactNumber,
        CropSeasonName: value.CropSeasonName,
        DistrictMasterName: value.DistrictMasterName,
        InsuranceMasterName: value.InsuranceMasterName,
        InsurancePolicyNo: value.InsurancePolicyNo,
        REOpenDate: value.REOpenDate,
        RequestYear: value.RequestYear,
        RequestorMobileNo: value.RequestorMobileNo,
        RequestorName: value.RequestorName,
        StateMasterName: value.StateMasterName,
        StatusDate: value.StatusDate,
        SupportTicketNo: value.SupportTicketNo,
        SupportTicketTypeName: value.SupportTicketTypeName,
        TicketCategoryName: value.TicketCategoryName,
        TicketDate: value.TicketDate,
        TicketDescription: value.TicketDescription,
        TicketHeadName: value.TicketHeadName,
        TicketStatus: value.TicketStatus,
        Remarks: value.Remarks ? convert(value.Remarks, options) : "",
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
    getReOpenTicketsDataList,
    isLoadingReOpenTicketsDataList,
    filteredReOpenTicketsDataList,
    onChangeReOpenTicketsDataList,
    exportClick,
  };
}

export default ReOpenTicketsLogic;
