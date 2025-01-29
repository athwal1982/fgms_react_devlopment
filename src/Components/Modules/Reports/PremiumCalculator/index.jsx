import React from "react";
import PremiumCalculatorReport from "./Views/PremiumCalculator";
import PremiumCalculatorReportLogics from "./Logic/Logic";

function PremiumCalculatorReportPage() {
  const {
    formValues,
    updateState,
    filteredPremiumCalculatorDataList,
    isLoadingPremiumCalculatorDataList,
    insuranceCompanyList,
    isLoadingInsuranceCompanyList,
    getInsuranceCompanyListData,
    stateList,
    isLoadingStateList,
    getStateListData,
    onGridReady,
    onChangePremiumCalculatorList,
    getPremiumCalculatorList,
    premiumCalculatorListItemSearch,
    onClickClearSearchFilter,
    exportClick,
  } = PremiumCalculatorReportLogics();
  return (
    <PremiumCalculatorReport
      filteredPremiumCalculatorDataList={filteredPremiumCalculatorDataList}
      isLoadingPremiumCalculatorDataList={isLoadingPremiumCalculatorDataList}
      insuranceCompanyList={insuranceCompanyList}
      isLoadingInsuranceCompanyList={isLoadingInsuranceCompanyList}
      getInsuranceCompanyListData={getInsuranceCompanyListData}
      stateList={stateList}
      isLoadingStateList={isLoadingStateList}
      getStateListData={getStateListData}
      onGridReady={onGridReady}
      getPremiumCalculatorList={getPremiumCalculatorList}
      onChangePremiumCalculatorList={onChangePremiumCalculatorList}
      premiumCalculatorListItemSearch={premiumCalculatorListItemSearch}
      formValues={formValues}
      updateState={updateState}
      onClickClearSearchFilter={onClickClearSearchFilter}
      exportClick={exportClick}
    />
  );
}

export default PremiumCalculatorReportPage;
