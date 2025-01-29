import React from "react";
import classNames from "classnames";
import { Form } from "Framework/Components/Layout";
import { Loader, Button } from "Framework/Components/Widgets";
import { dateToSpecificFormat } from "Configration/Utilities/dateformat";
import moment from "moment";
import { PropTypes } from "prop-types";
import BizClass from "../FarmerEnquiryRegistration.module.scss";
import FarmerEnquiryRegistrationLogics from "../Logic/Logic";

function AddEnquiryForm({ OpenAddForm, enquiryGridApi }) {
  const {
    genderList,
    updateStateForByLocation,
    formValuesForByLocation,
    lableTalukAnything,
    lableVillageForByLocation,
    stateForByLocationDropdownDataList,
    isLoadingStateForByLocationDropdownDataList,
    cropForCalculatorDropdownDataList,
    isLoadingCropForCalculatorDropdownDataList,
    districtForByLocationDropdownDataList,
    isLoadingDistrictForByLocationDropdownDataList,
    subDistrictForByLocationDropdownDataList,
    isLoadingSubDistrictForByLocationDropdownDataList,
    seasonForPolicyNumberDropdownDataList,
    isLoadingSeasonPolicyNumberDropdownDataList,
    villageForByLocationDropdownDataList,
    isLoadingVillageForByLocationDropdownDataList,
    yearList,
    firstNameSelect,
    formValidationSupportTicketError,
    btnLoaderSupportTicketActive,
    supportTicketOnClick,
    farmerTypeDropdownDataList,
    isLoadingFarmerTypeDropdownDataList,
    casteTypeDropdownDataList,
    isLoadingCasteTypeDropdownDataList,
    farmerCategoryDropdownDataList,
    isLoadingFarmerCategoryDropdownDataList,
    relationShipDropdownDataList,
    isLoadingRelationShipDropdownDataList,
    isLoadingFarmerIDNoDropdownDataList,
    farmerIDNoDropdownDataList,
    schemeList,
    isLoadingSchemeListDropdownDataList,
    clearAddTicketForm,
    isBtndisabled,
    getCalculatorDataOnClick,
    formValuesMN,
    updateStateMN,
    validateFarmerOnClick,
    mobileNoSelect,
    formValidationFarmersError,
    btnLoaderActive,
    addFormActive,
    selectedTabEnqGreivCropLoss,
    selectedTabEnqGreivCropLossOnClick,
    ticketCategoryList,
    isLoadingTicketCategoryList,
    ticketCategoryTypeList,
    isLoadingTicketCategoryTypeList,
    selectedOptionCropStage,
    selectedOptionOnClickCropStage,
    lossAtList,
    isLoadingLossAtList,
    cropStageList,
    isLoadingCropStageList,
    chkNewOrExtingFarmer,
    isInsuranceCompanyNull,
    stateCropLossIntimation,
  } = FarmerEnquiryRegistrationLogics();
  return (
    <div className={BizClass.Box}>
      <div className={BizClass.Div}>
        <div className={BizClass.ValidateBox}>
          <div className={BizClass.ValidateTitle}>
            <h3>Farmer Enquiry</h3>
          </div>
          <div className={BizClass.ValidateContent}>
            <form className={BizClass.ValidateForm}>
              <div className={BizClass.ValidateInputGroup}>
                <div className={BizClass.Authentication_Header}>
                  <span>Enter Your Mobile Number</span>
                </div>
              </div>
              <div className={BizClass.ValidateControlGroup}>
                <label htmlFor="">Mobile No.</label>
                <Form.Group controlwidth="100%">
                  <Form.InputGroup column={3} errorMsg={formValidationFarmersError["txtValMobileNumber"]}>
                    <Form.InputControl
                      control="input"
                      name="txtValMobileNumber"
                      value={formValuesMN.txtValMobileNumber}
                      minLength={10}
                      maxLength={10}
                      onChange={(e) => updateStateMN("txtValMobileNumber", e.target.value)}
                      focus="true"
                      ref={mobileNoSelect}
                    />
                  </Form.InputGroup>
                </Form.Group>
              </div>
            </form>

            <div className={BizClass.ValidateFormFooter}>
              <Button
                className={chkNewOrExtingFarmer === "" ? BizClass.FormFooterButton : classNames(BizClass.disableFormFooterButton, BizClass.FormFooterButton)}
                trigger={btnLoaderActive && "true"}
                onClick={() => validateFarmerOnClick()}
              >
                Validate
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className={BizClass.Div}>
        {addFormActive === true ? (
          <div className={BizClass.FormDiv}>
            <div className={BizClass.InfoDiv}>
              <div className={BizClass.FarmerInfoDiv}>
                {/* <div className={BizClass.Title}>
                  <h3>Enquiry List</h3>
                </div> */}
                <div className={BizClass.EnqGreivCropLoss}>
                  <button
                    type="button"
                    className={
                      chkNewOrExtingFarmer === "NW" && isInsuranceCompanyNull === "YES"
                        ? BizClass.ActiveEnqGreivCropLossButton
                        : chkNewOrExtingFarmer === "OD" && isInsuranceCompanyNull === "NO"
                        ? classNames(BizClass.disableEnqGreivCropLoss, BizClass.EnqGreivCropLossButton)
                        : chkNewOrExtingFarmer === "OD" && isInsuranceCompanyNull === "YES"
                        ? BizClass.ActiveEnqGreivCropLossButton
                        : BizClass.ActiveEnqGreivCropLossButton
                    }
                    onClick={() => selectedTabEnqGreivCropLossOnClick("1")}
                  >
                    {" "}
                    Farmer
                  </button>
                  <button
                    type="button"
                    className={
                      chkNewOrExtingFarmer === "NW" && isInsuranceCompanyNull === "YES"
                        ? classNames(BizClass.disableEnqGreivCropLoss, BizClass.EnqGreivCropLossButton)
                        : chkNewOrExtingFarmer === "OD" && isInsuranceCompanyNull === "NO"
                        ? BizClass.ActiveEnqGreivCropLossButton
                        : chkNewOrExtingFarmer === "OD" && isInsuranceCompanyNull === "YES"
                        ? classNames(BizClass.disableEnqGreivCropLoss, BizClass.EnqGreivCropLossButton)
                        : BizClass.ActiveEnqGreivCropLossButton
                    }
                    onClick={() => selectedTabEnqGreivCropLossOnClick("2")}
                  >
                    {" "}
                    Grievance
                  </button>
                  <button
                    type="button"
                    className={
                      chkNewOrExtingFarmer === "NW" && isInsuranceCompanyNull === "YES"
                        ? classNames(BizClass.disableEnqGreivCropLoss, BizClass.EnqGreivCropLossButton)
                        : chkNewOrExtingFarmer === "OD" && isInsuranceCompanyNull === "NO"
                        ? BizClass.ActiveEnqGreivCropLossButton
                        : chkNewOrExtingFarmer === "OD" && isInsuranceCompanyNull === "YES"
                        ? classNames(BizClass.disableEnqGreivCropLoss, BizClass.EnqGreivCropLossButton)
                        : BizClass.ActiveEnqGreivCropLossButton
                    }
                    onClick={() => selectedTabEnqGreivCropLossOnClick("3")}
                  >
                    {" "}
                    Crop Loss Intimation
                  </button>
                </div>
                <div className={BizClass.CreationDiv}>
                  <div className={BizClass.Title}>
                    <h3>Caller Information</h3>
                  </div>
                </div>
                <div className={BizClass.Content}>
                  <Form.Group controlwidth="35%">
                    <Form.InputGroup label="Mobile No." req="true" column={1} errorMsg={formValidationSupportTicketError["txtCallerMobileNumber"]}>
                      <Form.InputControl
                        control="input"
                        name="txtCallerMobileNumber"
                        autoComplete="off"
                        value={formValuesForByLocation.txtCallerMobileNumber}
                        minLength={10}
                        maxLength={10}
                        onChange={(e) => updateStateForByLocation("txtCallerMobileNumber", e.target.value.replace(/\D/g, ""))}
                      />
                    </Form.InputGroup>
                  </Form.Group>
                </div>

                <div className={BizClass.Content}>
                  <div className={BizClass.Form_One}>
                    <Form.Group column={3} controlwidth="50%">
                      <Form.InputGroup label="Name" errorMsg={formValidationSupportTicketError["txtFarmerFullName"]} req="true">
                        <Form.InputControl
                          control="input"
                          label="Full Name"
                          name="txtFarmerFullName"
                          focus="true"
                          maxLength={30}
                          ref={firstNameSelect}
                          value={formValuesForByLocation.txtFarmerFullName}
                          onChange={(e) => updateStateForByLocation("txtFarmerFullName", e.target.value)}
                          disabled={chkNewOrExtingFarmer !== "NW"}
                        />
                      </Form.InputGroup>
                      <Form.InputGroup label="Mobile No" req="true" errorMsg={formValidationSupportTicketError["txtMobileNumber"]}>
                        <Form.InputControl
                          control="input"
                          name="txtMobileNumber"
                          value={formValuesForByLocation.txtMobileNumber}
                          minLength={10}
                          disabled={true}
                          maxLength={10}
                          onChange={(e) => updateStateForByLocation("txtMobileNumber", e.target.value)}
                        />
                      </Form.InputGroup>
                      <Form.InputGroup errorMsg={formValidationSupportTicketError["txtAge"]} style={{ display: "none" }}>
                        <Form.InputControl
                          control="input"
                          type="input"
                          name="txtAge"
                          value={formValuesForByLocation.txtAge}
                          maxLength={3}
                          onChange={(e) => updateStateForByLocation("txtAge", e.target.value.replace(/\D/g, ""))}
                        />{" "}
                        <p className={BizClass.Year}>Age</p>
                      </Form.InputGroup>

                      <Form.InputGroup req="true" label="Gender" errorMsg={formValidationSupportTicketError["txtGender"]}>
                        <Form.InputControl
                          control="select"
                          label="Select Gender"
                          prefix={false}
                          type="text"
                          name="txtGender"
                          options={genderList}
                          getOptionLabel={(option) => `${option.Name}`}
                          getOptionValue={(option) => `${option}`}
                          value={formValuesForByLocation.txtGender}
                          onChange={(e) => updateStateForByLocation("txtGender", e)}
                          isDisabled={chkNewOrExtingFarmer !== "NW"}
                        />
                      </Form.InputGroup>
                      <Form.InputGroup req="false" label="" errorMsg={formValidationSupportTicketError["txtRelationShipID"]} style={{ display: "none" }}>
                        <Form.InputControl
                          control="select"
                          type="text"
                          name="txtRelationShipID"
                          value={formValuesForByLocation.txtRelationShipID}
                          options={relationShipDropdownDataList}
                          loader={isLoadingRelationShipDropdownDataList ? <Loader /> : null}
                          getOptionLabel={(option) => `${option.CommonMasterValue}`}
                          getOptionValue={(option) => `${option}`}
                          onChange={(e) => updateStateForByLocation("txtRelationShipID", e)}
                        />
                      </Form.InputGroup>
                      <Form.InputGroup req="false" label="" errorMsg={formValidationSupportTicketError["txtRelationShip"]} style={{ display: "none" }}>
                        <Form.InputControl
                          control="input"
                          label="Relative Name"
                          maxLength={20}
                          name="txtRelationShip"
                          value={formValuesForByLocation.txtRelationShip}
                          onChange={(e) => updateStateForByLocation("txtRelationShip", e.target.value)}
                        />
                      </Form.InputGroup>
                      <Form.CustomGroup column={2} columntemplate="55px auto">
                        <Form.InputGroup req="false" column={1} label="" errorMsg={formValidationSupportTicketError["txtCasteID"]} style={{ display: "none" }}>
                          <Form.InputControl
                            control="select"
                            type="text"
                            prefix={false}
                            label="Select Caste"
                            name="txtCasteID"
                            value={formValuesForByLocation.txtCasteID}
                            options={casteTypeDropdownDataList}
                            loader={isLoadingCasteTypeDropdownDataList ? <Loader /> : null}
                            getOptionLabel={(option) => `${option.CommonMasterValue}`}
                            getOptionValue={(option) => `${option}`}
                            onChange={(e) => updateStateForByLocation("txtCasteID", e)}
                          />
                        </Form.InputGroup>
                      </Form.CustomGroup>
                    </Form.Group>
                  </div>
                  <Form.Group column={5} controlwidth="50%">
                    <Form.InputGroup req="true" column={3} label="State" errorMsg={formValidationSupportTicketError["txtStateForByLocation"]}>
                      <Form.InputControl
                        control="select"
                        prefix={false}
                        label="Select State"
                        type="text"
                        name="txtStateForByLocation"
                        value={formValuesForByLocation.txtStateForByLocation}
                        options={stateForByLocationDropdownDataList}
                        loader={isLoadingStateForByLocationDropdownDataList ? <Loader /> : null}
                        getOptionLabel={(option) => `${option.StateMasterName}`}
                        getOptionValue={(option) => `${option}`}
                        onChange={(e) => updateStateForByLocation("txtStateForByLocation", e)}
                        isDisabled={chkNewOrExtingFarmer !== "NW"}
                      />
                    </Form.InputGroup>
                    <Form.InputGroup req="true" label="District" column={2} errorMsg={formValidationSupportTicketError["txtDistrictForByLocation"]}>
                      <Form.InputControl
                        control="select"
                        type="text"
                        prefix={false}
                        label="Select District"
                        name="txtDistrictForByLocation"
                        value={formValuesForByLocation.txtDistrictForByLocation}
                        options={districtForByLocationDropdownDataList}
                        loader={isLoadingDistrictForByLocationDropdownDataList ? <Loader /> : null}
                        getOptionLabel={(option) => `${option.level3Name}`}
                        getOptionValue={(option) => `${option}`}
                        onChange={(e) => updateStateForByLocation("txtDistrictForByLocation", e)}
                        isDisabled={chkNewOrExtingFarmer !== "NW"}
                      />
                    </Form.InputGroup>
                    <Form.InputGroup req="true" label="Sub-District" column={2} errorMsg={formValidationSupportTicketError["txtSubDistrictForByLocation"]}>
                      <Form.InputControl
                        control="select"
                        type="text"
                        prefix={false}
                        label={lableTalukAnything}
                        name="txtSubDistrictForByLocation"
                        value={formValuesForByLocation.txtSubDistrictForByLocation}
                        options={subDistrictForByLocationDropdownDataList}
                        loader={isLoadingSubDistrictForByLocationDropdownDataList ? <Loader /> : null}
                        getOptionLabel={(option) => `${option.level4Name}`}
                        getOptionValue={(option) => `${option}`}
                        onChange={(e) => updateStateForByLocation("txtSubDistrictForByLocation", e)}
                        isDisabled={chkNewOrExtingFarmer !== "NW"}
                      />
                    </Form.InputGroup>
                    <Form.InputGroup req="true" label="Village" column={3} errorMsg={formValidationSupportTicketError["txtVillageForByLocation"]}>
                      <Form.InputControl
                        control="select"
                        type="text"
                        prefix={false}
                        label={lableVillageForByLocation}
                        name="txtVillageForByLocation"
                        value={formValuesForByLocation.txtVillageForByLocation}
                        options={villageForByLocationDropdownDataList}
                        loader={isLoadingVillageForByLocationDropdownDataList ? <Loader /> : null}
                        getOptionLabel={(option) => `${option.label}`}
                        getOptionValue={(option) => `${option}`}
                        onChange={(e) => updateStateForByLocation("txtVillageForByLocation", e)}
                        isDisabled={chkNewOrExtingFarmer !== "NW"}
                      />
                    </Form.InputGroup>
                    <Form.InputGroup column={5} label="Address">
                      <Form.InputControl
                        control="input"
                        name="txtAddress"
                        value={formValuesForByLocation.txtAddress}
                        onChange={(e) => updateStateForByLocation("txtAddress", e.target.value)}
                        disabled={chkNewOrExtingFarmer !== "NW"}
                      />
                    </Form.InputGroup>
                    <Form.InputGroup req="false" column={2} label="PinCode" errorMsg={formValidationSupportTicketError["txtPinCode"]}>
                      <Form.InputControl
                        control="input"
                        type="text"
                        name="txtPinCode"
                        value={formValuesForByLocation.txtPinCode}
                        maxLength={6}
                        minLength={6}
                        onChange={(e) => updateStateForByLocation("txtPinCode", e.target.value.replace(/\D/g, ""))}
                        disabled={chkNewOrExtingFarmer !== "NW"}
                      />
                    </Form.InputGroup>
                  </Form.Group>
                  <div className={BizClass.ContentDiv}>
                    <Form.Group column="3" controlwidth="50%">
                      <Form.InputGroup column={2} req="false" label="" errorMsg={formValidationSupportTicketError["txtYearForLocation"]}>
                        <Form.InputControl
                          control="select"
                          label="Year"
                          disabled={true}
                          name="txtYearForLocation"
                          value={formValuesForByLocation.txtYearForLocation}
                          options={yearList}
                          getOptionLabel={(option) => `${option.Name}`}
                          getOptionValue={(option) => `${option}`}
                          onChange={(e) => updateStateForByLocation("txtYearForLocation", e)}
                          isDisabled={isInsuranceCompanyNull === "YES " || selectedTabEnqGreivCropLoss !== "1"}
                        />
                      </Form.InputGroup>
                      <Form.InputGroup req="false" column={3} label="Season" errorMsg={formValidationSupportTicketError["txtSeasonForLocation"]}>
                        <Form.InputControl
                          control="select"
                          label="Season"
                          name="txtSeasonForLocation"
                          value={formValuesForByLocation.txtSeasonForLocation}
                          options={seasonForPolicyNumberDropdownDataList}
                          loader={isLoadingSeasonPolicyNumberDropdownDataList ? <Loader /> : null}
                          getOptionLabel={(option) => `${option.CropSeasonName}`}
                          getOptionValue={(option) => `${option}`}
                          onChange={(e) => updateStateForByLocation("txtSeasonForLocation", e)}
                          isDisabled={isInsuranceCompanyNull === "YES " || selectedTabEnqGreivCropLoss !== "1"}
                        />
                      </Form.InputGroup>
                      <Form.InputGroup req="false" column={4} label="" errorMsg={formValidationSupportTicketError["txtSchemeForLocation"]}>
                        <Form.InputControl
                          control="select"
                          label="Scheme"
                          name="txtSchemeForLocation"
                          value={formValuesForByLocation.txtSchemeForLocation}
                          loader={isLoadingSchemeListDropdownDataList ? <Loader /> : null}
                          options={schemeList}
                          getOptionLabel={(option) => `${option.SchemeName}`}
                          getOptionValue={(option) => `${option}`}
                          onChange={(e) => updateStateForByLocation("txtSchemeForLocation", e)}
                          isDisabled={isInsuranceCompanyNull === "YES " || selectedTabEnqGreivCropLoss !== "1"}
                        />
                      </Form.InputGroup>
                      <Form.InputGroup req="false" label="Crop" errorMsg={formValidationSupportTicketError["txtCropForCalculate"]}>
                        <Form.InputControl
                          control="select"
                          name="txtCropForCalculate"
                          value={formValuesForByLocation.txtCropForCalculate}
                          options={cropForCalculatorDropdownDataList}
                          isLoading={isLoadingCropForCalculatorDropdownDataList}
                          getOptionLabel={(option) => `${option.cropName}`}
                          getOptionValue={(option) => `${option}`}
                          onChange={(e) => updateStateForByLocation("txtCropForCalculate", e)}
                          isDisabled={isInsuranceCompanyNull === "YES " || selectedTabEnqGreivCropLoss !== "1"}
                        />
                      </Form.InputGroup>

                      <Form.InputGroup label="Insurance Company" col={1}>
                        <p className={BizClass.ContentPresenter}>
                          {formValuesForByLocation.txtCropForCalculate && formValuesForByLocation.txtCropForCalculate.insuranceCompanyName
                            ? formValuesForByLocation.txtCropForCalculate.insuranceCompanyName
                            : ""}
                        </p>
                      </Form.InputGroup>
                      <Form.InputGroup label="Area In Hectare" errorMsg={formValidationSupportTicketError["txtAreaInHectareForCalculator"]} req="false" col={1}>
                        <Form.InputControl
                          control="input"
                          maxlength="6"
                          minlength="3"
                          type="text"
                          name="txtAreaInHectareForCalculator"
                          value={formValuesForByLocation.txtAreaInHectareForCalculator}
                          onChange={(e) => updateStateForByLocation("txtAreaInHectareForCalculator", e.target.value)}
                          onBlur={(e) => getCalculatorDataOnClick(e.target.value)}
                          disabled={isInsuranceCompanyNull === "YES " || selectedTabEnqGreivCropLoss !== "1"}
                        />
                      </Form.InputGroup>
                      <Form.InputGroup label="Premiums">
                        <p className={BizClass.ContentPresenter}>
                          {formValuesForByLocation.CalculatedSumInsured && formValuesForByLocation.CalculatedSumInsured
                            ? formValuesForByLocation.CalculatedSumInsured
                            : ""}
                        </p>
                      </Form.InputGroup>
                    </Form.Group>
                  </div>
                </div>
              </div>
              <div className={BizClass.CreationDiv}>
                <div className={BizClass.Title}>
                  <h3>Enquiry Creation</h3>
                </div>
                <div className={BizClass.Content}>
                  <Form.Group column="4" controlwidth="100%">
                    <Form.InputGroup req="false" label="" column={2} errorMsg={formValidationSupportTicketError["txtFarmerTypeID"]} style={{ display: "none" }}>
                      <Form.InputControl
                        control="select"
                        label="Farmer Type "
                        name="txtFarmerTypeID"
                        value={formValuesForByLocation.txtFarmerTypeID}
                        options={farmerTypeDropdownDataList}
                        loader={isLoadingFarmerTypeDropdownDataList ? <Loader /> : null}
                        getOptionLabel={(option) => `${option.CommonMasterValue}`}
                        getOptionValue={(option) => `${option}`}
                        onChange={(e) => updateStateForByLocation("txtFarmerTypeID", e)}
                      />
                    </Form.InputGroup>
                    <Form.InputGroup
                      req="false"
                      label=""
                      column={2}
                      errorMsg={formValidationSupportTicketError["txtFarmerCategoryID"]}
                      style={{ display: "none" }}
                    >
                      <Form.InputControl
                        control="select"
                        label="Farmer Category "
                        name="txtFarmerCategoryID"
                        value={formValuesForByLocation.txtFarmerCategoryID}
                        options={farmerCategoryDropdownDataList}
                        loader={isLoadingFarmerCategoryDropdownDataList ? <Loader /> : null}
                        getOptionLabel={(option) => `${option.CommonMasterValue}`}
                        getOptionValue={(option) => `${option}`}
                        onChange={(e) => updateStateForByLocation("txtFarmerCategoryID", e)}
                      />
                    </Form.InputGroup>
                    <Form.InputGroup column={2} errorMsg={formValidationSupportTicketError["txtFarmerIDNo"]} style={{ display: "none" }}>
                      <Form.InputControl
                        control="select"
                        name="txtFarmerIDNo"
                        label="ID Type  "
                        value={formValuesForByLocation.txtFarmerIDNo}
                        options={farmerIDNoDropdownDataList}
                        loader={isLoadingFarmerIDNoDropdownDataList ? <Loader /> : null}
                        getOptionLabel={(option) => `${option.CommonMasterValue}`}
                        getOptionValue={(option) => `${option}`}
                        onChange={(e) => updateStateForByLocation("txtFarmerIDNo", e)}
                      />
                    </Form.InputGroup>
                    <Form.InputGroup column={2} errorMsg={formValidationSupportTicketError["txtFarmerIDNoValue"]} style={{ display: "none" }}>
                      <Form.InputControl
                        control="input"
                        label="Enter Last 4 Digits of your Aadhar NO"
                        maxLength="4"
                        type="text"
                        name="txtFarmerIDNoValue"
                        value={formValuesForByLocation.txtFarmerIDNoValue}
                        onChange={(e) => updateStateForByLocation("txtFarmerIDNoValue", e.target.value.replace(/\D/g, ""))}
                      />
                    </Form.InputGroup>
                    {selectedTabEnqGreivCropLoss === "3" ? (
                      <Form.InputGroup label="" errorMsg="" column={4}>
                        <ul className={BizClass.ValidateTabGroup}>
                          {(formValuesForByLocation.txtTicketCategory && formValuesForByLocation.txtTicketCategory.TicketCategoryID
                            ? formValuesForByLocation.txtTicketCategory.TicketCategoryID === 51
                            : 0) ||
                          (formValuesForByLocation.txtTicketCategory && formValuesForByLocation.txtTicketCategory.TicketCategoryID
                            ? formValuesForByLocation.txtTicketCategory.TicketCategoryID === 52
                            : 0) ||
                          (formValuesForByLocation.txtTicketCategory && formValuesForByLocation.txtTicketCategory.TicketCategoryID
                            ? formValuesForByLocation.txtTicketCategory.TicketCategoryID === 53
                            : 0) ||
                          (formValuesForByLocation.txtTicketCategory && formValuesForByLocation.txtTicketCategory.TicketCategoryID
                            ? formValuesForByLocation.txtTicketCategory.TicketCategoryID === 58
                            : 0) ? (
                            <button type="button" style={{ border: "none", width: "90px" }} />
                          ) : selectedOptionCropStage === "2" || selectedOptionCropStage === "1" ? (
                            <button type="button" style={{ border: "none", width: "80px" }} />
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
                    {selectedTabEnqGreivCropLoss === "3" ? (
                      <Form.InputGroup column={3} label="Loss At" errorMsg={formValidationSupportTicketError["txtLossAt"]}>
                        <Form.InputControl
                          control="select"
                          name="txtLossAt"
                          value={formValuesForByLocation.txtLossAt}
                          options={lossAtList}
                          loader={isLoadingLossAtList ? <Loader /> : null}
                          getOptionLabel={(option) => `${option.CropStageSelection}`}
                          getOptionValue={(option) => `${option}`}
                          onChange={(e) => updateStateForByLocation("txtLossAt", e)}
                        />
                      </Form.InputGroup>
                    ) : null}
                    {selectedTabEnqGreivCropLoss === "2" || selectedTabEnqGreivCropLoss === "3" ? (
                      <>
                        <Form.InputGroup label="Category" column={3} errorMsg={formValidationSupportTicketError["txtTicketCategoryType"]}>
                          <Form.InputControl
                            control="select"
                            name="txtTicketCategoryType"
                            value={formValuesForByLocation.txtTicketCategoryType}
                            options={ticketCategoryTypeList}
                            loader={isLoadingTicketCategoryTypeList ? <Loader /> : null}
                            getOptionLabel={(option) => `${option.SupportTicketTypeName}`}
                            getOptionValue={(option) => `${option}`}
                            onChange={(e) => updateStateForByLocation("txtTicketCategoryType", e)}
                          />
                        </Form.InputGroup>
                        <Form.InputGroup label="Sub Category" column={3} errorMsg={formValidationSupportTicketError["txtTicketCategory"]}>
                          <Form.InputControl
                            control="select"
                            name="txtTicketCategory"
                            value={formValuesForByLocation.txtTicketCategory}
                            options={ticketCategoryList}
                            loader={isLoadingTicketCategoryList ? <Loader /> : null}
                            getOptionLabel={(option) => `${option.TicketCategoryName}`}
                            getOptionValue={(option) => `${option}`}
                            onChange={(e) => updateStateForByLocation("txtTicketCategory", e)}
                          />
                        </Form.InputGroup>{" "}
                      </>
                    ) : null}
                    {(formValuesForByLocation.txtTicketCategory && formValuesForByLocation.txtTicketCategory.TicketCategoryID
                      ? formValuesForByLocation.txtTicketCategory.TicketCategoryID === 51
                      : 0) ||
                    (formValuesForByLocation.txtTicketCategory && formValuesForByLocation.txtTicketCategory.TicketCategoryID
                      ? formValuesForByLocation.txtTicketCategory.TicketCategoryID === 52
                      : 0) ||
                    (formValuesForByLocation.txtTicketCategory && formValuesForByLocation.txtTicketCategory.TicketCategoryID
                      ? formValuesForByLocation.txtTicketCategory.TicketCategoryID === 53
                      : 0) ||
                    (formValuesForByLocation.txtTicketCategory && formValuesForByLocation.txtTicketCategory.TicketCategoryID
                      ? formValuesForByLocation.txtTicketCategory.TicketCategoryID === 58
                      : 0) ? (
                      <Form.InputGroup column={7} label="Other Sub Cat." errorMsg={formValidationSupportTicketError["txtOtherSubCategory"]}>
                        <Form.InputControl
                          control="input"
                          type="text"
                          name="txtOtherSubCategory"
                          value={formValuesForByLocation.txtOtherSubCategory}
                          onChange={(e) => updateStateForByLocation(e.target.name, e.target.value)}
                        />
                      </Form.InputGroup>
                    ) : null}
                    {selectedTabEnqGreivCropLoss === "3" ? (
                      <Form.InputGroup column={7} label="Crop Stage" errorMsg={formValidationSupportTicketError["txtCropStage"]}>
                        <Form.InputControl
                          control="select"
                          name="txtCropStage"
                          value={formValuesForByLocation.txtCropStage}
                          options={cropStageList}
                          loader={isLoadingCropStageList ? <Loader /> : null}
                          getOptionLabel={(option) => `${option.CropStageMaster}`}
                          getOptionValue={(option) => `${option}`}
                          onChange={(e) => updateStateForByLocation("txtCropStage", e)}
                        />
                      </Form.InputGroup>
                    ) : null}
                    <Form.CustomGroup
                      column={8}
                      columntemplate={
                        (formValuesForByLocation.txtTicketCategory && formValuesForByLocation.txtTicketCategory.TicketCategoryID
                          ? formValuesForByLocation.txtTicketCategory.TicketCategoryID === 51
                          : 0) ||
                        (formValuesForByLocation.txtTicketCategory && formValuesForByLocation.txtTicketCategory.TicketCategoryID
                          ? formValuesForByLocation.txtTicketCategory.TicketCategoryID === 52
                          : 0) ||
                        (formValuesForByLocation.txtTicketCategory && formValuesForByLocation.txtTicketCategory.TicketCategoryID
                          ? formValuesForByLocation.txtTicketCategory.TicketCategoryID === 53
                          : 0) ||
                        (formValuesForByLocation.txtTicketCategory && formValuesForByLocation.txtTicketCategory.TicketCategoryID
                          ? formValuesForByLocation.txtTicketCategory.TicketCategoryID === 58
                          : 0)
                          ? "90px 110px 68px 110px 85px auto"
                          : selectedOptionCropStage === "2"
                          ? "81px 110px 60px 110px 85px auto"
                          : selectedOptionCropStage === "1"
                          ? "81px 110px 85px auto"
                          : null
                      }
                    >
                      {selectedTabEnqGreivCropLoss === "3" ? (
                        <>
                          {selectedOptionCropStage === "2" ? (
                            <Form.InputGroup label="Harvest Date" req={true} errorMsg={formValidationSupportTicketError["txtCropHarvestDate"]}>
                              <Form.InputControl
                                control="input"
                                type="date"
                                name="txtCropHarvestDate"
                                value={formValuesForByLocation.txtCropHarvestDate}
                                onChange={(e) => updateStateForByLocation(e.target.name, e.target.value)}
                                max={dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD")}
                                onKeyDown={(e) => e.preventDefault()}
                              />
                            </Form.InputGroup>
                          ) : null}
                          {selectedOptionCropStage === "2" || selectedOptionCropStage === "1" ? (
                            <>
                              <Form.InputGroup label="Loss Date" req={true} errorMsg={formValidationSupportTicketError["txtCropLossDate"]}>
                                <Form.InputControl
                                  control="input"
                                  type="date"
                                  name="txtCropLossDate"
                                  value={formValuesForByLocation.txtCropLossDate}
                                  onChange={(e) => updateStateForByLocation(e.target.name, e.target.value)}
                                  max={dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD")}
                                  onKeyDown={(e) => e.preventDefault()}
                                />
                              </Form.InputGroup>
                              <Form.InputGroup label="">
                                <Form.InputControl
                                  control="input"
                                  type="text"
                                  name="txtCropLossIntimation"
                                  value={formValuesForByLocation.txtCropLossIntimation}
                                  onChange={(e) => updateStateForByLocation(e.target.name, e.target.value)}
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
                            </>
                          ) : null}
                        </>
                      ) : null}
                    </Form.CustomGroup>
                    <Form.InputGroup label="Description" req="true" column={7} row={12} errorMsg={formValidationSupportTicketError["txtTicketDescription"]}>
                      <Form.InputControl
                        control="textarea"
                        row="12"
                        maxLength="500"
                        name="txtTicketDescription"
                        value={formValuesForByLocation.txtTicketDescription}
                        onChange={(e) => updateStateForByLocation("txtTicketDescription", e.target.value)}
                        disabled={selectedTabEnqGreivCropLoss !== "1" && isInsuranceCompanyNull === "YES"}
                      />
                    </Form.InputGroup>
                  </Form.Group>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={BizClass.Div}>
            <div className={BizClass.InfoDiv}>
              <div className={BizClass.FarmerInfoDiv}>
                <div className={BizClass.Title}>
                  <h3>Farmer Information</h3>
                </div>
                <div className={BizClass.Content}>
                  <div className={BizClass.ContentDiv}>
                    <SkaletonForm />
                  </div>
                </div>
              </div>
              <div className={BizClass.CreationDiv}>
                <div className={BizClass.Title}>
                  <h3>Ticket Creation</h3>
                </div>
                <div className={BizClass.Content}>
                  <SkaletonForm />
                </div>
              </div>
            </div>
          </div>
        )}
        <div className={BizClass.ValidateFormFooterRight}>
          {addFormActive ? (
            <>
              {" "}
              <Button
                className={BizClass.FormFooterButton}
                disabled={isBtndisabled}
                trigger={btnLoaderSupportTicketActive && "true"}
                onClick={() => supportTicketOnClick(enquiryGridApi)}
              >
                Save{" "}
              </Button>
              <Button className={BizClass.FormFooterButton} onClick={() => clearAddTicketForm()}>
                Clear
              </Button>
            </>
          ) : (
            ""
          )}

          <Button className={BizClass.FormFooterButton} onClick={OpenAddForm}>
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
export default AddEnquiryForm;

function SkaletonForm() {
  return (
    <div className={BizClass.SkaletonForm}>
      <div className={BizClass.InformationSkaleton}>
        <Skaleton />
        <Skaleton />
        <Skaleton />
        <Skaleton />
        <Skaleton />
        <Skaleton />
      </div>
      <div className={BizClass.TicketSkaleton} />
    </div>
  );
}

function Skaleton() {
  return (
    <div className={BizClass.Data}>
      <span className={BizClass.Id} />
      <span className={BizClass.Contents} />
    </div>
  );
}

AddEnquiryForm.propTypes = {
  OpenAddForm: PropTypes.func.isRequired,
  updateFarmersTicketsStatusCount: PropTypes.object,
  updateFarmersTickets: PropTypes.object,
  enquiryGridApi: PropTypes.object,
};
