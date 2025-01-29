import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useState } from "react";
import { getRegionalStateAssignmentManage } from "../../../../Services/Methods";

function UnAssignRegionalStateLogics() {
  const [gridApiUnAssign, setGridApiUnAssign] = useState();
  const [searchTextUnAssigenState, setSearchTextUnAssigenState] = useState("");
  const [btnLoaderActive, setBtnLoaderActive] = useState(false);
  const setAlertMessage = AlertMessage();
  const [selectedRowData, setSelectedRowData] = useState();
  const [isLoadingUnAssignDataList, setIsLoadingUnAssignDataList] = useState(false);
  const [unAssignStateList, setUnAssignStateList] = useState([]);

  const onGridReadyUnAssign = (params) => {
    setGridApiUnAssign(params.api);
  };

  const onSearchUnAssignedState = (val) => {
    setSearchTextUnAssigenState(val);
    gridApiUnAssign.setQuickFilter(val);
    gridApiUnAssign.refreshCells();
  };

  const getSelectedRowData = () => {
    const selectedNodes = gridApiUnAssign.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    return selectedData;
  };

  const getRegionalUnAssignStateList = async (data) => {
    try {
      setIsLoadingUnAssignDataList(true);
      const formData = {
        viewMode: "GETUNASSIGNED",
        regionalStateID: "",
        regionalOfficeID: data.RegionalOfficeID,
        stateMasterID: "",
      };
      const result = await getRegionalStateAssignmentManage(formData);
      setIsLoadingUnAssignDataList(false);

      if (result.responseCode === 1) {
        setUnAssignStateList(result.responseData.RegionalStateAssignmentManage);
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

  const resetUnAssignedStateList = (result, updateAssignedStateList) => {
    console.log(result);
    if (result.responseData) {
      const responseAssignedIds = result.responseData.RegionalStateID ? result.responseData.RegionalStateID.split(",") : [];
      console.log(responseAssignedIds);

      let assignedIds = [];
      if (responseAssignedIds.length > 0) {
        assignedIds = responseAssignedIds.reduce((assignmentIdList, data) => {
          const splitData = data.split("|");
          if (splitData.length > 0 && splitData[0] && splitData[1]) {
            assignmentIdList.push({
              StateMasterID: splitData[0],
              RegionalStateID: splitData[1],
            });
          }
          return assignmentIdList;
        }, []);
      }

      if (assignedIds.length > 0) {
        console.log(assignedIds, "assignedIds");
        const filteredAssignedList = unAssignStateList.reduce((assignedList, data) => {
          const resultData = assignedIds.find((x) => x.StateMasterID.toString() === data.StateMasterID.toString());

          if (resultData) {
            assignedList.push({
              InsuranceMasterID: selectedRowData && selectedRowData.InsuranceMasterID ? selectedRowData.InsuranceMasterID : 0,
              InsuranceMasterName: selectedRowData && selectedRowData.InsuranceMasterName ? selectedRowData.InsuranceMasterName : "",
              RegionOfficeName: selectedRowData && selectedRowData.RegionOfficeName ? selectedRowData.RegionOfficeName : "",
              RegionalOfficeID: selectedRowData && selectedRowData.RegionalOfficeID ? selectedRowData.RegionalOfficeID : 0,
              RegionalStateID: resultData.RegionalStateID,
              StateMasterID: resultData.StateMasterID,
              StateMasterName: data.StateMasterName,
              IsNewlyAdded: true,
            });
          }
          return assignedList;
        }, []);

        updateAssignedStateList(filteredAssignedList);
      }

      let updatedUnAssignedList = unAssignStateList.filter(function (value) {
        return assignedIds.length === 0 || !assignedIds.some((x) => x.StateMasterID.toString() === value.StateMasterID.toString());
      });
      const unAssignedIds = result.responseData.RegionalStateID ? result.responseData.RegionalStateID.split(",") : [];
      if (unAssignedIds.length > 0) {
        updatedUnAssignedList = updatedUnAssignedList.map((data) => {
          if (unAssignedIds.includes(data.StateMasterID.toString())) {
            data.FailedAssigned = true;
            data.IsChecked = false;
          }
          return { ...data };
        });
      }
      setUnAssignStateList([]);

      setUnAssignStateList(updatedUnAssignedList);

      if (assignedIds.length > 0)
        setAlertMessage({
          type: "success",
          message: result.responseMessage,
        });
      else if (unAssignedIds.length > 0)
        setAlertMessage({
          type: "success",
          message: "Already Assigned",
        });
    } else {
      setAlertMessage({
        type: "success",
        message: result.responseMessage,
      });
    }
  };

  const handleSave = async (e, updateAssignedStateList) => {
    try {
      if (e) e.preventDefault();
      const checkedItem = getSelectedRowData();

      if (checkedItem.length === 0) {
        setAlertMessage({
          type: "error",
          message: "Please select atleast one user.",
        });
        return;
      }
      const accessIds = checkedItem
        .map((data) => {
          return data.StateMasterID;
        })
        .join(",");
      setBtnLoaderActive(true);

      const formdata = {
        viewMode: "ASSIGN",
        regionalStateID: "",
        regionalOfficeID: selectedRowData && selectedRowData.RegionalOfficeID ? selectedRowData.RegionalOfficeID : 0,
        stateMasterID: accessIds,
      };

      const result = await getRegionalStateAssignmentManage(formdata);
      console.log(result, "result");
      setBtnLoaderActive(false);
      if (result.responseCode === 1) {
        console.log(result.responseData);
        resetUnAssignedStateList(result, updateAssignedStateList);
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  return {
    onGridReadyUnAssign,
    gridApiUnAssign,
    searchTextUnAssigenState,
    onSearchUnAssignedState,
    handleSave,
    btnLoaderActive,
    setSelectedRowData,
    getRegionalUnAssignStateList,
    isLoadingUnAssignDataList,
    unAssignStateList,
  };
}
export default UnAssignRegionalStateLogics;
