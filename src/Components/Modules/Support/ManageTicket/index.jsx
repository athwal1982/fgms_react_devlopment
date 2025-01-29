import React, { useState } from "react";
// Anil import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
// Anil import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import ManageTicket from "./Views/ManageTicket";
import ManageTicketLogics from "./Logic/Logic";
// Anil import InsuranceCompManageTicket from "./Views/InsuranceCompManageTicket";
// Anil import InsuranceCompManageTicketLogics from "./Logic/InsuranceCompManageTicketLogic";
import AddTicket from "./Views/Modals/AddTicket/Views/AddTicket";
import MyTicketPage from "../MyTicket";

function ManageTicketPage() {
  const [openAddTicketModal, setOpenAddTicketModal] = useState(false);
  const [openMyTicketModal, setOpenMyTicketModal] = useState(false);
  const {
    isLoadingFarmersticket,
    ticketCategoryList,
    isLoadingTicketCategoryList,
    formValues,
    updateState,
    ticketCategoryTypeList,
    getFarmersTickets,
    farmersTicketData,
    isLoadingTicketCategoryTypeList,
    getTicketCategoryListData,
    getTicketCategoryTypeListData,
    refereshFarmerTicket,
    ClearTicketFilters,
    getTicketSourceListData,
    ticketSourceList,
    isLoadingTicketSourceList,
    ticketStatusList,
    isLoadingTicketStatusList,
    getTicketStatusListData,
    insuranceCompanyList,
    isLoadingInsuranceCompanyList,
    getInsuranceCompanyListData,
    stateList,
    isLoadingStateList,
    getStateListData,
    ticketSearchByMobile,
    updateFilterState,
    searchByMobileTicketsOnClick,
    getSchemeListData,
    schemeList,
    isLoadingSchemeListDropdownDataList,
    satatusCount,
    totalSatatusCount,
    filterValues,
    updateFarmersTickets,
    // A updateFarmersTicketsStatusCount,
    // A getFarmersTicketsWithOutLoader,
    onClickEscalation,
    esclatedCount,
    onGridReady,
    getOneDayTicketData,
    getFilterTicketsClick,
    showHideDownload,
    OpenReplyOnMultipleTiketsForm,
    totalPages,
    currentPage,
    handlePageChange,
    onClickViewManageTickets,
    showHideManageTicket,
    isLoadingDistrictList,
    districtList,
  } = ManageTicketLogics();

  // Anil const {
  // Anil  isLoadingFarmersticketInsuranceComp,
  // Anil  ticketCategoryListInsuranceComp,
  // Anil  isLoadingTicketCategoryListInsuranceComp,
  // Anil  formValuesInsuranceComp,
  // Anil  updateStateInsuranceComp,
  // Anil  ticketCategoryTypeListInsuranceComp,
  //  Anil  getFarmersTicketsInsuranceComp,
  //  Anil farmersTicketDataInsuranceComp,
  //  Anil  isLoadingTicketCategoryTypeListInsuranceComp,
  //  Anil getTicketCategoryListDataInsuranceComp,
  //  Anil getTicketCategoryTypeListDataInsuranceComp,
  //  Anil refereshFarmerTicketInsuranceComp,
  //  Anil ClearTicketFiltersTicketInsuranceComp,
  //  Anil getTicketSourceListDataInsuranceComp,
  //  Anil ticketSourceListInsuranceComp,
  //  Anil isLoadingTicketSourceListInsuranceComp,
  //  Anil ticketStatusListInsuranceComp,
  //  Anil isLoadingTicketStatusListInsuranceComp,
  //  Anil getTicketStatusListDataInsuranceComp,
  //  Anil regionalOfficeList,
  //  Anil isLoadingRegionalOfficeList,
  //  Anil getRegionalOfficeListData,
  //  Anil  stateInsuranceCompanyList,
  //  Anil isLoadingStateInsuranceCompanyList,
  //  Anil getSchemeListDataInsuranceComp,
  //  Anil  schemeListInsuranceComp,
  //  Anil isLoadingSchemeListInsuranceCompDropdownDataList,
  //  Anil satatusCountInsuranceComp,
  //  Anil totalSatatusCountInsuranceComp,
  //  Anil filterValuesInsuranceComp,
  //  Anil updateFilterStateInsuranceComp,
  //  Anil onClickEscalationInsuranceComp,
  //  Anil esclatedCountInsuranceComp,
  //  Anil searchByMobileTicketsInsuranceCompOnClick,
  //  Anil } = InsuranceCompManageTicketLogics();

  // Anil const setAlertMessage = AlertMessage();
  // Anil const user = getSessionStorage("user");
  // Anil const ChBRHeadTypeID = user && user.BRHeadTypeID ? user.BRHeadTypeID.toString() : "0";

  const openAddTicketPage = () => {
    // Anil const chkIsCreateTicket = user && user.IsCreateTicket ? user.IsCreateTicket : "";

    // Anil if (chkIsCreateTicket !== "Y") {
    // Anil  setAlertMessage({
    // Anil    type: "warning",
    // Anil    message: "You do not have right to create ticket!",
    // Anil  });
    // Anil  return;
    // Anil }
    setOpenAddTicketModal(!openAddTicketModal);
  };

  const [selectedData, setSelectedData] = useState();
  const openMyTicketPage = (data) => {
    if (data !== null) {
      setSelectedData(data);
    } else {
      setSelectedData(null);
    }
    setOpenMyTicketModal(!openMyTicketModal);
  };

  return (
    <>
      {openAddTicketModal && (
        <AddTicket
          showfunc={openAddTicketPage}
          updateFarmersTickets={updateFarmersTickets}
          // A updateFarmersTicketsStatusCount={updateFarmersTicketsStatusCount}
          openMyTicketPage={openMyTicketPage}
        />
      )}

      {openMyTicketModal && <MyTicketPage showfunc={openMyTicketPage} selectedData={selectedData} />}

      <ManageTicket
        openAddTicketPage={openAddTicketPage}
        openMyTicketPage={openMyTicketPage}
        isLoadingFarmersticket={isLoadingFarmersticket}
        farmersTicketData={farmersTicketData}
        ClearTicketFilters={ClearTicketFilters}
        isLoadingTicketSourceList={isLoadingTicketSourceList}
        ticketSourceList={ticketSourceList}
        getTicketSourceListData={getTicketSourceListData}
        refereshFarmerTicket={refereshFarmerTicket}
        getTicketCategoryTypeListData={getTicketCategoryTypeListData}
        getTicketCategoryListData={getTicketCategoryListData}
        isLoadingTicketCategoryTypeList={isLoadingTicketCategoryTypeList}
        getFarmersTickets={getFarmersTickets}
        ticketCategoryTypeList={ticketCategoryTypeList}
        updateState={updateState}
        formValues={formValues}
        isLoadingTicketCategoryList={isLoadingTicketCategoryList}
        ticketCategoryList={ticketCategoryList}
        ticketStatusList={ticketStatusList}
        isLoadingTicketStatusList={isLoadingTicketStatusList}
        getTicketStatusListData={getTicketStatusListData}
        insuranceCompanyList={insuranceCompanyList}
        isLoadingInsuranceCompanyList={isLoadingInsuranceCompanyList}
        getInsuranceCompanyListData={getInsuranceCompanyListData}
        stateList={stateList}
        isLoadingStateList={isLoadingStateList}
        getStateListData={getStateListData}
        ticketSearchByMobile={ticketSearchByMobile}
        updateFilterState={updateFilterState}
        searchByMobileTicketsOnClick={searchByMobileTicketsOnClick}
        getSchemeListData={getSchemeListData}
        schemeList={schemeList}
        isLoadingSchemeListDropdownDataList={isLoadingSchemeListDropdownDataList}
        satatusCount={satatusCount}
        totalSatatusCount={totalSatatusCount}
        filterValues={filterValues}
        updateFarmersTickets={updateFarmersTickets}
        // A updateFarmersTicketsStatusCount={updateFarmersTicketsStatusCount}
        // A getFarmersTicketsWithOutLoader={getFarmersTicketsWithOutLoader}
        onClickEscalation={onClickEscalation}
        esclatedCount={esclatedCount}
        onGridReady={onGridReady}
        getOneDayTicketData={getOneDayTicketData}
        getFilterTicketsClick={getFilterTicketsClick}
        showHideDownload={showHideDownload}
        OpenReplyOnMultipleTiketsForm={OpenReplyOnMultipleTiketsForm}
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        onClickViewManageTickets={onClickViewManageTickets}
        showHideManageTicket={showHideManageTicket}
        isLoadingDistrictList={isLoadingDistrictList}
        districtList={districtList}
      />

      {/* {ChBRHeadTypeID !== "124003" ? (
        <ManageTicket
          openAddTicketPage={openAddTicketPage}
          isLoadingFarmersticket={isLoadingFarmersticket}
          farmersTicketData={farmersTicketData}
          ClearTicketFilters={ClearTicketFilters}
          isLoadingTicketSourceList={isLoadingTicketSourceList}
          ticketSourceList={ticketSourceList}
          getTicketSourceListData={getTicketSourceListData}
          refereshFarmerTicket={refereshFarmerTicket}
          getTicketCategoryTypeListData={getTicketCategoryTypeListData}
          getTicketCategoryListData={getTicketCategoryListData}
          isLoadingTicketCategoryTypeList={isLoadingTicketCategoryTypeList}
          getFarmersTickets={getFarmersTickets}
          ticketCategoryTypeList={ticketCategoryTypeList}
          updateState={updateState}
          formValues={formValues}
          isLoadingTicketCategoryList={isLoadingTicketCategoryList}
          ticketCategoryList={ticketCategoryList}
          ticketStatusList={ticketStatusList}
          isLoadingTicketStatusList={isLoadingTicketStatusList}
          getTicketStatusListData={getTicketStatusListData}
          insuranceCompanyList={insuranceCompanyList}
          isLoadingInsuranceCompanyList={isLoadingInsuranceCompanyList}
          getInsuranceCompanyListData={getInsuranceCompanyListData}
          stateList={stateList}
          isLoadingStateList={isLoadingStateList}
          getStateListData={getStateListData}
          ticketSearchByMobile={ticketSearchByMobile}
          updateFilterState={updateFilterState}
          searchByMobileTicketsOnClick={searchByMobileTicketsOnClick}
          getSchemeListData={getSchemeListData}
          schemeList={schemeList}
          isLoadingSchemeListDropdownDataList={isLoadingSchemeListDropdownDataList}
          satatusCount={satatusCount}
          totalSatatusCount={totalSatatusCount}
          filterValues={filterValues}
          updateFarmersTickets={updateFarmersTickets}
          updateFarmersTicketsStatusCount={updateFarmersTicketsStatusCount}
          getFarmersTicketsWithOutLoader={getFarmersTicketsWithOutLoader}
          onClickEscalation={onClickEscalation}
          esclatedCount={esclatedCount}
        />
      ) : ChBRHeadTypeID === "124003" ? (
        <InsuranceCompManageTicket
          isLoadingFarmersticketInsuranceComp={isLoadingFarmersticketInsuranceComp}
          farmersTicketDataInsuranceComp={farmersTicketDataInsuranceComp}
          isLoadingTicketSourceListInsuranceComp={isLoadingTicketSourceListInsuranceComp}
          ticketSourceListInsuranceComp={ticketSourceListInsuranceComp}
          getTicketSourceListDataInsuranceComp={getTicketSourceListDataInsuranceComp}
          refereshFarmerTicketInsuranceComp={refereshFarmerTicketInsuranceComp}
          ClearTicketFiltersTicketInsuranceComp={ClearTicketFiltersTicketInsuranceComp}
          getTicketCategoryTypeListDataInsuranceComp={getTicketCategoryTypeListDataInsuranceComp}
          getTicketCategoryListDataInsuranceComp={getTicketCategoryListDataInsuranceComp}
          isLoadingTicketCategoryTypeListInsuranceComp={isLoadingTicketCategoryTypeListInsuranceComp}
          getFarmersTicketsInsuranceComp={getFarmersTicketsInsuranceComp}
          ticketCategoryTypeListInsuranceComp={ticketCategoryTypeListInsuranceComp}
          updateStateInsuranceComp={updateStateInsuranceComp}
          formValuesInsuranceComp={formValuesInsuranceComp}
          isLoadingTicketCategoryListInsuranceComp={isLoadingTicketCategoryListInsuranceComp}
          ticketCategoryListInsuranceComp={ticketCategoryListInsuranceComp}
          ticketStatusListInsuranceComp={ticketStatusListInsuranceComp}
          isLoadingTicketStatusListInsuranceComp={isLoadingTicketStatusListInsuranceComp}
          getTicketStatusListDataInsuranceComp={getTicketStatusListDataInsuranceComp}
          regionalOfficeList={regionalOfficeList}
          isLoadingRegionalOfficeList={isLoadingRegionalOfficeList}
          getRegionalOfficeListData={getRegionalOfficeListData}
          stateInsuranceCompanyList={stateInsuranceCompanyList}
          isLoadingStateInsuranceCompanyList={isLoadingStateInsuranceCompanyList}
          getSchemeListDataInsuranceComp={getSchemeListDataInsuranceComp}
          schemeListInsuranceComp={schemeListInsuranceComp}
          isLoadingSchemeListInsuranceCompDropdownDataList={isLoadingSchemeListInsuranceCompDropdownDataList}
          satatusCountInsuranceComp={satatusCountInsuranceComp}
          totalSatatusCountInsuranceComp={totalSatatusCountInsuranceComp}
          filterValuesInsuranceComp={filterValuesInsuranceComp}
          updateFilterStateInsuranceComp={updateFilterStateInsuranceComp}
          onClickEscalationInsuranceComp={onClickEscalationInsuranceComp}
          esclatedCountInsuranceComp={esclatedCountInsuranceComp}
          searchByMobileTicketsInsuranceCompOnClick={searchByMobileTicketsInsuranceCompOnClick}
        />
      ) : null} */}
    </>
  );
}

export default ManageTicketPage;
