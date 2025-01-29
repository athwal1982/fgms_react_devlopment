import React from "react";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import PropTypes from "prop-types";
import { Loader } from "Framework/Components/Widgets";
import { dateFormatDDMMYY, dateToSpecificFormat } from "Configration/Utilities/dateformat";
import moment from "moment";
import BizClass from "./IrdaiEscalation.module.scss";

function IrdaiEscalation({
  formValues,
  updateState,
  filteredIrdaiEscalationDataList,
  isLoadingIrdaiEscalationDataList,
  onGridReady,
  onChangeIrdaiEscalationList,
  getIrdaiEscalationList,
  IrdaiEscalationListItemSearch,
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
          value={IrdaiEscalationListItemSearch}
          onChange={(e) => onChangeIrdaiEscalationList(e.target.value)}
          onClick={() => getIrdaiEscalationList()}
        />
        <PageBar.Button onClick={() => onClickClearSearchFilter()} title="Clear">
          Clear
        </PageBar.Button>
        <PageBar.ExcelButton onClick={() => exportClick()} disabled={filteredIrdaiEscalationDataList.length === 0}>
          Export
        </PageBar.ExcelButton>
      </PageBar>
      <DataGrid rowData={filteredIrdaiEscalationDataList} loader={isLoadingIrdaiEscalationDataList ? <Loader /> : false} onGridReady={onGridReady}>
        <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
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
          headerName="Status Date"
          width="120px"
          valueGetter={(node) => {
            return node.data.StatusUpdateTime ? `${dateFormatDDMMYY(node.data.StatusUpdateTime.split("T")[0])}` : null;
          }}
        />
        <DataGrid.Column
          field="#"
          headerName="Mail Sent On"
          width="125px"
          valueGetter={(node) => {
            return node.data.MailSentOn ? `${dateFormatDDMMYY(node.data.MailSentOn.split("T")[0])}` : null;
          }}
        />
        <DataGrid.Column field="InsuranceShortCode" headerName="Insurance Company Code" width="200px" />
        <DataGrid.Column field="InsuranceMasterName" headerName="Insurance Company" width="290px" />
        <DataGrid.Column field="TicketHeadName" headerName="Type" width="150px" />
        <DataGrid.Column field="SupportTicketTypeName" headerName="Category" width="160px" />
        <DataGrid.Column field="StateMasterName" headerName="State" width="150px" />
      </DataGrid>
    </div>
  );
}

export default IrdaiEscalation;
IrdaiEscalation.propTypes = {
  filteredIrdaiEscalationDataList: PropTypes.array,
  isLoadingIrdaiEscalationDataList: PropTypes.bool,
  onGridReady: PropTypes.func.isRequired,
  onChangeIrdaiEscalationList: PropTypes.func.isRequired,
  getIrdaiEscalationList: PropTypes.func.isRequired,
  IrdaiEscalationListItemSearch: PropTypes.string,
  formValues: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired,
  onClickClearSearchFilter: PropTypes.func.isRequired,
  exportClick: PropTypes.func.isRequired,
};
