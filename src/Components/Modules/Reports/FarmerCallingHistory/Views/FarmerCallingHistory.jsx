import React from "react";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { Convert24FourHourAndMinute, dateToSpecificFormat } from "Configration/Utilities/dateformat";
import moment from "moment";
import PropTypes from "prop-types";
import { Loader } from "Framework/Components/Widgets";
import BizClass from "./FarmerCallingHistory.module.scss";

function FarmerCallingHistory({
  formValues,
  updateState,
  filteredFarmerCallingHistoryDataList,
  isLoadingFarmerCallingHistoryDataList,
  stateList,
  isLoadingStateList,
  onGridReady,
  onChangeFarmerCallingHistoryList,
  getFarmerCallingHistoryList,
  FarmerCallingHistoryListItemSearch,
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
          ControlTxt="State"
          name="txtState"
          value={formValues.txtState}
          loader={isLoadingStateList ? <Loader /> : null}
          options={stateList}
          getOptionLabel={(option) => `${option.StateMasterName}`}
          getOptionValue={(option) => `${option}`}
          onChange={(e) => updateState("txtState", e)}
        />

        <PageBar.Search
          value={FarmerCallingHistoryListItemSearch}
          onChange={(e) => onChangeFarmerCallingHistoryList(e.target.value)}
          onClick={() => getFarmerCallingHistoryList()}
        />
        <PageBar.Button onClick={() => onClickClearSearchFilter()} title="Clear">
          Clear
        </PageBar.Button>
        <PageBar.ExcelButton onClick={() => exportClick()} disabled={filteredFarmerCallingHistoryDataList.length === 0}>
          Export
        </PageBar.ExcelButton>
      </PageBar>
      <DataGrid rowData={filteredFarmerCallingHistoryDataList} loader={isLoadingFarmerCallingHistoryDataList ? <Loader /> : false} onGridReady={onGridReady}>
        <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
        <DataGrid.Column field="CallingUniqueID" headerName="Calling ID" width="160px" />
        <DataGrid.Column field="CallerMobileNumber" headerName="Caller Mobile No." width="160px" />
        <DataGrid.Column field="CallStatus" headerName="Call Status" width="110px" />
        <DataGrid.Column field="FarmerName" headerName="Farmer Name" width="170px" />
        <DataGrid.Column field="StateMasterName" headerName="State" width="170px" />
        <DataGrid.Column field="DistrictMasterName" headerName="District" width="170px" />
        <DataGrid.Column
          field="#"
          headerName="Is Registred"
          valueGetter={(node) => {
            return node.data.IsRegistered && node.data.IsRegistered === "U"
              ? "Unregistred Farmer"
              : node.data.IsRegistered === "R"
              ? "Registred Farmer"
              : node.data.IsRegistered === "D"
              ? "Farmer registred with duplicate number"
              : "";
          }}
          width="290px"
        />
        <DataGrid.Column field="Reason" headerName="Reason" width="170px" />
        <DataGrid.Column
          field="#"
          headerName="Created At"
          width="160px"
          valueGetter={(node) => {
            return node.data.InsertDateTime
              ? dateToSpecificFormat(
                  `${node.data.InsertDateTime.split("T")[0]} ${Convert24FourHourAndMinute(node.data.InsertDateTime.split("T")[1])}`,
                  "DD-MM-YYYY HH:mm",
                )
              : null;
          }}
        />
      </DataGrid>
    </div>
  );
}

export default FarmerCallingHistory;
FarmerCallingHistory.propTypes = {
  filteredFarmerCallingHistoryDataList: PropTypes.array,
  isLoadingFarmerCallingHistoryDataList: PropTypes.bool,
  stateList: PropTypes.array.isRequired,
  isLoadingStateList: PropTypes.bool,
  onGridReady: PropTypes.func.isRequired,
  onChangeFarmerCallingHistoryList: PropTypes.func.isRequired,
  getFarmerCallingHistoryList: PropTypes.func.isRequired,
  FarmerCallingHistoryListItemSearch: PropTypes.string,
  formValues: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired,
  onClickClearSearchFilter: PropTypes.func.isRequired,
  exportClick: PropTypes.func.isRequired,
};
