import React from "react";
import PropTypes from "prop-types";
import { Loader } from "Framework/Components/Widgets";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { dateToSpecificFormat } from "Configration/Utilities/dateformat";
import moment from "moment";
import BizClass from "./BotFarmerTicket.module.scss";

function BotFarmerTicket({
  formValues,
  updateState,
  onGridReady,
  onClickClearSearchFilter,
  getBotFarmerTicketDataList,
  exportClick,
  filteredBotFarmerTicketDataList,
  isLoadingBotFarmerTicketDataList,
  onChangeBotFarmerTicketDataList,
  yearList,
}) {
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
        <PageBar.Search onChange={(e) => onChangeBotFarmerTicketDataList(e.target.value)} onClick={() => getBotFarmerTicketDataList()} />
        <PageBar.Button onClick={() => onClickClearSearchFilter()} title="Clear">
          Clear
        </PageBar.Button>
        <PageBar.ExcelButton onClick={() => exportClick()} disabled={filteredBotFarmerTicketDataList.length === 0}>
          Export
        </PageBar.ExcelButton>
      </PageBar>

      <DataGrid rowData={filteredBotFarmerTicketDataList} loader={isLoadingBotFarmerTicketDataList ? <Loader /> : false} onGridReady={onGridReady}>
        <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
         <DataGrid.Column field="MONTH" headerName="Month" width="170px"  />
         <DataGrid.Column field="YEAR" headerName="Year" width="170px" cellStyle={{ "text-align": "right" }} />
         <DataGrid.Column field="TotalTicketCreated" headerName="Total Ticket" width="175px" cellStyle={{ "text-align": "right" }} />
         <DataGrid.Column field="CreatedByAgent" headerName="Created By Agent" width="170px" cellStyle={{ "text-align": "right" }}  />
         <DataGrid.Column field="CreatedByBOT" headerName="Created By BOT" width="170px" cellStyle={{ "text-align": "right" }}  />
         <DataGrid.Column field="CreatedByFarmer" headerName="Created By Farmer" width="170px" cellStyle={{ "text-align": "right" }}  />
      </DataGrid>
    </div>
  );
}

BotFarmerTicket.propTypes = {
  formValues: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired,
  onGridReady: PropTypes.func.isRequired,
  getBotFarmerTicketDataList: PropTypes.func.isRequired,
  onClickClearSearchFilter: PropTypes.func.isRequired,
  filteredBotFarmerTicketDataList: PropTypes.array,
  isLoadingBotFarmerTicketDataList: PropTypes.bool,
  onChangeBotFarmerTicketDataList: PropTypes.func.isRequired,
  exportClick: PropTypes.func.isRequired,
};

export default BotFarmerTicket;
