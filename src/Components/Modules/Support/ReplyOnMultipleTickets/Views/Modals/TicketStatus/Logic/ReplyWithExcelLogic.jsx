import { useState, useRef } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { dateToSpecificFormat, Convert24FourHourAndMinute, getCurrentDateTimeTick } from "Configration/Utilities/dateformat";
import { getSessionStorage, getUserRightCodeAccess } from "Components/Common/Login/Auth/auth";
import * as XLSX from "xlsx";
import publicIp from "public-ip";
import { getExcelBulkTicketsList, excelUploadData } from "../../../../Services/Methods";

function ReplyWithExcelLogic() {
  const setAlertMessage = AlertMessage();
  const resolvedTicketRight = getUserRightCodeAccess("mdh9");
  const fileRef = useRef(null);

  const [formValuesReplyWithExcel, setFormValuesReplyWithExcel] = useState({
    txtDocumentUpload: null,
  });

  const downloadExcel = (data, workSheetColumnWidth, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    // A let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    // A XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    worksheet["!cols"] = workSheetColumnWidth;
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };
  const rearrangeAndRenameColumns = (originalData, columnMapping) => {
    return originalData.map((item) => {
      const rearrangedItem = Object.fromEntries(Object.entries(columnMapping).map(([oldColumnName, newColumnName]) => [newColumnName, item[oldColumnName]]));
      return rearrangedItem;
    });
  };
  const downloadExcelFile = async (pFarmerData) => {
    if (pFarmerData.length > 0) {
      setTimeout(() => {
        const columnOrder = {
          SupportTicketNo: "Ticket No",
          ApplicationNo: "Application No",
          InsurancePolicyNo: "Policy No",
          CallerContactNumber: "Caller Mobile No",
          RequestorName: "Farmer Name",
          RequestorMobileNo: "Mobile No",
          StateMasterName: "State",
          DistrictMasterName: "District",
          InsuranceCompany: "Insurance Company",
          TicketHeadName: "Type",
          TicketTypeName: "Category",
          TicketCategoryName: "Sub Category",
          SchemeName: "Scheme",
          RequestSeason: "Season",
          RequestYear: "Year",
          ApplicationCropName: "Crop Name",
          LossDate: "Crop Loss At",
          CreatedBY: "Created By",
          CreatedAt: "Created At",
          TicketStatus: "Ticket Status",
          Description: "Comments",
        };
        const mappedData = pFarmerData.map((value) => {
          return {
            SupportTicketNo: value.SupportTicketNo,
            ApplicationNo: value.ApplicationNo,
            InsurancePolicyNo: value.InsurancePolicyNo,
            CallerContactNumber: value.CallerContactNumber,
            RequestorName: value.RequestorName,
            RequestorMobileNo: value.RequestorMobileNo,
            StateMasterName: value.StateMasterName,
            DistrictMasterName: value.DistrictMasterName,
            InsuranceCompany: value.InsuranceCompany,
            TicketHeadName: value.TicketHeadName,
            TicketTypeName: value.TicketTypeName,
            TicketCategoryName: value.TicketCategoryName,
            SchemeName: value.SchemeName,
            RequestSeason: value.RequestSeason && value.RequestSeason === 1 ? "Kharif" : value.RequestSeason === 2 ? "Rabi" : "",
            RequestYear: value.RequestYear,
            ApplicationCropName: value.ApplicationCropName,
            LossDate: value.LossDate ? dateToSpecificFormat(value.LossDate.split("T")[0], "DD-MM-YYYY") : "",
            CreatedBY: value.CreatedBY,
            CreatedAt: value.CreatedAt
              ? dateToSpecificFormat(`${value.CreatedAt.split("T")[0]} ${Convert24FourHourAndMinute(value.CreatedAt.split("T")[1])}`, "DD-MM-YYYY HH:mm")
              : "",
            TicketStatus: value.TicketStatus,
            Description: "",
          };
        });
        const rearrangedData = rearrangeAndRenameColumns(mappedData, columnOrder);
        const workSheetColumnWidth = [
          { width: 20 },
          { width: 25 },
          { width: 26 },
          { width: 15 },
          { width: 30 },
          { width: 12 },
          { width: 20 },
          { width: 20 },
          { width: 40 },
          { width: 18 },
          { width: 22 },
          { width: 22 },
          { width: 45 },
          { width: 12 },
          { width: 12 },
          { width: 15 },
          { width: 12 },
          { width: 22 },
          { width: 20 },
          { width: 12 },
          { width: 100 },
        ];
        const UniqueDateTimeTick = getCurrentDateTimeTick();
        downloadExcel(rearrangedData, workSheetColumnWidth, `Farmer_Ticket_Data${UniqueDateTimeTick}`);
      }, 1000);
    } else {
      setAlertMessage({
        type: "error",
        message: "Data not found to download.",
      });
    }
  };

  const [formValidationReplyWithExcelError, setformValidationReplyWithExcelError] = useState({});
  const validateFieldSupportTicket = (name, value) => {
    let errorsMsg = "";
    if (name === "txtDocumentUpload") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "File is required!";
      } else if (value && typeof value !== "undefined") {
        const regex = new RegExp("^[a-zA-Z0-9_.-]*$");
        if (!regex.test(value.name)) {
          errorsMsg = "File name is not in valid format.";
        }
      }
    }

    return errorsMsg;
  };
  const fileType = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
  const [excelFile, setExcelFile] = useState(null);

  const updateStateReplyWithExcel = (name, value) => {
    debugger;
    setFormValuesReplyWithExcel({ ...formValuesReplyWithExcel, [name]: value });
    setformValidationReplyWithExcelError[name] = validateFieldSupportTicket(name, value);
    if (name === "txtDocumentUpload") {
      setExcelFile(null);
      setformValidationReplyWithExcelError({});
      const selectedFile = value;
      if (selectedFile) {
        if (selectedFile && fileType.includes(selectedFile.type)) {
          const reader = new FileReader();
          reader.readAsArrayBuffer(selectedFile);
          reader.onload = (e) => {
            setExcelFile(e.target.result);
          };
        } else {
          setExcelFile(null);
        }
      }
    }
  };
  const handleResetFile = async () => {
    fileRef.current.value = null;
    setformValidationReplyWithExcelError({});
    setFormValuesReplyWithExcel({
      ...formValuesReplyWithExcel,
      txtDocumentUpload: null,
    });
  };
  const handleValidationReplyWithExcel = () => {
    try {
      const errors = {};
      let formIsValid = true;
      debugger;
      errors["txtDocumentUpload"] = validateFieldSupportTicket("txtDocumentUpload", formValuesReplyWithExcel.txtDocumentUpload);
      if (Object.values(errors).join("").toString()) {
        formIsValid = false;
      }
      setformValidationReplyWithExcelError(errors);
      return formIsValid;
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: "Something Went Wrong",
      });
      return false;
    }
  };
  const [btnLoaderActive, setBtnLoaderActive] = useState(false);
  const handleSave = async (showfunc, filterValues, setFarmersTicketData, setSatatusCount, settotalSatatusCount) => {
    debugger;
    if (!handleValidationReplyWithExcel()) {
      return;
    }
    let pAttachmentName = "";
    const pAttachment =
      formValuesReplyWithExcel.txtDocumentUpload && formValuesReplyWithExcel.txtDocumentUpload ? formValuesReplyWithExcel.txtDocumentUpload : "";
    if (pAttachment !== "") {
      const valExtension = pAttachment.name.substring(pAttachment.name.lastIndexOf(".")).toLowerCase().slice(1);
      const val = pAttachment.name;
      const valSpilt = val.split(".");
      const ValOrgName = valSpilt[0].toString();
      pAttachmentName = `${ValOrgName}.${valExtension}`;
      switch (valExtension) {
        case "xlsx":
          break;
        default:
          setAlertMessage({
            type: "error",
            message: "Please select only xlsx extension file.",
          });
          return;
      }
      if (pAttachment.size > 1000000) {
        setAlertMessage({
          type: "error",
          message: "Please upload less than 1MB or 1MB file!",
        });
        return;
      }
    }
    if (excelFile !== null) {
      debugger;
      const workBook = XLSX.read(excelFile, { type: "buffer" });
      const workSheetName = workBook.SheetNames[0];
      const wokrSheet = workBook.Sheets[workSheetName];
      const data = XLSX.utils.sheet_to_json(wokrSheet, {
        header: 0,
        defval: "",
      });
      if (data && data.length > 0) {
        const obj = data[0];
        if (!Object.keys(obj).includes("Ticket No")) {
          setAlertMessage({
            open: true,
            type: "warning",
            message: "Please do not change the Haeder cloumn Ticket No",
          });
          return;
        }
        if (!Object.keys(obj).includes("Type")) {
          setAlertMessage({
            open: true,
            type: "warning",
            message: "Please do not change the Haeder cloumn Type",
          });
          return;
        }
        if (!Object.keys(obj).includes("Ticket Status")) {
          setAlertMessage({
            open: true,
            type: "warning",
            message: "Please do not change the Haeder cloumn Ticket Status",
          });
          return;
        }
        if (!Object.keys(obj).includes("Comments")) {
          setAlertMessage({
            open: true,
            type: "warning",
            message: "Please do not change the Haeder cloumn Comments",
          });
          return;
        }
        const dataForUpload = [];
        let rtnval = true;
        data.forEach((val) => {
          dataForUpload.push({
            supportTicketNo: val["Ticket No"],
            ticketDescription: val.Comments,
            ticketStatusID:
              val["Ticket Status"] === "Open"
                ? 109301
                : val["Ticket Status"] === "In-Progress"
                ? 109302
                : val["Ticket Status"] === "Resolved"
                ? 109303
                : val["Ticket Status"] === "Re-Open"
                ? 109304
                : 0,
            ticketStatus: val["Ticket Status"],
            ticketHeaderID: val.Type === "Grievance" ? 1 : val.Type === "Information" ? 2 : val.Type === "Crop Loss Intimation" ? 4 : 0,
            ticketHeader: val.Type,
          });
        });
        const ip = await publicIp.v4();
        const user = getSessionStorage("user");
        const ChkBRHeadTypeID = user && user.BRHeadTypeID ? user.BRHeadTypeID.toString() : "0";
        const ChkAppAccessTypeID = user && user.AppAccessTypeID ? user.AppAccessTypeID.toString() : "0";
        for (let i = 0; i < dataForUpload.length; i += 1) {
          if (!rtnval) {
            return;
          }
          if (
            dataForUpload[i].ticketHeader !== "Grievance" &&
            dataForUpload[i].ticketHeader !== "Information" &&
            dataForUpload[i].ticketHeader !== "Crop Loss Intimation"
          ) {
            setAlertMessage({
              open: true,
              type: "warning",
              message: `Please use these values(Grievance,Information,Crop Loss Intimation) for Haeder cloumn Type at row no.${i + 1}`,
            });
            rtnval = false;
            break;
          }
          if (
            dataForUpload[i].ticketStatus !== "Open" &&
            dataForUpload[i].ticketStatus !== "In-Progress" &&
            dataForUpload[i].ticketStatus !== "Re-Open" &&
            dataForUpload[i].ticketStatus !== "Resolved"
          ) {
            setAlertMessage({
              open: true,
              type: "warning",
              message: `Please use these values(Open,In-Progress,Re-Open,Resolved) for Haeder cloumn Ticket Status at row no.${i + 1}`,
            });
            rtnval = false;
            break;
          }
          if (dataForUpload[i].ticketStatusID === filterValues.txtStatus.CommonMasterValueID) {
            setAlertMessage({
              open: true,
              type: "warning",
              message: `Same status is not allowed to change the ticket status at row no.${i + 1}`,
            });
            rtnval = false;
            break;
          }
          if (dataForUpload[i].ticketStatusID === 109303) {
            if (resolvedTicketRight === false) {
              setAlertMessage({
                type: "warning",
                message: `You do not have right to resolve the ticket at row no.${i + 1}`,
              });
              rtnval = false;
              break;
            }
          }
          if (ChkBRHeadTypeID === "124001" || ChkBRHeadTypeID === "124002") {
            if (dataForUpload[i].ticketStatusID === 109303) {
              setAlertMessage({
                type: "warning",
                message: `CSC user can not resolve the ticket at row no.${i + 1}`,
              });
              rtnval = false;
              break;
            }
            if (dataForUpload[i].ticketStatusID === 109014) {
              setAlertMessage({
                type: "warning",
                message: `CSC user can not change the ticket status(In-Progress) at row no.${i + 1}`,
              });
              rtnval = false;
              break;
            }
          }
          if (ChkBRHeadTypeID === "124003") {
            if (ChkAppAccessTypeID === "472") {
              if (dataForUpload[i].ticketStatusID === 109301) {
                setAlertMessage({
                  type: "warning",
                  message: `Insurance admin user can not Open the ticket at row no.${i + 1}`,
                });
                rtnval = false;
                break;
              }
              if (dataForUpload[i].ticketStatusID === 109304) {
                setAlertMessage({
                  type: "warning",
                  message: `Insurance admin user can not Re-Open the ticket at row no.${i + 1}`,
                });
                rtnval = false;
                break;
              }
            }
            if (ChkAppAccessTypeID === "503") {
              if (dataForUpload[i].ticketStatusID === 109301) {
                setAlertMessage({
                  type: "warning",
                  message: `Insurance user can not Open the ticket at row no.${i + 1}`,
                });
                rtnval = false;
                break;
              }
              if (dataForUpload[i].ticketStatusID === 109304) {
                setAlertMessage({
                  type: "warning",
                  message: `Insurance user can not Re-Open the ticket t row no.${i + 1}`,
                });
                rtnval = false;
                break;
              }
              if (dataForUpload[i].ticketStatusID === 109303) {
                setAlertMessage({
                  type: "warning",
                  message: `Insurance user can not resolve the ticket t row no.${i + 1}`,
                });
                rtnval = false;
                break;
              }
            }
          }
          if (filterValues.txtStatus.CommonMasterValueID === 109302) {
            if (dataForUpload[i].ticketStatusID === 109304) {
              setAlertMessage({
                type: "warning",
                message: `CSC user can not change the status(Re-Open) if status is In-Progress at row no.${i + 1}`,
              });
              rtnval = false;
              break;
            }
          }
          if (filterValues.txtStatus.CommonMasterValueID === 109303) {
            if (dataForUpload[i].ticketStatusID === 109302 || dataForUpload[i].ticketStatusID === 109301) {
              setAlertMessage({
                type: "warning",
                message: `CSC user can not change the status(In-Progress or Open) or  if status is resolved at row no.${i + 1}`,
              });
              rtnval = false;
              break;
            }
          }
          if (dataForUpload[i].ticketStatusID === 109304) {
            if (dataForUpload[i].ticketHeaderID === 2) {
              setAlertMessage({
                type: "warning",
                message: `CSC user can not Re-Open the ticket with ticket type(Information) at row no.${i + 1}`,
              });
              rtnval = false;
              break;
            }
          }
        }
        if (rtnval === true) {
          try {
            const formDataDoc = new FormData();
            formDataDoc.append("insertedUserID", user && user.LoginID ? user.LoginID.toString() : "0");
            formDataDoc.append("insertedIPAddress", ip);
            formDataDoc.append("ImageName", pAttachmentName);
            formDataDoc.append("files", pAttachment);

            setBtnLoaderActive(true);
            const result = await excelUploadData(formDataDoc);
            setBtnLoaderActive(false);
            if (result.responseCode === 1) {
              showfunc();
              setAlertMessage({
                type: "success",
                message: "Reply with excel file done successfuly.",
              });
              handleResetFile();
              setFarmersTicketData([]);
              setSatatusCount(0);
              settotalSatatusCount(0);
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
              message: error,
            });
          }
          // A try {
          // A  const formdata = {
          // A    tickets: dataForUpload,
          // A    agentUserID: user && user.LoginID ? user.LoginID : 0,
          // A  };
          // A  setBtnLoaderActive(true);
          // A  const result = await getExcelBulkTicketsList(formdata);
          // A  setBtnLoaderActive(false);
          // A  if (result.responseCode === 1) {
          // A    showfunc();
          // A    setAlertMessage({
          // A      type: "success",
          // A      message: "Reply with excel file done successfuly,Please get the result excel file.",
          // A    });
          // A    const columnOrder = {
          // A      TicketNo: "Ticket No",
          // A      error: "Message",
          // A    };
          // A    const mappedData = result.responseData.map((value) => {
          // A      return {
          // A        TicketNo: value.TicketNo,
          // A        error: value.error,
          // A      };
          // A    });
          // A    const rearrangedData = rearrangeAndRenameColumns(mappedData, columnOrder);
          // A    const workSheetColumnWidth = [{ width: 40 }, { width: 70 }];
          // A    const UniqueDateTimeTick = getCurrentDateTimeTick();
          // A    downloadExcel(rearrangedData, workSheetColumnWidth, `Reply_On_Multiple_Tickets_Result${UniqueDateTimeTick}`);
          // A    setFarmersTicketData([]);
          // A    setSatatusCount(0);
          // A    settotalSatatusCount(0);
          // A  } else {
          // A    setAlertMessage({
          // A      type: "error",
          // A      message: result.responseMessage,
          // A    });
          // A  }
          // A} catch (error) {
          // A  console.log(error);
          // A  setAlertMessage({
          // A    type: "error",
          // A    message: error,
          // A  });
          // A }
        }
      } else {
        setAlertMessage({
          type: "error",
          message: "Please , do not upload blank file!",
        });
      }
    }
  };

  return {
    formValuesReplyWithExcel,
    updateStateReplyWithExcel,
    formValidationReplyWithExcelError,
    handleSave,
    btnLoaderActive,
    handleResetFile,
    fileRef,
    downloadExcelFile,
  };
}

export default ReplyWithExcelLogic;
