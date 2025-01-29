import React from "react";
import CallLogData from "./Views/CallLogData";
import CallLogDataLogic from "./Logic/Logic";

function CallLogDataPage() {
  const {
    formValues,
    updateState,
    onGridReady,
    onSearch,
    exportClick,
    getCallLogDataList,
    onClickClearSearchFilter,
    filteredCallLogDataList,
    isLoadingCallLogDataList,
    onChangeCallLogDataList,
  } = CallLogDataLogic();

  return (
    <CallLogData
      formValues={formValues}
      onSearch={onSearch}
      updateState={updateState}
      onGridReady={onGridReady}
      onClickClearSearchFilter={onClickClearSearchFilter}
      getCallLogDataList={getCallLogDataList}
      filteredCallLogDataList={filteredCallLogDataList}
      isLoadingCallLogDataList={isLoadingCallLogDataList}
      onChangeCallLogDataList={onChangeCallLogDataList}
      exportClick={exportClick}
    />
  );
}

export default CallLogDataPage;
