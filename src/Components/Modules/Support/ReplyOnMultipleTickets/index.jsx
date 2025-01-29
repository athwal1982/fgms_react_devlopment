import React from "react";
import ReplyOnMultipleTickets from "./Views/ReplyOnMultipleTickets";
import ReplyOnMultipleTicketsLogics from "./Logic/Logic";

function ReplyOnMultipleTicketsPage() {
  const {
    isLoadingFarmersticket,
    ticketCategoryList,
    isLoadingTicketCategoryList,
    formValues,
    updateState,
    ticketCategoryTypeList,
    getFarmersTickets,
    farmersTicketData,
    isLoadingTicketCategoryTypeList,
    getTicketCategoryListData,
    getTicketCategoryTypeListData,
    ticketStatusList,
    isLoadingTicketStatusList,
    getTicketStatusListData,
    updateFilterState,
    searchTicketListOnClick,
    satatusCount,
    totalSatatusCount,
    filterValues,
    onGridReady,
    gridApi,
    chkisDisable,
    setchkisDisable,
    setFarmersTicketData,
    setSatatusCount,
    settotalSatatusCount,
  } = ReplyOnMultipleTicketsLogics();

  return (
    <ReplyOnMultipleTickets
      isLoadingFarmersticket={isLoadingFarmersticket}
      farmersTicketData={farmersTicketData}
      getTicketCategoryTypeListData={getTicketCategoryTypeListData}
      getTicketCategoryListData={getTicketCategoryListData}
      isLoadingTicketCategoryTypeList={isLoadingTicketCategoryTypeList}
      getFarmersTickets={getFarmersTickets}
      ticketCategoryTypeList={ticketCategoryTypeList}
      updateState={updateState}
      formValues={formValues}
      isLoadingTicketCategoryList={isLoadingTicketCategoryList}
      ticketCategoryList={ticketCategoryList}
      ticketStatusList={ticketStatusList}
      isLoadingTicketStatusList={isLoadingTicketStatusList}
      getTicketStatusListData={getTicketStatusListData}
      updateFilterState={updateFilterState}
      searchTicketListOnClick={searchTicketListOnClick}
      satatusCount={satatusCount}
      totalSatatusCount={totalSatatusCount}
      filterValues={filterValues}
      onGridReady={onGridReady}
      gridApi={gridApi}
      chkisDisable={chkisDisable}
      setchkisDisable={setchkisDisable}
      setFarmersTicketData={setFarmersTicketData}
      setSatatusCount={setSatatusCount}
      settotalSatatusCount={settotalSatatusCount}
    />
  );
}

export default ReplyOnMultipleTicketsPage;
