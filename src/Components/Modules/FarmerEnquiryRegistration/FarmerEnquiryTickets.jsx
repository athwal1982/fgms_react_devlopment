import React, { useState, useEffect } from "react";
// Anil import { useNavigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { DataGrid, PageBar, Form } from "Framework/Components/Layout";
import { Loader } from "Framework/Components/Widgets";
import { getUserRightCodeAccess } from "Components/Common/Login/Auth/auth";
// A import moment from "moment";
import { Convert24FourHourAndMinute, dateToSpecificFormat } from "Configration/Utilities/dateformat";
import moment from "moment";
import { FcViewDetails } from "react-icons/fc";
import BizClass from "./FarmerEnquiryTickets.module.scss";
import FarmerEnquiryTicketsLogics from "./Logic/FarmerEnquiryTicketsLogic";
import HeaderPortal from "../Support/ManageTicket/Views/Layout/FarmerAuthenticateModal/HeaderPortal";
import MyTicketPage from "./MyTicket";

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

function FarmerEnquiryTickets() {
  const navigate = useNavigate();
  const [openMyTicketModal, setOpenMyTicketModal] = useState(false);
  const [selectedData, setSelectedData] = useState();
  const openMyTicketPage = (data) => {
    if (data !== null) {
      setSelectedData(data);
    } else {
      setSelectedData(null);
    }
    setOpenMyTicketModal(!openMyTicketModal);
  };

  const goBackOnClick = () => {
    navigate("/FarmerEnquiryRegistration");
  };
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
    userRightDataList,
    onGridReady,
    getOneDayTicketData,
    getFilterTicketsClick,
    showHideDownload,
  } = FarmerEnquiryTicketsLogics();
  // Anil const navigate = useNavigate();
  console.log(showHideDownload);
  const viewEnquiryTicketRight = getUserRightCodeAccess("fe2t");
  const ticketTypeList = [
    { TicketTypeID: "1", TicketTypeName: "Grievance" },
    { TicketTypeID: "4", TicketTypeName: "Crop Loss Intimation" },
  ];

  const searchByoptions = [
    { value: "1", label: "Mobile No" },
    { value: "2", label: "Ticket No" },
  ];

  const toggleSupportTicketDetailsModal = (data) => {
    console.log(data);
    openMyTicketPage(data);
  };

  useEffect(() => {
    getFarmersTickets("FILTER");
    getTicketSourceListData();
    getTicketStatusListData();
    getInsuranceCompanyListData();
    getStateListData();
    getSchemeListData();
  }, []);

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
    <>
      {openMyTicketModal && <MyTicketPage showfunc={openMyTicketPage} selectedData={selectedData} />}
      <div className={BizClass.Box}>
        <div className={BizClass.PageBar}>
          {viewEnquiryTicketRight ? (
            <div className={BizClass.ticketCounterBar}>
              <span>Open :</span>
              <p>{satatusCount && satatusCount.length > 0 ? satatusCount[0].Open : 0}</p>
              <span>In-Progress :</span>
              <p>{satatusCount && satatusCount.length > 0 ? satatusCount[0].InProgress : 0}</p>
              <span>Resolved :</span>
              <p>{satatusCount && satatusCount.length > 0 ? satatusCount[0].Resolved : 0}</p>
              <span>Re-Open :</span>
              <p>{satatusCount && satatusCount.length > 0 ? satatusCount[0].ReOpen : 0}</p>
              <span>Total :</span>
              <p>{totalSatatusCount}</p>
            </div>
          ) : null}
          <HeaderPortal>
            {/* {userData.BRHeadTypeID.toString() === "124003" || userData.BRHeadTypeID.toString() === "0" ? null : ( */}

            {viewEnquiryTicketRight ? (
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
                  onClick={() => searchByMobileTicketsOnClick()}
                  style={{ width: "158px" }}
                />
              </>
            ) : null}
            <PageBar.Button onClick={() => goBackOnClick()} title="Go Back" style={{ display: "flex", alignItems: "center" }}>
              Back
            </PageBar.Button>
          </HeaderPortal>
        </div>
        <div className={BizClass.MainBox}>
          {viewEnquiryTicketRight ? (
            <>
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
                <DataGrid.Column field="FarmerSupportTicketNo" headerName="Ticket No" width="150px" />
                <DataGrid.Column field="ApplicationNo" headerName="Application No" width="180px" useValueFormatterForExport={true} />
                <DataGrid.Column field="InsurancePolicyNo" headerName="Policy No" width="170px" />
                <DataGrid.Column field="TicketStatus" headerName="Ticket Status" width="120px" />
                <DataGrid.Column field="CallerContactNumber" headerName="Caller Mobile No." width="140px" />
                <DataGrid.Column field="RequestorName" headerName="Farmer Name" width="210px" />
                <DataGrid.Column field="MobileNumber" headerName="Mobile No" width="110px" />
                <DataGrid.Column field="StateMasterName" headerName="State" width="160px" />
                <DataGrid.Column field="InsuranceCompany" headerName="Insurance Company" width="290px" />
                <DataGrid.Column field="TicketHeadName" headerName="Type" width="150px" />
                <DataGrid.Column field="TicketTypeName" headerName="Category" width="180px" />
                <DataGrid.Column field="TicketCategoryName" headerName="Sub Category" width="200px" />
                <DataGrid.Column field="CropCategoryOthers" headerName="Other Sub Category" width="250px" />
                <DataGrid.Column field="CropStage" headerName="Crop Stage Type" width="160px" />
                <DataGrid.Column field="CropStageSelection" headerName="Loss At" width="320px" />
                <DataGrid.Column field="CropStageMaster" headerName="Crop Stage" width="140px" />
                <DataGrid.Column
                  field="LossDate"
                  headerName="Loss Date"
                  width="130px"
                  valueFormatter={(param) => (param.value ? moment(param.value).format("DD-MM-YYYY") : "")}
                />
                <DataGrid.Column
                  field="#"
                  headerName="Intimation"
                  width="110px"
                  valueGetter={(node) => {
                    return node.data.OnTimeIntimationFlag && node.data.OnTimeIntimationFlag === "NO"
                      ? "Late"
                      : node.data.OnTimeIntimationFlag === "YES"
                      ? "On-time"
                      : null;
                  }}
                />
                <DataGrid.Column
                  field="PostHarvestDate"
                  headerName="Harvest Date"
                  width="130px"
                  valueFormatter={(param) => (param.value ? moment(param.value).format("DD-MM-YYYY") : "")}
                />
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
                        </>
                      ) : null}
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
              </div>
            </>
          ) : (
            <div style={{ "text-align": "center" }}>You are not authorized to view ticket list</div>
          )}
        </div>
      </div>
    </>
  );
}

export default FarmerEnquiryTickets;
