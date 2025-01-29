import React from "react";
import { Form, Modal } from "Framework/Components/Layout";
// Anil import { Button , Loader } from "Framework/Components/Widgets";
import { Button } from "Framework/Components/Widgets";
import PropTypes from "prop-types";
import AddRegionalOfficeMasterLogics from "./Logic/Logic";

// Anil function AddRegionalOfficeMaster({ showfunc, updateUserData, bankInsuranceTypeOptions }) {
function AddRegionalOfficeMaster({ showfunc, updateUserData }) {
  const {
    formValues,
    updateState,
    btnLoaderActive,
    formValidationError,
    // Anil BankMasterID,
    // Anil isLoadingBankType,
    // Anil InsuranceMasterID,
    // Anil isLoadingInsuranceType,
    handleSave,
    // Anil bankMasterDisabled,
    // Anil insuranceMasterDisabled,
  } = AddRegionalOfficeMasterLogics();

  return (
    <Modal varient="center" title="Add Regional Office Master" right="0" show={showfunc} onSubmit={(e) => handleSave(e, updateUserData)}>
      <Modal.Body>
        <Form>
          <Form.Group column="1" controlwidth="280px">
            <Form.InputGroup label="Regional Office " errorMsg={formValidationError["txtRegionOfficeName"]} req="true">
              <Form.InputControl
                control="input"
                type="text"
                maxLength="50"
                autoComplete="off"
                value={formValues.txtRegionOfficeName}
                name="txtRegionOfficeName"
                onChange={(e) => updateState("txtRegionOfficeName", e.target.value)}
              />
            </Form.InputGroup>
            {/* <Form.InputGroup label="Bank/Insurance" errorMsg={formValidationError["txtbankInsuranceMasterType"]} req="true">
              <Form.InputControl
                control="select"
                name="txtbankInsuranceMasterType"
                onChange={(e) => updateState("txtbankInsuranceMasterType", e)}
                value={formValues.txtbankInsuranceMasterType}
                options={bankInsuranceTypeOptions}
                getOptionLabel={(option) => `${option.Name}`}
                getOptionValue={(option) => `${option}`}
              />
            </Form.InputGroup> */}
            {/* {bankMasterDisabled === false ? (
              <Form.InputGroup label="Bank Master" errorMsg={formValidationError["txtBankMasterType"]}>
                <Form.InputControl
                  control="select"
                  name="txtBankMasterType"
                  loader={isLoadingBankType ? <Loader /> : null}
                  onChange={(e) => updateState("txtBankMasterType", e)}
                  value={formValues.txtBankMasterType}
                  options={BankMasterID}
                  getOptionLabel={(option) => `${option.CompanyName}`}
                  getOptionValue={(option) => `${option.CompanyID}`}
                />
              </Form.InputGroup>
            ) : insuranceMasterDisabled === false ? (
              <Form.InputGroup label="insurance Company" errorMsg={formValidationError["txtInsuranceMasterType"]}>
                <Form.InputControl
                  control="select"
                  name="txtInsuranceMasterType"
                  loader={isLoadingInsuranceType ? <Loader /> : null}
                  onChange={(e) => updateState("txtInsuranceMasterType", e)}
                  value={formValues.txtInsuranceMasterType}
                  options={InsuranceMasterID}
                  getOptionLabel={(option) => `${option.CompanyName}`}
                  getOptionValue={(option) => `${option.CompanyID}`}
                />
              </Form.InputGroup>
            ) : null} */}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" varient="secondary" trigger={btnLoaderActive}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddRegionalOfficeMaster;

AddRegionalOfficeMaster.propTypes = {
  showfunc: PropTypes.func.isRequired,
  updateUserData: PropTypes.func.isRequired,
  // Anil bankInsuranceTypeOptions: PropTypes.array,
};
