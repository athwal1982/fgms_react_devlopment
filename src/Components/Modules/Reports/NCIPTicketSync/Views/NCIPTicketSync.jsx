import React from "react";
import PropTypes from "prop-types";
import { Loader } from "Framework/Components/Widgets";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { dateToSpecificFormat } from "Configration/Utilities/dateformat";
import moment from "moment";
import BizClass from "./NCIPTicketSync.module.scss";

function NCIPTicketSync({
  formValues,
  updateState,
  onGridReady,
  onClickClearSearchFilter,
  getNCIPTicketSyncDataList,
  exportClick,
  filteredNCIPTicketSyncDataList,
  isLoadingNCIPTicketSyncDataList,
  onChangeNCIPTicketSyncDataList,
  yearList,
}) {
  return (
    <div className={BizClass.PageStart}>
      <PageBar>
       <PageBar.Select
                 control={"select"}
                 label="Year"
                 name="txtYearFilter"
                 getOptionLabel={(option) => `${option.label}`}
                 value={formValues.txtYearFilter}
                 getOptionValue={(option) => `${option}`}
                 options={yearList}
                 onChange={(e) => updateState("txtYearFilter", e)}
        />
        <PageBar.Search onChange={(e) => onChangeNCIPTicketSyncDataList(e.target.value)} onClick={() => getNCIPTicketSyncDataList()} />
        <PageBar.Button onClick={() => onClickClearSearchFilter()} title="Clear">
          Clear
        </PageBar.Button>
        <PageBar.ExcelButton onClick={() => exportClick()} disabled={filteredNCIPTicketSyncDataList.length === 0}>
          Export
        </PageBar.ExcelButton>
      </PageBar>

      <DataGrid rowData={filteredNCIPTicketSyncDataList} loader={isLoadingNCIPTicketSyncDataList ? <Loader /> : false} onGridReady={onGridReady}>
        <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
        <DataGrid.Column field="MONTH" headerName="Month" width="170px"  />
        <DataGrid.Column field="YEAR" headerName="Year" width="170px" cellStyle={{ "text-align": "right" }} />
        <DataGrid.Column field="TotalTicket" headerName="Total Ticket" width="175px" cellStyle={{ "text-align": "right" }} />
        <DataGrid.Column field="Sync" headerName="Sync" width="170px" cellStyle={{ "text-align": "right" }} />
      </DataGrid>
    </div>
  );
}

NCIPTicketSync.propTypes = {
  formValues: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired,
  onGridReady: PropTypes.func.isRequired,
  getNCIPTicketSyncDataList: PropTypes.func.isRequired,
  onClickClearSearchFilter: PropTypes.func.isRequired,
  filteredNCIPTicketSyncDataList: PropTypes.array,
  isLoadingNCIPTicketSyncDataList: PropTypes.bool,
  onChangeNCIPTicketSyncDataList: PropTypes.func.isRequired,
  exportClick: PropTypes.func.isRequired,
};

export default NCIPTicketSync;
