import React from "react";
import { Loader, Button } from "Framework/Components/Widgets";
import { PropTypes } from "prop-types";
import TextEditor from "Framework/Components/Widgets/TextEditor/TextEditor";
import { RiTicket2Fill, RiDatabaseFill } from "react-icons/ri";
import classNames from "classnames";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import { BsFillArrowDownCircleFill } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { FcAssistant } from "react-icons/fc";
import { dateFormat, tConvert, daysdifference, dateFormatDefault, dateToSpecificFormat, Convert24FourHourAndMinute } from "Configration/Utilities/dateformat";
import parse from "html-react-parser";
import BizClass from "../FarmerEnquiryRegistration.module.scss";

function EnquiryPopupData({
  btnLoaderActive1,
  handleSave,
  selectedEnquiry,
  selectedTicketEnquiry,
  isLoadingSelectedTicketEnquiry,
  value,
  setValue,
  wordcount,
  setWordcount,
  showfunc,
}) {
  const sizeLimit = 2000;

  console.log("selectedEnquiry", selectedEnquiry);
  console.log("selectedTicketEnquiry", selectedTicketEnquiry);
  console.log("isLoadingSelectedTicketEnquiry", isLoadingSelectedTicketEnquiry);
  const user = getSessionStorage("user");

  return (
    <div className={BizClass.PageDiv}>
      <div className={BizClass.EnquiryMainSection}>
        <div className={BizClass.HeaderTop}>
          <button type="button" onClick={showfunc}>
            Back
          </button>
        </div>
        <div className={BizClass.EnQuiryPopupPage}>
          <div className={BizClass.ChatBox}>
            <div className={BizClass.Header}>
              <div className={BizClass.Heading}>
                <div className={BizClass.TickIcon}>
                  <RiTicket2Fill className={BizClass.TicketLogo} />
                </div>
                <div className={BizClass.TicketDetail}>
                  <h4>{`${selectedEnquiry && selectedEnquiry.farmertype ? selectedEnquiry.farmertype : ""} || ${
                    selectedEnquiry && selectedEnquiry.farmerCategoy ? selectedEnquiry.farmerCategoy : ""
                  } (${selectedEnquiry && selectedEnquiry.EnquiryStatus ? selectedEnquiry.EnquiryStatus : ""})`}</h4>
                  <p>Created by {selectedEnquiry.CreatedBY}</p>
                </div>
                <div className={BizClass.TicketSubDetail}>
                  <div className={BizClass.SubDetail}>
                    <h4>Since {daysdifference(dateFormatDefault(new Date()), dateFormatDefault(selectedEnquiry.CreatedAt.split("T")[0]))} Day Ago</h4>
                    <p>
                      {/* From {dateFormat(selectedEnquiry.CreatedAt.split("T")[0])} at {tConvert(selectedEnquiry.CreatedAt.split("T")[1])} */}
                      From{" "}
                      {dateToSpecificFormat(
                        `${selectedEnquiry.CreatedAt.split("T")[0]} ${Convert24FourHourAndMinute(selectedEnquiry.CreatedAt.split("T")[1])}`,
                        "DD-MM-YYYY HH:mm",
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className={BizClass.TicketRemarks}>
                <p>
                  Farmer Query :-
                  <span> {selectedEnquiry && selectedEnquiry.Description ? parse(selectedEnquiry.Description) : null} </span>
                </p>
              </div>
            </div>
            <div className={BizClass.MainSection}>
              <div className={BizClass.ChatBox_One}>
                <TextEditor value={value} onChange={setValue} setWordcount={setWordcount} sizeLimit={sizeLimit} />
              </div>

              <div className={BizClass.ChatBox_Two}>
                <div className={BizClass.HeadTwo}>
                  <span>
                    Count : {sizeLimit} / {sizeLimit - wordcount}
                  </span>
                  {selectedEnquiry && selectedEnquiry.TicketStatusID.toString() === "109301" ? (
                    <Button type="button" varient="secondary" trigger={btnLoaderActive1} onClick={(e) => handleSave(e)}>
                      Resolved
                    </Button>
                  ) : null}
                </div>
                <div className={BizClass.ChatSection}>
                  {!isLoadingSelectedTicketEnquiry ? (
                    selectedTicketEnquiry && selectedTicketEnquiry.length > 0 ? (
                      selectedTicketEnquiry.map((data, i) => {
                        return (
                          <div
                            className={classNames(
                              BizClass.MessagesDiv,
                              data.InsertUserID.toString() === user.LoginID.toString() ? BizClass.Responder : BizClass.Requester,
                            )}
                            key={i}
                          >
                            <div className={BizClass.Content}>
                              <div>
                                <p>
                                  {dateFormat(data.TicketHistoryDate.split("T")[0])} at {tConvert(data.TicketHistoryDate.split("T")[1])}{" "}
                                </p>
                                <span>
                                  {" "}
                                  ({data.CreatedBY} - {data.UserType})
                                </span>
                              </div>
                              <div className={BizClass.TypeMessage_Div}>
                                <span>{data.TicketDescription}</span>
                              </div>
                            </div>
                            <div className={BizClass.Logo}>
                              <FcAssistant />
                            </div>
                          </div>
                        );
                      })
                    ) : null
                  ) : (
                    <Loader />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={BizClass.RightContent}>
            <div className={BizClass.UserBox}>
              <div className={BizClass.UserHeader}>
                <div className={BizClass.UserContent}>
                  <div className={BizClass.Icon}>
                    <FaUserCircle className={BizClass.UserLogo} />
                  </div>
                  <div className={BizClass.Info}>
                    <h4>{selectedEnquiry.farmerName}</h4>
                    <span>{selectedEnquiry.mobileNumber && selectedEnquiry.mobileNumber ? `+91  ${selectedEnquiry.mobileNumber}` : null}</span>
                  </div>
                </div>
                <div className={BizClass.Userbtn}>
                  <IoEllipsisVerticalSharp />
                  <BsFillArrowDownCircleFill />
                </div>
              </div>
              <div className={BizClass.Data_Div}>
                <div className={BizClass.ContentDiv}>
                  <div className={BizClass.Data}>
                    <div className={BizClass.Logo}>
                      <RiDatabaseFill />
                    </div>

                    <span>
                      Season - Year : {selectedEnquiry && selectedEnquiry.CropSeasonID && selectedEnquiry.CropSeasonID === 1 ? "Kharif" : "Rabi"} -{" "}
                      {selectedEnquiry && selectedEnquiry.Years ? selectedEnquiry.Years : ""}
                    </span>
                  </div>
                  <div className={BizClass.Data}>
                    <div className={BizClass.Logo}>
                      <RiDatabaseFill />
                    </div>

                    <span>
                      Location : {selectedEnquiry && selectedEnquiry.Village ? selectedEnquiry.Village : ""}-{" "}
                      {selectedEnquiry && selectedEnquiry.SubDistrict ? selectedEnquiry.SubDistrict : ""}-{" "}
                      {selectedEnquiry && selectedEnquiry.District ? selectedEnquiry.District : ""}-{" "}
                      {selectedEnquiry && selectedEnquiry.StateMasterName ? selectedEnquiry.StateMasterName : ""}-{" "}
                    </span>
                  </div>
                  <div className={BizClass.Data}>
                    <div className={BizClass.Logo}>
                      <RiDatabaseFill />
                    </div>

                    <span>Insurance Company : {selectedEnquiry.InsuranceMasterName}</span>
                  </div>
                  <div className={BizClass.Data}>
                    <div className={BizClass.Logo}>
                      <RiDatabaseFill />
                    </div>

                    <span> Scheme : {selectedEnquiry.SchemeName}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnquiryPopupData;

EnquiryPopupData.propTypes = {
  showfunc: PropTypes.func.isRequired,
  selectedEnquiry: PropTypes.object,
  selectedTicketEnquiry: PropTypes.array,
  isLoadingSelectedTicketEnquiry: PropTypes.bool,
  wordcount: PropTypes.number.isRequired,
  setWordcount: PropTypes.func.isRequired,
  value: PropTypes.node.isRequired,
  setValue: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  btnLoaderActive1: PropTypes.bool,
};
