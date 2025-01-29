import React from "react";
import TicketsByFarmerReport from "./Views/TicketsByFarmer";
import TicketsByFarmerReportLogics from "./Logic/Logic";

function TicketsByFarmerReportPage() {
  const {
    formValues,
    updateState,
    filteredTicketsByFarmerDataList,
    isLoadingTicketsByFarmerDataList,
    stateList,
    isLoadingStateList,
    searchByoptionsFilter,
    onGridReady,
    onChangeTicketsByFarmerReportList,
    getTicketsByFarmerList,
    onClickClearSearchFilter,
    exportClick,
  } = TicketsByFarmerReportLogics();

  return (
    <TicketsByFarmerReport
      filteredTicketsByFarmerDataList={filteredTicketsByFarmerDataList}
      isLoadingTicketsByFarmerDataList={isLoadingTicketsByFarmerDataList}
      stateList={stateList}
      isLoadingStateList={isLoadingStateList}
      searchByoptionsFilter={searchByoptionsFilter}
      onGridReady={onGridReady}
      onChangeTicketsByFarmerReportList={onChangeTicketsByFarmerReportList}
      formValues={formValues}
      updateState={updateState}
      getTicketsByFarmerList={getTicketsByFarmerList}
      onClickClearSearchFilter={onClickClearSearchFilter}
      exportClick={exportClick}
    />
  );
}

export default TicketsByFarmerReportPage;
