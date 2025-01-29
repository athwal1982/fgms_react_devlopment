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
import { getUserRightCodeAccess, getSessionStorage } from "Components/Common/Login/Auth/auth";
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
function InsuranceCompManageTicket({
  isLoadingFarmersticketInsuranceComp,
  ticketCategoryListInsuranceComp,
  isLoadingTicketCategoryListInsuranceComp,
  formValuesInsuranceComp,
  updateStateInsuranceComp,
  ticketCategoryTypeListInsuranceComp,
  getFarmersTicketsInsuranceComp,
  farmersTicketDataInsuranceComp,
  isLoadingTicketCategoryTypeListInsuranceComp,
  refereshFarmerTicketInsuranceComp,
  ClearTicketFiltersTicketInsuranceComp,
  getTicketSourceListDataInsuranceComp,
  ticketSourceListInsuranceComp,
  isLoadingTicketSourceListInsuranceComp,
  ticketStatusListInsuranceComp,
  isLoadingTicketStatusListInsuranceComp,
  getTicketStatusListDataInsuranceComp,
  regionalOfficeList,
  isLoadingRegionalOfficeList,
  getRegionalOfficeListData,
  stateInsuranceCompanyList,
  isLoadingStateInsuranceCompanyList,
  getSchemeListDataInsuranceComp,
  schemeListInsuranceComp,
  isLoadingSchemeListInsuranceCompDropdownDataList,
  satatusCountInsuranceComp,
  totalSatatusCountInsuranceComp,
  filterValuesInsuranceComp,
  updateFilterStateInsuranceComp,
  onClickEscalationInsuranceComp,
  esclatedCountInsuranceComp,
  searchByMobileTicketsInsuranceCompOnClick,
}) {
  const navigate = useNavigate();
  const userData = getSessionStorage("user");
  console.log("userData", userData);
  const viewTicketRight = getUserRightCodeAccess("td8b");
  const esclationTicketRight = getUserRightCodeAccess("bnb4");

  const ticketTypeListInsuranceComp = [
    { TicketTypeID: "1", TicketTypeName: "Grievance" },
    { TicketTypeID: "2", TicketTypeName: "Information" },
  ];

  const searchByoptionsInsuranceComp = [
    { value: "1", label: "Mobile No" },
    { value: "2", label: "Ticket No" },
  ];

  useEffect(() => {
    getFarmersTicketsInsuranceComp("ESCAL");
    getTicketSourceListDataInsuranceComp();
    getTicketStatusListDataInsuranceComp();
    getRegionalOfficeListData();
    getSchemeListDataInsuranceComp();
  }, []);

  return (
    <div className={BizClass.Box}>
      <div className={BizClass.PageBar}>
        {viewTicketRight ? (
          <div className={BizClass.ticketCounterBar}>
            <span>Open :</span>
            <p>{satatusCountInsuranceComp && satatusCountInsuranceComp.length > 0 ? satatusCountInsuranceComp[0].Open : 0}</p>
            <span>In-Progress :</span>
            <p>{satatusCountInsuranceComp && satatusCountInsuranceComp.length > 0 ? satatusCountInsuranceComp[0].InProgress : 0}</p>
            <span>Resolved(Grievance) :</span>
            <p>{satatusCountInsuranceComp && satatusCountInsuranceComp.length > 0 ? satatusCountInsuranceComp[0].ResolvedGrievance : 0}</p>
            <span>Resolved(Information) :</span>
            <p>{satatusCountInsuranceComp && satatusCountInsuranceComp.length > 0 ? satatusCountInsuranceComp[0].ResolvedInformation : 0}</p>
            <span>Re-Open :</span>
            <p>{satatusCountInsuranceComp && satatusCountInsuranceComp.length > 0 ? satatusCountInsuranceComp[0].ReOpen : 0}</p>
            <span>Total :</span>
            <p>{totalSatatusCountInsuranceComp}</p>
          </div>
        ) : null}

        <HeaderPortal>
          {viewTicketRight ? (
            <>
              <PageBar.Select
                ControlTxt="Search By"
                name="SearchByFilterInsuranceComp"
                getOptionLabel={(option) => `${option.label}`}
                getOptionValue={(option) => `${option}`}
                options={searchByoptionsInsuranceComp}
                value={filterValuesInsuranceComp.SearchByFilterInsuranceComp}
                onChange={(e) => updateFilterStateInsuranceComp("SearchByFilterInsuranceComp", e)}
              />
              <PageBar.Search
                placeholder="Search "
                name="txtSearchFilterInsuranceComp"
                value={filterValuesInsuranceComp.txtSearchFilter}
                onChange={(e) => updateFilterStateInsuranceComp(e.target.name, e.target.value)}
                onClick={() => searchByMobileTicketsInsuranceCompOnClick()}
                style={{ width: "158px" }}
              />
            </>
          ) : null}

          {/* {userData && userData.EscalationFlag && userData.EscalationFlag === "Y" ? (
            <PageBar.Button onClick={() => onClickEscalationInsuranceComp()} title="Escalated Tickets" style={{ display: "flex", alignItems: "center" }}>
              Escalated (<p style={{ minWidth: "22px" }}>{esclatedCountInsuranceComp}</p>)
            </PageBar.Button>
          ) : null} */}
          {esclationTicketRight && userData && userData.EscalationFlag && userData.EscalationFlag === "Y" ? (
            <PageBar.Button onClick={() => onClickEscalationInsuranceComp()} title="Escalated Tickets" style={{ display: "flex", alignItems: "center" }}>
              Escalated (<p style={{ minWidth: "22px" }}>{esclatedCountInsuranceComp}</p>)
            </PageBar.Button>
          ) : null}
        </HeaderPortal>
      </div>

      <div className={BizClass.MainBox}>
        {viewTicketRight ? (
          <>
            <div className={BizClass.DataBox}>
              {!isLoadingFarmersticketInsuranceComp ? (
                farmersTicketDataInsuranceComp && farmersTicketDataInsuranceComp.length > 0 ? (
                  farmersTicketDataInsuranceComp.map((data, i) => {
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
                        value={formValuesInsuranceComp.txtFromDate}
                        onChange={(e) => updateStateInsuranceComp("txtFromDate", e.target.value)}
                      />
                    </Form.InputGroup>
                    <Form.InputGroup label="To Date" req="false" errorMsg="">
                      <Form.InputControl
                        control="input"
                        type="date"
                        name="txtToDate"
                        value={formValuesInsuranceComp.txtToDate}
                        onChange={(e) => updateStateInsuranceComp("txtToDate", e.target.value)}
                      />
                    </Form.InputGroup>
                    <Form.InputGroup label="Type" req="false" errorMsg="">
                      <Form.InputControl
                        control="select"
                        name="txtTicketType"
                        value={formValuesInsuranceComp.txtTicketType}
                        options={ticketTypeListInsuranceComp}
                        getOptionLabel={(option) => `${option.TicketTypeName}`}
                        getOptionValue={(option) => `${option}`}
                        onChange={(e) => updateStateInsuranceComp("txtTicketType", e)}
                      />
                    </Form.InputGroup>
                    <Form.InputGroup label="Category" req="false" errorMsg="">
                      <Form.InputControl
                        control="select"
                        name="txtTicketCategoryType"
                        value={formValuesInsuranceComp.txtTicketCategoryType}
                        loader={isLoadingTicketCategoryTypeListInsuranceComp ? <Loader /> : null}
                        options={ticketCategoryTypeListInsuranceComp}
                        getOptionLabel={(option) => `${option.SupportTicketTypeName}`}
                        getOptionValue={(option) => `${option}`}
                        onChange={(e) => updateStateInsuranceComp("txtTicketCategoryType", e)}
                      />
                    </Form.InputGroup>
                    <Form.InputGroup label="Sub Category" req="false" errorMsg="">
                      <Form.InputControl
                        control="select"
                        name="txtTicketCategory"
                        options={ticketCategoryListInsuranceComp}
                        loader={isLoadingTicketCategoryListInsuranceComp ? <Loader /> : null}
                        getOptionLabel={(option) => `${option.TicketCategoryName}`}
                        getOptionValue={(option) => `${option}`}
                        value={formValuesInsuranceComp.txtTicketCategory}
                        onChange={(e) => updateStateInsuranceComp("txtTicketCategory", e)}
                      />
                    </Form.InputGroup>

                    <Form.InputGroup label="Source" req="false" errorMsg="">
                      <Form.InputControl
                        control="select"
                        name="txtTicketSource"
                        options={ticketSourceListInsuranceComp}
                        loader={isLoadingTicketSourceListInsuranceComp ? <Loader /> : null}
                        value={formValuesInsuranceComp.txtTicketSourceInsuranceComp}
                        getOptionLabel={(option) => `${option.TicketSourceName}`}
                        getOptionValue={(option) => `${option}`}
                        onChange={(e) => updateStateInsuranceComp("txtTicketSource", e)}
                      />
                    </Form.InputGroup>

                    <Form.InputGroup label="Status" req="false" errorMsg="">
                      <Form.InputControl
                        control="select"
                        name="txtStatus"
                        options={ticketStatusListInsuranceComp}
                        loader={isLoadingTicketStatusListInsuranceComp ? <Loader /> : null}
                        value={formValuesInsuranceComp.txtStatus}
                        getOptionLabel={(option) => `${option.CommonMasterValue}`}
                        getOptionValue={(option) => `${option}`}
                        onChange={(e) => updateStateInsuranceComp("txtStatus", e)}
                      />
                    </Form.InputGroup>
                    <Form.InputGroup label="Scheme" req="false" errorMsg="">
                      <Form.InputControl
                        control="select"
                        name="txtSchemeInsuranceComp"
                        value={formValuesInsuranceComp.txtSchemeInsuranceComp}
                        options={schemeListInsuranceComp}
                        loader={isLoadingSchemeListInsuranceCompDropdownDataList ? <Loader /> : null}
                        getOptionLabel={(option) => `${option.SchemeName}`}
                        getOptionValue={(option) => `${option}`}
                        onChange={(e) => updateStateInsuranceComp("txtSchemeInsuranceComp", e)}
                      />
                    </Form.InputGroup>

                    <Form.InputGroup label=" Regional Office" req="false" errorMsg="">
                      <Form.InputControl
                        control="select"
                        name="txtRegionalOffice"
                        options={regionalOfficeList}
                        loader={isLoadingRegionalOfficeList ? <Loader /> : null}
                        getOptionLabel={(option) => `${option.RegionOfficeName}`}
                        getOptionValue={(option) => `${option}`}
                        value={formValuesInsuranceComp.txtRegionalOffice}
                        onChange={(e) => updateStateInsuranceComp("txtRegionalOffice", e)}
                      />
                    </Form.InputGroup>

                    <Form.InputGroup label="State" req="false" errorMsg="">
                      <Form.InputControl
                        control="select"
                        name="txtStateInsuranceCompany"
                        options={stateInsuranceCompanyList}
                        loader={isLoadingStateInsuranceCompanyList ? <Loader /> : null}
                        getOptionLabel={(option) => `${option.StateMasterName}`}
                        getOptionValue={(option) => `${option}`}
                        value={formValuesInsuranceComp.txtStateInsuranceCompany}
                        onChange={(e) => updateStateInsuranceComp("txtStateInsuranceCompany", e)}
                      />
                    </Form.InputGroup>
                  </div>
                </Form>
              </div>
              <div className={BizClass.Footer}>
                <button type="button" onClick={() => refereshFarmerTicketInsuranceComp()}>
                  Apply
                </button>
                &nbsp;
                <button type="button" onClick={() => ClearTicketFiltersTicketInsuranceComp()}>
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

export default InsuranceCompManageTicket;

InsuranceCompManageTicket.propTypes = {
  isLoadingFarmersticketInsuranceComp: PropTypes.bool.isRequired,
  ticketCategoryListInsuranceComp: PropTypes.array.isRequired,
  isLoadingTicketCategoryListInsuranceComp: PropTypes.bool,
  formValuesInsuranceComp: PropTypes.object.isRequired,
  updateStateInsuranceComp: PropTypes.func.isRequired,
  ticketCategoryTypeListInsuranceComp: PropTypes.array.isRequired,
  getFarmersTicketsInsuranceComp: PropTypes.func.isRequired,
  farmersTicketDataInsuranceComp: PropTypes.array.isRequired,
  isLoadingTicketCategoryTypeListInsuranceComp: PropTypes.bool,
  refereshFarmerTicketInsuranceComp: PropTypes.func.isRequired,
  ClearTicketFiltersTicketInsuranceComp: PropTypes.func.isRequired,
  getTicketSourceListDataInsuranceComp: PropTypes.func.isRequired,
  ticketSourceListInsuranceComp: PropTypes.array.isRequired,
  isLoadingTicketSourceListInsuranceComp: PropTypes.bool,
  getTicketStatusListDataInsuranceComp: PropTypes.func.isRequired,
  ticketStatusListInsuranceComp: PropTypes.array.isRequired,
  isLoadingTicketStatusListInsuranceComp: PropTypes.bool,
  getRegionalOfficeListData: PropTypes.func.isRequired,
  regionalOfficeList: PropTypes.array.isRequired,
  isLoadingRegionalOfficeList: PropTypes.bool,
  stateInsuranceCompanyList: PropTypes.array.isRequired,
  isLoadingStateInsuranceCompanyList: PropTypes.bool,
  getSchemeListDataInsuranceComp: PropTypes.func.isRequired,
  schemeListInsuranceComp: PropTypes.array.isRequired,
  isLoadingSchemeListInsuranceCompDropdownDataList: PropTypes.bool,
  satatusCountInsuranceComp: PropTypes.array.isRequired,
  updateFilterStateInsuranceComp: PropTypes.func.isRequired,
  totalSatatusCountInsuranceComp: PropTypes.string,
  filterValuesInsuranceComp: PropTypes.object.isRequired,
  onClickEscalationInsuranceComp: PropTypes.func.isRequired,
  esclatedCountInsuranceComp: PropTypes.string,
  searchByMobileTicketsInsuranceCompOnClick: PropTypes.func.isRequired,
};
