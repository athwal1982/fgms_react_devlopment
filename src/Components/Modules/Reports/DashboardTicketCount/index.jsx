import React from "react";
import DashboardTicketCount from "./Views/DashboardTicketCount";
import DashboardTicketCountLogics from "./Logic/Logic";

function DashboardTicketCountPage() {
  const {
    formValues,
    updateState,
    filteredDashboardTicketCountDataList,
    isLoadingDashboardTicketCountDataList,
    stateList,
    isLoadingStateList,
    onGridReady,
    onChangeDashboardTicketCountList,
    getDashboardTicketCountList,
    DashboardTicketCountListItemSearch,
    onClickClearSearchFilter,
    exportClick,
    monthList,
    yearList,
  } = DashboardTicketCountLogics();

  return (
    <DashboardTicketCount
      filteredDashboardTicketCountDataList={filteredDashboardTicketCountDataList}
      isLoadingDashboardTicketCountDataList={isLoadingDashboardTicketCountDataList}
      stateList={stateList}
      isLoadingStateList={isLoadingStateList}
      onGridReady={onGridReady}
      getDashboardTicketCountList={getDashboardTicketCountList}
      onChangeDashboardTicketCountList={onChangeDashboardTicketCountList}
      DashboardTicketCountListItemSearch={DashboardTicketCountListItemSearch}
      formValues={formValues}
      updateState={updateState}
      onClickClearSearchFilter={onClickClearSearchFilter}
      exportClick={exportClick}
      monthList={monthList}
      yearList={yearList}
    />
  );
}

export default DashboardTicketCountPage;
