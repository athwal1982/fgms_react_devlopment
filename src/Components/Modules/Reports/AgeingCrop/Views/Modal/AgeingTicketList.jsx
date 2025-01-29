import React from "react";
import { DataGrid, Modal, PageBar } from "Framework/Components/Layout";
import { Loader } from "Framework/Components/Widgets";
import { dateFormatDDMMYY } from "Configration/Utilities/dateformat";
import BizClass from "./AgeingTicketList.module.scss";
function AgeingTicketList({ selectedRowData, openAgeingTicketListClick, ageingTicketCountList, isLoadingAgeingTicketCountList, exportAgeingTicketListClick }) {
  console.log(selectedRowData);
  return (
    <Modal varient="half" title="Ageing(Crop) Ticket Details" show={openAgeingTicketListClick} right="0" width="75vw">
      <Modal.Body>
        <div className={BizClass.Card}>
          <PageBar>
            <PageBar.Search />
            <PageBar.ExcelButton onClick={() => exportAgeingTicketListClick()} disabled={ageingTicketCountList.length === 0}>
              Export
            </PageBar.ExcelButton>
          </PageBar>
          <DataGrid rowData={ageingTicketCountList} loader={isLoadingAgeingTicketCountList ? <Loader /> : false}>
            <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
            <DataGrid.Column field="SupportTicketNo" headerName="Ticket No" width="160px" />
            <DataGrid.Column
              field="#"
              headerName="Creation Date"
              width="128px"
              valueGetter={(node) => {
                return node.data.Created ? `${dateFormatDDMMYY(node.data.Created.split("T")[0])}` : null;
              }}
            />
            <DataGrid.Column field="TicketStatus" headerName="Ticket Status" width="150px" />
            <DataGrid.Column field="StateMasterName" headerName="State" width="150px" />
            <DataGrid.Column field="DistrictMasterName" headerName="District" width="150px" />
            <DataGrid.Column field="TicketHeadName" headerName="Type" width="150px" />
            <DataGrid.Column field="TicketTypeName" headerName="Category" width="160px" />
            <DataGrid.Column field="TicketCategoryName" headerName="Sub Category" width="170px" />
            <DataGrid.Column field="CropSeasonName" headerName="Season" width="90px" />
            <DataGrid.Column field="RequestYear" headerName="Year" width="70px" />
            <DataGrid.Column field="InsuranceCompany" headerName="Insurance Company" width="290px" />
            <DataGrid.Column field="ApplicationNo" headerName="Application No" width="210px" />
            <DataGrid.Column field="InsurancePolicyNo" headerName="Policy No" width="170px" />
            <DataGrid.Column field="CallerContactNumber" headerName="Caller Mobile No." width="140px" />
            <DataGrid.Column field="RequestorName" headerName="Farmer Name" width="220px" />
            <DataGrid.Column field="RequestorMobileNo" headerName="Mobile No" width="125px" />
            <DataGrid.Column field="TicketDescription" headerName="Description" width="290px" />
          </DataGrid>
        </div>
      </Modal.Body>
      <Modal.Footer />
    </Modal>
  );
}

export default AgeingTicketList;
