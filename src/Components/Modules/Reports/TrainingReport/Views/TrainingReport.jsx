import React, { useEffect } from "react";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import PropTypes from "prop-types";
import BizClass from "./TrainingReport.module.scss";

function TrainingReport({ formValues, updateState, onGridReady, onClickClearSearchFilter, onSelect, onSearch, onExport }) {
  useEffect(() => {
    debugger;
  }, []);

  return (
    <div className={BizClass.PageStart}>
      <PageBar>
        <PageBar.Input
          ControlTxt="From Date"
          control="input"
          type="date"
          name="txtFromDate"
          value={formValues.txtFromDate}
          onChange={(e) => updateState("txtFromDate", e.target.value)}
        />
        <PageBar.Input
          ControlTxt="To Date"
          control="input"
          type="date"
          name="txtToDate"
          value={formValues.txtToDate}
          onChange={(e) => updateState("txtToDate", e.target.value)}
        />
        <PageBar.Select label="Agent" onClick={onSelect} />
        <PageBar.Search onClick={onSearch} />
        <PageBar.Button onClick={() => onClickClearSearchFilter()} title="Clear">
          Clear
        </PageBar.Button>
        <PageBar.ExcelButton onClick={onExport}>Export</PageBar.ExcelButton>
      </PageBar>

      <DataGrid rowData={[]} onGridReady={onGridReady} pagination="true">
        <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
        <DataGrid.Column field="AgentID" headerName="Agent ID" width="160px" />
        <DataGrid.Column field="AgentNumber" headerName="Agent Number" width="150px" />
        <DataGrid.Column field="AgentName" headerName="Agent Name" width="150px" />
        <DataGrid.Column field="TrainingType" headerName="Training Type" width="150px" />
        <DataGrid.Column field="TrainingDate" headerName="Training Date" width="150px" />
        <DataGrid.Column field="TrainingHours" headerName="Training Hours" width="150px" />
      </DataGrid>
    </div>
  );
}

TrainingReport.propTypes = {
  formValues: PropTypes.object,
  updateState: PropTypes.func.isRequired,
  onGridReady: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onClickClearSearchFilter: PropTypes.func.isRequired,
};

export default TrainingReport;
