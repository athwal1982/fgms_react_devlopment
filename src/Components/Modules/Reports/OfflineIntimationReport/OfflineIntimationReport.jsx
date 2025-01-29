import React, { useState, useEffect } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { Loader } from "Framework/Components/Widgets";
import { dateToCompanyFormat, dateToSpecificFormat, dateFormatDefault, daysdifference, Convert24FourHourAndMinute } from "Configration/Utilities/dateformat";
import moment from "moment";
import * as XLSX from "xlsx";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import BizClass from "./OfflineIntimationReport.module.scss";
import { getOfflineSupportTicket } from "./Service/Methods";
import { getMasterDataBinding } from "../../Support/ManageTicket/Services/Methods";
function OfflineIntimationReport() {
  const [formValues, setFormValues] = useState({
    txtFromDate: dateToSpecificFormat(moment().subtract(1, "days"), "YYYY-MM-DD"),
    txtToDate: dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD"),
    txtInsuranceCompany: null,
    txtState: null,
  });

  const [ticketHistoryDataList, setTicketHistoryDataList] = useState(false);
  const [filteredTicketHistoryDataList, setFilteredTicketHistoryDataList] = useState([]);
  const [isLoadingTicketHistoryDataList, setLoadingTicketHistoryDataList] = useState(false);
  const setAlertMessage = AlertMessage();

  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
    console.log(params.api);
    setGridApi(params.api);
  };

  const [ticketHistoryListItemSearch, setTicketHistoryListItemSearch] = useState("");
  const onChangeTicketHistoryList = (val) => {
    debugger;
    setTicketHistoryListItemSearch(val);
    gridApi.setQuickFilter(val);
  };

  const [insuranceCompanyList, setInsuranceCompanyList] = useState([]);
  const [isLoadingInsuranceCompanyList, setIsLoadingInsuranceCompanyList] = useState(false);
  const getInsuranceCompanyListData = async () => {
    try {
      setInsuranceCompanyList([]);
      setIsLoadingInsuranceCompanyList(true);
      const userData = getSessionStorage("user");
      const formdata = {
        filterID: userData && userData.LoginID ? userData.LoginID : 0,
        filterID1: 0,
        masterName: "INSURASIGN",
        searchText: "#ALL",
        searchCriteria: "",
      };
      const result = await getMasterDataBinding(formdata);
      console.log(result, "Insurance Company");
      setIsLoadingInsuranceCompanyList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setInsuranceCompanyList(result.response.responseData.masterdatabinding);
        } else {
          setInsuranceCompanyList([]);
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const [stateList, setStateList] = useState([]);
  const [isLoadingStateList, setIsLoadingStateList] = useState(false);
  const getStateListData = async () => {
    try {
      setStateList([]);
      setIsLoadingStateList(true);
      const userData = getSessionStorage("user");
      const formdata = {
        filterID: userData && userData.LoginID ? userData.LoginID : 0,
        filterID1: 0,
        masterName: "STATASIGN",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBinding(formdata);
      console.log(result, "State Data");
      setIsLoadingStateList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setStateList(result.response.responseData.masterdatabinding);
        } else {
          setStateList([]);
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const downloadExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    // A let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    // A XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    worksheet["!cols"] = [
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 25 },
      { width: 25 },
      { width: 20 },
      { width: 25 },
      { width: 30 },
      { width: 30 },
      { width: 20 },
      { width: 20 },
      { width: 35 },
      { width: 25 },
      { width: 25 },
      { width: 30 },
      { width: 30 },
      { width: 30 },
      { width: 30 },
    ];
    XLSX.writeFile(workbook, "Offline_Intimation_Report.xlsx");
  };

  const rearrangeAndRenameColumns = (originalData, columnMapping) => {
    return originalData.map((item) => {
      const rearrangedItem = Object.fromEntries(Object.entries(columnMapping).map(([oldColumnName, newColumnName]) => [newColumnName, item[oldColumnName]]));
      return rearrangedItem;
    });
  };

  const getTicketHistoryData = async () => {
    debugger;
    try {
      const dateDiffrence = daysdifference(dateFormatDefault(formValues.txtFromDate), dateFormatDefault(formValues.txtToDate));
      if (dateDiffrence > 31) {
        setAlertMessage({
          type: "error",
          message: "1 month date range is allowed only",
        });
        return;
      }
      setLoadingTicketHistoryDataList(true);

      const formData = {
        insuranceCompanyID:
          formValues.txtInsuranceCompany && formValues.txtInsuranceCompany.CompanyID ? formValues.txtInsuranceCompany.CompanyID.toString() : "#ALL",
        stateID: formValues.txtState && formValues.txtState.StateMasterID ? formValues.txtState.StateMasterID.toString() : "#ALL",
        fromdate: formValues.txtFromDate ? dateToCompanyFormat(formValues.txtFromDate) : "",
        toDate: formValues.txtToDate ? dateToCompanyFormat(formValues.txtToDate) : "",
        pageIndex: 1,
        pageSize: 100,
      };
      const result = await getOfflineSupportTicket(formData);
      setLoadingTicketHistoryDataList(false);
      if (result.responseCode === 1) {
        if (ticketHistoryListItemSearch && ticketHistoryListItemSearch.toLowerCase().includes("#")) {
          onChangeTicketHistoryList("");
        }
        setTicketHistoryDataList(result.responseData.supportTicket);
        setFilteredTicketHistoryDataList(result.responseData.supportTicket);
      } else {
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const updateState = (name, value) => {
    debugger;
    setFormValues({ ...formValues, [name]: value });
  };

  const getTicketHistoryList = () => {
    if (formValues.txtFromDate) {
      if (formValues.txtToDate) {
        if (formValues.txtFromDate > formValues.txtToDate) {
          setAlertMessage({
            type: "warning",
            message: "From date must be less than To Date",
          });
          return;
        }
      } else {
        setAlertMessage({
          type: "warning",
          message: "Please select To Date",
        });
        return;
      }
    }
    getTicketHistoryData();
  };

  const exportClick = () => {
    debugger;
    // A const excelParams = {
    // A  fileName: "Ticket History",
    // A };
    // A gridApi.exportDataAsExcel(excelParams);
    if (ticketHistoryDataList.length === 0) {
      setAlertMessage({
        type: "error",
        message: "Data not found to download.",
      });
      return;
    }
    const columnOrder = {
      ApplicationNo: "Application No",
      CropStage: "Crop Stage Type",
      CropStageSelection: "Loss at ",
      CropStageMaster: "Growth",
      CropCategoryOthers: "Other Crop Category",
      LossDate: "Loss Date",
      RequestorName: "Farmer Name",
      RequestorMobileNo: "Mobile No",
      CreatedBY: "Created By",
      TicketDescription: "Description",
      TicketCategoryName: "Sub Category",
      TicketStatus: "Ticket Status",
      DistrictMasterName: "District",
      PostHarvestDate: "Post Harvest Date",
      OnTimeIntimationFlag: "On Time Intimation",
      InsuranceCompany: "Insurance Company",
      InsurancePolicyNo: "Policy No",
      CreatedAt: "Created At",
      TicketTypeName: "Ticket Type",
      StateMasterName: "State",
      TicketHeadName: "Ticket Head",
      CropName: "Crop Name",
    };

    const mappedData = ticketHistoryDataList.map((value) => {
      return {
        ApplicationNo: value.ApplicationNo,
        CropStage: value.CropStage,
        CropStageSelection: value.CropStageSelection.trim(),
        CropStageMaster: value.CropStageMaster,
        CropCategoryOthers: value.CropCategoryOthers,
        LossDate: value.LossDate ? dateToSpecificFormat(value.LossDate.split("T")[0], "DD-MM-YYYY") : "",
        RequestorName: value.RequestorName,
        RequestorMobileNo: value.RequestorMobileNo,
        CreatedBY: value.CreatedBY,
        TicketDescription: value.TicketDescription,
        TicketCategoryName: value.TicketCategoryName,
        TicketStatus: value.TicketStatus,
        DistrictMasterName: value.DistrictMasterName,
        PostHarvestDate: value.PostHarvestDate ? dateToSpecificFormat(value.PostHarvestDate, "DD-MM-YYYY") : "",
        OnTimeIntimationFlag:
          value.OnTimeIntimationFlag && value.OnTimeIntimationFlag === "NO" ? "Late" : value.OnTimeIntimationFlag === "YES" ? "On-time" : null,
        InsurancePolicyNo: value.InsurancePolicyNo,
        CreatedAt: value.CreatedAt ? dateToSpecificFormat(value.CreatedAt.split("T")[0], "DD-MM-YYYY") : "",
        InsuranceCompany: value.InsuranceCompany,
        TicketTypeName: value.TicketTypeName,
        StateMasterName: value.StateMasterName,
        TicketHeadName: value.TicketHeadName,
        CropName: value.CropName,
      };
    });

    const rearrangedData = rearrangeAndRenameColumns(mappedData, columnOrder);
    downloadExcel(rearrangedData);
  };

  useEffect(() => {
    debugger;
    getInsuranceCompanyListData();
    getStateListData();
  }, []);

  return (
    <div className={BizClass.PageStart}>
      <PageBar>
        <PageBar.Input
          ControlTxt="From Date"
          control="input"
          type="date"
          name="txtFromDate"
          value={formValues.txtFromDate}
          onChange={(e) => updateState("txtFromDate", e.target.value)}
        />
        <PageBar.Input
          ControlTxt="To Date"
          control="input"
          type="date"
          name="txtToDate"
          value={formValues.txtToDate}
          onChange={(e) => updateState("txtToDate", e.target.value)}
          max={dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD")}
        />
        <PageBar.Select
          ControlTxt="State"
          name="txtState"
          value={formValues.txtState}
          loader={isLoadingStateList ? <Loader /> : null}
          options={stateList}
          getOptionLabel={(option) => `${option.StateMasterName}`}
          getOptionValue={(option) => `${option}`}
          onChange={(e) => updateState("txtState", e)}
        />

        <PageBar.Select
          ControlTxt="Insurance Company"
          name="txtInsuranceCompany"
          value={formValues.txtInsuranceCompany}
          loader={isLoadingInsuranceCompanyList ? <Loader /> : null}
          options={insuranceCompanyList}
          getOptionLabel={(option) => `${option.CompanyName}`}
          getOptionValue={(option) => `${option}`}
          onChange={(e) => updateState("txtInsuranceCompany", e)}
        />
        <PageBar.Search
          value={ticketHistoryListItemSearch}
          onChange={(e) => onChangeTicketHistoryList(e.target.value)}
          onClick={() => getTicketHistoryList()}
        />
        <PageBar.ExcelButton onClick={() => exportClick()} disabled={filteredTicketHistoryDataList.length === 0}>
          Export
        </PageBar.ExcelButton>
      </PageBar>
      <DataGrid rowData={filteredTicketHistoryDataList} loader={isLoadingTicketHistoryDataList ? <Loader /> : false} onGridReady={onGridReady}>
        <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
        <DataGrid.Column field="RequestorMobileNo" headerName="Caller/Farmer Mobile No." width="190px" />
        <DataGrid.Column field="RequestorName" headerName="Farmer Name" width="210px" />
        <DataGrid.Column field="StateMasterName" headerName="State" width="160px" />
        <DataGrid.Column field="DistrictMasterName" headerName="District" width="160px" />
        <DataGrid.Column field="ApplicationNo" headerName="Application No" width="180px" />
        <DataGrid.Column field="InsurancePolicyNo" headerName="Policy No" width="170px" />
        <DataGrid.Column field="InsuranceCompany" headerName="Insurance Company" width="320px" />
        <DataGrid.Column field="TicketHeadName" headerName="Type" width="150px" />
        <DataGrid.Column field="TicketTypeName" headerName="Category" width="180px" />
        <DataGrid.Column field="TicketCategoryName" headerName="Sub Category" width="160px" />
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
        <DataGrid.Column field="CropName" headerName="Crop Name" width="160px" />
        <DataGrid.Column field="TicketDescription" headerName="Description" width="250px" />
        <DataGrid.Column field="CreatedBY" headerName="Created By" width="160px" />
        <DataGrid.Column
          field="CreatedAt"
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
  );
}

export default OfflineIntimationReport;
