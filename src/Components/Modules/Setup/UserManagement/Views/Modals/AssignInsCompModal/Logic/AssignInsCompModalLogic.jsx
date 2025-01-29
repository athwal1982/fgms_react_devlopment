import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useState } from "react";
import { GetUserInsCompAssignManage } from "../Service/Methods";

function AssignInsCompModalLogic() {
  const setAlertMessage = AlertMessage();
  const [userInsCompAssignList, setUserInsCompAssignList] = useState([]);
  const [isLoadingUserInsCompAssignList, setIsLoadingUserInsCompAssignList] = useState(false);
  const [userAssignInsCompGridApi, setUserAssignInsCompGridApi] = useState();
  const [searchTextUserAssignInsComp, setSearchTextUserAssignInsComp] = useState("");
  const [unAssignedInsCompModal, setUnAssignedInsCompModal] = useState(false);

  const getUserInsCompAssignList = async (data) => {
    try {
      setIsLoadingUserInsCompAssignList(true);
      const formdata = {
        viewMode: "GETASSIGNED",
        userInsuranceID: "0",
        appAccessID: data && data.AppAccessID ? data.AppAccessID : 0,
        insuranceCompanyID: "",
      };
      const result = await GetUserInsCompAssignManage(formdata);
      console.log(result, "result");
      setIsLoadingUserInsCompAssignList(false);
      if (result.responseCode === 1) {
        console.log(result.responseData);
        setUserInsCompAssignList(result.responseData.UserStateAssignManage);
      } else {
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const onUserAssignInsCompGridReady = (params) => {
    setUserAssignInsCompGridApi(params.api);
  };

  const onSearchUserAssignInsComp = (val) => {
    setSearchTextUserAssignInsComp(val);
    userAssignInsCompGridApi.setQuickFilter(val);
    userAssignInsCompGridApi.refreshCells();
  };

  const deleteUserAssignInsComp = async (data) => {
    try {
      const formData = {
        viewMode: "UNASSIGN",
        userInsuranceID: data && data.UserInsuranceID ? data.UserInsuranceID.toString() : "",
        appAccessID: data && data.AppAccessID ? data.AppAccessID : 0,
        insuranceCompanyID: data && data.InsuranceCompanyID ? data.InsuranceCompanyID.toString() : "",
      };
      const result = await GetUserInsCompAssignManage(formData);
      console.log(result);
      if (result.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.responseMessage,
        });

        if (userAssignInsCompGridApi) {
          userAssignInsCompGridApi.updateRowData({ remove: [data] });
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

  const onClickDeleteUserAssignInsComp = (data) => {
    console.log(data);
    deleteUserAssignInsComp(data);
  };

  const toggleUnAssignedInsCompModal = () => {
    setUnAssignedInsCompModal(!unAssignedInsCompModal);
  };

  const updateAssignedInsComp = (assignedList) => {
    console.log(assignedList, "coming");

    if (assignedList && assignedList.length > 0) {
      assignedList.forEach((data) => {
        if (!userInsCompAssignList.some((x) => x.InsuranceCompanyID.toString() === data.InsuranceCompanyID.toString())) {
          userInsCompAssignList.unshift(data);
        }
      });
    }
    setUserInsCompAssignList([]);
    setUserInsCompAssignList(userInsCompAssignList);

    if (userAssignInsCompGridApi) {
      userAssignInsCompGridApi.setRowData(userInsCompAssignList);
    }
  };

  return {
    getUserInsCompAssignList,
    userInsCompAssignList,
    isLoadingUserInsCompAssignList,
    onUserAssignInsCompGridReady,
    searchTextUserAssignInsComp,
    onSearchUserAssignInsComp,
    onClickDeleteUserAssignInsComp,
    unAssignedInsCompModal,
    toggleUnAssignedInsCompModal,
    updateAssignedInsComp,
  };
}

export default AssignInsCompModalLogic;
