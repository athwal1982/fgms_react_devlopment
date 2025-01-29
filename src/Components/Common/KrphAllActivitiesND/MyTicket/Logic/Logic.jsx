import { useEffect, useState } from "react";
import moment from "moment";
import publicIp from "public-ip";
// A import Config from "Configration/Config.json";
// A import { getCurrentDateTimeTick } from "Configration/Utilities/dateformat";
import { getSessionStorage, getUserRightCodeAccess } from "Components/Common/Login/Auth/auth";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import {
  getSupportTicketReview,
  addSupportTicketReview,
  getMasterDataBinding,
  ticketStatusUpdate,
  editSupportTicketReview,
  addCSCSupportTicketReview,
} from "../Services/Services";
import { getFarmerPolicyDetail, sendSMSToFarmer } from "../../../../Modules/Support/ManageTicket/Views/Modals/AddTicket/Services/Methods";

function MyTicketLogics() {
  const [value, setValue] = useState("<p></p>");
  const [replyBoxCollapsed, setReplyBoxCollapsed] = useState(true);
  const [wordcount, setWordcount] = useState(0);

  const resolvedTicketRight = getUserRightCodeAccess("mdh9");
  const setAlertMessage = AlertMessage();
  // A const fileRef = useRef(null);

  const [formValuesTicketProperties, setFormValuesTicketProperties] = useState({
    txtTicketStatus: null,
    // A txtDocumentUpload: "",
    txtBankName: null,
  });

  // A const [formValidationSupportTicketReviewError, setFormValidationSupportTicketReviewError] = useState({});

  // A const validateFieldSupportTicketReview = (name, value) => {
  // A  let errorsMsg = "";
  // A  if (name === "txtDocumentUpload") {
  // A    if (value && typeof value !== "undefined") {
  // A      const regex = new RegExp("^[a-zA-Z0-9_.-]*$");
  // A      if (!regex.test(value.name)) {
  // A        errorsMsg = "Attachment name is not in valid format.";
  // A      }
  // A    }
  // A  }
  // A  return errorsMsg;
  // A };

  // A const handleValidationSupportTicketReview = () => {
  // A  try {
  // A    const errors = {};
  // A    let formIsValid = true;
  // A    errors["txtDocumentUpload"] = validateFieldSupportTicketReview("txtDocumentUpload", formValuesTicketProperties.txtDocumentUpload);
  // A    if (Object.values(errors).join("").toString()) {
  // A      formIsValid = false;
  // A    }
  // A    setFormValidationSupportTicketReviewError(errors);
  // A    return formIsValid;
  // A  } catch (error) {
  // A    setAlertMessage({
  // A      type: "error",
  // A      message: "Something Went Wrong",
  // A    });
  // A    return false;
  // A  }
  // A };

  const updateStateTicketProperties = (name, value) => {
    setFormValuesTicketProperties({ ...formValuesTicketProperties, [name]: value });
    // A formValidationSupportTicketReviewError[name] = validateFieldSupportTicketReview(name, value);
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
        supportTicketID: pticketData.SupportTicketID,
        pageIndex: pPageIndex,
        pageSize: pPageSize,
      };
      const result = await getSupportTicketReview(formdata);
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

  const [selectedPolicyDetails, setSelectedPolicyDetails] = useState([]);
  const getPolicyDetailsOfFarmer = async (pticketData) => {
    try {
      debugger;

      debugger;
      let result = "";
      let formData = "";

      formData = {
        mobilenumber: "7776543289",
        seasonID: pticketData && pticketData.RequestSeason ? pticketData.RequestSeason.toString() : "",
        year: pticketData && pticketData.RequestYear ? pticketData.RequestYear.toString() : "",
        farmerID: pticketData ? pticketData.TicketRequestorID : "",
      };
      result = await getFarmerPolicyDetail(formData);
      console.log(result, "applicationData");
      setSelectedPolicyDetails([]);
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          if (Object.keys(result.response.responseData.data).length > 0) {
            const farmersData = Object.values(result.response.responseData.data);
            if (farmersData && farmersData.length > 0) {
              const farmerAndApplicationData = [];
              farmersData.forEach((v) => {
                v.applicationList.forEach((x) => {
                  farmerAndApplicationData.push({
                    mobile: v.mobile,
                    farmerName: v.farmerName,
                    farmerID: v.farmerID,
                    aadharNumber: v.aadharNumber,
                    accountNumber: v.accountNumber,
                    relation: v.relation,
                    relativeName: v.relativeName,
                    resDistrict: v.resDistrict,
                    resState: v.resState,
                    resVillage: v.resVillage,
                    resSubDistrict: v.resSubDistrict,
                    resDistrictID: v.resDistrictID,
                    resStateID: v.resStateID,
                    resVillageID: v.resVillageID,
                    resSubDistrictID: v.resSubDistrictID,
                    policyPremium: parseFloat(v.policyPremium).toFixed(2),
                    policyArea: v.policyArea,
                    policyType: v.policyType,
                    scheme: v.scheme,
                    insuranceCompanyName: v.insuranceCompanyName,
                    policyID: x.policyID,
                    applicationStatus: x.applicationStatus,
                    applicationStatusCode: x.applicationStatusCode,
                    applicationNo: x.applicationNo,
                    landSurveyNumber: x.landSurveyNumber,
                    landDivisionNumber: x.landDivisionNumber,
                    applicationSource: x.applicationSource,
                    plotStateName: x.plotStateName,
                    plotDistrictName: x.plotDistrictName,
                    plotVillageName: x.plotVillageName,
                    cropName: x.cropName,
                    cropShare: parseFloat(x.cropShare).toFixed(3),
                    createdAt: x.createdAt,
                    ifscCode: x.ifscCode,
                    farmerShare: x.farmerShare,
                    sowingDate: x.sowingDate,
                  });
                });
              });
              const filteredData = farmerAndApplicationData.filter((data) => {
                return data.applicationNo === pticketData.ApplicationNo && data.policyID === pticketData.InsurancePolicyNo;
              });
              setSelectedPolicyDetails(filteredData);
            } else {
              setSelectedPolicyDetails([]);
            }
          } else {
            setSelectedPolicyDetails([]);
          }
        } else {
          setSelectedPolicyDetails([]);
        }
      } else {
        setSelectedPolicyDetails([]);
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
        supportTicketID: ticketData.SupportTicketID,
        agentUserID: ticketData.AgentUserID ? ticketData.AgentUserID : "0",
        ticketStatusID: SaveTicketStatusID,
        ticketDescription: value,
        hasDocument: 0,
      };
      setBtnLoaderActiveOld(true);
      const result = await addSupportTicketReview(formData);
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

  const SendSMSToFarmerAgaintSupportTicket = async (ptemplateID, pmobileNO, psupportTicketNo) => {
    try {
      debugger;
      const formData = {
        templateID: ptemplateID,
        mobileNO: pmobileNO,
        supportTicketNo: psupportTicketNo,
      };

      const result = await sendSMSToFarmer(formData);
      if (result.response.responseCode === 1) {
        console.log(`Success: TemplateID : ${ptemplateID} ${JSON.stringify(result)}`);
      } else {
        console.log(`Error: TemplateID : ${ptemplateID} ${JSON.stringify(result)}`);
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };

  // A const handleResetFile = async () => {
  // A  fileRef.current.value = null;
  // A  setFormValidationSupportTicketReviewError({});
  // A };

  const updateStatusSupportTicket = async () => {
    debugger;
    try {
      const formData = {
        supportTicketID: ticketData.SupportTicketID,
        ticketStatusID: formValuesTicketProperties.txtTicketStatus.CommonMasterValueID,
      };
      const result = await ticketStatusUpdate(formData);
      if (result.response.responseCode === 1) {
        ticketData.TicketStatusID = formValuesTicketProperties.txtTicketStatus.CommonMasterValueID;
        ticketData.TicketStatus = formValuesTicketProperties.txtTicketStatus.CommonMasterValue;
        setReplyBoxCollapsed(!replyBoxCollapsed);
        if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109025") {
          SendSMSToFarmerAgaintSupportTicket("C", ticketData.RequestorMobileNo, ticketData.SupportTicketNo);
        }
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
    if (value === "" || value === "<p></p>") {
      popUpMsg = "Ticket comment is required!";
      setAlertMessage({
        type: "warning",
        message: popUpMsg,
      });
      return;
    }
    // A if (!handleValidationSupportTicketReview()) {
    // A  return;
    // A }
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
        if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109014") {
          setAlertMessage({
            type: "warning",
            message: "CSC user can not change the ticket status(In-Progress)",
          });
          return;
        }
        if (ticketData.TicketStatusID.toString() === "109014") {
          if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109026") {
            setAlertMessage({
              type: "warning",
              message: "CSC user can not Re-Open the ticket if status is In-Progress",
            });
            return;
          }
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
      // A const pAttachment =
      // A  formValuesTicketProperties.txtDocumentUpload && formValuesTicketProperties.txtDocumentUpload ? formValuesTicketProperties.txtDocumentUpload : "";
      // A const UniqueDateTimeTick = getCurrentDateTimeTick();
      // A let pAttachmentName = "";
      // A let pAttachmentPath = "";
      // A let pAttachmentDirPath = "";
      // A let phasDocument = 0;
      // A if (pAttachment !== "") {
      // A  phasDocument = 1;
      // A  const val = pAttachment.name;
      // A  const valExtension = val.substring(val.lastIndexOf(".")).toLowerCase().slice(1);
      // A  const valSpilt = val.split(".");
      // A  const ValOrgName = valSpilt[0].toString();
      // A  pAttachmentName = `${UniqueDateTimeTick}_${ValOrgName}.${valExtension}`;
      // A  pAttachmentPath = `${ticketData.TicketRequestorID}/${ticketData.SupportTicketNo}/${pAttachmentName}`;
      // A  pAttachmentDirPath = `${ticketData.TicketRequestorID}/${ticketData.SupportTicketNo}/`;
      // A  switch (valExtension) {
      // A    case "jpeg":
      // A    case "jpg":
      // A    case "png":
      // A    case "pdf":
      // A      break;
      // A    default:
      // A      setAlertMessage({
      // A        type: "error",
      // A        message: "Please select only jpeg,jpg,png,pdf extension attachment.",
      // A      });
      // A      return;
      // A  }
      // A  if (pAttachment.size > 2000000) {
      // A    setAlertMessage({
      // A      type: "error",
      // A      message: "Please upload less than 2MB or 2MB attachment!",
      // A    });
      // A    return;
      // A  }
      // A }
      const formData = {
        ticketHistoryID: 0,
        supportTicketID: ticketData.SupportTicketID,
        agentUserID: ticketData.AgentUserID ? ticketData.AgentUserID : "0",
        ticketStatusID: formValuesTicketProperties.txtTicketStatus.CommonMasterValueID,
        ticketDescription: value,
        hasDocument: 0,
        // A hasDocument: phasDocument,
        // A ticketHistoryAttachment: `krph_documents/${pAttachmentPath}`,
      };
      setBtnLoaderActive1(true);
      const result = await addSupportTicketReview(formData);
      setBtnLoaderActive1(false);
      if (result.response.responseCode === 1) {
        if (result.response && result.response.responseData && result.response.responseData.TicketHistoryID) {
          const ip = await publicIp.v4();
          const user = getSessionStorage("user");
          const newlyAddedEntry = {
            CreatedBY: user && user.UserDisplayName ? user.UserDisplayName.toString() : "",
            AgentUserID: ticketData.AgentUserID ? ticketData.AgentUserID : "0",
            // A HasDocument: phasDocument,
            HasDocument: 0,
            InsertIPAddress: ip,
            InsertUserID: user && user.LoginID ? user.LoginID.toString() : "0",
            SupportTicketID: ticketData.SupportTicketID,
            TicketDescription: value,
            TicketHistoryDate: moment().utcOffset("+05:30").format("YYYY-MM-DDTHH:mm:ss"),
            TicketStatusID: formValuesTicketProperties.txtTicketStatus.CommonMasterValueID,
            // A TicketHistoryAttachment: `${Config.BaseUrl}krph_documents/${pAttachmentPath}`,
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
          // A if (pAttachment !== "") {
          // A  const formDataDoc = new FormData();
          // A  formDataDoc.append("ImgPath", pAttachmentDirPath);
          // A  formDataDoc.append("files", pAttachment);
          // A  formDataDoc.append("ImageName", pAttachmentName);

          // A  try {
          // A    const resultDoc = await UploadDocumentData(formDataDoc);
          // A    console.log(resultDoc);
          // A    handleResetFile();
          // A  } catch (error) {
          // A    console.log(error);
          // A  }
          // A }
          if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109025") {
            SendSMSToFarmerAgaintSupportTicket("C", ticketData.RequestorMobileNo, ticketData.SupportTicketNo);
          } else if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109026") {
            SendSMSToFarmerAgaintSupportTicket("R", ticketData.RequestorMobileNo, ticketData.SupportTicketNo);
          }
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
        if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109014") {
          setAlertMessage({
            type: "warning",
            message: "CSC user can not change the ticket status(In-Progress)",
          });
          return;
        }
        if (ticketData.TicketStatusID.toString() === "109014") {
          if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109026") {
            setAlertMessage({
              type: "warning",
              message: "CSC user can not Re-Open the ticket if status is In-Progress",
            });
            return;
          }
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
        supportTicketID: ticketData.SupportTicketID,
        ticketStatusID: formValuesTicketProperties.txtTicketStatus.CommonMasterValueID,
      };
      setBtnloaderStatusTicketActive(true);
      const result = await ticketStatusUpdate(formData);
      setBtnloaderStatusTicketActive(false);
      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });
        ticketData.TicketStatusID = formValuesTicketProperties.txtTicketStatus.CommonMasterValueID;
        ticketData.TicketStatus = formValuesTicketProperties.txtTicketStatus.CommonMasterValue;
        if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109025") {
          SendSMSToFarmerAgaintSupportTicket("C", ticketData.RequestorMobileNo, ticketData.SupportTicketNo);
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

  const [valueEditTicketComment, setValueEditTicketComment] = useState("<p></p>");
  const [wordcountEditTicketComment, setWordcountEditTicketComment] = useState(0);
  const [selectedHistoryData, setSelectedHistoryData] = useState();
  const [btnLoaderActiveEditTicketComment, setbtnLoaderActiveEditTicketComment] = useState(false);
  const handleSaveEditTicketComment = async (toggleEditTicketCommentModal) => {
    debugger;
    console.log(ticketData);
    if (valueEditTicketComment === "" || valueEditTicketComment === "<p></p>" || valueEditTicketComment === "<p><br></p>") {
      popUpMsg = "Ticket comment is required!";
      setAlertMessage({
        type: "warning",
        message: popUpMsg,
      });
      return;
    }

    try {
      const formData = {
        ticketHistoryID: selectedHistoryData.TicketHistoryID,
        supportTicketID: selectedHistoryData.SupportTicketID,
        ticketDescription: valueEditTicketComment,
      };
      setbtnLoaderActiveEditTicketComment(true);
      const result = await editSupportTicketReview(formData);
      setbtnLoaderActiveEditTicketComment(FaLaptopHouse);
      if (result.response.responseCode === 1) {
        for (let i = 0; i < chatListDetails.length; i += 1) {
          if (selectedHistoryData.TicketHistoryID === chatListDetails[i].TicketHistoryID) {
            chatListDetails[i].TicketDescription = valueEditTicketComment;
            break;
          }
        }
        setChatListDetails(chatListDetails);
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });
        toggleEditTicketCommentModal();
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
        message: error,
      });
    }
  };

  const [btnLoaderActiveComment, setbtnLoaderActiveComment] = useState(false);
  const handleAddComment = async (e) => {
    debugger;
    try {
      if (e) e.preventDefault();
      let popUpMsg = "";
      if (value === "" || value === "<p></p>") {
        popUpMsg = "Ticket comment is required!";
        setAlertMessage({
          type: "warning",
          message: popUpMsg,
        });
        return;
      }
      const formData = {
        ticketHistoryID: 0,
        supportTicketID: ticketData.SupportTicketID,
        agentUserID: ticketData.AgentUserID ? ticketData.AgentUserID : "0",
        ticketStatusID: ticketData && ticketData.TicketStatusID ? ticketData.TicketStatusID : 0,
        ticketDescription: value,
        hasDocument: 0,
        attachmentPath: "",
      };
      setbtnLoaderActiveComment(true);
      const result = await addCSCSupportTicketReview(formData);
      setbtnLoaderActiveComment(false);
      if (result.response.responseCode === 1) {
        if (result.response && result.response.responseData && result.response.responseData.TicketReviewHistoryID) {
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
            TicketStatusID: 0,
            AttachmentPath: "",
            IsNewlyAdded: true,
          };
          updateTicketHistorytData(newlyAddedEntry);
          setValue("<p></p>");
          setWordcount(0);
          setReplyBoxCollapsed(!replyBoxCollapsed);
          setAlertMessage({
            type: "success",
            message: result.response.responseMessage,
          });
        }
      } else {
        setAlertMessage({
          type: "warning",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {}
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
    btnloaderStatusTicketActive,
    updateStatusSupportTicketOnClick,
    // Anil funstion not in use
    updateStatusSupportTicket,
    // Anil funstion not in use
    showMoreChatListOnClick,
    selectedPolicyDetails,
    getPolicyDetailsOfFarmer,
    handleSaveOld,
    wordcount,
    setWordcount,
    btnLoaderActiveOld,
    btnLoaderActive1,
    // A formValidationSupportTicketReviewError,
    valueEditTicketComment,
    setValueEditTicketComment,
    handleSaveEditTicketComment,
    btnLoaderActiveEditTicketComment,
    wordcountEditTicketComment,
    setWordcountEditTicketComment,
    setSelectedHistoryData,
    // A fileRef,
    // A handleResetFile,
    btnLoaderActiveComment,
    handleAddComment,
  };
}

export default MyTicketLogics;
