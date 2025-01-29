import React from "react";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { BsToggleOn, BsToggleOff } from "react-icons/bs";
import { RiFileUserLine, RiLockPasswordLine, RiHome2Fill } from "react-icons/ri";
import { MdOutlineAssignment } from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import PropTypes from "prop-types";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { Loader } from "Framework/Components/Widgets";
import { Convert24FourHourAndMinute, dateToSpecificFormat } from "Configration/Utilities/dateformat";
import BizClass from "./UserManagement.module.scss";

const cellActionTemplate = (props) => {
  const cellData = props.data;
  const userData = getSessionStorage("user");

  const ChkBRTypeID = cellData && cellData.BRTypeID ? cellData.BRTypeID.toString() : "";
  console.log(cellData);
  console.log("userData", userData);
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
      {cellData &&
      cellData.LocationTypeID.toString() === "1" &&
      ChkBRTypeID !== "124005" &&
      (userData.AppAccessTypeID.toString() === "472" || userData.AppAccessTypeID.toString() === "999") &&
      userData.LoginID.toString() === (cellData && cellData.InsertUserID ? cellData.InsertUserID.toString() : "0") ? (
        <RiHome2Fill
          style={{ fontSize: "16px", color: "#34495E", cursor: "pointer" }}
          onClick={() => props.toggleAssignStateListModal(props.data)}
          title="State Assign"
        />
      ) : null}
      {cellData &&
      cellData.LocationTypeID.toString() === "2" &&
      userData.AppAccessTypeID.toString() === "472" &&
      userData.LoginID.toString() === (cellData && cellData.InsertUserID ? cellData.InsertUserID.toString() : "0") &&
      userData.BRHeadTypeID.toString() === ChkBRTypeID ? (
        <RiHome2Fill
          style={{ fontSize: "16px", color: "#34495E", cursor: "pointer" }}
          onClick={() => props.toggleAssignDistrictListModal(props.data)}
          title="District Assign"
        />
      ) : null}
      {cellData &&
      cellData.LocationTypeID.toString() === "3" &&
      userData.AppAccessTypeID.toString() === "472" &&
      userData.LoginID.toString() === (cellData && cellData.InsertUserID ? cellData.InsertUserID.toString() : "0") &&
      userData.BRHeadTypeID.toString() === ChkBRTypeID ? (
        <RiHome2Fill
          style={{ fontSize: "16px", color: "#34495E", cursor: "pointer" }}
          onClick={() => props.toggleAssignSubDistrictListModal(props.data)}
          title="Sub District Assign"
        />
      ) : null}
      {cellData &&
      cellData.LocationTypeID.toString() === "4" &&
      userData.AppAccessTypeID.toString() === "472" &&
      userData.LoginID.toString() === (cellData && cellData.InsertUserID ? cellData.InsertUserID.toString() : "0") &&
      userData.BRHeadTypeID.toString() === ChkBRTypeID ? (
        <RiHome2Fill
          style={{ fontSize: "16px", color: "#34495E", cursor: "pointer" }}
          onClick={() => props.toggleAssignBlockListModal(props.data)}
          title="Sub District Assign"
        />
      ) : null}
      {userData.AppAccessTypeID.toString() !== "503" && ChkBRTypeID !== "124003" ? (
        <MdOutlineAssignment
          style={{ fontSize: "16px", color: "#34495E", cursor: "pointer" }}
          onClick={() => props.toggleAssignInsCompModal(props.data)}
          title="Insurance Company Assign"
        />
      ) : null}
      {userData.AppAccessTypeID.toString() !== "503" ? (
        <RiLockPasswordLine
          style={{ fontSize: "16px", color: "#34495E", cursor: "pointer" }}
          title="Reset Password"
          onClick={() => props.toggleResetPasswordModal(props.data)}
        />
      ) : null}
      {ChkBRTypeID === "124003" &&
      userData.AppAccessTypeID.toString() !== "503" &&
      userData.LoginID.toString() !== (cellData && cellData.InsertUserID ? cellData.InsertUserID.toString() : "0") ? (
        <BiCategory
          title="Assign Category"
          style={{ fontSize: "16px", color: "#34495E", cursor: "pointer" }}
          onClick={() => props.toggleCategoryModal(props.data)}
        />
      ) : null}
      {/* {ChkBRTypeID === "124003" ? (
        <HiOfficeBuilding
          style={{ fontSize: "16px", color: "#34495E", cursor: "pointer" }}
          title="Regional Office"
          onClick={() => props.toggleAssignRegionalOfficeListModal(props.data)}
        />
      ) : null} */}
    </div>
  );
};
function UserManagement({
  filteredUserDataList,
  isLoadingUserDataList,
  toggleAddVisitModal,
  onGridReady,
  onChangeUserList,
  getUsersList,
  userListItemSearch,
  onActiveUser,
  onDeActiveUser,
  toggleProfileListModal,
  toggleAssignStateListModal,
  toggleAssignDistrictListModal,
  toggleAssignSubDistrictListModal,
  toggleAssignBlockListModal,
  toggleResetPasswordModal,
  toggleCategoryModal,
  toggleCloseCategoryModal,
  toggleCloseDistrictListModal,
  toggleAssignRegionalOfficeListModal,
  toggleAssignInsCompModal,
}) {
  const userData = getSessionStorage("user");
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
    <div className={BizClass.PageStart}>
      <PageBar>
        <PageBar.Search value={userListItemSearch} onChange={(e) => onChangeUserList(e.target.value)} onClick={() => getUsersList()} />
        {userData && userData.AppAccessTypeID.toString() !== "503" ? <PageBar.Button onClick={() => toggleAddVisitModal()}>Add User</PageBar.Button> : null}
      </PageBar>
      <DataGrid
        rowData={filteredUserDataList}
        loader={isLoadingUserDataList ? <Loader /> : false}
        components={{
          actionTemplate: cellActionTemplate,
        }}
        getRowStyle={getRowStyle}
        onGridReady={onGridReady}
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
            toggleProfileListModal,
            toggleAssignStateListModal,
            toggleAssignDistrictListModal,
            toggleAssignSubDistrictListModal,
            toggleAssignBlockListModal,
            toggleResetPasswordModal,
            toggleCategoryModal,
            toggleCloseCategoryModal,
            toggleCloseDistrictListModal,
            toggleAssignRegionalOfficeListModal,
            toggleAssignInsCompModal,
          }}
        />
        <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
        <DataGrid.Column field="AppAccessUserName" headerName="User Name" width={170} />
        <DataGrid.Column field="UserDisplayName" headerName="Display Name" width={170} />
        <DataGrid.Column field="UserMobileNumber" headerName="Mobile No." width={120} />
        <DataGrid.Column field="EmailAddress" headerName="Email ID" width={150} />
        <DataGrid.Column field="ProfileName" headerName="Profile Name" width={170} />
        <DataGrid.Column field="LocationMasterName" headerName="Location Type" width={125} />
        <DataGrid.Column field="UserType" headerName="User Type" width={120} />
        <DataGrid.Column field="UserCompanyType" headerName="Company Type" width={210} />
        <DataGrid.Column field="CompanyName" headerName="Company Name" width={400} />
        {/* <DataGrid.Column field="RegionOfficeName" headerName="Region Office" width={400} /> */}
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
  );
}

export default UserManagement;
UserManagement.propTypes = {
  filteredUserDataList: PropTypes.array,
  isLoadingUserDataList: PropTypes.bool,
  toggleAddVisitModal: PropTypes.func.isRequired,
  onGridReady: PropTypes.func.isRequired,
  onChangeUserList: PropTypes.func.isRequired,
  getUsersList: PropTypes.func.isRequired,
  userListItemSearch: PropTypes.string,
  onActiveUser: PropTypes.func.isRequired,
  onDeActiveUser: PropTypes.func.isRequired,
  toggleProfileListModal: PropTypes.func.isRequired,
  toggleAssignStateListModal: PropTypes.func.isRequired,
  toggleAssignDistrictListModal: PropTypes.func.isRequired,
  toggleAssignSubDistrictListModal: PropTypes.func.isRequired,
  toggleAssignBlockListModal: PropTypes.func.isRequired,
  toggleResetPasswordModal: PropTypes.func.isRequired,
  toggleCategoryModal: PropTypes.func.isRequired,
  toggleAssignRegionalOfficeListModal: PropTypes.func.isRequired,
  toggleAssignInsCompModal: PropTypes.func.isRequired,
  toggleCloseCategoryModal: PropTypes.func.isRequired,
  toggleCloseDistrictListModal: PropTypes.func.isRequired,
};
