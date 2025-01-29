import { React, useMemo } from "react";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import PropTypes from "prop-types";
import { Loader } from "Framework/Components/Widgets";
import BizClass from "./DashboardTicketCount.module.scss";

function DashboardTicketCount({
  formValues,
  updateState,
  filteredDashboardTicketCountDataList,
  isLoadingDashboardTicketCountDataList,
  onGridReady,
  onChangeDashboardTicketCountList,
  getDashboardTicketCountList,
  DashboardTicketCountListItemSearch,
  onClickClearSearchFilter,
  exportClick,
  monthList,
  yearList,
}) {
  const calculateTotalRow = () => {
    const totalRow = {
      InsuranceMasterName: "Total",
      OPEN: filteredDashboardTicketCountDataList.reduce((acc, row) => Number(acc) + Number(row.OPEN), 0),
      InProgress: filteredDashboardTicketCountDataList.reduce((acc, row) => Number(acc) + Number(row.InProgress), 0),
      Resolved: filteredDashboardTicketCountDataList.reduce((acc, row) => Number(acc) + Number(row.Resolved), 0),
      ReOpen: filteredDashboardTicketCountDataList.reduce((acc, row) => Number(acc) + Number(row.ReOpen), 0),
      ResolvedInformation: filteredDashboardTicketCountDataList.reduce((acc, row) => Number(acc) + Number(row.ResolvedInformation), 0),
    };
    return [totalRow];
  };

  const pinnedBottomRowData = useMemo(() => calculateTotalRow(), [filteredDashboardTicketCountDataList]);

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
        <PageBar.Select
          control={"select"}
          label="Month"
          name="txtMonthFilter"
          getOptionLabel={(option) => `${option.label}`}
          value={formValues.txtMonthFilter}
          getOptionValue={(option) => `${option}`}
          options={monthList}
          onChange={(e) => updateState("txtMonthFilter", e)}
        />

        <PageBar.Search
          value={DashboardTicketCountListItemSearch}
          onChange={(e) => onChangeDashboardTicketCountList(e.target.value)}
          onClick={() => getDashboardTicketCountList()}
        />
        <PageBar.Button onClick={() => onClickClearSearchFilter()} title="Clear">
          Clear
        </PageBar.Button>
        <PageBar.ExcelButton onClick={() => exportClick()} disabled={filteredDashboardTicketCountDataList.length === 0}>
          Export
        </PageBar.ExcelButton>
      </PageBar>
      <DataGrid
        rowData={filteredDashboardTicketCountDataList}
        loader={isLoadingDashboardTicketCountDataList ? <Loader /> : false}
        onGridReady={onGridReady}
        pinnedBottomRowData={pinnedBottomRowData}
      >
        {/* <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left"  /> */}
        <DataGrid.Column field="InsuranceMasterName" headerName="Insurance Company" width="390px" />
        <DataGrid.Column
          field="OPEN"
          headerName="Open"
          width="100px"
          cellStyle={{ "text-align": "right" }}
          valueGetter={(node) => {
            return node.data.OPEN ? node.data.OPEN : 0;
          }}
        />
        <DataGrid.Column
          field="InProgress"
          headerName="In-Progress"
          width="120px"
          cellStyle={{ "text-align": "right" }}
          valueGetter={(node) => {
            return node.data.InProgress ? node.data.InProgress : 0;
          }}
        />
        <DataGrid.Column
          field="Resolved"
          headerName="Resolved"
          width="120px"
          cellStyle={{ "text-align": "right" }}
          valueGetter={(node) => {
            return node.data.Resolved ? node.data.Resolved : 0;
          }}
        />
        <DataGrid.Column
          field="ResolvedInformation"
          headerName="Resolved(Information)"
          width="180px"
          cellStyle={{ "text-align": "right" }}
          valueGetter={(node) => {
            return node.data.ResolvedInformation ? node.data.ResolvedInformation : 0;
          }}
        />
        <DataGrid.Column
          field="ReOpen"
          headerName="Re-Open"
          width="120px"
          cellStyle={{ "text-align": "right" }}
          valueGetter={(node) => {
            return node.data.ReOpen ? node.data.ReOpen : 0;
          }}
        />
        <DataGrid.Column
          field="total"
          headerName="Total"
          width="110px"
          cellStyle={{ "text-align": "right" }}
          valueGetter={(node) => {
            return (
              Number(node.data.OPEN) +
              Number(node.data.InProgress) +
              Number(node.data.Resolved) +
              Number(node.data.ReOpen) +
              Number(node.data.ResolvedInformation)
            );
          }}
        />
      </DataGrid>
    </div>
  );
}

export default DashboardTicketCount;
DashboardTicketCount.propTypes = {
  filteredDashboardTicketCountDataList: PropTypes.array,
  isLoadingDashboardTicketCountDataList: PropTypes.bool,
  onGridReady: PropTypes.func.isRequired,
  onChangeDashboardTicketCountList: PropTypes.func.isRequired,
  getDashboardTicketCountList: PropTypes.func.isRequired,
  DashboardTicketCountListItemSearch: PropTypes.string,
  formValues: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired,
  onClickClearSearchFilter: PropTypes.func.isRequired,
  exportClick: PropTypes.func.isRequired,
};
