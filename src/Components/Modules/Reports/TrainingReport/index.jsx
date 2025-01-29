import React from "react";
import TrainingReport from "./Views/TrainingReport";
import TrainingReportLogic from "./Logic/Logic";

function TrainingReportPage() {
  const { formValues, updateState, onGridReady, onClickClearSearchFilter, onSelect, onSearch, onExport } = TrainingReportLogic();

  return (
    <TrainingReport
      formValues={formValues}
      updateState={updateState}
      onGridReady={onGridReady}
      onClickClearSearchFilter={onClickClearSearchFilter}
      onSearch={onSearch}
      onSelect={onSelect}
      onExport={onExport}
    />
  );
}

export default TrainingReportPage;
