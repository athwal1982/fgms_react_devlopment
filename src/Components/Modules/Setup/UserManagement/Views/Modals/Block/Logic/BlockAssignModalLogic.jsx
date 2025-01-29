import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useEffect, useState } from "react";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { getMasterDataBinding, userBlockAssignManage } from "../Services/Methods";

function BlockAssignModalLogic() {
  const [selectedUser, setSelectedUser] = useState({});
  const [selectedassign, setSelectedAssign] = useState({});
  const setAlertMessage = AlertMessage();
  const [selectedDistrict, setSelectedDistrict] = useState({});
  const [assignDistrictlist, setAssignDistrictlist] = useState([]);
  const [assignallbtn, setAssignallbtn] = useState(false);
  const [assignallHidebtn, setAssignallHidebtn] = useState(false);
  const [districtGridApi, setDistrictGridApi] = useState();

  const onDistrictrGridReady = (params) => {
    setDistrictGridApi(params.api);
  };

  const [searchTextDistrict, setSearchTextDistrict] = useState("");
  const onSearchDistrict = (val) => {
    setSearchTextDistrict(val);
    districtGridApi.setQuickFilter(val);
    districtGridApi.refreshCells();
  };

  const [districtList, setDistrictList] = useState([]);
  const [isLoadingDistrictList, setIsLoadingDistrictList] = useState(false);
  const getStateListData = async (pselectedUserData) => {
    try {
      console.log("pselectedUserData", pselectedUserData);
      setSelectedUser(pselectedUserData);
      debugger;
      setIsLoadingDistrictList(true);
      const userData = getSessionStorage("user");
      const formdata = {
        filterID: userData && userData.LoginID ? userData.LoginID : 0,
        filterID1: 0,
        masterName: "LOCMASTER",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBinding(formdata);
      console.log(result, "District");
      setIsLoadingDistrictList(false);
      if (result.response.responseCode === 1) {
        debugger;
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setDistrictList(result.response.responseData.masterdatabinding);
          console.log("result.response.responseData.masterdatabinding", result.response.responseData.masterdatabinding);
        } else {
          setDistrictList([]);
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
  const onAssinGridReady = (params) => {
    debugger;
    setGridApi(params.api);
    console.log("params.api)", params.api);
  };
  const [searchTextSubDistrict, setSearchTextSubDistrict] = useState("");
  const onSearchSubDistrict = (val) => {
    setSearchTextSubDistrict(val);
    gridApi.setQuickFilter(val);
    gridApi.refreshCells();
  };
  const [btnLoaderActive, setBtnLoaderActive] = useState(false);
  const userBlockAssignManageList = async (formdata) => {
    try {
      setBtnLoaderActive(true);
      const result = await userBlockAssignManage(formdata);
      console.log(result, "result");
      setBtnLoaderActive(false);
      if (result.response.responseCode === 1) {
        debugger;
        if (formdata.viewMode === "GETASSIGNED") {
          if (
            result.response.responseData &&
            result.response.responseData.UserBlockAssignManage &&
            result.response.responseData.UserBlockAssignManage.length > 0
          ) {
            setAssignDistrictlist(result.response.responseData.UserBlockAssignManage);
            let filter = [];
            filter = result.response.responseData.UserBlockAssignManage.filter((x) => x.AssignmentFlag.toString() === "0");
            console.log("filter,", filter);
            if (filter.length > 0) {
              setAssignallbtn(true);
              setAssignallHidebtn(true);
            } else {
              setAssignallbtn(false);
              setAssignallHidebtn(true);
            }
          } else {
            setAssignDistrictlist([]);
            setAssignallbtn(false);
            setAssignallHidebtn(false);
          }
        } else if (formdata.viewMode !== "GETASSIGNED" && formdata.viewMode !== "ASSIGNALL" && formdata.viewMode !== "UNASSIGNALL") {
          if (gridApi) {
            debugger;
            console.log("districtGridApi", gridApi);
            let count = 0;
            gridApi.forEachNode(function (rowNode) {
              if (rowNode.data.BlockMasterCode.toString() === formdata.blockCode.toString()) {
                if (formdata.viewMode === "ASSIGN" && result.response.responseData && result.response.responseData.UserBlockID) {
                  rowNode.data.UserBlockID = Number(result.response.responseData.UserBlockID);
                  rowNode.data.AssignmentFlag = 1;
                } else if (formdata.viewMode === "UNASSIGN") {
                  rowNode.data.UserBlockID = null;
                  rowNode.data.AssignmentFlag = 0;
                }
                debugger;
                if (rowNode.data.AssignmentFlag === 0) {
                  count += 1;
                } else {
                  count -= 1;
                }
                if (count > 0) {
                  setAssignallbtn(true);
                  setAssignallHidebtn(true);
                } else {
                  setAssignallbtn(false);
                  setAssignallHidebtn(true);
                }
                rowNode.setData(rowNode.data);
              }
            });
          }
        } else if (formdata.viewMode === "ASSIGNALL" || formdata.viewMode === "UNASSIGNALL") {
          const formdata = {
            viewMode: "GETASSIGNED",
            uBlockID: 0,
            userBlockID: "",
            blockCode: "",
            appAccessID: selectedUser.AppAccessID,
            subDistrictMasterCode: selectedDistrict.SubDistrictMasterCode,
            blockMasterCode: "",
          };
          debugger;
          userBlockAssignManageList(formdata);
        }
      } else {
        setAlertMessage({
          type: "warning",
          message: result.response.responseMessage,
        });
        setAssignDistrictlist([]);
        setAssignallbtn(false);
        setAssignallHidebtn(false);
      }
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const onAssignDistrict = (district) => {
    debugger;

    if (district && district.SubDistrictMasterCode) {
      setSelectedAssign(district);
      console.log("Block", district, selectedassign);
      const formdata = {
        viewMode: "ASSIGN",
        uBlockID: 0,
        userBlockID: "",
        blockCode: district.BlockMasterCode.toString(),
        appAccessID: selectedUser.AppAccessID,
        subDistrictMasterCode: district.SubDistrictMasterCode,
        blockMasterCode: "",
      };
      debugger;
      userBlockAssignManageList(formdata);
    }
  };

  const OnAssignAll = (action) => {
    debugger;
    if (selectedDistrict && selectedDistrict.SubDistrictMasterCode) {
      console.log("selectedDistrict", selectedDistrict);
      const formdata = {
        viewMode: action === "A" ? "ASSIGNALL" : "UNASSIGNALL",
        uBlockID: 0,
        userBlockID: "",
        blockCode: "",
        appAccessID: selectedUser.AppAccessID,
        subDistrictMasterCode: selectedDistrict.SubDistrictMasterCode,
        blockMasterCode: "",
      };
      debugger;
      userBlockAssignManageList(formdata);
    }
  };

  const onUnAssignDistrict = (block) => {
    debugger;
    console.log("onUnAssignDistrict", block);
    const formdata = {
      viewMode: "UNASSIGN",
      uBlockID: block.UserBlockID.toString(),
      userBlockID: "",
      blockCode: block.BlockMasterCode.toString(),
      appAccessID: selectedUser.AppAccessID,
      subDistrictMasterCode: selectedDistrict.SubDistrictMasterCode,
      blockMasterCode: "",
    };
    debugger;
    userBlockAssignManageList(formdata);
  };
  const onGetAssignDistrict = (moduleData) => {
    debugger;
    console.log("setSelectedDistrict", moduleData);

    setSelectedDistrict(moduleData);
    if (moduleData && moduleData.SubDistrictMasterCode) {
      const formdata = {
        viewMode: "GETASSIGNED",
        uBlockID: 0,
        userBlockID: "",
        blockCode: "",
        appAccessID: selectedUser.AppAccessID,
        subDistrictMasterCode: moduleData.SubDistrictMasterCode,
        blockMasterCode: "",
      };
      debugger;
      userBlockAssignManageList(formdata);
    } else {
      setAlertMessage({
        type: "warning",
        message: "Select Sub District",
      });
    }
  };
  useEffect(() => {}, [assignallbtn]);
  return {
    districtList,
    isLoadingDistrictList,
    getStateListData,
    onGetAssignDistrict,
    searchTextDistrict,
    searchTextSubDistrict,
    onDistrictrGridReady,
    onSearchDistrict,
    onSearchSubDistrict,
    setSelectedUser,
    setAssignallHidebtn,
    setAssignallbtn,
    userBlockAssignManageList,
    btnLoaderActive,
    selectedDistrict,
    assignDistrictlist,
    onAssignDistrict,
    onAssinGridReady,
    onUnAssignDistrict,
    OnAssignAll,
    assignallbtn,
    assignallHidebtn,
  };
}

export default BlockAssignModalLogic;
