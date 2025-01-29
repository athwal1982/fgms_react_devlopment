import { React } from "react";
import { BsTelephoneOutbound, BsBank2 } from "react-icons/bs";
import { CgWebsite } from "react-icons/cg";
import { MdOutlineWeb, MdOutlineDisabledByDefault } from "react-icons/md";
import { FaTwitterSquare } from "react-icons/fa";
import { Loader, Button } from "Framework/Components/Widgets";
import classNames from "classnames";
import { PropTypes } from "prop-types";
import { daysdifference, dateFormatDefault, dateToSpecificFormat, Convert24FourHourAndMinute } from "Configration/Utilities/dateformat";
import parse from "html-react-parser";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import BizClass from "./ChatList.module.scss";

function TicketSourceIconWithSwitch(parameter) {
  switch (parameter) {
    case 1:
      return <BsTelephoneOutbound title="Toll Free" />;
    case 2:
      return <CgWebsite title="DOA Website" />;
    case 3:
      return <MdOutlineWeb title="CSC Portal" />;
    case 4:
      return <FaTwitterSquare title="Twitter" />;
    case 5:
      return <BsBank2 title="Bank" />;
    case 6:
      return <MdOutlineWeb title="CSC" />;
    default:
      return <MdOutlineDisabledByDefault />;
  }
}

function ChatList({ children, chatListDetails, isLoadingchatListDetails, selectedData, showMoreChatListOnClick }) {
  const user = getSessionStorage("user");

  return (
    <div className={BizClass.ChatBox}>
      <div className={classNames(BizClass.Heading, BizClass.urgent)}>
        <div className={BizClass.TickIcon}>{TicketSourceIconWithSwitch(selectedData.TicketSourceID)}</div>
        <div className={BizClass.TicketDetail}>
          <h4>{`${selectedData.FarmerSupportTicketNo} || ${selectedData.TicketCategoryName}`}</h4>
          <p>
            Created By {selectedData.CreatedBY} - {selectedData.BusinessRelationName} || {`${selectedData.TicketStatus}(${selectedData.TicketHeadName})`}
          </p>
        </div>
        <div className={BizClass.TicketSubDetail}>
          <span className={BizClass.StatusBox} style={{ display: "none" }}>
            Waiting on Customer
          </span>
          <div className={BizClass.SubDetail}>
            <h4>Since {daysdifference(dateFormatDefault(new Date()), dateFormatDefault(selectedData.CreatedAt.split("T")[0]))} Day Ago</h4>
            <p>
              From{" "}
              {dateToSpecificFormat(
                `${selectedData.CreatedAt.split("T")[0]} ${Convert24FourHourAndMinute(selectedData.CreatedAt.split("T")[1])}`,
                "DD-MM-YYYY HH:mm",
              )}
            </p>
          </div>
        </div>
      </div>
      <div className={BizClass.TicketRemarks}>
        <p>
          Farmer Query :-
          <span> {selectedData && selectedData.TicketDescription ? parse(selectedData.TicketDescription) : null} </span>
        </p>
      </div>
      <div className={BizClass.MainBox}>
        {children}
        <div className={BizClass.ChattingBox}>
          {!isLoadingchatListDetails ? (
            chatListDetails && chatListDetails.length > 0 ? (
              chatListDetails.map((data, i) => {
                return (
                  <div
                    className={classNames(BizClass.ChatDiv, data.InsertUserID.toString() === user.LoginID.toString() ? BizClass.Responder : BizClass.Requester)}
                    key={i}
                  >
                    <div className={BizClass.ImgDiv} />
                    <div className={BizClass.ChatContent}>
                      <div className={BizClass.ChatTitle}>
                        <p>
                          {" "}
                          ({data.CreatedBY} - {data.UserType})
                        </p>
                        <span>
                          {dateToSpecificFormat(
                            `${data.TicketHistoryDate.split("T")[0]} ${Convert24FourHourAndMinute(data.TicketHistoryDate.split("T")[1])}`,
                            "DD-MM-YYYY HH:mm",
                          )}
                        </span>
                      </div>
                      <div className={BizClass.ChatBody}>
                        <h4> {parse(data.TicketDescription)}</h4>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : null
          ) : (
            <Loader />
          )}
        </div>
        <div style={{ float: "right" }}>
          {chatListDetails.length <= 5 || chatListDetails.length === 0 ? null : <Button onClick={() => showMoreChatListOnClick()}>Show More</Button>}
        </div>
      </div>
    </div>
  );
}

export default ChatList;

ChatList.propTypes = {
  children: PropTypes.node.isRequired,
  chatListDetails: PropTypes.array,
  isLoadingchatListDetails: PropTypes.bool,
  selectedData: PropTypes.object,
  showMoreChatListOnClick: PropTypes.func.isRequired,
};
