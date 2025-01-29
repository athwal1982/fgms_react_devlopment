import React, { useEffect } from "react";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { Convert24FourHourAndMinute, dateToSpecificFormat } from "Configration/Utilities/dateformat";
import moment from "moment";
import PropTypes from "prop-types";
import { Loader } from "Framework/Components/Widgets";
import BizClass from "./CropLossIntimation.module.scss";

function LossIntimationReport({
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
  useEffect(() => {
    getTicketCategoryTypeListData(4);
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
        <PageBar.Button onClick={() => onClickClearSearchFilter()} title="Clear">
          Clear
        </PageBar.Button>
        <PageBar.ExcelButton onClick={() => exportClick()} disabled={filteredGrievanceReportDataList.length === 0}>
          Export
        </PageBar.ExcelButton>
      </PageBar>
      <DataGrid rowData={filteredGrievanceReportDataList} loader={isLoadingGrievanceReportDataList ? <Loader /> : false} onGridReady={onGridReady}>
        <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
        <DataGrid.Column field="CallingUniqueID" headerName="Calling ID" width="160px" />
        <DataGrid.Column field="NCIPDocketNo" headerName="NCIP Docket No" width="160px" />
        <DataGrid.Column field="SupportTicketNo" headerName="Ticket No" width="160px" />
        <DataGrid.Column field="ApplicationNo" headerName="Application No" width="180px" />
        <DataGrid.Column field="InsurancePolicyNo" headerName="Policy No" width="170px" />
        <DataGrid.Column field="TicketStatus" headerName="Ticket Status" width="120px" />
        <DataGrid.Column field="RequestorName" headerName="Farmer Name" width="210px" />
        <DataGrid.Column field="RequestorMobileNo" headerName="Mobile No" width="110px" />
        <DataGrid.Column field="StateMasterName" headerName="State" width="160px" />
        <DataGrid.Column field="DistrictMasterName" headerName="District" width="160px" />
        <DataGrid.Column field="VillageName" headerName="village" width="160px" />
        <DataGrid.Column field="AREA" headerName="Area In Hactare" width="160px" />
        <DataGrid.Column field="ApplicationCropName" headerName="Application Crop Name" width="180px" />
        <DataGrid.Column field="InsuranceCompany" headerName="Insurance Company" width="320px" />
        <DataGrid.Column field="TicketHeadName" headerName="Type" width="150px" />
        <DataGrid.Column field="TicketTypeName" headerName="Category" width="180px" />
        <DataGrid.Column field="TicketCategoryName" headerName="Sub Category" width="160px" />
        <DataGrid.Column field="CropCategoryOthers" headerName="Other Sub Category" width="250px" />
        <DataGrid.Column field="CropStage" headerName="Crop Stage Type" width="160px" />
        <DataGrid.Column field="CropStageSelection" headerName="Loss At" width="320px" />
        <DataGrid.Column field="CropStageMaster" headerName="Crop Stage" width="140px" />
        <DataGrid.Column
          field="LossDate"
          headerName="Loss Date"
          width="130px"
          valueFormatter={(param) => (param.value ? moment(param.value).format("DD-MM-YYYY") : "")}
        />
        <DataGrid.Column
          field="#"
          headerName="Intimation"
          width="110px"
          valueGetter={(node) => {
            return node.data.OnTimeIntimationFlag && node.data.OnTimeIntimationFlag === "NO"
              ? "Late"
              : node.data.OnTimeIntimationFlag === "YES"
              ? "On-time"
              : null;
          }}
        />
        <DataGrid.Column
          field="PostHarvestDate"
          headerName="Harvest Date"
          width="130px"
          valueFormatter={(param) => (param.value ? moment(param.value).format("DD-MM-YYYY") : "")}
        />
        <DataGrid.Column field="CropName" headerName="Crop Name" width="160px" />
        <DataGrid.Column field="CreatedBY" headerName="Created By" width="160px" />
        <DataGrid.Column
          field="#"
          headerName="Created At"
          width="145px"
          valueGetter={(node) => {
            return node.data.CreatedAt
              ? dateToSpecificFormat(
                  `${node.data.CreatedAt.split("T")[0]} ${Convert24FourHourAndMinute(node.data.CreatedAt.split("T")[1])}`,
                  "DD-MM-YYYY HH:mm",
                )
              : null;
          }}
        />
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
  ticketCategoryTypeList: PropTypes.array.isRequired,
  isLoadingTicketCategoryTypeList: PropTypes.bool,
  getTicketCategoryTypeListData: PropTypes.func.isRequired,
  onClickClearSearchFilter: PropTypes.func.isRequired,
  exportClick: PropTypes.func.isRequired,
};
