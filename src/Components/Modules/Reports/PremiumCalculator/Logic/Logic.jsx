import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useState } from "react";
import { dateToSpecificFormat } from "Configration/Utilities/dateformat";
import * as XLSX from "xlsx";
import { calculatedPremiumReport } from "../Services/Methods";
import { getMasterDataBinding } from "../../../Support/ManageTicket/Services/Methods";

function PremiumCalculatorReportLogics() {
  const [formValues, setFormValues] = useState({
    txtInsuranceCompany: null,
    txtState: null,
  });

  const [premiumCalculatorDataList, setPremiumCalculatorDataList] = useState(false);
  const [filteredPremiumCalculatorDataList, setFilteredPremiumCalculatorDataList] = useState([]);
  const [isLoadingPremiumCalculatorDataList, setLoadingPremiumCalculatorDataList] = useState(false);
  const setAlertMessage = AlertMessage();

  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
    console.log(params.api);
    setGridApi(params.api);
  };

  const [premiumCalculatorListItemSearch, setPremiumCalculatorListItemSearch] = useState("");
  const onChangePremiumCalculatorList = (val) => {
    debugger;
    setPremiumCalculatorListItemSearch(val);
    gridApi.setQuickFilter(val);
  };

  const [insuranceCompanyList, setInsuranceCompanyList] = useState([]);
  const [isLoadingInsuranceCompanyList, setIsLoadingInsuranceCompanyList] = useState(false);
  const getInsuranceCompanyListData = async () => {
    try {
      setInsuranceCompanyList([]);
      setIsLoadingInsuranceCompanyList(true);
      const formdata = {
        filterID: 124003,
        filterID1: 0,
        masterName: "CMPLST",
        searchText: "#ALL",
        searchCriteria: "",
      };
      const result = await getMasterDataBinding(formdata);
      setIsLoadingInsuranceCompanyList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setInsuranceCompanyList(result.response.responseData.masterdatabinding);
        } else {
          setInsuranceCompanyList([]);
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
      const result = await getMasterDataBinding(formdata);
      console.log(result, "State Data");
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

  const downloadExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    // A let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    // A XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    worksheet["!cols"] = [
      { width: 25 },
      { width: 20 },
      { width: 20 },
      { width: 15 },
      { width: 30 },
      { width: 45 },
      { width: 15 },
      { width: 55 },
      { width: 15 },
      { width: 20 },
      { width: 25 },
      { width: 25 },
    ];
    XLSX.writeFile(workbook, "Premium_Calculator.xlsx");
  };

  const rearrangeAndRenameColumns = (originalData, columnMapping) => {
    return originalData.map((item) => {
      const rearrangedItem = Object.fromEntries(Object.entries(columnMapping).map(([oldColumnName, newColumnName]) => [newColumnName, item[oldColumnName]]));
      return rearrangedItem;
    });
  };

  const getPremiumCalculatorData = async () => {
    debugger;
    try {
      setLoadingPremiumCalculatorDataList(true);

      const formData = {
        stateID: formValues.txtState && formValues.txtState.StateMasterID ? formValues.txtState.StateMasterID.toString() : 0,
        insuranceCompanyID: formValues.txtInsuranceCompany && formValues.txtInsuranceCompany.CompanyID ? formValues.txtInsuranceCompany.CompanyID : 0,
      };
      const result = await calculatedPremiumReport(formData);
      setLoadingPremiumCalculatorDataList(false);
      if (result.responseCode === 1) {
        if (premiumCalculatorListItemSearch && premiumCalculatorListItemSearch.toLowerCase().includes("#")) {
          onChangePremiumCalculatorList("");
        }
        setPremiumCalculatorDataList(result.responseData.data);
        setFilteredPremiumCalculatorDataList(result.responseData.data);
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

  const getPremiumCalculatorList = () => {
    getPremiumCalculatorData();
  };

  const onClickClearSearchFilter = () => {
    setFormValues({
      ...formValues,
      txtInsuranceCompany: null,
      txtState: null,
    });
  };

  const exportClick = () => {
    debugger;
    // A const excelParams = {
    // A  fileName: "Ticket History",
    // A };
    // A gridApi.exportDataAsExcel(excelParams);
    if (premiumCalculatorDataList.length === 0) {
      setAlertMessage({
        type: "error",
        message: "Data not found to download.",
      });
      return;
    }
    const columnOrder = {
      MobileNumber: "Caller Mobile No.",
      StateMasterName: "State",
      District: "District",
      Years: "Year",
      CropName: "Crop",
      SchemeName: "Scheme",
      CropSeasonName: "Season",
      InsuranceMasterName: "Insurance Company",
      SSSYID: "SSSYID",
      InsuranceMasterName: "Insurance Company",
      AREA: "Area(In Hectare)",
      CalculatedPremium: "Calculated Premium",
      CreatedAt: "Created At",
    };
    const mappedData = premiumCalculatorDataList.map((value) => {
      return {
        MobileNumber: value.MobileNumber,
        StateMasterName: value.StateMasterName,
        District: District,
        Years: value.Years,
        CropName: value.CropName,
        SchemeName: value.SchemeName,
        CropSeasonName: value.CropSeasonName,
        SSSYID: value.SSSYID,
        InsuranceMasterName: value.InsuranceMasterName,
        AREA: value.AREA,
        CalculatedPremium: value.CalculatedPremium,
        CreatedAt: value.CreatedAt ? dateToSpecificFormat(value.CreatedAt.split("T")[0], "DD-MM-YYYY HH:MM") : "",
      };
    });
    const rearrangedData = rearrangeAndRenameColumns(mappedData, columnOrder);
    downloadExcel(rearrangedData);
  };

  return {
    premiumCalculatorDataList,
    filteredPremiumCalculatorDataList,
    isLoadingPremiumCalculatorDataList,
    insuranceCompanyList,
    isLoadingInsuranceCompanyList,
    getInsuranceCompanyListData,
    stateList,
    isLoadingStateList,
    getStateListData,
    gridApi,
    onGridReady,
    onChangePremiumCalculatorList,
    premiumCalculatorListItemSearch,
    getPremiumCalculatorList,
    formValues,
    updateState,
    isLoadingPremiumCalculatorDataList,
    onClickClearSearchFilter,
    exportClick,
  };
}
export default PremiumCalculatorReportLogics;
