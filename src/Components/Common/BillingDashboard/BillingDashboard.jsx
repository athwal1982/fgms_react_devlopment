import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { Accordion } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./BillingDashboard.scss";
import { PageBar } from "Framework/Components/Layout";
import { Button, Loader } from "Framework/Components/Widgets";
import { FaUserFriends, FaCalendarAlt, FaPhoneAlt, FaChalkboardTeacher, FaFileExcel, FaInfoCircle } from "react-icons/fa";
import { numberWithCommas } from "Configration/Utilities/utils";
import * as XLSX from "xlsx";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { getMasterDataBinding } from "../../Modules/Support/ManageTicket/Services/Methods";
import {
  billingAgentDashboardData,
  billingObCallDetailsData,
  billingIbCompanyShareDetailsData,
  billingAgentWorkingDayDetailsData,
  billingSmsCompanyDetailsData,
  billingobcompanyShareDetailsData,
  agentOvertimeDetailsData,
} from "./Services/Services";

function BillingDashboard() {
  const setAlertMessage = AlertMessage();
  const [activeKey, setActiveKey] = useState("");
  const [activeKeyAgentWorking, setActiveKeyAgentWorking] = useState("");

  const [monthList] = useState([
    // A { label: "Jan", value: 1 },
    // A { label: "Feb", value: 2 },
    // A { label: "Mar", value: 3 },
    // A { label: "Apr", value: 4 },
    // A { label: "May", value: 5 },
    // A { label: "Jun", value: 6 },
    // A { label: "Jul", value: 7 },
    // A { label: "Aug", value: 8 },
    { label: "Sep", value: 9 },
    { label: "Oct", value: 10 },
    // A { label: "Nov", value: 11 },
    // A { label: "Dec", value: 12 },
  ]);
  const [yearList, setYearList] = useState([]);

  const [searchFormValues, setSearchFormValues] = useState({
    txtInsuranceCompany: null,
    txtYearFilter: null,
    txtMonthFilter: null,
  });
  const updateSearchFormState = (name, value) => {
    debugger;
    setSearchFormValues({ ...searchFormValues, [name]: value });
  };

  const [insuranceCompanyList, setInsuranceCompanyList] = useState([]);
  const getInsuranceCompanyListData = async () => {
    try {
      setInsuranceCompanyList([]);
      const userData = getSessionStorage("user");
      const formdata = {
        filterID: userData && userData.LoginID ? userData.LoginID : 0,
        filterID1: 0,
        masterName: "INSURASIGN",
        searchText: "#ALL",
        searchCriteria: "",
      };
      const result = await getMasterDataBinding(formdata);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setInsuranceCompanyList(result.response.responseData.masterdatabinding);
        } else {
          setInsuranceCompanyList([]);
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

  const rsetOnClick = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    setSearchFormValues({
      ...searchFormValues,
      txtYearFilter: { label: currentYear.toString(), value: currentYear.toString() },
      txtMonthFilter: { label: monthList[0].label, value: monthList[0].value },
    });
    setheader({
      year: currentYear.toString(),
      month: monthList[0].label,
    });
    setActiveKey("");
    setbillingDashBoardListList([]);
    setbillingDashBoardObICDetailsList([]);
    setbillingDashBoardAgentWorkingDetailsList([]);
    setbillingDashBoardAgentICListList([]);
    setnoOfActiveAgents(0);
    settotalICTotalAmount(0);
    settotalICGSTAmount(0);
    settotalICTotalBillableAmount(0);
    settotalICAgentTotalAmount(0);
    settotalICAgentGSTAmount(0);
    settotalICAgentTotalBillableAmount(0);
    settotalICOBTotalAmount(0);
    settotalICOBGSTAmount(0);
    settotalICOBTotalBillableAmount(0);
    settotalICTxtMsgTotalAmount(0);
    settotalICTxtMsgGSTAmount(0);
    settotalICTxtMsgTotalBillableAmount(0);
    setgrandTotalICIBPercntShare(0);
    setgrandTotalICIBTaggedCalls(0);
    setgrandTotalICIBUnTaggedCalls(0);
    setgrandTotalIBTCAgentPercntShare(0);
    setgrandTotalOBTCPercntShare(0);
    setgrandTotalTextMsgPercntShare(0);
    settotalICAgentTotalAmountOverTime(0);
    settotalICAgentGSTAmountOverTime(0);
    setnoOfWorkingDaysOverTime(0);
    setTotalworking_days_overtime(0);
    setTotalweekly_off__holidays_overtime(0);
    setTotaltotal_no_of_working_days_overtime(0);
    setTotalovertime_hours_overtime(0);
    setbillingDashBoardAgentWorkingOverTimeDetailsList([]);
    setbillingDashBoardAgentOverTimeList([]);
    setbillingDashBoardAgentOverTimeICListList([]);
    setgrandTotalAgentCostOverTime(0);
    setgrandTotalIBTCAgentPercntShareOverTime(0);
    settotalICAgentTotalBillableAmountOverTime(0);
    setIsLoadingBillingDashBoardList(false);
  };

  const [billingDashBoardList, setbillingDashBoardListList] = useState([]);
  const [billingDashBoardAgentOverTimeList, setbillingDashBoardAgentOverTimeList] = useState([]);
  const [billingDashBoardObICDetailsList, setbillingDashBoardObICDetailsList] = useState([]);
  const [billingDashBoardAgentWorkingDetailsList, setbillingDashBoardAgentWorkingDetailsList] = useState([]);
  const [billingDashBoardAgentWorkingOverTimeDetailsList, setbillingDashBoardAgentWorkingOverTimeDetailsList] = useState([]);
  const [noOfActiveAgents, setnoOfActiveAgents] = useState();
  const [billingDashBoardAgentICList, setbillingDashBoardAgentICListList] = useState([]);
  const [billingDashBoardAgentOverTimeICList, setbillingDashBoardAgentOverTimeICListList] = useState([]);
  const [isLoadingBillingDashBoardList, setIsLoadingBillingDashBoardList] = useState(false);
  const [grandTotalICIBPulses, setgrandTotalICIBPulses] = useState(0);
  const [grandTotalICIBPercntShare, setgrandTotalICIBPercntShare] = useState(0);
  const [grandTotalICIBTaggedCalls, setgrandTotalICIBTaggedCalls] = useState(0);
  const [grandTotalICIBUnTaggedCalls, setgrandTotalICIBUnTaggedCalls] = useState(0);
  const [grandTotalAgentCost, setgrandTotalAgentCost] = useState(0);
  const [grandTotalIBTCAgentPercntShare, setgrandTotalIBTCAgentPercntShare] = useState(0);
  const [grandTotalAgentCostOverTime, setgrandTotalAgentCostOverTime] = useState(0);
  const [grandTotalIBTCAgentPercntShareOverTime, setgrandTotalIBTCAgentPercntShareOverTime] = useState(0);
  const [grandTotalOBPulses, setgrandTotalOBPulses] = useState(0);
  const [grandTotalOBTCPercntShare, setgrandTotalOBTCPercntShare] = useState(0);
  const [grandTotalTextMsg, setgrandTotalTextMsg] = useState(0);
  const [grandTotalTextMsgPercntShare, setgrandTotalTextMsgPercntShare] = useState(0);
  const [totalICTotalAmount, settotalICTotalAmount] = useState(0);
  const [totalICGSTAmount, settotalICGSTAmount] = useState(0);
  const [totalICTotalBillableAmount, settotalICTotalBillableAmount] = useState(0);

  const [totalICAgentTotalAmount, settotalICAgentTotalAmount] = useState(0);
  const [totalICAgentGSTAmount, settotalICAgentGSTAmount] = useState(0);
  const [totalICAgentTotalBillableAmount, settotalICAgentTotalBillableAmount] = useState(0);

  const [totalICAgentTotalAmountOverTime, settotalICAgentTotalAmountOverTime] = useState(0);
  const [totalICAgentGSTAmountOverTime, settotalICAgentGSTAmountOverTime] = useState(0);
  const [totalICAgentTotalBillableAmountOverTime, settotalICAgentTotalBillableAmountOverTime] = useState(0);

  const [totalICOBTotalAmount, settotalICOBTotalAmount] = useState(0);
  const [totalICOBGSTAmount, settotalICOBGSTAmount] = useState(0);
  const [totalICOBTotalBillableAmount, settotalICOBTotalBillableAmount] = useState(0);

  const [totalICTxtMsgTotalAmount, settotalICTxtMsgTotalAmount] = useState(0);
  const [totalICTxtMsgGSTAmount, settotalICTxtMsgGSTAmount] = useState(0);
  const [totalICTxtMsgTotalBillableAmount, settotalICTxtMsgTotalBillableAmount] = useState(0);

  const [Totalno_of_working_hours, setTotalno_of_working_hours] = useState(0);
  const [Totalno_of_training_hours, setTotalno_of_training_hours] = useState(0);
  const [Totalworking_days, setTotalworking_days] = useState(0);
  const [Totalweekly_off__holidays, setTotalweekly_off__holidays] = useState(0);
  const [Totaltotal_no_of_working_days, setTotaltotal_no_of_working_days] = useState(0);
  const [Totalovertime_hours, setTotalovertime_hours] = useState(0);

  const [Totalworking_days_overtime, setTotalworking_days_overtime] = useState(0);
  const [Totalweekly_off__holidays_overtime, setTotalweekly_off__holidays_overtime] = useState(0);
  const [Totaltotal_no_of_working_days_overtime, setTotaltotal_no_of_working_days_overtime] = useState(0);
  const [Totalovertime_hours_overtime, setTotalovertime_hours_overtime] = useState(0);

  const [noOfWorkingDays, setnoOfWorkingDays] = useState();
  const [noOfWorkingDaysOverTime, setnoOfWorkingDaysOverTime] = useState();

  const daysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const getbillingAgentDashboardList = async (formattedStartDate, formattedEndDate) => {
    try {
      debugger;
      setIsLoadingBillingDashBoardList(true);
      const formData = {
        from: formattedStartDate,
        to: formattedEndDate,
        ic: insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1 ? insuranceCompanyList[0].CompanyName : "",
      };
      const result = await billingAgentDashboardData(formData);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.length > 0) {
          setbillingDashBoardListList(result.responseData);
          // A setnoOfActiveAgents(result.responseData[0].active_agent);
          setnoOfWorkingDays(result.responseData[0].total_working_days_in_month);
          getbillingDashBoardAgentICDataList(formattedStartDate, formattedEndDate, result.responseData[0].total_working_days_in_month);
        } else {
          setbillingDashBoardListList([]);
        }
      } else {
        setbillingDashBoardListList([]);
        setIsLoadingBillingDashBoardList(false);
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoadingBillingDashBoardList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const getbillingAgentOverTimeDashboardList = async (formattedStartDate, formattedEndDate) => {
    try {
      debugger;
      const formData = {
        from: formattedStartDate,
        to: formattedEndDate,
        ic: insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1 ? insuranceCompanyList[0].CompanyName : "",
      };
      const result = await billingAgentDashboardData(formData);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.length > 0) {
          setbillingDashBoardAgentOverTimeList(result.responseData);
          setIsLoadingBillingDashBoardList(false);
        } else {
          setbillingDashBoardAgentOverTimeList([]);
          setIsLoadingBillingDashBoardList(false);
        }
      } else {
        setbillingDashBoardAgentOverTimeList([]);
        setIsLoadingBillingDashBoardList(false);
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoadingBillingDashBoardList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const getbillingObCallDetailsList = async (formattedStartDate, formattedEndDate) => {
    try {
      debugger;
      setIsLoadingBillingDashBoardList(true);
      const formData = {
        from: formattedStartDate,
        to: formattedEndDate,
        ic: insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1 ? insuranceCompanyList[0].CompanyName : "",
      };
      const result = await billingObCallDetailsData(formData);
      setIsLoadingBillingDashBoardList(false);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.length > 0) {
          setbillingDashBoardListList(result.responseData);
          getbillingobcompanyShareDetailsDataList(formattedStartDate, formattedEndDate);
        } else {
          setbillingDashBoardListList([]);
        }
      } else {
        setbillingDashBoardListList([]);
        setIsLoadingBillingDashBoardList(false);
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoadingBillingDashBoardList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const getbillingSmsCompanyDetailsList = async (formattedStartDate, formattedEndDate) => {
    try {
      debugger;
      setIsLoadingBillingDashBoardList(true);
      const formData = {
        active_agent: "",
        from: formattedStartDate,
        to: formattedEndDate,
        ic: insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1 ? insuranceCompanyList[0].CompanyName : "",
      };
      const result = await billingSmsCompanyDetailsData(formData);
      setIsLoadingBillingDashBoardList(false);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.length > 0) {
          setbillingDashBoardListList(result.responseData);
          let pTotalTextMsg = 0;
          let pTotalTextMsgPercntShare = 0;
          let ptotalICTxtMsgTotalAmount = 0;
          let ptotalICTxtMsgGSTAmount = 0;
          let ptotalICTxtMsgTotalBillableAmount = 0;
          if (result.responseData[0].length > 0) {
            result.responseData[0].forEach((v) => {
              pTotalTextMsg += parseFloat(v.sms_submission);
              pTotalTextMsgPercntShare += parseFloat(v.perentage_pulses);
              ptotalICTxtMsgTotalAmount += parseFloat(v.total_amount);
              ptotalICTxtMsgGSTAmount += parseFloat((parseFloat(v.total_amount) * 18) / 100);
            });
          }
          setgrandTotalTextMsg(pTotalTextMsg);
          setgrandTotalTextMsgPercntShare(pTotalTextMsgPercntShare);
          settotalICTxtMsgTotalAmount(ptotalICTxtMsgTotalAmount);
          settotalICTxtMsgGSTAmount(ptotalICTxtMsgGSTAmount);
          ptotalICTxtMsgTotalBillableAmount = parseFloat(ptotalICTxtMsgTotalAmount + ptotalICTxtMsgGSTAmount);
          settotalICTxtMsgTotalBillableAmount(ptotalICTxtMsgTotalBillableAmount);
        } else {
          setbillingDashBoardListList([]);
          setIsLoadingBillingDashBoardList(false);
          setAlertMessage({
            type: "error",
            message: result.responseMessage,
          });
        }
      } else {
        setbillingDashBoardListList([]);
      }
    } catch (error) {
      console.log(error);
      setIsLoadingBillingDashBoardList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const getbillingIbCompanyShareDetailsList = async (formattedStartDate, formattedEndDate) => {
    try {
      debugger;
      setIsLoadingBillingDashBoardList(true);
      const formData = {
        from: formattedStartDate,
        to: formattedEndDate,
        ic: insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1 ? insuranceCompanyList[0].CompanyName : "",
      };
      const result = await billingIbCompanyShareDetailsData(formData);
      setIsLoadingBillingDashBoardList(false);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.length > 0) {
          setbillingDashBoardListList(result.responseData);
          let ptotalbillingpulses = 0;
          let ptotalICPercntShare = 0;
          let pTotalICIBTaggedCalls = 0;
          let pTotalICIBUnTaggedCalls = 0;
          let ptotalICTotalAmount = 0;
          let ptotalICGSTAmount = 0;
          let ptotalICTotalBillableAmount = 0;
          if (result.responseData[0].IC_data.length > 0) {
            result.responseData[0].IC_data.forEach((v) => {
              ptotalbillingpulses += parseFloat(v.total_billing_pulses);
              ptotalICPercntShare += parseFloat(v.percentagePulse);
              pTotalICIBTaggedCalls += parseFloat(v.taged_pulses);
              pTotalICIBUnTaggedCalls += parseFloat(v.untaged_pulses);
              ptotalICTotalAmount += parseFloat(v.total_amount);
              ptotalICGSTAmount += parseFloat((parseFloat(v.total_amount) * 18) / 100);
            });
          }
          setgrandTotalICIBPulses(ptotalbillingpulses);
          setgrandTotalICIBPercntShare(ptotalICPercntShare);
          setgrandTotalICIBTaggedCalls(pTotalICIBTaggedCalls);
          setgrandTotalICIBUnTaggedCalls(pTotalICIBUnTaggedCalls);
          settotalICTotalAmount(ptotalICTotalAmount);
          settotalICGSTAmount(ptotalICGSTAmount);
          ptotalICTotalBillableAmount = parseFloat(ptotalICTotalAmount + ptotalICGSTAmount);
          settotalICTotalBillableAmount(ptotalICTotalBillableAmount);
        } else {
          setbillingDashBoardListList([]);
          setIsLoadingBillingDashBoardList(false);
          setAlertMessage({
            type: "error",
            message: result.responseMessage,
          });
        }
      } else {
        setbillingDashBoardListList([]);
      }
    } catch (error) {
      console.log(error);
      setIsLoadingBillingDashBoardList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const getbillingAgentWorkingDayDetailsDataList = async (formattedStartDate, formattedEndDate) => {
    try {
      debugger;
      setbillingDashBoardAgentWorkingDetailsList([]);
      // A setTotalno_of_working_hours(0);
      // A setTotalno_of_training_hours(0);
      setTotalworking_days(0);
      setTotalweekly_off__holidays(0);
      setTotaltotal_no_of_working_days(0);
      setTotalovertime_hours(0);
      const formData = {
        active_agent: "0",
        from: formattedStartDate,
        to: formattedEndDate,
        ic: insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1 ? insuranceCompanyList[0].CompanyName : "",
      };
      const result = await billingAgentWorkingDayDetailsData(formData);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.length > 0) {
          setbillingDashBoardAgentWorkingDetailsList(result.responseData);
          // A let pTotalno_of_working_hours = 0;
          // A let pTotalno_of_training_hours = 0;
          let pTotalworking_days = 0;
          let pTotalweekly_off__holidays = 0;
          let pTotaltotal_no_of_working_days = 0;
          let pTotalovertime_hours = 0;
          result.responseData.forEach((v) => {
            // A pTotalno_of_working_hours += parseFloat(v.no_of_working_hours);
            // A pTotalno_of_training_hours += parseFloat(v.no_of_training_hours);
            pTotalworking_days += parseFloat(v.working_days);
            pTotalweekly_off__holidays += parseFloat(v.holidays && v.holidays.total_holidays ? v.holidays.total_holidays : 0);
            pTotaltotal_no_of_working_days += parseFloat(v.total_working_days);
            pTotalovertime_hours += parseFloat(v.overtime_hours);
          });
          // A setTotalno_of_working_hours(pTotalno_of_working_hours);
          // A setTotalno_of_training_hours(pTotalno_of_training_hours);
          setTotalworking_days(pTotalworking_days);
          setTotalweekly_off__holidays(pTotalweekly_off__holidays);
          setTotaltotal_no_of_working_days(pTotaltotal_no_of_working_days);
          setTotalovertime_hours(pTotalovertime_hours);
        } else {
          setbillingDashBoardAgentWorkingDetailsList([]);
          // A setTotalno_of_working_hours(0);
          // A setTotalno_of_training_hours(0);
          setTotalworking_days(0);
          setTotalweekly_off__holidays(0);
          setTotaltotal_no_of_working_days(0);
          setTotalovertime_hours(0);
        }
      } else {
        setbillingDashBoardAgentWorkingDetailsList([]);
        // A setTotalno_of_working_hours(0);
        // A setTotalno_of_training_hours(0);
        setTotalworking_days(0);
        setTotalweekly_off__holidays(0);
        setTotaltotal_no_of_working_days(0);
        setTotalovertime_hours(0);
        setIsLoadingBillingDashBoardList(false);
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoadingBillingDashBoardList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const getbillingAgentWorkingOverTimeDetailsDataList = async (formattedStartDate, formattedEndDate) => {
    try {
      debugger;
      setbillingDashBoardAgentWorkingOverTimeDetailsList([]);
      setTotalworking_days_overtime(0);
      setTotalweekly_off__holidays_overtime(0);
      setTotaltotal_no_of_working_days_overtime(0);
      setTotalovertime_hours_overtime(0);
      setIsLoadingBillingDashBoardList(true);
      const formData = {
        active_agent: "0",
        from: formattedStartDate,
        to: formattedEndDate,
        ic: insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1 ? insuranceCompanyList[0].CompanyName : "",
      };
      const result = await agentOvertimeDetailsData(formData);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.agents.length > 0) {
          setbillingDashBoardAgentWorkingOverTimeDetailsList(result.responseData.agents);
          let pTotalworking_days_overtime = 0;
          let pTotalweekly_off__holidays_overtime = 0;
          let pTotaltotal_no_of_working_days_overtime = 0;
          let pTotalovertime_hours_overtime = 0;
          result.responseData.agents.forEach((v) => {
            pTotalworking_days_overtime += parseFloat(v.working_days);
            pTotalweekly_off__holidays_overtime += parseFloat(v.holidays && v.holidays.total_holidays ? v.holidays.total_holidays : 0);
            pTotaltotal_no_of_working_days_overtime += parseFloat(v.total_working_days);
            pTotalovertime_hours_overtime += parseFloat(v.overtime_hours);
          });
          setTotalworking_days_overtime(pTotalworking_days_overtime);
          setTotalweekly_off__holidays_overtime(pTotalweekly_off__holidays_overtime);
          setTotaltotal_no_of_working_days_overtime(pTotaltotal_no_of_working_days_overtime);
          setTotalovertime_hours_overtime(pTotalovertime_hours_overtime);
          setnoOfWorkingDaysOverTime(result.responseData.total_overtime_hour);
          getbillingDashBoardAgentOverTimeICDataList(formattedStartDate, formattedEndDate, result.responseData.total_overtime_hour);
        } else {
          setbillingDashBoardAgentWorkingOverTimeDetailsList([]);
          setTotalworking_days_overtime(0);
          setTotalweekly_off__holidays_overtime(0);
          setTotaltotal_no_of_working_days_overtime(0);
          setTotalovertime_hours_overtime(0);
        }
      } else {
        setbillingDashBoardAgentWorkingOverTimeDetailsList([]);
        setTotalworking_days_overtime(0);
        setTotalweekly_off__holidays_overtime(0);
        setTotaltotal_no_of_working_days_overtime(0);
        setTotalovertime_hours_overtime(0);
        setIsLoadingBillingDashBoardList(false);
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoadingBillingDashBoardList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const getbillingobcompanyShareDetailsDataList = async (formattedStartDate, formattedEndDate) => {
    try {
      debugger;
      setbillingDashBoardObICDetailsList([]);
      setIsLoadingBillingDashBoardList(true);
      const formData = {
        from: formattedStartDate,
        to: formattedEndDate,
        ic: insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1 ? insuranceCompanyList[0].CompanyName : "",
      };
      const result = await billingobcompanyShareDetailsData(formData);
      setIsLoadingBillingDashBoardList(false);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.length > 0) {
          setbillingDashBoardObICDetailsList(result.responseData);
          let pTotalOBPulses = 0;
          let pTotalOBTCPercntShare = 0;
          let ptotalICOBTotalAmount = 0;
          let ptotalICOBGSTAmount = 0;
          let ptotalICOBTotalBillableAmount = 0;
          if (result.responseData[0].ic_data.length > 0) {
            result.responseData[0].ic_data.forEach((v) => {
              pTotalOBPulses += parseFloat(v.total_pulses);
              pTotalOBTCPercntShare += parseFloat(v.tagged_pulse_percentage);
              ptotalICOBTotalAmount += parseFloat(v.total_amount);
              ptotalICOBGSTAmount += parseFloat((parseFloat(v.total_amount) * 18) / 100);
            });
          }
          setgrandTotalOBPulses(pTotalOBPulses);
          setgrandTotalOBTCPercntShare(pTotalOBTCPercntShare);
          settotalICOBTotalAmount(ptotalICOBTotalAmount);
          settotalICOBGSTAmount(ptotalICOBGSTAmount);
          ptotalICOBTotalBillableAmount = parseFloat(ptotalICOBTotalAmount + ptotalICOBGSTAmount);
          settotalICOBTotalBillableAmount(ptotalICOBTotalBillableAmount);
        } else {
          setbillingDashBoardObICDetailsList([]);
        }
      } else {
        setbillingDashBoardObICDetailsList([]);
        setIsLoadingBillingDashBoardList(false);
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoadingBillingDashBoardList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const getbillingDashBoardAgentICDataList = async (formattedStartDate, formattedEndDate, pnoOfWorkingDays) => {
    try {
      debugger;
      const formData = {
        from: formattedStartDate,
        to: formattedEndDate,
        ic: insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1 ? insuranceCompanyList[0].CompanyName : "",
      };
      const result = await billingIbCompanyShareDetailsData(formData);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.length > 0) {
          setbillingDashBoardAgentICListList(result.responseData);
          // A let ptotalAgentCost = 0;
          let ptotalShareOfWorkingDays = 0;
          let ptotalIBTCAgentPercntShare = 0;
          let ptotalICAgentTotalAmount = 0;
          let ptotalICAgentGSTAmount = 0;
          let ptotalICAgentTotalBillableAmount = 0;
          if (result.responseData[0].IC_data.length > 0) {
            result.responseData[0].IC_data.forEach((v) => {
              ptotalShareOfWorkingDays += parseFloat(parseFloat(v.percentagePulse * pnoOfWorkingDays) / 100);
              ptotalIBTCAgentPercntShare += parseFloat(v.percentagePulse);
            });
          }
          const totalDaysInMonth = daysInMonth(searchFormValues.txtMonthFilter.value, searchFormValues.txtYearFilter.value);
          ptotalICAgentTotalAmount = parseFloat(parseFloat(ptotalShareOfWorkingDays * 31000)) / totalDaysInMonth;
          ptotalICAgentGSTAmount = parseFloat((parseFloat(ptotalICAgentTotalAmount) * 18) / 100);

          setgrandTotalAgentCost(ptotalShareOfWorkingDays);
          setgrandTotalIBTCAgentPercntShare(ptotalIBTCAgentPercntShare);
          settotalICAgentTotalAmount(ptotalICAgentTotalAmount);
          settotalICAgentGSTAmount(ptotalICAgentGSTAmount);
          ptotalICAgentTotalBillableAmount = parseFloat(ptotalICAgentTotalAmount + ptotalICAgentGSTAmount);
          settotalICAgentTotalBillableAmount(ptotalICAgentTotalBillableAmount);
        } else {
          setbillingDashBoardAgentICListList([]);
        }
      } else {
        setbillingDashBoardObICDetailsList([]);
        setIsLoadingBillingDashBoardList(false);
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
      setIsLoadingBillingDashBoardList(false);
    } catch (error) {
      console.log(error);
      setIsLoadingBillingDashBoardList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const getbillingDashBoardAgentOverTimeICDataList = async (formattedStartDate, formattedEndDate, pnoOfWorkingOverTime) => {
    try {
      debugger;
      const formData = {
        from: formattedStartDate,
        to: formattedEndDate,
        ic: insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1 ? insuranceCompanyList[0].CompanyName : "",
      };
      const result = await billingIbCompanyShareDetailsData(formData);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.length > 0) {
          setbillingDashBoardAgentOverTimeICListList(result.responseData);
          // A let ptotalAgentCost = 0;
          let ptotalShareOfWorkingDaysOverTime = 0;
          let ptotalIBTCAgentPercntShareOverTime = 0;
          let ptotalICAgentTotalAmountOverTime = 0;
          let ptotalICAgentGSTAmountOverTime = 0;
          let ptotalICAgentTotalBillableAmountOverTime = 0;
          if (result.responseData[0].IC_data.length > 0) {
            result.responseData[0].IC_data.forEach((v) => {
              ptotalShareOfWorkingDaysOverTime += parseFloat(parseFloat(v.percentagePulse * pnoOfWorkingOverTime) / 100);
              ptotalIBTCAgentPercntShareOverTime += parseFloat(v.percentagePulse);
            });
          }
          const totalDaysInMonth = daysInMonth(searchFormValues.txtMonthFilter.value, searchFormValues.txtYearFilter.value);
          ptotalICAgentTotalAmountOverTime = parseFloat(parseFloat(parseFloat(parseFloat(pnoOfWorkingOverTime * 31000)) / totalDaysInMonth / 8) * 2);
          ptotalICAgentGSTAmountOverTime = parseFloat((parseFloat(ptotalICAgentTotalAmountOverTime) * 18) / 100);

          setgrandTotalAgentCostOverTime(ptotalShareOfWorkingDaysOverTime);
          setgrandTotalIBTCAgentPercntShareOverTime(ptotalIBTCAgentPercntShareOverTime);
          settotalICAgentTotalAmountOverTime(ptotalICAgentTotalAmountOverTime);
          settotalICAgentGSTAmountOverTime(ptotalICAgentGSTAmountOverTime);
          ptotalICAgentTotalBillableAmountOverTime = parseFloat(ptotalICAgentTotalAmountOverTime + ptotalICAgentGSTAmountOverTime);
          settotalICAgentTotalBillableAmountOverTime(ptotalICAgentTotalBillableAmountOverTime);
          getbillingAgentOverTimeDashboardList(formattedStartDate, formattedEndDate);
        } else {
          setbillingDashBoardAgentOverTimeICListList([]);
        }
      } else {
        setbillingDashBoardAgentOverTimeICListList([]);
        setIsLoadingBillingDashBoardList(false);
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoadingBillingDashBoardList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const getbillingIbCompanyShareDetailsForSummary = async (formattedStartDate, formattedEndDate) => {
    try {
      const formData = {
        from: formattedStartDate,
        to: formattedEndDate,
        ic: insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1 ? insuranceCompanyList[0].CompanyName : "",
      };
      settotalICTotalAmount(0);
      settotalICGSTAmount(0);
      settotalICTotalBillableAmount(0);
      setIsLoadingBillingDashBoardList(true);
      const result = await billingIbCompanyShareDetailsData(formData);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.length > 0) {
          let ptotalICTotalAmount = 0;
          let ptotalICGSTAmount = 0;
          let ptotalICTotalBillableAmount = 0;
          if (result.responseData[0].IC_data.length > 0) {
            result.responseData[0].IC_data.forEach((v) => {
              ptotalICTotalAmount += parseFloat(v.total_amount);
              ptotalICGSTAmount += parseFloat((parseFloat(v.total_amount) * 18) / 100);
            });
          }
          settotalICTotalAmount(ptotalICTotalAmount);
          settotalICGSTAmount(ptotalICGSTAmount);
          ptotalICTotalBillableAmount = parseFloat(ptotalICTotalAmount + ptotalICGSTAmount);
          settotalICTotalBillableAmount(ptotalICTotalBillableAmount);
        } else {
          settotalICTotalAmount(0);
          settotalICGSTAmount(0);
          settotalICTotalBillableAmount(0);
        }
        getbillingAgentDashboardForSummary(formattedStartDate, formattedEndDate);
      } else {
        settotalICTotalAmount(0);
        settotalICGSTAmount(0);
        settotalICTotalBillableAmount(0);
        setIsLoadingBillingDashBoardList(false);
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoadingBillingDashBoardList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };
  const getbillingAgentDashboardForSummary = async (formattedStartDate, formattedEndDate) => {
    try {
      const formData = {
        from: formattedStartDate,
        to: formattedEndDate,
        ic: insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1 ? insuranceCompanyList[0].CompanyName : "",
      };
      const result = await billingAgentDashboardData(formData);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.length > 0) {
          getbillingDashBoardAgentICDataForSummary(formattedStartDate, formattedEndDate, result.responseData[0].total_working_days_in_month);
        }
      }
    } catch (error) {
      console.log(error);
      setIsLoadingBillingDashBoardList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const getbillingDashBoardAgentICDataForSummary = async (formattedStartDate, formattedEndDate, pnoOfWorkingDays) => {
    try {
      const formData = {
        from: formattedStartDate,
        to: formattedEndDate,
        ic: insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1 ? insuranceCompanyList[0].CompanyName : "",
      };
      settotalICAgentTotalAmount(0);
      settotalICAgentGSTAmount(0);
      settotalICAgentTotalBillableAmount(0);
      const result = await billingIbCompanyShareDetailsData(formData);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.length > 0) {
          // A let ptotalAgentCost = 0;
          let ptotalShareOfWorkingDays = 0;
          let ptotalIBTCAgentPercntShare = 0;
          let ptotalICAgentTotalAmount = 0;
          let ptotalICAgentGSTAmount = 0;
          let ptotalICAgentTotalBillableAmount = 0;
          if (result.responseData[0].IC_data.length > 0) {
            result.responseData[0].IC_data.forEach((v) => {
              ptotalShareOfWorkingDays += parseFloat(parseFloat(v.percentagePulse * pnoOfWorkingDays) / 100);
            });
          }
          const totalDaysInMonth = daysInMonth(searchFormValues.txtMonthFilter.value, searchFormValues.txtYearFilter.value);
          ptotalICAgentTotalAmount = parseFloat(parseFloat(ptotalShareOfWorkingDays * 31000)) / totalDaysInMonth;
          ptotalICAgentGSTAmount = parseFloat((parseFloat(ptotalICAgentTotalAmount) * 18) / 100);
          settotalICAgentTotalAmount(ptotalICAgentTotalAmount);
          settotalICAgentGSTAmount(ptotalICAgentGSTAmount);
          ptotalICAgentTotalBillableAmount = parseFloat(ptotalICAgentTotalAmount + ptotalICAgentGSTAmount);
          settotalICAgentTotalBillableAmount(ptotalICAgentTotalBillableAmount);
        } else {
          settotalICAgentTotalAmount(0);
          settotalICAgentGSTAmount(0);
          settotalICAgentTotalBillableAmount(0);
        }
        getbillingAgentWorkingOverTimeDetailsDataListForSummary(formattedStartDate, formattedEndDate);
      } else {
        settotalICAgentTotalAmount(0);
        settotalICAgentGSTAmount(0);
        settotalICAgentTotalBillableAmount(0);
        setIsLoadingBillingDashBoardList(false);
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoadingBillingDashBoardList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const getbillingObCallDetailsForSummary = async (formattedStartDate, formattedEndDate) => {
    try {
      const formData = {
        from: formattedStartDate,
        to: formattedEndDate,
        ic: insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1 ? insuranceCompanyList[0].CompanyName : "",
      };
      settotalICOBTotalAmount(0);
      settotalICOBGSTAmount(0);
      settotalICOBTotalBillableAmount(0);
      const result = await billingobcompanyShareDetailsData(formData);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.length > 0) {
          let ptotalICOBTotalAmount = 0;
          let ptotalICOBGSTAmount = 0;
          let ptotalICOBTotalBillableAmount = 0;
          if (result.responseData[0].ic_data.length > 0) {
            result.responseData[0].ic_data.forEach((v) => {
              ptotalICOBTotalAmount += parseFloat(v.total_amount);
              ptotalICOBGSTAmount += parseFloat((parseFloat(v.total_amount) * 18) / 100);
            });
          }
          settotalICOBTotalAmount(ptotalICOBTotalAmount);
          settotalICOBGSTAmount(ptotalICOBGSTAmount);
          ptotalICOBTotalBillableAmount = parseFloat(ptotalICOBTotalAmount + ptotalICOBGSTAmount);
          settotalICOBTotalBillableAmount(ptotalICOBTotalBillableAmount);
        } else {
          settotalICOBTotalAmount(0);
          settotalICOBGSTAmount(0);
          settotalICOBTotalBillableAmount(0);
        }
        getbillingSmsCompanyDetailsSummary(formattedStartDate, formattedEndDate);
      } else {
        settotalICOBTotalAmount(0);
        settotalICOBGSTAmount(0);
        settotalICOBTotalBillableAmount(0);
        setIsLoadingBillingDashBoardList(false);
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoadingBillingDashBoardList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const getbillingSmsCompanyDetailsSummary = async (formattedStartDate, formattedEndDate) => {
    try {
      const formData = {
        active_agent: "",
        from: formattedStartDate,
        to: formattedEndDate,
        ic: insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1 ? insuranceCompanyList[0].CompanyName : "",
      };
      settotalICTxtMsgTotalAmount(0);
      settotalICTxtMsgGSTAmount(0);
      settotalICTxtMsgTotalBillableAmount(0);
      const result = await billingSmsCompanyDetailsData(formData);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.length > 0) {
          let ptotalICTxtMsgTotalAmount = 0;
          let ptotalICTxtMsgGSTAmount = 0;
          let ptotalICTxtMsgTotalBillableAmount = 0;
          if (result.responseData[0].length > 0) {
            result.responseData[0].forEach((v) => {
              ptotalICTxtMsgTotalAmount += parseFloat(v.total_amount);
              ptotalICTxtMsgGSTAmount += parseFloat((parseFloat(v.total_amount) * 18) / 100);
            });
          }
          settotalICTxtMsgTotalAmount(ptotalICTxtMsgTotalAmount);
          settotalICTxtMsgGSTAmount(ptotalICTxtMsgGSTAmount);
          ptotalICTxtMsgTotalBillableAmount = parseFloat(ptotalICTxtMsgTotalAmount + ptotalICTxtMsgGSTAmount);
          settotalICTxtMsgTotalBillableAmount(ptotalICTxtMsgTotalBillableAmount);
        } else {
          settotalICTxtMsgTotalAmount(0);
          settotalICTxtMsgGSTAmount(0);
          settotalICTxtMsgTotalBillableAmount(0);
        }
      } else {
        settotalICTxtMsgTotalAmount(0);
        settotalICTxtMsgGSTAmount(0);
        settotalICTxtMsgTotalBillableAmount(0);
        setIsLoadingBillingDashBoardList(false);
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
      setIsLoadingBillingDashBoardList(false);
    } catch (error) {
      console.log(error);
      setIsLoadingBillingDashBoardList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const getbillingAgentWorkingOverTimeDetailsDataListForSummary = async (formattedStartDate, formattedEndDate) => {
    try {
      debugger;
      setIsLoadingBillingDashBoardList(true);
      const formData = {
        active_agent: "0",
        from: formattedStartDate,
        to: formattedEndDate,
        ic: insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1 ? insuranceCompanyList[0].CompanyName : "",
      };
      const result = await agentOvertimeDetailsData(formData);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.agents.length > 0) {
          getbillingDashBoardAgentOverTimeICDataListForSummary(formattedStartDate, formattedEndDate, result.responseData.total_overtime_hour);
        }
      } else {
        setIsLoadingBillingDashBoardList(false);
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoadingBillingDashBoardList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const getbillingDashBoardAgentOverTimeICDataListForSummary = async (formattedStartDate, formattedEndDate, pnoOfWorkingOverTime) => {
    try {
      debugger;
      const formData = {
        from: formattedStartDate,
        to: formattedEndDate,
        ic: insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1 ? insuranceCompanyList[0].CompanyName : "",
      };
      const result = await billingIbCompanyShareDetailsData(formData);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.length > 0) {
          let ptotalShareOfWorkingDaysOverTime = 0;
          let ptotalICAgentTotalAmountOverTime = 0;
          let ptotalICAgentGSTAmountOverTime = 0;
          let ptotalICAgentTotalBillableAmountOverTime = 0;
          if (result.responseData[0].IC_data.length > 0) {
            result.responseData[0].IC_data.forEach((v) => {
              ptotalShareOfWorkingDaysOverTime += parseFloat(parseFloat(v.percentagePulse * pnoOfWorkingOverTime) / 100);
            });
          }
          const totalDaysInMonth = daysInMonth(searchFormValues.txtMonthFilter.value, searchFormValues.txtYearFilter.value);
          ptotalICAgentTotalAmountOverTime = parseFloat(parseFloat(parseFloat(parseFloat(pnoOfWorkingOverTime * 31000)) / totalDaysInMonth / 8) * 2);
          ptotalICAgentGSTAmountOverTime = parseFloat((parseFloat(ptotalICAgentTotalAmountOverTime) * 18) / 100);

          setgrandTotalAgentCostOverTime(ptotalShareOfWorkingDaysOverTime);
          settotalICAgentTotalAmountOverTime(ptotalICAgentTotalAmountOverTime);
          settotalICAgentGSTAmountOverTime(ptotalICAgentGSTAmountOverTime);
          ptotalICAgentTotalBillableAmountOverTime = parseFloat(ptotalICAgentTotalAmountOverTime + ptotalICAgentGSTAmountOverTime);
          settotalICAgentTotalBillableAmountOverTime(ptotalICAgentTotalBillableAmountOverTime);
          getbillingObCallDetailsForSummary(formattedStartDate, formattedEndDate);
        }
      } else {
        setIsLoadingBillingDashBoardList(false);
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoadingBillingDashBoardList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const OnClickTabDashBoard = (pType) => {
    debugger;
    if (searchFormValues.txtYearFilter === null) {
      setAlertMessage({
        type: "error",
        message: "Please select year",
      });
      return;
    }
    if (searchFormValues.txtMonthFilter === null) {
      setAlertMessage({
        type: "error",
        message: "Please select month",
      });
      return;
    }
    const year = searchFormValues.txtYearFilter.value;
    const month = searchFormValues.txtMonthFilter.value;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const formattedStartDate = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}-${String(startDate.getDate()).padStart(
      2,
      "0",
    )}`;
    const formattedEndDate = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;
    if (pType === "SMDTLS") {
      setActiveKey(pType);
      settotalICTotalAmount(0);
      settotalICGSTAmount(0);
      settotalICTotalBillableAmount(0);
      settotalICAgentTotalAmount(0);
      settotalICAgentGSTAmount(0);
      settotalICAgentTotalBillableAmount(0);
      settotalICAgentTotalAmountOverTime(0);
      settotalICAgentGSTAmountOverTime(0);
      settotalICAgentTotalBillableAmountOverTime(0);
      settotalICOBTotalAmount(0);
      settotalICOBGSTAmount(0);
      settotalICOBTotalBillableAmount(0);
      settotalICTxtMsgTotalAmount(0);
      settotalICTxtMsgGSTAmount(0);
      settotalICTxtMsgTotalBillableAmount(0);
      getbillingIbCompanyShareDetailsForSummary(formattedStartDate, formattedEndDate);
    } else if (pType === "INBNDCL") {
      setgrandTotalICIBPulses(0);
      settotalICTotalAmount(0);
      settotalICGSTAmount(0);
      settotalICTotalBillableAmount(0);
      setbillingDashBoardListList([]);
      getbillingIbCompanyShareDetailsList(formattedStartDate, formattedEndDate);
      setActiveKey(pType);
    } else if (pType === "AGNT") {
      setbillingDashBoardListList([]);
      setbillingDashBoardAgentICListList([]);
      setgrandTotalAgentCost(0);
      settotalICAgentTotalAmount(0);
      settotalICAgentGSTAmount(0);
      settotalICAgentTotalBillableAmount(0);
      getbillingAgentDashboardList(formattedStartDate, formattedEndDate);
      getbillingAgentWorkingDayDetailsDataList(formattedStartDate, formattedEndDate);
      setActiveKey(pType);
    } else if (pType === "AGNTOVRTM") {
      setbillingDashBoardAgentICListList([]);
      setgrandTotalAgentCostOverTime(0);
      settotalICAgentTotalAmountOverTime(0);
      settotalICAgentGSTAmountOverTime(0);
      settotalICAgentTotalBillableAmountOverTime(0);
      getbillingAgentWorkingOverTimeDetailsDataList(formattedStartDate, formattedEndDate);
      setActiveKey(pType);
    } else if (pType === "OTBNDCL") {
      setActiveKey(pType);
      setbillingDashBoardListList([]);
      setgrandTotalOBPulses(0);
      settotalICOBTotalAmount(0);
      settotalICOBGSTAmount(0);
      settotalICOBTotalBillableAmount(0);
      getbillingObCallDetailsList(formattedStartDate, formattedEndDate);
    } else if (pType === "TXTMSG") {
      setActiveKey(pType);
      setgrandTotalTextMsg(0);
      settotalICTxtMsgTotalAmount(0);
      settotalICTxtMsgGSTAmount(0);
      settotalICTxtMsgTotalBillableAmount(0);
      setbillingDashBoardListList([]);
      getbillingSmsCompanyDetailsList(formattedStartDate, formattedEndDate);
    } else if (pType === "WHAPP") {
      setActiveKey(pType);
    } else if (pType === "AIBT") {
      setActiveKey(pType);
    }
  };

  const rearrangeAndRenameColumns = (originalData, columnMapping) => {
    return originalData.map((item) => {
      const rearrangedItem = Object.fromEntries(Object.entries(columnMapping).map(([oldColumnName, newColumnName]) => [newColumnName, item[oldColumnName]]));
      return rearrangedItem;
    });
  };

  const OnClickExcelDataDownlaod = (pType) => {
    debugger;
    if (pType === "INBNDCL") {
      InBoundCallsDataArrangeAndDownload();
    } else if (pType === "OTBNDCL") {
      OutBoundCallsDataArrangeAndDownload();
    } else if (pType === "TXTMSG") {
      TextMessageCallsDataArrangeAndDownload();
    } else if (pType === "AGNT") {
      AgentsDataArrangeAndDownload();
    } else if (pType === "AGNTOVRTM") {
      AgentsOverTimeDataArrangeAndDownload();
    }
  };
  const InBoundCallsDataArrangeAndDownload = () => {
    const columnOrderTaggedUntagged = {
      total_matched_with_ticket: "Tagging With Tickets",
      total_matched_without_ticket: "Tagging Without Tickets",
      total_unmatched_pulses: "Total Untagged Calls",
    };
    const mappedDataTaggedUntagged = billingDashBoardList.map((value) => {
      return {
        total_matched_with_ticket: value.total_matched_with_ticket,
        total_matched_without_ticket: value.total_matched_without_ticket,
        total_unmatched_pulses: value.total_unmatched_pulses,
      };
    });
    const rearrangedDataTaggedUntagged = rearrangeAndRenameColumns(mappedDataTaggedUntagged, columnOrderTaggedUntagged);

    const columnOrderInboundICDetails = {
      _id: "Insurance Company",
      taged_pulses: "No. of In Bound Tagged Calls (IBTC) Pulses",
      percentagePulse: "% Share of IBTC Pulses",
      untaged_pulses: "Share of IB Untagged Calls",
      total_billing_pulses: "Total Billable Pulses",
    };
    const mappedDataInboundICDetails = billingDashBoardList[0].IC_data.map((value) => {
      return {
        _id: value._id,
        taged_pulses: value.taged_pulses ? parseFloat(value.taged_pulses).toFixed(2) : 0.0,
        percentagePulse: value.percentagePulse ? parseFloat(value.percentagePulse).toFixed(2) : 0.0,
        untaged_pulses: value.untaged_pulses ? parseFloat(value.untaged_pulses).toFixed(2) : 0.0,
        total_billing_pulses: value.total_billing_pulses ? parseFloat(value.total_billing_pulses).toFixed(2) : 0.0,
      };
    });
    const rearrangedDataInboundICDetails = rearrangeAndRenameColumns(mappedDataInboundICDetails, columnOrderInboundICDetails);
    downloadExcelInbound(rearrangedDataTaggedUntagged, rearrangedDataInboundICDetails);
  };

  const downloadExcelInbound = (dataTaggedUntagged, dataInboundICDetails) => {
    const worksheetTaggedUntagged = XLSX.utils.json_to_sheet(dataTaggedUntagged);
    const worksheetInboundICDetails = XLSX.utils.json_to_sheet(dataInboundICDetails);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheetTaggedUntagged, "Sheet1");
    XLSX.utils.book_append_sheet(workbook, worksheetInboundICDetails, "Sheet2");
    worksheetTaggedUntagged["!cols"] = [{ width: 30 }, { width: 30 }, { width: 30 }];
    worksheetInboundICDetails["!cols"] = [{ width: 55 }, { width: 40 }, { width: 20 }, { width: 32 }, { width: 20 }];
    XLSX.writeFile(workbook, `Inbound_Call_Details_${searchFormValues.txtYearFilter.value}_${searchFormValues.txtMonthFilter.label}.xlsx`);
  };

  const OutBoundCallsDataArrangeAndDownload = () => {
    const columnOrderCountAgentAndOutboundCalls = {
      totalDistinctAgents: "No. Of Active Agents",
      totalCalls: "No. Of Outbound Calls",
      totalCustPulse: "Total OB Billable Pulses",
    };
    const mappedDataCountAgentAndOutboundCalls = billingDashBoardList.map((value) => {
      return {
        totalDistinctAgents: value.totalDistinctAgents,
        totalCalls: value.totalCalls,
        totalCustPulse: value.totalCustPulse,
      };
    });
    const rearrangedDataCountAgentAndOutboundCalls = rearrangeAndRenameColumns(mappedDataCountAgentAndOutboundCalls, columnOrderCountAgentAndOutboundCalls);

    const columnOrderOutboundICDetails = {
      _id: "Insurance Company",
      percentagePulse: "% Share of OBTC Pulses ",
      total_billing_pulses: "Share of Outbound Calls",
    };
    const mappedDataOutboundICDetails = billingDashBoardObICDetailsList[0].IC_data.map((value) => {
      return {
        _id: value._id,
        percentagePulse: value.percentagePulse ? parseFloat(value.percentagePulse).toFixed(2) : 0.0,
        total_billing_pulses: value.total_billing_pulses ? parseFloat(value.total_billing_pulses).toFixed(2) : 0.0,
      };
    });
    const rearrangedDataOutboundICDetails = rearrangeAndRenameColumns(mappedDataOutboundICDetails, columnOrderOutboundICDetails);
    downloadExcelOutbound(rearrangedDataCountAgentAndOutboundCalls, rearrangedDataOutboundICDetails);
  };

  const downloadExcelOutbound = (dataCountAgentAndOutboundCalls, dataOutboundICDetails) => {
    const worksheetAgentAndOutboundCalls = XLSX.utils.json_to_sheet(dataCountAgentAndOutboundCalls);
    const worksheetOutboundICDetails = XLSX.utils.json_to_sheet(dataOutboundICDetails);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheetAgentAndOutboundCalls, "Sheet1");
    XLSX.utils.book_append_sheet(workbook, worksheetOutboundICDetails, "Sheet2");
    worksheetAgentAndOutboundCalls["!cols"] = [{ width: 30 }, { width: 30 }, { width: 30 }];
    worksheetOutboundICDetails["!cols"] = [{ width: 55 }, { width: 20 }, { width: 20 }];
    XLSX.writeFile(workbook, `Outbound_Call_Details_${searchFormValues.txtYearFilter.value}_${searchFormValues.txtMonthFilter.label}.xlsx`);
  };

  const TextMessageCallsDataArrangeAndDownload = () => {
    const columnOrderTextMessageICDetails = {
      _id: "Insurance Company",
      perentage_pulses: "% Share of IBTC Pulses",
      sms_submission: "SMS count to be Billed",
    };
    const mappedDataTextMessageICDetails = billingDashBoardList[0].map((value) => {
      return {
        _id: value._id,
        perentage_pulses: value.perentage_pulses ? parseFloat(value.perentage_pulses).toFixed(2) : 0.0,
        sms_submission: value.sms_submission ? parseFloat(value.sms_submission).toFixed(2) : 0.0,
      };
    });
    const rearrangedDataTextMessageICDetails = rearrangeAndRenameColumns(mappedDataTextMessageICDetails, columnOrderTextMessageICDetails);
    downloadExcelTextMessage(rearrangedDataTextMessageICDetails);
  };
  const downloadExcelTextMessage = (dataTextMessageICDetails) => {
    const worksheetTextMessageICDetails = XLSX.utils.json_to_sheet(dataTextMessageICDetails);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheetTextMessageICDetails, "Sheet1");
    worksheetTextMessageICDetails["!cols"] = [{ width: 50 }, { width: 30 }, { width: 30 }];
    XLSX.writeFile(workbook, `Text_Message_Details_${searchFormValues.txtYearFilter.value}_${searchFormValues.txtMonthFilter.label}.xlsx`);
  };

  const AgentsDataArrangeAndDownload = () => {
    const columnOrderCountAgents = {
      // A active_agent: "No. Of Active Agents",
      total_working_days_in_month: "No. Of Working Days",
      call_attended: " No. Of Calls Attended",
      // A total_training_hr: "No. Of Calls Attended",
    };
    const mappedDataCountAgents = billingDashBoardList.map((value) => {
      return {
        // A active_agent: value.active_agent,
        total_working_days_in_month: value.total_working_days_in_month,
        call_attended: value.call_attended,
        // A total_training_hr: value.total_training_hr,
      };
    });
    const rearrangedDataCountAgents = rearrangeAndRenameColumns(mappedDataCountAgents, columnOrderCountAgents);

    const columnOrderInboundICDetails = {
      _id: "Insurance Company",
      percentagePulse: "% Share of IBTC Pulses",
      agents_cost: "Share of Working Days",
    };
    const mappedDataInboundICDetails = billingDashBoardAgentICList[0].IC_data.map((value) => {
      return {
        _id: value._id,
        percentagePulse: value.percentagePulse ? parseFloat(value.percentagePulse).toFixed(2) : 0.0,
        agents_cost: value.percentagePulse && noOfWorkingDays ? parseFloat(parseFloat(value.percentagePulse * noOfWorkingDays) / 100).toFixed(2) : "0.00",
      };
    });
    const rearrangedDataInboundICDetails = rearrangeAndRenameColumns(mappedDataInboundICDetails, columnOrderInboundICDetails);

    const columnOrderAgentDetails = {
      user: "Agent Id",
      // A no_of_working_hours: "No. Of Working Hours",
      // A no_of_training_hours: "No. Of Training Hours",
      working_days: "Working Days (Including Training)",
      weekly_off_holidays: "Weekly Off And Holidays (In days)",
      total_no_of_working_days: "Total No. Of Working Days",
    };
    const mappedDataAgentDetails = billingDashBoardAgentWorkingDetailsList.map((value) => {
      return {
        user: value.user,
        // A no_of_working_hours: value.no_of_working_hours ? parseFloat(value.no_of_working_hours).toFixed(2) : 0.00,
        // A no_of_training_hours: value.no_of_training_hours ? parseFloat(value.no_of_training_hours).toFixed(2) : 0.00,
        working_days: value.working_days ? parseFloat(value.working_days).toFixed(2) : 0.0,
        weekly_off_holidays: value.weekly_off_holidays ? parseFloat(value.weekly_off_holidays).toFixed(2) : 0.0,
        total_no_of_working_days: value.total_no_of_working_days ? parseFloat(value.total_no_of_working_days).toFixed(2) : 0.0,
      };
    });
    const rearrangedDataAgentDetails = rearrangeAndRenameColumns(mappedDataAgentDetails, columnOrderAgentDetails);
    downloadExcelAgent(rearrangedDataCountAgents, rearrangedDataInboundICDetails, rearrangedDataAgentDetails);
  };

  const downloadExcelAgent = (dataCountAgents, dataInboundICDetails, dataAgentDetails) => {
    const worksheetCountAgents = XLSX.utils.json_to_sheet(dataCountAgents);
    const worksheetInboundICDetails = XLSX.utils.json_to_sheet(dataInboundICDetails);
    const worksheetAgentDetails = XLSX.utils.json_to_sheet(dataAgentDetails);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheetCountAgents, "Sheet1");
    XLSX.utils.book_append_sheet(workbook, worksheetInboundICDetails, "Sheet2");
    XLSX.utils.book_append_sheet(workbook, worksheetAgentDetails, "Sheet3");
    worksheetCountAgents["!cols"] = [
      // { width: 25 },
      // { width: 25 },
      { width: 25 },
      { width: 25 },
    ];
    worksheetInboundICDetails["!cols"] = [{ width: 55 }, { width: 20 }, { width: 20 }];
    worksheetAgentDetails["!cols"] = [
      { width: 15 },
      { width: 32 },
      { width: 32 },
      { width: 35 },
      // A { width: 25 },
      // A { width: 25 },
      // A { width: 25 },
      // A { width: 30 },
    ];
    XLSX.writeFile(workbook, `Agent_Details_${searchFormValues.txtYearFilter.value}_${searchFormValues.txtMonthFilter.label}.xlsx`);
  };

  const AgentsOverTimeDataArrangeAndDownload = () => {
    const columnOrderCountAgents = {
      // A active_agent: "No. Of Active Agents",
      total_working_days_in_month: "No. Of Working Days Over Time",
      call_attended: " No. Of Calls Attended",
      // A total_training_hr: "No. Of Calls Attended",
    };
    const mappedDataCountAgents = billingDashBoardList.map((value) => {
      return {
        // A active_agent: value.active_agent,
        total_working_days_in_month: value.total_working_days_in_month,
        call_attended: value.call_attended,
        // A total_training_hr: value.total_training_hr,
      };
    });
    const rearrangedDataCountAgents = rearrangeAndRenameColumns(mappedDataCountAgents, columnOrderCountAgents);

    const columnOrderInboundICDetails = {
      _id: "Insurance Company",
      percentagePulse: "% Share of IBTC Pulses",
      agents_cost: "Share of Working Over Time",
    };
    const mappedDataInboundICDetails = billingDashBoardAgentOverTimeICList[0].IC_data.map((value) => {
      return {
        _id: value._id,
        percentagePulse: value.percentagePulse ? parseFloat(value.percentagePulse).toFixed(2) : 0.0,
        agents_cost:
          value.percentagePulse && noOfWorkingDaysOverTime ? parseFloat(parseFloat(value.percentagePulse * noOfWorkingDaysOverTime) / 100).toFixed(2) : "0.00",
      };
    });
    const rearrangedDataInboundICDetails = rearrangeAndRenameColumns(mappedDataInboundICDetails, columnOrderInboundICDetails);

    const columnOrderAgentDetails = {
      user: "Agent Id",
      // A no_of_working_hours: "No. Of Working Hours",
      // A no_of_training_hours: "No. Of Training Hours",
      working_days: "Working Days (Including Training)",
      weekly_off_holidays: "Weekly Off And Holidays (In days)",
      overtime_hours: "Over Time (In Hours)",
      total_no_of_working_days: "Total No. Of Working Days",
    };
    const mappedDataAgentDetails = billingDashBoardAgentWorkingDetailsList.map((value) => {
      return {
        user: value.user,
        // A no_of_working_hours: value.no_of_working_hours ? parseFloat(value.no_of_working_hours).toFixed(2) : 0.00,
        // A no_of_training_hours: value.no_of_training_hours ? parseFloat(value.no_of_training_hours).toFixed(2) : 0.00,
        working_days: value.working_days ? parseFloat(value.working_days).toFixed(2) : 0.0,
        overtime_hours: value.overtime_hours ? parseFloat(value.overtime_hours).toFixed(2) : 0.0,
        weekly_off_holidays: value.holidays && value.holidays.total_holidays ? parseFloat(value.holidays.total_holidays).toFixed(2) : 0,
        total_no_of_working_days: value.total_no_of_working_days ? parseFloat(value.total_no_of_working_days).toFixed(2) : 0.0,
      };
    });
    const rearrangedDataAgentDetails = rearrangeAndRenameColumns(mappedDataAgentDetails, columnOrderAgentDetails);
    downloadExcelAgentOverTime(rearrangedDataCountAgents, rearrangedDataInboundICDetails, rearrangedDataAgentDetails);
  };

  const downloadExcelAgentOverTime = (dataCountAgents, dataInboundICDetails, dataAgentDetails) => {
    const worksheetCountAgents = XLSX.utils.json_to_sheet(dataCountAgents);
    const worksheetInboundICDetails = XLSX.utils.json_to_sheet(dataInboundICDetails);
    const worksheetAgentDetails = XLSX.utils.json_to_sheet(dataAgentDetails);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheetCountAgents, "Sheet1");
    XLSX.utils.book_append_sheet(workbook, worksheetInboundICDetails, "Sheet2");
    XLSX.utils.book_append_sheet(workbook, worksheetAgentDetails, "Sheet3");
    worksheetCountAgents["!cols"] = [
      { width: 25 },
      { width: 25 },
      // A { width: 25 },
      // A { width: 25 },
    ];
    worksheetInboundICDetails["!cols"] = [{ width: 55 }, { width: 20 }, { width: 20 }];
    worksheetAgentDetails["!cols"] = [
      { width: 15 },
      { width: 25 },
      { width: 32 },
      { width: 32 },
      { width: 35 },
      // A { width: 25 },
      // A { width: 25 },
      // A { width: 30 },
    ];
    XLSX.writeFile(workbook, `Agent_Over_Time_Details_${searchFormValues.txtYearFilter.value}_${searchFormValues.txtMonthFilter.label}.xlsx`);
  };

  useEffect(() => {
    debugger;
    const now = new Date();
    const currentYear = now.getFullYear();
    const yearArray = [];
    for (let i = 2024; i <= currentYear; i += 1) {
      yearArray.push({ label: i.toString(), value: i.toString() });
    }
    setYearList(yearArray.sort().reverse());
    setSearchFormValues({
      ...searchFormValues,
      txtYearFilter: { label: currentYear.toString(), value: currentYear.toString() },
      txtMonthFilter: { label: monthList[0].label, value: monthList[0].value },
    });
    setheader({
      year: currentYear.toString(),
      month: monthList[0].label,
    });
    getInsuranceCompanyListData();
  }, []);

  const [header, setheader] = useState({
    year: "Year",
    month: "Month",
  });

  const [isPopupVisible, setPopupVisible] = useState(false);
  const handleIconHoverPass = () => {
    setPopupVisible(true);
  };

  const handleIconUnhoverPass = () => {
    setPopupVisible(false);
  };

  return (
    <>
      {isPopupVisible && <div className="total_holidays_details_Div"></div>}
      <div className="PageStart">
        <PageBar>
          <span className="bar_header_Text_billing">
            Billing Dashboard For {header.month} {header.year}
          </span>
          {/* <PageBar.Select
            ControlTxt="Insurance Company"
            name="txtInsuranceCompany"
            value={searchFormValues.txtInsuranceCompany}
            loader={isLoadingInsuranceCompanyList ? <Loader /> : null}
            options={insuranceCompanyList}
            getOptionLabel={(option) => `${option.CompanyName}`}
            getOptionValue={(option) => `${option}`}
            onChange={(e) => updateSearchFormState("txtInsuranceCompany", e)}
          /> */}
          <PageBar.Select
            control={"select"}
            label="Year"
            name="txtYearFilter"
            getOptionLabel={(option) => `${option.label}`}
            value={searchFormValues.txtYearFilter}
            getOptionValue={(option) => `${option}`}
            options={yearList}
            onChange={(e) => updateSearchFormState("txtYearFilter", e)}
          />
          <PageBar.Select
            control={"select"}
            label="Month"
            name="txtMonthFilter"
            getOptionLabel={(option) => `${option.label}`}
            value={searchFormValues.txtMonthFilter}
            getOptionValue={(option) => `${option}`}
            options={monthList}
            onChange={(e) => updateSearchFormState("txtMonthFilter", e)}
          />
          <PageBar.Button style={{ background: "#307ef4", border: "solid 1px #307ef4" }} onClick={() => OnClickTabDashBoard("SMDTLS")}>
            Submit
          </PageBar.Button>
          <PageBar.Button onClick={() => rsetOnClick()}>Reset</PageBar.Button>
        </PageBar>
        <div className="Main_Dash">
          {isLoadingBillingDashBoardList ? <Loader /> : false}
          <div className="Box">
            {insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1 ? (
              <>
                <div className="ContainerPnlUpperHeading">
                  <span>
                    Insurance Company :{" "}
                    {insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1 ? insuranceCompanyList[0].CompanyName : ""}
                  </span>
                </div>{" "}
              </>
            ) : (
              ""
            )}
            <div className="ContainerPnlUpper" style={{ display: "none" }}>
              <div className="SummaryBoard-Top">
                <div className={activeKey === "SMDTLS" ? "ScoreBoardSummaryActive" : "ScoreBoardSummary"} onClick={() => OnClickTabDashBoard("SMDTLS")}>
                  <span>Summary</span>
                </div>
                <div
                  className={activeKey === "INBNDCL" ? "ScoreBoardInboundCallsActive" : "ScoreBoardInboundCalls"}
                  onClick={() => OnClickTabDashBoard("INBNDCL")}
                >
                  <span>Inbound Calls</span>
                </div>
              </div>
              <div className="SummaryBoard">
                <div className={activeKey === "AGNT" ? "ScoreBoardAgentsActive" : "ScoreBoardAgents"} onClick={() => OnClickTabDashBoard("AGNT")}>
                  <span>Agents</span>
                </div>
                <div
                  className={activeKey === "OTBNDCL" ? "ScoreBoardOutboundCallsActive" : "ScoreBoardOutboundCalls"}
                  onClick={() => OnClickTabDashBoard("OTBNDCL")}
                >
                  <span>Outbound Calls</span>
                </div>
                <div className={activeKey === "TXTMSG" ? "ScoreBoardTextMessageActive" : "ScoreBoardTextMessage"} onClick={() => OnClickTabDashBoard("TXTMSG")}>
                  <span>Text Messages</span>
                </div>
                <div className={activeKey === "WHAPP" ? "ScoreBoardWhatsAppActive" : "ScoreBoardWhatsApp"} onClick={() => OnClickTabDashBoard("WHAPP")}>
                  <span>WhatsApp</span>
                </div>
                <div className={activeKey === "AIBT" ? "ScoreBoardAIBotActive" : "ScoreBoardAIBot"} onClick={() => OnClickTabDashBoard("AIBT")}>
                  <span>AI Bot</span>
                </div>
              </div>
            </div>
            <div
              className={
                parseFloat(totalICTotalBillableAmount + totalICAgentTotalBillableAmount + totalICOBTotalBillableAmount + totalICTxtMsgTotalBillableAmount) !== 0
                  ? "ContainerPnl"
                  : classNames("ContainerPnlDisabled", "ContainerPnl")
              }
            >
              <span className="spanHeaderHeading">Summary Details</span>
              <div className="SummaryBoardDetailsUpper">
                <div className="ScoreBoard">
                  <span>Total</span>
                  <span>
                    {totalICTotalBillableAmount &&
                    totalICAgentTotalBillableAmount &&
                    totalICAgentTotalBillableAmountOverTime &&
                    totalICOBTotalBillableAmount &&
                    totalICTxtMsgTotalBillableAmount
                      ? `Rs. ${numberWithCommas(
                          parseFloat(
                            totalICTotalBillableAmount +
                              totalICAgentTotalBillableAmount +
                              totalICAgentTotalBillableAmountOverTime +
                              totalICOBTotalBillableAmount +
                              totalICTxtMsgTotalBillableAmount,
                          ).toFixed(2),
                        )}`
                      : "Rs. 0.00"}
                  </span>
                </div>
                <div
                  className={activeKey === "INBNDCL" ? classNames("ScoreBoard", "ScoreBoardActive") : "ScoreBoard"}
                  onClick={() => OnClickTabDashBoard("INBNDCL")}
                >
                  <span>Inbound Calls</span>
                  <span>{totalICTotalBillableAmount ? `Rs. ${numberWithCommas(parseFloat(totalICTotalBillableAmount).toFixed(2))}` : "Rs. 0.00"}</span>
                </div>
              </div>
              <div className="SummaryBoardDetails">
                <div className={activeKey === "AGNT" ? classNames("ScoreBoard", "ScoreBoardActive") : "ScoreBoard"} onClick={() => OnClickTabDashBoard("AGNT")}>
                  <span>Agents</span>
                  <span>
                    {totalICAgentTotalBillableAmount ? `Rs. ${numberWithCommas(parseFloat(totalICAgentTotalBillableAmount).toFixed(2))}` : "Rs. 0.00"}
                  </span>
                </div>
                <div
                  className={activeKey === "AGNTOVRTM" ? classNames("ScoreBoard", "ScoreBoardActive") : "ScoreBoard"}
                  onClick={() => OnClickTabDashBoard("AGNTOVRTM")}
                >
                  <span>Agents Over Time</span>
                  <span>
                    {totalICAgentTotalBillableAmountOverTime
                      ? `Rs. ${numberWithCommas(parseFloat(totalICAgentTotalBillableAmountOverTime).toFixed(2))}`
                      : "Rs. 0.00"}
                  </span>
                </div>
                <div
                  className={activeKey === "OTBNDCL" ? classNames("ScoreBoard", "ScoreBoardActive") : "ScoreBoard"}
                  onClick={() => OnClickTabDashBoard("OTBNDCL")}
                >
                  <span>Outbound Calls</span>
                  <span>{totalICOBTotalBillableAmount ? `Rs. ${numberWithCommas(parseFloat(totalICOBTotalBillableAmount).toFixed(2))}` : "Rs. 0.00"}</span>
                </div>
                <div
                  className={activeKey === "TXTMSG" ? classNames("ScoreBoard", "ScoreBoardActive") : "ScoreBoard"}
                  onClick={() => OnClickTabDashBoard("TXTMSG")}
                >
                  <span>Text Messages</span>
                  <span>
                    {totalICTxtMsgTotalBillableAmount ? `Rs. ${numberWithCommas(parseFloat(totalICTxtMsgTotalBillableAmount).toFixed(2))}` : "Rs. 0.00"}
                  </span>
                </div>
                <div className="ScoreBoard">
                  <span>WhatsApp</span>
                  <span>Rs. 0.00</span>
                </div>
                <div className="ScoreBoard">
                  <span>AI Bot</span>
                  <span>Rs. 0.00</span>
                </div>
              </div>
            </div>
            <br />
            {activeKey === "INBNDCL" ? (
              <div className="ContainerPnl">
                <div className="headerAndButtonAlign">
                  <span className="spanHeader">Inbound Calls Details </span>
                  <span className="buttonAlign">
                    <FaFileExcel title="Excel download of Inbound Calls Details" onClick={() => OnClickExcelDataDownlaod("INBNDCL")} />
                  </span>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div class="calls-container">
                      <div class="calls-box">
                        <div class="calls-header">Tagged Calls</div>
                        <div class="calls-content">
                          <table class="table table-striped">
                            <tr>
                              <td>
                                Tagging With Tickets{" "}
                                {billingDashBoardList && billingDashBoardList.length > 0 && billingDashBoardList[0].total_matched_with_ticket
                                  ? `(${numberWithCommas(billingDashBoardList[0].total_matched_with_ticket)})`
                                  : "(0)"}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                Tagging Without Tickets{" "}
                                {billingDashBoardList && billingDashBoardList.length > 0 && billingDashBoardList[0].total_matched_without_ticket
                                  ? `(${numberWithCommas(billingDashBoardList[0].total_matched_without_ticket)})`
                                  : "(0)"}
                              </td>
                            </tr>
                          </table>
                        </div>
                      </div>

                      <div class="calls-box">
                        <div class="calls-header">Un Tagged Calls</div>
                        <div class="calls-content">
                          <table class="table table-striped">
                            <tr>
                              <td>
                                Total Untagged Calls{" "}
                                {billingDashBoardList && billingDashBoardList.length > 0 && billingDashBoardList[0].total_unmatched_pulses
                                  ? `(${numberWithCommas(billingDashBoardList[0].total_unmatched_pulses)})`
                                  : "(0)"}
                              </td>
                            </tr>
                          </table>
                        </div>
                      </div>
                    </div>
                    <br />
                    <table class="table table-striped">
                      <tbody>
                        {/* <tr>
                          <th style={{ width: "6%" }}>Sr. No.</th>
                          <th style={{ width: "20%" }}>Insurance Company</th>
                          <th>No. Of In Bound Tagged Calls (IBTC) Pulses (A1)</th>
                          <th>% Share of IBTC Pulses(B1)</th>
                          <th>Share of IB Untagged Calls (C1 = B1 * Total Untagged Calls)</th>
                          <th>Total Billable Pulses (R*= A1 + C1)</th>
                        </tr>
                        <tr>
                          <td>1.</td>
                          <td>AIC</td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>2.</td>
                          <td>Bajaj Allianz</td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>3.</td>
                          <td>Bharti AXA GIC</td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>4.</td>
                          <td>IFFCO TOKIO</td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>4.</td>
                          <td>Oriental Insurance</td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>5.</td>
                          <td>Royal Sundaram GIC</td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr> */}
                        <tr>
                          <th style={{ width: "5%" }}>Sr. No.</th>
                          <th style={{ width: "25%" }}>Insurance Company</th>
                          <th>No. of In Bound Tagged Calls (IBTC) Pulses (A1)</th>
                          <th style={{ width: "18%" }}>% Share of IBTC Pulses(B1)</th>
                          <th style={{ width: "19%" }}>No. of IB Untagged Calls (C1 = B1 * Total Untagged Calls)</th>
                          <th>Total Billable Pulses (R*= A1 + C1)</th>
                        </tr>
                        {billingDashBoardList && billingDashBoardList.length > 0 && billingDashBoardList[0].IC_data ? (
                          billingDashBoardList[0].IC_data.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td style={{ textAlign: "center" }}>{index + 1}</td>
                                <td>{item["_id"]}</td>
                                <td style={{ textAlign: "center" }}>{item.taged_pulses ? numberWithCommas(parseFloat(item.taged_pulses).toFixed(2)) : 0}</td>
                                <td style={{ textAlign: "center" }}>
                                  {item.percentagePulse ? `${numberWithCommas(parseFloat(item.percentagePulse).toFixed(2))}%` : "0%"}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {item.untaged_pulses ? numberWithCommas(parseFloat(item.untaged_pulses).toFixed(2)) : 0}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {item.total_billing_pulses ? numberWithCommas(parseFloat(item.total_billing_pulses).toFixed(2)) : 0}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="6" style={{ textAlign: "center" }}>
                              Data not exist
                            </td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="2">Grand Total</td>
                          <td style={{ textAlign: "center" }}>
                            {grandTotalICIBTaggedCalls ? numberWithCommas(parseFloat(grandTotalICIBTaggedCalls).toFixed(2)) : 0}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {grandTotalICIBPercntShare ? `${numberWithCommas(parseFloat(grandTotalICIBPercntShare).toFixed(2))}%` : "0%"}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {grandTotalICIBUnTaggedCalls ? numberWithCommas(parseFloat(grandTotalICIBUnTaggedCalls).toFixed(2)) : 0}
                          </td>
                          <td style={{ textAlign: "center" }}>{grandTotalICIBPulses ? numberWithCommas(parseFloat(grandTotalICIBPulses).toFixed(2)) : 0}</td>
                        </tr>
                      </tfoot>
                    </table>
                    <div class="billing-header">Inbound Pulses Billing Details of Insurance Company</div>
                    <br />
                    <div class="pulses-container">
                      <div class="pulses-box inbound-pulses">
                        <p>Amount for Inbound Pulses</p>
                        <p>X1 = R1 * 1.25</p>
                        <p>{totalICTotalAmount ? `(Rs. ${numberWithCommas(parseFloat(totalICTotalAmount).toFixed(2))})` : 0}</p>
                      </div>
                      <div class="pulses-plus-sign">+</div>
                      <div class="pulses-circle pulses-tax">
                        <p>Taxes (GST)</p>
                        <p>Y1 = X1 * 18%</p>
                        <p>{totalICGSTAmount ? `(Rs. ${numberWithCommas(parseFloat(totalICGSTAmount).toFixed(2))})` : 0}</p>
                      </div>
                      <div class="pulses-equals-sign">=</div>
                      <div class="pulses-box total-pulses">
                        <p>Total Bill for IB Pulses</p>
                        <p>Z1 = X1 + Y1</p>
                        <p>{totalICTotalBillableAmount ? `(Rs. ${numberWithCommas(parseFloat(totalICTotalBillableAmount).toFixed(2))})` : 0}</p>
                      </div>
                    </div>
                  </div>
                </div>{" "}
              </div>
            ) : null}
            {activeKey === "AGNT" ? (
              <div className="ContainerPnl">
                <div className="headerAndButtonAlign">
                  <span className="spanHeader">Agents</span>
                  <span className="buttonAlign">
                    <FaFileExcel title="Excel download of Inbound Calls Details" onClick={() => OnClickExcelDataDownlaod("AGNT")} />
                  </span>
                </div>
                <div className="dashboard-container">
                  <div className="dashboard-item" style={{ display: "none" }}>
                    <FaUserFriends size={60} style={{ color: "#5a9bd5" }} />
                    <p>No. Of Active Agents</p>
                    <span>
                      {billingDashBoardList && billingDashBoardList.length > 0 && billingDashBoardList[0].active_agent
                        ? `(${numberWithCommas(billingDashBoardList[0].active_agent)})`
                        : "(0)"}
                    </span>
                  </div>

                  <div className="dashboard-item">
                    <FaCalendarAlt size={60} style={{ color: "#5a9bd5" }} />
                    <p>No. Of Working Days</p>
                    <span>
                      {billingDashBoardList && billingDashBoardList.length > 0 && billingDashBoardList[0].total_working_days_in_month
                        ? `(${numberWithCommas(billingDashBoardList[0].total_working_days_in_month)})`
                        : "(0)"}
                    </span>
                  </div>

                  <div className="dashboard-item">
                    <FaPhoneAlt size={60} style={{ color: "#5a9bd5" }} />
                    <p>No. Of Calls Attended</p>
                    <span>
                      {billingDashBoardList && billingDashBoardList.length > 0 && billingDashBoardList[0].call_attended
                        ? `(${numberWithCommas(billingDashBoardList[0].call_attended)})`
                        : "(0)"}
                    </span>
                  </div>

                  <div className="dashboard-item" style={{ display: "none" }}>
                    <FaChalkboardTeacher size={60} style={{ color: "#5a9bd5" }} />
                    <p>No. Of Training Hours</p>
                    <span>
                      {billingDashBoardList && billingDashBoardList.length > 0 ? `(${numberWithCommas(billingDashBoardList[0].total_training_hr)})` : "(0)"}
                    </span>
                  </div>
                </div>
                <br />
                <table class="table table-striped">
                  <tbody>
                    {/* <tr>
                      <th style={{ width: "6%" }}>Sr. No.</th>
                      <th style={{ width: "20%" }}>Insurance Company</th>
                      <th style={{ width: "20%" }}>% Share of IBTC Pulses (B1)</th>
                      <th style={{ width: "20%" }}>Share of Agents Cost( S*= B1 * Total Active Agents)</th>
                    </tr>
                    <tr>
                      <td>1.</td>
                      <td>AIC</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>2.</td>
                      <td>Bajaj Allianz</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>3.</td>
                      <td>Bharti AXA GIC</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>4.</td>
                      <td>IFFCO TOKIO</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>4.</td>
                      <td>Oriental Insurance</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>5.</td>
                      <td>Royal Sundaram GIC</td>
                      <td></td>
                      <td></td>
                    </tr> */}
                    <tr>
                      <th style={{ width: "4%" }}>Sr. No.</th>
                      <th style={{ width: "20%" }}>Insurance Company</th>
                      <th style={{ width: "15%" }}>% Share of IBTC Pulses (B1)</th>
                      <th style={{ width: "20%" }}>Share of Working Days</th>
                    </tr>
                    {billingDashBoardAgentICList && billingDashBoardAgentICList.length > 0 && billingDashBoardAgentICList[0].IC_data ? (
                      billingDashBoardAgentICList[0].IC_data.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td style={{ textAlign: "center" }}>{index + 1}</td>
                            <td>{item["_id"]}</td>
                            <td style={{ textAlign: "center" }}>
                              {item.percentagePulse ? `${numberWithCommas(parseFloat(item.percentagePulse).toFixed(2))}%` : "0%"}
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {item.percentagePulse && noOfWorkingDays
                                ? numberWithCommas(parseFloat(parseFloat(item.percentagePulse * noOfWorkingDays) / 100).toFixed(2))
                                : "0.00"}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ textAlign: "center" }}>
                          Data not exist
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="2">Grand Total</td>
                      <td colSpan="1" style={{ textAlign: "center" }}>
                        {grandTotalIBTCAgentPercntShare ? `${numberWithCommas(parseFloat(grandTotalIBTCAgentPercntShare).toFixed(2))}%` : "0%"}
                      </td>
                      <td style={{ textAlign: "center" }}>{grandTotalAgentCost ? numberWithCommas(parseFloat(grandTotalAgentCost).toFixed(2)) : 0}</td>
                    </tr>
                  </tfoot>
                </table>
                <Accordion activeKey={activeKeyAgentWorking} onSelect={(key) => setActiveKeyAgentWorking(key)}>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header># Agent Working Details</Accordion.Header>
                    <Accordion.Body>
                      <table class="table table-striped">
                        <tbody className="tbodyAgentWorkingDetails">
                          {/* <tr>
                      <th style={{ width: "6%" }}>Sr. No.</th>
                      <th>Agent Id</th>
                      <th>No of Working Days (1)</th>
                      <th>No of Calls Attended (2)</th>
                      <th>No of Pulses Attended - IB(3.1)</th>
                      <th>No of Pulses Attended - OB(3.2)</th>
                      <th>Avg Pulses Agent (4=3/1)</th>
                      <th>Hours of Trainings (5)</th>
                      <th>Total No of Working Days 6 = 1 + (5/8)</th>
                    </tr>
                    <tr>
                      <td>1.</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>2.</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>3.</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>4.</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>4.</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>5.</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr> */}
                          <tr>
                            <th style={{ width: "6%" }}>Sr. No.</th>
                            <th style={{ width: "8%" }}>Agent Id</th>
                            <th style={{ width: "15%" }}>Working Days (Including Training)</th>
                            <th style={{ width: "15%" }}>
                              Weekly Off And Holidays (In Days)
                              <FaInfoCircle onMouseOver={() => handleIconHoverPass()} onMouseOut={() => handleIconUnhoverPass()} />
                            </th>
                            <th style={{ width: "12%" }}>Total No. Of Working Days</th>
                            {/* <th>No. Of Working Days (1)</th>
                      <th>No. Of Calls Attended (2)</th>
                      <th>No. Of Pulses Attended - IB(3.1)</th>
                      <th>No. Of Pulses Attended - OB(3.2)</th>
                      <th>Avg Pulses Agent (4=3/1)</th>
                      <th>Hours of Trainings (5)</th>
                      <th>Total No. Of Working Days 6 = 1 + (5/8)</th> */}
                          </tr>
                          <tr>
                            <td colSpan="2">Grand Total</td>
                            <td style={{ textAlign: "center" }}>{Totalworking_days ? numberWithCommas(parseFloat(Totalworking_days).toFixed(2)) : 0}</td>
                            <td style={{ textAlign: "center" }}>
                              {Totalweekly_off__holidays ? numberWithCommas(parseFloat(Totalweekly_off__holidays).toFixed(2)) : 0}
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {Totaltotal_no_of_working_days ? numberWithCommas(parseFloat(Totaltotal_no_of_working_days).toFixed(2)) : 0}
                            </td>
                          </tr>
                          {billingDashBoardAgentWorkingDetailsList && billingDashBoardAgentWorkingDetailsList.length > 0 ? (
                            billingDashBoardAgentWorkingDetailsList.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td style={{ textAlign: "center" }}>{index + 1}</td>
                                  <td style={{ textAlign: "center" }}>{item.user ? item.user : 0}</td>
                                  <td style={{ textAlign: "center" }}>{item.working_days ? numberWithCommas(parseFloat(item.working_days).toFixed(2)) : 0}</td>
                                  <td style={{ textAlign: "center" }}>
                                    {item.holidays && item.holidays.total_holidays ? numberWithCommas(parseFloat(item.holidays.total_holidays).toFixed(2)) : 0}
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    {item.total_working_days ? numberWithCommas(parseFloat(item.total_working_days).toFixed(2)) : 0}
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan="5" style={{ textAlign: "center" }}>
                                Data not exist
                              </td>
                            </tr>
                          )}
                        </tbody>
                        {/* <tfoot>
                    <tr>
                      <td colSpan="2">Grand Total</td>
                      <td colSpan="7"></td>
                    </tr>
                  </tfoot> */}
                      </table>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
                <br />
                <div class="billing-header">Call Center Agents Billing Total of Insurance Company</div>
                <br />
                <div class="pulses-container">
                  <div class="pulses-box inbound-pulses">
                    <p>Agents Share of Working Days IC wise</p>
                    <p>X2 = (S1 * 31,000)/No. Of Days In Month</p>
                    <p>{totalICAgentTotalAmount ? `(Rs. ${numberWithCommas(parseFloat(totalICAgentTotalAmount).toFixed(2))})` : 0}</p>
                  </div>
                  <div class="pulses-plus-sign">+</div>
                  <div class="pulses-circle pulses-tax">
                    <p>Taxes (GST)</p>
                    <p>Y2 = X2 * 18 %</p>
                    <p>{totalICAgentGSTAmount ? `(Rs. ${numberWithCommas(parseFloat(totalICAgentGSTAmount).toFixed(2))})` : 0}</p>
                  </div>
                  <div class="pulses-equals-sign">=</div>
                  <div class="pulses-box total-pulses">
                    <p>Total Bill Agents</p>
                    <p>Z2 = X2 + Y2</p>
                    <p>{totalICAgentTotalBillableAmount ? `(Rs. ${numberWithCommas(parseFloat(totalICAgentTotalBillableAmount).toFixed(2))})` : 0}</p>
                  </div>
                </div>
              </div>
            ) : null}
            {activeKey === "AGNTOVRTM" ? (
              <div className="ContainerPnl">
                <div className="headerAndButtonAlign">
                  <span className="spanHeader">Agents Over Time</span>
                  <span className="buttonAlign">
                    <FaFileExcel title="Excel download of Inbound Calls Details" onClick={() => OnClickExcelDataDownlaod("AGNTOVRTM")} />
                  </span>
                </div>
                <div className="dashboard-container">
                  <div className="dashboard-item" style={{ display: "none" }}>
                    <FaUserFriends size={60} style={{ color: "#5a9bd5" }} />
                    <p>No. Of Active Agents</p>
                    <span>
                      {billingDashBoardAgentOverTimeList && billingDashBoardAgentOverTimeList.length > 0 && billingDashBoardAgentOverTimeList[0].active_agent
                        ? `(${numberWithCommas(billingDashBoardAgentOverTimeList[0].active_agent)})`
                        : "(0)"}
                    </span>
                  </div>

                  <div className="dashboard-item">
                    <FaCalendarAlt size={60} style={{ color: "#5a9bd5" }} />
                    <p>No. Of Working Over Time</p>
                    <span>{noOfWorkingDaysOverTime ? `(${numberWithCommas(noOfWorkingDaysOverTime)})` : "(0)"}</span>
                  </div>

                  <div className="dashboard-item">
                    <FaPhoneAlt size={60} style={{ color: "#5a9bd5" }} />
                    <p>No. Of Calls Attended</p>
                    <span>
                      {billingDashBoardAgentOverTimeList && billingDashBoardAgentOverTimeList.length > 0 && billingDashBoardAgentOverTimeList[0].call_attended
                        ? `(${numberWithCommas(billingDashBoardAgentOverTimeList[0].call_attended)})`
                        : "(0)"}
                    </span>
                  </div>

                  <div className="dashboard-item" style={{ display: "none" }}>
                    <FaChalkboardTeacher size={60} style={{ color: "#5a9bd5" }} />
                    <p>No. Of Training Hours</p>
                    <span>
                      {billingDashBoardAgentOverTimeList && billingDashBoardAgentOverTimeList.length > 0
                        ? `(${numberWithCommas(billingDashBoardAgentOverTimeList[0].total_training_hr)})`
                        : "(0)"}
                    </span>
                  </div>
                </div>
                <br />
                <table class="table table-striped">
                  <tbody>
                    {/* <tr>
                      <th style={{ width: "6%" }}>Sr. No.</th>
                      <th style={{ width: "20%" }}>Insurance Company</th>
                      <th style={{ width: "20%" }}>% Share of IBTC Pulses (B1)</th>
                      <th style={{ width: "20%" }}>Share of Agents Cost( S*= B1 * Total Active Agents)</th>
                    </tr>
                    <tr>
                      <td>1.</td>
                      <td>AIC</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>2.</td>
                      <td>Bajaj Allianz</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>3.</td>
                      <td>Bharti AXA GIC</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>4.</td>
                      <td>IFFCO TOKIO</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>4.</td>
                      <td>Oriental Insurance</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>5.</td>
                      <td>Royal Sundaram GIC</td>
                      <td></td>
                      <td></td>
                    </tr> */}
                    <tr>
                      <th style={{ width: "4%" }}>Sr. No.</th>
                      <th style={{ width: "20%" }}>Insurance Company</th>
                      <th style={{ width: "15%" }}>% Share of IBTC Pulses (B1)</th>
                      <th style={{ width: "20%" }}>Share of Working Over Time</th>
                    </tr>
                    {billingDashBoardAgentOverTimeICList && billingDashBoardAgentOverTimeICList.length > 0 && billingDashBoardAgentOverTimeICList[0].IC_data ? (
                      billingDashBoardAgentOverTimeICList[0].IC_data.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td style={{ textAlign: "center" }}>{index + 1}</td>
                            <td>{item["_id"]}</td>
                            <td style={{ textAlign: "center" }}>
                              {item.percentagePulse ? `${numberWithCommas(parseFloat(item.percentagePulse).toFixed(2))}%` : "0%"}
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {item.percentagePulse && noOfWorkingDaysOverTime
                                ? numberWithCommas(parseFloat(parseFloat(item.percentagePulse * noOfWorkingDaysOverTime) / 100).toFixed(2))
                                : "0.00"}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ textAlign: "center" }}>
                          Data not exist
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="2">Grand Total</td>
                      <td colSpan="1" style={{ textAlign: "center" }}>
                        {grandTotalIBTCAgentPercntShareOverTime ? `${numberWithCommas(parseFloat(grandTotalIBTCAgentPercntShareOverTime).toFixed(2))}%` : "0%"}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {grandTotalAgentCostOverTime ? numberWithCommas(parseFloat(grandTotalAgentCostOverTime).toFixed(2)) : 0}
                      </td>
                    </tr>
                  </tfoot>
                </table>
                <Accordion activeKey={activeKeyAgentWorking} onSelect={(key) => setActiveKeyAgentWorking(key)}>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header># Agent Working Details</Accordion.Header>
                    <Accordion.Body>
                      <table class="table table-striped">
                        <tbody className="tbodyAgentWorkingDetails">
                          {/* <tr>
                      <th style={{ width: "6%" }}>Sr. No.</th>
                      <th>Agent Id</th>
                      <th>No of Working Days (1)</th>
                      <th>No of Calls Attended (2)</th>
                      <th>No of Pulses Attended - IB(3.1)</th>
                      <th>No of Pulses Attended - OB(3.2)</th>
                      <th>Avg Pulses Agent (4=3/1)</th>
                      <th>Hours of Trainings (5)</th>
                      <th>Total No of Working Days 6 = 1 + (5/8)</th>
                    </tr>
                    <tr>
                      <td>1.</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>2.</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>3.</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>4.</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>4.</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>5.</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr> */}
                          <tr>
                            <th style={{ width: "6%" }}>Sr. No.</th>
                            <th style={{ width: "4%" }}>Agent Id</th>
                            <th style={{ width: "14%" }}>Working Days (Including Training)</th>
                            <th style={{ width: "15%" }}>
                              Weekly Off And Holidays (In Days)
                              <FaInfoCircle onMouseOver={() => handleIconHoverPass()} onMouseOut={() => handleIconUnhoverPass()} />
                            </th>
                            <th style={{ width: "9%" }}>Over Time (In Hours)</th>
                            <th style={{ width: "12%" }}>Total No. Of Working Days</th>
                            {/* <th>No. Of Working Days (1)</th>
                      <th>No. Of Calls Attended (2)</th>
                      <th>No. Of Pulses Attended - IB(3.1)</th>
                      <th>No. Of Pulses Attended - OB(3.2)</th>
                      <th>Avg Pulses Agent (4=3/1)</th>
                      <th>Hours of Trainings (5)</th>
                      <th>Total No. Of Working Days 6 = 1 + (5/8)</th> */}
                          </tr>
                          <tr>
                            <td colSpan="2">Grand Total</td>
                            <td style={{ textAlign: "center" }}>
                              {Totalworking_days_overtime ? numberWithCommas(parseFloat(Totalworking_days_overtime).toFixed(2)) : 0}
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {Totalweekly_off__holidays_overtime ? numberWithCommas(parseFloat(Totalweekly_off__holidays_overtime).toFixed(2)) : 0}
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {Totaltotal_no_of_working_days_overtime ? numberWithCommas(parseFloat(Totaltotal_no_of_working_days_overtime).toFixed(2)) : 0}
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {Totalovertime_hours_overtime ? numberWithCommas(parseFloat(Totalovertime_hours_overtime).toFixed(2)) : 0}
                            </td>
                          </tr>
                          {billingDashBoardAgentWorkingOverTimeDetailsList && billingDashBoardAgentWorkingOverTimeDetailsList.length > 0 ? (
                            billingDashBoardAgentWorkingOverTimeDetailsList.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td style={{ textAlign: "center" }}>{index + 1}</td>
                                  <td style={{ textAlign: "center" }}>{item.user ? item.user : 0}</td>
                                  <td style={{ textAlign: "center" }}>{item.working_days ? numberWithCommas(parseFloat(item.working_days).toFixed(2)) : 0}</td>
                                  <td style={{ textAlign: "center" }}>
                                    {item.holidays && item.holidays.total_holidays ? numberWithCommas(parseFloat(item.holidays.total_holidays).toFixed(2)) : 0}
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    {item.overtime_hours ? numberWithCommas(parseFloat(item.overtime_hours).toFixed(2)) : 0}
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    {item.total_working_days ? numberWithCommas(parseFloat(item.total_working_days).toFixed(2)) : 0}
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan="6" style={{ textAlign: "center" }}>
                                Data not exist
                              </td>
                            </tr>
                          )}
                        </tbody>
                        {/* <tfoot>
                    <tr>
                      <td colSpan="2">Grand Total</td>
                      <td colSpan="7"></td>
                    </tr>
                  </tfoot> */}
                      </table>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
                <br />
                <div class="billing-header">Call Center Agents Billing Total of Insurance Company</div>
                <br />
                <div class="pulses-container">
                  <div class="pulses-box inbound-pulses">
                    <p>Agents Share of Working Over Time IC wise</p>
                    <p>X2 = (((S1 * 31,000)/No. Of Days in Month)/8) * 2</p>
                    <p>{totalICAgentTotalAmountOverTime ? `(Rs. ${numberWithCommas(parseFloat(totalICAgentTotalAmountOverTime).toFixed(2))})` : 0}</p>
                  </div>
                  <div class="pulses-plus-sign">+</div>
                  <div class="pulses-circle pulses-tax">
                    <p>Taxes (GST)</p>
                    <p>Y2 = X2 * 18 %</p>
                    <p>{totalICAgentGSTAmountOverTime ? `(Rs. ${numberWithCommas(parseFloat(totalICAgentGSTAmountOverTime).toFixed(2))})` : 0}</p>
                  </div>
                  <div class="pulses-equals-sign">=</div>
                  <div class="pulses-box total-pulses">
                    <p>Total Bill Agents</p>
                    <p>Z2 = X2 + Y2</p>
                    <p>
                      {totalICAgentTotalBillableAmountOverTime
                        ? `(Rs. ${numberWithCommas(parseFloat(totalICAgentTotalBillableAmountOverTime).toFixed(2))})`
                        : 0}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
            {activeKey === "OTBNDCL" ? (
              <div className="ContainerPnl">
                <div className="headerAndButtonAlign">
                  <span className="spanHeader">Outbound Calls Details </span>
                  <span className="buttonAlign">
                    <FaFileExcel title="Excel download of Inbound Calls Details" onClick={() => OnClickExcelDataDownlaod("OTBNDCL")} />
                  </span>
                </div>
                <div class="outbound-dashboard">
                  <div class="outbound-dashboard-item">
                    <h3 class="outbound-dashboard-title">No. Of Active Agents</h3>
                    <div class="outbound-dashboard-value">
                      {billingDashBoardList && billingDashBoardList.length > 0 && billingDashBoardList[0].totalDistinctAgents
                        ? `(${numberWithCommas(billingDashBoardList[0].totalDistinctAgents)})`
                        : "(0)"}
                    </div>
                  </div>
                  <div class="outbound-dashboard-item">
                    <h3 class="outbound-dashboard-title">No. Of Outbound Calls</h3>
                    <div class="outbound-dashboard-value">
                      {billingDashBoardList && billingDashBoardList.length > 0 && billingDashBoardList[0].totalCalls
                        ? `(${numberWithCommas(billingDashBoardList[0].totalCalls)})`
                        : "(0)"}
                    </div>
                  </div>
                  <div class="outbound-dashboard-item">
                    <h3 class="outbound-dashboard-title">Total OB Billable Pulses</h3>
                    <div class="outbound-dashboard-value">
                      {billingDashBoardList && billingDashBoardList.length > 0 && billingDashBoardList[0].totalCustPulse
                        ? `(${numberWithCommas(billingDashBoardList[0].totalCustPulse)})`
                        : "(0)"}
                    </div>
                  </div>
                </div>
                <br />
                <table class="table table-striped">
                  <tbody>
                    {/* <tr>
                      <th style={{ width: "6%" }}>Sr. No.</th>
                      <th style={{ width: "20%" }}>Insurance Company</th>
                      <th style={{ width: "20%" }}>% Share of OBTC Pulses (B1)</th>
                      <th style={{ width: "20%" }}>Share of Outbound Calls(T*= B1 * Total OB Billable Pulses)</th>
                    </tr>
                    <tr>
                      <td>1.</td>
                      <td>AIC</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>2.</td>
                      <td>Bajaj Allianz</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>3.</td>
                      <td>Bharti AXA GIC</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>4.</td>
                      <td>IFFCO TOKIO</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>4.</td>
                      <td>Oriental Insurance</td>
                      <td></td>
                      <td></td>
                    </tr> */}
                    <tr>
                      <th style={{ width: "5%" }}>Sr. No.</th>
                      <th style={{ width: "15%" }}>Insurance Company</th>
                      <th style={{ width: "10%" }}>% Share of OBTC Pulses (B1)</th>
                      <th style={{ width: "20%" }}>Share of Outbound Calls(T*= B1 * Total OB Billable Pulses)</th>
                    </tr>

                    {billingDashBoardObICDetailsList && billingDashBoardObICDetailsList.length > 0 && billingDashBoardObICDetailsList[0].ic_data ? (
                      billingDashBoardObICDetailsList[0].ic_data.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td style={{ textAlign: "center" }}>{index + 1}</td>
                            <td>{item["_id"]}</td>
                            <td style={{ textAlign: "center" }}>
                              {item.tagged_pulse_percentage ? `${numberWithCommas(parseFloat(item.tagged_pulse_percentage).toFixed(2))}%` : "0%"}
                            </td>
                            <td style={{ textAlign: "center" }}>{item.total_pulses ? numberWithCommas(parseFloat(item.total_pulses).toFixed(2)) : "0.00"}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ textAlign: "center" }}>
                          Data not exist
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="2">Grand Total</td>
                      <td style={{ textAlign: "center" }}>
                        {grandTotalOBTCPercntShare ? `${numberWithCommas(parseFloat(grandTotalOBTCPercntShare).toFixed(2))}%` : 0}
                      </td>
                      <td colSpan="" style={{ textAlign: "center" }}>
                        {grandTotalOBPulses ? numberWithCommas(parseFloat(grandTotalOBPulses).toFixed(2)) : 0}
                      </td>
                    </tr>
                  </tfoot>
                </table>
                <div class="billing-header">Out Bound Pulses Billing Total of Insurance Company</div>
                <br />
                <div class="pulses-container">
                  <div class="pulses-box inbound-pulses">
                    <p>Amount for Out bound Pulses</p>
                    <p>X3 = T1 * 1.25</p>
                    <p>{totalICOBTotalAmount ? `(Rs. ${numberWithCommas(parseFloat(totalICOBTotalAmount).toFixed(2))})` : 0}</p>
                  </div>
                  <div class="pulses-plus-sign">+</div>
                  <div class="pulses-circle pulses-tax">
                    <p>Taxes (GST)</p>
                    <p>Y3 = X3 * 18%</p>
                    <p>{totalICOBGSTAmount ? `(Rs. ${numberWithCommas(parseFloat(totalICOBGSTAmount).toFixed(2))})` : 0}</p>
                  </div>
                  <div class="pulses-equals-sign">=</div>
                  <div class="pulses-box total-pulses">
                    <p>Total Bill for OB Pulses</p>
                    <p>Z3 = X3 + Y3</p>
                    <p>{totalICOBTotalBillableAmount ? `(Rs. ${numberWithCommas(parseFloat(totalICOBTotalBillableAmount).toFixed(2))})` : 0}</p>
                  </div>
                </div>
              </div>
            ) : null}
            {activeKey === "TXTMSG" ? (
              <div className="ContainerPnl">
                <div className="headerAndButtonAlign">
                  <span className="spanHeader">Text Message Details </span>
                  <span className="buttonAlign">
                    <FaFileExcel title="Excel download of Inbound Calls Details" onClick={() => OnClickExcelDataDownlaod("TXTMSG")} />
                  </span>
                </div>
                <br />
                <table class="table table-striped">
                  <tbody>
                    {/* <tr>
                      <th style={{ width: "6%" }}>Sr. No.</th>
                      <th style={{ width: "20%" }}>Insurance Company</th>
                      <th style={{ width: "20%" }}>% Share of IBTC Pulses (B1)</th>
                      <th style={{ width: "20%" }}>SMS count to be Billed(U*= B1 * Total SMS sent)</th>
                    </tr>
                    <tr>
                      <td>1.</td>
                      <td>AIC</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>2.</td>
                      <td>Bajaj Allianz</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>3.</td>
                      <td>Bharti AXA GIC</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>4.</td>
                      <td>IFFCO TOKIO</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>4.</td>
                      <td>Oriental Insurance</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>5.</td>
                      <td>Royal Sundaram GIC</td>
                      <td></td>
                      <td></td>
                    </tr> */}
                    <tr>
                      <th style={{ width: "5%" }}>Sr. No.</th>
                      <th style={{ width: "22%" }}>Insurance Company</th>
                      <th style={{ width: "15%" }}>% Share of IBTC Pulses (B1)</th>
                      <th style={{ width: "20%" }}>SMS count to be Billed(U*= B1 * Total SMS sent)</th>
                    </tr>
                    {/* {billingDashBoardList && billingDashBoardList.length > 0 && billingDashBoardList[0].IC_data ? (
                      billingDashBoardList[0].IC_data.map((item, index) => { */}
                    {billingDashBoardList && billingDashBoardList.length > 0 && billingDashBoardList[0] ? (
                      billingDashBoardList[0].map((item, index) => {
                        return (
                          <tr key={index}>
                            <td style={{ textAlign: "center" }}>{index + 1}</td>
                            <td>{item["_id"]}</td>
                            <td style={{ textAlign: "center" }}>
                              {item.perentage_pulses ? `${numberWithCommas(parseFloat(item.perentage_pulses).toFixed(2))}%` : "0%"}
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {item.sms_submission ? numberWithCommas(parseFloat(item.sms_submission).toFixed(2)) : "0.00"}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ textAlign: "center" }}>
                          Data not exist
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="2">Grand Total</td>
                      <td style={{ textAlign: "center" }}>
                        {grandTotalTextMsgPercntShare ? `${numberWithCommas(parseFloat(grandTotalTextMsgPercntShare).toFixed(2))}%` : "0%"}
                      </td>
                      <td colSpan="" style={{ textAlign: "center" }}>
                        {grandTotalTextMsg ? numberWithCommas(parseFloat(grandTotalTextMsg).toFixed(2)) : 0}
                      </td>
                    </tr>
                  </tfoot>
                </table>
                <div class="billing-header">SMS Billing Total of Insurance Company</div>
                <br />
                <div class="pulses-container">
                  <div class="pulses-box inbound-pulses">
                    <p>Amount for SMS Sent</p>
                    <p>X4 = U1 * 0.125</p>
                    <p>{totalICTxtMsgTotalAmount ? `(Rs. ${numberWithCommas(parseFloat(totalICTxtMsgTotalAmount).toFixed(2))})` : 0}</p>
                  </div>
                  <div class="pulses-plus-sign">+</div>
                  <div class="pulses-circle pulses-tax">
                    <p>Taxes (GST)</p>
                    <p>Y4 = X4 * 18%</p>
                    <p>{totalICTxtMsgGSTAmount ? `(Rs. ${numberWithCommas(parseFloat(totalICTxtMsgGSTAmount).toFixed(2))})` : 0}</p>
                  </div>
                  <div class="pulses-equals-sign">=</div>
                  <div class="pulses-box total-pulses">
                    <p>Total Bill for SMS Sent</p>
                    <p>Z4 = X4 + Y4</p>
                    <p>{totalICTxtMsgTotalBillableAmount ? `(Rs. ${numberWithCommas(parseFloat(totalICTxtMsgTotalBillableAmount).toFixed(2))})` : 0}</p>
                  </div>
                </div>
              </div>
            ) : null}
            {activeKey === "WHAPP" ? (
              <div className="ContainerPnl">
                <span className="spanHeader">WhatsApp Details</span>
                <br />
                <table class="table table-striped">
                  <tbody>
                    <tr>
                      <th style={{ width: "6%" }}>Sr. No.</th>
                      <th style={{ width: "20%" }}>Insurance Company</th>
                      <th style={{ width: "20%" }}>% Share of IBTC Pulses (B1)</th>
                      <th style={{ width: "20%" }}>WhatsApp count to be Billed(U*= B1 * MSG sent)</th>
                    </tr>
                    <tr>
                      <td>1.</td>
                      <td>AIC</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>2.</td>
                      <td>Bajaj Allianz</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>3.</td>
                      <td>Bharti AXA GIC</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>4.</td>
                      <td>IFFCO TOKIO</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>4.</td>
                      <td>Oriental Insurance</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>5.</td>
                      <td>Royal Sundaram GIC</td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="2">Grand Total</td>
                      <td colSpan="4"></td>
                    </tr>
                  </tfoot>
                </table>
                <div class="billing-header">WhatsApp Billing Total of Insurance Company</div>
                <br />
                <div class="pulses-container">
                  <div class="pulses-box inbound-pulses">
                    <p>Amount for WhatsApp SMS Sent</p>
                    <p>X4 = U1 * AS Per Meta Rate</p>
                  </div>
                  <div class="pulses-plus-sign">+</div>
                  <div class="pulses-circle pulses-tax">
                    <p>Taxes (GST)</p>
                    <p>Y4 = X4 * 18%</p>
                  </div>
                  <div class="pulses-equals-sign">=</div>
                  <div class="pulses-box total-pulses">
                    <p>Total Bill for WhatsAPP Sent</p>
                    <p>Z4 = X4 + Y4</p>
                  </div>
                </div>
              </div>
            ) : null}
            {activeKey === "AIBT" ? (
              <div className="ContainerPnl">
                <span className="spanHeader">AI Calls Details</span>
                <br />
                <table class="table table-striped">
                  <tbody>
                    <tr>
                      <th style={{ width: "6%" }}>Sr. No.</th>
                      <th style={{ width: "20%" }}>Insurance Company</th>
                      <th style={{ width: "20%" }}>% Share of IBTC Pulses (B1)</th>
                      <th style={{ width: "20%" }}>AI Calls count to be Billed(U*= B1 * AI Calls)</th>
                    </tr>
                    <tr>
                      <td>1.</td>
                      <td>AIC</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>2.</td>
                      <td>Bajaj Allianz</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>3.</td>
                      <td>Bharti AXA GIC</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>4.</td>
                      <td>IFFCO TOKIO</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>4.</td>
                      <td>Oriental Insurance</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>5.</td>
                      <td>Royal Sundaram GIC</td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="2">Grand Total</td>
                      <td colSpan="4"></td>
                    </tr>
                  </tfoot>
                </table>
                <div class="billing-header">AI Calls Billing Total of Insuranc Company</div>
                <br />
                <div class="pulses-container">
                  <div class="pulses-box inbound-pulses">
                    <p>Amount for AI Calls</p>
                    <p>X4 = U1 * 2.25</p>
                  </div>
                  <div class="pulses-plus-sign">+</div>
                  <div class="pulses-circle pulses-tax">
                    <p>Taxes (GST)</p>
                    <p>Y4 = X4 * 18%</p>
                  </div>
                  <div class="pulses-equals-sign">=</div>
                  <div class="pulses-box total-pulses">
                    <p>Total Bill for AI Calls</p>
                    <p>Z4 = X4 + Y4</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default BillingDashboard;
