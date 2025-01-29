import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useState } from "react";
import { UserRegionalAssignmentManage } from "../Services/Methods";

function AssignRegionalOfficeListLogic() {
  const [unAssignedRegionalOfficeListModal, setUnAssignedRegionalOfficeListModal] = useState(false);
  const [isLoadingUserRegionAssignList, setIsLoadingUserRegionAssignList] = useState(false);
  const [userRegionalAssignList, setUserRegionalAssignList] = useState([]);
  const setAlertMessage = AlertMessage();
  const [regionAssignGridApi, setRegionAssignGridApi] = useState();
  const [searchTextAssignRegion, setSearchTextAssignRegion] = useState("");
  const [btnLoaderActive, setBtnLoaderActive] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});

  const toggleUnAssignedRegionalOfficeListModal = () => {
    setUnAssignedRegionalOfficeListModal(!unAssignedRegionalOfficeListModal);
  };

  const getUserRegionalAssignList = async (data) => {
    try {
      setIsLoadingUserRegionAssignList(true);
      const formdata = {
        viewMode: "REGIONFORASSIGN",
        appAccessID: data && data.AppAccessID ? data.AppAccessID : 0,
        regionalOfficeID: 0,
        bankMasterID: 0,
        userRelationID: data && data.UserRelationID ? data.UserRelationID : 0,
      };
      const result = await UserRegionalAssignmentManage(formdata);
      console.log(result, "result");
      setIsLoadingUserRegionAssignList(false);
      if (result.responseCode === 1) {
        console.log(result.responseData);
        setUserRegionalAssignList(result.responseData.UserRegionalAssignmentManage);
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

  const onRegionaAssignGridReady = (params) => {
    setRegionAssignGridApi(params.api);
  };

  const onSearchAssignRegion = (val) => {
    setSearchTextAssignRegion(val);
    regionAssignGridApi.setQuickFilter(val);
    regionAssignGridApi.refreshCells();
  };

  const getSelectedRowData = () => {
    const selectedNodes = regionAssignGridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    return selectedData;
  };

  const handleSave = async (e, showfunc, updateUserDataList) => {
    console.log(selectedUser);
    try {
      if (e) e.preventDefault();
      const checkedItem = getSelectedRowData();
      console.log("checkedItem", checkedItem);
      if (checkedItem.length === 0) {
        setAlertMessage({
          type: "warning",
          message: "Please select atleast one profile.",
        });
        return;
      }
      if (checkedItem.length > 1) {
        setAlertMessage({
          type: "warning",
          message: "Please select only one profile.",
        });
        return;
      }
      const userStateAssignIds = checkedItem
        .map((data) => {
          return data.RegionalOfficeID;
        })
        .join(",");
      setBtnLoaderActive(true);

      const formdata = {
        viewMode: "ASSIGNREGION",
        appAccessID: selectedUser && selectedUser.AppAccessID ? selectedUser.AppAccessID : 0,
        regionalOfficeID: userStateAssignIds.toString(),
        bankMasterID: 0,
        userRelationID: selectedUser && selectedUser.UserRelationID ? selectedUser.UserRelationID : 0,
      };

      const result = await UserRegionalAssignmentManage(formdata);

      console.log(result, "result");
      setBtnLoaderActive(false);
      if (result.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.responseMessage,
        });
        const updatedRow = {
          AppAccessID: selectedUser.AppAccessID,
          UserDisplayName: selectedUser.UserDisplayName,
          CompanyName: selectedUser.CompanyName,
          AppAccessUserName: selectedUser.AppAccessUserName,
          UserCompanyType: selectedUser.UserCompanyType,
          AssignmentFlag: selectedUser.AssignmentFlag,
          UserType: selectedUser.UserType,
          ActiveStatus: selectedUser.ActiveStatus,
          RegionOfficeName: selectedUser.RegionOfficeName,
        };
        console.log(updatedRow);
        updateUserDataList(updatedRow);
        showfunc();
      } else {
        setAlertMessage({
          type: "warning",
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

  return {
    unAssignedRegionalOfficeListModal,
    toggleUnAssignedRegionalOfficeListModal,
    getUserRegionalAssignList,
    isLoadingUserRegionAssignList,
    userRegionalAssignList,
    onRegionaAssignGridReady,
    onSearchAssignRegion,
    searchTextAssignRegion,
    getSelectedRowData,
    btnLoaderActive,
    handleSave,
    setSelectedUser,
  };
}

export default AssignRegionalOfficeListLogic;
