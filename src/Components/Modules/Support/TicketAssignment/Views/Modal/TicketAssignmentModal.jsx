import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { Modal } from "../../../../../../Framework/Components/Layout";
import BizClass from "./TicketAssignmentModal.module.scss";
import { Loader } from "Framework/Components/Widgets";

function TicketAssignmentModal({
  onGridReadyTicketCount,
  onChangeTicketAssignmentModalList,
  TicketAssignmentModalList,
  toggleViewTicketAssignment,
  selectedUser,
  getUserWiseTicketLister,
  isLoadingTicketAssignment,
}) {
  const [UserTicketList, setUserTicketList] = useState([]);

  const fetchUserTickets = async () => {
    debugger;
    if (selectedUser && selectedUser.AppAccessID) {
      try {
        const tickets = await getUserWiseTicketLister(selectedUser.AppAccessID);
        setUserTicketList(tickets);
      } catch (error) {
        console.error("Failed to fetch user tickets:", error);
      }
    }
  };

  useEffect(() => {
    fetchUserTickets();
  }, [selectedUser]);

  return (
    <Modal title="User Ticket Assigned" varient="half" show={toggleViewTicketAssignment} right="0" width="49.5vw">
      <Modal.Body>
        <div className={BizClass.Card}>
          <PageBar>
            <PageBar.Search value={TicketAssignmentModalList} onChange={(e) => onChangeTicketAssignmentModalList(e.target.value)} />
          </PageBar>
          <DataGrid rowData={UserTicketList} loader={isLoadingTicketAssignment ? <Loader /> : null} onGridReady={onGridReadyTicketCount}>
            <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width="80px" />
            <DataGrid.Column headerName="Ticket No" field="SupportTicketNo" width={150} />
            <DataGrid.Column headerName="Farmer Name" field="RequestorName" width={220} />
            <DataGrid.Column headerName="Mobile No" field="RequestorMobileNo" width={150} />
            <DataGrid.Column headerName="Policy No" field="InsurancePolicyNo" width={180} />
            <DataGrid.Column headerName="Application No" field="ApplicationNo" width={180} />
            <DataGrid.Column field="TicketHeadName" headerName="Type" width="140px" />
            <DataGrid.Column field="TicketTypeName" headerName="Category" width="180px" />
            <DataGrid.Column field="TicketCategoryName" headerName="Sub Category" width="200px" />
            <DataGrid.Column headerName="Insurance Company" field="InsuranceCompany" width={260} />
            <DataGrid.Column headerName="State Name" field="StateMasterName" width={150} />
            <DataGrid.Column headerName="Scheme" field="SchemeName" width={280} />
            <DataGrid.Column headerName="Season" field="CropSeasonName" width={100} />
            <DataGrid.Column headerName="Ticket Description" field="TicketDescription" width={220} />
          </DataGrid>
        </div>
      </Modal.Body>
      <Modal.Footer />
    </Modal>
  );
}

TicketAssignmentModal.propTypes = {
  toggleViewTicketAssignment: PropTypes.func.isRequired,
  isLoadingTicketAssignment: PropTypes.bool.isRequired,
  TicketAssignmentModalList: PropTypes.string,
};

export default TicketAssignmentModal;
