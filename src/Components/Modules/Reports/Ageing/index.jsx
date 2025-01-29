import React from "react";
import AgeingReport from "./Views/Ageing";
import AgeingReportLogics from "./Logic/Logic";

function AgeingReportPage() {
  const {
    filteredAgeingReportDataList,
    isLoadingAgeingReportDataList,
    onGridReady,
    formValues,
    updateState,
    reportFilterList,
    onClickAgeingReport,
    exportClick,
    ageingTicketCountList,
    isLoadingAgeingTicketCountList,
    getAgeingReportsDetailsList,
    exportAgeingTicketListClick,
  } = AgeingReportLogics();

  return (
    <AgeingReport
      filteredAgeingReportDataList={filteredAgeingReportDataList}
      isLoadingAgeingReportDataList={isLoadingAgeingReportDataList}
      formValues={formValues}
      updateState={updateState}
      onGridReady={onGridReady}
      reportFilterList={reportFilterList}
      onClickAgeingReport={onClickAgeingReport}
      exportClick={exportClick}
      ageingTicketCountList={ageingTicketCountList}
      isLoadingAgeingTicketCountList={isLoadingAgeingTicketCountList}
      getAgeingReportsDetailsList={getAgeingReportsDetailsList}
      exportAgeingTicketListClick={exportAgeingTicketListClick}
    />
  );
}

export default AgeingReportPage;
