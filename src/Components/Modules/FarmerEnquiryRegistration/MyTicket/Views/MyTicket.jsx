import React from "react";
import { PropTypes } from "prop-types";
import { PageBar } from "Framework/Components/Layout";
import { getUserRightCodeAccess } from "Components/Common/Login/Auth/auth";
import BizClass from "./MyTicket.module.scss";

function MyTicket({ children, replyBoxCollapsed, setReplyBoxCollapsed, setTicketStatusBtn, ticketData, showfunc }) {
  const replyTicketRight = getUserRightCodeAccess("rpet");
  const reopenTicketRight = getUserRightCodeAccess("rot2");

  const toggelReplyCloseButton = (type) => {
    if (type === "Reply") {
      setReplyBoxCollapsed(!replyBoxCollapsed);
      setTicketStatusBtn("Reply");
    } else if (type === "Close") {
      setReplyBoxCollapsed(!replyBoxCollapsed);
      setTicketStatusBtn("Close");
    }
  };

  const toggelReOpenButton = () => {
    setReplyBoxCollapsed(!replyBoxCollapsed);
  };

  return (
    <div className={BizClass.Box}>
      <div className={BizClass.ActionDiv}>
        {/* <PageBar.Button onClick={() => navigate("/ManageTicket")}>Back</PageBar.Button>
         */}
        <PageBar.Button onClick={() => showfunc(null)}>Back</PageBar.Button>
        {replyTicketRight ? (
          ticketData.TicketStatusID && ticketData.TicketStatusID.toString() !== "109303" ? (
            <PageBar.Button onClick={() => toggelReplyCloseButton("Reply")}>Reply</PageBar.Button>
          ) : null
        ) : null}
        {reopenTicketRight ? (
          ticketData.TicketStatusID && ticketData.TicketStatusID.toString() === "109303" ? (
            <PageBar.Button onClick={() => toggelReOpenButton()}>Re-Open</PageBar.Button>
          ) : null
        ) : null}
      </div>
      <div className={BizClass.ContentDiv}>{children}</div>
    </div>
  );
}

export default MyTicket;

MyTicket.propTypes = {
  children: PropTypes.node.isRequired,
  replyBoxCollapsed: PropTypes.bool.isRequired,
  setReplyBoxCollapsed: PropTypes.func.isRequired,
  setTicketStatusBtn: PropTypes.func.isRequired,
  ticketData: PropTypes.object,
  showfunc: PropTypes.func.isRequired,
};
