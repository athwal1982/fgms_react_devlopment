import React, { useEffect } from "react";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import PropTypes from "prop-types";
import { Button, Loader } from "Framework/Components/Widgets";
import { dateFormatDDMMYY, dateToSpecificFormat } from "Configration/Utilities/dateformat";
import moment from "moment";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import BizClass from "./TicketHistory.module.scss";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/bootstrap.css";

function TicketHistory({
  formValues,
  updateState,
  filteredTicketHistoryDataList,
  isLoadingTicketHistoryDataList,
  insuranceCompanyList,
  isLoadingInsuranceCompanyList,
  getInsuranceCompanyListData,
  stateList,
  isLoadingStateList,
  getStateListData,
  onGridReady,
  onChangeTicketHistoryList,
  getTicketHistoryList,
  ticketHistoryListItemSearch,
  onClickClearSearchFilter,
  exportClick,
  currentPage,
  totalPages,
  handlePageChange,
  showHide,
}) {
  const userData = getSessionStorage("user");
  const ChkBRHeadTypeID = userData && userData.BRHeadTypeID ? userData.BRHeadTypeID.toString() : "0";
  const ChkAppAccessTypeID = userData && userData.AppAccessTypeID ? userData.AppAccessTypeID.toString() : "0";

  const ticketTypeList = [
    { TicketTypeID: "1", TicketTypeName: "Grievance" },
    { TicketTypeID: "2", TicketTypeName: "Information" },
    { TicketTypeID: "4", TicketTypeName: "Crop Loss Intimation" },
  ];

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
          style={{ width: "110px" }}
        />
        <PageBar.Input
          ControlTxt="To Date"
          control="input"
          type="date"
          name="txtToDate"
          value={formValues.txtToDate}
          onChange={(e) => updateState("txtToDate", e.target.value)}
          max={dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD")}
          style={{ width: "110px" }}
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
        <PageBar.Select
          ControlTxt="Search By"
          name="txtTicketType"
          label="Ticket Type"
          value={formValues.txtTicketType}
          options={ticketTypeList}
          getOptionLabel={(option) => option.TicketTypeName}
          getOptionValue={(option) => `${option}`}
          onChange={(e) => updateState("txtTicketType", e)}
        />
        <PageBar.Search
          value={ticketHistoryListItemSearch}
          onChange={(e) => onChangeTicketHistoryList(e.target.value)}
          onClick={() => getTicketHistoryList()}
          style={{ width: "120px" }}
        />
        {ChkBRHeadTypeID === "124001" && ChkAppAccessTypeID === "472" ? (
          <Button type="button" varient="primary" onClick={() => getTicketHistoryList("MONGO")}>
            Search Mongodb
          </Button>
        ) : null}
        <PageBar.Button onClick={() => onClickClearSearchFilter()} title="Clear">
          Clear
        </PageBar.Button>
        <PageBar.ExcelButton onClick={() => exportClick()} disabled={filteredTicketHistoryDataList.length === 0}>
          Export
        </PageBar.ExcelButton>
      </PageBar>
      <div className={BizClass.divGridPagination}>
        <DataGrid rowData={filteredTicketHistoryDataList}  loader={isLoadingTicketHistoryDataList ? <Loader /> : false} onGridReady={onGridReady}>
          <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
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
          <DataGrid.Column field="TicketDescription" headerName="Description" width="290px" />
        </DataGrid>
        {
          showHide === 1 ? (
            filteredTicketHistoryDataList.length === 0 ? null : (
              <ResponsivePagination
                current={currentPage}
                total={totalPages}
                onPageChange={handlePageChange}
              />
            )
          ) : (

            null
          )
        }
      </div>
    </div>
  );
}

export default TicketHistory;
TicketHistory.propTypes = {
  filteredTicketHistoryDataList: PropTypes.array,
  isLoadingTicketHistoryDataList: PropTypes.bool,
  getInsuranceCompanyListData: PropTypes.func.isRequired,
  insuranceCompanyList: PropTypes.array.isRequired,
  isLoadingInsuranceCompanyList: PropTypes.bool,
  getStateListData: PropTypes.func.isRequired,
  stateList: PropTypes.array.isRequired,
  isLoadingStateList: PropTypes.bool,
  onGridReady: PropTypes.func.isRequired,
  onChangeTicketHistoryList: PropTypes.func.isRequired,
  getTicketHistoryList: PropTypes.func.isRequired,
  ticketHistoryListItemSearch: PropTypes.string,
  formValues: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired,
  onClickClearSearchFilter: PropTypes.func.isRequired,
  exportClick: PropTypes.func.isRequired,
};
