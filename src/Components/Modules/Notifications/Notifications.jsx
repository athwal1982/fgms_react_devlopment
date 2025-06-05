import React, { useState, useEffect } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { Loader } from "Framework/Components/Widgets";
import { dateToSpecificFormat, dateToCompanyFormat, Convert24FourHourAndMinute } from "Configration/Utilities/dateformat";
import moment from "moment";
import {getMasterDataBinding, getNotificationMasterData} from "./Services/Methods";
import BizClass from "./Notifications.module.scss";
import AddNotificationsModal from "./Model/AddNotifications";

function Notifications() {

   const setAlertMessage = AlertMessage();

    const [formValues, setFormValues] = useState({
          txtFromDate: dateToSpecificFormat(moment().subtract(1, "days"), "YYYY-MM-DD"),
          txtToDate: dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD"),
          txtNotificationFor: null,
          txtNotificationType: null,
      });

    const updateState = (name, value) => {
        setFormValues({ ...formValues, [name]: value });
      };
    

      const [openAddNotificationsModal, setOpenAddNotificationsModal] = useState(false);
      const openAddNotificationsModalClick = () => {
        setOpenAddNotificationsModal(!openAddNotificationsModal);
      };


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

          const [notificationDataList, setNotificationDataList] = useState([]);
          const [isLoadingNotificationDataList, setLoadingNotificationDataList] = useState(false);
           const getNotificationsList = async() => {

         try {
          debugger;
          setLoadingNotificationDataList(true);
              const formData = {
              notificationType: formValues.txtNotificationType && formValues.txtNotificationType.CommonMasterValueID ? formValues.txtNotificationType.CommonMasterValueID : 0,
              notificationFor: formValues.txtNotificationFor && formValues.txtNotificationFor.CommonMasterValueID ? formValues.txtNotificationFor.CommonMasterValueID : 0,
              priorityFlag: 0,
              fromDate: formValues.txtFromDate ? dateToCompanyFormat(formValues.txtFromDate) : "",
              toDate: formValues.txtToDate ? dateToCompanyFormat(formValues.txtToDate) : "",
              };
              const result = await getNotificationMasterData(formData);
              setLoadingNotificationDataList(false);
              if (result.response.responseCode === 1) {
                setNotificationDataList(result.response.responseData && result.response.responseData.items && result.response.responseData.items.supportTicket && result.response.responseData.items.supportTicket.length > 0 ? result.response.responseData.items.supportTicket : []);
              } else {
                setAlertMessage({
                  type: "error",
                  message: result.response.responseMessage,
                });
              }
            } catch (error) {
              setAlertMessage({
                type: "error",
                message: error,
              });
            }

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

                   const [notificationTypeList, setNotificationTypeList] = useState([]);
                   const [isLoadingNotificationTypeList, setIsLoadingNotificationTypeList] = useState(false);
                   const getNotificationTypeData = async () => {
                     debugger;
                     try {
                       setNotificationTypeList([]);
                       setIsLoadingNotificationTypeList(true);
                       const formdata = {
                         filterID: 130,
                         filterID1: 0,
                         masterName: "COMMVAL",
                         searchText: "#ALL",
                         searchCriteria: "AW",
                       };
                       const result = await getMasterDataBinding(formdata);
                       setIsLoadingNotificationTypeList(false);
                       if (result.response.responseCode === 1) {
                         if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
                             setNotificationTypeList(result.response.responseData.masterdatabinding);
                         } else {
                             setNotificationTypeList([]);
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

             const updateNotification = (addedData) => {
              if (gridApi) {
                const rowData = [];
                if (addedData && addedData.length > 0) {
                  addedData.forEach((data) => {
                    rowData.push(data);
                  });
                }
                gridApi.forEachNode((node) => rowData.push(node.data));
                gridApi.setRowData(rowData);
              }
            };

            const getRowStyle = (params) => {
              if (params.data.IsNewlyAdded) {
                return { background: "#d5a10e" };
              }
              if (params.node.rowIndex % 2 === 0) {
                return { background: "#fff" };
              }
              return { background: "#f3f6f9" };
            };

               useEffect(() => {
                   getNotificationForData();
                   getNotificationTypeData();
               }, []);

       

    return (
        <>
          {openAddNotificationsModal && (
            <AddNotificationsModal
              openAddNotificationsModalClick={openAddNotificationsModalClick}
              updateNotification={updateNotification}
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
                      />
                      <PageBar.Input
                        ControlTxt="To Date"
                        control="input"
                        type="date"
                        name="txtToDate"
                        value={formValues.txtToDate}
                        onChange={(e) => updateState("txtToDate", e.target.value)}
                      />
              <PageBar.Select
                          control="select"
                          label="Notification For"
                          name="txtNotificationFor"
                          loader={isLoadingNotificationForList ? <Loader /> : null}
                          getOptionLabel={(option) => `${option.CommonMasterValue}`}
                          value={formValues.txtNotificationFor}
                          getOptionValue={(option) => `${option}`}
                          options={notificationForList}
                          onChange={(e) => updateState("txtNotificationFor", e)}
                        />        
               <PageBar.Select
                          control="select"
                          label="Notification Type"
                          name="txtNotificationType"
                          loader={isLoadingNotificationTypeList ? <Loader /> : null}
                          getOptionLabel={(option) => `${option.CommonMasterValue}`}
                          value={formValues.txtNotificationType}
                          getOptionValue={(option) => `${option}`}
                          options={notificationTypeList}
                          onChange={(e) => updateState("txtNotificationType", e)}
                        />                  
              <PageBar.Search
                        value={notificationsListItemSearch}
                        onChange={(e) => onChangeNotificationsList(e.target.value)}
                        onClick={() => getNotificationsList()}
                      />        
              <PageBar.Button onClick={() => openAddNotificationsModalClick()} title="Add Notification">
                Add
              </PageBar.Button>
              <PageBar.ExcelButton onClick={() => exportClick()} disabled={notificationDataList.length === 0}>
                Export
              </PageBar.ExcelButton>
              
            </PageBar>
    
            <DataGrid
              onGridReady={onGridReady}
              getRowStyle={getRowStyle}
              rowData={notificationDataList}
              loader={isLoadingNotificationDataList ? <Loader /> : false}
            >
               <DataGrid.Column
                            headerName="Action"
                            lockPosition="1"
                            pinned="left"
                            width={80}
                            cellRenderer="actionTemplate"
                          />
              <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
              <DataGrid.Column headerName="Notification For" field="NotificationValueFor" width={150} />
              <DataGrid.Column headerName="Notification Type" field="NotificationValueType" width={140} />
              <DataGrid.Column headerName="Heading" field="NotificationHeading" width={250} />
              <DataGrid.Column headerName="Priority" field="#" width={90} valueGetter={(node) => {
              return node.data.PriorityFlag && node.data.PriorityFlag === 0
              ? "Low"
              : "High";
          }} />
              <DataGrid.Column headerName="Is For Admin" field="#" width={115} valueGetter={(node) => {
              return node.data.IsForAdmin && node.data.IsForAdmin === 1
              ? "Yes"
              : "No";
          }} />
              <DataGrid.Column
                        field="NotificationDateTime"
                        headerName="Notification Date Time"
                        width="180px"
                        valueGetter={(node) => {
                          return node.data.NotificationDateTime
                            ? dateToSpecificFormat(
                                `${node.data.NotificationDateTime.split("T")[0]} ${Convert24FourHourAndMinute(node.data.NotificationDateTime.split("T")[1])}`,
                                "DD-MM-YYYY HH:mm",
                              )
                            : null;
                        }}
                      />
              <DataGrid.Column headerName="Notification Message" field="NotificationDescription" width={250} />
            </DataGrid>
          </div>
        </>
      );
}

export default Notifications;