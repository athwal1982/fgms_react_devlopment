import { React, useState } from "react";
import { Form, Modal } from "Framework/Components/Layout";
import { Button, Loader } from "Framework/Components/Widgets";
import { FaInfoCircle } from "react-icons/fa";
import PropTypes from "prop-types";
import BizClass from "./AddUser.module.scss";
import AddUserLogics from "./Logic/Logics";

function AddUser({ showfunc, referenceTypeOptions, updateUserData }) {
  const {
    formValues,
    isLoadingSelectedState,
    selectedState,
    updateState,
    handleSave,
    isLoadingBrHeadType,
    BrHeadType,
    btnLoaderActive,
    formValidationError,
    isLoadingReferenceType,
    referenceType,
    lblUserReference,
    userType,
    isLoadingUserType,
    disableBRHeadType,
    isLoadingLocationType,
    filterLocationType,
  } = AddUserLogics();

  const [isPopupVisible, setPopupVisible] = useState(false);
  const handleIconHoverPass = () => {
    setPopupVisible(true);
  };

  const handleIconUnhoverPass = () => {
    setPopupVisible(false);
  };

  return (
    <>
      {isPopupVisible && (
        <div className={BizClass.PasswordPolicyDiv}>
          <h1 style={{ fontSize: "18px", textDecoration: "underline", paddingBottom: "8px" }}>Password Policy</h1>
          <p>1. The length of password should be minimum 8 characters or maximum 16 characters.</p>
          <p style={{ paddingBottom: "5px" }}>
            2. The password shall be case sensitive and should contain at least one each of the following characters with no space:
            <br />
          </p>
          <p style={{ paddingLeft: "10px" }}>
            1. Uppercase: A to Z
            <br />
            2. Lowercase: a to z
            <br />
            3. Digit: 0 to 9
            <br />
            4. Non-Alphanumeric: Special characters @ # $ % & * / \
          </p>
        </div>
      )}
      <Modal onSubmit={(e) => handleSave(e, updateUserData)} varient="center" title="Add User" show={showfunc} right="0">
        <Modal.Body>
          <Form>
            <Form.Group column={2} controlwidth="280px">
              <Form.InputGroup label="Display Name" errorMsg={formValidationError["txtDisplayName"]} req="true">
                <Form.InputControl
                  control="input"
                  type="text"
                  maxLength="20"
                  autoComplete="off"
                  value={formValues.txtDisplayName}
                  name="txtDisplayName"
                  onChange={(e) => updateState("txtDisplayName", e.target.value)}
                />
              </Form.InputGroup>
              <Form.InputGroup label="Login Name" errorMsg={formValidationError["txtLoginName"]} req="true">
                <Form.InputControl
                  control="input"
                  type="text"
                  maxLength="20"
                  autoComplete="off"
                  value={formValues.txtLoginName}
                  name="txtLoginName"
                  onChange={(e) => updateState("txtLoginName", e.target.value)}
                />
              </Form.InputGroup>
              <Form.InputGroup label="Password" errorMsg={formValidationError["txtPassword"]} req="true">
                <Form.InputControl
                  control="input"
                  type="password"
                  autoComplete="new-password"
                  value={formValues.txtPassword}
                  name="txtPassword"
                  onChange={(e) => updateState("txtPassword", e.target.value)}
                />
                <FaInfoCircle onMouseOver={() => handleIconHoverPass()} onMouseOut={() => handleIconUnhoverPass()} />
              </Form.InputGroup>
              <Form.InputGroup label="Email ID" errorMsg={formValidationError["txtEmailID"]} req="false">
                <Form.InputControl
                  control="input"
                  type="text"
                  autoComplete="off"
                  value={formValues.txtEmailID}
                  name="txtEmailID"
                  onChange={(e) => updateState("txtEmailID", e.target.value)}
                />
              </Form.InputGroup>
              <Form.InputGroup label="Mobile No" errorMsg={formValidationError["txtMobileNo"]} req="true">
                <Form.InputControl
                  control="input"
                  type="text"
                  minLength="10"
                  maxLength="10"
                  autoComplete="off"
                  value={formValues.txtMobileNo}
                  name="txtMobileNo"
                  onChange={(e) => updateState("txtMobileNo", e.target.value)}
                />
              </Form.InputGroup>
              <Form.InputGroup label="User Type" errorMsg={formValidationError["txtUserType"]} req="true">
                <Form.InputControl
                  control="select"
                  name="txtUserType"
                  loader={isLoadingUserType ? <Loader /> : null}
                  onChange={(e) => updateState("txtUserType", e)}
                  value={formValues.txtUserType}
                  options={userType}
                  getOptionLabel={(option) => `${option.AppAccessName}`}
                  getOptionValue={(option) => `${option}`}
                />
              </Form.InputGroup>

              <Form.InputGroup label="" errorMsg={formValidationError["txtReferenceType"]} req="true" style={{ display: "none" }}>
                <Form.InputControl
                  control="select"
                  name="txtReferenceType"
                  onChange={(e) => updateState("txtReferenceType", e)}
                  value={formValues.txtReferenceType}
                  options={referenceTypeOptions}
                  getOptionLabel={(option) => `${option.Name}`}
                  getOptionValue={(option) => `${option}`}
                />
              </Form.InputGroup>
              <Form.InputGroup label="BR Head Type" errorMsg={formValidationError["txtBRHeadType"]}>
                <Form.InputControl
                  control="select"
                  name="txtBRHeadType"
                  isDisabled={disableBRHeadType}
                  loader={isLoadingBrHeadType ? <Loader /> : null}
                  onChange={(e) => updateState("txtBRHeadType", e)}
                  value={formValues.txtBRHeadType}
                  options={BrHeadType}
                  getOptionLabel={(option) => `${option.CommonMasterValue}`}
                  getOptionValue={(option) => `${option}`}
                />
              </Form.InputGroup>
              {formValues.txtBRHeadType && formValues.txtBRHeadType.BMCGCode.toString() === "124003" ? (
                <Form.InputGroup label={lblUserReference} errorMsg={formValidationError["txtUserReference"]}>
                  <Form.InputControl
                    control="select"
                    name="txtUserReference"
                    onChange={(e) => updateState("txtUserReference", e)}
                    loader={isLoadingReferenceType ? <Loader /> : null}
                    value={formValues.txtUserReference}
                    options={referenceType}
                    getOptionLabel={(option) => `${option.CompanyName}`}
                    getOptionValue={(option) => `${option}`}
                  />
                </Form.InputGroup>
              ) : null}
              <Form.InputGroup label="Location Type" errorMsg={formValidationError["txtLocationType"]} req="true">
                <Form.InputControl
                  control="select"
                  name="txtLocationType"
                  loader={isLoadingLocationType ? <Loader /> : null}
                  onChange={(e) => updateState("txtLocationType", e)}
                  value={formValues.txtLocationType}
                  options={filterLocationType}
                  getOptionLabel={(option) => `${option.LocationMasterName}`}
                  getOptionValue={(option) => `${option}`}
                />
              </Form.InputGroup>

              {formValues.txtBRHeadType &&
              formValues.txtBRHeadType.BMCGCode.toString() === "124005" &&
              formValues.txtUserType &&
              formValues.txtUserType.AppAccessTypeID.toString() === "999" ? (
                <Form.InputGroup label="State" errorMsg={formValidationError["txtState"]} req="true">
                  <Form.InputControl
                    control="select"
                    name="txtState"
                    loader={isLoadingSelectedState ? <Loader /> : null}
                    onChange={(e) => updateState("txtState", e)}
                    value={formValues.txtState}
                    options={selectedState}
                    getOptionLabel={(option) => `${option.StateMasterName}`}
                    getOptionValue={(option) => `${option}`}
                  />
                </Form.InputGroup>
              ) : null}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" varient="secondary" trigger={btnLoaderActive}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddUser;

AddUser.propTypes = {
  showfunc: PropTypes.func.isRequired,
  referenceTypeOptions: PropTypes.array,
  updateUserData: PropTypes.func.isRequired,
};
