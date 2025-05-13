import React, { useState, useEffect } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { BsToggleOn, BsToggleOff } from "react-icons/bs";
import { RiFileUserLine } from "react-icons/ri";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { Loader } from "Framework/Components/Widgets";
import { Convert24FourHourAndMinute, dateToSpecificFormat } from "Configration/Utilities/dateformat";
import { userUpdateActiveStatus, getUserListData } from "./Services/Methods";
import BizClass from "../UserManagement/Views/UserManagement.module.scss";
import AddUser from "./Modal/AddUser";

const cellActionTemplate = (props) => {
  debugger;
  const cellData = props.data;
  return (
    <div style={{ display: "flex", gap: "4px", marginTop: "2px" }}>
      {cellData && cellData.ActiveStatus.toString() === "Y" ? (
          <BsToggleOn style={{ fontSize: "17px", color: "#4caf50", cursor: "pointer" }} onClick={() => props.onActiveUser(props.data)} />
        ) : (
          <BsToggleOff style={{ fontSize: "17px", color: "#c72918", cursor: "pointer" }} onClick={() => props.onDeActiveUser(props.data)} />
        )}
    </div>
  );
};

function ResourcePartnerManagement() {
    const setAlertMessage = AlertMessage();
    const [userDataList, setUserDataList] = useState(false);
    const [filteredUserDataList, setFilteredUserDataList] = useState([]);
    const [isLoadingUserDataList, setLoadingUserDataList] = useState(false);  

    const [addUserModal, setAddUserModal] = useState(false);
      const toggleAddVisitModal = () => {
        setAddUserModal(!addUserModal);
      };

    const [gridApi, setGridApi] = useState();
    const onGridReady = (params) => {
      setGridApi(params.api);
    };
  
    const [userListItemSearch, setUserListItemSearch] = useState("");
    const onChangeUserList = (val) => {
      setUserListItemSearch(val);
      gridApi.setQuickFilter(val);
    };

      const ActiveInActiveUserUpdate = async (data, pActiveStatus) => {
        debugger;
        try {
          setLoadingUserDataList(true);
          const updateActiveStatus = pActiveStatus && pActiveStatus === "Y" ? "N" : pActiveStatus === "N" ? "Y" : "";
          const formdata = {
            appAccessID: data.AppAccessID,
            isActive: updateActiveStatus,
          };
          const result = await userUpdateActiveStatus(formdata);
          setLoadingUserDataList(false);
          if (result.response.responseCode === 1) {
            if (gridApi) {
              const itemsToUpdate = [];
              gridApi.forEachNode(function (rowNode) {
                if (rowNode.data.AppAccessID.toString() === data.AppAccessID.toString()) {
                  if (pActiveStatus === "Y") {
                    data.ActiveStatus = "N";
                  } else if (pActiveStatus === "N") {
                    data.ActiveStatus = "Y";
                  }
                  itemsToUpdate.push(data);
                  rowNode.setData(data);
                }
              });
              gridApi.updateRowData({
                update: itemsToUpdate,
              });
              console.log(itemsToUpdate);
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

    const onActiveUser = (data) => {
        ActiveInActiveUserUpdate(data, data.ActiveStatus);
      };
    
      const onDeActiveUser = (data) => {
        ActiveInActiveUserUpdate(data, data.ActiveStatus);
      };

      const updateResourceMgtUserData = (newlyAddedUser) => {
        debugger;
        if (gridApi) {
          const rowData = [];
          if (newlyAddedUser && newlyAddedUser.length > 0) {
            newlyAddedUser.forEach((data) => {
              rowData.push(data);
            });
          }
          gridApi.forEachNode((node) => rowData.push(node.data));
          gridApi.setRowData(rowData);
          userDataList.unshift(newlyAddedUser);
          setUserDataList([]);
          setUserDataList(userDataList);
    
        }
      };

  const getRowStyle = (params) => {
    if (params.data.IsNewlyAdded) {
      return { background: "#d5a10e" };
    }
    if (params.node.rowIndex % 2 === 0) {
      return { background: "#fff" };
    }
    return { background: "#f3f6f9" };
  };

   const getUserData = async () => {
      debugger;
      try {
        setLoadingUserDataList(true);
        const userData = getSessionStorage("user");
        const formData = {
          appAccessID: userData && userData.LoginID ? userData.LoginID : 0,
          viewMode: "SELECTCSCTYPE",
          userRelationType: "#ALL",
          userType: 0,
          searchText: userListItemSearch || "#ALL",
        };
        const result = await getUserListData(formData);
        setLoadingUserDataList(false);
        if (result.response.responseCode === 1) {
          if (userListItemSearch && userListItemSearch.toLowerCase().includes("#")) {
            onChangeUserList("");
          }
          setUserDataList(result.response.responseData.user);
          setFilteredUserDataList(result.response.responseData.user);
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

      useEffect(() => {}, [userDataList]);
      const getUsersList = () => {
        getUserData();
      };

      useEffect(() => {
        getUserData();
      }, []);

  return (
    <>
    {addUserModal ? (
            <AddUser showfunc={toggleAddVisitModal} updateResourceMgtUserData = {updateResourceMgtUserData}   />
          ) : null}
    <div className={BizClass.PageStart}>
      <PageBar>
        <PageBar.Search value={userListItemSearch} onChange={(e) => onChangeUserList(e.target.value)} onClick={() => getUsersList()} />
       <PageBar.Button onClick={() => toggleAddVisitModal()}>Add User</PageBar.Button>
      </PageBar>
      <DataGrid
        rowData={filteredUserDataList}
        loader={isLoadingUserDataList ? <Loader /> : false}
        getRowStyle={getRowStyle}
        onGridReady={onGridReady}
        components={{
            actionTemplate: cellActionTemplate,
        }}
      >
        <DataGrid.Column
          headerName="Action"
          lockPosition="1"
          pinned="left"
          width={125}
          cellRenderer="actionTemplate"
          cellRendererParams={{
            onActiveUser,
            onDeActiveUser,
          }}   
        />
        <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
        <DataGrid.Column field="AppAccessUserName" headerName="User Name" width={170} />
        <DataGrid.Column field="UserDisplayName" headerName="Display Name" width={170} />
        <DataGrid.Column field="UserMobileNumber" headerName="Mobile No." width={120} />
        <DataGrid.Column field="EmailAddress" headerName="Email ID" width={150} />
        <DataGrid.Column field="ProfileName" headerName="Profile Name" width={170} />
        <DataGrid.Column field="UserType" headerName="User Type" width={150} />
        <DataGrid.Column field="ResourcePartnerName" headerName="Resource Partner" width={160} />
        <DataGrid.Column field="Center" headerName="Center" width={160} />
        <DataGrid.Column
          field="ActiveStatus"
          headerName="Status"
          width={110}
          cellRenderer={(node) => {
            return node.data.ActiveStatus.toString() === "Y" ? "Active" : "In-Active";
          }}
        />
        <DataGrid.Column
          field="#"
          headerName="Created At"
          width="145px"
          valueGetter={(node) => {
            return node.data.InsertedTime
              ? dateToSpecificFormat(
                  `${node.data.InsertedTime.split("T")[0]} ${Convert24FourHourAndMinute(node.data.InsertedTime.split("T")[1])}`,
                  "DD-MM-YYYY HH:mm",
                )
              : null;
          }}
        />
      </DataGrid>
    </div>
    </>
  );
}

export default ResourcePartnerManagement;
