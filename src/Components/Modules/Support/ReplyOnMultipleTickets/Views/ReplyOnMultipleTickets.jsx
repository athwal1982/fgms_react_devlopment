import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { Button, Loader } from "Framework/Components/Widgets";
import { FaFileUpload } from "react-icons/fa";
import PropTypes from "prop-types";
import { getUserRightCodeAccess } from "Components/Common/Login/Auth/auth";
// A import moment from "moment";
import { Convert24FourHourAndMinute, dateToSpecificFormat } from "Configration/Utilities/dateformat";
import BizClass from "./ReplyOnMultipleTickets.module.scss";
import HeaderPortal from "../../ManageTicket/Views/Layout/FarmerAuthenticateModal/HeaderPortal";
import TicketStatus from "./Modals/TicketStatus/TicketStatus";
import ReplyWithExcel from "./Modals/TicketStatus/ReplyWithExcel";
import UploadedFileStatusList from  "./Modals/UploadedFileStatusList";

function ReplyOnMultipleTickets({
  isLoadingFarmersticket,
  farmersTicketData,
  getTicketStatusListData,
  updateFilterState,
  searchTicketListOnClick,
  satatusCount,
  totalSatatusCount,
  filterValues,
  onGridReady,
  isLoadingTicketCategoryTypeList,
  ticketCategoryTypeList,
  ticketStatusList,
  isLoadingTicketStatusList,
  ticketCategoryList,
  isLoadingTicketCategoryList,
  gridApi,
  chkisDisable,
  setchkisDisable,
  setSatatusCount,
  settotalSatatusCount,
  setFarmersTicketData,
}) {
  const navigate = useNavigate();
  const setAlertMessage = AlertMessage();
  const viewTicketRight = getUserRightCodeAccess("td8b");

  const [openTicketStatusModal, setOpenTicketStatusModal] = useState(false);
  const [selectedTicketData, setSelectedTicketData] = useState([]);

  const getSelectedRowData = (pgridApi) => {
    const selectedNodes = pgridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    return selectedData;
  };

  const openUpdateTicketStatusPopUp = (pgridApi) => {
    if (pgridApi) {
      const checkedItem = getSelectedRowData(pgridApi);
      if (checkedItem.length === 0) {
        setAlertMessage({
          type: "error",
          message: "Please select atleast one ticket.",
        });
        return;
      }
      if (checkedItem.length > 20) {
        setAlertMessage({
          type: "error",
          message: "Please select only 20 tickets.",
        });
        return;
      }
      setSelectedTicketData(checkedItem);
    }
    setOpenTicketStatusModal(!openTicketStatusModal);
  };

  const [openReplyWithExcelModal, setOpenReplyWithExcelModal] = useState(false);
  const openReplyWithExcelPopUp = () => {
    if (farmersTicketData.length === 0) {
      setAlertMessage({
        type: "error",
        message: "Please search the tickets to upload.",
      });
      return;
    }
    setOpenReplyWithExcelModal(!openReplyWithExcelModal);
  };

  const goBackOnClick = () => {
    navigate("/ManageTicket");
  };

  const ticketTypeList = [
    { TicketTypeID: "1", TicketTypeName: "Grievance" },
    { TicketTypeID: "2", TicketTypeName: "Information" },
    { TicketTypeID: "4", TicketTypeName: "Crop Loss Intimation" },
  ];

  const updateReplyOnMultipleTicket = (selectedTicketData) => {
    setchkisDisable("YES");
    if (gridApi) {
      console.log(selectedTicketData);
      gridApi.forEachNode(function (rowNode) {
        rowNode.setSelected(false);
      });

      const itemsToUpdate = [];
      gridApi.forEachNode(function (rowNode) {
        selectedTicketData.forEach((val) => {
          if (rowNode.data.SupportTicketID === val.SupportTicketID) {
            itemsToUpdate.push(val);
            rowNode.setData(val);
          }
        });
      });
      gridApi.updateRowData({
        update: itemsToUpdate,
      });
    }
  };

  const [openUploadedFileStatusListModal, setopenUploadedFileStatusListModal] = useState(false);
  const uploadedFileStatusOnClick = () => {
    setopenUploadedFileStatusListModal(!openUploadedFileStatusListModal);
  };

  useEffect(() => {
    getTicketStatusListData();
  }, []);

  const getRowStyle = (params) => {
    if (params.data.IsRowUpdated === 1) {
      return { background: "#d5a10e" };
    }
    return { background: "" };
  };

  return (
    <>
      {openTicketStatusModal && (
        <TicketStatus
          showfunc={openUpdateTicketStatusPopUp}
          selectedTicketData={selectedTicketData}
          updateReplyOnMultipleTicket={updateReplyOnMultipleTicket}
        />
      )}
      {openReplyWithExcelModal && (
        <ReplyWithExcel
          showfunc={openReplyWithExcelPopUp}
          farmersTicketData={farmersTicketData}
          filterValues={filterValues}
          setFarmersTicketData={setFarmersTicketData}
          setSatatusCount={setSatatusCount}
          settotalSatatusCount={settotalSatatusCount}
        />
      )}
      {openUploadedFileStatusListModal && (
        <UploadedFileStatusList
        uploadedFileStatusOnClick={uploadedFileStatusOnClick}
        setAlertMessage={setAlertMessage}
        />
      )}
      <div className={BizClass.Box}>
        <div className={BizClass.PageBar}>
          {viewTicketRight ? (
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
              <p style={{margin:"10px"}}>
                <FaFileUpload style={{ cursor: "pointer", width: "32px" }} onClick={() => openReplyWithExcelPopUp(gridApi)} />
                <Button type="button" varient="title" onClick={() =>  uploadedFileStatusOnClick()} >
                               Uploaded File Status
                </Button>
              </p>
            </div>
          ) : null}
          <HeaderPortal>
            {viewTicketRight ? (
              <>
                <PageBar.Select
                  ControlTxt="Search By"
                  name="txtTicketType"
                  value={filterValues.txtTicketType}
                  options={ticketTypeList}
                  getOptionLabel={(option) => `${option.TicketTypeName}`}
                  getOptionValue={(option) => `${option}`}
                  onChange={(e) => updateFilterState("txtTicketType", e)}
                />
                <PageBar.Select
                  ControlTxt="Search By"
                  name="txtTicketCategoryType"
                  value={filterValues.txtTicketCategoryType}
                  isLoading={isLoadingTicketCategoryTypeList}
                  options={ticketCategoryTypeList}
                  getOptionLabel={(option) => `${option.SupportTicketTypeName}`}
                  getOptionValue={(option) => `${option}`}
                  onChange={(e) => updateFilterState("txtTicketCategoryType", e)}
                />
                <PageBar.Select
                  ControlTxt="Search By"
                  name="txtTicketCategory"
                  options={ticketCategoryList}
                  isLoading={isLoadingTicketCategoryList}
                  getOptionLabel={(option) => `${option.TicketCategoryName}`}
                  getOptionValue={(option) => `${option}`}
                  value={filterValues.txtTicketCategory}
                  onChange={(e) => updateFilterState("txtTicketCategory", e)}
                />
                <PageBar.Select
                  ControlTxt="Search By"
                  name="SearchByFilter"
                  isLoading={isLoadingTicketStatusList}
                  getOptionLabel={(option) => `${option.CommonMasterValue}`}
                  getOptionValue={(option) => `${option}`}
                  options={ticketStatusList}
                  value={filterValues.txtStatus}
                  onChange={(e) => updateFilterState("txtStatus", e)}
                />
                <Button type="button" varient="primary" onClick={() => searchTicketListOnClick()}>
                  Search
                </Button>
              </>
            ) : null}

            <Button
              type="button"
              varient="title"
              className={chkisDisable === "NO" ? "" : BizClass.disabledDivContent}
              onClick={() => openUpdateTicketStatusPopUp(gridApi)}
            >
              Reply
            </Button>
            <Button type="button" title="Go Back" varient="title" onClick={() => goBackOnClick()}>
              Back
            </Button>
          </HeaderPortal>
        </div>
        <div className={BizClass.MainBox}>
          {viewTicketRight ? (
            <DataGrid
              rowData={farmersTicketData}
              loader={isLoadingFarmersticket ? <Loader /> : null}
              getRowStyle={getRowStyle}
              onGridReady={onGridReady}
              suppressContextMenu={true}
              rowMultiSelectWithClick={true}
              rowSelection="multiple"
              suppressRowClickSelection={false}
            >
              <DataGrid.Column
                lockPosition="1"
                pinned="left"
                headerName=""
                field=""
                width={90}
                headerCheckboxSelection
                headerCheckboxSelectionFilteredOnly
                checkboxSelection
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
              <DataGrid.Column field="CreatedBY" headerName="Created By" width="160px" />
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
          ) : (
            <div style={{ "text-align": "center" }}>You are not authorized to view ticket list</div>
          )}
        </div>
      </div>
    </>
  );
}

export default ReplyOnMultipleTickets;

ReplyOnMultipleTickets.propTypes = {
  isLoadingFarmersticket: PropTypes.bool.isRequired,
  ticketCategoryList: PropTypes.array.isRequired,
  isLoadingTicketCategoryList: PropTypes.bool,
  formValues: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired,
  ticketCategoryTypeList: PropTypes.array.isRequired,
  farmersTicketData: PropTypes.array.isRequired,
  isLoadingTicketCategoryTypeList: PropTypes.bool,
  getTicketStatusListData: PropTypes.func.isRequired,
  ticketStatusList: PropTypes.array.isRequired,
  isLoadingTicketStatusList: PropTypes.bool,
  updateFilterState: PropTypes.func.isRequired,
  searchTicketListOnClick: PropTypes.func.isRequired,
  satatusCount: PropTypes.array.isRequired,
  totalSatatusCount: PropTypes.string,
  filterValues: PropTypes.object.isRequired,
  userRightDataList: PropTypes.array.isRequired,
  getUserRightDataList: PropTypes.func.isRequired,
  onGridReady: PropTypes.func.isRequired,
  gridApi: PropTypes.object,
  chkisDisable: PropTypes.string,
  setchkisDisable: PropTypes.func.isRequired,
  setFarmersTicketData: PropTypes.func.isRequired,
  setSatatusCount: PropTypes.func.isRequired,
  settotalSatatusCount: PropTypes.func.isRequired,
};
