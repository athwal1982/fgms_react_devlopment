import React, { useEffect } from "react";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import PropTypes from "prop-types";
import { Button, Loader } from "Framework/Components/Widgets";
import { dateToSpecificFormat } from "Configration/Utilities/dateformat";
import moment from "moment";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import BizClass from "./Grievance.module.scss";

function GrievanceReport({
  ticketCategoryList,
  isLoadingTicketCategoryList,
  formValues,
  updateState,
  ticketCategoryTypeList,
  isLoadingTicketCategoryTypeList,
  filteredGrievanceReportDataList,
  isLoadingGrievanceReportDataList,
  onGridReady,
  onChangeGrievanceReportList,
  getGrievanceReportsList,
  grievanceReportListItemSearch,
  getTicketCategoryTypeListData,
  onClickClearSearchFilter,
  exportClick,
}) {
  const userData = getSessionStorage("user");
  const ChkBRHeadTypeID = userData && userData.BRHeadTypeID ? userData.BRHeadTypeID.toString() : "0";
  const ChkAppAccessTypeID = userData && userData.AppAccessTypeID ? userData.AppAccessTypeID.toString() : "0";

  useEffect(() => {
    getTicketCategoryTypeListData(1);
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
          max={dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD")}
        />
        <PageBar.Select
          ControlTxt="Category"
          name="txtTicketCategoryType"
          value={formValues.txtTicketCategoryType}
          loader={isLoadingTicketCategoryTypeList ? <Loader /> : null}
          options={ticketCategoryTypeList}
          getOptionLabel={(option) => `${option.SupportTicketTypeName}`}
          getOptionValue={(option) => `${option}`}
          onChange={(e) => updateState("txtTicketCategoryType", e)}
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
        {ChkBRHeadTypeID === "124001" && ChkAppAccessTypeID === "472" ? (
          <Button type="button" varient="primary" onClick={() => getGrievanceReportsList("MONGO")}>
            Search Mongodb
          </Button>
        ) : null}
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
        <DataGrid.Column field="TicketCategoryName" headerName="Sub Category" width={200} />
        <DataGrid.Column field="Open" headerName="Open" width={85} cellStyle={{ "text-align": "right" }} />
        <DataGrid.Column field="Progress" headerName="In-Progress" width={120} cellStyle={{ "text-align": "right" }} />
        <DataGrid.Column field="Resolved" headerName="Resolved" width={100} cellStyle={{ "text-align": "right" }} />
        <DataGrid.Column field="Re-Open" headerName="Re-Open" width={100} cellStyle={{ "text-align": "right" }} />
        <DataGrid.Column field="Total" headerName="Total" width={90} cellStyle={{ "text-align": "right" }} />
      </DataGrid>
    </div>
  );
}

export default GrievanceReport;
GrievanceReport.propTypes = {
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
  ticketCategoryTypeList: PropTypes.array.isRequired,
  isLoadingTicketCategoryTypeList: PropTypes.bool,
  getTicketCategoryTypeListData: PropTypes.func.isRequired,
  onClickClearSearchFilter: PropTypes.func.isRequired,
  exportClick: PropTypes.func.isRequired,
};
