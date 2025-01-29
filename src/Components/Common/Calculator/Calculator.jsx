import React from "react";
import { PageBar, Form } from "Framework/Components/Layout";
import { Button } from "Framework/Components/Widgets";
import { dateFormatDDMMYY } from "Configration/Utilities/dateformat";
import BizClass from "./Calculator.module.scss";
import CalculatorLogics from "./Logic/Logics";

function Calculator() {
  const {
    yearList,
    formValidationFarmersError,
    updateStateForCalculator,
    formValuesForCalculator,
    btnLoaderActive,
    stateForCalculatorDropdownDataList,
    isLoadingStateForCalculatorDropdownDataList,
    districtForCalculatorDropdownDataList,
    isLoadingDistrictForCalculatorDropdownDataList,
    seasonForCalculatorDropdownDataList,
    // A isLoadingSeasonForCalculatorDropdownDataList,
    schemeList,
    // A isLoadingSchemeListDropdownDataList,
    cropForCalculatorDropdownDataList,
    isLoadingCropForCalculatorDropdownDataList,
    getCalculatorDataOnClick,
    clearFormOnClick,
    selectedCropData,
    selectedCropHeader,
    selectedCalculation,
    myRef,
    btnCalculateState,
  } = CalculatorLogics();

  return (
    <div className={BizClass.PageStart}>
      <PageBar />
      <div className={BizClass.MainSection}>
        <div className={BizClass.ContentBox}>
          <div className={BizClass.FormHeading}>
            <h4>Insurance Premium Calculator</h4>
          </div>
          <div className={BizClass.ContentSection}>
            <div className={BizClass.FormBox}>
              <div className={BizClass.FormGroupBox}>
                <Form.InputGroup label="Caller Mobile No." req="true" column={1} errorMsg={formValidationFarmersError["txtCallerMobileNumber"]}>
                  <Form.InputControl
                    control="input"
                    name="txtCallerMobileNumber"
                    autoComplete="off"
                    value={formValuesForCalculator.txtCallerMobileNumber}
                    minLength={10}
                    maxLength={10}
                    onChange={(e) => updateStateForCalculator("txtCallerMobileNumber", e.target.value.replace(/\D/g, ""))}
                  />
                </Form.InputGroup>
              </div>
              <div className={BizClass.FormGroupBox}>
                <Form.InputGroup label="Season" errorMsg={formValidationFarmersError["txtSeasonForCalculator"]} req="true">
                  <Form.InputControl
                    control="select"
                    name="txtSeasonForCalculator"
                    value={formValuesForCalculator.txtSeasonForCalculator}
                    options={seasonForCalculatorDropdownDataList}
                    // A isLoading={isLoadingSeasonForCalculatorDropdownDataList}
                    getOptionLabel={(option) => `${option.CropSeasonName}`}
                    getOptionValue={(option) => `${option}`}
                    onChange={(e) => updateStateForCalculator("txtSeasonForCalculator", e)}
                    focus="true"
                  />
                </Form.InputGroup>
              </div>

              <div className={BizClass.FormGroupBox}>
                <Form.InputGroup label="Year" errorMsg={formValidationFarmersError["txtYearForCalculator"]} req="true">
                  <Form.InputControl
                    control="select"
                    name="txtYearForCalculator"
                    value={formValuesForCalculator.txtYearForCalculator}
                    options={yearList}
                    getOptionLabel={(option) => `${option.Name}`}
                    getOptionValue={(option) => `${option}`}
                    onChange={(e) => updateStateForCalculator("txtYearForCalculator", e)}
                  />
                </Form.InputGroup>
              </div>

              <div className={BizClass.FormGroupBox}>
                <Form.InputGroup label="Scheme" errorMsg={formValidationFarmersError["txtSchemeForCalculator"]} req="true">
                  <Form.InputControl
                    control="select"
                    name="txtSchemeForCalculator"
                    value={formValuesForCalculator.txtSchemeForCalculator}
                    // A isLoading={isLoadingSchemeListDropdownDataList}
                    options={schemeList}
                    getOptionLabel={(option) => `${option.SchemeName}`}
                    getOptionValue={(option) => `${option}`}
                    onChange={(e) => updateStateForCalculator("txtSchemeForCalculator", e)}
                  />
                </Form.InputGroup>
              </div>

              <div className={BizClass.FormGroupBox}>
                <Form.InputGroup label="State" errorMsg={formValidationFarmersError["txtStateForCalculator"]} req="true">
                  <Form.InputControl
                    control="select"
                    name="txtStateForCalculator"
                    value={formValuesForCalculator.txtStateForCalculator}
                    options={stateForCalculatorDropdownDataList}
                    isLoading={isLoadingStateForCalculatorDropdownDataList}
                    getOptionLabel={(option) => `${option.StateMasterName}`}
                    getOptionValue={(option) => `${option}`}
                    onChange={(e) => updateStateForCalculator("txtStateForCalculator", e)}
                  />
                </Form.InputGroup>
              </div>

              <div className={BizClass.FormGroupBox}>
                <Form.InputGroup label="District" errorMsg={formValidationFarmersError["txtDistrictForCalculator"]} req="true">
                  <Form.InputControl
                    control="select"
                    name="txtDistrictForCalculator"
                    value={formValuesForCalculator.txtDistrictForCalculator}
                    options={districtForCalculatorDropdownDataList}
                    isLoading={isLoadingDistrictForCalculatorDropdownDataList}
                    getOptionLabel={(option) => `${option.level3Name}`}
                    getOptionValue={(option) => `${option}`}
                    onChange={(e) => updateStateForCalculator("txtDistrictForCalculator", e)}
                  />
                </Form.InputGroup>
              </div>

              <div className={BizClass.FormGroupBox}>
                <Form.InputGroup label="Crop" errorMsg={formValidationFarmersError["txtCropForCalculator"]} req="true">
                  <Form.InputControl
                    control="select"
                    name="txtCropForCalculator"
                    value={formValuesForCalculator.txtCropForCalculator}
                    options={cropForCalculatorDropdownDataList}
                    isLoading={isLoadingCropForCalculatorDropdownDataList}
                    getOptionLabel={(option) => `${option.cropName}`}
                    getOptionValue={(option) => `${option}`}
                    onChange={(e) => updateStateForCalculator("txtCropForCalculator", e)}
                  />
                </Form.InputGroup>
              </div>

              <div className={BizClass.FormGroupBox}>
                <Form.InputGroup label="Area In Hectare" errorMsg={formValidationFarmersError["txtAreaInHectareForCalculator"]} req="true">
                  <Form.InputControl
                    control="input"
                    maxlength="3"
                    minlength="3"
                    type="text"
                    name="txtAreaInHectareForCalculator"
                    value={formValuesForCalculator.txtAreaInHectareForCalculator}
                    onChange={(e) => updateStateForCalculator("txtAreaInHectareForCalculator", e.target.value)}
                  />
                </Form.InputGroup>
              </div>
            </div>
            <div className={BizClass.CalculatedData} ref={myRef}>
              {selectedCalculation && Object.keys(selectedCalculation).length > 0 && (
                <div>
                  <div className={BizClass.DataHeading}>
                    <h4>{selectedCropHeader && selectedCropHeader}</h4>
                  </div>
                  <div className={BizClass.ItemDetailsDiv} style={{ "justify-content": "center" }}>
                    <table className={BizClass.ItemDetailsTable}>
                      <thead>
                        <tr>
                          <th>Insurance Company</th>
                          <th>Sum Insured(Rs)/Hectare</th>
                          <th>Farmer Share(%)</th>
                          <th>Acturial Rate(%)</th>
                          <th>Cut Off Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{selectedCropData && selectedCropData.insuranceCompanyName}</td>
                          <td>{selectedCropData && selectedCropData.sumInsured}</td>
                          <td>{selectedCropData && selectedCropData.farmerShare}</td>
                          <td>{selectedCalculation && selectedCalculation.ActurialRate}</td>
                          <td>{selectedCropData && dateFormatDDMMYY(selectedCropData.cutOfDate.split("T")[0])}</td>
                        </tr>
                      </tbody>
                    </table>
                    <table className={BizClass.ItemDetailsTable}>
                      <thead>
                        <tr>
                          <th>Crop</th>
                          <th>Area(Hectare)</th>
                          <th>Premium Paid By Farmer(Rs)</th>
                          <th>Premium Paid By Govt(Rs)</th>
                          <th>Sum Insured(Rs)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{selectedCropData && selectedCropData.cropName}</td>
                          <td>{selectedCalculation && selectedCalculation.AreaInhectare}</td>
                          <td>{selectedCalculation && selectedCalculation.Preminumpaidbyfarmer}</td>
                          <td>{selectedCalculation && selectedCalculation.Preminumpaidbygovt}</td>
                          <td>{selectedCalculation && selectedCalculation.CalculatedSumInsured}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={BizClass.FooterSection}>
            <Button onClick={() => clearFormOnClick()}>Reset</Button>
            <Button
              className={btnCalculateState ? BizClass.disableCalculatorBtn : ""}
              trigger={btnLoaderActive && "true"}
              onClick={() => getCalculatorDataOnClick()}
            >
              Calculate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
