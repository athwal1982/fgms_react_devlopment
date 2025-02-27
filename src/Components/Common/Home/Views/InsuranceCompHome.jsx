import React from "react";
import Chart from "react-apexcharts";
import { Loader } from "Framework/Components/Widgets";
import { FaSync } from "react-icons/fa";
import { numberWithCommas } from "Configration/Utilities/utils";
import BizClass from "./Home.module.scss";
import InsuranceCompLogics from "../Logic/InsuranceCompLogic";

function InsuranceCompHome() {
  const {
    // Anil state3InsuranceComp,
    state6,
    state5,
    state4InsuranceComp,
    state2InsuranceComp,
    stateInsuranceComp,
    satatusCountInsuranceComp,
    isLoadingPageDataInsuranceComp,
    totalSatatusCountInsuranceComp,
    handleRefreshTicketType,
    handleRefreshTicketCategoryWiseG,
    handleRefreshTicketCategoryWiseL,
    handleRefreshTicketOpenAndResolved,
    handleRefreshDailyTicketsActivity,
    isLoadingChartTypeWiseData,
    isLoadingChartCategoryLossIntimationWiseData,
    isLoadingChartCategoryWiseData,
    isLoadingChartDailyTicketsActivityData,
    isLoadingChartLastMonthData,
    state7,
    isLoadingDistrictWiseData,
    handleRefresDistrictWiseData,
    handleRefreshChartSatatusCount,
    satatusCountGrvnce,
    totalSatatusCountGrvnce,
    satatusCountCrpLos,
    totalSatatusCountCrpLos,
    satatusCountInfomn,
  } = InsuranceCompLogics();

  return (
    <>
      <div className={BizClass.Box}>
        {isLoadingPageDataInsuranceComp ? <Loader /> : null}
        {/* <div className={BizClass.SummaryBoard}>
        <div className={BizClass.ScoreBoard}>
          <span>Open</span>
          <span>{satatusCountInsuranceComp && satatusCountInsuranceComp.length > 0 ? satatusCountInsuranceComp[0].Open : 0}</span>
        </div>
        <div className={BizClass.ScoreBoard}>
          <span>In-Progress</span>
          <span>{satatusCountInsuranceComp && satatusCountInsuranceComp.length > 0 ? satatusCountInsuranceComp[0].InProgress : 0}</span>
        </div>
        <div className={BizClass.ScoreBoard}>
          <span>Resolved</span>
          <span>{satatusCountInsuranceComp && satatusCountInsuranceComp.length > 0 ? satatusCountInsuranceComp[0].Resolved : 0}</span>
        </div>
        <div className={BizClass.ScoreBoard}>
          <span>Resolved(Information)</span>
          <span>{satatusCountInsuranceComp && satatusCountInsuranceComp.length > 0 ? satatusCountInsuranceComp[0].ResolvedInformation : 0}</span>
        </div>
        <div className={BizClass.ScoreBoard}>
          <span>Re-Open</span>
          <span>{satatusCountInsuranceComp && satatusCountInsuranceComp.length > 0 ? satatusCountInsuranceComp[0].ReOpen : 0}</span>
        </div>
        <div className={BizClass.ScoreBoard}>
          <span>Total</span>
          <span>{totalSatatusCountInsuranceComp}</span>
        </div>
      </div> */}
        <div className={BizClass.refreshIconDiv}>
          <FaSync onClick={() => handleRefreshChartSatatusCount()} className={BizClass.refreshIcon} />
        </div>
        <div className={BizClass.SummaryBoardTicketTypeGrievence}>
          <h6>Grievance Ticket</h6>
          <div className={BizClass.SummaryBoard}>
            <div className={BizClass.ScoreBoard}>
              <span>Open</span>
              <span>{satatusCountGrvnce && satatusCountGrvnce.length > 0 ? numberWithCommas(Number(satatusCountGrvnce[0].Open)) : 0}</span>
            </div>
            <div className={BizClass.ScoreBoard}>
              <span>In-Progress</span>
              <span>{satatusCountGrvnce && satatusCountGrvnce.length > 0 ? numberWithCommas(Number(satatusCountGrvnce[0].InProgress)) : 0}</span>
            </div>
            <div className={BizClass.ScoreBoard}>
              <span>Resolved</span>
              <span>{satatusCountGrvnce && satatusCountGrvnce.length > 0 ? numberWithCommas(Number(satatusCountGrvnce[0].Resolved)) : 0}</span>
            </div>
            <div className={BizClass.ScoreBoard}>
              <span>Re-Open</span>
              <span>{satatusCountGrvnce && satatusCountGrvnce.length > 0 ? numberWithCommas(Number(satatusCountGrvnce[0].ReOpen)) : 0}</span>
            </div>
            <div className={BizClass.ScoreBoard}>
              <span>Total</span>
              <span>{totalSatatusCountGrvnce ? numberWithCommas(Number(totalSatatusCountGrvnce)) : 0}</span>
            </div>
          </div>
        </div>
        <div className={BizClass.SummaryBoardTicketTypeCropLoss}>
          <h6>Crop Loss Intimations</h6>
          <div className={BizClass.SummaryBoard}>
            <div className={BizClass.ScoreBoard}>
              <span>Open</span>
              <span>{satatusCountCrpLos && satatusCountCrpLos.length > 0 ? numberWithCommas(Number(satatusCountCrpLos[0].Open)) : 0}</span>
            </div>
            <div className={BizClass.ScoreBoard}>
              <span>In-Progress</span>
              <span>{satatusCountCrpLos && satatusCountCrpLos.length > 0 ? numberWithCommas(Number(satatusCountCrpLos[0].InProgress)) : 0}</span>
            </div>
            <div className={BizClass.ScoreBoard}>
              <span>Resolved</span>
              <span>{satatusCountCrpLos && satatusCountCrpLos.length > 0 ? numberWithCommas(Number(satatusCountCrpLos[0].Resolved)) : 0}</span>
            </div>
            <div className={BizClass.ScoreBoard}>
              <span>Re-Open</span>
              <span>{satatusCountCrpLos && satatusCountCrpLos.length > 0 ? numberWithCommas(Number(satatusCountCrpLos[0].ReOpen)) : 0}</span>
            </div>
            <div className={BizClass.ScoreBoard}>
              <span>Total</span>
              <span>{totalSatatusCountCrpLos ? numberWithCommas(Number(totalSatatusCountCrpLos)) : 0}</span>
            </div>
          </div>
        </div>
        <div className={BizClass.SummaryBoardTicketTypeInformation}>
          <h6>Information</h6>
          <div className={BizClass.SummaryBoard}>
            <div className={BizClass.ScoreBoard}>
              <span>Resolved</span>
              <span>{satatusCountInfomn && satatusCountInfomn.length > 0 ? numberWithCommas(Number(satatusCountInfomn[0].ResolvedInformation)) : 0}</span>
            </div>
          </div>
        </div>
        <div className={BizClass.PieCharBox}>
          <div className={BizClass.PieChart}>
            {isLoadingChartTypeWiseData ? <Loader /> : null}
            <div className={BizClass.PieChartHeadBox}>
              <h4>
                Ticket Type <FaSync onClick={() => handleRefreshTicketType()} className={BizClass.refreshIcon} />
              </h4>
            </div>
            {Object.keys(state6).length === 0 ? null : <Chart options={state6.options} series={state6.series} type="pie" height={420} />}
          </div>
          <div className={BizClass.PieChart}>
            {isLoadingChartCategoryWiseData ? <Loader /> : null}
            <div className={BizClass.PieChartHeadBox}>
              <h4>
                Ticket Category Wise(Grievence) <FaSync onClick={() => handleRefreshTicketCategoryWiseG()} className={BizClass.refreshIcon} />
              </h4>
            </div>
            {Object.keys(state4InsuranceComp).length === 0 ? null : (
              <Chart options={state4InsuranceComp.options} series={state4InsuranceComp.series} type="pie" height={300} />
            )}
          </div>
          <div className={BizClass.PieChart}>
            {isLoadingChartCategoryLossIntimationWiseData ? <Loader /> : null}
            <div className={BizClass.PieChartHeadBox}>
              <h4>
                Ticket Category Wise(Loss Intimation) <FaSync onClick={() => handleRefreshTicketCategoryWiseL()} className={BizClass.refreshIcon} />
              </h4>
            </div>
            {Object.keys(state5).length === 0 ? null : <Chart options={state5.options} series={state5.series} type="pie" height={420} />}
          </div>
        </div>
        <div className={BizClass.ChartBox}>
          {/* <div className={BizClass.Chart}>
          <div className={BizClass.ChartHeadBox} style={{ display: "none" }}>
            <h4>Tickets by Insurance Companies</h4>
            <ul>
              <li className={BizClass.active}>Chart</li>
            </ul>
          </div>
          {Object.keys(state3InsuranceComp).length === 0 ? null : (
            <Chart options={state3InsuranceComp.options} series={state3InsuranceComp.series} type="bar" height={520} style={{ display: "none" }} />
          )}
        </div> */}
          <div className={BizClass.Chart}>
            {isLoadingChartLastMonthData ? <Loader /> : null}
            <div className={BizClass.ChartHeadBox}>
              <h4>
                Tickets Open & Resolved <FaSync onClick={() => handleRefreshTicketOpenAndResolved()} className={BizClass.refreshIcon} />
              </h4>
              <ul style={{ display: "none" }}>
                <li>Year</li>
                <li>Month</li>
                <li className={BizClass.active}>Week</li>
              </ul>
            </div>
            {Object.keys(state2InsuranceComp).length === 0 ? null : (
              <Chart options={state2InsuranceComp.options} series={state2InsuranceComp.series} type="line" height={260} />
            )}
          </div>
          <div className={BizClass.Chart}>
            {isLoadingChartDailyTicketsActivityData ? <Loader /> : null}
            <div className={BizClass.ChartHeadBox}>
              <h4>
                Daily Tickets Activity <FaSync onClick={() => handleRefreshDailyTicketsActivity()} className={BizClass.refreshIcon} />
              </h4>
              <ul style={{ display: "none" }}>
                <li>Year</li>
                <li>Month</li>
                <li className={BizClass.active}>Week</li>
              </ul>
            </div>
            {Object.keys(stateInsuranceComp).length === 0 ? null : (
              <Chart options={stateInsuranceComp.options} series={stateInsuranceComp.series} type="bar" height={260} />
            )}
          </div>
          <div className={BizClass.Chart}>
            {isLoadingDistrictWiseData ? <Loader /> : null}
            <div className={BizClass.ChartHeadBox}>
              <h4>
                Tickets By District <FaSync onClick={() => handleRefresDistrictWiseData()} className={BizClass.refreshIcon} />
              </h4>
              <ul style={{ display: "none" }}>
                <li>Year</li>
                <li>Month</li>
                <li className={BizClass.active}>Week</li>
              </ul>
            </div>
            {Object.keys(state7).length === 0 ? null : <Chart options={state7.options} series={state7.series} type="bar" height={260} />}
          </div>
        </div>
      </div>
    </>
  );
}

export default InsuranceCompHome;
