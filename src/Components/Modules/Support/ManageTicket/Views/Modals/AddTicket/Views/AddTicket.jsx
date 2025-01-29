import React from "react";
import classNames from "classnames";
import { DataGrid, Form, Modal, PageBar } from "Framework/Components/Layout";
import { Loader, Button } from "Framework/Components/Widgets";
import moment from "moment";
import { dateFormatDDMMYY, dateToSpecificFormat, Convert24FourHourAndMinute } from "Configration/Utilities/dateformat";
import { FcViewDetails } from "react-icons/fc";
import { AiOutlineMinusSquare, AiOutlinePlusSquare } from "react-icons/ai";
import { CgFileDocument } from "react-icons/cg";
import PropTypes from "prop-types";
import AddTicketLogics from "../Logic/Logic";
import BizClass from "./AddTicket.module.scss";

// A function AddTicket({ showfunc, updateFarmersTickets, updateFarmersTicketsStatusCount, openMyTicketPage }) {
function AddTicket({ showfunc, updateFarmersTickets, openMyTicketPage }) {
  const {
    selectedValidateOption,
    selectedOption,
    openModal,
    toggleModal,
    openInsuranceCompanyModal,
    toggleInsuranceCompanyModal,
    yearList,
    updateState,
    formValues,
    stateDropdownDataList,
    isLoadingStateDropdownDataList,
    districtDropdownDataList,
    isLoadingDistrictDropdownDataList,
    bankDropdownDataList,
    isLoadingBankDropdownDataList,
    bankBranchDropdownDataList,
    isLoadingBankBranchDropdownDataList,
    updateStateForPolicyNumber,
    formValuesForPolicyNumber,
    // Anil lableTalukAnythingForPolicyNumber,
    lableVillageForPolicyNumber,
    stateForPolicyNumberDropdownDataList,
    // A isLoadingStateForPolicyNumberDropdownDataList,
    districtForPolicyNumberDropdownDataList,
    isLoadingDistrictForPolicyNumberDropdownDataList,
    subDistrictForPolicyNumberDropdownDataList,
    isLoadingSubDistrictForPolicyNumberDropdownDataList,
    villageForPolicyNumberDropdownDataList,
    isLoadingVillageForPolicyNumberDropdownDataList,
    updateStateForByLocation,
    formValuesForByLocation,
    lableTalukAnything,
    lableVillageForByLocation,
    stateForByLocationDropdownDataList,
    isLoadingStateForByLocationDropdownDataList,
    districtForByLocationDropdownDataList,
    isLoadingDistrictForByLocationDropdownDataList,
    subDistrictForByLocationDropdownDataList,
    isLoadingSubDistrictForByLocationDropdownDataList,
    seasonForPolicyNumberDropdownDataList,
    // A isLoadingSeasonPolicyNumberDropdownDataList,
    villageForByLocationDropdownDataList,
    isLoadingVillageForByLocationDropdownDataList,
    OnClickSelectedValidateOption,
    formValuesMN,
    formValuesAN,
    updateStateMN,
    updateStateAN,
    validateFarmerOnClick,
    mobileNoSelect,
    aadharNoSelect,
    selectedFarmer,
    formValidationFarmersError,
    btnLoaderActive,
    onChangeFarmersDetails,
    onGridReady,
    onCellDoubleClicked,
    farmersData,
    btnLoaderFarmerInfoActive,
    formValuesForFarmerInfo,
    formValidationFarmersInfoError,
    updateStateForFarmerInfo,
    getPolicyOfFarmerOnClick,
    insuranceCompanyData,
    isLoadingApplicationNoData,
    updateStateTicketCreation,
    formValuesTicketCreation,
    ticketCategoryList,
    isLoadingTicketCategoryList,
    ticketCategoryTypeList,
    isLoadingTicketCategoryTypeList,
    btnLoaderSupportTicketActive,
    formValidationSupportTicketError,
    supportTicketOnClick,
    onGridReadySupportTicket,
    selectedOptionOnClick,
    onCellDoubleClickedDetails,
    selectedInsuranceDetails,
    btnLoaderFarmerGreivenceInfoActive,
    isLoadingApplicationNoDataGreivence,
    insuranceCompanyDataGreivence,
    getPolicyOfFarmerGreivenceOnClick,
    openInsuranceCompanyModalGreivence,
    toggleInsuranceCompanyModalGreivence,
    onGridReadySupportTicketGreivence,
    onCellDoubleClickedDetailsGreivence,
    selectedClaimOrGrievence,
    clearAddTicketForm,
    schemeList,
    openTicketHistoryModal,
    getTicketHistoryOnClick,
    btnLoaderTicketHistoryActive,
    toggleTicketHistoryModal,
    ticketHistoryData,
    onGridReadyTicketHistory,
    isLoadingTicketHistory,
    onChangeTicketHistory,
    isBtndisabled,
    farmersTicketSummaryData,
    getClaimStatusOnClick,
    btnLoaderClaimStatusActive,
    openClaimStatusModal,
    toggleClaimStatusModal,
    claimStatusData,
    isLoadingClaimStatusData,
    onGridReadyClaimStatus,
    onChangeClamStatus,
    openCustomeWindow,
    OnClickCustomeWindow,
    customeWindowWidth,
    customeWindowHeight,
    selectedOptionCropStage,
    selectedOptionOnClickCropStage,
    lossAtList,
    isLoadingLossAtList,
    cropStageList,
    isLoadingCropStageList,
    lablelevel5,
    level5ByLocationDropdownDataList,
    isLoadinglevel5ByLocationDropdownDataList,
    lablelevel6,
    level6ByLocationDropdownDataList,
    isLoadinglevel6ByLocationDropdownDataList,
    formValuesCallerInformation,
    updateStateCallerInformation,
    handleResetFile,
    fileRef,
    stateCropLossIntimation,
    btnEnableSaveOnValidateMN,
    btnLoaderActiveValidateMN,
    SavevalidateFarmerOnClick,
    clearInputFarmerAuthenticateMN,
    reasonDropdownDataList,
    callConnectedDropdownDataList,
    btnLoaderActiveTicketSummary,
    fetchfarmersummary,
    fetchfarmersTicketSummary,
    // A runningCurrentYear,
    stateYearAndSeason,
    ResetYrSsnSchmApplicationDataOnClick,
    radioFarmerAuthentication,
    ticketCategoryOtherList,
    isLoadingTicketCategoryOtherList,
  } = AddTicketLogics();

  return (
    <>
      {openModal && (
        <FarmerListModal
          toggleModal={toggleModal}
          farmersData={farmersData}
          onGridReady={onGridReady}
          onCellDoubleClicked={onCellDoubleClicked}
          onChangeFarmersDetails={onChangeFarmersDetails}
        />
      )}
      {openInsuranceCompanyModal && (
        <InsuranceCompanyModal
          toggleInsuranceCompanyModal={toggleInsuranceCompanyModal}
          onGridReadySupportTicket={onGridReadySupportTicket}
          onCellDoubleClickedDetails={onCellDoubleClickedDetails}
          insuranceCompanyData={insuranceCompanyData}
          isLoadingApplicationNoData={isLoadingApplicationNoData}
        />
      )}
      {openInsuranceCompanyModalGreivence && (
        <InsuranceCompanyModalGreivence
          toggleInsuranceCompanyModalGreivence={toggleInsuranceCompanyModalGreivence}
          onGridReadySupportTicketGreivence={onGridReadySupportTicketGreivence}
          onCellDoubleClickedDetailsGreivence={onCellDoubleClickedDetailsGreivence}
          insuranceCompanyDataGreivence={insuranceCompanyDataGreivence}
          isLoadingApplicationNoDataGreivence={isLoadingApplicationNoDataGreivence}
          getClaimStatusOnClick={getClaimStatusOnClick}
        />
      )}
      {openTicketHistoryModal && (
        <TicketHistoryModal
          toggleTicketHistoryModal={toggleTicketHistoryModal}
          selectedFarmer={selectedFarmer}
          ticketHistoryData={ticketHistoryData}
          onGridReadyTicketHistory={onGridReadyTicketHistory}
          isLoadingTicketHistory={isLoadingTicketHistory}
          onChangeTicketHistory={onChangeTicketHistory}
          openMyTicketPage={openMyTicketPage}
        />
      )}
      {openClaimStatusModal && (
        <ClaimStatusModal
          toggleClaimStatusModal={toggleClaimStatusModal}
          onGridReadyClaimStatus={onGridReadyClaimStatus}
          claimStatusData={claimStatusData}
          onChangeClamStatus={onChangeClamStatus}
          isLoadingClaimStatusData={isLoadingClaimStatusData}
          openCustomeWindow={openCustomeWindow}
          OnClickCustomeWindow={OnClickCustomeWindow}
          customeWindowWidth={customeWindowWidth}
          customeWindowHeight={customeWindowHeight}
        />
      )}
      <div className={BizClass.Box}>
        <div className={BizClass.Div}>
          <div className={BizClass.ValidateBox}>
            <div className={BizClass.ValidateTitle}>
              <h3>Farmer Authentication</h3>
            </div>
            <div className={BizClass.ValidateContent}>
              <form className={BizClass.ValidateForm}>
                <div className={BizClass.ValidateInputGroup}>
                  <Form.InputGroup errorMsg="">
                    <ul className={BizClass.ValidateTabGroup}>
                      <button type="button" className={selectedValidateOption === "1" && BizClass.Active} onClick={() => OnClickSelectedValidateOption("MN")}>
                        <div className={BizClass.ValidateTabCheckBox} />
                        <span>Mobile Number</span>
                      </button>
                      <button
                        type="button"
                        className={
                          selectedValidateOption === "2" && radioFarmerAuthentication === false
                            ? BizClass.Active
                            : radioFarmerAuthentication === true
                            ? BizClass.disabledradioFarmerAuthenticationBox
                            : null
                        }
                        onClick={() => OnClickSelectedValidateOption("AN")}
                      >
                        <div className={BizClass.ValidateTabCheckBox} />
                        <span>Aadhar Number</span>
                      </button>
                      <button
                        type="button"
                        className={
                          selectedValidateOption === "3" && radioFarmerAuthentication === false
                            ? BizClass.Active
                            : radioFarmerAuthentication === true
                            ? BizClass.disabledradioFarmerAuthenticationBox
                            : null
                        }
                        onClick={() => OnClickSelectedValidateOption("BAN")}
                      >
                        <div className={BizClass.ValidateTabCheckBox} />
                        <span>Bank A/C Number</span>
                      </button>
                      <button
                        type="button"
                        className={
                          selectedValidateOption === "4" && radioFarmerAuthentication === false
                            ? BizClass.Active
                            : radioFarmerAuthentication === true
                            ? BizClass.disabledradioFarmerAuthenticationBox
                            : null
                        }
                        onClick={() => OnClickSelectedValidateOption("PN")}
                      >
                        <div className={BizClass.ValidateTabCheckBox} />
                        <span>Policy Number</span>
                      </button>
                      <button
                        type="button"
                        className={
                          selectedValidateOption === "5" && radioFarmerAuthentication === false
                            ? BizClass.Active
                            : radioFarmerAuthentication === true
                            ? BizClass.disabledradioFarmerAuthenticationBox
                            : null
                        }
                        onClick={() => OnClickSelectedValidateOption("BL")}
                      >
                        <div className={BizClass.ValidateTabCheckBox} />
                        <span>By Location</span>
                      </button>
                    </ul>
                  </Form.InputGroup>
                </div>
                {selectedValidateOption === "1" && (
                  <div className={BizClass.ValidateControlGroup}>
                    <Form.Group column="1" controlwidth="auto">
                      <Form.InputGroup label="Mobile Number" req="true" errorMsg={formValidationFarmersError["txtMobileNumber"]}>
                        <Form.InputControl
                          control="input"
                          name="txtMobileNumber"
                          value={formValuesMN.txtMobileNumber}
                          minLength={10}
                          maxLength={10}
                          onChange={(e) => updateStateMN("txtMobileNumber", e.target.value)}
                          focus="true"
                          ref={mobileNoSelect}
                        />
                      </Form.InputGroup>
                      {btnEnableSaveOnValidateMN ? (
                        <>
                          <Form.InputGroup label="Call Status" req="true" errorMsg={formValidationFarmersError["txtCallStatus"]}>
                            <Form.InputControl
                              control="select"
                              name="txtCallStatus"
                              value={formValuesMN.txtCallStatus}
                              options={callConnectedDropdownDataList}
                              getOptionLabel={(option) => `${option.Value}`}
                              getOptionValue={(option) => `${option}`}
                              onChange={(e) => updateStateMN("txtCallStatus", e)}
                            />
                          </Form.InputGroup>
                          {formValuesMN && formValuesMN.txtCallStatus && formValuesMN.txtCallStatus.ID === 1 ? (
                            <>
                              <Form.InputGroup label="Farmer Name" req="true" errorMsg={formValidationFarmersError["txtFarmerName"]}>
                                <Form.InputControl
                                  control="input"
                                  name="txtFarmername"
                                  value={formValuesMN.txtFarmerName}
                                  onChange={(e) => updateStateMN("txtFarmerName", e.target.value)}
                                  autoComplete="off"
                                />
                              </Form.InputGroup>
                              <Form.InputGroup label="State" req="true" errorMsg={formValidationFarmersError["txtStateValidateMobile"]}>
                                <Form.InputControl
                                  control="select"
                                  name="txtStateValidateMobile"
                                  value={formValuesMN.txtStateValidateMobile}
                                  options={stateDropdownDataList}
                                  // A loader={isLoadingStateDropdownDataList ? <Loader /> : null}
                                  isLoading={isLoadingStateDropdownDataList}
                                  getOptionLabel={(option) => `${option.StateMasterName}`}
                                  getOptionValue={(option) => `${option}`}
                                  onChange={(e) => updateStateMN("txtStateValidateMobile", e)}
                                />
                              </Form.InputGroup>
                              <Form.InputGroup label="District" req="true" errorMsg={formValidationFarmersError["txtDistrictValidateMobile"]}>
                                <Form.InputControl
                                  control="select"
                                  name="txtDistrictValidateMobile"
                                  value={formValuesMN.txtDistrictValidateMobile}
                                  options={districtDropdownDataList}
                                  // A loader={isLoadingDistrictDropdownDataList ? <Loader /> : null}
                                  isLoading={isLoadingDistrictDropdownDataList}
                                  getOptionLabel={(option) => `${option.level3Name}`}
                                  getOptionValue={(option) => `${option}`}
                                  onChange={(e) => updateStateMN("txtDistrictValidateMobile", e)}
                                />
                              </Form.InputGroup>
                            </>
                          ) : null}
                          <Form.InputGroup label="Reason" req="true" errorMsg={formValidationFarmersError["txtReason"]}>
                            <Form.InputControl
                              control="select"
                              name="txtReason"
                              value={formValuesMN.txtReason}
                              options={reasonDropdownDataList}
                              getOptionLabel={(option) => `${option.Value}`}
                              getOptionValue={(option) => `${option}`}
                              onChange={(e) => updateStateMN("txtReason", e)}
                            />
                          </Form.InputGroup>
                        </>
                      ) : null}
                    </Form.Group>
                  </div>
                )}
                {selectedValidateOption === "2" && (
                  <div className={BizClass.ValidateControlGroup}>
                    <Form.Group column="1" controlwidth="auto">
                      <Form.InputGroup label="Aadhar Number" req="true" errorMsg={formValidationFarmersError["txtAadharNumber"]}>
                        <Form.InputControl
                          control="input"
                          name="txtAadharNumber"
                          minLength={12}
                          maxLength={12}
                          value={formValuesAN.txtAadharNumber}
                          onChange={(e) => updateStateAN("txtAadharNumber", e.target.value)}
                          focus="true"
                          ref={aadharNoSelect}
                        />
                      </Form.InputGroup>
                    </Form.Group>
                  </div>
                )}
                {selectedValidateOption === "3" && (
                  <div className={BizClass.ValidateControlGroup}>
                    <Form.Group column="1" controlwidth="auto">
                      <Form.InputGroup label="State" req="true" errorMsg={formValidationFarmersError["txtState"]}>
                        <Form.InputControl
                          control="select"
                          name="txtState"
                          value={formValues.txtState}
                          options={stateDropdownDataList}
                          // A loader={isLoadingStateDropdownDataList ? <Loader /> : null}
                          isLoading={isLoadingStateDropdownDataList}
                          getOptionLabel={(option) => `${option.StateMasterName}`}
                          getOptionValue={(option) => `${option}`}
                          onChange={(e) => updateState("txtState", e)}
                          focus="true"
                        />
                      </Form.InputGroup>
                      <Form.InputGroup label="District" req="true" errorMsg={formValidationFarmersError["txtDistrict"]}>
                        <Form.InputControl
                          control="select"
                          name="txtDistrict"
                          value={formValues.txtDistrict}
                          options={districtDropdownDataList}
                          // A loader={isLoadingDistrictDropdownDataList ? <Loader /> : null}
                          isLoading={isLoadingDistrictDropdownDataList}
                          getOptionLabel={(option) => `${option.level3Name}`}
                          getOptionValue={(option) => `${option}`}
                          onChange={(e) => updateState("txtDistrict", e)}
                        />
                      </Form.InputGroup>
                      <Form.InputGroup label="Bank Name" req="true" errorMsg={formValidationFarmersError["txtBankName"]}>
                        <Form.InputControl
                          control="select"
                          name="txtBankName"
                          value={formValues.txtBankName}
                          options={bankDropdownDataList}
                          // A loader={isLoadingBankDropdownDataList ? <Loader /> : null}
                          isLoading={isLoadingBankDropdownDataList}
                          getOptionLabel={(option) => `${option.bankName}`}
                          getOptionValue={(option) => `${option}`}
                          onChange={(e) => updateState("txtBankName", e)}
                        />
                      </Form.InputGroup>
                      <Form.InputGroup label="Bank Branch" req="true" errorMsg={formValidationFarmersError["txtBranchName"]}>
                        <Form.InputControl
                          control="select"
                          name="txtBranchName"
                          value={formValues.txtBranchName}
                          options={bankBranchDropdownDataList}
                          // A loader={isLoadingBankBranchDropdownDataList ? <Loader /> : null}
                          isLoading={isLoadingBankBranchDropdownDataList}
                          getOptionLabel={(option) => `${option.branchName}`}
                          getOptionValue={(option) => `${option}`}
                          onChange={(e) => updateState("txtBranchName", e)}
                        />
                      </Form.InputGroup>
                      <Form.InputGroup label="Account Number" req="true" errorMsg={formValidationFarmersError["txtAccountNumber"]}>
                        <Form.InputControl
                          control="input"
                          label="Account Number"
                          name="txtAccountNumber"
                          minLength={14}
                          maxLength={18}
                          value={formValues.txtAccountNumber}
                          onChange={(e) => updateState("txtAccountNumber", e.target.value)}
                        />
                      </Form.InputGroup>
                    </Form.Group>
                  </div>
                )}
                {selectedValidateOption === "4" && (
                  <div className={BizClass.ValidateControlGroup}>
                    <Form.Group column="1" controlwidth="auto">
                      <Form.InputGroup label="" style={{ display: "none" }}>
                        <Form.InputControl
                          control="select"
                          name="txtStateForPolicyNumber"
                          value={formValuesForPolicyNumber.txtStateForPolicyNumber}
                          options={stateForPolicyNumberDropdownDataList}
                          // A loader={isLoadingStateForPolicyNumberDropdownDataList ? <Loader /> : null}
                          getOptionLabel={(option) => `${option.StateMasterName}`}
                          getOptionValue={(option) => `${option}`}
                          onChange={(e) => updateStateForPolicyNumber("txtStateForPolicyNumber", e)}
                          focus="true"
                        />
                      </Form.InputGroup>
                      <Form.InputGroup label="" style={{ display: "none" }}>
                        <Form.InputControl
                          control="select"
                          name="txtDistrictForPolicyNumber"
                          value={formValuesForPolicyNumber.txtDistrictForPolicyNumber}
                          options={districtForPolicyNumberDropdownDataList}
                          loader={isLoadingDistrictForPolicyNumberDropdownDataList ? <Loader /> : null}
                          getOptionLabel={(option) => `${option.level3Name}`}
                          getOptionValue={(option) => `${option}`}
                          onChange={(e) => updateStateForPolicyNumber("txtDistrictForPolicyNumber", e)}
                        />
                      </Form.InputGroup>
                      <Form.InputGroup label="" style={{ display: "none" }}>
                        <Form.InputControl
                          control="select"
                          name="txtSubDistrictForPolicyNumber"
                          value={formValuesForPolicyNumber.txtSubDistrictForPolicyNumber}
                          options={subDistrictForPolicyNumberDropdownDataList}
                          loader={isLoadingSubDistrictForPolicyNumberDropdownDataList ? <Loader /> : null}
                          getOptionLabel={(option) => `${option.level4Name}`}
                          getOptionValue={(option) => `${option}`}
                          onChange={(e) => updateStateForPolicyNumber("txtSubDistrictForPolicyNumber", e)}
                        />
                      </Form.InputGroup>

                      <div className={BizClass.ModalCustomBox} style={{ display: "none" }}>
                        <Form.InputGroup label={lableVillageForPolicyNumber}>
                          <Form.InputControl
                            control="select"
                            name="txtVillageForPolicyNumber"
                            value={formValuesForPolicyNumber.txtVillageForPolicyNumber}
                            options={villageForPolicyNumberDropdownDataList}
                            loader={isLoadingVillageForPolicyNumberDropdownDataList ? <Loader /> : null}
                            getOptionLabel={(option) => `${option.label}`}
                            getOptionValue={(option) => `${option}`}
                            onChange={(e) => updateStateForPolicyNumber("txtVillageForPolicyNumber", e)}
                          />
                        </Form.InputGroup>
                      </div>
                      <Form.InputGroup label="" style={{ display: "none" }}>
                        <Form.InputControl
                          control="select"
                          name="txtSeasonForPolicyNumber"
                          value={formValuesForPolicyNumber.txtSeasonForPolicyNumber}
                          options={seasonForPolicyNumberDropdownDataList}
                          // A loader={isLoadingSeasonPolicyNumberDropdownDataList ? <Loader /> : null}
                          getOptionLabel={(option) => `${option.CropSeasonName}`}
                          getOptionValue={(option) => `${option}`}
                          onChange={(e) => updateStateForPolicyNumber("txtSeasonForPolicyNumber", e)}
                        />
                      </Form.InputGroup>
                      <Form.InputGroup label="" style={{ display: "none" }}>
                        <Form.InputControl
                          control="select"
                          name="txtYearForPolicyNumber"
                          value={formValuesForPolicyNumber.txtYearForPolicyNumber}
                          options={yearList}
                          getOptionLabel={(option) => `${option.Name}`}
                          getOptionValue={(option) => `${option}`}
                          onChange={(e) => updateStateForPolicyNumber("txtYearForPolicyNumber", e)}
                        />
                      </Form.InputGroup>

                      <Form.InputGroup label="Policy Number" req="true" errorMsg={formValidationFarmersError["txtPolicyNumber"]}>
                        <Form.InputControl
                          id="inputPolicyNumber"
                          control="input"
                          name="txtPolicyNumber"
                          minLength={19}
                          maxLength={19}
                          onPaste={(e) => {
                            e.preventDefault();
                            return false;
                          }}
                          onCopy={(e) => {
                            e.preventDefault();
                            return false;
                          }}
                          value={formValuesForPolicyNumber.txtPolicyNumber}
                          onChange={(e) => updateStateForPolicyNumber("txtPolicyNumber", e.target.value)}
                        />
                      </Form.InputGroup>
                      <Form.InputGroup label="Scheme">
                        <Form.InputControl
                          control="input"
                          name="txtSchemeForPolicyNumber"
                          value={formValuesForPolicyNumber.txtSchemeForPolicyNumber}
                          onChange={(e) => updateStateForPolicyNumber("txtSchemeForPolicyNumber", e.target.value)}
                          disabled={true}
                        />
                      </Form.InputGroup>
                      <Form.InputGroup label="Season">
                        <Form.InputControl
                          control="input"
                          name="txtSeasonForPolicyNumber"
                          value={formValuesForPolicyNumber.txtSeasonForPolicyNumber}
                          onChange={(e) => updateStateForPolicyNumber("txtSeasonForPolicyNumber", e.target.value)}
                          disabled={true}
                        />
                      </Form.InputGroup>
                      <Form.InputGroup label="State & Year">
                        <Form.InputControl
                          control="input"
                          name="txtStateAndYearForPolicyNumber"
                          value={formValuesForPolicyNumber.txtStateAndYearForPolicyNumber}
                          onChange={(e) => updateStateForPolicyNumber("txtStateAndYearForPolicyNumber", e.target.value)}
                          disabled={true}
                        />
                      </Form.InputGroup>
                    </Form.Group>
                  </div>
                )}
                {selectedValidateOption === "5" && (
                  <div className={BizClass.ValidateControlGroup}>
                    <Form.Group column="1" controlwidth="auto">
                      <div className={BizClass.ModalCustomGroup}>
                        <Form.InputGroup label="Season" req="true" errorMsg={formValidationFarmersError["txtSeasonForLocation"]}>
                          <Form.InputControl
                            control="select"
                            name="txtSeasonForLocation"
                            value={formValuesForByLocation.txtSeasonForLocation}
                            options={seasonForPolicyNumberDropdownDataList}
                            // A loader={isLoadingSeasonPolicyNumberDropdownDataList ? <Loader /> : null}
                            // A isLoading={isLoadingSeasonPolicyNumberDropdownDataList}
                            getOptionLabel={(option) => `${option.CropSeasonName}`}
                            getOptionValue={(option) => `${option}`}
                            onChange={(e) => updateStateForByLocation("txtSeasonForLocation", e)}
                          />
                        </Form.InputGroup>
                        <Form.InputGroup label="Year" req="true" errorMsg={formValidationFarmersError["txtYearForLocation"]}>
                          <Form.InputControl
                            control="select"
                            name="txtYearForLocation"
                            value={formValuesForByLocation.txtYearForLocation}
                            options={yearList}
                            getOptionLabel={(option) => `${option.Name}`}
                            getOptionValue={(option) => `${option}`}
                            onChange={(e) => updateStateForByLocation("txtYearForLocation", e)}
                          />
                        </Form.InputGroup>
                        <Form.InputGroup label="Scheme" req="true" errorMsg={formValidationFarmersError["txtSchemeForLocation"]}>
                          <Form.InputControl
                            control="select"
                            name="txtSchemeForLocation"
                            value={formValuesForByLocation.txtSchemeForLocation}
                            options={schemeList}
                            getOptionLabel={(option) => `${option.SchemeName}`}
                            getOptionValue={(option) => `${option}`}
                            onChange={(e) => updateStateForByLocation("txtSchemeForLocation", e)}
                          />
                        </Form.InputGroup>
                        <Form.InputGroup label="State" req="true" errorMsg={formValidationFarmersError["txtStateForByLocation"]}>
                          <Form.InputControl
                            control="select"
                            name="txtStateForByLocation"
                            value={formValuesForByLocation.txtStateForByLocation}
                            options={stateForByLocationDropdownDataList}
                            // A loader={isLoadingStateForByLocationDropdownDataList ? <Loader /> : null}
                            isLoading={isLoadingStateForByLocationDropdownDataList}
                            getOptionLabel={(option) => `${option.StateMasterName}`}
                            getOptionValue={(option) => `${option}`}
                            onChange={(e) => updateStateForByLocation("txtStateForByLocation", e)}
                            focus="true"
                          />
                        </Form.InputGroup>
                        <Form.InputGroup label="District" req="true" errorMsg={formValidationFarmersError["txtDistrictForByLocation"]}>
                          <Form.InputControl
                            control="select"
                            name="txtDistrictForByLocation"
                            value={formValuesForByLocation.txtDistrictForByLocation}
                            options={districtForByLocationDropdownDataList}
                            // A loader={isLoadingDistrictForByLocationDropdownDataList ? <Loader /> : null}
                            isLoading={isLoadingDistrictForByLocationDropdownDataList}
                            // A getOptionLabel={(option) => `${option.DistrictMasterName}`}
                            getOptionLabel={(option) => `${option.level3Name}`}
                            getOptionValue={(option) => `${option}`}
                            onChange={(e) => updateStateForByLocation("txtDistrictForByLocation", e)}
                          />
                        </Form.InputGroup>
                        <Form.InputGroup label={lableTalukAnything} req="true" errorMsg={formValidationFarmersError["txtSubDistrictForByLocation"]}>
                          <Form.InputControl
                            control="select"
                            name="txtSubDistrictForByLocation"
                            value={formValuesForByLocation.txtSubDistrictForByLocation}
                            options={subDistrictForByLocationDropdownDataList}
                            // A loader={isLoadingSubDistrictForByLocationDropdownDataList ? <Loader /> : null}
                            isLoading={isLoadingSubDistrictForByLocationDropdownDataList}
                            // A getOptionLabel={(option) => `${option.SubDistrictMasterName}`}
                            getOptionLabel={(option) => `${option.level4Name}`}
                            getOptionValue={(option) => `${option}`}
                            onChange={(e) => updateStateForByLocation("txtSubDistrictForByLocation", e)}
                          />
                        </Form.InputGroup>

                        <Form.InputGroup label={lablelevel5} req="true" errorMsg={formValidationFarmersError["txtlevel5ByLocation"]}>
                          <Form.InputControl
                            control="select"
                            name="txtlevel5ByLocation"
                            value={formValuesForByLocation.txtlevel5ByLocation}
                            options={level5ByLocationDropdownDataList}
                            // A loader={isLoadinglevel5ByLocationDropdownDataList ? <Loader /> : null}
                            isLoading={isLoadinglevel5ByLocationDropdownDataList}
                            getOptionLabel={(option) => `${option.level5Name}`}
                            getOptionValue={(option) => `${option}`}
                            onChange={(e) => updateStateForByLocation("txtlevel5ByLocation", e)}
                          />
                        </Form.InputGroup>

                        {lablelevel6 === null ? null : (
                          <Form.InputGroup label={lablelevel6} req="true" errorMsg={formValidationFarmersError["txtlevel6ByLocation"]}>
                            <Form.InputControl
                              control="select"
                              name="txtlevel6ByLocation"
                              value={formValuesForByLocation.txtlevel6ByLocation}
                              options={level6ByLocationDropdownDataList}
                              // A loader={isLoadinglevel6ByLocationDropdownDataList ? <Loader /> : null}
                              isLoading={isLoadinglevel6ByLocationDropdownDataList}
                              getOptionLabel={(option) => `${option.level6Name}`}
                              getOptionValue={(option) => `${option}`}
                              onChange={(e) => updateStateForByLocation("txtlevel6ByLocation", e)}
                            />
                          </Form.InputGroup>
                        )}
                        {/* <div className={BizClass.ModalCustomBox}> */}
                        <Form.InputGroup label={lableVillageForByLocation} req="true" errorMsg={formValidationFarmersError["txtVillageForByLocation"]}>
                          <Form.InputControl
                            control="select"
                            name="txtVillageForByLocation"
                            value={formValuesForByLocation.txtVillageForByLocation}
                            options={villageForByLocationDropdownDataList}
                            // A loader={isLoadingVillageForByLocationDropdownDataList ? <Loader /> : null}
                            isLoading={isLoadingVillageForByLocationDropdownDataList}
                            getOptionLabel={(option) => `${option.level7Name}`}
                            getOptionValue={(option) => `${option}`}
                            onChange={(e) => updateStateForByLocation("txtVillageForByLocation", e)}
                          />
                        </Form.InputGroup>
                        {/* </div> */}
                      </div>
                    </Form.Group>
                  </div>
                )}
                <div className={BizClass.ValidateFormFooter}>
                  {btnEnableSaveOnValidateMN === false ? (
                    <Button className={BizClass.FormFooterButton} trigger={btnLoaderActive && "true"} onClick={() => validateFarmerOnClick()}>
                      Validate
                    </Button>
                  ) : null}
                  &nbsp;
                  {btnEnableSaveOnValidateMN ? (
                    <>
                      <Button className={BizClass.FormFooterButton} trigger={btnLoaderActiveValidateMN && "true"} onClick={() => SavevalidateFarmerOnClick()}>
                        Save
                      </Button>
                      &nbsp;
                      <Button className={BizClass.FormFooterButton} onClick={() => clearInputFarmerAuthenticateMN()}>
                        Reset
                      </Button>
                    </>
                  ) : null}
                </div>
              </form>
              {/* <div className={BizClass.ValidateProfile} /> */}
              <div className={BizClass.ValidateBox}>
                <div className={BizClass.ValidateTitle}>
                  <h3>Farmer Ticket Summary And Tick History</h3>{" "}
                  {fetchfarmersummary !== "" ? (
                    <Button trigger={btnLoaderActiveTicketSummary && "true"} className={BizClass.FormFooterButton} onClick={() => fetchfarmersTicketSummary()}>
                      Fetch Data
                    </Button>
                  ) : null}
                </div>
                <div className={BizClass.Farmer_Ticket_Box}>
                  {/* {isLoadingPageData ? <Loader /> : null} */}
                  <div className={BizClass.Farmer_Ticket_SummaryBoard}>
                    {farmersTicketSummaryData && farmersTicketSummaryData.length > 0 ? (
                      farmersTicketSummaryData.map((x) => {
                        return (
                          <button className={BizClass.Farmer_Ticket_ScoreBoard} type="button" onClick={() => getTicketHistoryOnClick(x.TicketStatusID)}>
                            <div>
                              <span>{x.TicketStatus}</span>
                              <span>{x.Total}</span>
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <>
                        <div className={BizClass.Farmer_Ticket_ScoreBoard}>
                          <span>Open</span>
                          <span>0</span>
                        </div>
                        <div className={BizClass.Farmer_Ticket_ScoreBoard}>
                          <span>Resolved</span>
                          <span>0</span>
                        </div>
                        <div className={BizClass.Farmer_Ticket_ScoreBoard}>
                          <span>Total</span>
                          <span>0</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={BizClass.Div}>
          <div className={BizClass.InfoDiv}>
            <div className={BizClass.FarmerInfoDiv}>
              <div className={BizClass.Title}>
                <h3>Caller Information</h3>
              </div>
              <div className={BizClass.Content}>
                <div className={BizClass.Form_One}>
                  <Form.Group controlwidth="35%">
                    <Form.InputGroup label="Mobile No." req="true" column={1} errorMsg={formValidationSupportTicketError["txtCallerMobileNumber"]}>
                      <Form.InputControl
                        control="input"
                        name="txtCallerMobileNumber"
                        autoComplete="off"
                        value={formValuesCallerInformation.txtCallerMobileNumber}
                        minLength={10}
                        maxLength={10}
                        onChange={(e) => updateStateCallerInformation("txtCallerMobileNumber", e.target.value.replace(/\D/g, ""))}
                      />
                    </Form.InputGroup>
                  </Form.Group>
                </div>
              </div>
              <div className={BizClass.Title}>
                <h3>Farmer Information</h3>
              </div>
              <div className={BizClass.Content}>
                <Form.Group column="2" controlwidth="360px">
                  <Form.InputGroup label="Farmer Name">
                    <p className={BizClass.ContentPresenter}>{selectedFarmer && selectedFarmer.farmerName}</p>
                  </Form.InputGroup>
                  <Form.InputGroup label="Mobile No">
                    <p className={BizClass.ContentPresenter}>{selectedFarmer && selectedFarmer.mobile}</p>
                  </Form.InputGroup>
                  <Form.InputGroup label="State">
                    <p className={BizClass.ContentPresenter}>
                      {selectedFarmer && selectedFarmer.state
                        ? selectedFarmer.state
                        : selectedFarmer.stateName
                        ? selectedFarmer.stateName
                        : selectedFarmer.resState
                        ? selectedFarmer.resState
                        : ""}
                    </p>
                  </Form.InputGroup>
                  <Form.InputGroup label="District">
                    <p className={BizClass.ContentPresenter}>
                      {selectedFarmer && selectedFarmer.district
                        ? selectedFarmer.district
                        : selectedFarmer.districtName
                        ? selectedFarmer.districtName
                        : selectedFarmer.resDistrict
                        ? selectedFarmer.resDistrict
                        : ""}
                    </p>
                  </Form.InputGroup>
                  <Form.InputGroup label="Taluka">
                    <p className={BizClass.ContentPresenter}>
                      {selectedFarmer && selectedFarmer.subDistrict
                        ? selectedFarmer.subDistrict
                        : selectedFarmer.resSubDistrict
                        ? selectedFarmer.resSubDistrict
                        : ""}
                    </p>
                  </Form.InputGroup>
                  <Form.InputGroup label="Village">
                    <p className={BizClass.ContentPresenter}>
                      {selectedFarmer && selectedFarmer.village
                        ? selectedFarmer.village
                        : selectedFarmer.villageName
                        ? selectedFarmer.villageName
                        : selectedFarmer.resVillage
                        ? selectedFarmer.resVillage
                        : ""}
                    </p>
                  </Form.InputGroup>
                </Form.Group>
                <div className={BizClass.ContentDiv}>
                  <Form.Group column="2" controlwidth="360px">
                    <Form.CustomGroup column={4} columntemplate="140px 140px auto">
                      <Form.InputGroup label="" errorMsg={formValidationFarmersInfoError["txtYearForFarmerInfo"]}>
                        <Form.InputControl
                          control="select"
                          label="Year"
                          name="txtYearForFarmerInfo"
                          value={formValuesForFarmerInfo.txtYearForFarmerInfo}
                          options={yearList}
                          getOptionLabel={(option) => `${option.Name}`}
                          getOptionValue={(option) => `${option}`}
                          onChange={(e) => updateStateForFarmerInfo("txtYearForFarmerInfo", e)}
                          isDisabled={stateYearAndSeason === "YRSSNNO"}
                        />
                      </Form.InputGroup>
                      <Form.InputGroup errorMsg={formValidationFarmersInfoError["txtSeasonForFarmerInfo"]}>
                        <Form.InputControl
                          control="select"
                          label="Season"
                          name="txtSeasonForFarmerInfo"
                          value={formValuesForFarmerInfo.txtSeasonForFarmerInfo}
                          options={seasonForPolicyNumberDropdownDataList}
                          // A loader={isLoadingSeasonPolicyNumberDropdownDataList ? <Loader /> : null}
                          // A isLoading={isLoadingSeasonPolicyNumberDropdownDataList}
                          getOptionLabel={(option) => `${option.CropSeasonName}`}
                          getOptionValue={(option) => `${option}`}
                          onChange={(e) => updateStateForFarmerInfo("txtSeasonForFarmerInfo", e)}
                          isDisabled={stateYearAndSeason === "YRSSNNO"}
                        />
                      </Form.InputGroup>
                      <Form.InputGroup label="" errorMsg={formValidationSupportTicketError["txtSchemeForFarmerInfo"]}>
                        <Form.InputControl
                          control="select"
                          label="Scheme"
                          name="txtSchemeForFarmerInfo"
                          value={formValuesForFarmerInfo.txtSchemeForFarmerInfo}
                          options={schemeList}
                          getOptionLabel={(option) => `${option.SchemeName}`}
                          getOptionValue={(option) => `${option}`}
                          onChange={(e) => updateStateForFarmerInfo("txtSchemeForFarmerInfo", e)}
                          isDisabled={true}
                        />
                      </Form.InputGroup>
                    </Form.CustomGroup>
                  </Form.Group>
                  <Form.Group column="2" controlwidth="360px" style={{ background: "#d6dbdf", padding: "5px", "border-radius": "4px" }}>
                    <Form.InputGroup label="Insurance Company">
                      <p className={BizClass.ContentPresenter}>
                        {selectedInsuranceDetails && selectedInsuranceDetails.insuranceCompanyName ? selectedInsuranceDetails.insuranceCompanyName : ""}
                      </p>
                    </Form.InputGroup>
                    <Form.InputGroup label="Application No.">
                      <p className={BizClass.ContentPresenter}>
                        {selectedClaimOrGrievence === "CI"
                          ? selectedInsuranceDetails && selectedInsuranceDetails.applicationNo
                            ? selectedInsuranceDetails.applicationNo
                            : ""
                          : selectedInsuranceDetails && selectedInsuranceDetails.applicationNo
                          ? selectedInsuranceDetails.applicationNo
                          : ""}
                      </p>
                    </Form.InputGroup>
                    <Form.InputGroup label="Farmer Premium">
                      <p className={BizClass.ContentPresenter}>
                        {selectedClaimOrGrievence === "CI"
                          ? selectedInsuranceDetails && selectedInsuranceDetails.farmerPremium
                            ? selectedInsuranceDetails.farmerPremium
                            : ""
                          : selectedInsuranceDetails && selectedInsuranceDetails.policyPremium
                          ? selectedInsuranceDetails.policyPremium
                          : ""}
                      </p>
                    </Form.InputGroup>
                    <Form.InputGroup label="Village">
                      <p className={BizClass.ContentPresenter}>
                        {selectedClaimOrGrievence === "CI"
                          ? selectedInsuranceDetails && selectedInsuranceDetails.plotVillageName
                            ? selectedInsuranceDetails.plotVillageName
                            : ""
                          : selectedInsuranceDetails && selectedInsuranceDetails.plotVillageName
                          ? selectedInsuranceDetails.plotVillageName
                          : ""}
                      </p>
                    </Form.InputGroup>
                    <Form.InputGroup label="Area In Hactare">
                      <p className={BizClass.ContentPresenter}>
                        {selectedClaimOrGrievence === "CI"
                          ? selectedInsuranceDetails && selectedInsuranceDetails.area
                            ? selectedInsuranceDetails.area
                            : ""
                          : selectedInsuranceDetails && selectedInsuranceDetails.policyArea
                          ? selectedInsuranceDetails.policyArea
                          : ""}
                      </p>
                    </Form.InputGroup>
                    <Form.InputGroup label="Crop Name">
                      <p className={BizClass.ContentPresenter}>
                        {selectedClaimOrGrievence === "CI"
                          ? selectedInsuranceDetails && selectedInsuranceDetails.cropName
                            ? selectedInsuranceDetails.cropName
                            : ""
                          : selectedInsuranceDetails && selectedInsuranceDetails.cropName
                          ? selectedInsuranceDetails.cropName
                          : ""}
                      </p>
                    </Form.InputGroup>
                  </Form.Group>
                  <Form.Group column="2" controlwidth="360px" style={{ "padding-top": "4px" }}>
                    <div className={BizClass.InputBox} style={{ display: "flex" }}>
                      <Button
                        className={BizClass.Button}
                        trigger={btnLoaderFarmerInfoActive && "true"}
                        onClick={() => getPolicyOfFarmerOnClick()}
                        style={{ display: "none" }}
                      >
                        Claim Information
                      </Button>
                      <Button
                        className={BizClass.Button}
                        trigger={btnLoaderFarmerGreivenceInfoActive && "true"}
                        onClick={() => getPolicyOfFarmerGreivenceOnClick()}
                      >
                        Fetch Details
                      </Button>
                      <Button className={BizClass.Button} trigger={btnLoaderClaimStatusActive && "true"} onClick={() => getClaimStatusOnClick()}>
                        Claim Status
                      </Button>
                      <Button className={BizClass.Button} onClick={() => ResetYrSsnSchmApplicationDataOnClick()}>
                        Reset
                      </Button>
                      <Button
                        className={BizClass.Button}
                        trigger={btnLoaderTicketHistoryActive && "true"}
                        onClick={() => getTicketHistoryOnClick()}
                        style={{ display: "none" }}
                      >
                        Ticket History
                      </Button>
                    </div>
                  </Form.Group>
                </div>
              </div>
            </div>
            <div className={BizClass.CreationDiv}>
              <div className={BizClass.Title}>
                <h3>Ticket Creation</h3>
              </div>
              <div className={BizClass.Content}>
                <Form.Group column="2" controlwidth="360px">
                  <Form.InputGroup label="Ticket Type" errorMsg="" column={3}>
                    <ul className={BizClass.ValidateTabGroup}>
                      <button type="button" className={selectedOption === "1" && BizClass.Active} onClick={() => selectedOptionOnClick("GR")}>
                        <div className={BizClass.ValidateTabCheckBox} />
                        <span>Grievance</span>
                      </button>
                      <button type="button" className={selectedOption === "2" && BizClass.Active} onClick={() => selectedOptionOnClick("IN")}>
                        <div className={BizClass.ValidateTabCheckBox} />
                        <span>Information</span>
                      </button>
                      {(formValuesForFarmerInfo.txtYearForFarmerInfo &&
                      formValuesForFarmerInfo.txtYearForFarmerInfo.Value &&
                      formValuesForFarmerInfo.txtYearForFarmerInfo.Value <= 2023) ? null :
                      <button type="button" className={selectedOption === "4" && BizClass.Active} onClick={() => selectedOptionOnClick("LO")}>
                          <div className={BizClass.ValidateTabCheckBox} />
                          <span>Crop Loss Intimation</span>
                        </button> }
                      {/* {formValuesForFarmerInfo.txtYearForFarmerInfo &&
                      formValuesForFarmerInfo.txtYearForFarmerInfo.Value &&
                      formValuesForFarmerInfo.txtYearForFarmerInfo.Value < runningCurrentYear ? null : (
                        <button type="button" className={selectedOption === "4" && BizClass.Active} onClick={() => selectedOptionOnClick("LO")}>
                          <div className={BizClass.ValidateTabCheckBox} />
                          <span>Crop Loss Intimation</span>
                        </button>
                      )} */}
                    </ul>
                  </Form.InputGroup>
                  {selectedOption === "4" ? (
                    <Form.InputGroup label="" req="true" errorMsg="" column={4}>
                      <ul className={BizClass.ValidateTabGroup}>
                        {(formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
                          ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 51
                          : 0) ||
                        (formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
                          ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 52
                          : 0) ||
                        (formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
                          ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 53
                          : 0) ||
                        (formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
                          ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 58
                          : 0) ? (
                          <button type="button" style={{ border: "none", width: "90px" }} />
                        ) : selectedOptionCropStage === "2" || selectedOptionCropStage === "1" ? (
                          <button type="button" style={{ border: "none", width: "70px" }} />
                        ) : null}

                        <button
                          type="button"
                          className={selectedOptionCropStage === "1" && BizClass.Active}
                          onClick={() => selectedOptionOnClickCropStage("SCS")}
                        >
                          <div className={BizClass.ValidateTabCheckBox} />
                          <span>Standing Crop Stage</span>
                        </button>
                        <button
                          type="button"
                          className={selectedOptionCropStage === "2" && BizClass.Active}
                          onClick={() => selectedOptionOnClickCropStage("HS")}
                        >
                          <div className={BizClass.ValidateTabCheckBox} />
                          <span>Harvested Stage</span>
                        </button>
                      </ul>
                    </Form.InputGroup>
                  ) : null}
                  <Form.InputGroup column={2} label="Attachment" errorMsg={formValidationSupportTicketError["txtDocumentUpload"]}>
                    <Form.InputControl
                      control="input"
                      type="file"
                      accept="image/*,.pdf"
                      name="txtDocumentUpload"
                      onChange={(e) => updateStateTicketCreation(e.target.name, e.target.files[0])}
                      ref={fileRef}
                    />
                  </Form.InputGroup>
                  <Form.InputGroup column={1}>
                    <Button type="button" varient="primary" onClick={() => handleResetFile()}>
                      {" "}
                      Reset File
                    </Button>
                  </Form.InputGroup>
                  {selectedOption === "4" ? (
                    <Form.InputGroup column={3} label="Loss At" req="true" errorMsg={formValidationSupportTicketError["txtLossAt"]}>
                      <Form.InputControl
                        control="select"
                        name="txtLossAt"
                        value={formValuesTicketCreation.txtLossAt}
                        options={lossAtList}
                        // A loader={isLoadingLossAtList ? <Loader /> : null}
                        isLoading={isLoadingLossAtList}
                        getOptionLabel={(option) => `${option.CropStageSelection}`}
                        getOptionValue={(option) => `${option}`}
                        onChange={(e) => updateStateTicketCreation("txtLossAt", e)}
                      />
                    </Form.InputGroup>
                  ) : null}
                  <Form.InputGroup label="Category" req="true" errorMsg={formValidationSupportTicketError["txtTicketCategoryType"]}>
                    <Form.InputControl
                      control="select"
                      name="txtTicketCategoryType"
                      value={formValuesTicketCreation.txtTicketCategoryType}
                      options={ticketCategoryTypeList}
                      // A loader={isLoadingTicketCategoryTypeList ? <Loader /> : null}
                      isLoading={isLoadingTicketCategoryTypeList}
                      getOptionLabel={(option) => `${option.SupportTicketTypeName}`}
                      getOptionValue={(option) => `${option}`}
                      onChange={(e) => updateStateTicketCreation("txtTicketCategoryType", e)}
                    />
                  </Form.InputGroup>
                  <Form.InputGroup label="Sub Category" req="true" errorMsg={formValidationSupportTicketError["txtTicketCategory"]}>
                    <Form.InputControl
                      control="select"
                      name="txtTicketCategory"
                      value={formValuesTicketCreation.txtTicketCategory}
                      options={ticketCategoryList}
                      // A loader={isLoadingTicketCategoryList ? <Loader /> : null}
                      isLoading={isLoadingTicketCategoryList}
                      getOptionLabel={(option) => `${option.TicketCategoryName}`}
                      getOptionValue={(option) => `${option}`}
                      onChange={(e) => updateStateTicketCreation("txtTicketCategory", e)}
                    />
                  </Form.InputGroup>
                  {(formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
                    ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 51
                    : 0) ||
                  (formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
                    ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 52
                    : 0) ||
                  (formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
                    ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 53
                    : 0) ||
                  (formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
                    ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 58
                    : 0) ? (
                    <Form.InputGroup column={3} req="true" label="Other Sub Cat." errorMsg={formValidationSupportTicketError["txtOtherSubCategory"]}>
                      {/* <Form.InputControl
                        control="input"
                        type="text"
                        name="txtOtherSubCategory"
                        value={formValuesTicketCreation.txtOtherSubCategory}
                        onChange={(e) => updateStateTicketCreation(e.target.name, e.target.value)}
                      />
                    </Form.InputGroup> */}
                      <Form.InputControl
                        control="select"
                        name="txtOtherSubCategory"
                        value={formValuesTicketCreation.txtOtherSubCategory}
                        options={ticketCategoryOtherList}
                        isLoading={isLoadingTicketCategoryOtherList}
                        getOptionLabel={(option) => `${option.OtherCategoryName}`}
                        getOptionValue={(option) => `${option}`}
                        onChange={(e) => updateStateTicketCreation("txtOtherSubCategory", e)}
                      />
                    </Form.InputGroup>
                  ) : null}
                  {selectedOption === "4" ? (
                    <Form.InputGroup column={3} req="true" label="Crop Stage" errorMsg={formValidationSupportTicketError["txtCropStage"]}>
                      <Form.InputControl
                        control="select"
                        name="txtCropStage"
                        value={formValuesTicketCreation.txtCropStage}
                        options={cropStageList}
                        // A loader={isLoadingCropStageList ? <Loader /> : null}
                        isLoading={isLoadingCropStageList}
                        getOptionLabel={(option) => `${option.CropStageMaster}`}
                        getOptionValue={(option) => `${option}`}
                        onChange={(e) => updateStateTicketCreation("txtCropStage", e)}
                      />
                    </Form.InputGroup>
                  ) : null}
                  {selectedOption === "4" ? (
                    <Form.CustomGroup
                      column={4}
                      columntemplate={
                        (formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
                          ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 51
                          : 0) ||
                        (formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
                          ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 52
                          : 0) ||
                        (formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
                          ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 53
                          : 0) ||
                        (formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
                          ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 58
                          : 0)
                          ? "90px 110px 68px 110px 85px auto"
                          : selectedOptionCropStage === "2"
                          ? "75px 110px 60px 110px 85px auto"
                          : selectedOptionCropStage === "1"
                          ? "70px 110px 85px auto"
                          : null
                      }
                    >
                      {selectedOptionCropStage === "2" ? (
                        <Form.InputGroup label="Harvest Date" req="true" errorMsg={formValidationSupportTicketError["txtCropHarvestDate"]}>
                          <Form.InputControl
                            control="input"
                            type="date"
                            name="txtCropHarvestDate"
                            value={formValuesTicketCreation.txtCropHarvestDate}
                            onChange={(e) => updateStateTicketCreation(e.target.name, e.target.value)}
                            max={dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD")}
                            onKeyDown={(e) => e.preventDefault()}
                          />
                        </Form.InputGroup>
                      ) : null}
                      {selectedOptionCropStage === "2" || selectedOptionCropStage === "1" ? (
                        <Form.InputGroup label="Loss Date" req="true" errorMsg={formValidationSupportTicketError["txtCropLossDate"]}>
                          <Form.InputControl
                            control="input"
                            type="date"
                            name="txtCropLossDate"
                            value={formValuesTicketCreation.txtCropLossDate}
                            onChange={(e) => updateStateTicketCreation(e.target.name, e.target.value)}
                            min={dateToSpecificFormat(moment().subtract(1, "months"), "YYYY-MM-DD")}
                            max={dateToSpecificFormat(moment(), "YYYY-MM-DD")}
                            onKeyDown={(e) => e.preventDefault()}
                          />
                        </Form.InputGroup>
                      ) : null}
                      {selectedOptionCropStage === "2" || selectedOptionCropStage === "1" ? (
                        <Form.InputGroup label="">
                          <Form.InputControl
                            control="input"
                            type="text"
                            name="txtCropLossIntimation"
                            value={formValuesTicketCreation.txtCropLossIntimation}
                            onChange={(e) => updateStateTicketCreation(e.target.name, e.target.value)}
                            style={
                              stateCropLossIntimation === "YES" || stateCropLossIntimation === "NA"
                                ? { color: "#3f4254", background: "#ffffff" }
                                : { color: "#ffffff" }
                            }
                            className={
                              stateCropLossIntimation === "YES" || stateCropLossIntimation === "NA"
                                ? BizClass.disabledOnIntimationTextBox
                                : BizClass.disabledLateIntimationTextBox
                            }
                          />
                        </Form.InputGroup>
                      ) : null}
                      <Form.InputGroup label="" req={false} errorMsg={formValidationSupportTicketError["txtCropLossTime"]} style={{ display: "none" }}>
                        <Form.InputControl
                          control="input"
                          type="time"
                          name="txtCropLossTime"
                          value={formValuesTicketCreation.txtCropLossTime}
                          onChange={(e) => updateStateTicketCreation(e.target.name, e.target.value)}
                        />
                      </Form.InputGroup>
                    </Form.CustomGroup>
                  ) : null}
                  {selectedOption === "4" ? (
                    <Form.InputGroup column={3} req="true" errorMsg={formValidationSupportTicketError["txtCropName"]} label="Crop Name">
                      <Form.InputControl
                        control="input"
                        autoComplete="off"
                        name="txtCropName"
                        value={formValuesTicketCreation.txtCropName}
                        placeholder=""
                        onChange={(e) => updateStateTicketCreation(e.target.name, e.target.value)}
                      />
                    </Form.InputGroup>
                  ) : null}
                  <Form.InputGroup label="Description" req="true" column={3} row={11} errorMsg={formValidationSupportTicketError["txtTicketDescription"]}>
                    <Form.InputControl
                      control="textarea"
                      row="11"
                      maxLength="500"
                      name="txtTicketDescription"
                      value={formValuesTicketCreation.txtTicketDescription}
                      onChange={(e) => updateStateTicketCreation("txtTicketDescription", e.target.value)}
                    />
                    <p className={BizClass.CounterDesc}>
                      {formValuesTicketCreation.txtTicketDescription && formValuesTicketCreation.txtTicketDescription.length
                        ? formValuesTicketCreation.txtTicketDescription.length
                        : 0}{" "}
                      / {500}
                    </p>
                  </Form.InputGroup>
                </Form.Group>
                <div className={BizClass.ValidateFormFooter}>
                  <Button
                    className={isBtndisabled === 0 ? BizClass.FormFooterButton : classNames(BizClass.disableFormFooterButton, BizClass.FormFooterButton)}
                    disabled={isBtndisabled}
                    trigger={btnLoaderSupportTicketActive && "true"}
                    // A onClick={() => supportTicketOnClick(updateFarmersTickets, updateFarmersTicketsStatusCount, showfunc)}
                    onClick={() => supportTicketOnClick(updateFarmersTickets, showfunc)}
                  >
                    Submit
                  </Button>
                  <Button className={BizClass.FormFooterButton} onClick={() => clearAddTicketForm()}>
                    Clear
                  </Button>
                  <Button className={BizClass.FormFooterButton} onClick={() => showfunc()}>
                    Back
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddTicket;
AddTicket.propTypes = {
  showfunc: PropTypes.func.isRequired,
  updateFarmersTickets: PropTypes.func.isRequired,
  // A updateFarmersTicketsStatusCount: PropTypes.func.isRequired,
  openMyTicketPage: PropTypes.func.isRequired,
};

function FarmerListModal({ toggleModal, farmersData, onGridReady, onCellDoubleClicked, onChangeFarmersDetails }) {
  return (
    <Modal
      title={`Farmer List - Number Of Records(${farmersData && farmersData.length > 0 ? farmersData.length : 0})`}
      varient="bottom"
      show={toggleModal}
      width="100vw"
      right={0}
      height="60vh"
    >
      <Modal.Body>
        <div className={BizClass.ModalBox}>
          <PageBar>
            <PageBar.Search onChange={(e) => onChangeFarmersDetails(e.target.value)} />
          </PageBar>
          <DataGrid
            rowData={farmersData}
            onGridReady={onGridReady}
            rowSelection="single"
            suppressRowClickSelection="true"
            onCellDoubleClicked={(event) => onCellDoubleClicked(event)}
          >
            <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
            <DataGrid.Column field="mobile" headerName="Mobile No" width="120px" />
            <DataGrid.Column field="farmerName" headerName="Farmer Name" width="190px" />
            <DataGrid.Column field="relation" headerName="Relation" width="140px" />
            <DataGrid.Column field="relativeName" headerName="Relative Name" width="180px" />
            <DataGrid.Column field="resState" headerName="State Name" width="150px" />
            <DataGrid.Column field="resDistrict" headerName="District Name" width="140px" />
            <DataGrid.Column field="resVillage" headerName="Village Name" width="160px" />
            <DataGrid.Column
              field="policyPremium"
              headerName="Policy Premium"
              width="140px"
              cellRenderer={(node) => {
                return node.data && node.data.policyPremium ? parseFloat(node.data.policyPremium).toFixed(2) : null;
              }}
            />
            <DataGrid.Column
              field="policyArea"
              headerName="Policy Area"
              width="135px"
              cellRenderer={(node) => {
                return node.data && node.data.policyArea ? parseFloat(node.data.policyArea).toFixed(4) : null;
              }}
            />
            <DataGrid.Column
              field="#"
              headerName="Land Survey Number"
              width="180"
              cellRenderer={(node) => {
                return node.data.applicationList.length > 0 ? node.data.applicationList[0].landSurveyNumber : null;
              }}
            />
            <DataGrid.Column
              field="#"
              headerName="Land Division Number"
              width="180"
              cellRenderer={(node) => {
                return node.data.applicationList.length > 0 ? node.data.applicationList[0].landDivisionNumber : null;
              }}
            />
            <DataGrid.Column
              field="#"
              headerName="Application Status"
              width="190"
              cellRenderer={(node) => {
                return node.data.applicationList.length > 0 ? node.data.applicationList[0].applicationStatus : null;
              }}
            />
          </DataGrid>
        </div>
      </Modal.Body>
      <Modal.Footer />
    </Modal>
  );
}

FarmerListModal.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  farmersData: PropTypes.object.isRequired,
  onGridReady: PropTypes.func.isRequired,
  onCellDoubleClicked: PropTypes.func.isRequired,
  onChangeFarmersDetails: PropTypes.func.isRequired,
};

function InsuranceCompanyModal({
  toggleInsuranceCompanyModal,
  onCellDoubleClickedDetails,
  onGridReadySupportTicket,
  insuranceCompanyData,
  isLoadingApplicationNoData,
}) {
  return (
    <Modal title="Clam Information" varient="bottom" width="100vw" show={toggleInsuranceCompanyModal} right={0} height="60vh">
      <Modal.Body>
        <div className={BizClass.ModalBox}>
          <PageBar>
            <PageBar.Search />
          </PageBar>
          <DataGrid
            rowData={insuranceCompanyData}
            loader={isLoadingApplicationNoData ? <Loader /> : null}
            rowSelection="single"
            suppressRowClickSelection="true"
            onGridReady={onGridReadySupportTicket}
            onCellDoubleClicked={(event) => onCellDoubleClickedDetails(event)}
          >
            <DataGrid.Column field="insuranceCompanyName" headerName="Insurance Company" width="280px" />
            <DataGrid.Column field="farmerPremium" headerName="Farmer Premium" width="140px" />
            <DataGrid.Column field="policyID" headerName="Policy ID" width="160px" />
            <DataGrid.Column field="cropName" headerName="Crop Name" width="150px" />
            <DataGrid.Column field="area" headerName="Area in Hectare" width="140px" />
            <DataGrid.Column field="applicationNo" headerName="Application Number" width="170px" />
            <DataGrid.Column field="utrNumber" headerName="UTR Number" width="140px" />
            <DataGrid.Column field="amount" headerName="Claim Amount" width="135px" />
            <DataGrid.Column
              field="claimDate"
              headerName="Claim Date"
              width="115px"
              cellRenderer={(node) => {
                return dateFormatDDMMYY(node.data.claimDate);
              }}
            />
            <DataGrid.Column
              field="#"
              headerName="Mode Of Payment"
              width="150px"
              cellRenderer={(node) => {
                return node.data.modeOfPayment === 0 ? "Checks" : node.data.modeOfPayment === 1 ? "Mobile payments" : "Electronic bank transfers";
              }}
            />
            <DataGrid.Column
              field="#"
              headerName="Payment Account Type"
              width="190px"
              cellRenderer={(node) => {
                return node.data.paymentAccountType === 0 ? "Saving" : node.data.paymentAccountType === 1 ? "Current" : "NRI";
              }}
            />
            <DataGrid.Column
              field="#"
              headerName="Claim Type"
              width="195px"
              cellRenderer={(node) => {
                return node.data.typeOfClaim === 0
                  ? "Multiple Peril Crop Insurance"
                  : node.data.paymentAccountType === 1
                  ? "Actual Production History"
                  : "Crop Revenue Coverage";
              }}
            />
          </DataGrid>
        </div>
      </Modal.Body>
      <Modal.Footer />
    </Modal>
  );
}

InsuranceCompanyModal.propTypes = {
  toggleInsuranceCompanyModal: PropTypes.func.isRequired,
  onGridReadySupportTicket: PropTypes.func.isRequired,
  insuranceCompanyData: PropTypes.func.isRequired,
  isLoadingApplicationNoData: PropTypes.bool.isRequired,
  onCellDoubleClickedDetails: PropTypes.func.isRequired,
};

const actionTemplateGreivence = (props) => {
  return (
    <div style={{ display: "flex", gap: "4px", marginTop: "2px" }}>
      <CgFileDocument
        style={{ fontSize: "16px", color: "#000000", cursor: "pointer" }}
        onClick={() => props.toggleClaimStatusModal(props.data)}
        title="Cliam Status"
      />
    </div>
  );
};

function InsuranceCompanyModalGreivence({
  toggleInsuranceCompanyModalGreivence,
  onCellDoubleClickedDetailsGreivence,
  onGridReadySupportTicketGreivence,
  insuranceCompanyDataGreivence,
  isLoadingApplicationNoDataGreivence,
  getClaimStatusOnClick,
}) {
  const toggleClaimStatusModal = (data) => {
    getClaimStatusOnClick(data.applicationNo);
  };
  return (
    <Modal title="Grievance" varient="bottom" width="100vw" show={toggleInsuranceCompanyModalGreivence} right={0} height="60vh">
      <Modal.Body>
        <div className={BizClass.ModalBox}>
          <PageBar>
            <PageBar.Search />
          </PageBar>
          <DataGrid
            rowData={insuranceCompanyDataGreivence}
            loader={isLoadingApplicationNoDataGreivence ? <Loader /> : null}
            rowSelection="single"
            suppressRowClickSelection="true"
            onGridReady={onGridReadySupportTicketGreivence}
            onCellDoubleClicked={(event) => onCellDoubleClickedDetailsGreivence(event)}
            components={{
              actionTemplate: actionTemplateGreivence,
            }}
            tooltipShowDelay={500}
            tooltipMouseTrack={true}
            tooltipInteraction={true}
          >
            <DataGrid.Column
              headerName="Action"
              lockPosition="1"
              pinned="left"
              width={80}
              cellRenderer="actionTemplate"
              cellRendererParams={{
                toggleClaimStatusModal,
              }}
            />
            <DataGrid.Column field="insuranceCompanyName" headerName="Insurance Company Name" width="280px" headerTooltip="Name of the insurance company" />
            <DataGrid.Column
              field="policyID"
              headerName="Policy Number"
              width="180"
              headerTooltip="Policy no.: <scheme code><season code><state code><YY><Insurance policy>"
              // A cellRenderer={(node) => {
              // A  return node.data.applicationList.length > 0 ? node.data.applicationList[0].policyID : null;
              // A }}
            />
            <DataGrid.Column
              field="policyPremium"
              headerName="Total Premium"
              width="132px"
              headerTooltip="Total Premium of policy for all the applications against the policy"
            />
            <DataGrid.Column
              field="policyArea"
              headerName="Total Area"
              width="110px"
              headerTooltip="Total Area of policy in hectare, for all the applications against the policy"
            />
            <DataGrid.Column
              field="applicationNo"
              headerName="Application Number"
              width="170"
              headerTooltip="Application number against respective land and crop. It may be multiple against the same policy ID for different land"
              // A cellRenderer={(node) => {
              // A  return node.data.applicationList.length > 0 ? node.data.applicationList[0].applicationNo : null;
              // A  }}
            />
            <DataGrid.Column
              field="#"
              headerName="Scheme"
              width="275"
              headerTooltip="Scheme"
              cellRenderer={(node) => {
                return node.data.scheme === "WBCIS"
                  ? "Weather Based Crop Insurance Scheme(WBCIS)"
                  : node.data.scheme === "PMFBY"
                  ? "Pradhan Mantri Fasal Bima Yojna(PMFBY)"
                  : "";
              }}
            />
            <DataGrid.Column
              field="cropName"
              headerName="Crop Name"
              width="140"
              headerTooltip="Crop Covered for the particular application against the policy"
              // A cellRenderer={(node) => {
              // A  return node.data.applicationList.length > 0 ? node.data.applicationList[0].cropName : null;
              // A }}
            />
            <DataGrid.Column
              field="farmerShare"
              headerName="Premium Share"
              width="140"
              headerTooltip="Premium Share of particular Application"
              // A cellRenderer={(node) => {
              // A  return node.data.applicationList.length > 0 ? node.data.applicationList[0].farmerShare : null;
              // A }}
            />
            <DataGrid.Column
              field="cropShare"
              headerName="Area covered under Application"
              width="235"
              headerTooltip="sowing crop area in land"
              // A cellRenderer={(node) => {
              // A  return node.data.applicationList.length > 0 ? node.data.applicationList[0].cropShare : null;
              // A }}
            />
            <DataGrid.Column
              field="landSurveyNumber"
              headerName="Land Number"
              width="125"
              headerTooltip="Registered Number of Total Land (Khata Number)"
              // A cellRenderer={(node) => {
              // A  return node.data.applicationList.length > 0 ? node.data.applicationList[0].landSurveyNumber : null;
              // A }}
            />
            <DataGrid.Column
              field="landDivisionNumber"
              headerName="Division Number"
              width="140"
              headerTooltip="Division number against of that particular Land"
              // A cellRenderer={(node) => {
              // A  return node.data.applicationList.length > 0 ? node.data.applicationList[0].landDivisionNumber : null;
              // A }}
            />

            <DataGrid.Column
              field="applicationSource"
              headerName="Source"
              width="90"
              headerTooltip="Source of the application submitted by Farmer"
              // A cellRenderer={(node) => {
              // A  return node.data.applicationList.length > 0 ? node.data.applicationList[0].applicationSource : null;
              // A  }}
            />
            <DataGrid.Column
              field="applicationStatus"
              headerName="Application Status"
              width="190"
              headerTooltip="Status of the application submitted by farmer"
              // A cellRenderer={(node) => {
              // A  return node.data.applicationList.length > 0 ? node.data.applicationList[0].applicationStatus : null;
              // A }}
            />
          </DataGrid>
        </div>
      </Modal.Body>
      <Modal.Footer />
    </Modal>
  );
}

InsuranceCompanyModalGreivence.propTypes = {
  toggleInsuranceCompanyModalGreivence: PropTypes.func.isRequired,
  onGridReadySupportTicketGreivence: PropTypes.func.isRequired,
  insuranceCompanyDataGreivence: PropTypes.func.isRequired,
  isLoadingApplicationNoDataGreivence: PropTypes.bool.isRequired,
  onCellDoubleClickedDetailsGreivence: PropTypes.func.isRequired,
  getClaimStatusOnClick: PropTypes.func.isRequired,
};

const cellActionTemplate = (props) => {
  return (
    <div style={{ display: "flex", gap: "4px", marginTop: "2px" }}>
      <FcViewDetails
        style={{ fontSize: "16px", color: "#000000", cursor: "pointer" }}
        onClick={() => props.toggleSupportTicketDetailsModal(props.data)}
        title="Ticket Details"
      />
    </div>
  );
};
function TicketHistoryModal({
  toggleTicketHistoryModal,
  ticketHistoryData,
  selectedFarmer,
  onGridReadyTicketHistory,
  isLoadingTicketHistory,
  onChangeTicketHistory,
  openMyTicketPage,
}) {
  const toggleSupportTicketDetailsModal = (data) => {
    console.log(data);
    openMyTicketPage(data);
  };

  return (
    <Modal
      title={`Ticket History - ${selectedFarmer ? selectedFarmer.farmerName : ""}(${selectedFarmer ? selectedFarmer.mobile : ""})`}
      varient="bottom"
      width="94vw"
      show={toggleTicketHistoryModal}
      right={0}
      height="60vh"
    >
      <Modal.Body>
        <div className={BizClass.ModalBox}>
          <PageBar>
            <PageBar.Search onChange={(e) => onChangeTicketHistory(e.target.value)} />
          </PageBar>
          <DataGrid
            rowData={ticketHistoryData}
            loader={isLoadingTicketHistory ? <Loader /> : null}
            onGridReady={onGridReadyTicketHistory}
            components={{
              actionTemplate: cellActionTemplate,
            }}
          >
            <DataGrid.Column
              headerName="Action"
              lockPosition="1"
              pinned="left"
              width={80}
              cellRenderer="actionTemplate"
              cellRendererParams={{
                toggleSupportTicketDetailsModal,
              }}
            />
            <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
            <DataGrid.Column field="SupportTicketNo" headerName="Ticket No" width="150px" />
            <DataGrid.Column field="TicketStatus" headerName="Ticket Status" width="120px" />
            <DataGrid.Column field="TicketHeadName" headerName="Type" width="150px" />
            <DataGrid.Column field="TicketTypeName" headerName="Category" width="160px" />
            <DataGrid.Column field="TicketCategoryName" headerName="Sub Category" width="190px" />
            <DataGrid.Column field="CreatedBY" headerName="Created By" width="160px" />
            <DataGrid.Column
              field="#"
              headerName="Created At"
              width="125px"
              valueGetter={(node) => {
                // A return node.data.CreatedAt ? `${dateFormat(node.data.CreatedAt.split("T")[0])} ${tConvert(node.data.CreatedAt.split("T")[1])}` : null;
                return node.data.CreatedAt
                  ? dateToSpecificFormat(
                      `${node.data.CreatedAt.split("T")[0]} ${Convert24FourHourAndMinute(node.data.CreatedAt.split("T")[1])}`,
                      "DD-MM-YYYY HH:mm",
                    )
                  : null;
              }}
            />
            <DataGrid.Column field="InsuranceCompany" headerName="Insurance Company" width="290px" />
            <DataGrid.Column field="ApplicationNo" headerName="Application No" width="190px" />
            <DataGrid.Column field="InsurancePolicyNo" headerName="Policy No" width="160px" />
            <DataGrid.Column field="StateMasterName" headerName="State" width="160px" />
          </DataGrid>
        </div>
      </Modal.Body>
      <Modal.Footer />
    </Modal>
  );
}

TicketHistoryModal.propTypes = {
  toggleTicketHistoryModal: PropTypes.func.isRequired,
  selectedFarmer: PropTypes.object,
  ticketHistoryData: PropTypes.func.isRequired,
  onGridReadyTicketHistory: PropTypes.func.isRequired,
  isLoadingTicketHistory: PropTypes.bool.isRequired,
  onChangeTicketHistory: PropTypes.func.isRequired,
  openMyTicketPage: PropTypes.func.isRequired,
};

function ClaimStatusModal({
  toggleClaimStatusModal,
  onGridReadyClaimStatus,
  claimStatusData,
  onChangeClamStatus,
  isLoadingClaimStatusDataData,
  openCustomeWindow,
  OnClickCustomeWindow,
  customeWindowWidth,
  customeWindowHeight,
}) {
  return (
    <Modal
      title="Claim Status"
      varient="bottom"
      width={customeWindowWidth}
      show={toggleClaimStatusModal}
      left="90px"
      bottom="12.5px"
      height={customeWindowHeight}
    >
      <Modal.Header>
        <span style={{ width: "100%" }} />
        {openCustomeWindow === "S" ? (
          <AiOutlinePlusSquare title="Maximize The Window" style={{ cursor: "pointer", fontSize: "20px" }} onClick={() => OnClickCustomeWindow("S")} />
        ) : openCustomeWindow === "B" ? (
          <AiOutlineMinusSquare title="Minimize The Window" style={{ cursor: "pointer", fontSize: "20px" }} onClick={() => OnClickCustomeWindow("B")} />
        ) : null}
      </Modal.Header>
      <Modal.Body>
        <div className={BizClass.ModalBox}>
          <PageBar>
            <PageBar.Search onChange={(e) => onChangeClamStatus(e.target.value)} />
          </PageBar>
          <DataGrid
            rowData={claimStatusData}
            loader={isLoadingClaimStatusDataData ? <Loader /> : null}
            rowSelection="single"
            suppressRowClickSelection="true"
            onGridReady={onGridReadyClaimStatus}
          >
            <DataGrid.Column field="applicationNo" headerName="Application Number" width="175px" />
            <DataGrid.Column
              field="claimDate"
              headerName="Claim Date"
              width="115px"
              cellRenderer={(node) => {
                return dateFormatDDMMYY(node.data.claimDate);
              }}
            />
            <DataGrid.Column field="amount" headerName="Claim Amount" width="135px" />
            <DataGrid.Column field="ClaimType" headerName="Claim Type" width="150px" />
            <DataGrid.Column field="UtrNumber" headerName="UTR Number" width="140px" />
            <DataGrid.Column field="aadharPaymentAccountNumber" headerName="Payment To Account Number" width="220px" />
            <DataGrid.Column field="aadharPaymentBankName" headerName="Payment To Bank Name" width="220px" />
            <DataGrid.Column field="aadharPaymentFarmerName" headerName="Farmer Name" width="290px" />
            <DataGrid.Column
              field="aadharPaymentAadharNumber"
              headerName="Aadhar Number"
              width="140px"
              valueGetter={(node) => {
                return node.data.aadharPaymentAadharNumber ? node.data.aadharPaymentAadharNumber.replace(/.(?=.{4})/g, "x") : null;
              }}
            />
            <DataGrid.Column field="ClaimStatus" headerName="Claim Status" width="220px" />
            <DataGrid.Column field="paymentMode" headerName="Payment Mode" width="140px" />
            <DataGrid.Column field="Status" headerName="Status" width="155px" />
          </DataGrid>
        </div>
      </Modal.Body>
      <Modal.Footer />
    </Modal>
  );
}

ClaimStatusModal.propTypes = {
  toggleClaimStatusModal: PropTypes.func.isRequired,
  onGridReadyClaimStatus: PropTypes.func.isRequired,
  claimStatusData: PropTypes.func.isRequired,
  onChangeClamStatus: PropTypes.func.isRequired,
  isLoadingClaimStatusDataData: PropTypes.bool.isRequired,
  OnClickCustomeWindow: PropTypes.func.isRequired,
  openCustomeWindow: PropTypes.string,
  customeWindowWidth: PropTypes.string,
  customeWindowHeight: PropTypes.string,
};
