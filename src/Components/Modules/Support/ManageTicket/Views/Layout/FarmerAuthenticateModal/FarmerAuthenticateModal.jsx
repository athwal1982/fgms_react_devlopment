import React from "react";
import { Form, Modal } from "Framework/Components/Layout";
import { Button } from "Framework/Components/Widgets";
import PropTypes from "prop-types";
import FarmerAuthenticateLogics from "./Logic/Logic";

function FarmerAuthenticateModal({ showfunc, setFarmerAuthenticateModal, setfarmerAuthenticateDataList }) {
  const { authenticateMethod, setAuthenticateMethod, formValues, formValidationError, updateState, handleAuthenticate, btnloaderActive } =
    FarmerAuthenticateLogics();

  return (
    <Modal
      onSubmit={(e) => handleAuthenticate(e, setFarmerAuthenticateModal, setfarmerAuthenticateDataList)}
      varient="center"
      title="Authenticate Farmer"
      show={showfunc}
    >
      <Modal.Body>
        <Form>
          <Form.Group>
            <Button type="button" varient={authenticateMethod === "1" ? "secondary" : "grey"} onClick={() => setAuthenticateMethod("1")}>
              Mobile Number
            </Button>
            <Button type="button" varient={authenticateMethod === "2" ? "secondary" : "grey"} onClick={() => setAuthenticateMethod("2")}>
              Addhar Number
            </Button>
            {authenticateMethod === "1" && (
              <Form.InputGroup label="Mobile Number" errorMsg={formValidationError["txtMobileNumber"]}>
                <Form.InputControl
                  control="input"
                  type="text"
                  maxLength="10"
                  value={formValues.txtMobileNumber}
                  onChange={(e) => updateState("txtMobileNumber", e.target.value)}
                  focus="true"
                />
              </Form.InputGroup>
            )}
            {authenticateMethod === "2" && (
              <>
                <Form.InputGroup label="Account Number" errorMsg={formValidationError["txtAccountNumber"]}>
                  <Form.InputControl
                    control="input"
                    type="text"
                    maxLength="14"
                    value={formValues.txtAccountNumber}
                    onChange={(e) => updateState("txtAccountNumber", e.target.value)}
                  />
                </Form.InputGroup>
                <Form.InputGroup label="Aadhar Number" errorMsg={formValidationError["txtAadharNumber"]}>
                  <Form.InputControl
                    control="input"
                    type="text"
                    maxLength="4"
                    value={formValues.txtAadharNumber}
                    onChange={(e) => updateState("txtAadharNumber", e.target.value)}
                  />
                </Form.InputGroup>
              </>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" varient="secondary" trigger={btnloaderActive}>
          Validate
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default FarmerAuthenticateModal;

FarmerAuthenticateModal.propTypes = {
  showfunc: PropTypes.func.isRequired,
  setFarmerAuthenticateModal: PropTypes.bool,
  setfarmerAuthenticateDataList: PropTypes.array,
};
