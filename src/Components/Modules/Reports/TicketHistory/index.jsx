import React from "react";
import TicketHistory from "./Views/TicketHistory";
import TicketHistoryLogics from "./Logic/Logic";

function TicketHistoryPage() {
  const {
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
  } = TicketHistoryLogics();

  return (
    <TicketHistory
      filteredTicketHistoryDataList={filteredTicketHistoryDataList}
      isLoadingTicketHistoryDataList={isLoadingTicketHistoryDataList}
      insuranceCompanyList={insuranceCompanyList}
      isLoadingInsuranceCompanyList={isLoadingInsuranceCompanyList}
      getInsuranceCompanyListData={getInsuranceCompanyListData}
      stateList={stateList}
      isLoadingStateList={isLoadingStateList}
      getStateListData={getStateListData}
      onGridReady={onGridReady}
      getTicketHistoryList={getTicketHistoryList}
      onChangeTicketHistoryList={onChangeTicketHistoryList}
      ticketHistoryListItemSearch={ticketHistoryListItemSearch}
      formValues={formValues}
      updateState={updateState}
      onClickClearSearchFilter={onClickClearSearchFilter}
      exportClick={exportClick}
      currentPage ={currentPage}
      totalPages={totalPages}
      handlePageChange = {handlePageChange}
      showHide={showHide}
    />
  );
}

export default TicketHistoryPage;
