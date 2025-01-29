import React from "react";
import PropTypes from "prop-types";
import { Loader } from "Framework/Components/Widgets";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { dateToSpecificFormat } from "Configration/Utilities/dateformat";
import moment from "moment";
import BizClass from "./ReOpenTickets.module.scss";

function ReOpenTickets({
  formValues,
  updateState,
  onGridReady,
  onClickClearSearchFilter,
  getReOpenTicketsDataList,
  exportClick,
  filteredReOpenTicketsDataList,
  isLoadingReOpenTicketsDataList,
  onChangeReOpenTicketsDataList,
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
          // A style={{ display: "none" }}
        />
        <PageBar.Input
          ControlTxt="To Date"
          control="input"
          type="date"
          name="txtToDate"
          value={formValues.txtToDate}
          onChange={(e) => updateState("txtToDate", e.target.value)}
          max={dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD")}
          // A style={{ display: "none" }}
        />
        <PageBar.Search onChange={(e) => onChangeReOpenTicketsDataList(e.target.value)} onClick={() => getReOpenTicketsDataList()} />
        <PageBar.Button onClick={() => onClickClearSearchFilter()} title="Clear">
          Clear
        </PageBar.Button>
        <PageBar.ExcelButton onClick={() => exportClick()} disabled={filteredReOpenTicketsDataList.length === 0}>
          Export
        </PageBar.ExcelButton>
      </PageBar>

      <DataGrid rowData={filteredReOpenTicketsDataList} loader={isLoadingReOpenTicketsDataList ? <Loader /> : false} onGridReady={onGridReady}>
        <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
        <DataGrid.Column field="SupportTicketNo" headerName="Support Ticket No" width="170px" />
        <DataGrid.Column field="ApplicationNo" headerName="Application No" width="175px" />
        <DataGrid.Column field="InsurancePolicyNo" headerName="Insurance Policy No" width="170px" />
        <DataGrid.Column field="InsuranceMasterName" headerName="Insurance Company" width="290px" />
        <DataGrid.Column field="REOpenDate" headerName="Re-Open Date" width="140px" />
        <DataGrid.Column field="RequestYear" headerName="Year" width="80px" />
        <DataGrid.Column field="CropSeasonName" headerName="Season" width="120px" />
        <DataGrid.Column field="CallerContactNumber" headerName="Caller Mobile No." width="140px" />
        <DataGrid.Column field="RequestorMobileNo" headerName="Mobile No" width="120px" />
        <DataGrid.Column field="RequestorName" headerName="Farmer Name" width="200px" />
        <DataGrid.Column field="StateMasterName" headerName="State" width="180px" />
        <DataGrid.Column field="DistrictMasterName" headerName="District" width="150px" />
        <DataGrid.Column field="StatusDate" headerName="Status Date" width="135px" />
        <DataGrid.Column field="TicketHeadName" headerName="Type" width="150px" />
        <DataGrid.Column field="SupportTicketTypeName" headerName="Category" width="140px" />
        <DataGrid.Column field="TicketCategoryName" headerName="Sub Category" width="220px" />
        <DataGrid.Column field="TicketDate" headerName="Ticket Date" width="125px" />
        <DataGrid.Column field="TicketDescription" headerName="Description" width="320px" />
        <DataGrid.Column field="TicketStatus" headerName="Ticket Status" width="120px" />
      </DataGrid>
    </div>
  );
}

ReOpenTickets.propTypes = {
  formValues: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired,
  onGridReady: PropTypes.func.isRequired,
  getReOpenTicketsDataList: PropTypes.func.isRequired,
  onClickClearSearchFilter: PropTypes.func.isRequired,
  filteredReOpenTicketsDataList: PropTypes.array,
  isLoadingReOpenTicketsDataList: PropTypes.bool,
  onChangeReOpenTicketsDataList: PropTypes.func.isRequired,
  exportClick: PropTypes.func.isRequired,
};

export default ReOpenTickets;
