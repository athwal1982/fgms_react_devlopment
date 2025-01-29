import React, { useState } from "react";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import PropTypes from "prop-types";
import { Loader } from "Framework/Components/Widgets";
import BizClass from "./Ageing.module.scss";
import AgeingTicketList from "../Views/Modal/AgeingTicketList";

function AgeingReport({
  filteredAgeingReportDataList,
  isLoadingAgeingReportDataList,
  formValues,
  updateState,
  onGridReady,
  reportFilterList,
  onClickAgeingReport,
  exportClick,
  ageingTicketCountList,
  isLoadingAgeingTicketCountList,
  getAgeingReportsDetailsList,
  exportAgeingTicketListClick,
}) {
  const [openAgeingTicketModal, setOpenAgeingTicketModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const openAgeingTicketListClick = (data, headerName) => {
    setSelectedRowData(data);
    debugger;
    if (data) {
      let pViewMode =
        formValues && formValues.txtReportFilter && formValues.txtReportFilter.Value === "Insurance"
          ? "I"
          : formValues.txtReportFilter.Value === "State"
          ? "S"
          : formValues.txtReportFilter.Value === "Category"
          ? "C"
          : formValues.txtReportFilter.Value === "Status"
          ? "All"
          : "";
      let pFiterlID = data && data.ID ? data.ID : 0;
      let pageingPeriodsID =
        headerName === "Total Open Ticket"
          ? "0"
          : headerName === "0-3 days"
          ? "1"
          : headerName === "4-7 days"
          ? "2"
          : headerName === "8-12 days"
          ? "3"
          : headerName === "13-15 days"
          ? "4"
          : headerName === "More than 16"
          ? "5"
          : "";
      getAgeingReportsDetailsList(pViewMode, pFiterlID, pageingPeriodsID);
    }
    setOpenAgeingTicketModal(!openAgeingTicketModal);
  };
  return (
    <>
      {openAgeingTicketModal && (
        <AgeingTicketList
          openAgeingTicketListClick={openAgeingTicketListClick}
          selectedRowData={selectedRowData}
          ageingTicketCountList={ageingTicketCountList}
          isLoadingAgeingTicketCountList={isLoadingAgeingTicketCountList}
          exportAgeingTicketListClick={exportAgeingTicketListClick}
        />
      )}
      <div className={BizClass.PageStart}>
        <PageBar>
          <PageBar.Select
            ControlTxt="Report Type"
            name="txtReportFilter"
            value={formValues.txtReportFilter}
            options={reportFilterList}
            getOptionLabel={(option) => `${option.Name}`}
            getOptionValue={(option) => `${option}`}
            onChange={(e) => updateState("txtReportFilter", e)}
          />
          <PageBar.Button onClick={() => onClickAgeingReport()} title="Clear">
            Search
          </PageBar.Button>
          <PageBar.ExcelButton onClick={() => exportClick()} disabled={filteredAgeingReportDataList.length === 0}>
            Export
          </PageBar.ExcelButton>
        </PageBar>

        <DataGrid
          onGridReady={onGridReady}
          rowData={filteredAgeingReportDataList}
          loader={isLoadingAgeingReportDataList ? <Loader /> : false}
          frameworkComponents={{
            totalOpenTicketCellStyle,
            zeroto3daysCellStyle,
            fourto7daysCellStyle,
            eighttotwelvedaysCellStyle,
            thirteentofifteendaysCellStyle,
            morthansixteenCellStyle,
          }}
        >
          <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
          <DataGrid.Column
            field="Name"
            headerName={
              formValues.txtReportFilter
                ? formValues.txtReportFilter.Value === "Insurance"
                  ? "Insurance Company"
                  : formValues.txtReportFilter.Value === "State"
                  ? "State Name"
                  : formValues.txtReportFilter.Value === "Category"
                  ? "Category"
                  : formValues.txtReportFilter.Value === "Status"
                  ? "Status"
                  : "#"
                : "#"
            }
            width={280}
          />
          <DataGrid.Column
            field={["Total Open Ticket"]}
            headerName="Total Open Ticket"
            width={150}
            cellStyle={{ "text-align": "right" }}
            cellRenderer="totalOpenTicketCellStyle"
            cellRendererParams={{
              openAgeingTicketListClick,
            }}
          />
          <DataGrid.Column
            field={["0-3 days"]}
            headerName="0-3 days"
            width={140}
            cellStyle={{ "text-align": "right" }}
            cellRenderer="zeroto3daysCellStyle"
            cellRendererParams={{
              openAgeingTicketListClick,
            }}
          />
          <DataGrid.Column
            field={["4-7 days"]}
            headerName="4-7 days"
            width={110}
            cellStyle={{ "text-align": "right" }}
            cellRenderer="fourto7daysCellStyle"
            cellRendererParams={{
              openAgeingTicketListClick,
            }}
          />
          <DataGrid.Column
            field={["8-12 days"]}
            headerName="8-12 days"
            width={110}
            cellStyle={{ "text-align": "right" }}
            cellRenderer="eighttotwelvedaysCellStyle"
            cellRendererParams={{
              openAgeingTicketListClick,
            }}
          />
          <DataGrid.Column
            field={["13-15 days"]}
            headerName="13-15 days"
            width={110}
            cellStyle={{ "text-align": "right" }}
            cellRenderer="thirteentofifteendaysCellStyle"
            cellRendererParams={{
              openAgeingTicketListClick,
            }}
          />
          <DataGrid.Column
            field={["More than 16"]}
            headerName="More than 16"
            width={115}
            cellStyle={{ "text-align": "right" }}
            cellRenderer="morthansixteenCellStyle"
            cellRendererParams={{
              openAgeingTicketListClick,
            }}
          />
        </DataGrid>
      </div>
    </>
  );
}
const totalOpenTicketCellStyle = (params) => {
  return (
    <div>
      {params.data && params.data["Total Open Ticket"] ? (
        <a href="#" style={{ cursor: "pointer" }} onClick={() => params.openAgeingTicketListClick(params.data, "Total Open Ticket")}>
          {params.data["Total Open Ticket"]}
        </a>
      ) : (
        "0"
      )}
    </div>
  );
};
const zeroto3daysCellStyle = (params) => {
  return (
    <div>
      {params.data && params.data["0-3 days"] ? (
        <a href="#" style={{ cursor: "pointer" }} onClick={() => params.openAgeingTicketListClick(params.data, "0-3 days")}>
          {params.data["0-3 days"]}
        </a>
      ) : (
        "0"
      )}
    </div>
  );
};
const fourto7daysCellStyle = (params) => {
  return (
    <div>
      {params.data && params.data["4-7 days"] ? (
        <a href="#" style={{ cursor: "pointer" }} onClick={() => params.openAgeingTicketListClick(params.data, "4-7 days")}>
          {params.data["4-7 days"]}
        </a>
      ) : (
        "0"
      )}
    </div>
  );
};

const eighttotwelvedaysCellStyle = (params) => {
  return (
    <div>
      {params.data && params.data["8-12 days"] ? (
        <a href="#" style={{ cursor: "pointer" }} onClick={() => params.openAgeingTicketListClick(params.data, "8-12 days")}>
          {params.data["8-12 days"]}
        </a>
      ) : (
        "0"
      )}
    </div>
  );
};

const thirteentofifteendaysCellStyle = (params) => {
  return (
    <div>
      {params.data && params.data["13-15 days"] ? (
        <a href="#" style={{ cursor: "pointer" }} onClick={() => params.openAgeingTicketListClick(params.data, "13-15 days")}>
          {params.data["13-15 days"]}
        </a>
      ) : (
        "0"
      )}
    </div>
  );
};

const morthansixteenCellStyle = (params) => {
  return (
    <div>
      {params.data && params.data["More than 16"] ? (
        <a href="#" style={{ cursor: "pointer" }} onClick={() => params.openAgeingTicketListClick(params.data, "More than 16")}>
          {params.data["More than 16"]}
        </a>
      ) : (
        "0"
      )}
    </div>
  );
};

export default AgeingReport;
AgeingReport.propTypes = {
  filteredAgeingReportDataList: PropTypes.array,
  isLoadingAgeingReportDataList: PropTypes.bool,
  onGridReady: PropTypes.func.isRequired,
  reportFilterList: PropTypes.array,
  formValues: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired,
  onClickAgeingReport: PropTypes.func.isRequired,
  exportClick: PropTypes.func.isRequired,
  ageingTicketCountList: PropTypes.array,
  isLoadingAgeingTicketCountList: PropTypes.bool,
  getAgeingReportsDetailsList: PropTypes.func.isRequired,
};
