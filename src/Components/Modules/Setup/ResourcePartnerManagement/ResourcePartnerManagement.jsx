import React, { useState } from "react";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { BsToggleOn, BsToggleOff } from "react-icons/bs";
import { RiFileUserLine } from "react-icons/ri";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { Loader } from "Framework/Components/Widgets";
import { Convert24FourHourAndMinute, dateToSpecificFormat } from "Configration/Utilities/dateformat";
import BizClass from "../UserManagement/Views/UserManagement.module.scss";
import AddUser from "./Modal/AddUser";

const cellActionTemplate = (props) => {
  const cellData = props.data;
  const userData = getSessionStorage("user");
  return (
    <div style={{ display: "flex", gap: "4px", marginTop: "2px" }}>
      {userData.AppAccessTypeID.toString() !== "503" ? (
        cellData && cellData.ActiveStatus.toString() === "Y" ? (
          <BsToggleOn style={{ fontSize: "17px", color: "#4caf50", cursor: "pointer" }} onClick={() => props.onActiveUser(props.data)} />
        ) : (
          <BsToggleOff style={{ fontSize: "17px", color: "#c72918", cursor: "pointer" }} onClick={() => props.onDeActiveUser(props.data)} />
        )
      ) : null}
      {cellData && cellData.AssignmentFlag.toString() === "0" && userData.AppAccessTypeID.toString() !== "503" ? (
        <RiFileUserLine
          style={{ fontSize: "17px", color: "#34495E", cursor: "pointer" }}
          onClick={() => props.toggleProfileListModal(props.data)}
          title="Profile Assign"
        />
      ) : null}
    </div>
  );
};

function ResourcePartnerManagement() {
    const [userDataList, setUserDataList] = useState(false);
    const [filteredUserDataList, setFilteredUserDataList] = useState([]);
    const [isLoadingUserDataList, setLoadingUserDataList] = useState(false);  

    const [addUserModal, setAddUserModal] = useState(false);
      const toggleAddVisitModal = () => {
        setAddUserModal(!addUserModal);
      };

    const [gridApi, setGridApi] = useState();
    const onGridReady = (params) => {
      console.log(params.api);
      setGridApi(params.api);
    };
  
    const [userListItemSearch, setUserListItemSearch] = useState("");
    const onChangeUserList = (val) => {
      setUserListItemSearch(val);
      gridApi.setQuickFilter(val);
    };

    const onActiveUser = (data) => {
        // A ActiveInActiveUserUpdate(data, data.ActiveStatus);
      };
    
      const onDeActiveUser = (data) => {
        // A ActiveInActiveUserUpdate(data, data.ActiveStatus);
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
  return (
    <>
    {addUserModal ? (
            <AddUser showfunc={toggleAddVisitModal}  />
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
        <DataGrid.Column field="#" headerName="Resource Partner" width={160} />
        <DataGrid.Column field="#" headerName="Center" width={160} />
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
