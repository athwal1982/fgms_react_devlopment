import React from "react";
import CSCInboundVoice from "./Views/CSCInboundVoice";
import CSCInboundVoiceLogics from "./Logic/Logic";

function CSCInboundVoicePage() {
  const {
    formValues,
    updateState,
    filteredCSCInboundVoiceDataList,
    isLoadingCSCInboundVoiceDataList,
    stateList,
    isLoadingStateList,
    onGridReady,
    onChangeCSCInboundVoiceList,
    getCSCInboundVoiceList,
    CSCInboundVoiceListItemSearch,
    onClickClearSearchFilter,
    exportClick,
  } = CSCInboundVoiceLogics();

  return (
    <CSCInboundVoice
      filteredCSCInboundVoiceDataList={filteredCSCInboundVoiceDataList}
      isLoadingCSCInboundVoiceDataList={isLoadingCSCInboundVoiceDataList}
      onGridReady={onGridReady}
      getCSCInboundVoiceList={getCSCInboundVoiceList}
      onChangeCSCInboundVoiceList={onChangeCSCInboundVoiceList}
      CSCInboundVoiceListItemSearch={CSCInboundVoiceListItemSearch}
      formValues={formValues}
      updateState={updateState}
      onClickClearSearchFilter={onClickClearSearchFilter}
      exportClick={exportClick}
    />
  );
}

export default CSCInboundVoicePage;
