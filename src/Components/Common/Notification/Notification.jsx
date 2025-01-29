import React from "react";
import { DataGrid, PageBar, Form, Modal } from "Framework/Components/Layout";
import { Loader, Button } from "Framework/Components/Widgets";
import PropTypes from "prop-types";
import BizClass from "./Notification.module.scss";
import NotificationLogics from "./Logic/Logic";

function Notification() {
  const {
    openModal,
    toggleModal,
    yearList,
    formValidationFarmersError,
    updateStateForByLocation,
    formValuesForByLocation,
    btnLoaderActive,
    lableTalukAnything,
    lableVillageForByLocation,
    stateForByLocationDropdownDataList,
    isLoadingStateForByLocationDropdownDataList,
    districtForByLocationDropdownDataList,
    isLoadingDistrictForByLocationDropdownDataList,
    subDistrictForByLocationDropdownDataList,
    isLoadingSubDistrictForByLocationDropdownDataList,
    villageForByLocationDropdownDataList,
    isLoadingVillageForByLocationDropdownDataList,
    seasonForPolicyNumberDropdownDataList,
    // A isLoadingSeasonPolicyNumberDropdownDataList,
    schemeList,
    // A isLoadingSchemeListDropdownDataList,
    onGridReady,
    getNotificationDataOnClick,
    notificationData,
    onChangeNotificationDetails,
    clearFormOnClick,
    lablelevel5,
    level5ByLocationDropdownDataList,
    isLoadinglevel5ByLocationDropdownDataList,
    lablelevel6,
    level6ByLocationDropdownDataList,
    isLoadinglevel6ByLocationDropdownDataList,
  } = NotificationLogics();
  return (
    <>
      {openModal && (
        <NotificationListModal
          toggleModal={toggleModal}
          notificationData={notificationData}
          onGridReady={onGridReady}
          onChangeNotificationDetails={onChangeNotificationDetails}
        />
      )}

      <div className={BizClass.PageStart}>
        <PageBar />
        <div className={BizClass.MainSection}>
          <div className={BizClass.ContentBox}>
            <div className={BizClass.FormHeading}>
              <h4>Notification</h4>
            </div>
            <div className={BizClass.ContentSection}>
              <div className={BizClass.FormBox}>
                <div className={BizClass.FormGroupBox}>
                  <Form.InputGroup label="Season" errorMsg={formValidationFarmersError["txtSeasonForLocation"]}>
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
                </div>
                <div className={BizClass.FormGroupBox}>
                  <Form.InputGroup label="Year" errorMsg={formValidationFarmersError["txtYearForLocation"]}>
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
                </div>
                <div className={BizClass.FormGroupBox}>
                  <Form.InputGroup label="Scheme" errorMsg={formValidationFarmersError["txtSchemeForLocation"]}>
                    <Form.InputControl
                      control="select"
                      name="txtSchemeForLocation"
                      value={formValuesForByLocation.txtSchemeForLocation}
                      /// A loader={isLoadingSchemeListDropdownDataList ? <Loader /> : null}
                      options={schemeList}
                      getOptionLabel={(option) => `${option.SchemeName}`}
                      getOptionValue={(option) => `${option}`}
                      onChange={(e) => updateStateForByLocation("txtSchemeForLocation", e)}
                    />
                  </Form.InputGroup>
                </div>
                <div className={BizClass.FormGroupBox}>
                  <Form.InputGroup label="State" errorMsg={formValidationFarmersError["txtStateForByLocation"]}>
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
                </div>
                <div className={BizClass.FormGroupBox}>
                  <Form.InputGroup label="District" errorMsg={formValidationFarmersError["txtDistrictForByLocation"]}>
                    <Form.InputControl
                      control="select"
                      name="txtDistrictForByLocation"
                      value={formValuesForByLocation.txtDistrictForByLocation}
                      options={districtForByLocationDropdownDataList}
                      // A loader={isLoadingDistrictForByLocationDropdownDataList ? <Loader /> : null}
                      isLoading={isLoadingDistrictForByLocationDropdownDataList}
                      getOptionLabel={(option) => `${option.level3Name}`}
                      getOptionValue={(option) => `${option}`}
                      onChange={(e) => updateStateForByLocation("txtDistrictForByLocation", e)}
                    />
                  </Form.InputGroup>
                </div>
                <div className={BizClass.FormGroupBox}>
                  <Form.InputGroup label={lableTalukAnything} errorMsg={formValidationFarmersError["txtSubDistrictForByLocation"]}>
                    <Form.InputControl
                      control="select"
                      name="txtSubDistrictForByLocation"
                      value={formValuesForByLocation.txtSubDistrictForByLocation}
                      options={subDistrictForByLocationDropdownDataList}
                      // A loader={isLoadingSubDistrictForByLocationDropdownDataList ? <Loader /> : null}
                      isLoading={isLoadingSubDistrictForByLocationDropdownDataList}
                      getOptionLabel={(option) => `${option.level4Name}`}
                      getOptionValue={(option) => `${option}`}
                      onChange={(e) => updateStateForByLocation("txtSubDistrictForByLocation", e)}
                    />
                  </Form.InputGroup>
                </div>
                <div className={BizClass.FormGroupBox}>
                  <Form.InputGroup label={lablelevel5} errorMsg={formValidationFarmersError["txtlevel5ByLocation"]}>
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
                </div>
                {lablelevel6 === null ? null : (
                  <div className={BizClass.FormGroupBox}>
                    <Form.InputGroup label={lablelevel6} errorMsg={formValidationFarmersError["txtlevel6ByLocation"]}>
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
                  </div>
                )}
                <div className={BizClass.FormGroupBox}>
                  <Form.InputGroup label={lableVillageForByLocation} errorMsg={formValidationFarmersError["txtVillageForByLocation"]}>
                    <Form.InputControl
                      control="select"
                      name="txtVillageForByLocation"
                      value={formValuesForByLocation.txtVillageForByLocation}
                      options={villageForByLocationDropdownDataList}
                      // A loader={isLoadingVillageForByLocationDropdownDataList ? <Loader /> : null}
                      isLoading={isLoadingVillageForByLocationDropdownDataList}
                      // A getOptionLabel={(option) => `${option.label}`}
                      getOptionLabel={(option) => `${option.level7Name}`}
                      getOptionValue={(option) => `${option}`}
                      onChange={(e) => updateStateForByLocation("txtVillageForByLocation", e)}
                    />
                  </Form.InputGroup>
                </div>
              </div>
            </div>
            <div className={BizClass.FooterSection}>
              <Button onClick={() => clearFormOnClick()}>Reset</Button>
              <Button trigger={btnLoaderActive && "true"} onClick={() => getNotificationDataOnClick()}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Notification;

function NotificationListModal({ toggleModal, notificationData, onGridReady, onChangeNotificationDetails }) {
  return (
    <Modal title="Notification" varient="bottom" show={toggleModal} width="100vw" right={0} height="60vh">
      <Modal.Body>
        <div className={BizClass.ModalBox}>
          <PageBar>
            <PageBar.Search onChange={(e) => onChangeNotificationDetails(e.target.value)} />
          </PageBar>
          <DataGrid rowData={notificationData} onGridReady={onGridReady} rowSelection="single" suppressRowClickSelection="true">
            <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
            <DataGrid.Column field="insuranceCompanyName" headerName="Insurance Company" width="270px" />
            <DataGrid.Column field="cropName" headerName="Crop Name" width="220px" />
            <DataGrid.Column field="sumInsured" headerName="Sum Insured" width="120px" />
            <DataGrid.Column
              field="premiumRate"
              headerName="Premium Rate"
              width="140px"
              cellRenderer={(node) => {
                return node.data && node.data.premiumRate ? parseFloat(node.data.premiumRate).toFixed(4) : null;
              }}
            />
            <DataGrid.Column field="farmerShare" headerName="Farmer Share" width="140px" />
            <DataGrid.Column
              field="goiShare"
              headerName="GoiShare"
              width="120px"
              cellRenderer={(node) => {
                return node.data && node.data.goiShare ? parseFloat(node.data.goiShare).toFixed(4) : null;
              }}
            />
            <DataGrid.Column
              field="stateShare"
              headerName="State Share"
              width="120px"
              cellRenderer={(node) => {
                return node.data && node.data.stateShare ? parseFloat(node.data.stateShare).toFixed(4) : null;
              }}
            />
            <DataGrid.Column field="unit" headerName="Unit" width="110px" />
            <DataGrid.Column field="cutOfDate" headerName="Cut of Date" width="110px" />
          </DataGrid>
        </div>
      </Modal.Body>
      <Modal.Footer />
    </Modal>
  );
}

NotificationListModal.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  notificationData: PropTypes.object.isRequired,
  onGridReady: PropTypes.func.isRequired,
  onChangeNotificationDetails: PropTypes.func.isRequired,
};
