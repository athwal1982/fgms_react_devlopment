import { useEffect, useState } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { getSessionStorage, getUserRightCodeAccess } from "Components/Common/Login/Auth/auth";
import { getMasterDataBinding, AddBulkSupportTicketReviewData } from "../../../../Services/Methods";

function TicketStatusLogic() {
  const [value, setValue] = useState("<p></p>");
  const [wordcount, setWordcount] = useState(0);

  const setAlertMessage = AlertMessage();
  const resolvedTicketRight = getUserRightCodeAccess("mdh9");

  const [formValuesReplyOnTickets, setFormValuesReplyOnTickets] = useState({
    txtTicketStatus: null,
  });

  const updateStateReplyOnTickets = (name, value) => {
    setFormValuesReplyOnTickets({ ...formValuesReplyOnTickets, [name]: value });
  };

  const [btnLoaderActive, setBtnLoaderActive] = useState(false);
  const handleSave = async (selectedTicketsData, showfunc, updateReplyOnMultipleTicket) => {
    debugger;
    let popUpMsg = "";
    if (value === "" || value === "<p></p>") {
      popUpMsg = "Ticket comment is required!";
      setAlertMessage({
        type: "error",
        message: popUpMsg,
      });
      return;
    }
    if (formValuesReplyOnTickets.txtTicketStatus === null) {
      setAlertMessage({
        type: "error",
        message: "Ticket Staus is required!",
      });
      return;
    }
    if (formValuesReplyOnTickets.txtTicketStatus.BMCGCode.toString() === "109025") {
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
      if (formValuesReplyOnTickets.txtTicketStatus.BMCGCode.toString() === "109025") {
        setAlertMessage({
          type: "warning",
          message: "CSC user can not resolved the ticket ",
        });
        return;
      }
      if (formValuesReplyOnTickets.txtTicketStatus.BMCGCode.toString() === "109014") {
        setAlertMessage({
          type: "warning",
          message: "CSC user can not change the ticket status(In-Progress)",
        });
        return;
      }
    }
    if (ChkBRHeadTypeID === "124003") {
      if (ChkAppAccessTypeID === "472") {
        if (formValuesReplyOnTickets.txtTicketStatus.BMCGCode.toString() === "109019") {
          setAlertMessage({
            type: "warning",
            message: "Insurance admin user can not Open the ticket ",
          });
          return;
        }

        if (formValuesReplyOnTickets.txtTicketStatus.BMCGCode.toString() === "109026") {
          setAlertMessage({
            type: "warning",
            message: "Insurance admin user can not Re-Open the ticket ",
          });
          return;
        }
      }
      if (ChkAppAccessTypeID === "503") {
        if (formValuesReplyOnTickets.txtTicketStatus.BMCGCode.toString() === "109019") {
          setAlertMessage({
            type: "warning",
            message: "Insurance user can not Open the ticket ",
          });
          return;
        }

        if (formValuesReplyOnTickets.txtTicketStatus.BMCGCode.toString() === "109026") {
          setAlertMessage({
            type: "warning",
            message: "Insurance user can not Re-Open the ticket ",
          });
          return;
        }

        if (formValuesReplyOnTickets.txtTicketStatus.BMCGCode.toString() === "109025") {
          setAlertMessage({
            type: "warning",
            message: "Insurance user can not Resolved the ticket ",
          });
          return;
        }
      }
    }
    let rtnval = true;
    for (let i = 0; i < selectedTicketsData.length; i += 1) {
      if (!rtnval) {
        return;
      }
      if (selectedTicketsData[i].TicketStatusID === formValuesReplyOnTickets.txtTicketStatus.CommonMasterValueID) {
        setAlertMessage({
          open: true,
          type: "warning",
          message: "Same status is not allowed to change the ticket status",
        });
        rtnval = false;
        break;
      }
      if (selectedTicketsData[i].TicketStatusID.toString() === "109303") {
        if (
          formValuesReplyOnTickets.txtTicketStatus.BMCGCode.toString() === "109014" ||
          formValuesReplyOnTickets.txtTicketStatus.BMCGCode.toString() === "109019"
        ) {
          setAlertMessage({
            type: "warning",
            message: "CSC user can not change the status(In-Progress or Open) or  if status is resolved ",
          });
          rtnval = false;
          break;
        }

        if (formValuesReplyOnTickets.txtTicketStatus.BMCGCode.toString() === "109026") {
          if (selectedTicketsData[i].TicketHeaderID.toString() === "2") {
            setAlertMessage({
              type: "warning",
              message: "CSC user can not Re-Open the ticket with ticket type(Information) ",
            });
            rtnval = false;
            break;
          }
        }
      }

      if (selectedTicketsData[i].TicketStatusID.toString() === "109014") {
        if (formValuesReplyOnTickets.txtTicketStatus.BMCGCode.toString() === "109026") {
          setAlertMessage({
            type: "warning",
            message: "CSC user can not Re-Open the ticket if status is In-Progress",
          });
          rtnval = false;
          break;
        }
      }
    }
    if (rtnval === true) {
      const supportTicketIDs = selectedTicketsData
        .map((data) => {
          return data.SupportTicketID;
        })
        .join(",");
      try {
        const formData = {
          ticketHistoryID: 0,
          supportTicketID: supportTicketIDs,
          agentUserID: user && user.LoginID ? user.LoginID.toString() : "1",
          ticketStatusID: formValuesReplyOnTickets.txtTicketStatus.CommonMasterValueID,
          ticketDescription: value,
          hasDocument: 0,
        };
        setBtnLoaderActive(true);
        const result = await AddBulkSupportTicketReviewData(formData);
        setBtnLoaderActive(false);
        if (result.responseCode === 1) {
          selectedTicketsData.forEach((val) => {
            val.TicketStatus = formValuesReplyOnTickets.txtTicketStatus.CommonMasterValue;
            val.TicketStatusID = formValuesReplyOnTickets.txtTicketStatus.CommonMasterValueID;
            val.IsRowUpdated = 1;
          });
          updateReplyOnMultipleTicket(selectedTicketsData, formValuesReplyOnTickets.txtTicketStatus.CommonMasterValueID);
          setValue("<p></p>");
          setWordcount(0);
          showfunc();
          setAlertMessage({
            type: "success",
            message: result.responseMessage,
          });
        }
      } catch (error) {
        console.log(error);
        setAlertMessage({
          type: "error",
          message: error,
        });
      }
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
  useEffect(() => {
    console.log(value);
    getTicketStatusListData();
  }, [value]);

  return {
    value,
    setValue,
    handleSave,
    formValuesReplyOnTickets,
    updateStateReplyOnTickets,
    ticketStatusList,
    isLoadingTicketStatusList,
    getTicketStatusListData,
    wordcount,
    setWordcount,
    btnLoaderActive,
  };
}

export default TicketStatusLogic;
