import React from "react";
import GrievanceReport from "./Views/Grievance";
import GrievanceReportLogics from "./Logic/Logic";

function GrievanceReportPage() {
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
  } = GrievanceReportLogics();

  return (
    <GrievanceReport
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

export default GrievanceReportPage;
