import React, { useEffect } from "react";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { Convert24FourHourAndMinute, dateToSpecificFormat } from "Configration/Utilities/dateformat";
import PropTypes from "prop-types";
import { Loader } from "Framework/Components/Widgets";
import BizClass from "./PremiumCalculator.module.scss";

function PremiumCalculatorReport({
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
}) {
  useEffect(() => {
    debugger;
    getInsuranceCompanyListData();
    getStateListData();
  }, []);

  return (
    <div className={BizClass.PageStart}>
      <PageBar>
        <PageBar.Select
          ControlTxt="State"
          name="txtState"
          value={formValues.txtState}
          loader={isLoadingStateList ? <Loader /> : null}
          options={stateList}
          getOptionLabel={(option) => `${option.StateMasterName}`}
          getOptionValue={(option) => `${option}`}
          onChange={(e) => updateState("txtState", e)}
        />

        <PageBar.Select
          ControlTxt="Insurance Company"
          name="txtInsuranceCompany"
          value={formValues.txtInsuranceCompany}
          loader={isLoadingInsuranceCompanyList ? <Loader /> : null}
          options={insuranceCompanyList}
          getOptionLabel={(option) => `${option.CompanyName}`}
          getOptionValue={(option) => `${option}`}
          onChange={(e) => updateState("txtInsuranceCompany", e)}
        />

        <PageBar.Search
          value={premiumCalculatorListItemSearch}
          onChange={(e) => onChangePremiumCalculatorList(e.target.value)}
          onClick={() => getPremiumCalculatorList()}
        />
        <PageBar.Button onClick={() => onClickClearSearchFilter()} title="Clear">
          Clear
        </PageBar.Button>
        <PageBar.ExcelButton onClick={() => exportClick()}>Export</PageBar.ExcelButton>
      </PageBar>
      <DataGrid rowData={filteredPremiumCalculatorDataList} loader={isLoadingPremiumCalculatorDataList ? <Loader /> : false} onGridReady={onGridReady}>
        <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
        <DataGrid.Column field="MobileNumber" headerName="Caller Mobile Number" width="170px" />
        <DataGrid.Column field="StateMasterName" headerName="State" width="150px" />
        <DataGrid.Column field="District" headerName="District" width="150px" /> 
        <DataGrid.Column field="Years" headerName="Year" width="90px" />
        <DataGrid.Column field="CropName" headerName="Crop" width="210px" />
        <DataGrid.Column field="SchemeName" headerName="Scheme" width="290px" />
        <DataGrid.Column field="CropSeasonName" headerName="Season" width="100px" />
        <DataGrid.Column field="SSSYID" headerName="SSSYID" width="100px" />
        <DataGrid.Column field="InsuranceMasterName" headerName="Insurance Company" width="290px" />
        <DataGrid.Column field="AREA" headerName="Area(In Hectare)" width="145px" />
        <DataGrid.Column field="CalculatedPremium" headerName="Calculated Premium" width="170px" />
         <DataGrid.Column
                  field="#"
                  headerName="Created At"
                  width="150px"
                  valueGetter={(node) => {
                    return node.data.CreatedAt
                      ? dateToSpecificFormat(
                          `${node.data.CreatedAt.split("T")[0]} ${Convert24FourHourAndMinute(node.data.CreatedAt.split("T")[1])}`,
                          "DD-MM-YYYY HH:mm",
                        )
                      : null;
                  }}
                />
      </DataGrid>
    </div>
  );
}

export default PremiumCalculatorReport;
PremiumCalculatorReport.propTypes = {
  filteredPremiumCalculatorDataList: PropTypes.array,
  isLoadingPremiumCalculatorDataList: PropTypes.bool,
  getInsuranceCompanyListData: PropTypes.func.isRequired,
  insuranceCompanyList: PropTypes.array.isRequired,
  isLoadingInsuranceCompanyList: PropTypes.bool,
  getStateListData: PropTypes.func.isRequired,
  stateList: PropTypes.array.isRequired,
  isLoadingStateList: PropTypes.bool,
  onGridReady: PropTypes.func.isRequired,
  onChangePremiumCalculatorList: PropTypes.func.isRequired,
  getPremiumCalculatorList: PropTypes.func.isRequired,
  premiumCalculatorListItemSearch: PropTypes.string,
  formValues: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired,
  onClickClearSearchFilter: PropTypes.func.isRequired,
  exportClick: PropTypes.func.isRequired,
};
