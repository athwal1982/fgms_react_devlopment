import React from "react";
import FarmerCallingHistory from "./Views/FarmerCallingHistory";
import FarmerCallingHistoryLogics from "./Logic/Logic";

function FarmerCallingHistoryPage() {
  const {
    formValues,
    updateState,
    filteredFarmerCallingHistoryDataList,
    isLoadingFarmerCallingHistoryDataList,
    stateList,
    isLoadingStateList,
    onGridReady,
    onChangeFarmerCallingHistoryList,
    getFarmerCallingHistoryList,
    FarmerCallingHistoryListItemSearch,
    onClickClearSearchFilter,
    exportClick,
  } = FarmerCallingHistoryLogics();

  return (
    <FarmerCallingHistory
      filteredFarmerCallingHistoryDataList={filteredFarmerCallingHistoryDataList}
      isLoadingFarmerCallingHistoryDataList={isLoadingFarmerCallingHistoryDataList}
      stateList={stateList}
      isLoadingStateList={isLoadingStateList}
      onGridReady={onGridReady}
      getFarmerCallingHistoryList={getFarmerCallingHistoryList}
      onChangeFarmerCallingHistoryList={onChangeFarmerCallingHistoryList}
      FarmerCallingHistoryListItemSearch={FarmerCallingHistoryListItemSearch}
      formValues={formValues}
      updateState={updateState}
      onClickClearSearchFilter={onClickClearSearchFilter}
      exportClick={exportClick}
    />
  );
}

export default FarmerCallingHistoryPage;
