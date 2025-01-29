import React from "react";
import TextEditor from "Framework/Components/Widgets/TextEditor/TextEditor";
import { Button } from "Framework/Components/Widgets";
import Modal from "Framework/Components/Layout/Modal/Modal";
import { PropTypes } from "prop-types";
import BizClass from "./ChatList.module.scss";

function EditTicketComment({
  toggleEditTicketCommentModal,
  valueEditTicketComment,
  setValueEditTicketComment,
  handleSaveEditTicketComment,
  btnLoaderActiveEditTicketComment,
  wordcountEditTicketComment,
  setWordcountEditTicketComment,
}) {
  const sizeLimitEditTicketComment = 2000;
  return (
    <Modal varient="center" title="Edit Ticket Comment" show={toggleEditTicketCommentModal} width="63vw" style={{ zindex: "999999999999999999999" }}>
      <Modal.Body>
        <div className={BizClass.ReplyBox}>
          <TextEditor
            value={valueEditTicketComment}
            onChange={setValueEditTicketComment}
            setWordcount={setWordcountEditTicketComment}
            sizeLimit={sizeLimitEditTicketComment}
          />
          <div className={BizClass.SendBox}>
            <p>
              Count : {sizeLimitEditTicketComment} / {sizeLimitEditTicketComment - wordcountEditTicketComment}
            </p>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          varient="secondary"
          trigger={btnLoaderActiveEditTicketComment}
          onClick={() => handleSaveEditTicketComment(toggleEditTicketCommentModal)}
        >
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditTicketComment;

EditTicketComment.propTypes = {
  toggleEditTicketCommentModal: PropTypes.bool,
  valueEditTicketComment: PropTypes.node.isRequired,
  setValueEditTicketComment: PropTypes.func.isRequired,
  handleSaveEditTicketComment: PropTypes.func.isRequired,
  btnLoaderActiveEditTicketComment: PropTypes.bool,
  wordcountEditTicket: PropTypes.number.isRequired,
  setWordcountEditTicket: PropTypes.func.isRequired,
};
