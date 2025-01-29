import React from "react";
import TextEditor from "Framework/Components/Widgets/TextEditor/TextEditor";
import { PropTypes } from "prop-types";
import { Loader, Button } from "Framework/Components/Widgets";
import { PageBar } from "Framework/Components/Layout";
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
}) {
  const sizeLimit = 2000;

  return (
    <div className={BizClass.ReplyBox} style={{ display: replyBoxCollapsed ? "none" : "block" }}>
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
          value={formValuesTicketProperties.txtTicketStatus}
          getOptionLabel={(option) => `${option.CommonMasterValue}`}
          getOptionValue={(option) => `${option}`}
          onChange={(e) => updateStateTicketProperties("txtTicketStatus", e)}
        />

        <Button type="button" varient="secondary" trigger={btnLoaderActive1} onClick={(e) => handleSave(e)}>
          Send
        </Button>
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
};
