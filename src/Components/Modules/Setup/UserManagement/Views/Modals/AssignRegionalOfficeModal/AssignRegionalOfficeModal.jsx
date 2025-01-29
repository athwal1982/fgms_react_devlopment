import React, { useEffect } from "react";
import { Modal, PageBar, DataGrid } from "Framework/Components/Layout";
import { Loader, Button } from "Framework/Components/Widgets";
import PropTypes from "prop-types";
import AssignRegionalOfficeListLogic from "./Logic/Logic";

import BizClass from "./assignRegionalOfficeModal.module.scss";

function AssignRegionalOfficeModal({ showfunc, selectedUserData, updateUserDataList }) {
  const {
    getUserRegionalAssignList,
    userRegionalAssignList,
    isLoadingUserRegionAssignList,
    onRegionaAssignGridReady,
    searchTextAssignRegion,
    onSearchAssignRegion,
    btnloaderActive,
    handleSave,
    setSelectedUser,
  } = AssignRegionalOfficeListLogic();

  useEffect(() => {
    setSelectedUser(selectedUserData);
    getUserRegionalAssignList(selectedUserData);
  }, []);

  const getRowStyle = (params) => {
    console.log(params);
    if (params.node.data.AssignmentFlag === 1) {
      params.node.setSelected(true);
    } else {
      params.node.setSelected(false);
    }
    if (params.data.IsNewlyAdded) {
      return { background: "#d5a10e" };
    }
    if (params.data.Selected === true) {
      return { background: "#ffc176" };
    }
    return { background: "" };
  };

  return (
    <Modal
      varient="half"
      title={`Assign Region List (${selectedUserData.UserDisplayName ? selectedUserData.UserDisplayName : ""})`}
      show={showfunc}
      right="0"
      width="49.5vw"
      onSubmit={(e) => handleSave(e, showfunc, updateUserDataList)}
    >
      <Modal.Body>
        <div className={BizClass.Card}>
          <PageBar>
            <PageBar.Search onClick={() => console.log("CLicked")} value={searchTextAssignRegion} onChange={(e) => onSearchAssignRegion(e.target.value)} />
          </PageBar>
          <DataGrid
            rowData={userRegionalAssignList}
            loader={isLoadingUserRegionAssignList ? <Loader /> : false}
            getRowStyle={getRowStyle}
            onGridReady={onRegionaAssignGridReady}
          >
            <DataGrid.Column
              lockPosition="1"
              pinned="left"
              headerName=""
              field=""
              width={60}
              rowMultiSelectWithClick={false}
              rowSelection="single"
              suppressRowClickSelection={false}
              checkboxSelection
            />
            <DataGrid.Column field="#" headerName="Sr No." valueGetter="node.rowIndex + 1" width={100} type="leftAligned" />
            <DataGrid.Column headerName="Region Office" field="RegionOfficeName" width={220} />
            <DataGrid.Column headerName="Insurance Company" field="InsuranceMasterName" width={240} />
            <DataGrid.Column headerName="State" field="StateMasterName" width={220} />
          </DataGrid>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" varient="secondary" trigger={btnloaderActive}>
          Assign
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AssignRegionalOfficeModal;

AssignRegionalOfficeModal.propTypes = {
  showfunc: PropTypes.func.isRequired,
  selectedUserData: PropTypes.object,
  updateUserDataList: PropTypes.func.isRequired,
};
