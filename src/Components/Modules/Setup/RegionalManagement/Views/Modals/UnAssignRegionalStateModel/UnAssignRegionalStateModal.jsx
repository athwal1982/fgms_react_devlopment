import React, { useEffect } from "react";
import { Modal, PageBar } from "Framework/Components/Layout";
import { Button } from "Framework/Components/Widgets";
import BizClass from "./UnAssignRegionalStateModel.module.scss";

function UnAssignedRegionalStateModal() {
  return (
    <Modal varient="half" title={""} left="0" width="49.5vw">
      <Modal.Body>
        <div className={BizClass.Card}>
          <PageBar>
            <PageBar.Search />
          </PageBar>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" varient="secondary" trigger={btnloaderActive}>
          Import
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UnAssignedRegionalStateModal;

UnAssignedRegionalStateModal.propTypes = {};
