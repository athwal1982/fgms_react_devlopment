import React from "react";
import SLAReport from "./Views/SLAReport";
import SLAReportLofLogic from "./Logic/Logic";

function SLAReportPage() {
  const { formValues, updateState, onGridReady, onClickClearSearchFilter, onSelect, onExport, onSearch } = SLAReportLofLogic();

  return (
    <SLAReport
      formValues={formValues}
      updateState={updateState}
      onGridReady={onGridReady}
      onClickClearSearchFilter={onClickClearSearchFilter}
      onSearch={onSearch}
      onExport={onExport}
      onSelect={onSelect}
    />
  );
}

export default SLAReportPage;
