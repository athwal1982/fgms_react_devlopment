import React from "react";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "Components/Common/Welcome/Welcome";
import Login from "Components/Common/Login/login";
import HomePage from "Components/Common/Home/index";
import ManageTicketPage from "Components/Modules/Support/ManageTicket";
import ReplyOnMultipleTicketsPage from "Components/Modules/Support/ReplyOnMultipleTickets";
// Anil import MyTicketPage from "Components/Modules/Support/MyTicket";
import UserManagementPage from "Components/Modules/Setup/UserManagement";
import MenuManagementPage from "Components/Modules/Setup/MenuManagement";
import ProfileManagementPage from "Components/Modules/Setup/ProfileManagement";
import RegionalManagementPage from "Components/Modules/Setup/RegionalManagement";
import InsuranceCompanyManagementPage from "Components/Modules/Setup/InsuranceCompanyManagement";
import AccessRightsPage from "Components/Modules/Setup/AccessRights";
import MenuToUser from "Components/Modules/Setup/MenuToUser";
import Faq from "Components/Common/Faq/Faq";
import Notification from "Components/Common/Notification/Notification";
import Calculator from "Components/Common/Calculator/Calculator";
import GrievanceReportPage from "Components/Modules/Reports/Grievance";
import AgeingReportPage from "Components/Modules/Reports/Ageing";
import AgeingCropReportPage from "Components/Modules/Reports/AgeingCrop";
import TicketHistoryPage from "Components/Modules/Reports/TicketHistory";
import LossIntimationReportPage from "Components/Modules/Reports/LossIntimation";
import CropLossIntimationReportPage from "Components/Modules/Reports/CropLossIntimation";
import PremiumCalculatorReportPage from "Components/Modules/Reports/PremiumCalculator";
import IrdaiEscalationPage from "Components/Modules/Reports/IrdaiEscalation";
import CallLogUpload from "Components/Modules/Reports/CallLogUpload";
import CallLogData from "Components/Modules/Reports/CallLogData";
import ReOpenTickets from "Components/Modules/Reports/ReOpenTickets";
import TrainingReport from "Components/Modules/Reports/TrainingReport";
import SLAReport from "Components/Modules/Reports/SLAReport";
import FarmerCallingHistory from "Components/Modules/Reports/FarmerCallingHistory";
import CSCInboundVoice from "Components/Modules/Reports/CSCInboundVoice";
import DashboardTicketCount from "Components/Modules/Reports/DashboardTicketCount";
import FarmerEnquiryRegistration from "Components/Modules/FarmerEnquiryRegistration/FarmerEnquiryRegistration";
import FarmerEnquiryTickets from "Components/Modules/FarmerEnquiryRegistration/FarmerEnquiryTickets";
import SLADashboard from "Components/Common/SLADashboard/SLADashboard";
import TicketStatusHistory from "Components/Modules/Reports/TicketStatusHistory";
import TicketAssignmentPage from "Components/Modules/Support/TicketAssignment";
import OfflineIntimation from "Components/Modules/Support/OfflineIntimation/Views/OfflineIntimation";
import OfflineIntimationReport from "Components/Modules/Reports/OfflineIntimationReport/OfflineIntimationReport";
import TicketsByFarmerReportPage from "Components/Modules/Reports/TicketsByFarmer";
import StatewiseICTickets from "Components/Modules/Reports/StatewiseICTickets/";
import BillingDashboard from "Components/Common/BillingDashboard/BillingDashboard";
import KrphAllActivities from "Components/Common/KrphAllActivities/KrphAllActivities";
import KrphAllActivitiesND from "Components/Common/KrphAllActivitiesND/KrphAllActivitiesND";
import ImportantInstructions from "Components/Common/ImportantInstructions/ImportantInstructions";
import ServiceSuccess from "Components/Common/KrphAllActivities/ServiceSuccess";
import Page from "./Page/Page";
import PageAuthenticator from "./PageAuthenticator/PageAuthenticator";

function PageRouter() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<PageAuthenticator />} />

        <Route exact path="/login" element={<Login />} />
        <Route exact path="/ImportantInstructions" element={<ImportantInstructions />} />
        <Route exact path="/welcome" element={<Page component={<Welcome />} title="Home" />} />
        <Route exact path="/home" element={<Page component={<HomePage />} title="Dashboard" />} />
        <Route exact path="/KrphAllActivities" element={<KrphAllActivities />} />
        <Route exact path="/KrphAllActivitiesND" element={<KrphAllActivitiesND />} />
        <Route exact path="/ServiceSuccess" element={<ServiceSuccess />} />
        <Route exact path="/ManageTicket" element={<Page component={<ManageTicketPage />} title="Manage Ticket" />} />
        <Route exact path="/ReplyOnMultipleTikets" element={<Page component={<ReplyOnMultipleTicketsPage />} title="Reply On Multiple Tickets" />} />

        {/* <Route exact path="/MyTicket" element={<Page component={<MyTicketPage />} title="My Ticket" />} /> */}

        <Route exact path="/UserManagement" element={<Page component={<UserManagementPage />} title="User Management" />} />

        <Route exact path="/MenuManagement" element={<Page component={<MenuManagementPage />} title="Menu Management" />} />

        <Route exact path="/ProfileManagement" element={<Page component={<ProfileManagementPage />} title="Profile Management" />} />

        <Route exact path="/Regional Management" element={<Page component={<RegionalManagementPage />} title="Regional Office" />} />

        <Route
          exact
          path="/InsuranceCompanyManagement"
          element={<Page component={<InsuranceCompanyManagementPage />} title="Insurance Company Management" />}
        />

        <Route exact path="/AcessRights" element={<Page component={<AccessRightsPage />} title="Access Rights" />} />

        <Route exact path="/MenuToUserManagment" element={<Page component={<MenuToUser />} title="Menu To User" />} />

        <Route exact path="/Faq" element={<Page component={<Faq />} title="Faq" />} />

        <Route exact path="/Notification" element={<Page component={<Notification />} title="Notification" />} />

        <Route exact path="/Calculator" element={<Page component={<Calculator />} title="Calculator" />} />

        <Route exact path="/GrievanceReport" element={<Page component={<GrievanceReportPage />} title="Grievance Report" />} />
        <Route exact path="/LossIntimationReport" element={<Page component={<LossIntimationReportPage />} title="Loss Intimation Status Report" />} />
        <Route exact path="/CropLossIntimationReport" element={<Page component={<CropLossIntimationReportPage />} title="Loss Intimation Report" />} />
        <Route exact path="/TicketsByFarmerReport" element={<Page component={<TicketsByFarmerReportPage />} title="Tickets By Farmer" />} />

        <Route exact path="/AgeingReport" element={<Page component={<AgeingReportPage />} title="Ageing(Grievance) Report" />} />
        <Route exact path="/AgeingCropReport" element={<Page component={<AgeingCropReportPage />} title="Ageing(Crop) Report" />} />
        <Route exact path="/TicketHistory" element={<Page component={<TicketHistoryPage />} title="Ticket History" />} />
        <Route exact path="/PremiumCalculatorReport" element={<Page component={<PremiumCalculatorReportPage />} title="Premium Calculator" />} />
        <Route exact path="/IrdaiEscalation" element={<Page component={<IrdaiEscalationPage />} title="Irdai Escalation" />} />
        <Route exact path="/CallLogUpload" element={<Page component={<CallLogUpload />} title="Call Log Upload" />} />
        <Route exact path="/TrainingReport" element={<Page component={<TrainingReport />} title="Training Report" />} />
        <Route exact path="/SLAReport" element={<Page component={<SLAReport />} title="SLA Report" />} />
        <Route exact path="/CallLogData" element={<Page component={<CallLogData />} title="Call Log Data" />} />
        <Route exact path="/ReOpenTickets" element={<Page component={<ReOpenTickets />} title="Re Open Tickets" />} />
        <Route exact path="/FarmerCallingHistory" element={<Page component={<FarmerCallingHistory />} title="Farmer Calling History" />} />
        <Route exact path="/CSCInboundVoice" element={<Page component={<CSCInboundVoice />} title="BOT Inbound Calls" />} />
        <Route exact path="/DashboardTicketCount" element={<Page component={<DashboardTicketCount />} title="Dashboard Ticket Count" />} />
        <Route exact path="/FarmerEnquiryRegistration" element={<Page component={<FarmerEnquiryRegistration />} title="Unregistered Farmers" />} />
        <Route exact path="/FarmerEnquiryTickets" element={<Page component={<FarmerEnquiryTickets />} title="Unregistered Farmer Ticket" />} />
        <Route exact path="/SLADashboard" element={<Page component={<SLADashboard />} title="SLA Dashboard" />} />
        <Route exact path="/TicketStatusHistory" element={<Page component={<TicketStatusHistory />} title="Ticket Status History" />} />
        <Route exact path="/TicketAssignment" element={<Page component={<TicketAssignmentPage />} title="Ticket Assignment" />} />
        <Route exact path="/OfflineIntimation" element={<Page component={<OfflineIntimation />} title="Offline Intimation" />} />
        <Route exact path="/OfflineIntimationReport" element={<Page component={<OfflineIntimationReport />} title="Offline Intimation Report" />} />
        <Route exact path="/StatewiseICTickets" element={<Page component={<StatewiseICTickets />} title="Statewise IC Tickets" />} />
        <Route exact path="/BillingDashboard" element={<Page component={<BillingDashboard />} title="Billing Dashboard" />} />
      </Routes>
    </Router>
  );
}

export default PageRouter;
