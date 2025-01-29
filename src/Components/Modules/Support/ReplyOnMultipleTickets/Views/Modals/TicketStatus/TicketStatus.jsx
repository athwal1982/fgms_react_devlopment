import React from "react";
import TextEditor from "Framework/Components/Widgets/TextEditor/TextEditor";
import { PropTypes } from "prop-types";
import { Loader, Button } from "Framework/Components/Widgets";
import { Modal, PageBar } from "Framework/Components/Layout";
import BizClass from "./TicketStatus.module.scss";
import TicketStatusLogic from "./Logic/Logic";

function TicketStatus({ showfunc, selectedTicketData, updateReplyOnMultipleTicket }) {
  const {
    value,
    setValue,
    handleSave,
    btnLoaderActive,
    ticketStatusList,
    isLoadingTicketStatusList,
    formValuesReplyOnTickets,
    updateStateReplyOnTickets,
    wordcount,
    setWordcount,
  } = TicketStatusLogic();

  const sizeLimit = 2000;
  return (
    <Modal varient="center" title="Update Tickets Status" show={showfunc} width="55.5vw" height="65.5vh">
      <Modal.Body>
        <div className={BizClass.ReplyBox}>
          <TextEditor value={value} onChange={setValue} setWordcount={setWordcount} sizeLimit={sizeLimit} />
          <div className={BizClass.SendBox}>
            <p>
              Count : {sizeLimit} / {sizeLimit - wordcount}
            </p>
            <PageBar.Select
              control="select"
              name="txtTicketStatus"
              options={ticketStatusList}
              loader={isLoadingTicketStatusList ? <Loader /> : null}
              value={formValuesReplyOnTickets.txtTicketStatus}
              getOptionLabel={(option) => `${option.CommonMasterValue}`}
              getOptionValue={(option) => `${option}`}
              onChange={(e) => updateStateReplyOnTickets("txtTicketStatus", e)}
            />

            <Button
              type="button"
              varient="secondary"
              trigger={btnLoaderActive}
              onClick={() => handleSave(selectedTicketData, showfunc, updateReplyOnMultipleTicket)}
            >
              Submit
            </Button>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer />
    </Modal>
  );
}

export default TicketStatus;

TicketStatus.propTypes = {
  showfunc: PropTypes.func.isRequired,
  replyBoxCollapsed: PropTypes.bool.isRequired,
  value: PropTypes.node.isRequired,
  setValue: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  btnLoaderActive1: PropTypes.bool,
  ticketStatusList: PropTypes.array.isRequired,
  isLoadingTicketStatusList: PropTypes.bool,
  formValuesReplyOnTickets: PropTypes.object.isRequired,
  updateStateReplyOnTickets: PropTypes.func.isRequired,
  wordcount: PropTypes.number.isRequired,
  setWordcount: PropTypes.func.isRequired,
  formValidationSupportTicketReviewError: PropTypes.func.isRequired,
  selectedTicketData: PropTypes.array,
  updateReplyOnMultipleTicket: PropTypes.func.isRequired,
};
