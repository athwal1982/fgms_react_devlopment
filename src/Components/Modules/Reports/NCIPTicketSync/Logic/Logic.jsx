import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useEffect , useState } from "react";
import { getCurrentDateTimeTick} from "Configration/Utilities/dateformat";
import * as XLSX from "xlsx";
import { convert } from "html-to-text";
import { getNCIPTicketSyncReport } from "../Services/Methods";

function NCIPTicketSyncLogic() {
  const setAlertMessage = AlertMessage();

  const [formValues, setFormValues] = useState({
     txtYearFilter: null,
  });

  const [yearList, setYearList] = useState([]);

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

  const [NCIPTicketSyncDataList, setNCIPTicketSyncDataList] = useState(false);
  const [NCIPTicketSyncDataListItemSearch, setNCIPTicketSyncDataListItemSearch] = useState("");
  const onChangeNCIPTicketSyncDataList = (val) => {
    debugger;
    setNCIPTicketSyncDataListItemSearch(val);
    gridApi.setQuickFilter(val);
  };

  const downloadExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    worksheet["!cols"] = [
      { width: 22 },
      { width: 22 },
      { width: 22 },
      { width: 22 },
      { width: 22 },
    ];
    const uniqueDateTimeTick = getCurrentDateTimeTick();
    XLSX.writeFile(workbook, `NCIPTicketSync_${uniqueDateTimeTick}.xlsx`);
  };

  const rearrangeAndRenameColumns = (originalData, columnMapping) => {
    return originalData.map((item) => {
      const rearrangedItem = Object.fromEntries(Object.entries(columnMapping).map(([oldColumnName, newColumnName]) => [newColumnName, item[oldColumnName]]));
      return rearrangedItem;
    });
  };

  const [isLoadingNCIPTicketSyncDataList, setNCIPTicketSyncDataListLoading] = useState(false);
  const [filteredNCIPTicketSyncDataList, setFilteredNCIPTicketSyncDataList] = useState([]);


  const getNCIPTicketSyncDataList = async() => {
   try {
      setNCIPTicketSyncDataListLoading(true);

      const formData = {
       year: formValues.txtYearFilter && formValues.txtYearFilter.value ? formValues.txtYearFilter.value : "",
      };
      const result = await getNCIPTicketSyncReport(formData);
      setNCIPTicketSyncDataListLoading(false);
      if (result.responseCode === 1) {
        if (NCIPTicketSyncDataListItemSearch && NCIPTicketSyncDataListItemSearch.toLowerCase().includes("#")) {
          onChangeNCIPTicketSyncDataList("");
        }
        const NCIPTicketSyncData = result.responseData.status;
        setNCIPTicketSyncDataList(NCIPTicketSyncData);
        setFilteredNCIPTicketSyncDataList(NCIPTicketSyncData);
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

  const exportClick = () => {
    debugger;
    if (NCIPTicketSyncDataList.length === 0) {
      setAlertMessage({
        type: "error",
        message: "Data not found to download.",
      });
      return;
    }

    const columnOrder = {
      MONTH: "Month",
      YEAR: "Year",
      TotalTicket: "Total Ticket",
      Sync: "Sync",
    };

    const mappedData = NCIPTicketSyncDataList.map((value) => {
      return {
        MONTH: value.MONTH,
        YEAR: value.YEAR,
        TotalTicket: value.TotalTicket,
        Sync: value.Sync,
      };
    });

    const rearrangedData = rearrangeAndRenameColumns(mappedData, columnOrder);
    downloadExcel(rearrangedData);
  };

  useEffect(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const yearArray = [];
    for (let i = 2024; i <= currentYear; i += 1) {
      yearArray.push({ label: i.toString(), value: i.toString() });
    }
    setYearList(yearArray.sort().reverse());
  }, []);

  return {
    formValues,
    updateState,
    onGridReady,
    gridApi,
    onClickClearSearchFilter,
    getNCIPTicketSyncDataList,
    isLoadingNCIPTicketSyncDataList,
    filteredNCIPTicketSyncDataList,
    onChangeNCIPTicketSyncDataList,
    exportClick,
    yearList,
  };
}

export default NCIPTicketSyncLogic;
