import React from "react";
import Chart from "react-apexcharts";
import { Loader } from "Framework/Components/Widgets";
import BizClass from "./Home.module.scss";
import HomeLogics from "../Logic/Logic";
import MapChart from "./MapChart";
import { FaSync } from "react-icons/fa";
import { numberWithCommas } from "Configration/Utilities/utils";
import ResetPasswordModal from "../../../Modules/Setup/UserManagement/Views/Modals/ResetPasswordModal/ResetPasswordModal";

function Home() {
  const {
    state6,
    state5,
    state3,
    state4,
    state2,
    state,
    satatusCount,
    // A isLoadingPageData,
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
    isLoadingChartTypeWiseData,
    isLoadingChartCategoryLossIntimationWiseData,
    isLoadingChartCategoryWiseData,
    isLoadingChartInsuranceCompanyData,
    isLoadingChartDailyTicketsActivityData,
    isLoadingChartLastMonthData,
    state7,
    isLoadingDistrictWiseData,
    handleRefresDistrictWiseData,
    handleRefreshChartSatatusCount,
    isLoadingChartSatatusCountData,
    satatusCountGrvnce,
    totalSatatusCountGrvnce,
    satatusCountCrpLos,
    totalSatatusCountCrpLos,
    satatusCountInfomn,
  } = HomeLogics();
  return (
    <>
      {resetPasswordModal ? <ResetPasswordModal showfunc={toggleResetPasswordModal} selectedUserData={selectedUserData} /> : null}
      <div className={BizClass.Box}>
        {isLoadingChartSatatusCountData ? <Loader /> : null}
        {/* <div className={BizClass.refreshIconDiv}>
          <FaSync onClick={() => handleRefreshChartSatatusCount()} className={BizClass.refreshIcon} />
        </div>
        <div className={BizClass.SummaryBoard}>
          <div className={BizClass.ScoreBoard}>
            <span>Open</span>
            <span>{satatusCount && satatusCount.length > 0 ? satatusCount[0].Open : 0}</span>
          </div>
          <div className={BizClass.ScoreBoard}>
            <span>In-Progress</span>
            <span>{satatusCount && satatusCount.length > 0 ? satatusCount[0].InProgress : 0}</span>
          </div>
          <div className={BizClass.ScoreBoard}>
            <span>Resolved</span>
            <span>{satatusCount && satatusCount.length > 0 ? satatusCount[0].Resolved : 0}</span>
          </div>
          <div className={BizClass.ScoreBoard}>
            <span>Resolved(Information)</span>
            <span>{satatusCount && satatusCount.length > 0 ? satatusCount[0].ResolvedInformation : 0}</span>
          </div>
          <div className={BizClass.ScoreBoard}>
            <span>Re-Open</span>
            <span>{satatusCount && satatusCount.length > 0 ? satatusCount[0].ReOpen : 0}</span>
          </div>
          <div className={BizClass.ScoreBoard}>
            <span>Total</span>
            <span>{totalSatatusCount}</span>
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
            {Object.keys(state4).length === 0 ? null : <Chart options={state4.options} series={state4.series} type="pie" height={420} />}
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
          <div className={BizClass.Chart}>
            {isLoadingChartInsuranceCompanyData ? <Loader /> : null}
            <div className={BizClass.ChartHeadBox}>
              <h4>
                Tickets by Insurance Companies <FaSync onClick={() => handleRefreshTicketByInsuranceComp()} className={BizClass.refreshIcon} />
              </h4>
            </div>
            {Object.keys(state3).length === 0 ? null : <Chart options={state3.options} series={state3.series} type="bar" height={420} />}
          </div>
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
            {Object.keys(state2).length === 0 ? null : <Chart options={state2.options} series={state2.series} type="line" height={260} />}
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
            {Object.keys(state).length === 0 ? null : <Chart options={state.options} series={state.series} type="bar" height={260} />}
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
        <div className={BizClass.MapChartBox}>
          <div className={BizClass.MapChart} style={{ display: "none" }}>
            <div className={BizClass.MapChartHeadBox}>
              <h4>State Wise Tickets</h4>
            </div>
            <div>
              <MapChart />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
