import React from "react";
import { DataGrid, PageBar } from "Framework/Components/Layout";
// Anil import { Loader, Splitter } from "Framework/Components/Widgets";
import { Loader } from "Framework/Components/Widgets";
import { HiArrowCircleRight } from "react-icons/hi";
import { FiTrash2 } from "react-icons/fi";
import PropTypes from "prop-types";
import BizClass from "./regionalManagement.module.scss";

const cellTemplate = (props) => {
  return (
    <div style={{ display: "flex", gap: "4px", marginTop: "2px" }}>
      <HiArrowCircleRight style={{ fontSize: "16px", color: "#34495E", cursor: "pointer" }} onClick={() => props.onGetMenuClick(props.data)} />
    </div>
  );
};

const assignedRegionalStateActionTemplate = (props) => {
  return (
    <div style={{ display: "flex" }}>
      <span
        title="Delete Assigned State"
        style={{
          cursor: "pointer",
          display: "grid",
          marginTop: "3px",
          marginRight: "3px",
        }}
      >
        <FiTrash2 style={{ fontSize: "15px", color: "#5d6d7e" }} onClick={() => props.onClickDeleteAssignedRegionalState(props.data)} />
      </span>
    </div>
  );
};

function RegionalManagement({
  isLoadingRegionalDataList,
  regionalDataList,
  onGridReady,
  toggleAddRegionalMasterModal,
  regionalListItemSearch,
  onChangeRegionList,
  getRegionalList,
  // Anil onGetMenuClick,
  isLoadingAssignDataList,
  assignStateList,
  onGridAssignReady,
  onClickDeleteAssignedRegionalState,
  searchTextAssigendRegionalState,
  onSearchAssignedRegionalState,
  toggleUnAssignedRegionalStateModal,
}) {
  const getRowStyle = (params) => {
    console.log(params);
    if (params.data.IsNewlyAdded) {
      return { background: "#d5a10e" };
    }
    if (params.node.selected) {
      return { background: "#ffc176" };
    }
    return { background: "" };
  };

  const getRowStyleAssign = (params) => {
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
      {/* <Splitter varient="column" template="1fr 9px 1fr"> */}
      <div className={BizClass.Card}>
        <PageBar>
          <PageBar.Search value={regionalListItemSearch} onChange={(e) => onChangeRegionList(e.target.value)} onClick={() => getRegionalList()} />{" "}
          <PageBar.Button onClick={() => toggleAddRegionalMasterModal()}>Add Regional Office</PageBar.Button>
        </PageBar>
        <DataGrid
          rowData={regionalDataList}
          onGridReady={onGridReady}
          getRowStyle={getRowStyle}
          loader={isLoadingRegionalDataList ? <Loader /> : false}
          components={{
            actionTemplate: cellTemplate,
          }}
        >
          {/* <DataGrid.Column
            headerName="Action"
            lockPosition="1"
            pinned="left"
            width={80}
            cellRenderer="actionTemplate"
            cellRendererParams={{
              onGetMenuClick,
            }}
          /> */}
          <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
          <DataGrid.Column field="RegionOfficeName" headerName="Regional Office" width={270} />
          {/* <DataGrid.Column field="InsuranceMasterName" headerName="Insurance Company" width={450} />
            <DataGrid.Column field="BankMasterName" headerName="Bank" width={350} /> */}
        </DataGrid>
      </div>
      <div className={BizClass.Card} style={{ display: "none" }}>
        <PageBar>
          <PageBar.Search value={searchTextAssigendRegionalState} onChange={(e) => onSearchAssignedRegionalState(e.target.value)} />
          <PageBar.Button onClick={() => toggleUnAssignedRegionalStateModal()}>Import</PageBar.Button>
        </PageBar>
        <DataGrid
          rowData={assignStateList}
          onGridReady={onGridAssignReady}
          getRowStyle={getRowStyleAssign}
          loader={isLoadingAssignDataList ? <Loader /> : false}
          defaultColDef={{
            flex: 1,
            resizable: true,
          }}
          components={{
            actionTemplate: assignedRegionalStateActionTemplate,
          }}
        >
          <DataGrid.Column
            headerName="Action"
            lockPosition="1"
            pinned="left"
            width={80}
            cellRenderer="actionTemplate"
            cellRendererParams={{
              onClickDeleteAssignedRegionalState,
            }}
          />
          <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
          <DataGrid.Column field="RegionOfficeName" headerName="Region Office" width={170} />
          {/* <DataGrid.Column field="InsuranceMasterName" headerName="Insurance Company" width={450} />
            <DataGrid.Column field="StateMasterName" headerName="State" width={350} /> */}
        </DataGrid>
      </div>
      {/* </Splitter> */}
    </div>
  );
}

export default RegionalManagement;
RegionalManagement.propTypes = {
  isLoadingRegionalDataList: PropTypes.bool,
  regionalDataList: PropTypes.array,
  onGridReady: PropTypes.func.isRequired,
  toggleAddRegionalMasterModal: PropTypes.func.isRequired,
  regionalListItemSearch: PropTypes.string,
  onChangeRegionList: PropTypes.func.isRequired,
  getRegionalList: PropTypes.func.isRequired,
  // Anil  onGetMenuClick: PropTypes.func.isRequired,
  isLoadingAssignDataList: PropTypes.bool,
  assignStateList: PropTypes.array,
  onGridAssignReady: PropTypes.func.isRequired,
  onClickDeleteAssignedRegionalState: PropTypes.func.isRequired,
  searchTextAssigendRegionalState: PropTypes.string,
  onSearchAssignedRegionalState: PropTypes.func.isRequired,
  toggleUnAssignedRegionalStateModal: PropTypes.func.isRequired,
  unAssignRegionalStateModal: PropTypes.bool,
};
