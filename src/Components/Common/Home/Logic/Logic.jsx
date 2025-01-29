import { useState, useEffect } from "react";
import { getSessionStorage, setSessionStorage } from "Components/Common/Login/Auth/auth";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { getDashBoardData } from "../Service/Method";

function HomeLogics() {
  const setAlertMessage = AlertMessage();
  const userData = getSessionStorage("user");

  const [resetPasswordModal, setResetPasswordModal] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState({});
  const toggleResetPasswordModal = () => {
    setResetPasswordModal(!resetPasswordModal);
    setSelectedUserData({ AppAccessID: userData.LoginID });
  };

  const [isLoadingPageData, setIsLoadingPageData] = useState(false);
  const [state4, setstate4] = useState({});
  const [state2, setstate2] = useState({});
  const [isLoadingChartLastMonthData, setIsLoadingChartLastMonthData] = useState(false);
  const getChartLastMonthData = async (pfilterID, pLoginID, pMasterName, pRefressh) => {
    try {
      if (getSessionStorage("state2SsnStrg") === null || (getSessionStorage("state2SsnStrg") !== null && pRefressh === "yes")) {
        setIsLoadingChartLastMonthData(true);
        const formdata = {
          filterID: pfilterID,
          filterID1: 0,
          filterID2: "",
          userID: pLoginID,
          masterName: pMasterName,
          searchText: "#ALL",
          searchCriteria: "AW",
        };
        const result = await getDashBoardData(formdata);
        setIsLoadingChartLastMonthData(false);
        if (result.response.responseCode === 1) {
          if (result.response.responseData && result.response.responseData.dashboard && result.response.responseData.dashboard.length > 0) {
            const pCateogires = [];
            const pseriesOpen = { name: "", data: [] };
            const pseriesResolved = { name: "", data: [] };

            result.response.responseData.dashboard.forEach((v) => {
              pCateogires.push(v.Duration);
              pseriesOpen.name = "Open";
              pseriesOpen.data.push(v.Opens);

              pseriesResolved.name = "Resolved";
              pseriesResolved.data.push(v.Resolved);
            });

            const josnstate2 = {
              series: [pseriesOpen, pseriesResolved],
              options: {
                chart: {
                  height: 350,
                  type: "line",
                  toolbar: {
                    export: {
                      csv: {
                        filename: "Tickets Open And Resolved",
                      },
                      svg: {
                        filename: "Tickets Open And Resolved",
                      },
                      png: {
                        filename: "Tickets Open And Resolved",
                      },
                    },
                  },
                  zoom: {
                    enabled: false,
                  },
                },
                dataLabels: {
                  enabled: false,
                },
                stroke: {
                  width: [5, 7, 5],
                  curve: "straight",
                  dashArray: [0, 8, 5],
                },
                markers: {
                  size: 0,
                  hover: {
                    sizeOffset: 6,
                  },
                },
                xaxis: {
                  categories: pCateogires,
                },
                grid: {
                  borderColor: "#f1f1f1",
                },
              },
            };

            setstate2(josnstate2);
            setSessionStorage("state2SsnStrg", result.response.responseData.dashboard);
            if (pRefressh !== "yes") {
              getChartDailyTicketsActivityData(1, userData && userData.LoginID ? userData.LoginID : 0, "BYSTS", "");
            }
          } else {
            setstate2({});
          }
        } else {
          setAlertMessage({
            type: "error",
            message: result.response.responseMessage,
          });
        }
      } else {
        const pCateogires = [];
        const pseriesOpen = { name: "", data: [] };
        const pseriesResolved = { name: "", data: [] };

        getSessionStorage("state2SsnStrg").forEach((v) => {
          pCateogires.push(v.Duration);
          pseriesOpen.name = "Open";
          pseriesOpen.data.push(v.Opens);

          pseriesResolved.name = "Resolved";
          pseriesResolved.data.push(v.Resolved);
        });

        const josnstate2 = {
          series: [pseriesOpen, pseriesResolved],
          options: {
            chart: {
              height: 350,
              type: "line",
              toolbar: {
                export: {
                  csv: {
                    filename: "Tickets Open And Resolved",
                  },
                  svg: {
                    filename: "Tickets Open And Resolved",
                  },
                  png: {
                    filename: "Tickets Open And Resolved",
                  },
                },
              },
              zoom: {
                enabled: false,
              },
            },
            dataLabels: {
              enabled: false,
            },
            stroke: {
              width: [5, 7, 5],
              curve: "straight",
              dashArray: [0, 8, 5],
            },
            markers: {
              size: 0,
              hover: {
                sizeOffset: 6,
              },
            },
            xaxis: {
              categories: pCateogires,
            },
            grid: {
              borderColor: "#f1f1f1",
            },
          },
        };

        setstate2(josnstate2);
        if (pRefressh !== "yes") {
          getChartDailyTicketsActivityData(1, userData && userData.LoginID ? userData.LoginID : 0, "BYSTS", "");
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

  const [state, setstate] = useState({});
  const [isLoadingChartDailyTicketsActivityData, setIsLoadingChartDailyTicketsActivityData] = useState(false);
  const getChartDailyTicketsActivityData = async (pfilterID, pLoginID, pMasterName, pRefressh) => {
    try {
      if (getSessionStorage("stateSsnStrg") === null || (getSessionStorage("stateSsnStrg") !== null && pRefressh === "yes")) {
        setIsLoadingChartDailyTicketsActivityData(true);
        const formdata = {
          filterID: pfilterID,
          filterID1: 0,
          filterID2: "",
          userID: pLoginID,
          masterName: pMasterName,
          searchText: "#ALL",
          searchCriteria: "AW",
        };
        const result = await getDashBoardData(formdata);
        setIsLoadingChartDailyTicketsActivityData(false);
        if (result.response.responseCode === 1) {
          if (result.response.responseData && result.response.responseData.dashboard && result.response.responseData.dashboard.length > 0) {
            const pCateogires = [];
            const pseriesOpen = { name: "", data: [] };
            const pseriesInProgress = { name: "", data: [] };
            const pseriesReOpen = { name: "", data: [] };
            const pseriesResolved = { name: "", data: [] };

            result.response.responseData.dashboard.forEach((v) => {
              pCateogires.push(v.Duration);
              pseriesOpen.name = "Open";
              pseriesOpen.data.push(v.Opens);

              pseriesInProgress.name = "In-Progess";
              pseriesInProgress.data.push(v.InProgress);

              pseriesReOpen.name = "Re-Open";
              pseriesReOpen.data.push(v.Reopen);

              pseriesResolved.name = "Resolved";
              pseriesResolved.data.push(v.Resolved);
            });

            const josnstate = {
              series: [pseriesOpen, pseriesInProgress, pseriesReOpen, pseriesResolved],
              options: {
                chart: {
                  type: "bar",
                  height: 350,
                  stacked: true,
                  toolbar: {
                    export: {
                      csv: {
                        filename: "Daily Tickets Activity",
                      },
                      svg: {
                        filename: "Daily Tickets Activity",
                      },
                      png: {
                        filename: "Daily Tickets Activity",
                      },
                    },
                  },
                  zoom: {
                    enabled: true,
                  },
                },
                plotOptions: {
                  bar: {
                    horizontal: false,
                    columnWidth: "100%",
                    endingShape: "rounded",
                  },
                },
                dataLabels: {
                  enabled: false,
                },
                stroke: {
                  show: true,
                  width: 2,
                  colors: ["transparent"],
                },
                xaxis: {
                  categories: pCateogires,
                },
                yaxis: {
                  title: {
                    text: "",
                  },
                },
                fill: {
                  opacity: 1,
                },
              },
            };
            setstate(josnstate);
            setSessionStorage("stateSsnStrg", result.response.responseData.dashboard);
            if(pRefressh !== "yes") {
              getDistrictWiseData(1, userData && userData.LoginID ? userData.LoginID : 0, "BYDSCT", "");
            }
          } else {
            setstate({});
          }
        } else {
          setAlertMessage({
            type: "error",
            message: result.response.responseMessage,
          });
        }
      } else {
        const pCateogires = [];
        const pseriesOpen = { name: "", data: [] };
        const pseriesInProgress = { name: "", data: [] };
        const pseriesReOpen = { name: "", data: [] };
        const pseriesResolved = { name: "", data: [] };

        getSessionStorage("stateSsnStrg").forEach((v) => {
          pCateogires.push(v.Duration);
          pseriesOpen.name = "Open";
          pseriesOpen.data.push(v.Opens);

          pseriesInProgress.name = "In-Progess";
          pseriesInProgress.data.push(v.InProgress);

          pseriesReOpen.name = "Re-Open";
          pseriesReOpen.data.push(v.Reopen);

          pseriesResolved.name = "Resolved";
          pseriesResolved.data.push(v.Resolved);
        });

        const josnstate = {
          series: [pseriesOpen, pseriesInProgress, pseriesReOpen, pseriesResolved],
          options: {
            chart: {
              type: "bar",
              height: 350,
              stacked: true,
              toolbar: {
                export: {
                  csv: {
                    filename: "Daily Tickets Activity",
                  },
                  svg: {
                    filename: "Daily Tickets Activity",
                  },
                  png: {
                    filename: "Daily Tickets Activity",
                  },
                },
              },
              zoom: {
                enabled: true,
              },
            },
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: "100%",
                endingShape: "rounded",
              },
            },
            dataLabels: {
              enabled: false,
            },
            stroke: {
              show: true,
              width: 2,
              colors: ["transparent"],
            },
            xaxis: {
              categories: pCateogires,
            },
            yaxis: {
              title: {
                text: "",
              },
            },
            fill: {
              opacity: 1,
            },
          },
        };
        setstate(josnstate);
        if(pRefressh !== "yes") {
          getDistrictWiseData(1, userData && userData.LoginID ? userData.LoginID : 0, "BYDSCT", "");
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

  const [state3, setstate3] = useState({});
  const [isLoadingChartInsuranceCompanyData, setIsLoadingChartInsuranceCompanyData] = useState(false);
  const getChartInsuranceCompanyData = async (pfilterID, pLoginID, pMasterName, pRefressh) => {
    debugger;
    try {
      if (getSessionStorage("state3SsnStrg") === null || (getSessionStorage("state3SsnStrg") !== null && pRefressh === "yes")) {
        setIsLoadingChartInsuranceCompanyData(true);
        const formdata = {
          filterID: pfilterID,
          filterID1: 0,
          filterID2: "",
          userID: pLoginID,
          masterName: pMasterName,
          searchText: "#ALL",
          searchCriteria: "AW",
        };
        const result = await getDashBoardData(formdata);
        setIsLoadingChartInsuranceCompanyData(false);
        if (result.response.responseCode === 1) {
          if (result.response.responseData && result.response.responseData.dashboard && result.response.responseData.dashboard.length > 0) {
            const pcategories = [];
            const popenData = [];
            const pcloseData = [];
            result.response.responseData.dashboard.forEach((v) => {
              pcategories.push(v.InsuranceMasterName);
              popenData.push(v.openTicket);
              pcloseData.push(v.closeTicket);
            });
            const josnstate3 = {
              series: [
                {
                  name: "Open",
                  data: popenData,
                },
                {
                  name: "Resolved",
                  data: pcloseData,
                },
              ],
              options: {
                chart: {
                  type: "bar",
                  height: 430,
                  stacked: true,
                  toolbar: {
                    export: {
                      csv: {
                        filename: "Tickets by Insurance Companies",
                      },
                      svg: {
                        filename: "Tickets by Insurance Companies",
                      },
                      png: {
                        filename: "Tickets by Insurance Companies",
                      },
                    },
                  },
                },
                plotOptions: {
                  bar: {
                    horizontal: true,
                    dataLabels: {
                      position: "top",
                    },
                  },
                },
                dataLabels: {
                  enabled: true,
                  offsetX: -6,
                  style: {
                    fontSize: "11px",
                    colors: ["#fff"],
                  },
                },
                stroke: {
                  show: true,
                  width: -1,
                  colors: ["#fff"],
                },
                tooltip: {
                  shared: true,
                  intersect: false,
                },
                xaxis: {
                  categories: pcategories,
                },
              },
            };
            setstate3(josnstate3);
            setSessionStorage("state3SsnStrg", result.response.responseData.dashboard);
            if(pRefressh !== "yes") {
              getChartLastMonthData(2, userData && userData.LoginID ? userData.LoginID : 0, "BYDUR", "");
            }
          } else {
            setstate3({});
          }
        } else {
          setAlertMessage({
            type: "error",
            message: result.response.responseMessage,
          });
        }
      } else {
        const pcategories = [];
        const popenData = [];
        const pcloseData = [];
        getSessionStorage("state3SsnStrg").forEach((v) => {
          pcategories.push(v.InsuranceMasterName);
          popenData.push(v.openTicket);
          pcloseData.push(v.closeTicket);
        });
        const josnstate3 = {
          series: [
            {
              name: "Open",
              data: popenData,
            },
            {
              name: "Resolved",
              data: pcloseData,
            },
          ],
          options: {
            chart: {
              type: "bar",
              height: 430,
              stacked: true,
              toolbar: {
                export: {
                  csv: {
                    filename: "Tickets by Insurance Companies",
                  },
                  svg: {
                    filename: "Tickets by Insurance Companies",
                  },
                  png: {
                    filename: "Tickets by Insurance Companies",
                  },
                },
              },
            },
            plotOptions: {
              bar: {
                horizontal: true,
                dataLabels: {
                  position: "top",
                },
              },
            },
            dataLabels: {
              enabled: true,
              offsetX: -6,
              style: {
                fontSize: "11px",
                colors: ["#fff"],
              },
            },
            stroke: {
              show: true,
              width: -1,
              colors: ["#fff"],
            },
            tooltip: {
              shared: true,
              intersect: false,
            },
            xaxis: {
              categories: pcategories,
            },
          },
        };
        setstate3(josnstate3);
        if(pRefressh !== "yes") {
          getChartLastMonthData(2, userData && userData.LoginID ? userData.LoginID : 0, "BYDUR", "");
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
  const [isLoadingChartCategoryWiseData, setIsLoadingChartCategoryWiseData] = useState(false);
  const getChartCategoryWiseData = async (pfilterID, pLoginID, pMasterName, pRefressh) => {
    try {
      if (getSessionStorage("state4SsnStrg") === null || (getSessionStorage("state4SsnStrg") !== null && pRefressh === "yes")) {
        setIsLoadingChartCategoryWiseData(true);
        const formdata = {
          filterID: pfilterID,
          filterID1: 0,
          filterID2: "",
          userID: pLoginID,
          masterName: pMasterName,
          searchText: "#ALL",
          searchCriteria: "AW",
        };
        const result = await getDashBoardData(formdata);
        setIsLoadingChartCategoryWiseData(false);
        if (result.response.responseCode === 1) {
          if (result.response.responseData && result.response.responseData.dashboard && result.response.responseData.dashboard.length > 0) {
            const pCategoryWise = [];
            const pcategories = [];
            result.response.responseData.dashboard.forEach((v) => {
              pcategories.push(v.SupportTicketTypeName);
              pCategoryWise.push(v.CategoryWise);
            });
            const jsonstate4 = {
              series: pCategoryWise,
              options: {
                chart: {
                  type: "pie",
                  toolbar: {
                    export: {
                      csv: {
                        filename: "Ticket Category Wise(Grievence)",
                      },
                      svg: {
                        filename: "Ticket Category Wise(Grievence)",
                      },
                      png: {
                        filename: "Ticket Category Wise(Grievence)",
                      },
                    },
                  },
                },
                labels: pcategories,
                stroke: {
                  colors: ["#fff"],
                },
                fill: {
                  opacity: 0.8,
                },
                responsive: [
                  {
                    breakpoint: 480,
                    options: {
                      chart: {
                        width: 200,
                      },
                      legend: {
                        position: "bottom",
                      },
                    },
                  },
                ],
              },
            };
            setstate4(jsonstate4);
            setSessionStorage("state4SsnStrg", result.response.responseData.dashboard);
            if (pRefressh !== "yes") {
               getChartCategoryLossIntimationWiseData(2, userData && userData.LoginID ? userData.LoginID : 0, "BYCLCTZ", "");
            }
          } else {
            setstate4({});
          }
        } else {
          setAlertMessage({
            type: "error",
            message: result.response.responseMessage,
          });
        }
      } else {
        const pCategoryWise = [];
        const pcategories = [];
        getSessionStorage("state4SsnStrg").forEach((v) => {
          pcategories.push(v.SupportTicketTypeName);
          pCategoryWise.push(v.CategoryWise);
        });
        const jsonstate4 = {
          series: pCategoryWise,
          options: {
            chart: {
              type: "pie",
              toolbar: {
                export: {
                  csv: {
                    filename: "Ticket Category Wise(Grievence)",
                  },
                  svg: {
                    filename: "Ticket Category Wise(Grievence)",
                  },
                  png: {
                    filename: "Ticket Category Wise(Grievence)",
                  },
                },
              },
            },
            labels: pcategories,
            stroke: {
              colors: ["#fff"],
            },
            fill: {
              opacity: 0.8,
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200,
                  },
                  legend: {
                    position: "bottom",
                  },
                },
              },
            ],
          },
        };
        setstate4(jsonstate4);
        if (pRefressh !== "yes") {
          getChartCategoryLossIntimationWiseData(2, userData && userData.LoginID ? userData.LoginID : 0, "BYCLCTZ", "");
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

  const [satatusCount, setSatatusCount] = useState({});
  const [isLoadingChartSatatusCountData, setIsLoadingChartSatatusCountData] = useState(false);
  const [totalSatatusCount, settotalSatatusCount] = useState();
  const [satatusCountGrvnce, setSatatusCountGrvnce] = useState({});
  const [totalSatatusCountGrvnce, settotalSatatusCountGrvnce] = useState();
  const [satatusCountCrpLos, setSatatusCountCrpLos] = useState({});
  const [totalSatatusCountCrpLos, settotalSatatusCountCrpLos] = useState();
  const [satatusCountInfomn, setSatatusCountInfomn] = useState({});
  const getChartSatatusCountData = async (pfilterID, pLoginID, pMasterName, pRefressh) => {
    debugger;
    try {
      if (getSessionStorage("satatusCountSsnStrg") === null || (getSessionStorage("satatusCountSsnStrg") !== null && pRefressh === "yes")) {
        setIsLoadingChartSatatusCountData(true);
        const formdata = {
          filterID: pfilterID,
          filterID1: 0,
          filterID2: "",
          userID: pLoginID,
          masterName: pMasterName,
          searchText: "#ALL",
          searchCriteria: "AW",
        };
        const result = await getDashBoardData(formdata);

        setIsLoadingChartSatatusCountData(false);
        if (result.response.responseCode === 1) {
          if (result.response.responseData && result.response.responseData.dashboard) {
            setSatatusCountGrvnce(result.response.responseData.dashboard.Grievence);
            setSatatusCountCrpLos(result.response.responseData.dashboard.Crop);
            setSatatusCountInfomn(result.response.responseData.dashboard.Information);
            let totalStsCntGrvnce = 0;
            let totalStsCntCrpLos = 0;
            const jsonStatusCntGrvnce = { Open: "0", InProgress: "0", Resolved: "0", ReOpen: "0" };
            const jsonStatusCntCrpLos = { Open: "0", InProgress: "0", Resolved: "0", ReOpen: "0" };
            const jsonStatusCntInfomn = { ResolvedInformation: "0" };

            result.response.responseData.dashboard.Grievence.forEach((v) => {
              if (v.TicketStatus === "Open") {
                jsonStatusCntGrvnce.Open = v.Total;
              }
              if (v.TicketStatus === "In-Progress") {
                jsonStatusCntGrvnce.InProgress = v.Total;
              }
              if (v.TicketStatus === "Re-Open") {
                jsonStatusCntGrvnce.ReOpen = v.Total;
              }
              if (v.TicketStatus === "Resolved") {
                jsonStatusCntGrvnce.Resolved = v.Total;
              }
              totalStsCntGrvnce += Number(v.Total);
            });
            settotalSatatusCountGrvnce(totalStsCntGrvnce);
            setSatatusCountGrvnce([jsonStatusCntGrvnce]);

            result.response.responseData.dashboard.Crop.forEach((v) => {
              if (v.TicketStatus === "Open") {
                jsonStatusCntCrpLos.Open = v.Total;
              }
              if (v.TicketStatus === "In-Progress") {
                jsonStatusCntCrpLos.InProgress = v.Total;
              }
              if (v.TicketStatus === "Re-Open") {
                jsonStatusCntCrpLos.ReOpen = v.Total;
              }
              if (v.TicketStatus === "Resolved") {
                jsonStatusCntCrpLos.Resolved = v.Total;
              }
              totalStsCntCrpLos += Number(v.Total);
            });
            settotalSatatusCountCrpLos(totalStsCntCrpLos);
            setSatatusCountCrpLos([jsonStatusCntCrpLos]);

            result.response.responseData.dashboard.Information.forEach((v) => {
              if (v.TicketStatus === "Resolved(Information)") {
                jsonStatusCntInfomn.ResolvedInformation = v.Total;
              }
            });
            setSatatusCountInfomn([jsonStatusCntInfomn]);

            setSessionStorage("satatusCountSsnStrg", result.response.responseData);
            if (pRefressh !== "yes") {
              getChartTypeWiseData(2, userData && userData.LoginID ? userData.LoginID : 0, "BYHDR", "");
            }
          } else {
            setSatatusCountGrvnce([]);
            settotalSatatusCountGrvnce(0);
            setSatatusCountCrpLos([]);
            settotalSatatusCountCrpLos(0);
            setSatatusCountInfomn([]);
          }
        } else {
          setSatatusCountGrvnce([]);
          settotalSatatusCountGrvnce(0);
          setSatatusCountCrpLos([]);
          settotalSatatusCountCrpLos(0);
          setSatatusCountInfomn([]);
        }
      } else {
        const jsonStatusCntGrvnce = { Open: "0", InProgress: "0", Resolved: "0", ReOpen: "0" };
        const jsonStatusCntCrpLos = { Open: "0", InProgress: "0", Resolved: "0", ReOpen: "0" };
        const jsonStatusCntInfomn = { ResolvedInformation: "0" };
        let totalStsCntGrvnce = 0;
        let totalStsCntCrpLos = 0;
        const SessionDataStatusCount = getSessionStorage("satatusCountSsnStrg");
        SessionDataStatusCount.dashboard.Grievence.forEach((v) => {
          if (v.TicketStatus === "Open") {
            jsonStatusCntGrvnce.Open = v.Total;
          }
          if (v.TicketStatus === "In-Progress") {
            jsonStatusCntGrvnce.InProgress = v.Total;
          }
          if (v.TicketStatus === "Re-Open") {
            jsonStatusCntGrvnce.ReOpen = v.Total;
          }
          if (v.TicketStatus === "Resolved") {
            jsonStatusCntGrvnce.Resolved = v.Total;
          }
          totalStsCntGrvnce += Number(v.Total);
        });
        settotalSatatusCountGrvnce(totalStsCntGrvnce);
        setSatatusCountGrvnce([jsonStatusCntGrvnce]);

        SessionDataStatusCount.dashboard.Crop.forEach((v) => {
          if (v.TicketStatus === "Open") {
            jsonStatusCntCrpLos.Open = v.Total;
          }
          if (v.TicketStatus === "In-Progress") {
            jsonStatusCntCrpLos.InProgress = v.Total;
          }
          if (v.TicketStatus === "Re-Open") {
            jsonStatusCntCrpLos.ReOpen = v.Total;
          }
          if (v.TicketStatus === "Resolved") {
            jsonStatusCntCrpLos.Resolved = v.Total;
          }
          totalStsCntCrpLos += Number(v.Total);
        });
        settotalSatatusCountCrpLos(totalStsCntCrpLos);
        setSatatusCountCrpLos([jsonStatusCntCrpLos]);

        SessionDataStatusCount.dashboard.Information.forEach((v) => {
          if (v.TicketStatus === "Resolved(Information)") {
            jsonStatusCntInfomn.ResolvedInformation = v.Total;
          }
        });
        setSatatusCountInfomn([jsonStatusCntInfomn]);
        if (pRefressh !== "yes") {
          getChartTypeWiseData(2, userData && userData.LoginID ? userData.LoginID : 0, "BYHDR", "");
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
  // A const getChartSatatusCountData = async (pfilterID, pLoginID, pMasterName, pRefressh) => {
  // A  try {
  // A    if (getSessionStorage("satatusCountSsnStrg") === null || (getSessionStorage("satatusCountSsnStrg") !== null && pRefressh === "yes")) {
  // A      setIsLoadingChartSatatusCountData(true);
  // A      const formdata = {
  // A        filterID: pfilterID,
  // A        filterID1: 0,
  // A        filterID2: "",
  // A        userID: pLoginID,
  // A        masterName: pMasterName,
  // A        searchText: "#ALL",
  // A       searchCriteria: "AW",
  // A      };
  // A      const result = await getDashBoardData(formdata);

  // A      setIsLoadingChartSatatusCountData(false);
  // A      if (result.response.responseCode === 1) {
  // A        if (result.response.responseData && result.response.responseData.dashboard && result.response.responseData.dashboard.length > 0) {
  // A          setSatatusCount(result.response.responseData.dashboard);
  // A          let totalStsCnt = 0;

  // A          const jsonStatusCnt = { Open: "0", InProgress: "0", Resolved: "0", ResolvedInformation: "0", ReOpen: "0" };

  // A          result.response.responseData.dashboard.forEach((v) => {
  // A            if (v.TicketStatus === "Open") {
  // A              jsonStatusCnt.Open = v.Total;
  // A            }
  // A            if (v.TicketStatus === "In-Progress") {
  // A              jsonStatusCnt.InProgress = v.Total;
  // A            }
  // A            if (v.TicketStatus === "Re-Open") {
  // A              jsonStatusCnt.ReOpen = v.Total;
  // A            }
  // A            if (v.TicketStatus === "Resolved") {
  // A              jsonStatusCnt.Resolved = v.Total;
  // A            }
  // A            if (v.TicketStatus === "Resolved(Information)") {
  // A              jsonStatusCnt.ResolvedInformation = v.Total;
  // A            }
  // A            totalStsCnt += Number(v.Total);
  // A          });
  // A          settotalSatatusCount(totalStsCnt);
  // A          setSatatusCount([jsonStatusCnt]);
  // A          setSessionStorage("satatusCountSsnStrg", result.response.responseData.dashboard);
  // A        } else {
  // A          setSatatusCount([]);
  // A          settotalSatatusCount(0);
  // A        }
  // A      } else {
  // A        setSatatusCount([]);
  // A        settotalSatatusCount(0);
  // A      }
  // A      if (pRefressh !== "yes") {
  // A        getChartCategoryWiseData(2, userData && userData.LoginID ? userData.LoginID : 0, "BYCTZ", "");
  // A      }
  // A    } else {
  // A      const jsonStatusCnt = { Open: "0", InProgress: "0", Resolved: "0", ResolvedInformation: "0", ReOpen: "0" };
  // A      let totalStsCnt = 0;
  // A      getSessionStorage("satatusCountSsnStrg").forEach((v) => {
  // A        if (v.TicketStatus === "Open") {
  // A          jsonStatusCnt.Open = v.Total;
  // A        }
  // A        if (v.TicketStatus === "In-Progress") {
  // A          jsonStatusCnt.InProgress = v.Total;
  // A        }
  // A        if (v.TicketStatus === "Re-Open") {
  // A          jsonStatusCnt.ReOpen = v.Total;
  // A        }
  // A        if (v.TicketStatus === "Resolved") {
  // A          jsonStatusCnt.Resolved = v.Total;
  // A        }
  // A        if (v.TicketStatus === "Resolved(Information)") {
  // A          jsonStatusCnt.ResolvedInformation = v.Total;
  // A        }
  // A        totalStsCnt += Number(v.Total);
  // A      });
  // A      settotalSatatusCount(totalStsCnt);
  // A      setSatatusCount([jsonStatusCnt]);
  // A      getChartCategoryWiseData(2, userData && userData.LoginID ? userData.LoginID : 0, "BYCTZ", "");
  // A    }
  // A  } catch (error) {
  // A    console.log(error);
  // A    setAlertMessage({
  // A      type: "error",
  // A      message: error,
  // A    });
  // A  }
  // A };
  const [state5, setstate5] = useState({});
  const [isLoadingChartCategoryLossIntimationWiseData, setIsLoadingChartCategoryLossIntimationWiseData] = useState(false);
  const getChartCategoryLossIntimationWiseData = async (pfilterID, pLoginID, pMasterName, pRefressh) => {
    try {
      if (getSessionStorage("state5SsnStrg") === null || (getSessionStorage("state5SsnStrg") !== null && pRefressh === "yes")) {
        setIsLoadingChartCategoryLossIntimationWiseData(true);
        const formdata = {
          filterID: pfilterID,
          filterID1: 0,
          filterID2: "",
          userID: pLoginID,
          masterName: pMasterName,
          searchText: "#ALL",
          searchCriteria: "AW",
        };
        const result = await getDashBoardData(formdata);
        setIsLoadingChartCategoryLossIntimationWiseData(false);
        if (result.response.responseCode === 1) {
          if (result.response.responseData && result.response.responseData.dashboard && result.response.responseData.dashboard.length > 0) {
            const pCategoryWise = [];
            const pcategories = [];
            result.response.responseData.dashboard.forEach((v) => {
              pcategories.push(v.TicketCategoryName);
              pCategoryWise.push(v.Total);
            });
            const jsonstate5 = {
              series: pCategoryWise,
              options: {
                chart: {
                  type: "pie",
                  toolbar: {
                    export: {
                      csv: {
                        filename: "Ticket Category Wise(Loss Intimation)",
                      },
                      svg: {
                        filename: "Ticket Category Wise(Loss Intimation)",
                      },
                      png: {
                        filename: "Ticket Category Wise(Loss Intimation)",
                      },
                    },
                  },
                },
                labels: pcategories,
                stroke: {
                  colors: ["#fff"],
                },
                fill: {
                  opacity: 0.8,
                },
                responsive: [
                  {
                    breakpoint: 480,
                    options: {
                      chart: {
                        width: 200,
                      },
                      legend: {
                        position: "bottom",
                      },
                    },
                  },
                ],
              },
            };
            setstate5(jsonstate5);
            setSessionStorage("state5SsnStrg", result.response.responseData.dashboard);
            if(pRefressh !== "yes") {
              getChartInsuranceCompanyData(1, userData && userData.LoginID ? userData.LoginID : 0, "BYINS", "");
            }     
          } else {
            setstate5({});
          }
        } else {
          setAlertMessage({
            type: "error",
            message: result.response.responseMessage,
          });
        }
      } else {
        const pCategoryWise = [];
        const pcategories = [];
        getSessionStorage("state5SsnStrg").forEach((v) => {
          pcategories.push(v.TicketCategoryName);
          pCategoryWise.push(v.Total);
        });
        const jsonstate5 = {
          series: pCategoryWise,
          options: {
            chart: {
              type: "pie",
              toolbar: {
                export: {
                  csv: {
                    filename: "Ticket Category Wise(Loss Intimation)",
                  },
                  svg: {
                    filename: "Ticket Category Wise(Loss Intimation)",
                  },
                  png: {
                    filename: "Ticket Category Wise(Loss Intimation)",
                  },
                },
              },
            },
            labels: pcategories,
            stroke: {
              colors: ["#fff"],
            },
            fill: {
              opacity: 0.8,
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200,
                  },
                  legend: {
                    position: "bottom",
                  },
                },
              },
            ],
          },
        };
        setstate5(jsonstate5);
        if(pRefressh !== "yes") {
          getChartInsuranceCompanyData(1, userData && userData.LoginID ? userData.LoginID : 0, "BYINS", "");
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
  const [state6, setstate6] = useState({});
  const [isLoadingChartTypeWiseData, setIsLoadingChartChartTypeWiseData] = useState(false);
  const getChartTypeWiseData = async (pfilterID, pLoginID, pMasterName, pRefressh) => {
    try {
      if (getSessionStorage("state6SsnStrg") === null || (getSessionStorage("state6SsnStrg") !== null && pRefressh === "yes")) {
        setIsLoadingChartChartTypeWiseData(true);
        const formdata = {
          filterID: pfilterID,
          filterID1: 0,
          filterID2: "",
          userID: pLoginID,
          masterName: pMasterName,
          searchText: "#ALL",
          searchCriteria: "AW",
        };
        const result = await getDashBoardData(formdata);
        setIsLoadingChartChartTypeWiseData(false);
        if (result.response.responseCode === 1) {
          if (result.response.responseData && result.response.responseData.dashboard && result.response.responseData.dashboard.length > 0) {
            const pCategoryWise = [];
            const pcategories = [];
            result.response.responseData.dashboard.forEach((v) => {
              pcategories.push(v.TicketHeadName);
              pCategoryWise.push(v.Total);
            });
            const jsonstate6 = {
              series: pCategoryWise,
              options: {
                chart: {
                  type: "pie",
                  toolbar: {
                    export: {
                      csv: {
                        filename: "Ticket Type",
                      },
                      svg: {
                        filename: "Ticket Type",
                      },
                      png: {
                        filename: "Ticket Type",
                      },
                    },
                  },
                },
                labels: pcategories,
                stroke: {
                  colors: ["#fff"],
                },
                fill: {
                  opacity: 0.8,
                },
                responsive: [
                  {
                    breakpoint: 480,
                    options: {
                      chart: {
                        width: 200,
                      },
                      legend: {
                        position: "bottom",
                      },
                    },
                  },
                ],
              },
            };
            setstate6(jsonstate6);
            setSessionStorage("state6SsnStrg", result.response.responseData.dashboard);
            if (pRefressh !== "yes") {
              getChartCategoryWiseData(2, userData && userData.LoginID ? userData.LoginID : 0, "BYCTZ", "");
            }
          } else {
            setstate6({});
          }
        } else {
          setAlertMessage({
            type: "error",
            message: result.response.responseMessage,
          });
        }
      } else {
        const pCategoryWise = [];
        const pcategories = [];
        getSessionStorage("state6SsnStrg").forEach((v) => {
          pcategories.push(v.TicketHeadName);
          pCategoryWise.push(v.Total);
        });
        const jsonstate6 = {
          series: pCategoryWise,
          options: {
            chart: {
              type: "pie",
              toolbar: {
                export: {
                  csv: {
                    filename: "Ticket Type",
                  },
                  svg: {
                    filename: "Ticket Type",
                  },
                  png: {
                    filename: "Ticket Type",
                  },
                },
              },
            },
            labels: pcategories,
            stroke: {
              colors: ["#fff"],
            },
            fill: {
              opacity: 0.8,
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200,
                  },
                  legend: {
                    position: "bottom",
                  },
                },
              },
            ],
          },
        };
        setstate6(jsonstate6);
        if (pRefressh !== "yes") {
          getChartCategoryWiseData(2, userData && userData.LoginID ? userData.LoginID : 0, "BYCTZ", "");
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

  const [state7, setstate7] = useState({});
  const [isLoadingDistrictWiseData, setIsLoadingDistrictWiseData] = useState(false);
  const getDistrictWiseData = async (pfilterID, pLoginID, pMasterName, pRefressh) => {
    debugger;
    try {
      if (getSessionStorage("state7SsnStrg") === null || (getSessionStorage("state7SsnStrg") !== null && pRefressh === "yes")) {
        setIsLoadingDistrictWiseData(true);
        const formdata = {
          filterID: pfilterID,
          filterID1: 0,
          filterID2: "",
          userID: pLoginID,
          masterName: pMasterName,
          searchText: "#ALL",
          searchCriteria: "AW",
        };
        const result = await getDashBoardData(formdata);
        setIsLoadingDistrictWiseData(false);
        if (result.response.responseCode === 1) {
          if (result.response.responseData && result.response.responseData.dashboard && result.response.responseData.dashboard.length > 0) {
            const pCateogires = [];
            const pseriesTop = { name: "", data: [] };
            const pseriesLast = { name: "", data: [] };

            result.response.responseData.dashboard.forEach((v) => {
              pCateogires.push(v.DistrictMasterName);
              pseriesTop.name = "Top";
              if (v.LEVEL === "TOP") {
                pseriesTop.data.push(v.Total);
              } else {
                pseriesTop.data.push(0);
              }
              if (v.LEVEL === "LAST") {
                pseriesLast.data.push(v.Total);
              } else {
                pseriesLast.data.push(0);
              }
              pseriesLast.name = "Bottom";
            });

            const josnstate7 = {
              series: [pseriesTop, pseriesLast],
              options: {
                chart: {
                  type: "bar",
                  height: 350,
                  stacked: true,
                  toolbar: {
                    export: {
                      csv: {
                        filename: "Tickets By District",
                      },
                      svg: {
                        filename: "Tickets By District",
                      },
                      png: {
                        filename: "Tickets By District",
                      },
                    },
                  },
                  zoom: {
                    enabled: true,
                  },
                },
                plotOptions: {
                  bar: {
                    horizontal: false,
                    columnWidth: "100%",
                    endingShape: "rounded",
                  },
                },
                dataLabels: {
                  enabled: false,
                },
                stroke: {
                  show: true,
                  width: 2,
                  colors: ["transparent"],
                },
                xaxis: {
                  categories: pCateogires,
                },
                yaxis: {
                  title: {
                    text: "",
                  },
                },
                fill: {
                  opacity: 1,
                },
              },
            };
            setstate7(josnstate7);
            setSessionStorage("state7SsnStrg", result.response.responseData.dashboard);
          } else {
            setstate7({});
          }
        } else {
          setAlertMessage({
            type: "error",
            message: result.response.responseMessage,
          });
        }
      } else {
        const pCateogires = [];
        const pseriesTop = { name: "", data: [] };
        const pseriesLast = { name: "", data: [] };
        getSessionStorage("state7SsnStrg").forEach((v) => {
          pCateogires.push(v.DistrictMasterName);
          pseriesTop.name = "Top";
          if (v.LEVEL === "TOP") {
            pseriesTop.data.push(v.Total);
          } else {
            pseriesTop.data.push(0);
          }
          if (v.LEVEL === "LAST") {
            pseriesLast.data.push(v.Total);
          } else {
            pseriesLast.data.push(0);
          }
          pseriesLast.name = "Bottom";
        });
        const josnstate7 = {
          series: [pseriesTop, pseriesLast],
          options: {
            chart: {
              type: "bar",
              height: 350,
              stacked: true,
              toolbar: {
                export: {
                  csv: {
                    filename: "Tickets By District",
                  },
                  svg: {
                    filename: "Tickets By District",
                  },
                  png: {
                    filename: "Tickets By District",
                  },
                },
              },
              zoom: {
                enabled: true,
              },
            },
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: "100%",
                endingShape: "rounded",
              },
            },
            dataLabels: {
              enabled: false,
            },
            stroke: {
              show: true,
              width: 2,
              colors: ["transparent"],
            },
            xaxis: {
              categories: pCateogires,
            },
            yaxis: {
              title: {
                text: "",
              },
            },
            fill: {
              opacity: 1,
            },
          },
        };
        setstate7(josnstate7);
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
    if (userData) {
      if (userData.BRHeadTypeID !== 124004 && userData.BRHeadTypeID !== 124005) {
        if (userData.FirstTimeLogin === "Y") {
          toggleResetPasswordModal();
        }
      }
    }
    setIsLoadingPageData(true);
    const timeOutHandler = setTimeout(() => {
      setIsLoadingPageData(false);
    }, 1000);
    getChartSatatusCountData(1, userData && userData.LoginID ? userData.LoginID : 0, "BYMAIN", "");
    // A getChartTypeWiseData(2, userData && userData.LoginID ? userData.LoginID : 0, "BYHDR", "");
    /// A getChartCategoryLossIntimationWiseData(2, userData && userData.LoginID ? userData.LoginID : 0, "BYCLCTZ", "");
    // A getDistrictWiseData(1, userData && userData.LoginID ? userData.LoginID : 0, "BYDSCT", "");
    // Neha getChartCategoryWiseData(2, userData && userData.LoginID ? userData.LoginID : 0, "BYCTZ");
    // Neha getChartInsuranceCompanyData(1, userData && userData.LoginID ? userData.LoginID : 0, "BYINS");
    // Neha getChartDailyTicketsActivityData(1, userData && userData.LoginID ? userData.LoginID : 0, "BYSTS");
    // Neha getChartLastMonthData(2, userData && userData.LoginID ? userData.LoginID : 0, "BYDUR");
    return () => clearTimeout(timeOutHandler);
  }, []);

  const handleRefreshTicketType = () => {
    debugger;
    getChartTypeWiseData(2, userData && userData.LoginID ? userData.LoginID : 0, "BYHDR", "yes");
  };

  const handleRefreshTicketCategoryWiseG = () => {
    getChartCategoryWiseData(2, userData && userData.LoginID ? userData.LoginID : 0, "BYCTZ", "yes");
  };

  const handleRefreshTicketCategoryWiseL = () => {
    getChartCategoryLossIntimationWiseData(2, userData && userData.LoginID ? userData.LoginID : 0, "BYCLCTZ", "yes");
  };

  const handleRefreshTicketByInsuranceComp = () => {
    getChartInsuranceCompanyData(1, userData && userData.LoginID ? userData.LoginID : 0, "BYINS", "yes");
  };

  const handleRefreshTicketOpenAndResolved = () => {
    getChartLastMonthData(2, userData && userData.LoginID ? userData.LoginID : 0, "BYDUR", "yes");
  };

  const handleRefreshDailyTicketsActivity = () => {
    getChartDailyTicketsActivityData(1, userData && userData.LoginID ? userData.LoginID : 0, "BYSTS", "yes");
  };

  const handleRefresDistrictWiseData = () => {
    getDistrictWiseData(1, userData && userData.LoginID ? userData.LoginID : 0, "BYDSCT", "yes");
  };
  const handleRefreshChartSatatusCount = () => {
    getChartSatatusCountData(1, userData && userData.LoginID ? userData.LoginID : 0, "BYMAIN", "yes");
  };

  return {
    isLoadingChartTypeWiseData,
    isLoadingChartCategoryLossIntimationWiseData,
    isLoadingChartCategoryWiseData,
    isLoadingChartInsuranceCompanyData,
    state6,
    state5,
    state,
    state2,
    state3,
    state4,
    isLoadingChartDailyTicketsActivityData,
    isLoadingChartLastMonthData,
    satatusCount,
    isLoadingChartSatatusCountData,
    isLoadingPageData,
    totalSatatusCount,
    resetPasswordModal,
    toggleResetPasswordModal,
    selectedUserData,
    handleRefreshTicketType,
    handleRefreshTicketCategoryWiseG,
    handleRefreshTicketCategoryWiseL,
    handleRefreshTicketByInsuranceComp,
    handleRefreshTicketOpenAndResolved,
    handleRefreshDailyTicketsActivity,
    state7,
    isLoadingDistrictWiseData,
    handleRefresDistrictWiseData,
    handleRefreshChartSatatusCount,
    satatusCountGrvnce,
    totalSatatusCountGrvnce,
    satatusCountCrpLos,
    totalSatatusCountCrpLos,
    satatusCountInfomn,
  };
}

export default HomeLogics;
