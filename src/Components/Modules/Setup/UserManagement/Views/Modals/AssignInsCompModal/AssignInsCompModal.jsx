import React, { useEffect } from "react";
import { Modal, PageBar, DataGrid } from "Framework/Components/Layout";
import { Loader } from "Framework/Components/Widgets";
import { FiTrash2 } from "react-icons/fi";
import PropTypes from "prop-types";
import AssignInsCompModalLogic from "./Logic/AssignInsCompModalLogic";
import BizClass from "./AssignInsCompModal.module.scss";
import UnAssignInsCompModal from "../UnAssignInsCompModal/UnAssignInsCompModal";

const assignUserInsCompActionTemplate = (props) => {
  return (
    <div style={{ display: "flex" }}>
      <span
        title="Delete Assigned Insurance Company"
        style={{
          cursor: "pointer",
          display: "grid",
          marginTop: "3px",
          marginRight: "3px",
        }}
      >
        <FiTrash2 style={{ fontSize: "15px", color: "#5d6d7e" }} onClick={() => props.onClickDeleteUserAssignInsComp(props.data)} />
      </span>
    </div>
  );
};

function AssignInsCompModal({ showfunc, selectedUserData }) {
  const {
    getUserInsCompAssignList,
    userInsCompAssignList,
    isLoadingUserInsCompAssignList,
    onUserAssignInsCompGridReady,
    searchTextUserAssignInsComp,
    onSearchUserAssignInsComp,
    onClickDeleteUserAssignInsComp,
    unAssignedInsCompModal,
    toggleUnAssignedInsCompModal,
    updateAssignedInsComp,
  } = AssignInsCompModalLogic();

  useEffect(() => {
    getUserInsCompAssignList(selectedUserData);
  }, []);

  const getRowStyle = (params) => {
    if (params.data.IsNewlyAdded) {
      return { background: "#d5a10e" };
    }
    if (params.data.IsSelected) {
      return { background: "#ffc176" };
    }
    return { background: "" };
  };
  return (
    <>
      {unAssignedInsCompModal ? (
        <UnAssignInsCompModal showfunc={toggleUnAssignedInsCompModal} selectedUserData={selectedUserData} updateAssignedInsComp={updateAssignedInsComp} />
      ) : null}

      <Modal
        varient="half"
        title={`Assign Insurance Company List (${selectedUserData.UserDisplayName ? selectedUserData.UserDisplayName : ""})`}
        show={showfunc}
        right="0"
        width="49.5vw"
      >
        <Modal.Body>
          <div className={BizClass.Card}>
            <PageBar>
              <PageBar.Search
                onClick={() => console.log("CLicked")}
                value={searchTextUserAssignInsComp}
                onChange={(e) => onSearchUserAssignInsComp(e.target.value)}
              />
              <PageBar.Button onClick={toggleUnAssignedInsCompModal}>Import</PageBar.Button>
            </PageBar>
            <DataGrid
              rowData={userInsCompAssignList}
              loader={isLoadingUserInsCompAssignList ? <Loader /> : false}
              components={{
                actionTemplate: assignUserInsCompActionTemplate,
              }}
              getRowStyle={getRowStyle}
              onGridReady={onUserAssignInsCompGridReady}
            >
              <DataGrid.Column
                field="#"
                headerName="Action"
                width={90}
                pinned="left"
                cellRenderer="actionTemplate"
                cellRendererParams={{ onClickDeleteUserAssignInsComp }}
              />
              <DataGrid.Column field="#" headerName="Sr No." valueGetter="node.rowIndex + 1" width={100} type="leftAligned" />
              <DataGrid.Column headerName="Insurance Company" field="InsuranceMasterName" width={400} />
            </DataGrid>
          </div>
        </Modal.Body>
        <Modal.Footer />
      </Modal>
    </>
  );
}

export default AssignInsCompModal;

AssignInsCompModal.propTypes = {
  showfunc: PropTypes.func.isRequired,
  selectedUserData: PropTypes.object,
};
