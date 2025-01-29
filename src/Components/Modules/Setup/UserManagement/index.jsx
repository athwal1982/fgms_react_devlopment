import React, { useState } from "react";
import UserManagement from "./Views/UserManagement";
import UserManagementLogics from "./Logic/Logic";
import AddUser from "./Views/Modals/AddUser/AddUser";
import ProfileListModal from "./Views/Modals/ProfileListModal/ProfileListModal";
import AssignStateListModal from "./Views/Modals/AssignStateListModal/AssignStateListModal";
import ResetPasswordModal from "./Views/Modals/ResetPasswordModal/ResetPasswordModal";
import CategoryModal from "./Views/Modals/Category/CategoryAssignModal";
import AssignDistrictListModal from "./Views/Modals/District/DistrictAssignModal";
import AssignSubDistrictListModal from "./Views/Modals/SubDistrict/SubDistrictAssignModal";
import AssignBlockListModal from "./Views/Modals/Block/BlockAssignModal";
import AssignRegionalOfficeModal from "./Views/Modals/AssignRegionalOfficeModal/AssignRegionalOfficeModal";
import AssignInsCompModal from "./Views/Modals/AssignInsCompModal/AssignInsCompModal";

function UserManagementPage() {
  const [addUserModal, setAddUserModal] = useState(false);
  const toggleAddVisitModal = () => {
    setAddUserModal(!addUserModal);
  };
  const {
    filteredUserDataList,
    isLoadingUserDataList,
    updateUserData,
    onGridReady,
    onChangeUserList,
    getUsersList,
    userListItemSearch,
    onActiveUser,
    onDeActiveUser,
    updateUserDataList,
  } = UserManagementLogics();

  const referenceTypeOptions = [
    { Name: "EMP", Value: "EMP" },
    { Name: "BR", Value: "BR" },
  ];

  const [selectedUserData, setSelectedUserData] = useState({});

  const [profileListModal, setProfileListModal] = useState(false);
  const toggleProfileListModal = (data) => {
    debugger;
    setProfileListModal(!profileListModal);
    setSelectedUserData(data);
  };

  const [assignStateListModal, setAssignStateListModal] = useState(false);
  const toggleAssignStateListModal = (data) => {
    setAssignStateListModal(!assignStateListModal);
    setSelectedUserData(data);
  };

  const [assignDistrictListModal, setAssignDistrictListModal] = useState(false);
  const toggleAssignDistrictListModal = (data) => {
    setAssignDistrictListModal(!assignDistrictListModal);
    setSelectedUserData(data);
  };
  const [assignSubDistrictListModal, setAssignSubDistrictListModal] = useState(false);
  const toggleAssignSubDistrictListModal = (data) => {
    setAssignSubDistrictListModal(!assignSubDistrictListModal);
    setSelectedUserData(data);
  };
  const [assignBlockListModal, setAssignBlockListModal] = useState(false);
  const toggleAssignBlockListModal = (data) => {
    setAssignBlockListModal(!assignBlockListModal);
    setSelectedUserData(data);
  };

  const toggleCloseDistrictListModal = () => {
    setAssignDistrictListModal(!assignDistrictListModal);
  };
  const toggleCloseSubDistrictListModal = () => {
    setAssignSubDistrictListModal(!assignSubDistrictListModal);
  };
  const toggleCloseBlockListModal = () => {
    setAssignBlockListModal(!assignBlockListModal);
  };

  const [resetPasswordModal, setResetPasswordModal] = useState(false);
  const toggleResetPasswordModal = (data) => {
    setResetPasswordModal(!resetPasswordModal);
    setSelectedUserData(data);
  };

  const [categoryModal, setCategoryModal] = useState(false);
  const toggleCategoryModal = (data) => {
    setCategoryModal(!categoryModal);
    setSelectedUserData(data);
  };
  const toggleCloseCategoryModal = () => {
    setCategoryModal(!categoryModal);
  };

  const [assignRegionalOfficeListModal, setAssignRegionalOfficeListModal] = useState(false);
  const toggleAssignRegionalOfficeListModal = (data) => {
    setAssignRegionalOfficeListModal(!assignRegionalOfficeListModal);
    setSelectedUserData(data);
  };

  const [assignInsCompModal, setAssignInsCompModal] = useState(false);
  const toggleAssignInsCompModal = (data) => {
    setAssignInsCompModal(!assignInsCompModal);
    setSelectedUserData(data);
  };

  return (
    <>
      {addUserModal ? <AddUser showfunc={toggleAddVisitModal} updateUserData={updateUserData} referenceTypeOptions={referenceTypeOptions} /> : null}
      {profileListModal && <ProfileListModal showfunc={toggleProfileListModal} selectedUserData={selectedUserData} updateUserDataList={updateUserDataList} />}
      {assignStateListModal ? (
        <AssignStateListModal showfunc={toggleAssignStateListModal} selectedUserData={selectedUserData} updateUserDataList={updateUserDataList} />
      ) : null}
      {assignDistrictListModal ? (
        <AssignDistrictListModal showfunc={toggleCloseDistrictListModal} selectedUserData={selectedUserData} updateUserDataList={updateUserDataList} />
      ) : null}
      {assignSubDistrictListModal ? (
        <AssignSubDistrictListModal showfunc={toggleCloseSubDistrictListModal} selectedUserData={selectedUserData} updateUserDataList={updateUserDataList} />
      ) : null}
      {assignBlockListModal ? (
        <AssignBlockListModal showfunc={toggleCloseBlockListModal} selectedUserData={selectedUserData} updateUserDataList={updateUserDataList} />
      ) : null}

      {resetPasswordModal ? <ResetPasswordModal showfunc={toggleResetPasswordModal} selectedUserData={selectedUserData} /> : null}
      {categoryModal ? <CategoryModal showfunc={toggleCloseCategoryModal} selectedUserData={selectedUserData} /> : null}
      {assignRegionalOfficeListModal ? (
        <AssignRegionalOfficeModal showfunc={toggleAssignRegionalOfficeListModal} selectedUserData={selectedUserData} updateUserDataList={updateUserDataList} />
      ) : null}
      {assignInsCompModal ? (
        <AssignInsCompModal showfunc={toggleAssignInsCompModal} selectedUserData={selectedUserData} updateUserDataList={updateUserDataList} />
      ) : null}
      <UserManagement
        filteredUserDataList={filteredUserDataList}
        isLoadingUserDataList={isLoadingUserDataList}
        toggleAddVisitModal={toggleAddVisitModal}
        onGridReady={onGridReady}
        getUsersList={getUsersList}
        onChangeUserList={onChangeUserList}
        userListItemSearch={userListItemSearch}
        onActiveUser={onActiveUser}
        onDeActiveUser={onDeActiveUser}
        toggleProfileListModal={toggleProfileListModal}
        toggleAssignStateListModal={toggleAssignStateListModal}
        toggleAssignDistrictListModal={toggleAssignDistrictListModal}
        toggleAssignSubDistrictListModal={toggleAssignSubDistrictListModal}
        toggleAssignBlockListModal={toggleAssignBlockListModal}
        toggleCloseSubDistrictListModal={toggleCloseSubDistrictListModal}
        toggleCloseBlockListModal={toggleCloseBlockListModal}
        toggleResetPasswordModal={toggleResetPasswordModal}
        toggleCategoryModal={toggleCategoryModal}
        toggleCloseCategoryModal={toggleCloseCategoryModal}
        toggleCloseDistrictListModal={toggleCloseDistrictListModal}
        toggleAssignRegionalOfficeListModal={toggleAssignRegionalOfficeListModal}
        toggleAssignInsCompModal={toggleAssignInsCompModal}
      />
    </>
  );
}

export default UserManagementPage;
