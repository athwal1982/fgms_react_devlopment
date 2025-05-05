import React from "react";
import SosAgeing from "./Views/SosAgeing";
import SosAgeingLogics from "./Logic/Logic";

function SosAgeingPage() {
  const {
    filteredSosAgeingDataList,
    isLoadingSosAgeingDataList,
    onGridReady,
    onChangeSosAgeingList,
    getSosAgeingList,
    SosAgeingListItemSearch,
    onClickClearSearchFilter,
    exportClick,
  } = SosAgeingLogics();

  return (
    <SosAgeing
      filteredSosAgeingDataList={filteredSosAgeingDataList}
      isLoadingSosAgeingDataList={isLoadingSosAgeingDataList}
      onGridReady={onGridReady}
      getSosAgeingList={getSosAgeingList}
      onChangeSosAgeingList={onChangeSosAgeingList}
      SosAgeingListItemSearch={SosAgeingListItemSearch}
      onClickClearSearchFilter={onClickClearSearchFilter}
      exportClick={exportClick}
    />
  );
}

export default SosAgeingPage;
