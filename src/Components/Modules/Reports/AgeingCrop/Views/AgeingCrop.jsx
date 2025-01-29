import React, { useState } from "react";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import PropTypes from "prop-types";
import { Loader } from "Framework/Components/Widgets";
import BizClass from "./AgeingCrop.module.scss";
import AgeingTicketList from "./Modal/AgeingTicketList";

function AgeingCropReport({
  filteredAgeingCropReportDataList,
  isLoadingAgeingCropReportDataList,
  formValues,
  updateState,
  onGridReady,
  reportFilterList,
  onClickAgeingCropReport,
  exportClick,
  ageingTicketCountList,
  isLoadingAgeingTicketCountList,
  getAgeingCropReportsDetailsList,
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
          : headerName === "0-10 days"
          ? "1"
          : headerName === "11-15 days"
          ? "2"
          : headerName === "16-20 days"
          ? "3"
          : headerName === "More than 20"
          ? "4"
          : "";
      getAgeingCropReportsDetailsList(pViewMode, pFiterlID, pageingPeriodsID);
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
          <PageBar.Button onClick={() => onClickAgeingCropReport()} title="Clear">
            Search
          </PageBar.Button>
          <PageBar.ExcelButton onClick={() => exportClick()} disabled={filteredAgeingCropReportDataList.length === 0}>
            Export
          </PageBar.ExcelButton>
        </PageBar>

        <DataGrid
          onGridReady={onGridReady}
          rowData={filteredAgeingCropReportDataList}
          loader={isLoadingAgeingCropReportDataList ? <Loader /> : false}
          frameworkComponents={{
            totalOpenTicketCellStyle,
            zerototendaysCellStyle,
            eleventofifteendaysCellStyle,
            sixteentotwentydaysCellStyle,
            morthantwentyCellStyle,
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
            field={["0-10 days"]}
            headerName="0-10 days"
            width={140}
            cellStyle={{ "text-align": "right" }}
            cellRenderer="zerototendaysCellStyle"
            cellRendererParams={{
              openAgeingTicketListClick,
            }}
          />
          <DataGrid.Column
            field={["11-15 days"]}
            headerName="11-15 days"
            width={110}
            cellStyle={{ "text-align": "right" }}
            cellRenderer="eleventofifteendaysCellStyle"
            cellRendererParams={{
              openAgeingTicketListClick,
            }}
          />
          <DataGrid.Column
            field={["16-20 days"]}
            headerName="16-20 days"
            width={110}
            cellStyle={{ "text-align": "right" }}
            cellRenderer="sixteentotwentydaysCellStyle"
            cellRendererParams={{
              openAgeingTicketListClick,
            }}
          />
          <DataGrid.Column
            field={["More than 20"]}
            headerName="More than 20"
            width={120}
            cellStyle={{ "text-align": "right" }}
            cellRenderer="morthantwentyCellStyle"
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
const zerototendaysCellStyle = (params) => {
  return (
    <div>
      {params.data && params.data["0-10 days"] ? (
        <a href="#" style={{ cursor: "pointer" }} onClick={() => params.openAgeingTicketListClick(params.data, "0-10 days")}>
          {params.data["0-10 days"]}
        </a>
      ) : (
        "0"
      )}
    </div>
  );
};
const eleventofifteendaysCellStyle = (params) => {
  return (
    <div>
      {params.data && params.data["11-15 days"] ? (
        <a href="#" style={{ cursor: "pointer" }} onClick={() => params.openAgeingTicketListClick(params.data, "11-15 days")}>
          {params.data["11-15 days"]}
        </a>
      ) : (
        "0"
      )}
    </div>
  );
};

const sixteentotwentydaysCellStyle = (params) => {
  return (
    <div>
      {params.data && params.data["16-20 days"] ? (
        <a href="#" style={{ cursor: "pointer" }} onClick={() => params.openAgeingTicketListClick(params.data, "16-20 days")}>
          {params.data["16-20 days"]}
        </a>
      ) : (
        "0"
      )}
    </div>
  );
};

const morthantwentyCellStyle = (params) => {
  return (
    <div>
      {params.data && params.data["More than 20"] ? (
        <a href="#" style={{ cursor: "pointer" }} onClick={() => params.openAgeingTicketListClick(params.data, "More than 20")}>
          {params.data["More than 20"]}
        </a>
      ) : (
        "0"
      )}
    </div>
  );
};

export default AgeingCropReport;
AgeingCropReport.propTypes = {
  filteredAgeingCropReportDataList: PropTypes.array,
  isLoadingAgeingCropReportDataList: PropTypes.bool,
  onGridReady: PropTypes.func.isRequired,
  reportFilterList: PropTypes.array,
  formValues: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired,
  onClickAgeingCropReport: PropTypes.func.isRequired,
  exportClick: PropTypes.func.isRequired,
  ageingTicketCountList: PropTypes.array,
  isLoadingAgeingTicketCountList: PropTypes.bool,
  getAgeingCropReportsDetailsList: PropTypes.func.isRequired,
};
