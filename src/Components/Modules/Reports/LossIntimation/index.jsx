import React from "react";
import LossIntimationReport from "./Views/LossIntimation";
import LossIntimationReportLogics from "./Logic/Logic";

function LossIntimationReportPage() {
  const {
    ticketCategoryList,
    isLoadingTicketCategoryList,
    formValues,
    updateState,
    ticketCategoryTypeList,
    isLoadingTicketCategoryTypeList,
    filteredGrievanceReportDataList,
    isLoadingGrievanceReportDataList,
    onGridReady,
    onChangeGrievanceReportList,
    getGrievanceReportList,
    grievanceReportListItemSearch,
    getTicketCategoryTypeListData,
    getGrievanceReportsList,
    onClickClearSearchFilter,
    exportClick,
    cropStageData,
    lossAtList,
  } = LossIntimationReportLogics();

  return (
    <LossIntimationReport
      filteredGrievanceReportDataList={filteredGrievanceReportDataList}
      isLoadingGrievanceReportDataList={isLoadingGrievanceReportDataList}
      onGridReady={onGridReady}
      getGrievanceReportList={getGrievanceReportList}
      onChangeGrievanceReportList={onChangeGrievanceReportList}
      grievanceReportListItemSearch={grievanceReportListItemSearch}
      ticketCategoryList={ticketCategoryList}
      isLoadingTicketCategoryList={isLoadingTicketCategoryList}
      formValues={formValues}
      updateState={updateState}
      ticketCategoryTypeList={ticketCategoryTypeList}
      isLoadingTicketCategoryTypeList={isLoadingTicketCategoryTypeList}
      getTicketCategoryTypeListData={getTicketCategoryTypeListData}
      getGrievanceReportsList={getGrievanceReportsList}
      onClickClearSearchFilter={onClickClearSearchFilter}
      exportClick={exportClick}
      cropStageData={cropStageData}
      lossAtList={lossAtList}
    />
  );
}

export default LossIntimationReportPage;
