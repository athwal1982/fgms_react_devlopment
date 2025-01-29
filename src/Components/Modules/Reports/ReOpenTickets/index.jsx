import React from "react";
import ReOpenTickets from "./Views/ReOpenTickets";
import ReOpenTicketsLogic from "./Logic/Logic";

function ReOpenTicketsPage() {
  const {
    formValues,
    updateState,
    onGridReady,
    getReOpenTicketsDataList,
    exportClick,
    onClickClearSearchFilter,
    filteredReOpenTicketsDataList,
    isLoadingReOpenTicketsDataList,
    onChangeReOpenTicketsDataList,
  } = ReOpenTicketsLogic();

  return (
    <ReOpenTickets
      formValues={formValues}
      updateState={updateState}
      onGridReady={onGridReady}
      onClickClearSearchFilter={onClickClearSearchFilter}
      getReOpenTicketsDataList={getReOpenTicketsDataList}
      filteredReOpenTicketsDataList={filteredReOpenTicketsDataList}
      isLoadingReOpenTicketsDataList={isLoadingReOpenTicketsDataList}
      onChangeReOpenTicketsDataList={onChangeReOpenTicketsDataList}
      exportClick={exportClick}
    />
  );
}

export default ReOpenTicketsPage;
