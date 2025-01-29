import React from "react";
import PropTypes from "prop-types";
import { Loader } from "Framework/Components/Widgets";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import moment from "moment";
import BizClass from "./CallLogData.module.scss";

function CallLogData({
  formValues,
  updateState,
  onGridReady,
  onClickClearSearchFilter,
  getCallLogDataList,
  exportClick,
  filteredCallLogDataList,
  isLoadingCallLogDataList,
  onChangeCallLogDataList,
}) {
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
        <PageBar.Search onChange={(e) => onChangeCallLogDataList(e.target.value)} onClick={() => getCallLogDataList()} /> {/* Added onClickSearch handler */}
        <PageBar.Button onClick={() => onClickClearSearchFilter()} title="Clear">
          Clear
        </PageBar.Button>
        <PageBar.ExcelButton onClick={() => exportClick()} disabled={filteredCallLogDataList.length === 0}>
          Export
        </PageBar.ExcelButton>
      </PageBar>

      <DataGrid rowData={filteredCallLogDataList} loader={isLoadingCallLogDataList ? <Loader /> : false} onGridReady={onGridReady}>
        <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
        <DataGrid.Column field="CustomerNumber" headerName="Customer Number" width="155px" />
        <DataGrid.Column field="Campaign" headerName="Campaign" width="110px" />
        <DataGrid.Column field="STATUS" headerName="Status" width="160px" />
        <DataGrid.Column field="AgentID" headerName="Agent ID" width="150px" />
        <DataGrid.Column field="Agent" headerName="Agent" width="150px" />
        <DataGrid.Column field="CallStartTime" headerName="Call Start Time" width="150px" />
        <DataGrid.Column field="CallEndTime" headerName="Call End Time" width="160px" />
        <DataGrid.Column field="AgentCallStartTime" headerName="Agent Call Start Time" width="170px" />
        <DataGrid.Column field="AgentCallEndTime" headerName="Agent Call End Time" width="160px" />
        <DataGrid.Column field="Circle" headerName="Circle" width="150px" />
        <DataGrid.Column field="CustomerCallSec" headerName="Customer Call Sec" width="160px" />
        <DataGrid.Column field="QueueSeconds" headerName="Queue Seconds" width="140px" />
        <DataGrid.Column field="AgentTalkTime" headerName="Agent TalkTime" width="160px" />
        <DataGrid.Column field="UniqueID" headerName="Unique ID" width="180px" />
        <DataGrid.Column field="TransferStatus" headerName="Transfer Status" width="135px" />
        <DataGrid.Column
          field="DATE"
          headerName="Date"
          width="100px"
          valueFormatter={(param) => (param.value ? moment(param.value).format("DD-MM-YYYY") : "")}
        />
        <DataGrid.Column field="ICName" headerName="IC Name" width="290px" />
        <DataGrid.Column field="ICStatus" headerName="IC Status" width="120px" />
        <DataGrid.Column field="TicketNumber" headerName="Ticket Number" width="140px" />
        <DataGrid.Column field="Source" headerName="Source" width="120px" />
      </DataGrid>
    </div>
  );
}

CallLogData.propTypes = {
  formValues: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired,
  onGridReady: PropTypes.func.isRequired,
  getCallLogDataList: PropTypes.func.isRequired,
  onClickClearSearchFilter: PropTypes.func.isRequired,
  filteredCallLogDataList: PropTypes.array,
  isLoadingCallLogDataList: PropTypes.bool,
  onChangeCallLogDataList: PropTypes.func.isRequired,
  exportClick: PropTypes.func.isRequired,
};

export default CallLogData;
