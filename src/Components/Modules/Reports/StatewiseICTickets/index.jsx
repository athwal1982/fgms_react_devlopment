import React from "react";
import StatewiseICTickets from "./Views/StatewiseICTickets";
import StatewiseICTicketsLogics from "./Logic/Logic";

function StatewiseICTicketsPage() {
  const {
    formValues,
    updateState,
    filteredStatewiseICTicketsDataList,
    isLoadingStatewiseICTicketsDataList,
    stateList,
    isLoadingStateList,
    onGridReady,
    onChangeStatewiseICTicketsList,
    getStatewiseICTicketsList,
    StatewiseICTicketsListItemSearch,
    onClickClearSearchFilter,
    exportClick,
    monthList,
    yearList,
    ticketStatusList,
    isLoadingTicketStatusList,
  } = StatewiseICTicketsLogics();

  return (
    <StatewiseICTickets
      filteredStatewiseICTicketsDataList={filteredStatewiseICTicketsDataList}
      isLoadingStatewiseICTicketsDataList={isLoadingStatewiseICTicketsDataList}
      stateList={stateList}
      isLoadingStateList={isLoadingStateList}
      onGridReady={onGridReady}
      getStatewiseICTicketsList={getStatewiseICTicketsList}
      onChangeStatewiseICTicketsList={onChangeStatewiseICTicketsList}
      StatewiseICTicketsListItemSearch={StatewiseICTicketsListItemSearch}
      formValues={formValues}
      updateState={updateState}
      onClickClearSearchFilter={onClickClearSearchFilter}
      exportClick={exportClick}
      monthList={monthList}
      yearList={yearList}
      ticketStatusList={ticketStatusList}
      isLoadingTicketStatusList={isLoadingTicketStatusList}
    />
  );
}

export default StatewiseICTicketsPage;
