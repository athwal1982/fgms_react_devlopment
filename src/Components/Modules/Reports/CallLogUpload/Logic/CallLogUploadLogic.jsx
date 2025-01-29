import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { getCurrentDateTimeTick, dateToSpecificFormat } from "Configration/Utilities/dateformat";
import { uploadCallLogs } from "../Services/Services";

function CallLogUploadLogic() {
  const setAlertMessage = AlertMessage();
  const fileRef = useRef(null);

  const [formValuesCallLogUpload, setFormValuesCallLogUpload] = useState({
    txtDocumentUpload: null,
  });

  const [excelFile, setExcelFile] = useState(null);
  const [formValidationError, setFormValidationError] = useState({});

  const downloadExcel = (data, workSheetColumnWidth, fileName) => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      worksheet["!cols"] = workSheetColumnWidth;
      XLSX.writeFile(workbook, `${fileName}.xlsx`);
    } catch (error) {
      setAlertMessage({ message: `Error downloading Excel file: ${error.message}`, messageType: "error" });
    }
  };

  const rearrangeAndRenameColumns = (originalData, columnMapping) => {
    return originalData.map((item) => {
      const rearrangedItem = Object.fromEntries(Object.entries(columnMapping).map(([oldColumnName, newColumnName]) => [newColumnName, item[oldColumnName]]));
      return rearrangedItem;
    });
  };

  const downloadExcelFile = async () => {
    try {
      const serviceDataFormat = [
        {
          Customer: "",
          Campaign: "",
          Status: "",
          AgentID: "",
          Agent: "",
          CallStartTime: "",
          CallEndTime: "",
          AgentCallStartTime: "",
          AgentCallEndTime: "",
          Circle: "",
          CustomerCallSec: "",
          QueueSeconds: "",
          AgentTalkTime: "",
          UniqueID: "",
          TransferStatus: "",
          Customerpulse: "",
          Date: "",
          ICname: "",
          ICStatus: "",
          Ticketsnumber: "",
          Source: "",
        },
      ];
      const columnOrder = {
        Customer: "Customer",
        Campaign: "Campaign",
        Status: "Status",
        AgentID: "Agent ID",
        Agent: "Agent",
        CallStartTime: "Call Start Time",
        CallEndTime: "Call End Time",
        AgentCallStartTime: "Agent Call Start Time",
        AgentCallEndTime: "Agent Call End Time",
        Circle: "Circle",
        CustomerCallSec: "Customer Call Sec",
        QueueSeconds: "Queue Seconds",
        AgentTalkTime: "Agent TalkTime",
        UniqueID: "Unique ID",
        TransferStatus: "Transfer Status",
        Customerpulse: "Customer pulse",
        Date: "Date",
        ICname: "IC Name",
        ICStatus: "IC Status",
        Ticketnumber: "Ticket Number",
        Source: "Source",
      };
      const mappedData = serviceDataFormat.map((value) => {
        return {
          ServiceName: value.ServiceName,
          MandatoryDocuments: value.MandatoryDocuments,
          OptionalDocuments: value.OptionalDocuments,
          TimeLine: value.TimeLine,
          ServiceFee: value.ServiceFee,
        };
      });
      const rearrangedData = rearrangeAndRenameColumns(mappedData, columnOrder);
      const workSheetColumnWidth = [
        { width: 15 },
        { width: 15 },
        { width: 25 },
        { width: 15 },
        { width: 30 },
        { width: 30 },
        { width: 30 },
        { width: 30 },
        { width: 20 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 30 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
      ];
      const UniqueDateTimeTick = getCurrentDateTimeTick();
      downloadExcel(rearrangedData, workSheetColumnWidth, `BillingData_Format${UniqueDateTimeTick}`);
    } catch (error) {
      setAlertMessage({ message: `Error downloading sample Excel file: ${error.message}`, messageType: "error" });
    }
  };

  const validateField = (name, value) => {
    let errorMsg = "";
    if (name === "txtDocumentUpload") {
      if (!value) {
        errorMsg = "File is required!";
      } else if (value && typeof value.name !== "undefined") {
        const regex = new RegExp("^[a-zA-Z0-9_.-]*$");
        if (!regex.test(value.name)) {
          errorMsg = "File name is not in valid format.";
        }
      }
    }
    return errorMsg;
  };

  const validateColumns = (data) => {
    const errors = [];

    const columnTypeMapping = {
      Customer: "numeric_10_digit",
      Campaign: "alphabetic",
      Status: "alphabetic_sentence",
      "Agent ID": "numeric",
      Agent: "numeric",
      "Call Start Time": "date_time",
      "Call End Time": "date_time",
      "Agent Call Start Time": "date_time",
      "Agent Call End Time": "date_time",
      circle: "alphabetic",
      "Customer Call Sec": "numeric",
      "Queue Seconds": "numeric",
      "Agent TalkTime": "numeric",
      "Unique ID": "numeric_10_decimal",
      "Transfer Status": "alphabetic",
      "Customer pulse": "numeric",
      Date: "date",
      "IC Name": "alphabetic_sentence",
      "IC Status": "alphabetic",
      "Ticket Number": "numeric",
      Source: "alphabetic",
    };

    const dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

    data.forEach((row, rowIndex) => {
      Object.keys(row).forEach((column) => {
        const value = row[column].toString().trim();
        const expectedType = columnTypeMapping[column];

        // Skip validation for undefined or empty columns
        if (!value) return;

        // Validation based on the expected type
        if (expectedType === "numeric" && isNaN(value)) {
          errors.push(`Invalid value in row ${rowIndex + 2}, column "${column}". Expected numeric value.`);
        }

        if (expectedType === "numeric_10_digit" && !/^\d{10}$/.test(value)) {
          errors.push(`Invalid value in row ${rowIndex + 2}, column "${column}". Expected a 10-digit numeric value.`);
        }

        if (expectedType === "numeric_10_decimal" && !/^\d+(\.\d{1,10})?$/.test(value)) {
          errors.push(`Invalid value in row ${rowIndex + 2}, column "${column}". Expected numeric value with up to 10 decimal places.`);
        }

        if (expectedType === "alphabetic" && /[0-9]/.test(value)) {
          errors.push(`Invalid value in row ${rowIndex + 2}, column "${column}". Expected alphabetic value.`);
        }

        if (expectedType === "alphabetic_sentence" && /[0-9]/.test(value)) {
          errors.push(`Invalid value in row ${rowIndex + 2}, column "${column}". Expected alphabetic value or sentence.`);
        }

        if (expectedType === "date" && isNaN(Date.parse(value))) {
          errors.push(`Invalid value in row ${rowIndex + 2}, column "${column}". Expected a valid date.`);
        }

        if (expectedType === "date_time" && !dateTimeRegex.test(value)) {
          errors.push(`Invalid value in row ${rowIndex + 2}, column "${column}". Expected a valid date-time format YYYY-MM-DD HH:MM:SS.`);
        }
      });
    });

    return errors;
  };

  const updateStateCallLogUpload = (name, value) => {
    setFormValuesCallLogUpload({ ...formValuesCallLogUpload, [name]: value });
    setFormValidationError({ ...formValidationError, [name]: validateField(name, value) });
    if (name === "txtDocumentUpload") {
      setExcelFile(null);
      setFormValidationError({});
      const selectedFile = value;
      if (selectedFile && ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv"].includes(selectedFile.type)) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFile(e.target.result);
        };
      } else {
        setExcelFile(null);
      }
    }
  };

  const handleResetFile = () => {
    fileRef.current.value = null;
    setFormValidationError({});
    setFormValuesCallLogUpload({ ...formValuesCallLogUpload, txtDocumentUpload: null });
  };

  const handleValidation = () => {
    const errors = {};
    let formIsValid = true;
    errors["txtDocumentUpload"] = validateField("txtDocumentUpload", formValuesCallLogUpload.txtDocumentUpload);
    if (Object.values(errors).some((error) => error !== "")) {
      formIsValid = false;
    }
    setFormValidationError(errors);
    return formIsValid;
  };

  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState("");
  const [btnLoaderActive, setBtnLoaderActive] = useState(false);
  const handleSubmit = async (e) => {
    debugger;
    e.preventDefault();
    if (!handleValidation()) {
      return;
    }
    const pAttachment = formValuesCallLogUpload.txtDocumentUpload;
    if (pAttachment !== "") {
      const valExtension = pAttachment.name.substring(pAttachment.name.lastIndexOf(".")).toLowerCase().slice(1);
      if (valExtension !== "xlsx" && valExtension !== "csv") {
        setMessage("Please select only xlsx or csv extension file.");
        setMessageClass("error");
        return;
      }
      if (pAttachment.size > 1000000) {
        setMessage("Please upload a file less than 1MB!");
        setMessageClass("error");
        return;
      }
    }

    if (excelFile !== null) {
      const fileType = pAttachment.name.split(".").pop().toLowerCase();
      let data;
      if (fileType === "csv") {
        const reader = new FileReader();
        reader.readAsText(pAttachment);
        reader.onload = (e) => {
          const csvData = e.target.result;
          const workBook = XLSX.read(csvData, { type: "string", raw: true });
          const workSheetName = workBook.SheetNames[0];
          const workSheet = workBook.Sheets[workSheetName];
          data = XLSX.utils.sheet_to_json(workSheet, { header: 0, defval: "" });
        };
      } else {
        const workBook = XLSX.read(excelFile, { type: "buffer", cellDates: true, dateNF: "mm/dd/yyyy" });
        const workSheetName = workBook.SheetNames[0];
        const workSheet = workBook.Sheets[workSheetName];
        data = XLSX.utils.sheet_to_json(workSheet, { header: 0, defval: "" });
      }

      if (data && data.length > 0) {
        const obj = data[0];
        const requiredColumns = [
          "Customer",
          "Campaign",
          "Status",
          "Agent ID",
          "Agent",
          "Call Start Time",
          "Call End Time",
          "Agent Call Start Time",
          "Agent Call End Time",
          "Circle",
          "Customer Call Sec",
          "Queue Seconds",
          "Agent TalkTime",
          "Unique ID",
          "Transfer Status",
          "Customer pulse",
          "Date",
          "IC Name",
          "IC Status",
          "Ticket Number",
          "Source",
        ];

        const missingColumns = requiredColumns.filter((column) => !Object.keys(obj).includes(column));
        if (missingColumns.length > 0) {
          setAlertMessage({
            open: true,
            type: "warning",
            message: `Please do not change the header columns: ${missingColumns.join(", ")}`,
          });
          return;
        }

        // A const validationErrors = validateColumns(data);
        // A if (validationErrors.length > 0) {
        // A  setAlertMessage({
        // A    type: "error",
        // A    message: validationErrors.join("\n"),
        // A  });
        // A  return;
        // A }

        const columnTypeMapping = {
          Customer: "numeric_10_digit",
          Campaign: "alphabetic",
          Status: "alphabetic_sentence",
          "Agent ID": "numeric",
          Agent: "numeric",
          "Call Start Time": "date_time",
          "Call End Time": "date_time",
          "Agent Call Start Time": "date_time",
          "Agent Call End Time": "date_time",
          circle: "alphabetic",
          "Customer Call Sec": "numeric",
          "Queue Seconds": "numeric",
          "Agent TalkTime": "numeric",
          "Unique ID": "numeric_10_decimal",
          "Transfer Status": "alphabetic",
          "Customer pulse": "numeric",
          Date: "date",
          "IC Name": "alphabetic_sentence",
          "IC Status": "alphabetic",
          "Ticket Number": "numeric",
          Source: "alphabetic",
        };

        const dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

        let rtnval = true;
        for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
          if (!rtnval) {
            return;
          }
          const row = data[rowIndex];
          for (const column in row) {
            if (row.hasOwnProperty(column)) {
              const value = row[column].toString().trim();
              const expectedType = columnTypeMapping[column];
              // Validation based on the expected type
              if (expectedType === "numeric" && isNaN(value)) {
                setAlertMessage({
                  type: "error",
                  message: `Invalid value in row ${rowIndex + 2}, column "${column}". Expected numeric value.`,
                });
                rtnval = false;
                break;
              }

              if (expectedType === "numeric_10_digit" && !/^\d{10}$/.test(value)) {
                setAlertMessage({
                  type: "error",
                  message: `Invalid value in row ${rowIndex + 2}, column "${column}". Expected numeric value.`,
                });
                rtnval = false;
                break;
              }
              if (expectedType === "numeric_10_decimal" && !/^\d+(\.\d{1,10})?$/.test(value)) {
                setAlertMessage({
                  type: "error",
                  message: `Invalid value in row ${rowIndex + 2}, column "${column}". Expected numeric value with up to 10 decimal places.`,
                });
                rtnval = false;
                break;
              }

              if (expectedType === "alphabetic" && /[0-9]/.test(value)) {
                setAlertMessage({
                  type: "error",
                  message: `Invalid value in row ${rowIndex + 2}, column "${column}". Expected alphabetic value.`,
                });
                rtnval = false;
                break;
              }

              if (expectedType === "alphabetic_sentence" && /[0-9]/.test(value)) {
                setAlertMessage({
                  type: "error",
                  message: `Invalid value in row ${rowIndex + 2}, column "${column}". Expected alphabetic value or sentence.`,
                });
                rtnval = false;
                break;
              }

              if (expectedType === "date" && isNaN(Date.parse(value))) {
                setAlertMessage({
                  type: "error",
                  message: `Invalid value in row ${rowIndex + 2}, column "${column}". Expected a valid date.`,
                });
                rtnval = false;
                break;
              }

              if (expectedType === "date_time" && !dateTimeRegex.test(value)) {
                setAlertMessage({
                  type: "error",
                  message: `Invalid value in row ${rowIndex + 2}, column "${column}". Expected a valid date-time format YYYY-MM-DD HH:MM:SS.`,
                });
                rtnval = false;
                break;
              }
            }
          }
        }
        if (rtnval === true) {
          try {
            const dataForUpload = data.map((val) => ({
              customerNumber: String(val["Customer"]),
              campaign: val["Campaign"],
              status: val["Status"],
              agentID: String(val["Agent ID"]),
              agent: String(val["Agent"]),
              callStartTime: val["Call Start Time"],
              callEndTime: val["Call End Time"],
              agentCallStartTime: val["Agent Call Start Time"],
              agentCallEndTime: val["Agent Call End Time"],
              circle: String(val["Circle"]),
              customerCallSec: String(val["Customer Call Sec"]),
              queueSeconds: String(val["Queue Seconds"]),
              agentTalkTime: String(val["Agent TalkTime"]),
              uniqueID: String(val["Unique ID"]),
              transferStatus: val["Transfer Status"],
              customerPulse: String(val["Customer pulse"]),
              date: val["Date"] ? dateToSpecificFormat(val["Date"], "DD-MM-YYYY") : "",
              iCName: val["IC Name"],
              iCStatus: val["IC Status"],
              ticketNumber: String(val["Ticket Number"]),
              source: String(val["Source"]),
            }));

            const formdata = {
              customers: dataForUpload,
            };
            setBtnLoaderActive(true);

            const result = await uploadCallLogs(formdata);
            setBtnLoaderActive(false);
            if (result.responseCode === 1) {
              setAlertMessage({
                type: "success",
                message: result.responseMessage,
              });
              handleResetFile();
            } else {
              setAlertMessage({
                type: "error",
                message: result.responseMessage,
              });
            }
          } catch (error) {
            setAlertMessage({
              type: "error",
              message: error.message,
            });
          }
        }
      } else {
        setAlertMessage({
          type: "error",
          message: "Please, do not upload a blank file!",
        });
      }
    }
  };

  return {
    message,
    messageClass,
    handleSubmit,
    handleResetFile,
    downloadExcelFile,
    updateStateCallLogUpload,
    formValidationError,
    btnLoaderActive,
    fileRef,
  };
}

export default CallLogUploadLogic;
