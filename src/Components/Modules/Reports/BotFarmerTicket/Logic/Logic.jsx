import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useEffect , useState } from "react";
import { getCurrentDateTimeTick} from "Configration/Utilities/dateformat";
import * as XLSX from "xlsx";
import { convert } from "html-to-text";
import { getBotFarmerTicketReport } from "../Services/Methods";

function BotFarmerTicketLogic() {
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

  const [BotFarmerTicketDataList, setBotFarmerTicketDataList] = useState(false);
  const [BotFarmerTicketDataListItemSearch, setBotFarmerTicketDataListItemSearch] = useState("");
  const onChangeBotFarmerTicketDataList = (val) => {
    debugger;
    setBotFarmerTicketDataListItemSearch(val);
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
      { width: 22 },
    ];
    const uniqueDateTimeTick = getCurrentDateTimeTick();
    XLSX.writeFile(workbook, `BotFarmerTicket_${uniqueDateTimeTick}.xlsx`);
  };

  const rearrangeAndRenameColumns = (originalData, columnMapping) => {
    return originalData.map((item) => {
      const rearrangedItem = Object.fromEntries(Object.entries(columnMapping).map(([oldColumnName, newColumnName]) => [newColumnName, item[oldColumnName]]));
      return rearrangedItem;
    });
  };

  const [isLoadingBotFarmerTicketDataList, setBotFarmerTicketDataListLoading] = useState(false);
  const [filteredBotFarmerTicketDataList, setFilteredBotFarmerTicketDataList] = useState([]);

  const getBotFarmerTicketDataList = async() => {
     try {
      setBotFarmerTicketDataListLoading(true);

      const formData = {
        year: formValues.txtYearFilter && formValues.txtYearFilter.value ? formValues.txtYearFilter.value : "",
      };
      const result = await getBotFarmerTicketReport(formData);
      setBotFarmerTicketDataListLoading(false);
      if (result.responseCode === 1) {
        if (BotFarmerTicketDataListItemSearch && BotFarmerTicketDataListItemSearch.toLowerCase().includes("#")) {
          onChangeBotFarmerTicketDataList("");
        }
        const BotFarmerTicketData = result.responseData.status;
        setBotFarmerTicketDataList(BotFarmerTicketData);
        setFilteredBotFarmerTicketDataList(BotFarmerTicketData);
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
    if (BotFarmerTicketDataList.length === 0) {
      setAlertMessage({
        type: "error",
        message: "Data not found to download.",
      });
      return;
    }

    const columnOrder = {
      MONTH: "Month",
      YEAR: "Year",
      TotalTicketCreated: "Total Ticket",
      CreatedByAgent: "Created By Agent",
      CreatedByBOT: "Created By BOT",
      CreatedByFarmer: "Created By Farmer",
    };

    const mappedData = BotFarmerTicketDataList.map((value) => {
      return {
        MONTH: value.MONTH,
        YEAR: value.YEAR,
        TotalTicketCreated: value.TotalTicketCreated,
        CreatedByAgent: value.CreatedByAgent,
        CreatedByBOT: value.CreatedByBOT,
        CreatedByFarmer: value.CreatedByFarmer,
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
    getBotFarmerTicketDataList,
    isLoadingBotFarmerTicketDataList,
    filteredBotFarmerTicketDataList,
    onChangeBotFarmerTicketDataList,
    exportClick,
    yearList,
  };
}

export default BotFarmerTicketLogic;
