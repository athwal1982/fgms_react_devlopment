import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useEffect, useState } from "react";
import { getIsuranceCompanyListData } from "../Services/Methods";

function InsuranceCompanyManagementLogics() {
  const [isLoadingInsuranceCompanyDataList, setLoadingInsuranceCompanyDataList] = useState(false);
  const [insuranceCompanyDataList, setInsuranceCompanyDataList] = useState([]);
  const setAlertMessage = AlertMessage();
  const [gridApi, setGridApi] = useState();
  const [insuranceCompanyListItemSearch, setInsuranceCompanyListItemSearch] = useState("");

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const onChangeInsuranceCompanyList = (val) => {
    console.log(val);
    setInsuranceCompanyListItemSearch(val);
    gridApi.setQuickFilter(val);
  };

  const getInsuranceCompanyData = async () => {
    debugger;
    try {
      setLoadingInsuranceCompanyDataList(true);
      const result = await getIsuranceCompanyListData({ insuranceMasterID: 0, insuranceMasterName: "#ALL" });
      console.log(result);
      setLoadingInsuranceCompanyDataList(false);
      if (result.responseCode === 1) {
        if (insuranceCompanyListItemSearch && insuranceCompanyListItemSearch.toLowerCase().includes("#")) {
          onChangeInsuranceCompanyList("");
        }
        setInsuranceCompanyDataList(result.responseData.InsuranceMaster);
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

  const updateInsuranceCompanyData = (newlyAddedInsuranceCompany) => {
    if (gridApi) {
      const rowData = [];
      if (newlyAddedInsuranceCompany && newlyAddedInsuranceCompany.length > 0) {
        newlyAddedInsuranceCompany.forEach((data) => {
          rowData.push(data);
        });
        console.log("rowdata is", rowData);
      }
      gridApi.forEachNode((node) => rowData.push(node.data));
      console.log("rowdata is", rowData);
      gridApi.setRowData(rowData);
    }
  };

  const getInsuranceCompanyList = () => {
    getInsuranceCompanyData();
  };

  useEffect(() => {
    getInsuranceCompanyData();
  }, []);

  return {
    isLoadingInsuranceCompanyDataList,
    insuranceCompanyDataList,
    onGridReady,
    updateInsuranceCompanyData,
    insuranceCompanyListItemSearch,
    getInsuranceCompanyList,
    onChangeInsuranceCompanyList,
  };
}

export default InsuranceCompanyManagementLogics;
