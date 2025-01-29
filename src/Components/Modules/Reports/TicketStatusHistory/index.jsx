import React from "react";
import TicketStatusHistory from "./Views/TicketStatusHistory";
import TicketStatusHistoryLogics from "./Logic/Logic";

function TicketStatusHistoryPage() {
  const {
    formValues,
    updateState,
    filteredTicketStatusDataList,
    isLoadingTicketStatusDataList,
    insuranceCompanyList,
    isLoadingInsuranceCompanyList,
    getInsuranceCompanyListData,
    stateList,
    isLoadingStateList,
    getStateListData,
    onGridReady,
    onChangeTicketStatusList,
    getTicketStatusList,
    ticketStatusListItemSearch,
    onClickClearSearchFilter,
    exportClick,
  } = TicketStatusHistoryLogics();

  return (
    <TicketStatusHistory
      filteredTicketStatusDataList={filteredTicketStatusDataList}
      isLoadingTicketStatusDataList={isLoadingTicketStatusDataList}
      insuranceCompanyList={insuranceCompanyList}
      isLoadingInsuranceCompanyList={isLoadingInsuranceCompanyList}
      getInsuranceCompanyListData={getInsuranceCompanyListData}
      stateList={stateList}
      isLoadingStateList={isLoadingStateList}
      getStateListData={getStateListData}
      onGridReady={onGridReady}
      getTicketStatusList={getTicketStatusList}
      onChangeTicketStatusList={onChangeTicketStatusList}
      ticketStatusListItemSearch={ticketStatusListItemSearch}
      formValues={formValues}
      updateState={updateState}
      onClickClearSearchFilter={onClickClearSearchFilter}
      exportClick={exportClick}
    />
  );
}

export default TicketStatusHistoryPage;
