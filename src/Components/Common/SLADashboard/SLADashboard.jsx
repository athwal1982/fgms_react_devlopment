import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { Accordion } from "react-bootstrap";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import { Loader } from "Framework/Components/Widgets";
import "./SLADashboard.scss";
import { PageBar } from "Framework/Components/Layout";
import { slaReports } from "./Services/Services";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { getMasterDataBinding } from "../../Modules/Support/ManageTicket/Services/Methods";

function SLADashboard() {
  const setAlertMessage = AlertMessage();

  const [activeKey, setActiveKey] = useState("");
  const [sla1Chart, setsla1Chart] = useState({});
  const [sla2Chart, setsla2Chart] = useState({});
  const [sla3Chart, setsla3Chart] = useState({});
  const [sla4Chart, setsla4Chart] = useState({});
  const [sla5Chart, setsla5Chart] = useState({});
  const [sla6Chart, setsla6Chart] = useState({});

  const [header, setheader] = useState({
    year: "Year",
    month: "Month",
  });

  const [slaReportData, setSlaReportData] = useState({
    totalAnsweredCallASA: 0,
    totalQuedCallsASA: 0,
    percentQuedCallsASA: 0,
    totalAnsweredCallAHT: 0,
    callAHT_300_seconds: 0,
    percentAHT_300_seconds: 0,
    totalCallsLanded: 0,
    callsPerActiveAgent: 0,
    totalActiveAgent: 0,
    percentQuedCallsSYS: 0,
    percentQuedCallsSY: 0,
    uptime: 0,
    totalAuditCalls: 0,
    totalAgents: 0,
    totalScoreAllAgents: 0,
    qualityPercentage: 0,
    agentCompletedSixTwelveMonth: 0,
    totalHoursOfTraining: 0,
    averageHours: 0,
  });

  const ClearFormData = () => {
    setSlaReportData({
      totalAnsweredCallASA: 0,
      totalQuedCallsASA: 0,
      percentQuedCallsASA: 0,
      totalAnsweredCallAHT: 0,
      callAHT_300_seconds: 0,
      percentAHT_300_seconds: 0,
      totalCallsLanded: 0,
      callsPerActiveAgent: 0,
      totalActiveAgent: 0,
      percentQuedCallsSYS: 0,
      percentQuedCallsSY: 0,
      uptime: 0,
      totalAuditCalls: 0,
      totalAgents: 0,
      totalScoreAllAgents: 0,
      qualityPercentage: 0,
      agentCompletedSixTwelveMonth: 0,
      totalHoursOfTraining: 0,
      averageHours: 0,
    });

    setsla1Chart([]);
    setsla2Chart([]);
    setsla3Chart([]);
    setsla4Chart([]);
    setsla5Chart([]);
    setsla6Chart([]);
  };

  const [btnLoaderActive, setBtnLoaderActive] = useState(false);

  const getSLACallData = async (formattedStartDate, formattedEndDate) => {
    debugger;
    try {
      const formData = {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        ic_code:
          insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1 ? insuranceCompanyList[0].InsuranceCompanyCode : "",
      };
      setBtnLoaderActive(true);

      const result = await slaReports(formData);
      setBtnLoaderActive(false);

      const data = result.responseData?.[0] || [];

      if (data.length === 0) {
        ClearFormData();

        setAlertMessage({
          type: "warning",
          message: "This month has no data",
        });
      } else {
        const ASA_REPORT = data?.ASA_REPORT || {};
        const AHT_REPORT = data?.AHT_REPORT || {};
        const SEAT_UTILIZATION = data?.SEAT_UTILIZATION || {};
        const SYSTEM_UPTIME_REPORT = data?.SYSTEM_UPTIME_REPORT || {};
        const CALL_QUALITY_SCORE = data?.CALL_QUALITY_SCORE || {};
        const TRAINING_REPORT = data?.TRAINING_REPORT || {};

        const ASA_graph =
          data.ASA_graph?.map((item) => ({
            cs_date: item.month,
            asa: item.value,
          })) || [];

        const AHT_graph =
          data.AHT_graph?.map((item) => ({
            cs_date: item.month,
            aht: item.value,
          })) || [];

        const SEAT_UTILIZATION_graph =
          data.SEAT_UTILIZATION_graph?.map((item) => ({
            cs_date: item.month,
            seat: item.value,
          })) || [];

        const SYSTEM_UPTIME_GRAPH =
          data.SYSTEM_UPTIME_GRAPH?.map((item) => ({
            cs_date: item.month,
            uptime: item.uptime,
          })) || [];
        const CALL_QUALITY_SCORE_GRAPH =
          data.CALL_QUALITY_SCORE_GRAPH?.map((item) => ({
            cs_date: item.month,
            percentage: item.percentage,
          })) || [];
        const TRANING_REPORT_GRAPH =
          data.TRANING_REPORT_GRAPH?.map((item) => ({
            cs_date: item.month,
            averageHours: item.averageHours,
          })) || [];

        setSlaReportData({
          totalAnsweredCallASA: ASA_REPORT.totalAnsweredCallASA || 0,
          totalQuedCallsASA: ASA_REPORT.totalQuedCallsASA || 0,
          percentQuedCallsASA: ASA_REPORT.percentQuedCallsASA || 0,
          totalAnsweredCallAHT: AHT_REPORT.totalAnsweredCallAHT || 0,
          callAHT_300_seconds: AHT_REPORT.callAHT_300_seconds || 0,
          percentAHT_300_seconds: AHT_REPORT.percentAHT_300_seconds || 0,
          totalCallsLanded: SEAT_UTILIZATION.totalCallsLanded || 0,
          callsPerActiveAgent: SEAT_UTILIZATION.callsPerActiveAgent || 0,
          totalActiveAgent: SEAT_UTILIZATION.totalActiveAgent || 0,
          uptime: SYSTEM_UPTIME_REPORT.uptime || 0,
          totalAuditCalls: CALL_QUALITY_SCORE.totalAuditCalls || 0,
          totalAgents: CALL_QUALITY_SCORE.totalAgents || 0,
          totalScoreAllAgents: CALL_QUALITY_SCORE.totalScoreAllAgents || 0,
          qualityPercentage: CALL_QUALITY_SCORE.qualityPercentage || 0,
          agentCompletedSixTwelveMonth: TRAINING_REPORT.agentCompletedSixTwelveMonth || 0,
          totalHoursOfTraining: TRAINING_REPORT.totalHoursOfTraining || 0,
          averageHours: TRAINING_REPORT.averageHours || 0,
        });

        getSLA1Chart(SYSTEM_UPTIME_GRAPH);
        getSLA2Chart(ASA_graph);
        getSLA3Chart(AHT_graph);
        getSLA4Chart(CALL_QUALITY_SCORE_GRAPH);
        getSLA5Chart(TRANING_REPORT_GRAPH);
        getSLA6Chart(SEAT_UTILIZATION_graph);
      }
    } catch (error) {
      console.error(error);
      setAlertMessage({
        type: "error",
        message: error.message,
      });
    }
  };

  const getSLA1Chart = (arraySLA1) => {
    debugger;
    const pCategories = [];
    const pSeries = { name: "", data: [] };

    arraySLA1.forEach((v) => {
      // A const date = new Date(v.cs_date).getTime();
      // A pCategories.push(date);
      const date = v.cs_date;
      pCategories.push(date);

      pSeries.data.push({
        x: date,
        // A y: Math.round(Number(v.uptime))
        y: Number(v.uptime),
      });

      pSeries.name = "System Uptime";
    });

    const jsonSLA1 = {
      series: [pSeries],
      options: {
        chart: {
          type: "bar",
          height: 350,
          stacked: true,
          toolbar: {
            export: {
              csv: { filename: "% System Uptime" },
              svg: { filename: "% System Uptime" },
              png: { filename: "% System Uptime" },
            },
          },
          zoom: { enabled: true },
        },
        colors: ["#9BBB58"],
        plotOptions: {
          bar: { horizontal: false, columnWidth: "30%", endingShape: "rounded" },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return `${val}%`;
          },
          style: {
            fontSize: "12px",
            colors: ["#fff"],
          },
        },
        xaxis: {
          // A type: "datetime",
          // A labels: {
          // A  format: "dd MMM",
          // A },
        },
        yaxis: { title: { text: "SYSTEM UPTIME" } },
        fill: { opacity: 1 },
        grid: { borderColor: "#9BBB58" },
      },
    };
    setsla1Chart(jsonSLA1);
  };

  const getSLA2Chart = (arraySLA2) => {
    debugger;
    const pCategories = [];
    const pSeries = { name: "", data: [] };

    arraySLA2.forEach((v) => {
      // A const date = new Date(v.cs_date).getTime();
      // A pCategories.push(date);
      const date = v.cs_date;
      pCategories.push(date);
      pSeries.data.push({
        x: date,
        // A y: Math.round(Number(v.asa))
        y: Number(v.asa),
      });

      pSeries.name = "Average Speed to Answer (ASA)";
    });

    const jsonSLA2 = {
      series: [pSeries],
      options: {
        chart: {
          type: "bar",
          height: 350,
          stacked: true,
          toolbar: {
            export: {
              csv: { filename: "Average Speed to Answer (ASA)" },
              svg: { filename: "Average Speed to Answer (ASA)" },
              png: { filename: "Average Speed to Answer (ASA)" },
            },
          },
          zoom: { enabled: true },
        },
        colors: ["#60B65B"],
        plotOptions: {
          bar: { horizontal: false, columnWidth: "30%", endingShape: "rounded" },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return `${val}%`;
          },
          style: {
            fontSize: "12px",
            colors: ["#fff"],
          },
        },
        xaxis: {
          // A type: "datetime",
          // A labels: {
          // A format: "dd MMM",
          // A },
        },
        yaxis: { title: { text: "AVERAGE SPEED TO ANSWER (ASA)" } },
        fill: { opacity: 1 },
        grid: { borderColor: "#60B65B" },
      },
    };
    setsla2Chart(jsonSLA2);
  };

  const getSLA3Chart = (arraySLA3) => {
    const pCategories = [];
    const pSeries = { name: "", data: [] };

    arraySLA3.forEach((v) => {
      // A const date = new Date(v.cs_date).getTime();
      // A pCategories.push(date);
      const date = v.cs_date;
      pCategories.push(date);

      pSeries.data.push({
        x: date,
        // A y: Math.round(Number(v.aht))
        y: Number(v.aht),
      });
      pSeries.name = "Average Handle Time (AHT)";
    });

    const jsonSLA3 = {
      series: [pSeries],
      options: {
        chart: {
          height: 350,
          type: "area",
          toolbar: {
            export: {
              csv: { filename: "% Average Handle Time (AHT)" },
              svg: { filename: "% Average Handle Time (AHT)" },
              png: { filename: "% Average Handle Time (AHT)" },
            },
          },
          zoom: { enabled: false },
        },
        colors: ["#5DB18F"],
        plotOptions: {
          bar: { horizontal: false, columnWidth: "30%", endingShape: "rounded" },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return `${val}%`;
          },
          style: {
            fontSize: "12px",
            colors: ["#fff"],
          },
        },
        xaxis: {
          // A type: "datetime",
          // A labels: {
          // A format: "dd MMM",
          // A },
        },
        yaxis: {
          title: { text: "AVERAGE HANDLE TIME (AHT)" },
        },
        grid: { borderColor: "#5DB18F" },
      },
    };
    setsla3Chart(jsonSLA3);
  };

  const getSLA4Chart = (arraySLA4) => {
    const pCategories = [];
    const pSeries = { name: "", data: [] };

    arraySLA4.forEach((v) => {
      // A const date = new Date(v.cs_date).getTime();
      // A pCategories.push(date);
      const date = v.cs_date;
      pCategories.push(date);

      pSeries.data.push({
        x: date,
        // A y: Math.round(Number(v.rating))
        y: Number(v.percentage),
      });
      pSeries.name = "Call Quality Score";
    });

    const jsonSLA4 = {
      series: [pSeries],
      options: {
        chart: {
          height: 350,
          type: "radar",
          toolbar: {
            export: {
              csv: { filename: "% Call Quality Score" },
              svg: { filename: "% Call Quality Score" },
              png: { filename: "% Call Quality Score" },
            },
          },
          zoom: { enabled: false },
        },
        colors: ["#5F9DAC"],
        plotOptions: {
          bar: { horizontal: false, columnWidth: "30%", endingShape: "rounded" },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return `${val}%`;
          },
          style: {
            fontSize: "12px",
            colors: ["#fff"],
          },
        },
        xaxis: {
          // A type: "datetime",
          // A labels: {
          // A  format: "dd MMM",
          // A },
        },
        yaxis: {
          title: { text: "CALL QUALITY SCORE" },
        },
        grid: { borderColor: "#5F9DAC" },
      },
    };
    setsla4Chart(jsonSLA4);
  };

  const getSLA5Chart = (arraySLA5) => {
    const pCategories = [];
    const pSeries = [];

    arraySLA5.forEach((v) => {
      pCategories.push(v.cs_date);
      pSeries.push({
        // A x: new Date(v.cs_date).getTime(),
        // A y: Math.round(Number(v.training)),
        x: v.cs_date,
        y: Number(v.averageHours),
      });
    });

    const jsonSLA5 = {
      series: [
        {
          name: "Agent (Seats) Training",
          data: pSeries,
        },
      ],
      options: {
        chart: {
          height: 350,
          type: "bubble",
          toolbar: {
            export: {
              csv: { filename: "% Agent (Seats) Training" },
              svg: { filename: "% Agent (Seats) Training" },
              png: { filename: "% Agent (Seats) Training" },
            },
          },
          zoom: { enabled: true },
        },
        colors: ["#626EA8"],
        plotOptions: {
          bar: { horizontal: false, columnWidth: "30%", endingShape: "rounded" },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return `${val} Hrs`;
          },
          style: {
            fontSize: "12px",
            colors: ["#fff"],
          },
        },
        xaxis: {
          // A type: "datetime",
          categories: pCategories,
        },
        yaxis: {
          title: { text: "AGENT (SEATS)TRAINING" },
        },
        grid: { borderColor: "#626EA8" },
      },
    };
    setsla5Chart(jsonSLA5);
  };

  const getSLA6Chart = (arraySLA6) => {
    const pCategories = [];
    const pSeries = [];

    arraySLA6.forEach((v) => {
      pCategories.push(v.cs_date);
      pSeries.push({
        // A x: new Date(v.cs_date).getTime(),
        // A y: Math.round(Number(v.training)),
        x: v.cs_date,
        y: Number(v.seat),
      });
    });

    const jsonSLA6 = {
      series: [
        {
          name: "Seat Utilization",
          data: pSeries,
        },
      ],
      options: {
        chart: {
          height: 350,
          type: "bubble",
          toolbar: {
            export: {
              csv: { filename: "% Seat Utilization" },
              svg: { filename: "% Seat Utilization" },
              png: { filename: "% Seat Utilization" },
            },
          },
          zoom: { enabled: true },
        },
        colors: ["#8064A1"],
        plotOptions: {
          bar: { horizontal: false, columnWidth: "30%", endingShape: "rounded" },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return `${val}%`;
          },
          style: {
            fontSize: "12px",
            colors: ["#fff"],
          },
        },
        xaxis: {
          // A type: "datetime",
          categories: pCategories,
        },
        yaxis: {
          title: { text: "SEAT UTILIZATION" },
        },
        grid: { borderColor: "#8064A1" },
      },
    };
    setsla6Chart(jsonSLA6);
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

  useEffect(() => {
    debugger;
    // A const now = new Date();
    // A const currentYear = now.getFullYear();
    // A const currentmonth = now.getMonth() + 1;
    // A for (let i = 0; i <= monthList.length; i += 1) {
    // A  if (monthList[i].value === currentmonth) {
    // A    setheader({
    // A      year: currentYear,
    // A      month: monthList[i].label,
    // A    });
    // A    setSearchFormValues({
    // A      ...searchFormValues,
    // A      txtYearFilter: { label: currentYear.toString(), value: currentYear.toString() },
    // A      txtMonthFilter: { label: monthList[i].label, value: monthList[i].value },
    // A    });
    // A    break;
    // A  }
    // A}

    // A const yearArray = [];
    // A for (let i = 2024; i <= currentYear; i += 1) {
    // A  yearArray.push({ label: i.toString(), value: i.toString() });
    // A }
    // A setYearList(yearArray.sort().reverse());
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
      txtMonthFilter: { label: monthList[2].label, value: monthList[2].value },
    });
    setheader({
      year: currentYear.toString(),
      month: monthList[2].label,
    });

    getInsuranceCompanyListData();
    setTimeout(() => {
      getCurrentYearSlaGraph();
    }, 2000);
  }, []);

  const [monthList] = useState([
    // A { label: "Jan", value: 1 },
    // A { label: "Feb", value: 2 },
    // A { label: "Mar", value: 3 },
    // A { label: "Apr", value: 4 },
    // A { label: "May", value: 5 },
    // A { label: "Jun", value: 6 },
    // A { label: "Jul", value: 7 },
    { label: "Aug", value: 8 },
    { label: "Sep", value: 9 },
    { label: "Oct", value: 10 },
    // A { label: "Nov", value: 11 },
    // A { label: "Dec", value: 12 },
  ]);
  const [yearList, setYearList] = useState([]);

  const [searchFormValues, setSearchFormValues] = useState({
    txtYearFilter: null,
    txtMonthFilter: null,
  });
  const updateSearchFormState = (name, value) => {
    debugger;
    setSearchFormValues({ ...searchFormValues, [name]: value });

    if (name === "txtMonthFilter") {
      if (searchFormValues.txtYearFilter === null) {
        setAlertMessage({
          type: "error",
          message: "Please select a year before choosing a month.",
        });
        return;
      }
    }

    if (name === "txtMonthFilter") {
      setSearchFormValues({
        ...searchFormValues,
        txtMonthFilter: value,
      });
      setheader({
        year: "Year",
        month: "Month",
      });
      if (value) {
        setheader({
          year: searchFormValues.txtYearFilter.value,
          month: value.label,
        });
        const year = searchFormValues.txtYearFilter.value;
        const month = value.value;
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const formattedStartDate = `${String(startDate.getDate()).padStart(2, "0")}-${String(startDate.getMonth() + 1).padStart(
          2,
          "0",
        )}-${startDate.getFullYear()}`;
        const formattedEndDate = `${String(endDate.getDate()).padStart(2, "0")}-${String(endDate.getMonth() + 1).padStart(2, "0")}-${endDate.getFullYear()}`;
        getSLACallData(formattedStartDate, formattedEndDate);
      }
    }
    if (name === "txtYearFilter") {
      setSearchFormValues({
        ...searchFormValues,
        txtYearFilter: value,
      });
      setheader({
        year: "Year",
        month: "Month",
      });
      if (value) {
        if (searchFormValues.txtMonthFilter !== null) {
          setheader({
            year: value.value,
            month: searchFormValues.txtMonthFilter.label,
          });
          const month = searchFormValues.txtMonthFilter.value;
          const year = value.value;
          const startDate = new Date(year, month - 1, 1);
          const endDate = new Date(year, month, 0);
          const formattedStartDate = `${String(startDate.getDate()).padStart(2, "0")}-${String(startDate.getMonth() + 1).padStart(
            2,
            "0",
          )}-${startDate.getFullYear()}`;
          const formattedEndDate = `${String(endDate.getDate()).padStart(2, "0")}-${String(endDate.getMonth() + 1).padStart(2, "0")}-${endDate.getFullYear()}`;
          getSLACallData(formattedStartDate, formattedEndDate);
        }
      } else {
        ClearFormData();
      }
    }
  };

  const onClickClearSearchFilter = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    setSearchFormValues({
      ...searchFormValues,
      txtYearFilter: { label: currentYear.toString(), value: currentYear.toString() },
      txtMonthFilter: { label: monthList[2].label, value: monthList[2].value },
    });
    setheader({
      year: currentYear.toString(),
      month: monthList[2].label,
    });
    getCurrentYearSlaGraph();
  };

  const getCurrentYearSlaGraph = () => {
    debugger;
    // A const now = new Date();
    // A const year = now.getFullYear();
    // A const month = now.getMonth();
    // A const startDate = new Date(year, month, 1);
    // A const endDate = new Date(year, month + 1, 0);
    // A const formattedStartDate = `${String(startDate.getDate()).padStart(2, "0")}-${String(startDate.getMonth() + 1).padStart(
    // A  2,
    // A  "0",
    // A)}-${startDate.getFullYear()}`;
    // A const formattedEndDate = `${String(endDate.getDate()).padStart(2, "0")}-${String(endDate.getMonth() + 1).padStart(2, "0")}-${endDate.getFullYear()}`;
    // A getSLACallData(formattedStartDate, formattedEndDate);

    const now = new Date();
    const year = now.getFullYear();
    const month = monthList[2].value;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const formattedStartDate = `${String(startDate.getDate()).padStart(2, "0")}-${String(startDate.getMonth() + 1).padStart(
      2,
      "0",
    )}-${startDate.getFullYear()}`;
    const formattedEndDate = `${String(endDate.getDate()).padStart(2, "0")}-${String(endDate.getMonth() + 1).padStart(2, "0")}-${endDate.getFullYear()}`;
    getSLACallData(formattedStartDate, formattedEndDate);
  };
  return (
    <>
      <div className="PageStart">
        {btnLoaderActive ? <Loader /> : false}
        <PageBar>
          <span className="bar_header_Text">
            Service Level Agreement For {header.month} {header.year}
          </span>
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
          <PageBar.Button
            onClick={() => onClickClearSearchFilter()}
            title="Clear"
            style={{
              display: "none",
            }}
          >
            Clear
          </PageBar.Button>
        </PageBar>
        <div className="Main_Dash">
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
          <div className="Dash_container">
            <div class="card color-1">
              <div class="header">
                SLA a : System Uptime
                <span class="info">
                  &#9432;
                  <div class="tooltip">
                    <table>
                      <thead style={{ backgroundColor: "#9BBB58" }}>
                        <tr>
                          <th>Target</th>
                          <th>SLA based cost Deduction</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>&gt;=97%</td>
                          <td>NIL</td>
                        </tr>
                        <tr>
                          <td>&gt;=95% but &lt;97%</td>
                          <td>1.0% of the monthly billed amount</td>
                        </tr>
                        <tr>
                          <td>&gt;=92.5% but &lt;95%</td>
                          <td>2.0% of the monthly billed amount</td>
                        </tr>
                        <tr>
                          <td>&gt;=90% but &lt;92.5%</td>
                          <td>3.0% of the monthly billed amount</td>
                        </tr>
                        <tr>
                          <td>&gt;=87% but &lt;90%</td>
                          <td>5.0% of the monthly billed amount</td>
                        </tr>
                        <tr>
                          <td>&lt;87%</td>
                          <td>7.0% of the monthly billed amount</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </span>
              </div>
              <ul class="footer"></ul>
              <div class="content">{slaReportData && slaReportData.uptime ? slaReportData.uptime.toFixed(2) : "0.00"}%</div>
            </div>

            <div class="card color-2">
              <div class="header">
                SLA b : ASA &gt; 30 Seconds
                <span class="info">
                  &#9432;
                  <div class="tooltip">
                    <table>
                      <thead style={{ backgroundColor: "#60B65B" }}>
                        <tr>
                          <th>Target</th>
                          <th>SLA based cost Deduction</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>&gt;80% calls attended within 30 seconds from the caller choosing to speak to an agent (seat)</td>
                          <td>NIL</td>
                        </tr>
                        <tr>
                          <td>70-80% calls attended within 30 seconds</td>
                          <td>3.0% of the monthly billed amount</td>
                        </tr>
                        <tr>
                          <td>&lt;70% calls attended with in 30 seconds from the caller choosing to speak to an agent (seat)</td>
                          <td>5.0% of the monthly billed amount</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </span>
              </div>
              <ul class="footer">
                <li>Total Call Answered (A): {slaReportData.totalAnsweredCallASA}</li>
                <li>Call Answered within 30 seconds (B): {slaReportData.totalQuedCallsASA}</li>
              </ul>

              <div class="content">{slaReportData && slaReportData.percentQuedCallsASA ? slaReportData.percentQuedCallsASA.toFixed(2) : "0.00"}%</div>
            </div>

            <div class="card color-3">
              <div class="header">
                SLA c : AHT &gt;= 300 Seconds
                <span class="info">
                  &#9432;
                  <div class="tooltip">
                    <table>
                      <thead style={{ backgroundColor: "#5DB18F" }}>
                        <tr>
                          <th>Target</th>
                          <th>SLA based cost Deduction</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>&gt;=300 Seconds for more than 30% of total call volume</td>
                          <td>7.0% of the monthly bill amount</td>
                        </tr>
                        <tr>
                          <td>&gt;=300 Seconds for 10%-30% of total call volume</td>
                          <td>5.0% of the monthly bill amount</td>
                        </tr>
                        <tr>
                          <td>&gt;=300 Seconds for less than 10% of total call volume</td>
                          <td>NIL</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </span>
              </div>
              <ul class="footer">
                <li>Total Call Answered (A): {slaReportData.totalAnsweredCallAHT}</li>
                <li>Call having AHT of 300 seconds (B): {slaReportData.callAHT_300_seconds}</li>
              </ul>
              <div class="content">{slaReportData && slaReportData.percentAHT_300_seconds ? slaReportData.percentAHT_300_seconds.toFixed(2) : "0.00"}%</div>
            </div>

            <div class="card color-4">
              <div class="header">
                SLA d : Call Quality Score
                <span class="info">
                  &#9432;
                  <div class="tooltip">
                    <table>
                      <thead style={{ backgroundColor: "#5F9DAC" }}>
                        <tr>
                          <th>Target</th>
                          <th>SLA based cost Deduction</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>&gt;80%</td>
                          <td>NIL</td>
                        </tr>
                        <tr>
                          <td>Between 80% and 75%</td>
                          <td>2.0% of the monthly billed amount</td>
                        </tr>
                        <tr>
                          <td>Between 70% and 75%</td>
                          <td>3.0% of the monthly billed amount</td>
                        </tr>
                        <tr>
                          <td> &lt;70%</td>
                          <td>5.0% of the monthly billed amount</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </span>
              </div>
              <ul class="footer">
                <li>No. of calls Audited (A): {slaReportData.totalAuditCalls}</li>
                <li>No. of Agents (B): {slaReportData.totalAgents}</li>
                <li>Total Score of all Agents (C):{slaReportData.totalScoreAllAgents}</li>
              </ul>
              <div class="content">{slaReportData && slaReportData.qualityPercentage ? slaReportData.qualityPercentage.toFixed(2) : "0.00"}%</div>
            </div>

            <div class="card color-5">
              <div class="header">
                SLA e : Agents Training
                <span class="info">
                  &#9432;
                  <div class="tooltip">
                    <table>
                      <thead style={{ backgroundColor: "#626EA8" }}>
                        <tr>
                          <th>Target</th>
                          <th>SLA based cost Deduction</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>40 Hours</td>
                          <td>NIL</td>
                        </tr>
                        <tr>
                          <td>30-40 Hours</td>
                          <td>1.5% of the monthly billed amount</td>
                        </tr>
                        <tr>
                          <td>&lt;30 hours</td>
                          <td>5% of the monthly billed Amount</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </span>
              </div>
              <ul class="footer">
                <li>No. of Agents completed 6/12 months (A):{slaReportData.agentCompletedSixTwelveMonth}</li>
                <li>Total hours of Training:{slaReportData.totalHoursOfTraining}</li>
              </ul>
              <div class="content">{slaReportData && slaReportData.averageHours ? slaReportData.averageHours : "0"}Hrs</div>
              {/* <div class="content">91Hrs</div> */}
            </div>

            <div class="card color-6">
              <div class="header">
                SLA f : Seat Utilization
                <span class="info">
                  &#9432;
                  <div class="tooltip">
                    <table>
                      <thead style={{ backgroundColor: "#8064A1" }}>
                        <tr>
                          <th>Target</th>
                          <th>SLA based cost Deduction</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>&gt;80%</td>
                          <td>NIL</td>
                        </tr>
                        <tr>
                          <td>Between 75% to 80%</td>
                          <td>2.0% of the monthly billed amount</td>
                        </tr>
                        <tr>
                          <td>Between 70% to 75%</td>
                          <td>3.0% of the monthly billed amount</td>
                        </tr>
                        <tr>
                          <td>&lt;70%</td>
                          <td>5.0% of the monthly billed amount</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </span>
              </div>
              <ul class="footer">
                <li>Total Landed Calls: {slaReportData.totalCallsLanded}</li>
                <li>Active Agents:{slaReportData.totalActiveAgent}</li>
              </ul>
              <div class="content">{slaReportData && slaReportData.callsPerActiveAgent ? slaReportData.callsPerActiveAgent.toFixed(2) : "0.00"}%</div>
            </div>
          </div>
          <div className="Box">
            <Accordion activeKey={activeKey} onSelect={(key) => setActiveKey(key)}>
              <Accordion.Item eventKey="0">
                <Accordion.Header> SLA 1 # System uptime</Accordion.Header>
                <Accordion.Body>
                  <div className="graph">
                    {Object.keys(sla1Chart).length === 0 ? null : <Chart options={sla1Chart.options} series={sla1Chart.series} type="bar" height={260} />}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header> SLA 2 # Average Speed to Answer (ASA)</Accordion.Header>
                <Accordion.Body>
                  <div className="graph">
                    {Object.keys(sla2Chart).length === 0 ? null : <Chart options={sla2Chart.options} series={sla2Chart.series} type="bar" height={420} />}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>SLA 3 # Average Handle Time (AHT)</Accordion.Header>
                <Accordion.Body>
                  <div className="graph">
                    {Object.keys(sla3Chart).length === 0 ? null : <Chart options={sla3Chart.options} series={sla3Chart.series} type="bar" height={260} />}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="3">
                <Accordion.Header>SLA 4 # Call Quality Score</Accordion.Header>
                <Accordion.Body>
                  <div className="graph">
                    {Object.keys(sla4Chart).length === 0 ? null : <Chart options={sla4Chart.options} series={sla4Chart.series} type="bar" height={260} />}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="4">
                <Accordion.Header>SLA 5 # Agents (seats) Training</Accordion.Header>
                <Accordion.Body>
                  <div className="graph">
                    {Object.keys(sla5Chart).length === 0 ? null : <Chart options={sla5Chart.options} series={sla5Chart.series} type="bar" height={260} />}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="5">
                <Accordion.Header>SLA 6 # Seat Utilization</Accordion.Header>
                <Accordion.Body>
                  <div className="graph">
                    {Object.keys(sla6Chart).length === 0 ? null : <Chart options={sla6Chart.options} series={sla6Chart.series} type="bar" height={260} />}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
      </div>
    </>
  );
}

export default SLADashboard;
