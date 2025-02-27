import { React, useState, useEffect } from "react";
import classNames from "classnames";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { Form } from "Framework/Components/Layout";
import { Button } from "Framework/Components/Widgets";
import BizClass from "./KrphAllActivities.module.scss";
import { getSessionStorage, setSessionStorage, decryptStringData } from "Components/Common/Login/Auth/auth";
import { ticketDataBindingData } from "Components/Common/Welcome/Service/Methods";
import { getMasterDataBindingDataList, getDistrictByState } from "../../Modules/Support/ManageTicket/Views/Modals/AddTicket/Services/Methods";
import { krphFarmerCallingHistorydata, checkKRPHFarmerByMobileNumber } from "./Services/Methods";
import PremiumCalculator from "./PremiumCalculator";
import CreateTicket from "./CreateTicket";
import ServiceSuccess from "./ServiceSuccess";
import { KrphToggleSwitch } from "./KrphToggleSwitch";
function KrphAllActivities() {
  const setAlertMessage = AlertMessage();

  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  const dcryptUID = decryptStringData(params && params.userID ? params.userID : "uID");
  const dcryptUMBLENO = decryptStringData(params && params.mobileNumber ? params.mobileNumber : "uMO");
  const dcryptUNQEID = decryptStringData(params && params.uniqueID ? params.uniqueID : "uNQID");

  const [activeKey, setActiveKey] = useState("TCKT");
  const [activeBtnKey, setActiveBtnKey] = useState("");

  const [objStateData, setobjStateData] = useState();
  const [objDistrictData, setobjDistrictData] = useState();
  const [farmerName, setfarmerName] = useState();
  const [serviceSuccessState, setServiceSuccessState] = useState("UNSUCCESS");
  const [getSupportTicketNo, setgetSupportTicketNo] = useState("");

  const [selectedFarmer, setSelectedFarmer] = useState([]);
  const [fetchfarmersummary, setfetchfarmersummary] = useState("");
  const [farmersTicketSummaryData, setFarmersTicketSummaryData] = useState([]);
  const [stateCropLossIntimation, setStateCropLossIntimation] = useState("NA");
  const [farmerAuthenticateByMobile, setfarmerAuthenticateByMobile] = useState(false);

  const [formValuesGI, setFormValuesGI] = useState({
    txtCallerID: dcryptUNQEID,
    txtMobileCallerNumber: dcryptUMBLENO,
    txtState: null,
    txtDistrict: null,
    txtCallStatus: { ID: 1, Value: "Connected" },
    txtFarmerName: "",
    txtReason: null,
  });
  const [reasonDropdownDataList] = useState([
    { ID: 1, Value: "Caller voice not clear" },
    { ID: 2, Value: "Caller did not provide required details" },
    { ID: 3, Value: "Call disconnected" },
  ]);
  const [callConnectedDropdownDataList] = useState([
    { ID: 1, Value: "Connected" },
    { ID: 2, Value: "Disconnected" },
  ]);

  const [formValidationKRPHError, setFormValidationKRPHError] = useState({});
  const validateKRPHInfoField = (name, value) => {
    let errorsMsg = "";

    if (name === "txtCallStatus") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Call Status is required!";
      }
    }

    if (name === "txtReason") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Reason is required!";
      }
    }

    if (name === "txtState") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "State is required!";
      }
    }
    if (name === "txtDistrict") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "District is required!";
      }
    }
    if (name === "txtFarmerName") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Farmer Name is required!";
      }
    }

    return errorsMsg;
  };

  const handleKRPHInfoValidation = () => {
    try {
      const errors = {};
      let formIsValid = true;
      errors["txtCallStatus"] = validateKRPHInfoField("txtCallStatus", formValuesGI.txtCallStatus);
      if (formValuesGI && formValuesGI.txtCallStatus && formValuesGI.txtCallStatus.ID === 2) {
        errors["txtReason"] = validateKRPHInfoField("txtReason", formValuesGI.txtReason);
      }
      if (formValuesGI && formValuesGI.txtCallStatus && formValuesGI.txtCallStatus.ID === 1) {
        errors["txtState"] = validateKRPHInfoField("txtState", formValuesGI.txtState);
        errors["txtDistrict"] = validateKRPHInfoField("txtDistrict", formValuesGI.txtDistrict);
      }
      errors["txtFarmerName"] = validateKRPHInfoField("txtFarmerName", formValuesGI.txtFarmerName);

      if (Object.values(errors).join("").toString()) {
        formIsValid = false;
      }
      setFormValidationKRPHError(errors);
      return formIsValid;
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: "Something Went Wrong",
      });
      return false;
    }
  };
  const updateStateGI = (name, value) => {
    setFormValuesGI({ ...formValuesGI, [name]: value });
    setFormValidationKRPHError[name] = validateKRPHInfoField(name, value);

    if (name === "txtState") {
      setFormValuesGI({
        ...formValuesGI,
        txtState: value,
        txtDistrict: null,
      });
      setDistrictKRPHDropdownDataList([]);
      setobjStateData({});
      if (value) {
        getDistrictByStateKRPHListData(value.StateCodeAlpha);
      }
    }
    if (name === "txtDistrict") {
      setFormValuesGI({
        ...formValuesGI,
        txtDistrict: value,
      });
      setobjDistrictData({});
    }
    if (name === "txtFarmerName") {
      setFormValuesGI({
        ...formValuesGI,
        txtFarmerName: value,
      });
      setfarmerName(value);
    }
  };
  const OnClickTab = (pType) => {
    if (pType === "TCKT") {
      setActiveKey(pType);
      setActiveBtnKey("");
    } else if (pType === "PRMCAL") {
      setActiveKey(pType);
      setActiveBtnKey("");
    }
  };

  const SavevalidateFarmerOnClick = async () => {
    debugger;
    try {
      const formData = {
        callerMobileNumber: formValuesGI.txtMobileCallerNumber ? formValuesGI.txtMobileCallerNumber : "",
        callingUniqueID: dcryptUNQEID,
        farmerMobileNumber: formValuesGI.txtMobileCallerNumber ? formValuesGI.txtMobileCallerNumber : "",
        farmerName: formValuesGI.txtFarmerName ? formValuesGI.txtFarmerName : "",
        callStatus: formValuesGI.txtCallStatus && formValuesGI.txtCallStatus.Value ? formValuesGI.txtCallStatus.Value : "",
        reason: formValuesGI.txtReason && formValuesGI.txtReason.Value ? formValuesGI.txtReason.Value : "",
        stateCodeAlpha: formValuesGI.txtState && formValuesGI.txtState.StateCodeAlpha ? formValuesGI.txtState.StateCodeAlpha : "",
        districtCodeAlpha: formValuesGI.txtDistrict && formValuesGI.txtDistrict.level3ID ? formValuesGI.txtDistrict.level3ID : "",
        isRegistered: "U",
      };
      const result = await krphFarmerCallingHistorydata(formData);
      if (result.response.responseCode === 1) {
        setSessionStorage("servicesuccess", "CD");
        setServiceSuccessState("SUCCESS");
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
        return false;
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
      return false;
    }
  };

  const OnClickBtnAction = (pType) => {
    debugger;
    if (!handleKRPHInfoValidation()) {
      return;
    }

    if (pType === "BTNNXT") {
      setActiveBtnKey(pType);
    } else if (pType === "BTNSBMT") {
      setActiveBtnKey(pType);
      SavevalidateFarmerOnClick();
    }
  };

  const OnClickBtnReset = () => {
    setActiveKey("TCKT");
    setActiveBtnKey("");
  };

  const [toggleChange, setToggleChange] = useState(false);
  const onToggleChange = () => {
    setToggleChange(!toggleChange);
    if (!toggleChange) OnClickTab("PRMCAL");
    else OnClickTab("TCKT");
  };

  const [stateKRPHDropdownDataList, setStateKRPHDropdownDataList] = useState([]);
  const [isLoadingStateDKRPHropdownDataList, setIsLoadingStateKRPHDropdownDataList] = useState(false);
  const getStateKRPHListData = async () => {
    debugger;
    try {
      setIsLoadingStateKRPHDropdownDataList(true);
      const formdata = {
        filterID: 0,
        filterID1: 0,
        masterName: "STATEMAS",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBindingDataList(formdata);
      setIsLoadingStateKRPHDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setStateKRPHDropdownDataList(result.response.responseData.masterdatabinding);
        } else {
          setStateKRPHDropdownDataList([]);
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
        message: error,
      });
    }
  };

  const [districtKRPHDropdownDataList, setDistrictKRPHDropdownDataList] = useState([]);
  const [isLoadingDistrictKRPHDropdownDataList, setIsLoadingDistrictKRPHDropdownDataList] = useState(false);
  const getDistrictByStateKRPHListData = async (pstateAlphaCode) => {
    try {
      setIsLoadingDistrictKRPHDropdownDataList(true);
      const formdata = {
        stateAlphaCode: pstateAlphaCode,
      };
      const result = await getDistrictByState(formdata);
      setIsLoadingDistrictKRPHDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          if (Object.keys(result.response.responseData.data).length === 0) {
            setDistrictKRPHDropdownDataList([]);
          } else {
            setDistrictKRPHDropdownDataList(result.response.responseData.data.hierarchy.level3);
          }
        } else {
          setDistrictKRPHDropdownDataList([]);
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
        message: error,
      });
    }
  };

  const getticketDataBindingKrphAllActivitiesData = async () => {
    debugger;
    try {
      if (getSessionStorage("ticketDataBindingKrphAllActivitiesSsnStrg") === null) {
        const result = await ticketDataBindingData({});
        if (result.response.responseCode === 1) {
          if (result.response.responseData) {
            console.log(result.response.responseData);
            setSessionStorage("ticketDataBindingKrphAllActivitiesSsnStrg", result.response.responseData);
          } else {
            setSessionStorage("ticketDataBindingKrphAllActivitiesSsnStrg", null);
          }
        } else {
          setAlertMessage({
            type: "error",
            message: result.response.responseMessage,
          });
        }
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const validateFarmerByMobileNumber = async () => {
    debugger;
    try {
      let result = "";
      let formData = "";
      formData = {
        mobilenumber: dcryptUMBLENO,
      };
      result = await checkKRPHFarmerByMobileNumber(formData);
      setSelectedFarmer([]);
      setfetchfarmersummary("");
      setFarmersTicketSummaryData([]);
      setStateCropLossIntimation("NA");
      if (result.response.responseCode === 1) {
        const parseFarmerData = result.response.responseData;
        if (parseFarmerData.data.output === 1) {
          setSelectedFarmer(parseFarmerData.data.result);
          setfetchfarmersummary(parseFarmerData.data.result.farmerID);
          setfarmerAuthenticateByMobile(true);
          setAlertMessage({
            type: "success",
            message: "Farmer is authenticated.",
          });
          setFormValuesGI({
            ...formValuesGI,
            txtCallerID: dcryptUNQEID,
            txtMobileCallerNumber: dcryptUMBLENO,
            txtState:
              parseFarmerData.data.result.stateID && parseFarmerData.data.result.state
                ? { StateCodeAlpha: parseFarmerData.data.result.stateID, StateMasterName: parseFarmerData.data.result.state }
                : null,
            txtDistrict:
              parseFarmerData.data.result.districtID && parseFarmerData.data.result.district
                ? { level3ID: parseFarmerData.data.result.districtID, level3Name: parseFarmerData.data.result.district }
                : null,
            txtCallStatus: { ID: 1, Value: "Connected" },
            txtFarmerName: parseFarmerData.data.result ? parseFarmerData.data.result.farmerName : "",
            txtReason: null,
          });
        }
      } else {
        setAlertMessage({
          type: "warning",
          message: result.response.responseMessage,
        });
        setfetchfarmersummary("");
        setfarmerAuthenticateByMobile(false);
        setFormValuesGI({
          ...formValuesGI,
          txtCallerID: dcryptUNQEID,
          txtMobileCallerNumber: dcryptUMBLENO,
          txtState: null,
          txtDistrict: null,
          txtCallStatus: { ID: 1, Value: "Connected" },
          txtFarmerName: "",
          txtReason: null,
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

  useEffect(() => {
    validateFarmerByMobileNumber();
    getticketDataBindingKrphAllActivitiesData();
    getStateKRPHListData();
  }, []);

  return (
    <>
      {serviceSuccessState === "UNSUCCESS" ? (
        <div className={BizClass.Box}>
          <div className={BizClass.Div}>
            <div className={BizClass.InfoDiv}>
              <div className={BizClass.CreationDiv}>
                <div className={BizClass.Title}>
                  <h3>Caller Information</h3>
                </div>
                <div className={BizClass.CreationDiv}>
                  <div className={BizClass.Content}>
                    <div className={BizClass.ContainerPnl}>
                      <Form.Group column={4} controlwidth="25%">
                        <Form.InputGroup label="Caller ID" req="true">
                          <Form.InputControl
                            control="input"
                            name="txtCallerID"
                            value={formValuesGI.txtCallerID}
                            onChange={(e) => updateStateGI("txtCallerID", e.target.value.replace(/\D/g, ""))}
                            disabled={true}
                          />
                        </Form.InputGroup>
                        <Form.InputGroup label="Caller Mobile Number" req="true">
                          <Form.InputControl
                            control="input"
                            name="txtMobileCallerNumber"
                            value={formValuesGI.txtMobileCallerNumber}
                            onChange={(e) => updateStateGI("txtMobileCallerNumber", e.target.value.replace(/\D/g, ""))}
                            disabled={true}
                            autoComplete="off"
                          />
                        </Form.InputGroup>
                        <Form.InputGroup label="Call Status" req="true" errorMsg={formValidationKRPHError["txtCallStatus"]}>
                          <Form.InputControl
                            control="select"
                            name="txtCallStatus"
                            value={formValuesGI.txtCallStatus}
                            options={callConnectedDropdownDataList}
                            getOptionLabel={(option) => `${option.Value}`}
                            getOptionValue={(option) => `${option}`}
                            onChange={(e) => updateStateGI("txtCallStatus", e)}
                          />
                        </Form.InputGroup>
                        {formValuesGI && formValuesGI.txtCallStatus && formValuesGI.txtCallStatus.ID === 1 ? (
                          <Form.InputGroup label="1">
                            <Form.InputControl control="" />
                          </Form.InputGroup>
                        ) : null}
                        {formValuesGI && formValuesGI.txtCallStatus && formValuesGI.txtCallStatus.ID === 2 ? (
                          <Form.InputGroup label="Reason" req="true" errorMsg={formValidationKRPHError["txtReason"]}>
                            <Form.InputControl
                              control="select"
                              name="txtReason"
                              value={formValuesGI.txtReason}
                              options={reasonDropdownDataList}
                              getOptionLabel={(option) => `${option.Value}`}
                              getOptionValue={(option) => `${option}`}
                              onChange={(e) => updateStateGI("txtReason", e)}
                            />
                          </Form.InputGroup>
                        ) : null}
                        <Form.InputGroup
                          req={formValuesGI && formValuesGI.txtCallStatus && formValuesGI.txtCallStatus.ID === 1 ? "true" : "false"}
                          label="State"
                          errorMsg={formValidationKRPHError["txtState"]}
                        >
                          <Form.InputControl
                            control="select"
                            name="txtState"
                            value={formValuesGI.txtState}
                            options={stateKRPHDropdownDataList}
                            isLoading={isLoadingStateDKRPHropdownDataList}
                            getOptionLabel={(option) => `${option.StateMasterName}`}
                            getOptionValue={(option) => `${option}`}
                            onChange={(e) => updateStateGI("txtState", e)}
                            isDisabled={farmerAuthenticateByMobile}
                          />
                        </Form.InputGroup>

                        <Form.InputGroup
                          label="District"
                          req={formValuesGI && formValuesGI.txtCallStatus && formValuesGI.txtCallStatus.ID === 1 ? "true" : "false"}
                          errorMsg={formValidationKRPHError["txtDistrict"]}
                        >
                          <Form.InputControl
                            control="select"
                            name="txtDistrict"
                            value={formValuesGI.txtDistrict}
                            options={districtKRPHDropdownDataList}
                            isLoading={isLoadingDistrictKRPHDropdownDataList}
                            getOptionLabel={(option) => `${option.level3Name}`}
                            getOptionValue={(option) => `${option}`}
                            onChange={(e) => updateStateGI("txtDistrict", e)}
                            isDisabled={farmerAuthenticateByMobile}
                          />
                        </Form.InputGroup>
                        <Form.InputGroup label="Farmer Name" req="true" errorMsg={formValidationKRPHError["txtFarmerName"]}>
                          <Form.InputControl
                            control="input"
                            name="txtFarmerName"
                            value={formValuesGI.txtFarmerName}
                            onChange={(e) => updateStateGI("txtFarmerName", e.target.value)}
                            autoComplete="off"
                            disabled={farmerAuthenticateByMobile}
                          />
                        </Form.InputGroup>
                      </Form.Group>
                      {formValuesGI && formValuesGI.txtCallStatus && formValuesGI.txtCallStatus.ID === 1 ? (
                        <div className={BizClass.toggleContainerKrphCenter}>
                          <KrphToggleSwitch leftText={"Generate Ticket"} rightText={"Premium Calculator"} callback={onToggleChange} checked={toggleChange} />{" "}
                        </div>
                      ) : null}
                      {/* {formValuesGI && formValuesGI.txtCallStatus && formValuesGI.txtCallStatus.ID === 1 ? (
                      <div className={BizClass.SummaryBoardCenter}>
                        <div className={BizClass.SummaryBoard}>
                          <div
                            className={activeKey === "TCKT" ? classNames(BizClass.ScoreBoardTicketActive) : classNames(BizClass.ScoreBoardTicket)}
                            onClick={() => OnClickTab("TCKT")}
                          >
                            <span>Generate Ticket</span>
                          </div>
                          <div
                            className={activeKey === "PRMCAL" ? classNames(BizClass.ScoreBoardPrmCalcActive) : classNames(BizClass.ScoreBoardPrmCalc)}
                            onClick={() => OnClickTab("PRMCAL")}
                          >
                            <span>Premium Calculator</span>
                          </div>
                        </div>
                      </div>
                    ) : null} */}
                      <div className={BizClass.ValidateFormFooterBG}>
                        <div className={BizClass.ValidateFormFooter}>
                          <Button className={BizClass.FormFooterButton} onClick={() => OnClickBtnReset()}>
                            Reset
                          </Button>
                          {formValuesGI && formValuesGI.txtCallStatus && formValuesGI.txtCallStatus.ID === 1 ? (
                            <Button className={BizClass.FormFooterButton} onClick={() => OnClickBtnAction("BTNNXT")}>
                              Next
                            </Button>
                          ) : formValuesGI && formValuesGI.txtCallStatus && formValuesGI.txtCallStatus.ID === 2 ? (
                            <Button className={BizClass.FormFooterButton} onClick={() => OnClickBtnAction("BTNSBMT")}>
                              Submit
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <br />
                    {formValuesGI && formValuesGI.txtCallStatus && formValuesGI.txtCallStatus.ID === 1 ? (
                      <>
                        {formValuesGI &&
                        formValuesGI.txtCallStatus &&
                        formValuesGI.txtCallStatus.ID === 1 &&
                        activeKey === "PRMCAL" &&
                        activeBtnKey === "BTNNXT" ? (
                          <PremiumCalculator
                            objStateData={objStateData}
                            objDistrictData={objDistrictData}
                            formValuesGI={formValuesGI}
                            dcryptUNQEID={dcryptUNQEID}
                          />
                        ) : null}{" "}
                      </>
                    ) : null}
                    {formValuesGI && formValuesGI.txtCallStatus && formValuesGI.txtCallStatus.ID === 1 && activeKey === "TCKT" && activeBtnKey === "BTNNXT" ? (
                      <CreateTicket
                        dcryptUNQEID={dcryptUNQEID}
                        dcryptUMBLENO={dcryptUMBLENO}
                        objStateData={objStateData}
                        objDistrictData={objDistrictData}
                        farmerName={farmerName}
                        selectedFarmer={selectedFarmer}
                        setSelectedFarmer={setSelectedFarmer}
                        fetchfarmersummary={fetchfarmersummary}
                        setfetchfarmersummary={setfetchfarmersummary}
                        farmersTicketSummaryData={farmersTicketSummaryData}
                        setFarmersTicketSummaryData={setFarmersTicketSummaryData}
                        stateCropLossIntimation={stateCropLossIntimation}
                        setStateCropLossIntimation={setStateCropLossIntimation}
                        farmerAuthenticateByMobile={farmerAuthenticateByMobile}
                        formValuesGI={formValuesGI}
                        setFormValuesGI={setFormValuesGI}
                        serviceSuccessState={serviceSuccessState}
                        setServiceSuccessState={setServiceSuccessState}
                        setgetSupportTicketNo={setgetSupportTicketNo}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <ServiceSuccess getSupportTicketNo={getSupportTicketNo} setServiceSuccessState={setServiceSuccessState} />
      )}
    </>
  );
}

export default KrphAllActivities;
