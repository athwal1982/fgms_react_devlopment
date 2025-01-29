import { useEffect, useState } from "react";
import moment from "moment";
import publicIp from "public-ip";
import { getSessionStorage, getUserRightCodeAccess } from "Components/Common/Login/Auth/auth";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { getFarmerSupportTicketReview, addFarmerSupportTicketReview, getMasterDataBinding, farmerTicketStatusUpdate } from "../Services/Services";
// A import { sendSMSToFarmer } from "../../../Support/ManageTicket/Views/Modals/AddTicket/Services/Methods";

function MyTicketLogics() {
  const [value, setValue] = useState("<p></p>");
  const [replyBoxCollapsed, setReplyBoxCollapsed] = useState(true);
  const [wordcount, setWordcount] = useState(0);

  const resolvedTicketRight = getUserRightCodeAccess("mdh9");

  const setAlertMessage = AlertMessage();

  const [formValuesTicketProperties, setFormValuesTicketProperties] = useState({
    txtTicketStatus: null,
    txtBankName: null,
  });

  const updateStateTicketProperties = (name, value) => {
    setFormValuesTicketProperties({ ...formValuesTicketProperties, [name]: value });
  };

  const [ticketData, setTicketData] = useState("");
  const [ticketStatusBtn, setTicketStatusBtn] = useState("");

  const [chatListDetails, setChatListDetails] = useState([]);
  const [isLoadingchatListDetails, setIsLoadingchatListDetails] = useState(false);
  const getChatListDetailsData = async (pticketData, pPageIndex, pPageSize) => {
    try {
      setTicketData(pticketData);
      setFormValuesTicketProperties({
        ...formValuesTicketProperties,
        txtTicketStatus:
          pticketData && pticketData.TicketStatus && pticketData.TicketStatusID
            ? {
                CommonMasterValueID: pticketData.TicketStatusID,
                CommonMasterValue: pticketData.TicketStatus,
                BMCGCode: pticketData.BMCGCode,
              }
            : null,
      });
      setIsLoadingchatListDetails(true);
      const formdata = {
        farmerSupportTicketID: pticketData.FarmerSupportTicketID,
        pageIndex: pPageIndex,
        pageSize: pPageSize,
      };
      const result = await getFarmerSupportTicketReview(formdata);
      console.log(result, "chat List");
      setIsLoadingchatListDetails(false);
      if (result.responseCode === 1) {
        if (result.responseData.supportTicket && result.responseData.supportTicket.length > 0) {
          setChatListDetails(result.responseData.supportTicket);
        } else {
          setChatListDetails([]);
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };

  const showMoreChatListOnClick = () => {
    getChatListDetailsData(ticketData, 1, -1);
  };

  useEffect(() => {
    console.log(value);
  }, [value]);

  const updateTicketHistorytData = (addedData) => {
    if (addedData.IsNewlyAdded === true) {
      chatListDetails.unshift(addedData);
    }
    console.log(addedData);
    setChatListDetails([]);
    setChatListDetails(chatListDetails);
  };

  const [btnLoaderActiveOld, setBtnLoaderActiveOld] = useState(false);
  const handleSaveOld = async (e) => {
    debugger;
    if (e) e.preventDefault();
    let popUpMsg = "";
    if (value === "") {
      if (ticketStatusBtn === "Reply") {
        popUpMsg = "Ticket Reply Comment is required!";
      } else if (ticketStatusBtn === "Close") {
        popUpMsg = "Ticket Close Comment is required!";
      }
      setAlertMessage({
        type: "error",
        message: popUpMsg,
      });
      return;
    }
    try {
      let SaveTicketStatusID = "0";
      if (ticketStatusBtn === "Reply") {
        SaveTicketStatusID = ticketData.TicketStatusID;
      } else if (ticketStatusBtn === "Close") {
        SaveTicketStatusID = 109018;
      } else {
        SaveTicketStatusID = ticketData.TicketStatusID;
      }

      const formData = {
        ticketHistoryID: 0,
        farmerSupportTicketID: ticketData.FarmerSupportTicketID,
        agentUserID: ticketData.AgentUserID ? ticketData.AgentUserID : "0",
        ticketStatusID: SaveTicketStatusID,
        ticketDescription: value,
        hasDocument: 0,
      };
      setBtnLoaderActiveOld(true);
      const result = await addFarmerSupportTicketReview(formData);
      setBtnLoaderActiveOld(false);
      if (result.response.responseCode === 1) {
        if (result.response && result.response.responseData && result.response.responseData.TicketHistoryID) {
          const ip = await publicIp.v4();
          const user = getSessionStorage("user");
          const newlyAddedEntry = {
            CreatedBY: user && user.UserDisplayName ? user.UserDisplayName.toString() : "",
            AgentUserID: ticketData.AgentUserID ? ticketData.AgentUserID : "0",
            HasDocument: 0,
            InsertIPAddress: ip,
            InsertUserID: user && user.LoginID ? user.LoginID.toString() : "1",
            SupportTicketID: ticketData.SupportTicketID,
            TicketDescription: value,
            TicketHistoryDate: moment().utcOffset("+05:30").format("YYYY-MM-DDTHH:mm:ss"),
            TicketStatusID: SaveTicketStatusID,
            IsNewlyAdded: true,
          };
          updateTicketHistorytData(newlyAddedEntry);
          setValue("<p></p>");
          setAlertMessage({
            type: "success",
            message: result.response.responseMessage,
          });

          if (ticketStatusBtn === "Close") {
            ticketData.TicketStatusID = SaveTicketStatusID;
            ticketData.TicketStatus = "Resolved";
            setReplyBoxCollapsed(!replyBoxCollapsed);
          }
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };

  // A const SendSMSToFarmerAgaintSupportTicket = async (ptemplateID, pmobileNO, psupportTicketNo) => {
  // A  try {
  // A    debugger;
  // A    const formData = {
  // A      templateID: ptemplateID,
  // A      mobileNO: pmobileNO,
  // A      supportTicketNo: psupportTicketNo,
  // A    };

  // A    const result = await sendSMSToFarmer(formData);
  // A    if (result.response.responseCode === 1) {
  // A      console.log(`Success: TemplateID : ${ptemplateID} ${JSON.stringify(result)}`);
  // A    } else {
  // A      console.log(`Error: TemplateID : ${ptemplateID} ${JSON.stringify(result)}`);
  // A    }
  // A  } catch (error) {
  // A    console.log(error);
  // A    setAlertMessage({
  // A      type: "error",
  // A      message: "Something went Wrong! Error Code : 442",
  // A    });
  // A  }
  // A };

  const updateStatusSupportTicket = async () => {
    debugger;
    try {
      const formData = {
        farmerSupportTicketID: ticketData.FarmerSupportTicketID,
        ticketStatusID: formValuesTicketProperties.txtTicketStatus.CommonMasterValueID,
      };
      const result = await farmerTicketStatusUpdate(formData);
      if (result.response.responseCode === 1) {
        ticketData.TicketStatusID = formValuesTicketProperties.txtTicketStatus.CommonMasterValueID;
        ticketData.TicketStatus = formValuesTicketProperties.txtTicketStatus.CommonMasterValue;
        setReplyBoxCollapsed(!replyBoxCollapsed);
        // A if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109025") {
        // A  SendSMSToFarmerAgaintSupportTicket("C", ticketData.RequestorMobileNo, ticketData.SupportTicketNo);
        // A }
        setFormValuesTicketProperties({
          ...formValuesTicketProperties,
          txtTicketStatus: {
            CommonMasterValueID: formValuesTicketProperties.txtTicketStatus.CommonMasterValueID,
            CommonMasterValue: formValuesTicketProperties.txtTicketStatus.CommonMasterValue,
            BMCGCode: formValuesTicketProperties.txtTicketStatus.BMCGCode,
          },
        });
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };

  const [btnLoaderActive1, setBtnLoaderActive1] = useState(false);
  const handleSave = async (e) => {
    debugger;
    if (e) e.preventDefault();
    let popUpMsg = "";
    if (value === "" || value === "<p><p>") {
      popUpMsg = "Ticket comment is required!";
      setAlertMessage({
        type: "warning",
        message: popUpMsg,
      });
      return;
    }
    if (formValuesTicketProperties.txtTicketStatus !== null) {
      // Anil const chkAccessALL = ticketData && ticketData.AccessALL ? ticketData.AccessALL : "";

      // Anil const chkRightResolved =
      // Anil   ticketData && ticketData.RightResolved && ticketData.RightResolved === 1
      // Anil     ? true
      //  Anil    : ticketData.RightResolved === 0
      // Anil    ? false
      // Anil    : ticketData.RightResolved === undefined
      // Anil    ? ""
      // Anil    : "";
      // Anil if (chkAccessALL === "E") {
      // Anil  if (chkRightResolved === false) {
      // Anil    setAlertMessage({
      //  Anil     type: "warning",
      //  Anil     message: "You do not have right to change status!",
      //  Anil   });
      //  Anil   return;
      //  Anil }
      // Anil }

      // Anil if (chkAccessALL === "N") {
      // Anil  if (chkRightResolved === false) {
      // Anil    setAlertMessage({
      // Anil      type: "warning",
      // Anil      message: "You do not have right to change status!",
      //  Anil   });
      //  Anil   return;
      // Anil  }
      // Anil }
      if (ticketData.TicketStatusID === formValuesTicketProperties.txtTicketStatus.CommonMasterValueID) {
        setAlertMessage({
          type: "warning",
          message: "Same status is not allowed to change the ticket status",
        });
        return;
      }

      if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109025") {
        if (resolvedTicketRight === false) {
          setAlertMessage({
            type: "warning",
            message: "You do not have right to resolve the ticket!",
          });
          return;
        }
      }
      const user = getSessionStorage("user");
      const ChkBRHeadTypeID = user && user.BRHeadTypeID ? user.BRHeadTypeID.toString() : "0";
      const ChkAppAccessTypeID = user && user.AppAccessTypeID ? user.AppAccessTypeID.toString() : "0";

      if (ChkBRHeadTypeID === "124001" || ChkBRHeadTypeID === "124002") {
        if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109025") {
          setAlertMessage({
            type: "warning",
            message: "CSC user can not resolved the ticket ",
          });
          return;
        }
        if (ticketData.TicketStatusID.toString() === "109303") {
          if (
            formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109014" ||
            formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109019"
          ) {
            setAlertMessage({
              type: "warning",
              message: "CSC user can not change the status(In-Progress or Open) or  if status is resolved ",
            });
            return;
          }

          if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109026") {
            if (ticketData.TicketHeaderID.toString() === "2") {
              setAlertMessage({
                type: "warning",
                message: "CSC user can not Re-Open the ticket with ticket type(Information) ",
              });
              return;
            }
          }
        }
      }

      if (ChkBRHeadTypeID === "124003") {
        if (ChkAppAccessTypeID === "472") {
          if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109019") {
            setAlertMessage({
              type: "warning",
              message: "Insurance admin user can not Open the ticket ",
            });
            return;
          }

          if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109026") {
            setAlertMessage({
              type: "warning",
              message: "Insurance admin user can not Re-Open the ticket ",
            });
            return;
          }
        }
        if (ChkAppAccessTypeID === "503") {
          if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109019") {
            setAlertMessage({
              type: "warning",
              message: "Insurance user can not Open the ticket ",
            });
            return;
          }

          if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109026") {
            setAlertMessage({
              type: "warning",
              message: "Insurance user can not Re-Open the ticket ",
            });
            return;
          }

          if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109025") {
            setAlertMessage({
              type: "warning",
              message: "Insurance user can not Resolved the ticket ",
            });
            return;
          }
        }
      }
    }
    try {
      // Anil Code not in use
      // Anil let SaveTicketStatusID = "0";
      // Anil SaveTicketStatusID = ticketData.TicketStatusID;

      const formData = {
        ticketHistoryID: 0,
        farmerSupportTicketID: ticketData.FarmerSupportTicketID,
        agentUserID: ticketData.AgentUserID ? ticketData.AgentUserID : "0",
        ticketStatusID: formValuesTicketProperties.txtTicketStatus.CommonMasterValueID,
        ticketDescription: value,
        hasDocument: 0,
      };
      setBtnLoaderActive1(true);
      const result = await addFarmerSupportTicketReview(formData);
      setBtnLoaderActive1(false);
      if (result.response.responseCode === 1) {
        if (result.response && result.response.responseData && result.response.responseData.TicketHistoryID) {
          const ip = await publicIp.v4();
          const user = getSessionStorage("user");
          const newlyAddedEntry = {
            CreatedBY: user && user.UserDisplayName ? user.UserDisplayName.toString() : "",
            AgentUserID: ticketData.AgentUserID ? ticketData.AgentUserID : "0",
            HasDocument: 0,
            InsertIPAddress: ip,
            InsertUserID: user && user.LoginID ? user.LoginID.toString() : "0",
            SupportTicketID: ticketData.SupportTicketID,
            TicketDescription: value,
            TicketHistoryDate: moment().utcOffset("+05:30").format("YYYY-MM-DDTHH:mm:ss"),
            TicketStatusID: formValuesTicketProperties.txtTicketStatus.CommonMasterValueID,
            IsNewlyAdded: true,
          };
          updateTicketHistorytData(newlyAddedEntry);

          ticketData.TicketStatusID = formValuesTicketProperties.txtTicketStatus.CommonMasterValueID;
          ticketData.TicketStatus = formValuesTicketProperties.txtTicketStatus.CommonMasterValue;

          setFormValuesTicketProperties({
            ...formValuesTicketProperties,
            txtTicketStatus: {
              CommonMasterValueID: formValuesTicketProperties.txtTicketStatus.CommonMasterValueID,
              CommonMasterValue: formValuesTicketProperties.txtTicketStatus.CommonMasterValue,
              BMCGCode: formValuesTicketProperties.txtTicketStatus.BMCGCode,
            },
          });
          setValue("<p></p>");
          setWordcount(0);
          setReplyBoxCollapsed(!replyBoxCollapsed);
          setAlertMessage({
            type: "success",
            message: result.response.responseMessage,
          });
          // A if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109025") {
          // A  SendSMSToFarmerAgaintSupportTicket("C", ticketData.RequestorMobileNo, ticketData.SupportTicketNo);
          // A} else if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109026") {
          // A  SendSMSToFarmerAgaintSupportTicket("R", ticketData.RequestorMobileNo, ticketData.SupportTicketNo);
          // A}
        }
      } else {
        setAlertMessage({
          type: "warning",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };
  const [ticketStatusList, setTicketStatusList] = useState([]);
  const [isLoadingTicketStatusList, setIsTicketStatusList] = useState(false);
  const getTicketStatusListData = async () => {
    debugger;
    try {
      setTicketStatusList([]);
      setIsTicketStatusList(true);
      const formdata = {
        filterID: 109,
        filterID1: 0,
        masterName: "COMMVAL",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBinding(formdata);
      console.log(result, "ticketStatus");
      setIsTicketStatusList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setTicketStatusList(result.response.responseData.masterdatabinding);
        } else {
          setTicketStatusList([]);
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };

  const [bankDropdownDataList, setBankDropdownDataList] = useState([]);
  const [isLoadingBankDropdownDataList, setIsLoadingBankDropdownDataList] = useState(false);
  const getBankListData = async () => {
    debugger;
    try {
      setIsLoadingBankDropdownDataList(true);
      const formdata = {
        filterID: 124004,
        filterID1: 0,
        masterName: "CMPLST",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBinding(formdata);
      console.log(result, "Bank Data");
      setIsLoadingBankDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
            setBankDropdownDataList(result.response.responseData.masterdatabinding);
          } else {
            setBankDropdownDataList([]);
          }
        } else {
          setBankDropdownDataList([]);
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };

  const [btnloaderStatusTicketActive, setBtnloaderStatusTicketActive] = useState(false);
  const updateStatusSupportTicketOnClick = async () => {
    debugger;
    try {
      const chkAccessALL = ticketData && ticketData.AccessALL ? ticketData.AccessALL : "";

      const chkRightResolved =
        ticketData && ticketData.RightResolved && ticketData.RightResolved === 1
          ? true
          : ticketData.RightResolved === 0
          ? false
          : ticketData.RightResolved === undefined
          ? ""
          : "";
      if (chkAccessALL === "E") {
        if (chkRightResolved === false) {
          setAlertMessage({
            type: "warning",
            message: "You do not have right to change status!",
          });
          return;
        }
      }

      if (chkAccessALL === "N") {
        if (chkRightResolved === false) {
          setAlertMessage({
            type: "warning",
            message: "You do not have right to change status!",
          });
          return;
        }
      }
      const user = getSessionStorage("user");
      const ChkBRHeadTypeID = user && user.BRHeadTypeID ? user.BRHeadTypeID.toString() : "0";
      const ChkAppAccessTypeID = user && user.AppAccessTypeID ? user.AppAccessTypeID.toString() : "0";

      if (ChkBRHeadTypeID === "124001" || ChkBRHeadTypeID === "124002") {
        if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109025") {
          setAlertMessage({
            type: "warning",
            message: "CSC user can not resolved the ticket ",
          });
          return;
        }
        if (ticketData.TicketStatusID.toString() === "109303") {
          if (
            formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109014" ||
            formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109019"
          ) {
            setAlertMessage({
              type: "warning",
              message: "CSC user can not change the status(In-Progress or Open) or  if status is resolved ",
            });
            return;
          }

          if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109026") {
            if (ticketData.TicketHeaderID.toString() === "2") {
              setAlertMessage({
                type: "warning",
                message: "CSC user can not Re-Open the ticket with ticket type(Information) ",
              });
              return;
            }
          }
        }
      }

      if (ChkBRHeadTypeID === "124003") {
        if (ChkAppAccessTypeID === "472") {
          if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109019") {
            setAlertMessage({
              type: "warning",
              message: "Insurance admin user can not Open the ticket ",
            });
            return;
          }

          if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109026") {
            setAlertMessage({
              type: "warning",
              message: "Insurance admin user can not Re-Open the ticket ",
            });
            return;
          }
        }
        if (ChkAppAccessTypeID === "503") {
          if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109019") {
            setAlertMessage({
              type: "warning",
              message: "Insurance user can not Open the ticket ",
            });
            return;
          }

          if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109026") {
            setAlertMessage({
              type: "warning",
              message: "Insurance user can not Re-Open the ticket ",
            });
            return;
          }

          if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109025") {
            setAlertMessage({
              type: "warning",
              message: "Insurance user can not Resolved the ticket ",
            });
            return;
          }
        }
      }

      const formData = {
        farmerSupportTicketID: ticketData.FarmerSupportTicketID,
        ticketStatusID: formValuesTicketProperties.txtTicketStatus.CommonMasterValueID,
      };
      setBtnloaderStatusTicketActive(true);
      const result = await farmerTicketStatusUpdate(formData);
      setBtnloaderStatusTicketActive(false);
      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });
        ticketData.TicketStatusID = formValuesTicketProperties.txtTicketStatus.CommonMasterValueID;
        ticketData.TicketStatus = formValuesTicketProperties.txtTicketStatus.CommonMasterValue;
        // A if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109025") {
        // A  SendSMSToFarmerAgaintSupportTicket("C", ticketData.RequestorMobileNo, ticketData.SupportTicketNo);
        // A }
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };

  return {
    value,
    setValue,
    replyBoxCollapsed,
    setReplyBoxCollapsed,
    ticketStatusBtn,
    setTicketStatusBtn,
    chatListDetails,
    isLoadingchatListDetails,
    getChatListDetailsData,
    ticketData,
    handleSave,
    formValuesTicketProperties,
    updateStateTicketProperties,
    ticketStatusList,
    isLoadingTicketStatusList,
    getTicketStatusListData,
    bankDropdownDataList,
    isLoadingBankDropdownDataList,
    getBankListData,
    btnloaderStatusTicketActive,
    updateStatusSupportTicketOnClick,
    // Anil funstion not in use
    updateStatusSupportTicket,
    // Anil funstion not in use
    showMoreChatListOnClick,
    handleSaveOld,
    wordcount,
    setWordcount,
    btnLoaderActiveOld,
    btnLoaderActive1,
  };
}

export default MyTicketLogics;
