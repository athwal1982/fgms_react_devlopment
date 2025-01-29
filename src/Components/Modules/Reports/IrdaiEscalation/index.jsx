import React from "react";
import IrdaiEscalation from "./Views/IrdaiEscalation";
import IrdaiEscalationLogics from "./Logic/Logic";

function IrdaiEscalationPage() {
  const {
    formValues,
    updateState,
    filteredIrdaiEscalationDataList,
    isLoadingIrdaiEscalationDataList,
    insuranceCompanyList,
    isLoadingInsuranceCompanyList,
    getInsuranceCompanyListData,
    stateList,
    isLoadingStateList,
    getStateListData,
    onGridReady,
    onChangeIrdaiEscalationList,
    getIrdaiEscalationList,
    IrdaiEscalationListItemSearch,
    onClickClearSearchFilter,
    exportClick,
  } = IrdaiEscalationLogics();

  return (
    <IrdaiEscalation
      filteredIrdaiEscalationDataList={filteredIrdaiEscalationDataList}
      isLoadingIrdaiEscalationDataList={isLoadingIrdaiEscalationDataList}
      insuranceCompanyList={insuranceCompanyList}
      isLoadingInsuranceCompanyList={isLoadingInsuranceCompanyList}
      getInsuranceCompanyListData={getInsuranceCompanyListData}
      stateList={stateList}
      isLoadingStateList={isLoadingStateList}
      getStateListData={getStateListData}
      onGridReady={onGridReady}
      getIrdaiEscalationList={getIrdaiEscalationList}
      onChangeIrdaiEscalationList={onChangeIrdaiEscalationList}
      IrdaiEscalationListItemSearch={IrdaiEscalationListItemSearch}
      formValues={formValues}
      updateState={updateState}
      onClickClearSearchFilter={onClickClearSearchFilter}
      exportClick={exportClick}
    />
  );
}

export default IrdaiEscalationPage;
