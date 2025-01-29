import React from "react";
import { DataGrid, PageBar } from "Framework/Components/Layout";
// Anil import { Loader, Splitter } from "Framework/Components/Widgets";
import { Loader } from "Framework/Components/Widgets";
import { AiFillEdit } from "react-icons/ai";
import PropTypes from "prop-types";
import BizClass from "./InsuranceCompanyManagement.module.scss";

const cellTemplate = (props) => {
  return (
    <div style={{ display: "flex", gap: "4px", marginTop: "2px" }}>
      <AiFillEdit
        title="Edit Insurance Company"
        style={{ fontSize: "16px", color: "#34495E", cursor: "pointer" }}
        onClick={() => props.toggleEditInsuranceCompanyModal(props.data)}
      />
    </div>
  );
};

function InsuranceCompanyManagement({
  isLoadingInsuranceCompanyDataList,
  insuranceCompanyDataList,
  onGridReady,
  toggleAddInsuranceCompanyModal,
  insuranceCompanyListItemSearch,
  onChangeInsuranceCompanyList,
  getInsuranceCompanyList,
  toggleEditInsuranceCompanyModal,
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

  return (
    <div className={BizClass.PageStart}>
      {/* <Splitter varient="column" template="1fr 9px 1fr"> */}
      <div className={BizClass.Card}>
        <PageBar>
          <PageBar.Search
            value={insuranceCompanyListItemSearch}
            onChange={(e) => onChangeInsuranceCompanyList(e.target.value)}
            onClick={() => getInsuranceCompanyList()}
          />{" "}
          <PageBar.Button onClick={() => toggleAddInsuranceCompanyModal()}>Add Insurance Company</PageBar.Button>
        </PageBar>
        <DataGrid
          rowData={insuranceCompanyDataList}
          onGridReady={onGridReady}
          getRowStyle={getRowStyle}
          loader={isLoadingInsuranceCompanyDataList ? <Loader /> : false}
          components={{
            actionTemplate: cellTemplate,
          }}
        >
          <DataGrid.Column
            headerName="Action"
            lockPosition="1"
            pinned="left"
            width={80}
            cellRenderer="actionTemplate"
            cellRendererParams={{
              toggleEditInsuranceCompanyModal,
            }}
          />
          <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
          <DataGrid.Column field="InsuranceShortCode" headerName="Short Code" width={200} />
          <DataGrid.Column field="InsuranceMasterName" headerName="Insurance Company" width={915} />
        </DataGrid>
      </div>
      {/* </Splitter> */}
    </div>
  );
}

export default InsuranceCompanyManagement;
InsuranceCompanyManagement.propTypes = {
  isLoadingInsuranceCompanyDataList: PropTypes.bool,
  insuranceCompanyDataList: PropTypes.array,
  onGridReady: PropTypes.func.isRequired,
  toggleAddInsuranceCompanyModal: PropTypes.func.isRequired,
  insuranceCompanyListItemSearch: PropTypes.string,
  onChangeInsuranceCompanyList: PropTypes.func.isRequired,
  getInsuranceCompanyList: PropTypes.func.isRequired,
  toggleEditInsuranceCompanyModal: PropTypes.func.isRequired,
};
