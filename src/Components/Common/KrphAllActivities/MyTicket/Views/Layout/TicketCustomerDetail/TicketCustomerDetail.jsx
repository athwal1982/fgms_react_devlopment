import React from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { getCurrentDateTimeTick } from "Configration/Utilities/dateformat";
import CustomerAvatar from "Framework/Assets/Images/CustomerAvatar.png";
import { FiCopy } from "react-icons/fi";
import { HiDotsVertical } from "react-icons/hi";
import { BsFillArrowDownCircleFill } from "react-icons/bs";
import { RiNewspaperLine } from "react-icons/ri";
import { Form } from "Framework/Components/Layout";
import { Button, Loader } from "Framework/Components/Widgets";
import * as XLSX from "xlsx";
import { PropTypes } from "prop-types";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import BizClass from "./TicketCustomerDetail.module.scss";

function TicketCustomerDetail({
  ticketData,
  ticketStatusList,
  isLoadingTicketStatusList,
  formValuesTicketProperties,
  updateStateTicketProperties,
  btnloaderStatusTicketActive,
  updateStatusSupportTicketOnClick,
  selectedPolicyDetails,
}) {
  const setAlertMessage = AlertMessage();
  const userData = getSessionStorage("user");

  const copyToClipboard = (id) => {
    debugger;
    /* Get the text field */
    const copyText = document.getElementById(id);
    /* Copy the text inside the text field */
    if (window.isSecureContext && navigator.clipboard) {
      navigator.clipboard
        .writeText(copyText.innerHTML)
        .then(() => {
          setAlertMessage({
            type: "success",
            message: "Text copied to clipboard",
          });
        })
        .catch(() => {
          setAlertMessage({
            type: "error",
            message: "somthing went wrong",
          });
        });
    } else {
      setAlertMessage({
        type: "error",
        message: "somthing went wrong",
      });
    }
  };

  const downloadExcel = (data, workSheetColumnWidth, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    worksheet["!cols"] = workSheetColumnWidth;
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };
  const rearrangeAndRenameColumns = (originalData, columnMapping) => {
    return originalData.map((item) => {
      const rearrangedItem = Object.fromEntries(Object.entries(columnMapping).map(([oldColumnName, newColumnName]) => [newColumnName, item[oldColumnName]]));
      return rearrangedItem;
    });
  };
  const excelDownloadFarmerData = () => {
    debugger;
    const columnOrder = {
      Season: "Season",
      Year: "Year",
      resState: "State",
      resDistrict: "District",
      resSubDistrict: "Sub District",
      resVillage: "Village",
      insuranceCompanyName: "Insurance Company",
      plotStateName: "Plot State",
      plotDistrictName: "Plot District",
      plotVillageName: "Plot Village",
      policyID: "Policy No",
      applicationNo: "Application No",
      landSurveyNumber: "Land Survey Number",
      landDivisionNumber: "Land Division Number",
      policyArea: "Area",
      cropName: "Crop Name",
      policyPremium: "Premium Amount",
      applicationSource: "Source of Enrolment",
      scheme: "Scheme",
    };
    const mappedData = [
      {
        Season: ticketData && ticketData.RequestSeason && ticketData.RequestSeason === 1 ? "Kharif" : "Rabi",
        Year: ticketData && ticketData.RequestYear ? ticketData.RequestYear : "",
        resState: selectedPolicyDetails && selectedPolicyDetails.length > 0 ? selectedPolicyDetails[0].resState : "",
        resDistrict: selectedPolicyDetails && selectedPolicyDetails.length > 0 ? selectedPolicyDetails[0].resDistrict : "",
        resSubDistrict: selectedPolicyDetails && selectedPolicyDetails.length > 0 ? selectedPolicyDetails[0].resSubDistrict : "",
        resVillage: selectedPolicyDetails && selectedPolicyDetails.length > 0 ? selectedPolicyDetails[0].resVillage : "",
        insuranceCompanyName: selectedPolicyDetails && selectedPolicyDetails.length > 0 ? selectedPolicyDetails[0].insuranceCompanyName : "",
        plotStateName: selectedPolicyDetails && selectedPolicyDetails.length > 0 ? selectedPolicyDetails[0].plotStateName : "",
        plotDistrictName: selectedPolicyDetails && selectedPolicyDetails.length > 0 ? selectedPolicyDetails[0].plotDistrictName : "",
        plotVillageName: selectedPolicyDetails && selectedPolicyDetails.length > 0 ? selectedPolicyDetails[0].plotVillageName : "",
        policyID: selectedPolicyDetails && selectedPolicyDetails.length > 0 ? selectedPolicyDetails[0].policyID : "",
        applicationNo: selectedPolicyDetails && selectedPolicyDetails.length > 0 ? selectedPolicyDetails[0].applicationNo : "",
        landSurveyNumber: selectedPolicyDetails && selectedPolicyDetails.length > 0 ? selectedPolicyDetails[0].landSurveyNumber : "",
        landDivisionNumber: selectedPolicyDetails && selectedPolicyDetails.length > 0 ? selectedPolicyDetails[0].landDivisionNumber : "",
        policyArea: selectedPolicyDetails && selectedPolicyDetails.length > 0 ? selectedPolicyDetails[0].policyArea : "",
        cropName: selectedPolicyDetails && selectedPolicyDetails.length > 0 ? selectedPolicyDetails[0].cropName : "",
        policyPremium: selectedPolicyDetails && selectedPolicyDetails.length > 0 ? selectedPolicyDetails[0].policyPremium : "",
        applicationSource: selectedPolicyDetails && selectedPolicyDetails.length > 0 ? selectedPolicyDetails[0].applicationSource : "",
        scheme: selectedPolicyDetails && selectedPolicyDetails.length > 0 ? selectedPolicyDetails[0].scheme : "",
      },
    ];
    const rearrangedData = rearrangeAndRenameColumns(mappedData, columnOrder);
    const workSheetColumnWidth = [
      { width: 10 },
      { width: 10 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 40 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 28 },
      { width: 28 },
      { width: 22 },
      { width: 22 },
      { width: 12 },
      { width: 22 },
      { width: 18 },
      { width: 20 },
      { width: 15 },
    ];
    const UniqueDateTimeTick = getCurrentDateTimeTick();
    downloadExcel(rearrangedData, workSheetColumnWidth, `Farmer_Information${UniqueDateTimeTick}`);
  };
  return (
    <div className={BizClass.CustomerBox}>
      <div className={BizClass.Heading}>
        <div className={BizClass.ReqInfo}>
          <img src={CustomerAvatar} alt="Customer" />
          <h3>{ticketData.RequestorName}</h3>
          <br />
          <p>{ticketData.RequestorMobileNo && ticketData.RequestorMobileNo ? `+91  ${ticketData.RequestorMobileNo}` : null}</p>
        </div>
        <div className={BizClass.ActionBox}>
          <HiDotsVertical />
          <BsFillArrowDownCircleFill title="Download Farmer Information" style={{ cursor: "pointer" }} onClick={() => excelDownloadFarmerData()} />
        </div>
      </div>
      <div className={BizClass.MainBox}>
        <div className={BizClass.InfoBox}>
          {/* <div className={BizClass.SubBox}>
            <BsTelephone />
            <p>
              Mobile No :
              <span id="spnMobileNo">{ticketData.RequestorMobileNo && ticketData.RequestorMobileNo ? `+91  ${ticketData.RequestorMobileNo}` : null}</span>
            </p>
            <FiCopy onClick={() => copyToClipboard("spnMobileNo")} />
          </div> */}
          <div className={BizClass.SubBox}>
            <RiNewspaperLine />
            <p>
              Season - Year :
              <span id="spnSeasonYear">
                {ticketData && ticketData.RequestSeason && ticketData.RequestSeason === 1 ? "Kharif" : "Rabi"} -{" "}
                {ticketData && ticketData.RequestYear ? ticketData.RequestYear : ""}
              </span>
            </p>
            <FiCopy onClick={() => copyToClipboard("spnSeasonYear")} />
          </div>
          <div className={BizClass.SubBox}>
            <RiNewspaperLine />
            <p>
              Residential Location :
              <span id="spnInsStateDistrict">
                {selectedPolicyDetails && selectedPolicyDetails.length > 0 ? selectedPolicyDetails[0].resState : ""}{" "}
                {selectedPolicyDetails && selectedPolicyDetails.length > 0 ? `, ${selectedPolicyDetails[0].resDistrict}` : ""}{" "}
                {selectedPolicyDetails && selectedPolicyDetails.length > 0 ? `, ${selectedPolicyDetails[0].resSubDistrict}` : ""}{" "}
                {selectedPolicyDetails && selectedPolicyDetails.length > 0 ? `, ${selectedPolicyDetails[0].resVillage}` : ""}
              </span>
            </p>
            <FiCopy onClick={() => copyToClipboard("spnInsStateDistrict")} />
          </div>
          <div className={BizClass.SubBox}>
            <RiNewspaperLine />
            <p>
              Land Location :
              <span id="spnLandDistrictVillage">
                {selectedPolicyDetails && selectedPolicyDetails.length > 0 ? selectedPolicyDetails[0].plotStateName : ""}{" "}
                {selectedPolicyDetails && selectedPolicyDetails.length > 0 ? `, ${selectedPolicyDetails[0].plotDistrictName}` : ""}{" "}
                {selectedPolicyDetails && selectedPolicyDetails.length > 0 ? `, ${selectedPolicyDetails[0].plotVillageName}` : ""}{" "}
              </span>
            </p>
            <FiCopy onClick={() => copyToClipboard("spnLandDistrictVillage")} />
          </div>
          <div className={BizClass.SubBox}>
            <RiNewspaperLine />
            <p>
              Ins Company :
              <span id="spnInsCompany">{selectedPolicyDetails && selectedPolicyDetails.length > 0 ? selectedPolicyDetails[0].insuranceCompanyName : ""}</span>
            </p>
            <FiCopy onClick={() => copyToClipboard("spnInsCompany")} />
          </div>
          <div className={BizClass.SubBox}>
            <RiNewspaperLine />
            <p>
              Policy No :<span id="spnPolicyNo">{selectedPolicyDetails && selectedPolicyDetails.length > 0 ? selectedPolicyDetails[0].policyID : ""}</span>
            </p>
            <FiCopy onClick={() => copyToClipboard("spnPolicyNo")} />
          </div>
          <div className={BizClass.SubBox}>
            <RiNewspaperLine />
            <p>
              Application No :
              <span id="spnApplicationNo">{selectedPolicyDetails && selectedPolicyDetails.length > 0 ? selectedPolicyDetails[0].applicationNo : ""}</span>
            </p>
            <FiCopy onClick={() => copyToClipboard("spnApplicationNo")} />
          </div>
          <div className={BizClass.SubBox}>
            <RiNewspaperLine />
            <p>
              Land Survey Or Land Division Number :
              <span id="spnLandSurveyDivision">
                {selectedPolicyDetails && selectedPolicyDetails.length > 0 ? selectedPolicyDetails[0].landSurveyNumber : ""} Or{" "}
                {selectedPolicyDetails && selectedPolicyDetails.length > 0 ? selectedPolicyDetails[0].landDivisionNumber : ""}
              </span>
            </p>
            <FiCopy onClick={() => copyToClipboard("spnLandSurveyDivision")} />
          </div>
          <div className={BizClass.SubBox}>
            <RiNewspaperLine />
            <p>
              Area :<span id="spnArea">{selectedPolicyDetails && selectedPolicyDetails.length > 0 ? selectedPolicyDetails[0].policyArea : ""}</span>
            </p>
            <FiCopy onClick={() => copyToClipboard("spnArea")} />
          </div>
          <div className={BizClass.SubBox}>
            <RiNewspaperLine />
            <p>
              Crop Name :<span id="spnCropName">{selectedPolicyDetails && selectedPolicyDetails.length > 0 ? selectedPolicyDetails[0].cropName : ""}</span>
            </p>
            <FiCopy onClick={() => copyToClipboard("spnCropName")} />
          </div>
          <div className={BizClass.SubBox}>
            <RiNewspaperLine />
            <p>
              Premium Amount :
              <span id="spnPremiumAmount">{selectedPolicyDetails && selectedPolicyDetails.length > 0 ? selectedPolicyDetails[0].policyPremium : ""}</span>
            </p>
            <FiCopy onClick={() => copyToClipboard("spnPremiumAmount")} />
          </div>
          <div className={BizClass.SubBox}>
            <RiNewspaperLine />
            <p>
              Source of Enrolment :
              <span id="spnSourceofEnrolment">
                {selectedPolicyDetails && selectedPolicyDetails.length > 0 ? selectedPolicyDetails[0].applicationSource : ""}
              </span>
            </p>
            <FiCopy onClick={() => copyToClipboard("spnSourceofEnrolment")} />
          </div>
          <div className={BizClass.SubBox}>
            <RiNewspaperLine />
            <p>
              Scheme : <span id="spnScheme"> {selectedPolicyDetails && selectedPolicyDetails.length > 0 ? selectedPolicyDetails[0].scheme : ""}</span>
            </p>
            <FiCopy onClick={() => copyToClipboard("spnScheme")} />
          </div>
        </div>
        {/* // Code not in use start */}
        <div className={BizClass.PropertiesBox} style={{ display: "none" }}>
          <div className={BizClass.Heading}>
            <h4>Ticket Properties</h4>
            <div className={BizClass.ActionBox}>
              <BsFillArrowDownCircleFill />
            </div>
          </div>
          <div className={BizClass.FilterBox}>
            <div className={BizClass.Content}>
              <Form>
                <Form.Group column="1" controlwidth="auto">
                  <Form.InputGroup label="Status" req="false" errorMsg="">
                    <Form.InputControl
                      control="select"
                      name="txtTicketStatus"
                      options={ticketStatusList}
                      loader={isLoadingTicketStatusList ? <Loader /> : null}
                      value={formValuesTicketProperties.txtTicketStatus}
                      getOptionLabel={(option) => `${option.CommonMasterValue}`}
                      getOptionValue={(option) => `${option}`}
                      onChange={(e) => updateStateTicketProperties("txtTicketStatus", e)}
                    />
                  </Form.InputGroup>
                </Form.Group>
              </Form>
            </div>
            <div className={BizClass.Footer}>
              <Button type="button" trigger={btnloaderStatusTicketActive && "true"} onClick={() => updateStatusSupportTicketOnClick()}>
                Update
              </Button>
            </div>
          </div>
        </div>
        {/* // Code not in use end */}
      </div>
    </div>
  );
}

export default TicketCustomerDetail;

TicketCustomerDetail.propTypes = {
  ticketData: PropTypes.object,
  ticketStatusList: PropTypes.array.isRequired,
  isLoadingTicketStatusList: PropTypes.bool,
  bankDropdownDataList: PropTypes.array.isRequired,
  isLoadingBankDropdownDataList: PropTypes.bool,
  formValuesTicketProperties: PropTypes.object.isRequired,
  updateStateTicketProperties: PropTypes.func.isRequired,
  btnloaderStatusTicketActive: PropTypes.bool,
  updateStatusSupportTicketOnClick: PropTypes.func.isRequired,
  selectedPolicyDetails: PropTypes.object,
};
