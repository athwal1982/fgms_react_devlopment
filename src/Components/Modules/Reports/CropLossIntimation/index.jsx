import React from "react";
import CropLossIntimationReport from "./Views/CropLossIntimation";
import CropLossIntimationReportLogics from "./Logic/Logic";

function CropLossIntimationReportPage() {
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
  } = CropLossIntimationReportLogics();

  return (
    <CropLossIntimationReport
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
    />
  );
}

export default CropLossIntimationReportPage;
