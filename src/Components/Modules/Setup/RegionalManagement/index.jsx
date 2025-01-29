import React, { useState } from "react";
import RegionalManagement from "./Views/RegionalManagement";
import RegionalManagementLogics from "./Logic/Logic";
import AddRegionalOfficeMaster from "./Views/Modals/AddRegionalMaster/AddRegionalMasterModal";
import UnAssignedRegionalStateModal from "./Views/Modals/UnAssignRegionalStateModal/UnAssignRegionalStateModal";

function RegionalManagementPage() {
  const [addRegionalMasterModal, setAddRegionalMasterModal] = useState(false);
  const [unAssignRegionalStateModal, setUnAssignRegionalStateModal] = useState(false);
  const {
    isLoadingRegionalDataList,
    regionalDataList,
    onGridReady,
    updateUserData,
    regionalListItemSearch,
    onChangeRegionList,
    getRegionalList,
    onGetMenuClick,
    isLoadingAssignDataList,
    assignStateList,
    onGridAssignReady,
    onClickDeleteAssignedRegionalState,
    onSearchAssignedRegionalState,
    updateAssignedStateList,
    selectedRowData,
  } = RegionalManagementLogics();

  const toggleAddRegionalMasterModal = () => {
    setAddRegionalMasterModal(!addRegionalMasterModal);
  };

  const toggleUnAssignedRegionalStateModal = () => {
    setUnAssignRegionalStateModal(!unAssignRegionalStateModal);
  };

  const bankInsuranceTypeOptions = [
    { Name: "Bank", Value: 1 },
    { Name: "Insurance Company", Value: 2 },
  ];

  return (
    <>
      {addRegionalMasterModal ? (
        <AddRegionalOfficeMaster showfunc={toggleAddRegionalMasterModal} updateUserData={updateUserData} bankInsuranceTypeOptions={bankInsuranceTypeOptions} />
      ) : null}
      {unAssignRegionalStateModal ? (
        <UnAssignedRegionalStateModal
          showfunc={toggleUnAssignedRegionalStateModal}
          updateAssignedStateList={updateAssignedStateList}
          selectedRowData={selectedRowData}
        />
      ) : null}

      <RegionalManagement
        isLoadingRegionalDataList={isLoadingRegionalDataList}
        regionalDataList={regionalDataList}
        onGridReady={onGridReady}
        toggleAddRegionalMasterModal={toggleAddRegionalMasterModal}
        onChangeRegionList={onChangeRegionList}
        regionalListItemSearch={regionalListItemSearch}
        getRegionalList={getRegionalList}
        onGetMenuClick={onGetMenuClick}
        isLoadingAssignDataList={isLoadingAssignDataList}
        assignStateList={assignStateList}
        onGridAssignReady={onGridAssignReady}
        onClickDeleteAssignedRegionalState={onClickDeleteAssignedRegionalState}
        onSearchAssignedRegionalState={onSearchAssignedRegionalState}
        toggleUnAssignedRegionalStateModal={toggleUnAssignedRegionalStateModal}
      />
    </>
  );
}

export default RegionalManagementPage;
