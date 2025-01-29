import React from "react";
import AgeingCropReport from "./Views/AgeingCrop";
import AgeingCropReportLogics from "./Logic/Logic";

function AgeingCropReportPage() {
  const {
    filteredAgeingCropReportDataList,
    isLoadingAgeingCropReportDataList,
    onGridReady,
    formValues,
    updateState,
    reportFilterList,
    onClickAgeingCropReport,
    exportClick,
    ageingTicketCountList,
    isLoadingAgeingTicketCountList,
    getAgeingCropReportsDetailsList,
    exportAgeingTicketListClick,
  } = AgeingCropReportLogics();

  return (
    <AgeingCropReport
      filteredAgeingCropReportDataList={filteredAgeingCropReportDataList}
      isLoadingAgeingCropReportDataList={isLoadingAgeingCropReportDataList}
      formValues={formValues}
      updateState={updateState}
      onGridReady={onGridReady}
      reportFilterList={reportFilterList}
      onClickAgeingCropReport={onClickAgeingCropReport}
      exportClick={exportClick}
      ageingTicketCountList={ageingTicketCountList}
      isLoadingAgeingTicketCountList={isLoadingAgeingTicketCountList}
      getAgeingCropReportsDetailsList={getAgeingCropReportsDetailsList}
      exportAgeingTicketListClick={exportAgeingTicketListClick}
    />
  );
}

export default AgeingCropReportPage;
