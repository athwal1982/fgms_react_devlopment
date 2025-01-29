import React, { useEffect } from "react";
import { Form, Modal } from "Framework/Components/Layout";
import { Button } from "Framework/Components/Widgets";
import PropTypes from "prop-types";
import EditInsuranceCompanyLogics from "./Logic/Logic";

function EditInsuranceCompany({ showfunc, seletedData }) {
  const { formValues, updateState, btnLoaderActive, formValidationError, handleSave, getSelectedRowData } = EditInsuranceCompanyLogics();

  useEffect(() => {
    debugger;
    getSelectedRowData(seletedData);
  }, []);

  return (
    <Modal varient="center" title="Edit Insurnace Company" width="60vw" right="0" show={showfunc} onSubmit={(e) => handleSave(e, showfunc)}>
      <Modal.Body>
        <Form>
          <Form.Group column="1" controlwidth="610px">
            <Form.InputGroup label="Insurance Company " errorMsg={formValidationError["txtInsuranceCompanyName"]} req="true">
              <Form.InputControl
                control="input"
                type="text"
                maxLength="100"
                autoComplete="off"
                value={formValues.txtInsuranceCompanyName}
                name="txtInsuranceCompanyName"
                onChange={(e) => updateState("txtInsuranceCompanyName", e.target.value)}
              />
            </Form.InputGroup>
            <Form.InputGroup label="Insurance Company Code " errorMsg={formValidationError["txtInsuranceCompanyCode"]} req="true">
              <Form.InputControl
                control="input"
                type="text"
                maxLength="20"
                autoComplete="off"
                value={formValues.txtInsuranceCompanyCode}
                name="txtInsuranceCompanyCode"
                onChange={(e) => updateState("txtInsuranceCompanyCode", e.target.value)}
              />
            </Form.InputGroup>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" varient="secondary" trigger={btnLoaderActive}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditInsuranceCompany;

EditInsuranceCompany.propTypes = {
  showfunc: PropTypes.func.isRequired,
  updateEditInsuranceCompanyData: PropTypes.func.isRequired,
  seletedData: PropTypes.object,
};
