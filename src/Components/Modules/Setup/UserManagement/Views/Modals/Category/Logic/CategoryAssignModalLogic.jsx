import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useEffect, useState } from "react";
import { getMasterDataBinding, userCategoryAssignManage } from "../Services/Methods";

function CategoryAssignModalLogic() {
  const [selectedUser, setSelectedUser] = useState({});
  const [selectedassign, setSelectedAssign] = useState({});
  const setAlertMessage = AlertMessage();
  const [selectedCategory, setSelectedCategory] = useState({});
  const [assignCategorylist, setAssignCategorylist] = useState([]);
  const [assignallbtn, setAssignallbtn] = useState(false);
  const [assignallHidebtn, setAssignallHidebtn] = useState(false);

  const [categoryGridApi, setCategoryGridApi] = useState();

  const onCategoryrGridReady = (params) => {
    setCategoryGridApi(params.api);
  };

  const [searchTextCategory, setSearchTextCategory] = useState("");
  const onSearchCategory = (val) => {
    setSearchTextCategory(val);
    categoryGridApi.setQuickFilter(val);
    categoryGridApi.refreshCells();
  };

  const [categoryList, setCategoryList] = useState([]);
  const [isLoadingCategoryList, setIsLoadingCategoryList] = useState(false);
  const getCategoryListData = async (pselectedUserData) => {
    try {
      console.log("pselectedUserData", pselectedUserData);
      setSelectedUser(pselectedUserData);
      debugger;
      setIsLoadingCategoryList(true);
      const formdata = {
        filterID: 1,
        filterID1: 0,
        masterName: "TCKTYP",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBinding(formdata);
      console.log(result, "ticktCategoryType");
      setIsLoadingCategoryList(false);
      if (result.response.responseCode === 1) {
        debugger;
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setCategoryList(result.response.responseData.masterdatabinding);
          console.log("result.response.responseData.masterdatabinding", result.response.responseData.masterdatabinding);
        } else {
          setCategoryList([]);
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
  const [searchTextSubCategory, setSearchTextSubCategory] = useState("");
  const onSearchSubCategory = (val) => {
    setSearchTextSubCategory(val);
    gridApi.setQuickFilter(val);
    gridApi.refreshCells();
  };
  const [btnLoaderActive, setBtnLoaderActive] = useState(false);
  const userCategoryAssignManageList = async (formdata) => {
    try {
      setBtnLoaderActive(true);
      const result = await userCategoryAssignManage(formdata);
      console.log(result, "result");
      setBtnLoaderActive(false);
      if (result.response.responseCode === 1) {
        debugger;
        if (formdata.viewMode === "GETASSIGNED") {
          if (result.response.responseData && result.response.responseData.UserCategoryAssign && result.response.responseData.UserCategoryAssign.length > 0) {
            setAssignCategorylist(result.response.responseData.UserCategoryAssign);
            let filter = [];
            filter = result.response.responseData.UserCategoryAssign.filter((x) => x.AssignmentFlag.toString() === "0");
            console.log("filter,", filter);
            if (filter.length > 0) {
              setAssignallbtn(true);
              setAssignallHidebtn(true);
            } else {
              setAssignallbtn(false);
              setAssignallHidebtn(true);
            }
          } else {
            setAssignCategorylist([]);
            setAssignallbtn(false);
            setAssignallHidebtn(false);
          }
        } else if (formdata.viewMode !== "GETASSIGNED" && formdata.viewMode !== "ASSIGNALL" && formdata.viewMode !== "UNASSIGNALL") {
          if (gridApi) {
            debugger;
            console.log("categoryGridApi", gridApi);
            let count = 0;
            gridApi.forEachNode(function (rowNode) {
              if (rowNode.data.TicketCategoryID.toString() === formdata.tCategoryId.toString()) {
                if (formdata.viewMode === "ASSIGN" && result.response.responseData && result.response.responseData.UserCategoryID) {
                  rowNode.data.UserCategoryID = Number(result.response.responseData.UserCategoryID);
                  rowNode.data.AssignmentFlag = 1;
                } else if (formdata.viewMode === "UNASSIGN") {
                  rowNode.data.UserCategoryID = null;
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
            uCategoryId: 0,
            userCategoryId: "",
            tCategoryId: "",
            appAccessId: selectedUser.AppAccessID,
            supportTicketTypeId: Number(selectedCategory.SupportTicketTypeID),
            ticketCategoryId: "",
          };
          debugger;
          userCategoryAssignManageList(formdata);
        }
      } else {
        setAlertMessage({
          type: "warning",
          message: result.response.responseMessage,
        });
        setAssignCategorylist([]);
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

  const onAssignCategory = (category) => {
    debugger;
    if (category && category.TicketCategoryID) {
      setSelectedAssign(category);
      console.log("Subcategory", category, selectedassign);
      const formdata = {
        viewMode: "ASSIGN",
        uCategoryId: 0,
        userCategoryId: "",
        tCategoryId: category.TicketCategoryID.toString(),
        appAccessId: selectedUser.AppAccessID,
        supportTicketTypeId: Number(category.SupportTicketTypeID),
        ticketCategoryId: "",
      };
      debugger;
      userCategoryAssignManageList(formdata);
    }
  };

  const OnAssignAll = (action) => {
    debugger;
    if (selectedCategory && selectedCategory.SupportTicketTypeID) {
      console.log("selectedCategory", selectedCategory);
      const formdata = {
        viewMode: action === "A" ? "ASSIGNALL" : "UNASSIGNALL",
        uCategoryId: 0,
        userCategoryId: "",
        tCategoryId: "",
        appAccessId: selectedUser.AppAccessID,
        supportTicketTypeId: Number(selectedCategory.SupportTicketTypeID),
        ticketCategoryId: "",
      };
      debugger;
      userCategoryAssignManageList(formdata);
    }
  };

  const onUnAssignCategory = (category) => {
    debugger;
    console.log("onUnAssignCategory", category);
    const formdata = {
      viewMode: "UNASSIGN",
      uCategoryId: category.UserCategoryID.toString(),
      userCategoryId: "",
      tCategoryId: category.TicketCategoryID.toString(),
      appAccessId: selectedUser.AppAccessID,
      supportTicketTypeId: Number(category.SupportTicketTypeID),
      ticketCategoryId: "",
    };
    debugger;
    userCategoryAssignManageList(formdata);
  };
  const onGetAssignCategory = (moduleData) => {
    debugger;
    console.log("setSelectedCategory", moduleData);

    setSelectedCategory(moduleData);
    if (moduleData && moduleData.SupportTicketTypeID) {
      const formdata = {
        viewMode: "GETASSIGNED",
        uCategoryId: 0,
        userCategoryId: "",
        tCategoryId: "",
        appAccessId: selectedUser.AppAccessID,
        supportTicketTypeId: Number(moduleData.SupportTicketTypeID),
        ticketCategoryId: "",
      };
      debugger;
      userCategoryAssignManageList(formdata);
    } else {
      setAlertMessage({
        type: "warning",
        message: "Select Category",
      });
    }
  };
  useEffect(() => {}, [assignallbtn]);
  return {
    categoryList,
    isLoadingCategoryList,
    getCategoryListData,
    onGetAssignCategory,
    searchTextCategory,
    searchTextSubCategory,
    onCategoryrGridReady,
    onSearchCategory,
    onSearchSubCategory,
    setAssignallHidebtn,
    setAssignallbtn,
    setSelectedUser,
    setAssignallbtn,
    userCategoryAssignManageList,
    btnLoaderActive,
    selectedCategory,
    assignCategorylist,
    onAssignCategory,
    onAssinGridReady,
    onUnAssignCategory,
    OnAssignAll,
    assignallbtn,
    assignallHidebtn,
  };
}

export default CategoryAssignModalLogic;
