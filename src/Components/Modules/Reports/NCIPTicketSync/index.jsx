import React from "react";
import NCIPTicketSync from "./Views/NCIPTicketSync";
import NCIPTicketSyncLogic from "./Logic/Logic";

function NCIPTicketSyncPage() {
  const {
    formValues,
    updateState,
    onGridReady,
    getNCIPTicketSyncDataList,
    exportClick,
    onClickClearSearchFilter,
    filteredNCIPTicketSyncDataList,
    isLoadingNCIPTicketSyncDataList,
    onChangeNCIPTicketSyncDataList,
    yearList,
  } = NCIPTicketSyncLogic();

  return (
    <NCIPTicketSync
      formValues={formValues}
      updateState={updateState}
      onGridReady={onGridReady}
      onClickClearSearchFilter={onClickClearSearchFilter}
      getNCIPTicketSyncDataList={getNCIPTicketSyncDataList}
      filteredNCIPTicketSyncDataList={filteredNCIPTicketSyncDataList}
      isLoadingNCIPTicketSyncDataList={isLoadingNCIPTicketSyncDataList}
      onChangeNCIPTicketSyncDataList={onChangeNCIPTicketSyncDataList}
      exportClick={exportClick}
      yearList={yearList}
    />
  );
}

export default NCIPTicketSyncPage;
