import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useEffect, useState } from "react";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { getMasterDataBinding, userSubDistrictAssignManage } from "../Services/Methods";

function SubDistrictAssignModalLogic() {
  const [selectedUser, setSelectedUser] = useState({});
  const [selectedassign, setSelectedAssign] = useState({});
  const setAlertMessage = AlertMessage();
  const [selectedDistrict, setSelectedDistrict] = useState({});
  const [assignSubDistrictlist, setAssignSubDistrictlist] = useState([]);
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
  const userSubDistrictAssignManageList = async (formdata) => {
    try {
      setBtnLoaderActive(true);
      const result = await userSubDistrictAssignManage(formdata);
      console.log(result, "result");
      setBtnLoaderActive(false);
      if (result.response.responseCode === 1) {
        debugger;
        if (formdata.viewMode === "GETASSIGNED") {
          if (
            result.response.responseData &&
            result.response.responseData.UserSubDistrictAssignManage &&
            result.response.responseData.UserSubDistrictAssignManage.length > 0
          ) {
            setAssignSubDistrictlist(result.response.responseData.UserSubDistrictAssignManage);
            let filter = [];
            filter = result.response.responseData.UserSubDistrictAssignManage.filter((x) => x.AssignmentFlag.toString() === "0");
            console.log("filter,", filter);
            if (filter.length > 0) {
              setAssignallbtn(true);
              setAssignallHidebtn(true);
            } else {
              setAssignallbtn(false);
              setAssignallHidebtn(true);
            }
          } else {
            setAssignSubDistrictlist([]);
            setAssignallbtn(false);
            setAssignallHidebtn(false);
          }
        } else if (formdata.viewMode !== "GETASSIGNED" && formdata.viewMode !== "ASSIGNALL" && formdata.viewMode !== "UNASSIGNALL") {
          if (gridApi) {
            debugger;
            console.log("districtGridApi", gridApi);
            let count = 0;
            gridApi.forEachNode(function (rowNode) {
              if (rowNode.data.SubDistrictMasterCode.toString() === formdata.subDistrictCode.toString()) {
                if (formdata.viewMode === "ASSIGN" && result.response.responseData && result.response.responseData.UserSubDistrictID) {
                  rowNode.data.UserSubDistrictID = Number(result.response.responseData.UserSubDistrictID);
                  rowNode.data.AssignmentFlag = 1;
                } else if (formdata.viewMode === "UNASSIGN") {
                  rowNode.data.UserSubDistrictID = null;
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
            uSubDistrictID: 0,
            userSubDistrictID: "",
            subDistrictCode: "",
            appAccessID: selectedUser.AppAccessID,
            districtMasterCode: selectedDistrict.DistrictMasterCode,
            subDistrictMasterCode: "",
          };
          debugger;
          userSubDistrictAssignManageList(formdata);
        }
      } else {
        setAlertMessage({
          type: "warning",
          message: result.response.responseMessage,
        });
        setAssignSubDistrictlist([]);
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
      console.log("Subdistrict", district, selectedassign);
      const formdata = {
        viewMode: "ASSIGN",
        uSubDistrictID: 0,
        userSubDistrictID: "",
        subDistrictCode: district.SubDistrictMasterCode.toString(),
        appAccessID: selectedUser.AppAccessID,
        districtMasterCode: selectedDistrict.DistrictMasterCode,
        subDistrictMasterCode: "",
      };
      debugger;
      userSubDistrictAssignManageList(formdata);
    }
  };

  const OnAssignAll = (action) => {
    debugger;
    if (selectedDistrict && selectedDistrict.StateMasterID) {
      console.log("selectedDistrict", selectedDistrict);
      const formdata = {
        viewMode: action === "A" ? "ASSIGNALL" : "UNASSIGNALL",
        uSubDistrictID: 0,
        userSubDistrictID: "",
        subDistrictCode: "",
        appAccessID: selectedUser.AppAccessID,
        districtMasterCode: selectedDistrict.DistrictMasterCode,
        subDistrictMasterCode: "",
      };
      debugger;
      userSubDistrictAssignManageList(formdata);
    }
  };

  const onUnAssignDistrict = (district) => {
    debugger;
    console.log("onUnAssignDistrict", district);

    const formdata = {
      viewMode: "UNASSIGN",
      uSubDistrictID: district.UserSubDistrictID.toString(),
      userSubDistrictID: "",
      subDistrictCode: district.SubDistrictMasterCode.toString(),
      appAccessID: selectedUser.AppAccessID,
      districtMasterCode: selectedDistrict.DistrictMasterCode,
      subDistrictMasterCode: "",
    };
    debugger;
    userSubDistrictAssignManageList(formdata);
  };
  const onGetAssignDistrict = (moduleData) => {
    debugger;
    console.log("setSelectedDistrict", moduleData);

    setSelectedDistrict(moduleData);
    if (moduleData && moduleData.DistrictMasterCode) {
      const formdata = {
        viewMode: "GETASSIGNED",
        uSubDistrictID: 0,
        userSubDistrictID: "",
        subDistrictCode: "",
        appAccessID: selectedUser.AppAccessID,
        districtMasterCode: moduleData.DistrictMasterCode,
        subDistrictMasterCode: "",
      };
      debugger;
      userSubDistrictAssignManageList(formdata);
    } else {
      setAlertMessage({
        type: "warning",
        message: "Select State",
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
    userSubDistrictAssignManageList,
    btnLoaderActive,
    selectedDistrict,
    assignSubDistrictlist,
    onAssignDistrict,
    onAssinGridReady,
    onUnAssignDistrict,
    OnAssignAll,
    assignallbtn,
    assignallHidebtn,
  };
}

export default SubDistrictAssignModalLogic;
