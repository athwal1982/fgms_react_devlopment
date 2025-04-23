import React, { useState, useEffect } from "react";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { Loader } from "Framework/Components/Widgets";
import { dateToSpecificFormat } from "Configration/Utilities/dateformat";
import moment from "moment";
import {getMasterDataBinding} from "./Services/Methods";
import BizClass from "./Notifications.module.scss";
import AddNotificationsModal from "./Model/AddNotifications";

function Notifications() {

    const [formValues, setFormValues] = useState({
          txtFromDate: dateToSpecificFormat(moment().subtract(1, "days"), "YYYY-MM-DD"),
          txtToDate: dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD"),
      });

    const updateState = (name, value) => {
        setFormValues({ ...formValues, [name]: value });
      };
    

      const [openAddNotificationsModal, setOpenAddNotificationsModal] = useState(false);
      const openAddNotificationsModalClick = () => {
        setOpenAddNotificationsModal(!openAddNotificationsModal);
      };

        const [filteredNotificationstDataList, setFilteredNotificationstDataList] = useState([]);
        const [isLoadingNotificationsDataList, setIsLoadingNotificationsDataList] = useState(false);

        const [gridApi, setGridApi] = useState();
        const onGridReady = (params) => {
          console.log(params.api);
          setGridApi(params.api);
        };

        const [notificationsListItemSearch, setNotificationsListItemSearch] = useState("");
        const onChangeNotificationsList = (val) => {
            setNotificationsListItemSearch(val);
          gridApi.setQuickFilter(val);
        };

        const exportClick = () => {
            const excelParams = {
              fileName: "Notifications_List",
            };
            gridApi.exportDataAsExcel(excelParams);
          };
       const getNotificationsList = () => {

       };   

             const [notificationForList, setNotificationForList] = useState([]);
             const [isLoadingNotificationForList, setIsLoadingNotificationForList] = useState(false);
             const getNotificationForData = async () => {
               debugger;
               try {
                 setNotificationForList([]);
                 setIsLoadingNotificationForList(true);
                 const formdata = {
                   filterID: 131,
                   filterID1: 0,
                   masterName: "COMMVAL",
                   searchText: "#ALL",
                   searchCriteria: "AW",
                 };
                 const result = await getMasterDataBinding(formdata);
                 setIsLoadingNotificationForList(false);
                 if (result.response.responseCode === 1) {
                   if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
                       setNotificationForList(result.response.responseData.masterdatabinding);
                   } else {
                       setNotificationForList([]);
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

               useEffect(() => {
                   getNotificationForData();
               }, []);

       

    return (
        <>
          {openAddNotificationsModal && (
            <AddNotificationsModal
              openAddNotificationsModalClick={openAddNotificationsModalClick}
            />
          )}
          <div className={BizClass.PageStart}>
            <PageBar>
               <PageBar.Input
                        ControlTxt="From Date"
                        control="input"
                        type="date"
                        name="txtFromDate"
                        value={formValues.txtFromDate}
                        onChange={(e) => updateState("txtFromDate", e.target.value)}
                       style={{width:"100px"}}
                      />
                      <PageBar.Input
                        ControlTxt="To Date"
                        control="input"
                        type="date"
                        name="txtToDate"
                        value={formValues.txtToDate}
                        onChange={(e) => updateState("txtToDate", e.target.value)}
                        max={dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD")}
                        style={{width:"100px"}}
                      />
              <PageBar.Select
                          control="select"
                          label="Notification For"
                          name="txtNotificationFor"
                          getOptionLabel={(option) => `${option.CommonMasterValue}`}
                          value={formValues.txtNotificationFor}
                          getOptionValue={(option) => `${option}`}
                          options={notificationForList}
                          onChange={(e) => updateState("txtNotificationFor", e)}
                        />        
              <PageBar.Search
                        value={notificationsListItemSearch}
                        onChange={(e) => onChangeNotificationsList(e.target.value)}
                        onClick={() => getNotificationsList()}
                      />        
              <PageBar.Button onClick={() => openAddNotificationsModalClick()} title="Add Notification">
                Add
              </PageBar.Button>
              <PageBar.ExcelButton onClick={() => exportClick()} disabled={filteredNotificationstDataList.length === 0}>
                Export
              </PageBar.ExcelButton>
              
            </PageBar>
    
            <DataGrid
              onGridReady={onGridReady}
              rowData={filteredNotificationstDataList}
              loader={isLoadingNotificationsDataList ? <Loader /> : false}
            >
              <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
              <DataGrid.Column headerName="Notification For" field="#" width={170} />
              <DataGrid.Column headerName="Notification Type" field="#" width={150} />
              <DataGrid.Column headerName="Heading" field="#" width={250} />
              <DataGrid.Column headerName="Priority" field="#" width={90} />
              <DataGrid.Column headerName="Is For Admin" field="#" width={120} />
              <DataGrid.Column headerName="Notification Date Time" field="#" width={190} />
              <DataGrid.Column headerName="State" field="#" width={150} />
              <DataGrid.Column headerName="Resource Partner" field="#" width={150} />
              <DataGrid.Column headerName="Center" field="#" width={150} />
              <DataGrid.Column headerName="Insurance Company" field="#" width={180} />
              <DataGrid.Column headerName="Notification Message" field="#" width={250} />
            </DataGrid>
          </div>
        </>
      );
}

export default Notifications;