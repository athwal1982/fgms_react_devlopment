import React from "react";
import TextEditor from "Framework/Components/Widgets/TextEditor/TextEditor";
import { PropTypes } from "prop-types";
import { Loader, Button } from "Framework/Components/Widgets";
import { Form, PageBar } from "Framework/Components/Layout";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import BizClass from "./ChatBox.module.scss";

function ChatBox({
  replyBoxCollapsed,
  value,
  setValue,
  handleSave,
  btnLoaderActive1,
  ticketStatusList,
  isLoadingTicketStatusList,
  formValuesTicketProperties,
  updateStateTicketProperties,
  wordcount,
  setWordcount,
  formValidationSupportTicketReviewError,
  fileRef,
  handleResetFile,
  btnLoaderActiveComment,
  handleAddComment,
}) {
  const sizeLimit = 2000;

  const user = getSessionStorage("user");
  const ChkBRHeadTypeID = user && user.BRHeadTypeID ? user.BRHeadTypeID.toString() : "0";

  return (
    <div className={BizClass.ReplyBox} style={{ display: replyBoxCollapsed ? "none" : "block" }}>
      <TextEditor value={value} onChange={setValue} setWordcount={setWordcount} sizeLimit={sizeLimit} />
      <div className={BizClass.SendBox}>
        <p>
          Count : {sizeLimit} / {sizeLimit - wordcount}
        </p>
        <Form.InputGroup label="" errorMsg={formValidationSupportTicketReviewError["txtDocumentUpload"]}>
          <Form.InputControl
            control="input"
            type="file"
            accept="image/*,.pdf"
            name="txtDocumentUpload"
            onChange={(e) => updateStateTicketProperties(e.target.name, e.target.files[0])}
            ref={fileRef}
          />
        </Form.InputGroup>
        <Form.InputGroup column={1}>
          <Button type="button" varient="primary" onClick={() => handleResetFile()}>
            {" "}
            Reset File
          </Button>
        </Form.InputGroup>
        <PageBar.Select
          control="select"
          name="txtTicketStatus"
          options={ticketStatusList}
          loader={isLoadingTicketStatusList ? <Loader /> : null}
          value={formValuesTicketProperties.txtTicketStatus}
          getOptionLabel={(option) => `${option.CommonMasterValue}`}
          getOptionValue={(option) => `${option}`}
          onChange={(e) => updateStateTicketProperties("txtTicketStatus", e)}
        />

        <Button type="button" varient="secondary" trigger={btnLoaderActive1} onClick={(e) => handleSave(e)}>
          Send
        </Button>
        {ChkBRHeadTypeID === "124001" ? (
          <Button type="button" varient="primary" trigger={btnLoaderActiveComment} onClick={() => handleAddComment()}>
            Comment
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default ChatBox;

ChatBox.propTypes = {
  replyBoxCollapsed: PropTypes.bool.isRequired,
  value: PropTypes.node.isRequired,
  setValue: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  btnLoaderActive1: PropTypes.bool,
  ticketStatusList: PropTypes.array.isRequired,
  isLoadingTicketStatusList: PropTypes.bool,
  formValuesTicketProperties: PropTypes.object.isRequired,
  updateStateTicketProperties: PropTypes.func.isRequired,
  wordcount: PropTypes.number.isRequired,
  setWordcount: PropTypes.func.isRequired,
  formValidationSupportTicketReviewError: PropTypes.func.isRequired,
  fileRef: PropTypes.func.isRequired,
  handleResetFile: PropTypes.func.isRequired,
  handleAddComment: PropTypes.func.isRequired,
  btnLoaderActiveComment: PropTypes.bool,
};
