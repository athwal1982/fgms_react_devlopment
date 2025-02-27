import { React, useState } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { BsTelephoneOutbound, BsBank2 } from "react-icons/bs";
import { CgWebsite } from "react-icons/cg";
import { MdOutlineWeb, MdOutlineDisabledByDefault, MdOutlineContentCopy } from "react-icons/md";
import { FaTwitterSquare, FaEdit } from "react-icons/fa";
import { Loader, Button } from "Framework/Components/Widgets";
import classNames from "classnames";
import { PropTypes } from "prop-types";
import { daysdifference, dateFormatDefault, dateToSpecificFormat, Convert24FourHourAndMinute } from "Configration/Utilities/dateformat";
import parse from "html-react-parser";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import FileViewer from "./FileViewer";
import EditTicketComment from "./EditTicketComment";
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

function ChatList({
  children,
  chatListDetails,
  isLoadingchatListDetails,
  selectedData,
  showMoreChatListOnClick,
  valueEditTicketComment,
  setValueEditTicketComment,
  handleSaveEditTicketComment,
  btnLoaderActiveEditTicketComment,
  wordcountEditTicketComment,
  setWordcountEditTicketComment,
  setSelectedHistoryData,
}) {
  const setAlertMessage = AlertMessage();
  const user = getSessionStorage("user");
  const ChkBRHeadTypeID = user && user.BRHeadTypeID ? user.BRHeadTypeID.toString() : "0";

  const [fileViewerIsLoading, setFileViewerIsLoading] = useState(false);
  const [isFileViewerModalOpen, setIsFileViewerModalOpen] = useState(false);
  const [selectedFileForFileViewerURL, setSelectedFileForFileViewerURL] = useState("");

  const toggleFileViewerModal = (pAttahmentURL) => {
    debugger;
    setFileViewerIsLoading(true);
    setIsFileViewerModalOpen(!isFileViewerModalOpen);
    setSelectedFileForFileViewerURL(pAttahmentURL);
    setFileViewerIsLoading(false);
  };

  const [isEditTicketCommentModalOpen, setIsEditTicketCommentModalOpen] = useState(false);
  const toggleEditTicketCommentModal = (data) => {
    debugger;
    if (data) {
      setSelectedHistoryData(data);
      setValueEditTicketComment(data.TicketDescription);
    }
    setIsEditTicketCommentModalOpen(!isEditTicketCommentModalOpen);
  };

  const copyToClipboard = (text) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setAlertMessage({
        type: "success",
        message: "Text copied to clipboard!",
      });
    }
  };

  function stripHtmlTags(html) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  }

  return (
    <>
      {isFileViewerModalOpen && (
        <FileViewer toggleFileViewerModal={toggleFileViewerModal} imageURL={selectedFileForFileViewerURL} fileViewerIsLoading={fileViewerIsLoading} />
      )}
      {isEditTicketCommentModalOpen && (
        <EditTicketComment
          toggleEditTicketCommentModal={toggleEditTicketCommentModal}
          valueEditTicketComment={valueEditTicketComment}
          setValueEditTicketComment={setValueEditTicketComment}
          handleSaveEditTicketComment={handleSaveEditTicketComment}
          btnLoaderActiveEditTicketComment={btnLoaderActiveEditTicketComment}
          wordcountEditTicketComment={wordcountEditTicketComment}
          setWordcountEditTicketComment={setWordcountEditTicketComment}
        />
      )}
      <div className={BizClass.ChatBox}>
        <div className={classNames(BizClass.Heading, BizClass.urgent)}>
          <div className={BizClass.TickIcon}>{TicketSourceIconWithSwitch(selectedData.TicketSourceID)}</div>
          <div className={BizClass.TicketDetail}>
            <h4>
              {`${selectedData.SupportTicketNo} || ${selectedData.TicketCategoryName}`}{" "}
              {/* {selectedData.HasDocument && selectedData.HasDocument === 1 ? (
                <MdAttachFile onClick={() => toggleFileViewerModal(selectedData.SupportTicketAttachment)} style={{ cursor: "pointer", color: "#000000" }} />
              ) : null}{" "} */}
            </h4>
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
                {/* From {dateFormat(selectedData.CreatedAt.split("T")[0])} at {tConvert(selectedData.CreatedAt.split("T")[1])} */}
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
            <MdOutlineContentCopy
              style={{ color: "#000000", paddingRight: "5px", fontSize: "18px", cursor: "pointer" }}
              title="Copy Ticket Description"
              onClick={() => copyToClipboard(selectedData ? selectedData.TicketDescription : "")}
            />{" "}
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
                      className={classNames(
                        BizClass.ChatDiv,
                        data.InsertUserID.toString() === user.LoginID.toString() ? BizClass.Responder : BizClass.Requester,
                      )}
                      key={i}
                    >
                      <div className={BizClass.ImgDiv} />
                      <div className={BizClass.ChatContent}>
                        <div className={BizClass.ChatTitle}>
                          <p>
                            {" "}
                            ({data.CreatedBY} - {data.UserType}){" "}
                            {/* {data.HasDocument && data.HasDocument === 1 ? (
                              <MdAttachFile
                                onClick={() => toggleFileViewerModal(data.TicketHistoryAttachment)}
                                style={{ cursor: "pointer", color: "#000000" }}
                              />
                            ) : null}{" "} */}
                          </p>
                          <span>
                            {/* {dateFormat(data.TicketHistoryDate.split("T")[0])} at {tConvert(data.TicketHistoryDate.split("T")[1])} */}
                            {dateToSpecificFormat(
                              `${data.TicketHistoryDate.split("T")[0]} ${Convert24FourHourAndMinute(data.TicketHistoryDate.split("T")[1])}`,
                              "DD-MM-YYYY HH:mm",
                            )}
                          </span>
                        </div>
                        <div className={BizClass.ChatBody}>
                          {ChkBRHeadTypeID.toString() === "124003" && selectedData.TicketStatusID.toString() === "109302" && i === 0 ? (
                            <span>
                              <MdOutlineContentCopy
                                className="copy-icon"
                                title="Copy Ticket Comment"
                                onClick={() => copyToClipboard(stripHtmlTags(data.TicketDescription))}
                              />
                              &nbsp;
                              <FaEdit title="Update Comment" onClick={() => toggleEditTicketCommentModal(data)} />
                            </span>
                          ) : (
                            <span>
                              <MdOutlineContentCopy
                                className="copy-icon"
                                title="Copy Ticket Comment"
                                onClick={() => copyToClipboard(stripHtmlTags(data.TicketDescription))}
                              />
                            </span>
                          )}
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
    </>
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
