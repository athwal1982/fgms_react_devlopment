import React, { useEffect } from "react";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import PropTypes from "prop-types";
import { Loader } from "Framework/Components/Widgets";
import { dateFormatDDMMYY } from "Configration/Utilities/dateformat";
import BizClass from "./TicketStatusHistory.module.scss";

function TicketStatusHistory({
  formValues,
  updateState,
  filteredTicketStatusDataList,
  isLoadingTicketStatusDataList,
  insuranceCompanyList,
  isLoadingInsuranceCompanyList,
  getInsuranceCompanyListData,
  stateList,
  isLoadingStateList,
  getStateListData,
  onGridReady,
  onChangeTicketStatusList,
  getTicketStatusList,
  ticketStatusListItemSearch,
  onClickClearSearchFilter,
  exportClick,
}) {
  useEffect(() => {
    debugger;
    getInsuranceCompanyListData();
    getStateListData();
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

        <PageBar.Select
          ControlTxt="State"
          name="txtState"
          value={formValues.txtState}
          loader={isLoadingStateList ? <Loader /> : null}
          options={stateList}
          getOptionLabel={(option) => `${option.StateMasterName}`}
          getOptionValue={(option) => `${option}`}
          onChange={(e) => updateState("txtState", e)}
        />

        <PageBar.Select
          ControlTxt="Insurance Company"
          name="txtInsuranceCompany"
          value={formValues.txtInsuranceCompany}
          loader={isLoadingInsuranceCompanyList ? <Loader /> : null}
          options={insuranceCompanyList}
          getOptionLabel={(option) => `${option.CompanyName}`}
          getOptionValue={(option) => `${option}`}
          onChange={(e) => updateState("txtInsuranceCompany", e)}
        />

        <PageBar.Search value={ticketStatusListItemSearch} onChange={(e) => onChangeTicketStatusList(e.target.value)} onClick={() => getTicketStatusList()} />
        <PageBar.Button onClick={() => onClickClearSearchFilter()} title="Clear">
          Clear
        </PageBar.Button>
        <PageBar.ExcelButton onClick={() => exportClick()} disabled={filteredTicketStatusDataList.length === 0}>
          Export
        </PageBar.ExcelButton>
      </PageBar>
      <DataGrid rowData={filteredTicketStatusDataList} loader={isLoadingTicketStatusDataList ? <Loader /> : false} onGridReady={onGridReady}>
        <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
        <DataGrid.Column field="SupportTicketNo" headerName="Ticket No" width="135px" />
        <DataGrid.Column
          field="OPEN"
          headerName="Open Date"
          width="110px"
          valueGetter={(node) => {
            return node.data.OPEN ? `${dateFormatDDMMYY(node.data.OPEN.split("T")[0])}` : null;
          }}
        />

        <DataGrid.Column
          field="Inprogress"
          headerName="In-progress"
          width="120px"
          valueGetter={(node) => {
            return node.data.Inprogress ? `${dateFormatDDMMYY(node.data.Inprogress.split("T")[0])}` : null;
          }}
        />
        <DataGrid.Column
          field="Resolved"
          headerName="Resolved"
          width="120px"
          valueGetter={(node) => {
            return node.data.Resolved ? `${dateFormatDDMMYY(node.data.Resolved.split("T")[0])}` : null;
          }}
        />
        <DataGrid.Column
          field="ReOpen"
          headerName="Re-Open"
          width="120px"
          valueGetter={(node) => {
            return node.data.ReOpen ? `${dateFormatDDMMYY(node.data.ReOpen.split("T")[0])}` : null;
          }}
        />
        <DataGrid.Column
          field="Inprogress1"
          headerName="In-Progress - 1"
          width="132px"
          valueGetter={(node) => {
            return node.data.Inprogress1 ? `${dateFormatDDMMYY(node.data.Inprogress1.split("T")[0])}` : null;
          }}
        />
        <DataGrid.Column
          field="Resolved1"
          headerName="Resolved - 1"
          width="120px"
          valueGetter={(node) => {
            return node.data.Resolved1 ? `${dateFormatDDMMYY(node.data.Resolved1.split("T")[0])}` : null;
          }}
        />
        <DataGrid.Column
          field="ReOpen1"
          headerName="Re-Open - 1"
          width="120px"
          valueGetter={(node) => {
            return node.data.ReOpen1 ? `${dateFormatDDMMYY(node.data.ReOpen1.split("T")[0])}` : null;
          }}
        />
        <DataGrid.Column
          field="Inprogress2"
          headerName="In-Progress - 2"
          width="132px"
          valueGetter={(node) => {
            return node.data.Inprogress2 ? `${dateFormatDDMMYY(node.data.Inprogress2.split("T")[0])}` : null;
          }}
        />
        <DataGrid.Column
          field="Resolved2"
          headerName="Resolved - 2"
          width="132px"
          valueGetter={(node) => {
            return node.data.Resolved2 ? `${dateFormatDDMMYY(node.data.Resolved2.split("T")[0])}` : null;
          }}
        />
        <DataGrid.Column
          field="ReOpen2"
          headerName="Re-Open - 2"
          width="132px"
          valueGetter={(node) => {
            return node.data.ReOpen2 ? `${dateFormatDDMMYY(node.data.ReOpen2.split("T")[0])}` : null;
          }}
        />
      </DataGrid>
    </div>
  );
}

export default TicketStatusHistory;

TicketStatusHistory.propTypes = {
  filteredTicketStatusDataList: PropTypes.array,
  isLoadingTicketStatusDataList: PropTypes.bool,
  getInsuranceCompanyListData: PropTypes.func.isRequired,
  insuranceCompanyList: PropTypes.array.isRequired,
  isLoadingInsuranceCompanyList: PropTypes.bool,
  getStateListData: PropTypes.func.isRequired,
  stateList: PropTypes.array.isRequired,
  isLoadingStateList: PropTypes.bool,
  onGridReady: PropTypes.func.isRequired,
  onChangeTicketStatusList: PropTypes.func.isRequired,
  getTicketStatusList: PropTypes.func.isRequired,
  ticketStatusListItemSearch: PropTypes.string,
  formValues: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired,
  onClickClearSearchFilter: PropTypes.func.isRequired,
  exportClick: PropTypes.func.isRequired,
};
