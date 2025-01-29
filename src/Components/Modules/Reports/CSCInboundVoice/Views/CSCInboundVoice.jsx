import React from "react";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { Convert24FourHourAndMinute, dateToSpecificFormat } from "Configration/Utilities/dateformat";
import moment from "moment";
import PropTypes from "prop-types";
import { Loader } from "Framework/Components/Widgets";
import BizClass from "./CSCInboundVoice.module.scss";

function CSCInboundVoice({
  formValues,
  updateState,
  filteredCSCInboundVoiceDataList,
  isLoadingCSCInboundVoiceDataList,
  onGridReady,
  onChangeCSCInboundVoiceList,
  getCSCInboundVoiceList,
  CSCInboundVoiceListItemSearch,
  onClickClearSearchFilter,
  exportClick,
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
          max={dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD")}
        />

        <PageBar.Search
          value={CSCInboundVoiceListItemSearch}
          onChange={(e) => onChangeCSCInboundVoiceList(e.target.value)}
          onClick={() => getCSCInboundVoiceList()}
        />
        <PageBar.Button onClick={() => onClickClearSearchFilter()} title="Clear">
          Clear
        </PageBar.Button>
        <PageBar.ExcelButton onClick={() => exportClick()} disabled={filteredCSCInboundVoiceDataList.length === 0}>
          Export
        </PageBar.ExcelButton>
      </PageBar>
      <DataGrid rowData={filteredCSCInboundVoiceDataList} loader={isLoadingCSCInboundVoiceDataList ? <Loader /> : false} onGridReady={onGridReady}>
        <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
        <DataGrid.Column field="BatchID" headerName="Batch ID" width="140px" />
        <DataGrid.Column field="CustomerNumber" headerName="Customer Number" width="160px" />
        <DataGrid.Column field="State" headerName="State" width="150px" />
        <DataGrid.Column field="District" headerName="District" width="150px" />
        <DataGrid.Column field="CallDateTime" headerName="Call Date Time" width="160px" />
        <DataGrid.Column field="CallStatus" headerName="Call Status" width="140px" />
        <DataGrid.Column field="Durations" headerName="Durations" width="110px" />
        <DataGrid.Column field="Languages" headerName="Languages" width="120px" />
        <DataGrid.Column field="LangRes" headerName="Lang Res" width="160px" />
        <DataGrid.Column field="UserName" headerName="UserName" width="160px" />
        <DataGrid.Column field="Reason" headerName="Reason" width="160px" />
        <DataGrid.Column field="PathTaken" headerName="Path Taken" width="160px" />
        <DataGrid.Column field="CallSummary" headerName="Call Summary" width="160px" />
        <DataGrid.Column field="AudioFile" headerName="Audio File" width="320px" />
        <DataGrid.Column
          field="#"
          headerName="Created At"
          width="150px"
          valueGetter={(node) => {
            return node.data.InsertDateTime
              ? dateToSpecificFormat(
                  `${node.data.InsertDateTime.split("T")[0]} ${Convert24FourHourAndMinute(node.data.InsertDateTime.split("T")[1])}`,
                  "DD-MM-YYYY HH:mm",
                )
              : null;
          }}
        />
      </DataGrid>
    </div>
  );
}

export default CSCInboundVoice;
CSCInboundVoice.propTypes = {
  filteredCSCInboundVoiceDataList: PropTypes.array,
  isLoadingCSCInboundVoiceDataList: PropTypes.bool,
  onGridReady: PropTypes.func.isRequired,
  onChangeCSCInboundVoiceList: PropTypes.func.isRequired,
  getCSCInboundVoiceList: PropTypes.func.isRequired,
  CSCInboundVoiceListItemSearch: PropTypes.string,
  formValues: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired,
  onClickClearSearchFilter: PropTypes.func.isRequired,
  exportClick: PropTypes.func.isRequired,
};
