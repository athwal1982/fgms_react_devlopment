import { React, useMemo } from "react";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import PropTypes from "prop-types";
import { Loader } from "Framework/Components/Widgets";
import BizClass from "./StatewiseICTickets.module.scss";

function StatewiseICTickets({
  formValues,
  updateState,
  filteredStatewiseICTicketsDataList,
  isLoadingStatewiseICTicketsDataList,
  onGridReady,
  onChangeStatewiseICTicketsList,
  getStatewiseICTicketsList,
  StatewiseICTicketsListItemSearch,
  onClickClearSearchFilter,
  exportClick,
  monthList,
  yearList,
  ticketStatusList,
  isLoadingTicketStatusList,
}) {
  const calculateTotalRow = () => {
    const totalRow = {
      StateMasterName: "Total",
      ["AIC"]: filteredStatewiseICTicketsDataList.reduce((acc, row) => Number(acc) + Number(row["AIC"]), 0),
      ["Bajaj_Allianz"]: filteredStatewiseICTicketsDataList.reduce((acc, row) => Number(acc) + Number(row["Bajaj_Allianz"]), 0),
      // A  ["Bharti_AXA_GIC"]: filteredStatewiseICTicketsDataList.reduce((acc, row) => Number(acc) + Number(row["Bharti_AXA_GIC"]), 0),
      ["Chola_MS"]: filteredStatewiseICTicketsDataList.reduce((acc, row) => Number(acc) + Number(row["Chola_MS"]), 0),
      ["Future_Generalli"]: filteredStatewiseICTicketsDataList.reduce((acc, row) => Number(acc) + Number(row["Future_Generalli"]), 0),
      ["HDFC_Ergo"]: filteredStatewiseICTicketsDataList.reduce((acc, row) => Number(acc) + Number(row["HDFC_Ergo"]), 0),
      ["ICICI_Lombard"]: filteredStatewiseICTicketsDataList.reduce((acc, row) => Number(acc) + Number(row["ICICI_Lombard"]), 0),
      ["IFFCO_TOKIO"]: filteredStatewiseICTicketsDataList.reduce((acc, row) => Number(acc) + Number(row["IFFCO_TOKIO"]), 0),
      ["Kshema_Insurance"]: filteredStatewiseICTicketsDataList.reduce((acc, row) => Number(acc) + Number(row["Kshema_Insurance"]), 0),
      ["NationalInsurance"]: filteredStatewiseICTicketsDataList.reduce((acc, row) => Number(acc) + Number(row["NationalInsurance"]), 0),
      ["New_India_Assurance"]: filteredStatewiseICTicketsDataList.reduce((acc, row) => Number(acc) + Number(row["New_India_Assurance"]), 0),
      ["Oriental_Insurance"]: filteredStatewiseICTicketsDataList.reduce((acc, row) => Number(acc) + Number(row["Oriental_Insurance"]), 0),
      ["Reliance_GIC"]: filteredStatewiseICTicketsDataList.reduce((acc, row) => Number(acc) + Number(row["Reliance_GIC"]), 0),
      ["Royal_Sundaram_GIC"]: filteredStatewiseICTicketsDataList.reduce((acc, row) => Number(acc) + Number(row["Royal_Sundaram_GIC"]), 0),
      ["SBI_GIC"]: filteredStatewiseICTicketsDataList.reduce((acc, row) => Number(acc) + Number(row["SBI_GIC"]), 0),
      ["Shriram_GIC"]: filteredStatewiseICTicketsDataList.reduce((acc, row) => Number(acc) + Number(row["Shriram_GIC"]), 0),
      ["TATA_AIG"]: filteredStatewiseICTicketsDataList.reduce((acc, row) => Number(acc) + Number(row["TATA_AIG"]), 0),
      ["United_India"]: filteredStatewiseICTicketsDataList.reduce((acc, row) => Number(acc) + Number(row["United_India"]), 0),
      ["Universal_Sompo"]: filteredStatewiseICTicketsDataList.reduce((acc, row) => Number(acc) + Number(row["Universal_Sompo"]), 0),
    };
    return [totalRow];
  };

  const pinnedBottomRowData = useMemo(() => calculateTotalRow(), [filteredStatewiseICTicketsDataList]);

  return (
    <div className={BizClass.PageStart}>
      <PageBar>
        <PageBar.Select
          control={"select"}
          label="Year"
          name="txtYearFilter"
          getOptionLabel={(option) => `${option.label}`}
          value={formValues.txtYearFilter}
          getOptionValue={(option) => `${option}`}
          options={yearList}
          onChange={(e) => updateState("txtYearFilter", e)}
        />
        <PageBar.Select
          control={"select"}
          label="Month"
          name="txtMonthFilter"
          getOptionLabel={(option) => `${option.label}`}
          value={formValues.txtMonthFilter}
          getOptionValue={(option) => `${option}`}
          options={monthList}
          onChange={(e) => updateState("txtMonthFilter", e)}
        />
        <PageBar.Select
          ControlTxt="Search By"
          name="SearchByFilter"
          isLoading={isLoadingTicketStatusList}
          getOptionLabel={(option) => `${option.CommonMasterValue}`}
          getOptionValue={(option) => `${option}`}
          options={ticketStatusList}
          value={formValues.txtStatus}
          onChange={(e) => updateState("txtStatusFilter", e)}
        />

        <PageBar.Search
          value={StatewiseICTicketsListItemSearch}
          onChange={(e) => onChangeStatewiseICTicketsList(e.target.value)}
          onClick={() => getStatewiseICTicketsList()}
        />
        <PageBar.Button onClick={() => onClickClearSearchFilter()} title="Clear">
          Clear
        </PageBar.Button>
        <PageBar.ExcelButton onClick={() => exportClick()} disabled={filteredStatewiseICTicketsDataList.length === 0}>
          Export
        </PageBar.ExcelButton>
      </PageBar>
      <DataGrid
        rowData={filteredStatewiseICTicketsDataList}
        loader={isLoadingStatewiseICTicketsDataList ? <Loader /> : false}
        onGridReady={onGridReady}
        pinnedBottomRowData={pinnedBottomRowData}
      >
        {/* <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left"  /> */}
        <DataGrid.Column field="StateMasterName" headerName="State" width="220px" />
        <DataGrid.Column
          field={["AIC"]}
          headerName="AIC"
          width="100px"
          cellStyle={{ "text-align": "right" }}
          valueGetter={(node) => {
            return node.data.AIC ? node.data.AIC : 0;
          }}
        />
        <DataGrid.Column
          field={["Bajaj_Allianz"]}
          headerName="Bajaj Allianz"
          width="120px"
          cellStyle={{ "text-align": "right" }}
          valueGetter={(node) => {
            return node.data["Bajaj_Allianz"] ? node.data["Bajaj_Allianz"] : 0;
          }}
        />
        {/* <DataGrid.Column
          field={["BhartiAXA GIC"]}
          headerName="Bharti_AXA_GIC"
          width="140px"
          cellStyle={{ "text-align": "right" }}
          valueGetter={(node) => {
            return node.data["Bharti_AXA_GIC"] ? node.data["Bharti_AXA_GIC"] : 0;
          }}
        /> */}
        <DataGrid.Column
          field={["Chola_MS"]}
          headerName="Chola MS"
          width="100px"
          cellStyle={{ "text-align": "right" }}
          valueGetter={(node) => {
            return node.data["Chola_MS"] ? node.data["Chola_MS"] : 0;
          }}
        />
        <DataGrid.Column
          field={["Future_Generalli"]}
          headerName="Future Generalli"
          width="150px"
          cellStyle={{ "text-align": "right" }}
          valueGetter={(node) => {
            return node.data["Future_Generalli"] ? node.data["Future_Generalli"] : 0;
          }}
        />
        <DataGrid.Column
          field={["HDFC_Ergo"]}
          headerName="HDFC Ergo"
          width="120px"
          cellStyle={{ "text-align": "right" }}
          valueGetter={(node) => {
            return node.data["HDFC_Ergo"] ? node.data["HDFC_Ergo"] : 0;
          }}
        />
        <DataGrid.Column
          field={["IFFCO_TOKIO"]}
          headerName="IFFCO TOKIO"
          width="120px"
          cellStyle={{ "text-align": "right" }}
          valueGetter={(node) => {
            return node.data["IFFCO_TOKIO"] ? node.data["IFFCO_TOKIO"] : 0;
          }}
        />
        <DataGrid.Column
          field={["ICICI_Lombard"]}
          headerName="ICICI Lombard"
          width="140px"
          cellStyle={{ "text-align": "right" }}
          valueGetter={(node) => {
            return node.data["ICICI_Lombard"] ? node.data["ICICI_Lombard"] : 0;
          }}
        />
        <DataGrid.Column
          field={["NationalInsurance"]}
          headerName="National Insurance"
          width="160px"
          cellStyle={{ "text-align": "right" }}
          valueGetter={(node) => {
            return node.data["NationalInsurance"] ? node.data["NationalInsurance"] : 0;
          }}
        />
        <DataGrid.Column
          field={["New_India_Assurance"]}
          headerName="New India Assurance"
          width="160px"
          cellStyle={{ "text-align": "right" }}
          valueGetter={(node) => {
            return node.data["New_India_Assurance"] ? node.data["New_India_Assurance"] : 0;
          }}
        />
        <DataGrid.Column
          field={["Oriental_Insurance"]}
          headerName="Oriental Insurance"
          width="160px"
          cellStyle={{ "text-align": "right" }}
          valueGetter={(node) => {
            return node.data["Oriental_Insurance"] ? node.data["Oriental _nsurance"] : 0;
          }}
        />
        <DataGrid.Column
          field={["Reliance_GIC"]}
          headerName="Reliance GIC"
          width="120px"
          cellStyle={{ "text-align": "right" }}
          valueGetter={(node) => {
            return node.data["Reliance_GIC"] ? node.data["Reliance_GIC"] : 0;
          }}
        />
        <DataGrid.Column
          field={["Royal_Sundaram_GIC"]}
          headerName="Royal Sundaram GIC"
          width="170px"
          cellStyle={{ "text-align": "right" }}
          valueGetter={(node) => {
            return node.data["Royal_Sundaram_GIC"] ? node.data["Royal_Sundaram_GIC"] : 0;
          }}
        />
        <DataGrid.Column
          field={["SBI_GIC"]}
          headerName="SBI GIC"
          width="100px"
          cellStyle={{ "text-align": "right" }}
          valueGetter={(node) => {
            return node.data["SBI_GIC"] ? node.data["SBI_GIC"] : 0;
          }}
        />
        <DataGrid.Column
          field={["Shriram_GIC"]}
          headerName="Shriram GIC"
          width="120px"
          cellStyle={{ "text-align": "right" }}
          valueGetter={(node) => {
            return node.data["Shriram_GIC"] ? node.data["Shriram_GIC"] : 0;
          }}
        />
        <DataGrid.Column
          field={["TATA_AIG"]}
          headerName="TATA AIG"
          width="120px"
          cellStyle={{ "text-align": "right" }}
          valueGetter={(node) => {
            return node.data["TATA_AIG"] ? node.data["TATA_AIG"] : 0;
          }}
        />
        <DataGrid.Column
          field={["United_India"]}
          headerName="United India"
          width="140px"
          cellStyle={{ "text-align": "right" }}
          valueGetter={(node) => {
            return node.data["United_India"] ? node.data["United_India"] : 0;
          }}
        />
        <DataGrid.Column
          field={["Universal_Sompo"]}
          headerName="Universal Sompo"
          width="150px"
          cellStyle={{ "text-align": "right" }}
          valueGetter={(node) => {
            return node.data["Universal_Sompo"] ? node.data["Universal_Sompo"] : 0;
          }}
        />
        <DataGrid.Column
          field={["Kshema_Insurance"]}
          headerName="Kshema Insurance"
          width="160px"
          cellStyle={{ "text-align": "right" }}
          valueGetter={(node) => {
            return node.data["Kshema_Insurance"] ? node.data["Kshema_Insurance"] : 0;
          }}
        />

        <DataGrid.Column
          field="total"
          headerName="Total"
          width="110px"
          cellStyle={{ "text-align": "right" }}
          valueGetter={(node) => {
            return (
              Number(node.data["AIC"]) +
              Number(node.data["Bajaj_Allianz"]) +
              // A Number(node.data["Bharti_AXA_GIC"]) +
              Number(node.data["Chola_MS"]) +
              Number(node.data["Future_Generalli"]) +
              Number(node.data["HDFC_Ergo"]) +
              Number(node.data["ICICI_Lombard"]) +
              Number(node.data["IFFCO_TOKIO"]) +
              Number(node.data["Kshema_Insurance"]) +
              Number(node.data["NationalInsurance"]) +
              Number(node.data["New_India_Assurance"]) +
              Number(node.data["Oriental_Insurance"]) +
              Number(node.data["Reliance_GIC"]) +
              Number(node.data["Royal_Sundaram_GIC"]) +
              Number(node.data["SBI_GIC"]) +
              Number(node.data["Shriram_GIC"]) +
              Number(node.data["TATA_AIG"]) +
              Number(node.data["United_India"]) +
              Number(node.data["Universal_Sompo"])
            );
          }}
        />
      </DataGrid>
    </div>
  );
}

export default StatewiseICTickets;
StatewiseICTickets.propTypes = {
  filteredStatewiseICTicketsDataList: PropTypes.array,
  isLoadingStatewiseICTicketsDataList: PropTypes.bool,
  onGridReady: PropTypes.func.isRequired,
  onChangeStatewiseICTicketsList: PropTypes.func.isRequired,
  getStatewiseICTicketsList: PropTypes.func.isRequired,
  StatewiseICTicketsListItemSearch: PropTypes.string,
  formValues: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired,
  onClickClearSearchFilter: PropTypes.func.isRequired,
  exportClick: PropTypes.func.isRequired,
  ticketStatusList: PropTypes.array.isRequired,
  isLoadingTicketStatusList: PropTypes.bool,
};
