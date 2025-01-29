import React, { useEffect } from "react";
import { DataGrid, Modal, PageBar } from "Framework/Components/Layout";
import { Loader, Button } from "Framework/Components/Widgets";
import PropTypes from "prop-types";
import UnAssignInsCompModalLogic from "./Logic/UnAssignInsCompModalLogic";

import BizClass from "./UnAssignInsCompModal.module.scss";

function UnAssignInsCompModal({ showfunc, selectedUserData, updateAssignedInsComp }) {
  const {
    unAssignInsComp,
    isLoadingUnAssignInsComp,
    onGridReadyUnAssign,
    searchTextUnAssigendInsComp,
    onSearchUnAssignedInsComp,
    getUnAssignedInsCompData,
    btnloaderActive,
    handleSave,
    setSelectedRowData,
  } = UnAssignInsCompModalLogic();

  useEffect(() => {
    setSelectedRowData(selectedUserData);
    getUnAssignedInsCompData(selectedUserData);
  }, []);
  return (
    <Modal
      varient="half"
      title={`UnAssign Insurance Company List (${selectedUserData.UserDisplayName ? selectedUserData.UserDisplayName : ""})`}
      show={showfunc}
      left="0"
      width="49.5vw"
      onSubmit={(e) => handleSave(e, updateAssignedInsComp)}
    >
      <Modal.Body>
        <div className={BizClass.Card}>
          <PageBar>
            <PageBar.Search
              onClick={() => console.log("CLicked")}
              value={searchTextUnAssigendInsComp}
              onChange={(e) => onSearchUnAssignedInsComp(e.target.value)}
            />
          </PageBar>
          <DataGrid rowData={unAssignInsComp} loader={isLoadingUnAssignInsComp ? <Loader /> : false} onGridReady={onGridReadyUnAssign}>
            <DataGrid.Column
              lockPosition="1"
              pinned="left"
              headerName=""
              field=""
              width={60}
              headerCheckboxSelection
              headerCheckboxSelectionFilteredOnly
              checkboxSelection
            />
            <DataGrid.Column field="#" headerName="Sr No." valueGetter="node.rowIndex + 1" width={100} type="leftAligned" />
            <DataGrid.Column headerName="Insurance Company" field="InsuranceMasterName" width={400} />
          </DataGrid>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" varient="secondary" trigger={btnloaderActive}>
          Import
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UnAssignInsCompModal;

UnAssignInsCompModal.propTypes = {
  showfunc: PropTypes.func.isRequired,
  selectedUserData: PropTypes.any,
  updateAssignedInsComp: PropTypes.func.isRequired,
};
