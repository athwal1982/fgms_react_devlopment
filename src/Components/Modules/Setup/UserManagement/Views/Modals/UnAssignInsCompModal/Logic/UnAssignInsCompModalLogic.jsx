import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useState } from "react";
import { GetUserInsCompAssignManage } from "../../AssignInsCompModal/Service/Methods";

function UnAssignInsCompModalLogic() {
  const setAlertMessage = AlertMessage();
  const [unAssignInsComp, setUnAssignInsComp] = useState([]);
  const [isLoadingUnAssignInsComp, setIsLoadingUnAssignInsComp] = useState(false);
  const [gridApiUnAssign, setGridApiUnAssign] = useState();
  const [searchTextUnAssigendInsComp, setSearchTextUnAssigendInsComp] = useState("");
  const [btnLoaderActive, setBtnLoaderActive] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState();

  const onGridReadyUnAssign = (params) => {
    setGridApiUnAssign(params.api);
  };

  const onSearchUnAssignedInsComp = (val) => {
    setSearchTextUnAssigendInsComp(val);
    gridApiUnAssign.setQuickFilter(val);
    gridApiUnAssign.refreshCells();
  };

  const getUnAssignedInsCompData = async (data) => {
    try {
      setUnAssignInsComp([]);
      setIsLoadingUnAssignInsComp(true);

      const formdata = {
        viewMode: "GETUNASSIGNED",
        userInsuranceID: "0",
        appAccessID: data && data.AppAccessID ? data.AppAccessID : 0,
        insuranceCompanyID: "0",
      };
      const result = await GetUserInsCompAssignManage(formdata);
      console.log(result);
      setIsLoadingUnAssignInsComp(false);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.UserStateAssignManage) {
          const mappedData = result.responseData.UserStateAssignManage.map((data) => {
            return { ...data, IsChecked: false };
          });
          setUnAssignInsComp(mappedData);
        } else {
          setUnAssignInsComp([]);
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

  const getSelectedRowData = () => {
    const selectedNodes = gridApiUnAssign.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    return selectedData;
  };

  const resetUnAssignedInsComp = (result, updateAssignedInsComp) => {
    console.log(result);
    if (result.responseData) {
      const responseAssignedIds = result.responseData.UserInsuranceID ? result.responseData.UserInsuranceID.split(",") : [];
      console.log(responseAssignedIds);

      let assignedIds = [];
      if (responseAssignedIds.length > 0) {
        assignedIds = responseAssignedIds.reduce((assignmentIdList, data) => {
          const splitData = data.split("|");
          if (splitData.length > 0 && splitData[0] && splitData[1]) {
            assignmentIdList.push({
              InsuranceCompanyID: splitData[0],
              UserInsuranceID: splitData[1],
            });
          }
          return assignmentIdList;
        }, []);
      }

      if (assignedIds.length > 0) {
        console.log(assignedIds, "assignedIds");
        const filteredAssignedList = unAssignInsComp.reduce((assignedList, data) => {
          const resultData = assignedIds.find((x) => x.InsuranceCompanyID.toString() === data.InsuranceMasterID.toString());

          if (resultData) {
            assignedList.push({
              InsuranceCompanyID: data.InsuranceMasterID,
              InsuranceMasterName: data.InsuranceMasterName,
              IsNewlyAdded: true,
            });
          }
          return assignedList;
        }, []);

        updateAssignedInsComp(filteredAssignedList);
      }

      let updatedUnAssignedList = unAssignInsComp.filter(function (value) {
        return assignedIds.length === 0 || !assignedIds.some((x) => x.InsuranceCompanyID.toString() === value.InsuranceMasterID.toString());
      });
      const unAssignedIds = result.responseData.UserInsuranceID ? result.responseData.UserInsuranceID.split(",") : [];
      if (unAssignedIds.length > 0) {
        updatedUnAssignedList = updatedUnAssignedList.map((data) => {
          if (unAssignedIds.includes(data.InsuranceMasterID.toString())) {
            data.FailedAssigned = true;
            data.IsChecked = false;
          }
          return { ...data };
        });
      }
      setUnAssignInsComp([]);

      setUnAssignInsComp(updatedUnAssignedList);

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

  const handleSave = async (e, updateAssignedInsComp) => {
    try {
      console.log(selectedRowData, "selectedRowData");
      if (e) e.preventDefault();
      const checkedItem = getSelectedRowData();

      if (checkedItem.length === 0) {
        setAlertMessage({
          type: "error",
          message: "Please select atleast one Insurance Company.",
        });
        return;
      }
      const accessIds = checkedItem
        .map((data) => {
          return data.InsuranceMasterID;
        })
        .join(",");
      setBtnLoaderActive(true);

      const formdata = {
        viewMode: "ASSIGN",
        userInsuranceID: "0",
        appAccessID: selectedRowData && selectedRowData.AppAccessID ? selectedRowData.AppAccessID : 0,
        insuranceCompanyID: accessIds,
      };

      const result = await GetUserInsCompAssignManage(formdata);
      console.log(result, "result");
      setBtnLoaderActive(false);
      if (result.responseCode === 1) {
        console.log(result.responseData);
        resetUnAssignedInsComp(result, updateAssignedInsComp);
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
    getUnAssignedInsCompData,
    unAssignInsComp,
    isLoadingUnAssignInsComp,
    onGridReadyUnAssign,
    searchTextUnAssigendInsComp,
    onSearchUnAssignedInsComp,
    handleSave,
    btnLoaderActive,
    setSelectedRowData,
  };
}

export default UnAssignInsCompModalLogic;
