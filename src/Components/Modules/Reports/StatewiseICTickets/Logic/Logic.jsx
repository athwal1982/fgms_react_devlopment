import { useState, useEffect } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import moment from "moment";
import { dateToCompanyFormat, dateToSpecificFormat, dateFormatDefault, daysdifference } from "Configration/Utilities/dateformat";
import * as XLSX from "xlsx";
import { getMasterDataBinding } from "../../../Support/ManageTicket/Services/Methods";
import { aggregrationStateSupportTicketReport } from "../Services/Methods";

function StatewiseICTicketsLogics() {
  const [formValues, setFormValues] = useState({
    txtYearFilter: null,
    txtMonthFilter: null,
    txtStatusFilter: null,
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

  const [StatewiseICTicketsDataList, setStatewiseICTicketsDataList] = useState(false);
  const [filteredStatewiseICTicketsDataList, setFilteredStatewiseICTicketsDataList] = useState([]);
  const [isLoadingStatewiseICTicketsDataList, setLoadingStatewiseICTicketsDataList] = useState(false);
  const setAlertMessage = AlertMessage();

  const [ticketStatusList, setTicketStatusList] = useState([]);
  const [isLoadingTicketStatusList, setIsTicketStatusList] = useState(false);
  const getTicketStatusListData = async () => {
    debugger;
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

  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
    console.log(params.api);
    setGridApi(params.api);
  };

  const [StatewiseICTicketsListItemSearch, setStatewiseICTicketsListItemSearch] = useState("");
  const onChangeStatewiseICTicketsList = (val) => {
    debugger;
    setStatewiseICTicketsListItemSearch(val);
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
    worksheet["!cols"] = [
      { width: 60 },
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
      { width: 20 },
      { width: 20 },
    ];
    XLSX.writeFile(
      workbook,
      `Statewise_IC_Tickets${formValues.txtYearFilter && formValues.txtYearFilter.label ? `_${formValues.txtYearFilter.label}` : ""}${
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

  const getStatewiseICTicketsData = async () => {
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

      setLoadingStatewiseICTicketsDataList(true);

      const formData = {
        fromdate: formattedStartDate,
        toDate: formattedEndDate,
        ticketStatusID: formValues.txtStatusFilter && formValues.txtStatusFilter.CommonMasterValueID ? formValues.txtStatusFilter.CommonMasterValueID : 0,
      };
      const result = await aggregrationStateSupportTicketReport(formData);
      setLoadingStatewiseICTicketsDataList(false);
      if (result.responseCode === 1) {
        if (StatewiseICTicketsListItemSearch && StatewiseICTicketsListItemSearch.toLowerCase().includes("#")) {
          onChangeStatewiseICTicketsList("");
        }
        setStatewiseICTicketsDataList(result.responseData.status);
        setFilteredStatewiseICTicketsDataList(result.responseData.status);
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

  const getStatewiseICTicketsList = () => {
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
    getStatewiseICTicketsData();
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
    if (StatewiseICTicketsDataList.length === 0) {
      setAlertMessage({
        type: "error",
        message: "Data not found to download.",
      });
      return;
    }
    const columnOrder = {
      StateMasterName: "State",
      AIC: "AIC",
      Bajaj_Allianz: "Bajaj Allianz",
      // A Bharti_AXA_GIC: "Bharti_  AXA_GIC",
      Chola_MS: "Chola MS",
      Future_Generalli: "Future Generalli",
      HDFC_Ergo: "HDFC Ergo",
      ICICI_Lombard: "ICICI Lombard",
      IFFCO_TOKIO: "IFFCO TOKIO",
      Kshema_Insurance: "Kshema Insurance",
      NationalInsurance: "National Insurance",
      New_India_Assurance: "New India Assurance",
      Oriental_Insurance: "Oriental Insurance",
      Reliance_GIC: "Reliance GIC",
      Royal_Sundaram_GIC: "Royal Sundaram GIC",
      SBI_GIC: "SBI GIC",
      Shriram_GIC: "Shriram GIC",
      TATA_AIG: "TATA AIG",
      United_India: "United India",
      Universal_Sompo: "Universal Sompo",
      Total: "Total",
    };
    const mappedData = StatewiseICTicketsDataList.map((value) => {
      return {
        StateMasterName: value.StateMasterName,
        AIC: value.AIC ? Number(value.AIC) : 0,
        Bajaj_Allianz: value.Bajaj_Allianz ? Number(value.Bajaj_Allianz) : 0,
        // A Bharti_AXA_GIC: value.Bharti_AXA_GIC ? Number(value.Bharti_AXA_GIC) : 0,
        Chola_MS: value.Chola_MS ? Number(value.Chola_MS) : 0,
        Future_Generalli: value.Future_Generalli ? Number(value.Future_Generalli) : 0,
        HDFC_Ergo: value.HDFC_Ergo ? Number(value.HDFC_Ergo) : 0,
        ICICI_Lombard: value.ICICI_Lombard ? Number(value.ICICI_Lombard) : 0,
        IFFCO_TOKIO: value.IFFCO_TOKIO ? Number(value.IFFCO_TOKIO) : 0,
        Kshema_Insurance: value.Kshema_Insurance ? Number(value.Kshema_Insurance) : 0,
        NationalInsurance: value.NationalInsurance ? Number(value.NationalInsurance) : 0,
        New_India_Assurance: value.New_India_Assurance ? Number(value.New_India_Assurance) : 0,
        Oriental_Insurance: value.Oriental_Insurance ? Number(value.Oriental_Insurance) : 0,
        Reliance_GIC: value.Reliance_GIC ? Number(value.Reliance_GIC) : 0,
        Royal_Sundaram_GIC: value.Royal_Sundaram_GIC ? Number(value.Royal_Sundaram_GIC) : 0,
        SBI_GIC: value.SBI_GIC ? Number(value.SBI_GIC) : 0,
        Shriram_GIC: value.Shriram_GIC ? Number(value.Shriram_GIC) : 0,
        TATA_AIG: value.TATA_AIG ? Number(value.TATA_AIG) : 0,
        United_India: value.United_India ? Number(value.United_India) : 0,
        Universal_Sompo: value.Universal_Sompo ? Number(value.Universal_Sompo) : 0,

        Total:
          (value.AIC ? Number(value.AIC) : 0) +
          (value.Bajaj_Allianz ? Number(value.Bajaj_Allianz) : 0) +
          // A (value.Bharti_AXA_GIC ? Number(value.Bharti_AXA_GIC) : 0) +
          (value.Chola_MS ? Number(value.Chola_MS) : 0) +
          (value.Future_Generalli ? Number(value.Future_Generalli) : 0) +
          (value.HDFC_Ergo ? Number(value.HDFC_Ergo) : 0) +
          (value.ICICI_Lombard ? Number(value.ICICI_Lombard) : 0) +
          (value.IFFCO_TOKIO ? Number(value.IFFCO_TOKIO) : 0) +
          (value.Kshema_Insurance ? Number(value.Kshema_Insurance) : 0) +
          (value.NationalInsurance ? Number(value.NationalInsurance) : 0) +
          (value.New_India_Assurance ? Number(value.New_India_Assurance) : 0) +
          (value.Oriental_Insurance ? Number(value.Oriental_Insurance) : 0) +
          (value.Reliance_GIC ? Number(value.Reliance_GIC) : 0) +
          (value.Royal_Sundaram_GIC ? Number(value.Royal_Sundaram_GIC) : 0) +
          (value.SBI_GIC ? Number(value.SBI_GIC) : 0) +
          (value.Shriram_GIC ? Number(value.Shriram_GIC) : 0) +
          (value.TATA_AIG ? Number(value.TATA_AIG) : 0) +
          (value.United_India ? Number(value.United_India) : 0) +
          (value.Universal_Sompo ? Number(value.Universal_Sompo) : 0),
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
    getTicketStatusListData();
  }, []);
  return {
    StatewiseICTicketsDataList,
    filteredStatewiseICTicketsDataList,
    isLoadingStatewiseICTicketsDataList,
    gridApi,
    onGridReady,
    onChangeStatewiseICTicketsList,
    StatewiseICTicketsListItemSearch,
    getStatewiseICTicketsList,
    formValues,
    updateState,
    isLoadingStatewiseICTicketsDataList,
    onClickClearSearchFilter,
    exportClick,
    monthList,
    yearList,
    ticketStatusList,
    isLoadingTicketStatusList,
  };
}
export default StatewiseICTicketsLogics;
