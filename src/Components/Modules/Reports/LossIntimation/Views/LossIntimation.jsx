import React from "react";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import PropTypes from "prop-types";
import { Loader } from "Framework/Components/Widgets";
import { dateToSpecificFormat } from "Configration/Utilities/dateformat";
import moment from "moment";
import BizClass from "./LossIntimation.module.scss";

function LossIntimationReport({
  ticketCategoryList,
  isLoadingTicketCategoryList,
  formValues,
  updateState,
  filteredGrievanceReportDataList,
  isLoadingGrievanceReportDataList,
  onGridReady,
  onChangeGrievanceReportList,
  getGrievanceReportsList,
  grievanceReportListItemSearch,
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
        <PageBar.Select
          ControlTxt="Sub Category"
          name="txtTicketCategory"
          options={ticketCategoryList}
          loader={isLoadingTicketCategoryList ? <Loader /> : null}
          getOptionLabel={(option) => `${option.TicketCategoryName}`}
          getOptionValue={(option) => `${option}`}
          value={formValues.txtTicketCategory}
          onChange={(e) => updateState("txtTicketCategory", e)}
        />
        <PageBar.Search
          value={grievanceReportListItemSearch}
          onChange={(e) => onChangeGrievanceReportList(e.target.value)}
          onClick={() => getGrievanceReportsList()}
        />
        <PageBar.Button onClick={() => onClickClearSearchFilter()} title="Clear">
          Clear
        </PageBar.Button>
        <PageBar.ExcelButton onClick={() => exportClick()} disabled={filteredGrievanceReportDataList.length === 0}>
          Export
        </PageBar.ExcelButton>
      </PageBar>
      <DataGrid rowData={filteredGrievanceReportDataList} loader={isLoadingGrievanceReportDataList ? <Loader /> : false} onGridReady={onGridReady}>
        <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
        <DataGrid.Column field="TicketHeadName" headerName="Type" width={150} />
        <DataGrid.Column field="TicketTypeName" headerName="Category" width={150} />
        <DataGrid.Column field="TicketCategoryName" headerName="Sub Category" width={400} />
        <DataGrid.Column field="Open" headerName="Open" width={85} cellStyle={{ "text-align": "right" }} />
        <DataGrid.Column field="Progress" headerName="In-Progress" width={120} cellStyle={{ "text-align": "right" }} />
        <DataGrid.Column field="Resolved" headerName="Resolved" width={100} cellStyle={{ "text-align": "right" }} />
        <DataGrid.Column field="Re-Open" headerName="Re-Open" width={100} cellStyle={{ "text-align": "right" }} />
        <DataGrid.Column field="Total" headerName="Total" width={90} cellStyle={{ "text-align": "right" }} />
      </DataGrid>
    </div>
  );
}

export default LossIntimationReport;
LossIntimationReport.propTypes = {
  filteredGrievanceReportDataList: PropTypes.array,
  isLoadingGrievanceReportDataList: PropTypes.bool,
  onGridReady: PropTypes.func.isRequired,
  onChangeGrievanceReportList: PropTypes.func.isRequired,
  getGrievanceReportsList: PropTypes.func.isRequired,
  grievanceReportListItemSearch: PropTypes.string,
  isLoadingFarmersticket: PropTypes.bool.isRequired,
  ticketCategoryList: PropTypes.array.isRequired,
  isLoadingTicketCategoryList: PropTypes.bool,
  formValues: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired,
  getTicketCategoryTypeListData: PropTypes.func.isRequired,
  onClickClearSearchFilter: PropTypes.func.isRequired,
  exportClick: PropTypes.func.isRequired,
};
