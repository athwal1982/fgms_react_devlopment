import React from "react";
import PropTypes from "prop-types";
import { Loader } from "Framework/Components/Widgets";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import moment from "moment";
import BizClass from "./SLAReport.module.scss";
import SLAReportLogic from "../Logic/Logic";

function SLAReport() {
  const {
    formValues,
    updateState,
    onGridReady,
    onClickClearSearchFilter,
    getSLACallDataList,
    exportClick,
    filteredSLACallDataList,
    isLoadingSLACallDataList,
    onChangeSLACallDataList,
    ticketCategoryList,
  } = SLAReportLogic();

  const todayDate = moment().format("YYYY-MM-DD");

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
          max={todayDate}
        />
        <PageBar.Select
          ControlTxt="Sub Category"
          name="txtTicketCategory"
          options={ticketCategoryList}
          getOptionLabel={(option) => option.label}
          getOptionValue={(option) => option.value}
          value={formValues.txtTicketCategory}
          onChange={(e) => {
            updateState("txtTicketCategory", e);
          }}
        />
        <PageBar.Search onChange={(e) => onChangeSLACallDataList(e.target.value)} onClick={getSLACallDataList} />
        <PageBar.Button onClick={onClickClearSearchFilter} title="Clear">
          Clear
        </PageBar.Button>
        <PageBar.ExcelButton onClick={exportClick} disabled={filteredSLACallDataList.length === 0}>
          Export
        </PageBar.ExcelButton>
      </PageBar>

      <DataGrid rowData={filteredSLACallDataList} loader={isLoadingSLACallDataList ? <Loader /> : false} onGridReady={onGridReady}>
        <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
        <DataGrid.Column
          field="cs_date"
          headerName="Date"
          width="110px"
          valueFormatter={(param) =>
            formValues.txtTicketCategory && formValues.txtTicketCategory.value !== "MONTH" ? moment(param.value).format("DD-MM-YYYY") : param.value
          }
        />
        {/* <DataGrid.Column field="user_group" headerName="User Group" width="120px" /> */}
        <DataGrid.Column field="uptime" headerName="System Uptime (%)" width="170px" />
        <DataGrid.Column field="asa" headerName="Avg Speed To Answer(%)" width="200px" />
        <DataGrid.Column field="aht" headerName="Avg Handle Time (%)" width="180px" />
        <DataGrid.Column field="rating" headerName="Call Quality Score (%)" width="175px" />
        <DataGrid.Column field="training" headerName="Training (Hours)" width="160px" />
        <DataGrid.Column field="seat" headerName="Seat Utilization(%)" width="185px" />
      </DataGrid>
    </div>
  );
}

SLAReport.propTypes = {
  formValues: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired,
  onGridReady: PropTypes.func.isRequired,
  getSLACallDataList: PropTypes.func.isRequired,
  onClickClearSearchFilter: PropTypes.func.isRequired,
  filteredSLACallDataList: PropTypes.array,
  isLoadingSLACallDataList: PropTypes.bool,
  onChangeSLACallDataList: PropTypes.func.isRequired,
  exportClick: PropTypes.func.isRequired,
  ticketCategoryList: PropTypes.array.isRequired,
};

export default SLAReport;
