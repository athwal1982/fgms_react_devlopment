import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useEffect, useState } from "react";
import { getRegionalOfficeMasterListData, getRegionalStateAssignmentManage } from "../Services/Methods";

function RegionalManagementLogics() {
  const [isLoadingRegionalDataList, setLoadingRegionalDataList] = useState(false);
  const [regionalDataList, setRegionalDataList] = useState([]);
  const setAlertMessage = AlertMessage();
  const [gridApi, setGridApi] = useState();
  const [gridApiForAssign, setGridApiForAssign] = useState();
  const [regionalListItemSearch, setregionalListItemSearch] = useState("");
  const [isLoadingAssignDataList, setIsLoadingAssignDataList] = useState(false);
  const [assignStateList, setAssignStateList] = useState([]);
  const [searchTextAssigendRegionalState, setSearchTextAssignRegionalState] = useState("");
  const [selectedRowData, setSelectedRowData] = useState({});

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const onGridAssignReady = (params) => {
    setGridApiForAssign(params.api);
  };

  const onChangeRegionList = (val) => {
    console.log(val);
    setregionalListItemSearch(val);
    gridApi.setQuickFilter(val);
  };

  const getRegionalData = async () => {
    try {
      setLoadingRegionalDataList(true);
      const result = await getRegionalOfficeMasterListData({ regionalOfficeID: 0, searchText: "#ALL" });
      console.log(result);
      setLoadingRegionalDataList(false);
      if (result.responseCode === 1) {
        if (regionalListItemSearch && regionalListItemSearch.toLowerCase().includes("#")) {
          onChangeRegionList("");
        }
        setRegionalDataList(result.responseData.RegionalOfficeMaster);
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

  const updateUserData = (newlyAddedRegional) => {
    if (gridApi) {
      const rowData = [];
      if (newlyAddedRegional && newlyAddedRegional.length > 0) {
        newlyAddedRegional.forEach((data) => {
          rowData.push(data);
        });
        console.log("rowdata is", rowData);
      }
      gridApi.forEachNode((node) => rowData.push(node.data));
      console.log("rowdata is", rowData);
      gridApi.setRowData(rowData);
    }
  };

  const getRegionalList = () => {
    getRegionalData();
  };

  const getRegionalStateAssignmentData = async (RegionalOfficeID) => {
    try {
      setIsLoadingAssignDataList(true);
      const formData = {
        viewMode: "GETASSIGNED",
        regionalStateID: "",
        regionalOfficeID: RegionalOfficeID,
        stateMasterID: "",
      };
      const result = await getRegionalStateAssignmentManage(formData);
      setIsLoadingAssignDataList(false);
      console.log(result);
      if (result.responseCode === 1) {
        console.log(result.responseData.RegionalStateAssignmentManage);
        setAssignStateList(result.responseData.RegionalStateAssignmentManage);
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

  const getRegionalStateDeleteData = async (data) => {
    try {
      const formData = {
        viewMode: "UNASSIGN",
        regionalStateID: data && data.RegionalStateID ? data.RegionalStateID.toString() : "",
        regionalOfficeID: data.RegionalOfficeID,
        stateMasterID: "",
      };
      const result = await getRegionalStateAssignmentManage(formData);

      console.log(result);
      if (result.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.responseMessage,
        });

        if (gridApiForAssign) {
          gridApiForAssign.updateRowData({ remove: [data] });
        }
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

  const setSelectedRowColorRegionalAssignState = (RegionalOffcieID) => {
    console.log(gridApi);
    if (gridApi) {
      gridApi.forEachNode(function (rowNode) {
        if (rowNode.data.RegionalOffcieID === RegionalOffcieID) {
          const newData = {
            ...rowNode.data,
            IsSelected: true,
          };
          rowNode.setData(newData);
        } else {
          rowNode.data.IsSelected = false;
          rowNode.setData(rowNode.data);
        }
      });
    }
  };

  const onGetMenuClick = (moduleData) => {
    console.log(moduleData);
    setSelectedRowData(moduleData);
    getRegionalStateAssignmentData(moduleData.RegionalOfficeID);
    setSelectedRowColorRegionalAssignState(moduleData.RegionalOfficeID);
  };

  const onClickDeleteAssignedRegionalState = (data) => {
    console.log(data);
    getRegionalStateDeleteData(data);
  };

  const onSearchAssignedRegionalState = (val) => {
    setSearchTextAssignRegionalState(val);
    gridApiForAssign.setQuickFilter(val);
    gridApiForAssign.refreshCells();
  };

  const updateAssignedStateList = (assignedList) => {
    console.log(assignedList, "coming");

    if (assignedList && assignedList.length > 0) {
      assignedList.forEach((data) => {
        if (!assignStateList.some((x) => x.StateMasterID.toString() === data.StateMasterID.toString())) {
          assignStateList.unshift(data);
        }
      });
    }
    setAssignStateList([]);
    setAssignStateList(assignStateList);

    if (gridApiForAssign) {
      gridApiForAssign.setRowData(assignStateList);
    }
  };

  useEffect(() => {
    getRegionalData();
  }, []);

  return {
    isLoadingRegionalDataList,
    regionalDataList,
    onGridReady,
    gridApi,
    updateUserData,
    regionalListItemSearch,
    getRegionalList,
    onChangeRegionList,
    onGetMenuClick,
    isLoadingAssignDataList,
    assignStateList,
    onGridAssignReady,
    gridApiForAssign,
    onClickDeleteAssignedRegionalState,
    onSearchAssignedRegionalState,
    searchTextAssigendRegionalState,
    updateAssignedStateList,
    selectedRowData,
  };
}

export default RegionalManagementLogics;
