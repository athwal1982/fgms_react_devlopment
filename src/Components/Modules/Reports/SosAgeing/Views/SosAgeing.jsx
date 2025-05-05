import React from "react";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import PropTypes from "prop-types";
import { Loader } from "Framework/Components/Widgets";
import { dateFormatDDMMYY } from "Configration/Utilities/dateformat";
import BizClass from "./SosAgeing.module.scss";

function SosAgeing({
  filteredSosAgeingDataList,
  isLoadingSosAgeingDataList,
  onGridReady,
  onChangeSosAgeingList,
  getSosAgeingList,
  SosAgeingListItemSearch,
  onClickClearSearchFilter,
  exportClick,
}) {


  return (
    <div className={BizClass.PageStart}>
      <PageBar>

        <PageBar.Search
          value={SosAgeingListItemSearch}
          onChange={(e) => onChangeSosAgeingList(e.target.value)}
          onClick={() => getSosAgeingList()}
          style={{ width: "120px" }}
        />
        <PageBar.Button onClick={() => onClickClearSearchFilter()} title="Clear">
          Clear
        </PageBar.Button>
        <PageBar.ExcelButton onClick={() => exportClick()} disabled={filteredSosAgeingDataList.length === 0}>
          Export
        </PageBar.ExcelButton>
      </PageBar>
      <div className={BizClass.divGridPagination}>
        <DataGrid rowData={filteredSosAgeingDataList} loader={isLoadingSosAgeingDataList ? <Loader /> : false} onGridReady={onGridReady}>
          <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
          <DataGrid.Column field="CallingUserID" headerName="Agent ID" width="90px" />
          <DataGrid.Column field="CallingUniqueID" headerName="Calling ID" width="160px" />
          <DataGrid.Column field="NCIPDocketNo" headerName="NCIP Docket No" width="160px" />
          <DataGrid.Column field="SupportTicketNo" headerName="Ticket No" width="160px" />
          <DataGrid.Column
            field="#"
            headerName="Creation Date"
            width="128px"
            valueGetter={(node) => {
              return node.data.TicketDate ? `${dateFormatDDMMYY(node.data.TicketDate.split("T")[0])}` : null;
            }}
          />
          <DataGrid.Column
            field="#"
            headerName="Re-Open Date"
            width="128px"
            valueGetter={(node) => {
              return node.data.ReOpenDate ? `${dateFormatDDMMYY(node.data.ReOpenDate.split("T")[0])}` : null;
            }}
          />
          <DataGrid.Column field="TicketStatus" headerName="Ticket Status" width="150px" />
          <DataGrid.Column
            field="#"
            headerName="Status Date"
            width="120px"
            valueGetter={(node) => {
              return node.data.StatusDate ? `${dateFormatDDMMYY(node.data.StatusDate.split("T")[0])}` : null;
            }}
          />
          <DataGrid.Column field="StateMasterName" headerName="State" width="150px" />
          <DataGrid.Column field="DistrictMasterName" headerName="District" width="150px" />
          <DataGrid.Column field="TicketHeadName" headerName="Type" width="150px" />
          <DataGrid.Column field="SupportTicketTypeName" headerName="Category" width="160px" />
          <DataGrid.Column field="TicketCategoryName" headerName="Sub Category" width="170px" />
          <DataGrid.Column field="CropSeasonName" headerName="Season" width="90px" />
          <DataGrid.Column field="RequestYear" headerName="Year" width="70px" />
          <DataGrid.Column field="InsuranceMasterName" headerName="Insurance Company" width="290px" />
          <DataGrid.Column field="ApplicationNo" headerName="Application No" width="210px" />
          <DataGrid.Column field="InsurancePolicyNo" headerName="Policy No" width="170px" />
          <DataGrid.Column field="CallerContactNumber" headerName="Caller Mobile No." width="140px" />
          <DataGrid.Column field="RequestorName" headerName="Farmer Name" width="220px" />
          <DataGrid.Column field="RequestorMobileNo" headerName="Mobile No" width="125px" />
           <DataGrid.Column field="CreatedBY" headerName="Created By" width="160px" />
          <DataGrid.Column field="TicketDescription" headerName="Description" width="290px" />
        </DataGrid>
      </div>
    </div>
  );
}

export default SosAgeing;
SosAgeing.propTypes = {
  filteredSosAgeingDataList: PropTypes.array,
  isLoadingSosAgeingDataList: PropTypes.bool,
  onGridReady: PropTypes.func.isRequired,
  onChangeSosAgeingList: PropTypes.func.isRequired,
  getSosAgeingList: PropTypes.func.isRequired,
  SosAgeingListItemSearch: PropTypes.string,
  onClickClearSearchFilter: PropTypes.func.isRequired,
  exportClick: PropTypes.func.isRequired,
};
