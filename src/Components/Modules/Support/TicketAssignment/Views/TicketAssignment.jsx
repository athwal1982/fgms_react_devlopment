import React, { useState } from "react";
import PropTypes from "prop-types";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { Button, Loader, Splitter } from "Framework/Components/Widgets";
import moment from "moment";
import { Convert24FourHourAndMinute, dateToSpecificFormat } from "Configration/Utilities/dateformat";
import { RiFileUserLine } from "react-icons/ri";
import BizClass from "./TicketAssignment.module.scss";
import TicketAssignmentModal from "./Modal/TicketAssignmentModal";

function TicketAssignment({
  isLoadingSearchTickets,
  isLoadingUserList,
  onGridReadyTicket,
  onGridReadyUser,
  onSearchTickets,
  SearchTickets,
  UserList,
  updateFilterState,
  stateList,
  isLoadingStateList,
  isLoadingTicketCategoryTypeList,
  ticketCategoryTypeList,
  ticketCategoryList,
  isLoadingTicketCategoryList,
  filterValues,
  handleAssignTickets,
  getUserWiseTicketLister,
  isLoadingTicketAssignment,
  onChangeTicketAssignmentModalList,
  onGridReadyTicketCount,
  ticketCount,
  setSelectedTickets,
}) {
  const ticketTypeList = [
    { TicketTypeID: "1", TicketTypeName: "Grievance" },
    { TicketTypeID: "2", TicketTypeName: "Information" },
    { TicketTypeID: "4", TicketTypeName: "Crop Loss Intimation" },
  ];

  const [openToggleViewTicketAssignmentPopup, setOpenToggleViewTicketAssignmentPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const AssignTicketCellRenderer = ({ value, data }) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <span style={{ marginRight: "10px" }}>{value}</span>
      {value > 0 ? (
        <RiFileUserLine
          style={{ marginLeft: "10px", fontSize: "20px", color: "#34495E", cursor: "pointer" }}
          onClick={() => toggleViewTicketAssignment(data)}
        />
      ) : (
        ""
      )}
    </div>
  );

  const toggleViewTicketAssignment = (userData) => {
    setSelectedUser(userData);
    setOpenToggleViewTicketAssignmentPopup((prevState) => !prevState);
  };

  const todayDate = moment().format("YYYY-MM-DD");

  const checkboxSelection = (params) => {
    console.log(params);
    if (params.node.data.isAssign === 1) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <div className={BizClass.PageStart}>
      <PageBar>
        <div className={BizClass.ticketCountBanner}>Un-Assigned Ticket Count : &nbsp;{ticketCount ? `(${ticketCount})` : "(0)"}</div>

        {/* <PageBar.Input
              ControlTxt="From Date"
              control="input"
              type="date"
              name="txtFromDate"
              value={filterValues.txtFromDate}
              onChange={(e) => updateFilterState("txtFromDate", e.target.value)}
            />
            <PageBar.Input
              ControlTxt="To Date"
              control="input"
              type="date"
              name="txtToDate"
              value={filterValues.txtToDate}
              onChange={(e) => updateFilterState("txtToDate", e.target.value)}
              max={todayDate}
            /> */}
        <PageBar.Select
          ControlTxt="State"
          name="txtState"
          label="State"
          value={filterValues.txtState}
          loader={isLoadingStateList ? <Loader /> : null}
          options={stateList}
          getOptionLabel={(option) => `${option.StateName}`}
          getOptionValue={(option) => `${option.StateMasterID}`}
          onChange={(e) => updateFilterState("txtState", e)}
        />
        <PageBar.Select
          ControlTxt="Search By"
          name="txtTicketType"
          label="Ticket Type"
          value={filterValues.txtTicketType}
          options={ticketTypeList}
          getOptionLabel={(option) => option.TicketTypeName}
          getOptionValue={(option) => option.TicketTypeID}
          onChange={(e) => updateFilterState("txtTicketType", e)}
        />
        <PageBar.Select
          ControlTxt="Search By"
          name="txtTicketCategoryType"
          label="Ticket Category"
          value={filterValues.txtTicketCategoryType}
          isLoading={isLoadingTicketCategoryTypeList}
          options={ticketCategoryTypeList}
          getOptionLabel={(option) => option.SupportTicketTypeName}
          getOptionValue={(option) => option.SupportTicketTypeID}
          onChange={(e) => updateFilterState("txtTicketCategoryType", e)}
        />
        <PageBar.Select
          ControlTxt="Search By"
          name="txtTicketCategory"
          value={filterValues.txtTicketCategory}
          options={ticketCategoryList}
          isLoading={isLoadingTicketCategoryList}
          getOptionLabel={(option) => option.TicketCategoryName}
          getOptionValue={(option) => option.TicketCategoryID}
          onChange={(e) => updateFilterState("txtTicketCategory", e)}
        />

        <Button type="button" varient="primary" onClick={() => onSearchTickets()}>
          Search
        </Button>
        <Button type="button" varient="danger" onClick={() => handleAssignTickets()}>
          Assign
        </Button>
      </PageBar>
      <Splitter varient="column" template="1.2fr 8px 1fr">
        <div className={BizClass.Card} style={{ minWidth: "550px" }}>
          <DataGrid
            rowData={SearchTickets}
            loader={isLoadingSearchTickets ? <Loader /> : null}
            onGridReady={onGridReadyTicket}
            rowSelection="multiple"
            rowMultiSelectWithClick
            onSelectionChanged={(selection) => setSelectedTickets(selection)}
          >
            <DataGrid.Column
              headerName=""
              lockPosition="1"
              pinned="left"
              width={100}
              headerCheckboxSelection
              headerCheckboxSelectionFilteredOnly
              checkboxSelection={checkboxSelection}
            />
            <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} />

            <DataGrid.Column headerName="Ticket No" field="SupportTicketNo" width={150} />
            <DataGrid.Column headerName="Farmer Name" field="RequestorName" width={220} />
            <DataGrid.Column headerName="Mobile No" field="RequestorMobileNo" width={100} />
            <DataGrid.Column headerName="Policy No" field="InsurancePolicyNo" width={180} />
            <DataGrid.Column headerName="Application No" field="ApplicationNo" width={180} />
            <DataGrid.Column headerName="Insurance Company" field="InsuranceCompany" width={260} />
            <DataGrid.Column field="TicketHeadName" headerName="Type" width="140px" />
            <DataGrid.Column field="TicketTypeName" headerName="Category" width="180px" />
            <DataGrid.Column field="TicketCategoryName" headerName="Sub Category" width="200px" />
            <DataGrid.Column headerName="State Name" field="StateMasterName" width={150} />
            <DataGrid.Column headerName="Scheme" field="SchemeName" width={280} />
            <DataGrid.Column
              field="RequestSeason"
              headerName="Season"
              width="100px"
              valueFormatter={(param) => (param.value && param.value === 1 ? "Kharif" : param.value === 2 ? "Rabi" : "")}
            />
            <DataGrid.Column headerName="Ticket Description" field="TicketDescription" width={220} />
            <DataGrid.Column
              field="#"
              headerName="Created At"
              width="145px"
              valueGetter={(node) => {
                return node.data.CreatedAt
                  ? dateToSpecificFormat(
                      `${node.data.CreatedAt.split("T")[0]} ${Convert24FourHourAndMinute(node.data.CreatedAt.split("T")[1])}`,
                      "DD-MM-YYYY HH:mm",
                    )
                  : null;
              }}
            />
          </DataGrid>
        </div>

        <div className={BizClass.Card} style={{ minWidth: "550px" }}>
          <DataGrid
            rowData={UserList}
            loader={isLoadingUserList ? <Loader /> : null}
            onGridReady={onGridReadyUser}
            rowSelection="single"
            onSelectionChanged={(selection) => setSelectedUser(selection[0])}
          >
            <DataGrid.Column headerName="" lockPosition="1" pinned="left" width={100} checkboxSelection />
            <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} />
            <DataGrid.Column headerName="User" field="UserDisplayName" width={210} />
            <DataGrid.Column headerName="Assign Ticket" field="ticketcount" width={210} cellRenderer={AssignTicketCellRenderer} />
          </DataGrid>
        </div>
      </Splitter>

      {openToggleViewTicketAssignmentPopup && (
        <TicketAssignmentModal
          toggleViewTicketAssignment={toggleViewTicketAssignment}
          selectedUser={selectedUser}
          isLoadingTicketAssignment={isLoadingTicketAssignment}
          getUserWiseTicketLister={getUserWiseTicketLister}
          onChangeTicketAssignmentModalList={onChangeTicketAssignmentModalList}
          onGridReadyTicketCount={onGridReadyTicketCount}
        />
      )}
    </div>
  );
}

TicketAssignment.propTypes = {
  isLoadingSearchTickets: PropTypes.bool.isRequired,
  isLoadingUserList: PropTypes.bool.isRequired,
  onAssignTicket: PropTypes.func.isRequired,
  onGridReadyTicket: PropTypes.func.isRequired,
  onGridReadyUser: PropTypes.func.isRequired,
  onSearchTickets: PropTypes.func.isRequired,
  SearchTickets: PropTypes.array.isRequired,
  UserList: PropTypes.array.isRequired,
  updateFilterState: PropTypes.func.isRequired,
  stateList: PropTypes.array.isRequired,
  isLoadingStateList: PropTypes.bool,
  isLoadingTicketCategoryTypeList: PropTypes.bool.isRequired,
  ticketCategoryTypeList: PropTypes.array.isRequired,
  ticketCategoryList: PropTypes.array.isRequired,
  isLoadingTicketCategoryList: PropTypes.bool.isRequired,
  filterValues: PropTypes.object.isRequired,
  handleAssignTickets: PropTypes.func.isRequired,
  getUserWiseTicketLister: PropTypes.func.isRequired,
  isLoadingTicketAssignment: PropTypes.bool.isRequired,
  onChangeTicketAssignmentModalList: PropTypes.func.isRequired,
  onGridReadyTicketCount: PropTypes.func.isRequired,
};

export default TicketAssignment;
