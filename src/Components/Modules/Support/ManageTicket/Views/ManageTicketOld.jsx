import React, { useEffect } from "react";
import classNames from "classnames";
import { BsArrowReturnRight, BsDot, BsTelephoneOutbound, BsBank2 } from "react-icons/bs";
import { IoPulseSharp } from "react-icons/io5";
import { FaHeadphonesAlt, FaTwitterSquare } from "react-icons/fa";
import { AiOutlineClockCircle } from "react-icons/ai";
import { CgWebsite } from "react-icons/cg";
import { MdOutlineWeb, MdOutlineDisabledByDefault } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { PageBar, Form } from "Framework/Components/Layout";
import { Loader } from "Framework/Components/Widgets";
import PropTypes from "prop-types";
import { getUserRightCodeAccess } from "Components/Common/Login/Auth/auth";
import { dateFormat, tConvert } from "Configration/Utilities/dateformat";
import BizClass from "./ManageTicket.module.scss";
import HeaderPortal from "./Layout/FarmerAuthenticateModal/HeaderPortal";

function TicketSourceIconWithSwitchMT(parameter) {
  switch (parameter) {
    case 1:
      return <BsTelephoneOutbound title="Toll Free" />;
    case 2:
      return <CgWebsite title="DOA Website" />;
    case 3:
      return <MdOutlineWeb title="CSC Portal" />;
    case 4:
      return <FaTwitterSquare title="Twitter" />;
    case 5:
      return <BsBank2 title="Bank" />;
    case 6:
      return <MdOutlineWeb title="CSC" />;
    default:
      return <MdOutlineDisabledByDefault />;
  }
}
function ManageTicket({
  openAddTicketPage,
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
}) {
  const navigate = useNavigate();
  // Rachit const userData = getSessionStorage("user");
  const viewTicketRight = getUserRightCodeAccess("td8b");
  const addTicketRight = getUserRightCodeAccess("lo3e");
  const esclationTicketRight = getUserRightCodeAccess("bnb4");

  const ticketTypeList = [
    { TicketTypeID: "1", TicketTypeName: "Grievance" },
    { TicketTypeID: "2", TicketTypeName: "Information" },
  ];

  const searchByoptions = [
    { value: "1", label: "Mobile No" },
    { value: "2", label: "Ticket No" },
  ];

  useEffect(() => {
    getFarmersTickets("ESCAL");
    getTicketSourceListData();
    getTicketStatusListData();
    getInsuranceCompanyListData();
    getStateListData();
    getSchemeListData();
  }, []);

  console.log(userRightDataList);
  return (
    <div className={BizClass.Box}>
      <div className={BizClass.PageBar}>
        {viewTicketRight ? (
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

          {/* )} */}

          {addTicketRight ? <PageBar.Button onClick={() => openAddTicketPage()}>Add Ticket</PageBar.Button> : null}
          {/* {userData.BRHeadTypeID.toString() === "124003" || userData.BRHeadTypeID.toString() === "0" ? null : (
            <PageBar.Button onClick={() => openAddTicketPage()}>Add Ticket</PageBar.Button>
          )} */}
          {esclationTicketRight ? (
            <PageBar.Button onClick={() => onClickEscalation()} title="Escalated Tickets" style={{ display: "flex", alignItems: "center" }}>
              Escalated (<p style={{ minWidth: "22px" }}>{esclatedCount}</p>)
            </PageBar.Button>
          ) : null}
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
            {" "}
            <div className={BizClass.DataBox}>
              {!isLoadingFarmersticket ? (
                farmersTicketData && farmersTicketData.length > 0 ? (
                  farmersTicketData.map((data, i) => {
                    return (
                      <div key={i} className={classNames(BizClass.ContentBox, BizClass.urgent)}>
                        <div className={BizClass.CheckBox} />
                        <div className={BizClass.SubBox}>
                          <div className={BizClass.TickIcon}>{TicketSourceIconWithSwitchMT(data.TicketSourceID)}</div>
                          <div className={BizClass.TicketContent}>
                            <button type="button" className={BizClass.TicketTitle} onClick={() => navigate("/MyTicket", { state: data })}>
                              {data.SupportTicketNo}
                              <span>{`|| ${data.TicketCategoryName}`}</span>
                            </button>
                            <div className={BizClass.TicketSubInfo}>
                              <p className={BizClass.TicketFromInfo}>
                                <BsArrowReturnRight />
                                <span>{data.InsuranceCompany}</span>
                              </p>
                              <p className={BizClass.TicketFromInfo}>
                                <BsDot />
                                <span>{`${data.RequestorName}(${data.RequestorMobileNo})`}</span>
                              </p>
                              <p className={BizClass.TicketResponsedInfo}>
                                <BsDot />
                                <span>{data.StateMasterName}</span>
                              </p>
                            </div>
                          </div>
                          <div className={BizClass.StatusContent}>
                            <p className={BizClass.CreatedOnInfo}>
                              <AiOutlineClockCircle />
                              <span>
                                {" "}
                                {dateFormat(data.CreatedAt.split("T")[0])} at {tConvert(data.CreatedAt.split("T")[1])}
                              </span>
                            </p>
                            <p className={BizClass.AgentInfo}>
                              <FaHeadphonesAlt />
                              <span>{data.AgentName}</span>
                            </p>
                            <p className={BizClass.StatusInfo}>
                              <IoPulseSharp />
                              <span>{`${data.TicketStatus}(${data.TicketHeadName})`}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : null
              ) : (
                <Loader />
              )}
            </div>
            <div className={BizClass.FilterBox}>
              <div className={BizClass.Header}>
                <h4>Filters Tickets</h4>
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
                        loader={isLoadingTicketCategoryTypeList ? <Loader /> : null}
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
                        loader={isLoadingTicketCategoryList ? <Loader /> : null}
                        getOptionLabel={(option) => `${option.TicketCategoryName}`}
                        getOptionValue={(option) => `${option}`}
                        value={formValues.txtTicketCategory}
                        onChange={(e) => updateState("txtTicketCategory", e)}
                      />
                    </Form.InputGroup>

                    <Form.InputGroup label="Source" req="false" errorMsg="">
                      <Form.InputControl
                        control="select"
                        name="txtTicketSource"
                        options={ticketSourceList}
                        loader={isLoadingTicketSourceList ? <Loader /> : null}
                        value={formValues.txtTicketSource}
                        getOptionLabel={(option) => `${option.TicketSourceName}`}
                        getOptionValue={(option) => `${option}`}
                        onChange={(e) => updateState("txtTicketSource", e)}
                      />
                    </Form.InputGroup>

                    <Form.InputGroup label="Status" req="false" errorMsg="">
                      <Form.InputControl
                        control="select"
                        name="txtStatus"
                        options={ticketStatusList}
                        loader={isLoadingTicketStatusList ? <Loader /> : null}
                        value={formValues.txtStatus}
                        getOptionLabel={(option) => `${option.CommonMasterValue}`}
                        getOptionValue={(option) => `${option}`}
                        onChange={(e) => updateState("txtStatus", e)}
                      />
                    </Form.InputGroup>
                    <Form.InputGroup label="Scheme" req="false" errorMsg="">
                      <Form.InputControl
                        control="select"
                        name="txtScheme"
                        value={formValues.txtScheme}
                        options={schemeList}
                        loader={isLoadingSchemeListDropdownDataList ? <Loader /> : null}
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
                        loader={isLoadingInsuranceCompanyList ? <Loader /> : null}
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
                        loader={isLoadingStateList ? <Loader /> : null}
                        value={formValues.txtState}
                        onChange={(e) => updateState("txtState", e)}
                      />
                    </Form.InputGroup>
                  </div>
                </Form>
              </div>
              <div className={BizClass.Footer}>
                <button type="button" onClick={() => refereshFarmerTicket()}>
                  Apply
                </button>
                &nbsp;
                <button type="button" onClick={() => ClearTicketFilters()}>
                  Clear
                </button>
              </div>
            </div>
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
  updateFarmersTicketsStatusCount: PropTypes.func.isRequired,
  onClickEscalation: PropTypes.func.isRequired,
  esclatedCount: PropTypes.string,
  userRightDataList: PropTypes.array.isRequired,
  getUserRightDataList: PropTypes.func.isRequired,
};
