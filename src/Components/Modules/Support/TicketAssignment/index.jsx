import React from "react";
import TicketAssignment from "./Views/TicketAssignment";
import TicketAssignmentLogics from "./Logic/Logic";

function TicketAssignmentPage() {
  const {
    onSearchTickets,
    ticketCount,
    onRefreshClick,
    onChangeSLACallDataList,
    getSLACallDataList,
    onClickClearSearchFilter,
    onClickAssign,
    setAlertMessage,
    todayDate,
    ticketCategoryList,
    updateFilterState,
    stateList,
    isLoadingStateList,
    isLoadingTicketCategoryTypeList,
    ticketCategoryTypeList,
    isLoadingTicketCategoryList,
    filterValues,
    UserList,
    SearchTickets,
    isLoadingSearchTickets,
    handleAssignTickets,
    setSelectedTickets,
    setSelectedUser,
    onGridReadyTicket,
    onGridReadyUser,
    getUserWiseTicketLister,
    UserTicketList,
    isLoadingTicketAssignment,
    TicketAssignmentModalList,
    onChangeTicketAssignmentModalList,
    ticketlist,
    filteredTicketAssignmentDataList,
    onGridReadyTicketCount,
  } = TicketAssignmentLogics();

  return (
    <TicketAssignment
      onGridReadyTicket={onGridReadyTicket}
      ticketCount={ticketCount}
      onGridReadyUser={onGridReadyUser}
      onSearchTickets={onSearchTickets}
      onRefreshClick={onRefreshClick}
      onChangeSLACallDataList={onChangeSLACallDataList}
      getSLACallDataList={getSLACallDataList}
      onClickClearSearchFilter={onClickClearSearchFilter}
      onClickAssign={onClickAssign}
      setAlertMessage={setAlertMessage}
      todayDate={todayDate}
      ticketCategoryList={ticketCategoryList}
      updateFilterState={updateFilterState}
      stateList={stateList}
      isLoadingStateList={isLoadingStateList}
      isLoadingTicketCategoryTypeList={isLoadingTicketCategoryTypeList}
      ticketCategoryTypeList={ticketCategoryTypeList}
      isLoadingTicketCategoryList={isLoadingTicketCategoryList}
      filterValues={filterValues}
      UserList={UserList}
      SearchTickets={SearchTickets}
      isLoadingSearchTickets={isLoadingSearchTickets}
      handleAssignTickets={handleAssignTickets}
      setSelectedTickets={setSelectedTickets}
      setSelectedUser={setSelectedUser}
      getUserWiseTicketLister={getUserWiseTicketLister}
      UserTicketList={UserTicketList}
      isLoadingTicketAssignment={isLoadingTicketAssignment}
      TicketAssignmentModalList={TicketAssignmentModalList}
      onChangeTicketAssignmentModalList={onChangeTicketAssignmentModalList}
      ticketlist={ticketlist}
      filteredTicketAssignmentDataList={filteredTicketAssignmentDataList}
      onGridReadyTicketCount={onGridReadyTicketCount}
    />
  );
}

export default TicketAssignmentPage;
