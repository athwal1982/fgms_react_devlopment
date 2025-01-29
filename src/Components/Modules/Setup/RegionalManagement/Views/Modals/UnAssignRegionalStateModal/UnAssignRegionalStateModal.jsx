import React, { useEffect } from "react";
import { Modal, PageBar, DataGrid } from "Framework/Components/Layout";
import { Button, Loader } from "Framework/Components/Widgets";
import PropTypes from "prop-types";
import UnAssignRegionalStateLogics from "./Logic/Logic";
import BizClass from "./UnAssignRegionalState.module.scss";

function UnAssignedRegionalStateModal({ showfunc, updateAssignedStateList, selectedRowData }) {
  const {
    onGridReadyUnAssign,
    searchTextUnAssigenState,
    onSearchUnAssignedState,
    btnloaderActive,
    handleSave,
    setSelectedRowData,
    isLoadingUnAssignDataList,
    unAssignStateList,
    getRegionalUnAssignStateList,
  } = UnAssignRegionalStateLogics();

  useEffect(() => {
    setSelectedRowData(selectedRowData);
    getRegionalUnAssignStateList(selectedRowData);
  }, []);
  return (
    <Modal varient="half" title="Un-Assign States" show={showfunc} left="0" width="49.5vw" onSubmit={(e) => handleSave(e, updateAssignedStateList)}>
      <Modal.Body>
        <div className={BizClass.Card}>
          <PageBar>
            <PageBar.Search value={searchTextUnAssigenState} onChange={(e) => onSearchUnAssignedState(e.target.value)} />
          </PageBar>
          <DataGrid rowData={unAssignStateList} loader={isLoadingUnAssignDataList ? <Loader /> : false} onGridReady={onGridReadyUnAssign}>
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
            <DataGrid.Column field="StateMasterName" headerName="State Name" width={400} />
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

export default UnAssignedRegionalStateModal;

UnAssignedRegionalStateModal.propTypes = {
  showfunc: PropTypes.func.isRequired,
  unAssignStateList: PropTypes.array,
  isLoadingUnAssignDataList: PropTypes.bool,
  updateAssignedStateList: PropTypes.func.isRequired,
  selectedRowData: PropTypes.any,
};
