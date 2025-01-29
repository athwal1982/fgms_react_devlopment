import React, { useEffect, useState } from "react";
// Anil import { useNavigate } from "react-router-dom";
import { DataGrid, PageBar, Form } from "Framework/Components/Layout";
import { Loader } from "Framework/Components/Widgets";
import PropTypes from "prop-types";
import { getUserRightCodeAccess, getSessionStorage } from "Components/Common/Login/Auth/auth";
// A import moment from "moment";
import { Convert24FourHourAndMinute, dateToSpecificFormat } from "Configration/Utilities/dateformat";
import { FcViewDetails } from "react-icons/fc";
import { MdComment } from "react-icons/md";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/bootstrap.css";
import BizClass from "./ManageTicket.module.scss";
import HeaderPortal from "./Layout/FarmerAuthenticateModal/HeaderPortal";

const cellActionTemplate = (props) => {
  return (
    <div style={{ display: "flex", gap: "4px", marginTop: "2px" }}>
      <FcViewDetails
        style={{ fontSize: "16px", color: "#000000", cursor: "pointer" }}
        onClick={() => props.toggleSupportTicketDetailsModal(props.data)}
        title="Ticket Details"
      />
    </div>
  );
};

function ManageTicket({
  openAddTicketPage,
  openMyTicketPage,
  isLoadingFarmersticket,
  ticketCategoryList,
  isLoadingTicketCategoryList,
  formValues,
  updateState,
  ticketCategoryTypeList,
  getFarmersTickets,
  farmersTicketData,
  isLoadingTicketCategoryTypeList,
  refereshFarmerTicket,
  ClearTicketFilters,
  getTicketSourceListData,
  ticketSourceList,
  isLoadingTicketSourceList,
  getTicketStatusListData,
  ticketStatusList,
  isLoadingTicketStatusList,
  insuranceCompanyList,
  isLoadingInsuranceCompanyList,
  getInsuranceCompanyListData,
  stateList,
  isLoadingStateList,
  getStateListData,
  updateFilterState,
  searchByMobileTicketsOnClick,
  getSchemeListData,
  schemeList,
  isLoadingSchemeListDropdownDataList,
  satatusCount,
  totalSatatusCount,
  filterValues,
  onClickEscalation,
  esclatedCount,
  userRightDataList,
  onGridReady,
  getOneDayTicketData,
  getFilterTicketsClick,
  showHideDownload,
  OpenReplyOnMultipleTiketsForm,
  totalPages,
  currentPage,
  handlePageChange,
  showHideManageTicket,
  onClickViewManageTickets,
  isLoadingDistrictList,
  districtList,
}) {
  // Anil const navigate = useNavigate();
  console.log(showHideDownload);
  const userData = getSessionStorage("user");
  const viewTicketRight = getUserRightCodeAccess("td8b");
  const addTicketRight = getUserRightCodeAccess("lo3e");
  const esclationTicketRight = getUserRightCodeAccess("bnb4");
  const ChkBRHeadTypeID = userData && userData.BRHeadTypeID ? userData.BRHeadTypeID.toString() : "0";
  const ChkAppAccessTypeID = userData && userData.AppAccessTypeID ? userData.AppAccessTypeID.toString() : "0";
  const ticketTypeList = [
    { TicketTypeID: "1", TicketTypeName: "Grievance" },
    { TicketTypeID: "2", TicketTypeName: "Information" },
    { TicketTypeID: "4", TicketTypeName: "Crop Loss Intimation" },
  ];

  const searchByoptions = [
    { value: "1", label: "Mobile No" },
    { value: "2", label: "Ticket No" },
    { value: "3", label: "Application No" },
  ];

  const toggleSupportTicketDetailsModal = (data) => {
    console.log(data);
    openMyTicketPage(data);
  };

  useEffect(() => {
    debugger;
    if (esclationTicketRight) {
      getFarmersTickets("ESCAL", "", 1, 20);
      getFarmersTickets("DEFESCAL", "", 1, 20);
    } else {
      if (ChkBRHeadTypeID === "124001" && ChkAppAccessTypeID === "503" && showHideManageTicket === false) {
        console.log(showHideManageTicket);
      } else {
        getFarmersTickets("DEFESCAL", "DEFAULTFILTER", 1, 20);
      }
    }
    if (ChkBRHeadTypeID === "124001" && ChkAppAccessTypeID === "503" && showHideManageTicket === false) {
      console.log(showHideManageTicket);
    } else {
      getTicketSourceListData();
      getTicketStatusListData();
      getInsuranceCompanyListData();
      getStateListData();
      getSchemeListData();
    }
  }, [esclationTicketRight]);

  console.log(userRightDataList);

  const getRowStyle = (params) => {
    if (params.data.IsNewlyAdded) {
      return { background: "#d5a10e" };
    }
    if (params.node.rowIndex % 2 === 0) {
      return { background: "#fff" };
    }
    return { background: "#f3f6f9" };
  };

  return (
    <div className={BizClass.Box}>
      <div className={BizClass.PageBar}>
        {viewTicketRight ? (
          <>
            {ChkBRHeadTypeID === "124001" && ChkAppAccessTypeID === "503" && showHideManageTicket === false ? null : (
              <div className={BizClass.ticketCounterBar}>
                <span>Open :</span>
                <p>{satatusCount && satatusCount.length > 0 ? satatusCount[0].Open : 0}</p>
                <span>In-Progress :</span>
                <p>{satatusCount && satatusCount.length > 0 ? satatusCount[0].InProgress : 0}</p>
                <span>Resolved :</span>
                <p>{satatusCount && satatusCount.length > 0 ? satatusCount[0].Resolved : 0}</p>
                <span>Resolved(Information) :</span>
                <p>{satatusCount && satatusCount.length > 0 ? satatusCount[0].ResolvedInformation : 0}</p>
                <span>Re-Open :</span>
                <p>{satatusCount && satatusCount.length > 0 ? satatusCount[0].ReOpen : 0}</p>
                <span>Total :</span>
                <p>{totalSatatusCount}</p>
              </div>
            )}
          </>
        ) : null}

        {/* {userData.BRHeadTypeID.toString() === "124003" || userData.BRHeadTypeID.toString() === "0" ? null : (
          <div className={BizClass.ticketCounterBar}>
            <span>Open :</span>
            <p>{satatusCount && satatusCount.length > 0 ? satatusCount[0].Open : 0}</p>
            <span>In-Progress :</span>
            <p>{satatusCount && satatusCount.length > 0 ? satatusCount[0].InProgress : 0}</p>
            <span>Resolved(Grievance) :</span>
            <p>{satatusCount && satatusCount.length > 0 ? satatusCount[0].ResolvedGrievance : 0}</p>
            <span>Resolved(Information) :</span>
            <p>{satatusCount && satatusCount.length > 0 ? satatusCount[0].ResolvedInformation : 0}</p>
            <span>Re-Open :</span>
            <p>{satatusCount && satatusCount.length > 0 ? satatusCount[0].ReOpen : 0}</p>
            <span>Total :</span>
            <p>{totalSatatusCount}</p>
          </div>
        )} */}
        <HeaderPortal>
          {/* {userData.BRHeadTypeID.toString() === "124003" || userData.BRHeadTypeID.toString() === "0" ? null : ( */}

          {viewTicketRight ? (
            <>
              {ChkBRHeadTypeID === "124001" && ChkAppAccessTypeID === "503" && showHideManageTicket === false ? null : (
                <>
                  <PageBar.Select
                    ControlTxt="Search By"
                    name="SearchByFilter"
                    getOptionLabel={(option) => `${option.label}`}
                    getOptionValue={(option) => `${option}`}
                    options={searchByoptions}
                    value={filterValues.SearchByFilter}
                    onChange={(e) => updateFilterState("SearchByFilter", e)}
                  />
                  <PageBar.Search
                    placeholder="Search "
                    name="txtSearchFilter"
                    value={filterValues.txtSearchFilter}
                    onChange={(e) => updateFilterState(e.target.name, e.target.value)}
                    onClick={() => searchByMobileTicketsOnClick(1, 5000)}
                    style={{ width: "158px" }}
                  />
                </>
              )}
            </>
          ) : null}

          {/* )} */}

          {addTicketRight ? <PageBar.Button onClick={() => openAddTicketPage()}>Add Ticket</PageBar.Button> : null}
          {/* {userData.BRHeadTypeID.toString() === "124003" || userData.BRHeadTypeID.toString() === "0" ? null : (
            <PageBar.Button onClick={() => openAddTicketPage()}>Add Ticket</PageBar.Button>
          )} */}
          {viewTicketRight ? (
            <>
              {ChkBRHeadTypeID === "124001" && ChkAppAccessTypeID === "503" ? (
                <PageBar.Button onClick={() => onClickViewManageTickets()} title="View Tickets" style={{ display: "flex", alignItems: "center" }}>
                  View Tickets
                </PageBar.Button>
              ) : null}
            </>
          ) : null}
          {esclationTicketRight ? (
            <PageBar.Button onClick={() => onClickEscalation()} title="Escalated Tickets" style={{ display: "flex", alignItems: "center" }}>
              Escalated (<p style={{ minWidth: "22px" }}>{esclatedCount}</p>)
            </PageBar.Button>
          ) : null}
          {/* {esclationTicketRight && userData.EscalationFlag && userData.EscalationFlag === "Y" ? (
            <PageBar.Button onClick={() => onClickEscalation()} title="Escalated Tickets" style={{ display: "flex", alignItems: "center" }}>
              Escalated (<p style={{ minWidth: "22px" }}>{esclatedCount}</p>)
            </PageBar.Button>
          ) : null} */}
          {/* {userData && userData.EscalationFlag && userData.EscalationFlag === "Y" ? (
            <PageBar.Button onClick={() => onClickEscalation()} title="Escalated Tickets" style={{ display: "flex", alignItems: "center" }}>
              Escalated (<p style={{ minWidth: "22px" }}>{esclatedCount}</p>)
            </PageBar.Button>
          ) : null} */}
        </HeaderPortal>
      </div>
      <div className={BizClass.MainBox}>
        {/* {userData.BRHeadTypeID.toString() === "124003" || userData.BRHeadTypeID.toString() === "0" ? (
          <div style={{ "text-align": "center" }}>You are not authorized to view this page</div>
        ) : null} */}

        {viewTicketRight ? (
          <>
            {ChkBRHeadTypeID === "124001" && ChkAppAccessTypeID === "503" && showHideManageTicket === false ? (
              <div style={{ "text-align": "center" }}>Click on View Tickets button to view ticket listing</div>
            ) : (
              <>
                <div className={BizClass.divGridPagination}>
                  <DataGrid
                    rowData={farmersTicketData}
                    loader={isLoadingFarmersticket ? <Loader /> : null}
                    components={{
                      actionTemplate: cellActionTemplate,
                    }}
                    getRowStyle={getRowStyle}
                    onGridReady={onGridReady}
                    suppressContextMenu={true}
                  >
                    <DataGrid.Column
                      headerName="Action"
                      lockPosition="1"
                      pinned="left"
                      width={80}
                      cellRenderer="actionTemplate"
                      cellRendererParams={{
                        toggleSupportTicketDetailsModal,
                      }}
                    />
                    <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
                    <DataGrid.Column field="SupportTicketNo" headerName="Ticket No" width="150px" />
                    <DataGrid.Column field="ApplicationNo" headerName="Application No" width="180px" useValueFormatterForExport={true} />
                    <DataGrid.Column field="InsurancePolicyNo" headerName="Policy No" width="170px" />
                    <DataGrid.Column field="TicketStatus" headerName="Ticket Status" width="120px" />
                    <DataGrid.Column field="CallerContactNumber" headerName="Caller Mobile No." width="140px" />
                    <DataGrid.Column field="RequestorName" headerName="Farmer Name" width="210px" />
                    <DataGrid.Column field="RequestorMobileNo" headerName="Mobile No" width="110px" />
                    <DataGrid.Column field="StateMasterName" headerName="State" width="160px" />
                    <DataGrid.Column field="InsuranceCompany" headerName="Insurance Company" width="290px" />
                    <DataGrid.Column field="TicketHeadName" headerName="Type" width="150px" />
                    <DataGrid.Column field="TicketTypeName" headerName="Category" width="180px" />
                    <DataGrid.Column field="TicketCategoryName" headerName="Sub Category" width="200px" />
                    <DataGrid.Column field="SchemeName" headerName="Scheme" width="220px" />
                    <DataGrid.Column
                      field="RequestSeason"
                      headerName="Season"
                      width="100px"
                      valueFormatter={(param) => (param.value && param.value === 1 ? "Kharif" : param.value === 2 ? "Rabi" : "")}
                    />
                    <DataGrid.Column field="RequestYear" headerName="Year" width="100px" />
                    <DataGrid.Column field="ApplicationCropName" headerName="Crop Name" width="150px" />
                    {/* <DataGrid.Column
             field="LossDate"
             headerName="Crop Loss Date"
             width="130px"
             valueFormatter={(param) => (param.value ? moment(param.value).format("DD-MM-YYYY") : "")}
           />
           <DataGrid.Column
             field="LossTime"
             headerName="Crop Loss Time"
             width="130px"
             valueGetter={(node) => {
               return node.data.LossTime ? Convert24FourHourAndMinute(node.data.LossTime) : null;
             }}
           /> */}
                    <DataGrid.Column field="CreatedBY" headerName="Created By" width="160px" />
                    <DataGrid.Column
                      field="#"
                      headerName="Created At"
                      width="145px"
                      valueGetter={(node) => {
                        // A return node.data.CreatedAt ? `${dateFormat(node.data.CreatedAt.split("T")[0])} ${tConvert(node.data.CreatedAt.split("T")[1])}` : null;
                        return node.data.CreatedAt
                          ? dateToSpecificFormat(
                              `${node.data.CreatedAt.split("T")[0]} ${Convert24FourHourAndMinute(node.data.CreatedAt.split("T")[1])}`,
                              "DD-MM-YYYY HH:mm",
                            )
                          : null;
                      }}
                    />
                  </DataGrid>
                  {showHideDownload === false || farmersTicketData.length === 0 ? null : (
                    <ResponsivePagination current={currentPage} total={totalPages} onPageChange={handlePageChange} />
                  )}
                </div>
                <div className={BizClass.FilterBox}>
                  <div className={BizClass.Header}>
                    {/* <h4>Filters Tickets </h4> */}
                    <button type="button" className={BizClass.FilterTicketButton} onClick={() => getFilterTicketsClick()}>
                      {" "}
                      Filters Tickets
                    </button>
                    <span />

                    <button type="button" className={BizClass.ExportButton} onClick={() => getOneDayTicketData()}>
                      {" "}
                      Download
                    </button>
                    <span />
                    {ChkBRHeadTypeID === "124003" ? (
                      <div className={BizClass.CommentIcon}>
                        <MdComment title="Reply on Multiple Tickets" onClick={() => OpenReplyOnMultipleTiketsForm()} />
                      </div>
                    ) : null}
                  </div>
                  <div className={BizClass.Content}>
                    <Form>
                      <div className={BizClass.FormContent}>
                        <Form.InputGroup label="From Date" req="false" errorMsg="">
                          <Form.InputControl
                            control="input"
                            type="date"
                            name="txtFromDate"
                            value={formValues.txtFromDate}
                            onChange={(e) => updateState("txtFromDate", e.target.value)}
                          />
                        </Form.InputGroup>
                        <Form.InputGroup label="To Date" req="false" errorMsg="">
                          <Form.InputControl
                            control="input"
                            type="date"
                            name="txtToDate"
                            value={formValues.txtToDate}
                            onChange={(e) => updateState("txtToDate", e.target.value)}
                          />
                        </Form.InputGroup>
                        <Form.InputGroup label="Type" req="false" errorMsg="">
                          <Form.InputControl
                            control="select"
                            name="txtTicketType"
                            value={formValues.txtTicketType}
                            options={ticketTypeList}
                            getOptionLabel={(option) => `${option.TicketTypeName}`}
                            getOptionValue={(option) => `${option}`}
                            onChange={(e) => updateState("txtTicketType", e)}
                          />
                        </Form.InputGroup>
                        <Form.InputGroup label="Category" req="false" errorMsg="">
                          <Form.InputControl
                            control="select"
                            name="txtTicketCategoryType"
                            value={formValues.txtTicketCategoryType}
                            // A loader={isLoadingTicketCategoryTypeList ? <Loader /> : null}
                            isLoading={isLoadingTicketCategoryTypeList}
                            options={ticketCategoryTypeList}
                            getOptionLabel={(option) => `${option.SupportTicketTypeName}`}
                            getOptionValue={(option) => `${option}`}
                            onChange={(e) => updateState("txtTicketCategoryType", e)}
                          />
                        </Form.InputGroup>
                        <Form.InputGroup label="Sub Category" req="false" errorMsg="">
                          <Form.InputControl
                            control="select"
                            name="txtTicketCategory"
                            options={ticketCategoryList}
                            // A loader={isLoadingTicketCategoryList ? <Loader /> : null}
                            isLoading={isLoadingTicketCategoryList}
                            getOptionLabel={(option) => `${option.TicketCategoryName}`}
                            getOptionValue={(option) => `${option}`}
                            value={formValues.txtTicketCategory}
                            onChange={(e) => updateState("txtTicketCategory", e)}
                          />
                        </Form.InputGroup>
                        {showHideDownload ? (
                          <Form.InputGroup label="Source" req="false" errorMsg="">
                            <Form.InputControl
                              control="select"
                              name="txtTicketSource"
                              options={ticketSourceList}
                              // A loader={isLoadingTicketSourceList ? <Loader /> : null}
                              isLoading={isLoadingTicketSourceList}
                              value={formValues.txtTicketSource}
                              getOptionLabel={(option) => `${option.TicketSourceName}`}
                              getOptionValue={(option) => `${option}`}
                              onChange={(e) => updateState("txtTicketSource", e)}
                            />
                          </Form.InputGroup>
                        ) : null}
                        <Form.InputGroup label="Status" req="false" errorMsg="">
                          <Form.InputControl
                            control="select"
                            name="txtStatus"
                            options={ticketStatusList}
                            // A loader={isLoadingTicketStatusList ? <Loader /> : null}
                            isLoading={isLoadingTicketStatusList}
                            value={formValues.txtStatus}
                            getOptionLabel={(option) => `${option.CommonMasterValue}`}
                            getOptionValue={(option) => `${option}`}
                            onChange={(e) => updateState("txtStatus", e)}
                          />
                        </Form.InputGroup>
                        {showHideDownload ? (
                          <>
                            <Form.InputGroup label="Scheme" req="false" errorMsg="">
                              <Form.InputControl
                                control="select"
                                name="txtScheme"
                                value={formValues.txtScheme}
                                options={schemeList}
                                // A loader={isLoadingSchemeListDropdownDataList ? <Loader /> : null}
                                isLoading={isLoadingSchemeListDropdownDataList}
                                getOptionLabel={(option) => `${option.SchemeName}`}
                                getOptionValue={(option) => `${option}`}
                                onChange={(e) => updateState("txtScheme", e)}
                              />
                            </Form.InputGroup>
                            <Form.InputGroup label="Insurance Comp." req="false" errorMsg="">
                              <Form.InputControl
                                control="select"
                                name="txtInsuranceCompany"
                                options={insuranceCompanyList}
                                // A loader={isLoadingInsuranceCompanyList ? <Loader /> : null}
                                isLoading={isLoadingInsuranceCompanyList}
                                getOptionLabel={(option) => `${option.CompanyName}`}
                                getOptionValue={(option) => `${option}`}
                                value={formValues.txtInsuranceCompany}
                                onChange={(e) => updateState("txtInsuranceCompany", e)}
                              />
                            </Form.InputGroup>
                          </>
                        ) : null}
                        <Form.InputGroup label="State" req="false" errorMsg="">
                          <Form.InputControl
                            control="multiselect"
                            name="txtState"
                            options={stateList}
                            // A loader={isLoadingStateList ? <Loader /> : null}
                            isLoading={isLoadingStateList}
                            value={formValues.txtState}
                            onChange={(e) => updateState("txtState", e)}
                          />
                        </Form.InputGroup>
                        {showHideDownload ? null : (
                          <Form.InputGroup label="District" req="false" errorMsg="">
                            <Form.InputControl
                              control="multiselect"
                              name="txtDistrict"
                              options={districtList}
                              isLoading={isLoadingDistrictList}
                              value={formValues.txtDistrict}
                              onChange={(e) => updateState("txtDistrict", e)}
                            />
                          </Form.InputGroup>
                        )}
                      </div>
                    </Form>
                  </div>
                  <div className={BizClass.Footer}>
                    <button type="button" onClick={() => refereshFarmerTicket()}>
                      Apply
                    </button>
                    &nbsp;
                    {showHideDownload ? (
                      <button type="button" onClick={() => ClearTicketFilters()}>
                        Clear
                      </button>
                    ) : null}
                  </div>
                </div>{" "}
              </>
            )}
          </>
        ) : (
          <div style={{ "text-align": "center" }}>You are not authorized to view ticket list</div>
        )}
      </div>
    </div>
  );
}

export default ManageTicket;

ManageTicket.propTypes = {
  openAddTicketPage: PropTypes.func.isRequired,
  openMyTicketPage: PropTypes.func.isRequired,
  isLoadingFarmersticket: PropTypes.bool.isRequired,
  ticketCategoryList: PropTypes.array.isRequired,
  isLoadingTicketCategoryList: PropTypes.bool,
  formValues: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired,
  ticketCategoryTypeList: PropTypes.array.isRequired,
  getFarmersTickets: PropTypes.func.isRequired,
  farmersTicketData: PropTypes.array.isRequired,
  isLoadingTicketCategoryTypeList: PropTypes.bool,
  refereshFarmerTicket: PropTypes.func.isRequired,
  ClearTicketFilters: PropTypes.func.isRequired,
  getTicketSourceListData: PropTypes.func.isRequired,
  ticketSourceList: PropTypes.array.isRequired,
  isLoadingTicketSourceList: PropTypes.bool,
  getTicketStatusListData: PropTypes.func.isRequired,
  ticketStatusList: PropTypes.array.isRequired,
  isLoadingTicketStatusList: PropTypes.bool,
  getInsuranceCompanyListData: PropTypes.func.isRequired,
  insuranceCompanyList: PropTypes.array.isRequired,
  isLoadingInsuranceCompanyList: PropTypes.bool,
  getStateListData: PropTypes.func.isRequired,
  stateList: PropTypes.array.isRequired,
  isLoadingStateList: PropTypes.bool,
  ticketSearchByMobile: PropTypes.string,
  updateFilterState: PropTypes.func.isRequired,
  searchByMobileTicketsOnClick: PropTypes.func.isRequired,
  getSchemeListData: PropTypes.func.isRequired,
  schemeList: PropTypes.array.isRequired,
  isLoadingSchemeListDropdownDataList: PropTypes.bool,
  satatusCount: PropTypes.array.isRequired,
  totalSatatusCount: PropTypes.string,
  filterValues: PropTypes.object.isRequired,
  updateFarmersTickets: PropTypes.func.isRequired,
  // A updateFarmersTicketsStatusCount: PropTypes.func.isRequired,
  onClickEscalation: PropTypes.func.isRequired,
  esclatedCount: PropTypes.string,
  userRightDataList: PropTypes.array.isRequired,
  getUserRightDataList: PropTypes.func.isRequired,
  onGridReady: PropTypes.func.isRequired,
  getOneDayTicketData: PropTypes.func.isRequired,
  getFilterTicketsClick: PropTypes.func.isRequired,
  showHideDownload: PropTypes.bool,
  OpenReplyOnMultipleTiketsForm: PropTypes.func.isRequired,
  showHideManageTicket: PropTypes.bool,
  onClickViewManageTickets: PropTypes.func.isRequired,
};
