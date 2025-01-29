import {React, useEffect, useState} from "react";
import { DataGrid, Modal, PageBar } from "Framework/Components/Layout";
import { Loader } from "Framework/Components/Widgets";
import { Convert24FourHourAndMinute, dateToSpecificFormat, getCurrentDateTimeTick } from "Configration/Utilities/dateformat";
import {uploadTicketSelectData} from "../../Services/Methods";
import { FaFileDownload } from "react-icons/fa";
import * as XLSX from "xlsx";
import BizClass from "../ReplyOnMultipleTickets.module.scss";

const cellActionTemplate = (props) => {
  return (
    <div style={{ display: "flex", gap: "4px", marginTop: "2px" }}>
    {props.data.Status === "Finish" ?   <FaFileDownload
        style={{ fontSize: "16px", color: "#000000", cursor: "pointer" }}
        onClick={() => props.Viewuploadedfilestatus(props.data)}
        title="View uploaded file status"
      /> : null }
    
    </div>
  );
};

function UploadedFileStatusList({uploadedFileStatusOnClick,setAlertMessage}) {

    const downloadExcel = (data, workSheetColumnWidth, fileName) => {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      // A let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
      // A XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
      worksheet["!cols"] = workSheetColumnWidth;
      XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };
    const rearrangeAndRenameColumns = (originalData, columnMapping) => {
      return originalData.map((item) => {
        const rearrangedItem = Object.fromEntries(Object.entries(columnMapping).map(([oldColumnName, newColumnName]) => [newColumnName, item[oldColumnName]]));
        return rearrangedItem;
      });
    };

const [uploadedFileStatusDataList, setuploadedFileStatusDataList] = useState([]);
const [isLoadinguploadedFileStatusDataList, setisLoadinguploadedFileStatusDataList] = useState([]);

  const getUploadedFileStatusList = async () => {
    debugger;
    try {
      setisLoadinguploadedFileStatusDataList(true);
      
      let result = "";
      let formData = "";

      formData = {
         fileMasterID: 0,
         viewMode: "LIST",
      };
      result = await uploadTicketSelectData(formData);
      setisLoadinguploadedFileStatusDataList(false);;
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.length > 0) {
          setuploadedFileStatusDataList(result.responseData);
         
        } else {
          setuploadedFileStatusDataList([]);
        }
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

  const ViewuploadedfilestatusData = async (pdata) => {
    debugger;
    try {
      setisLoadinguploadedFileStatusDataList(true);
      
      let result = "";
      let formData = "";

      formData = {
        fileMasterID: pdata.FileMasterID,
         viewMode: "DETAIL",
      };
      result = await uploadTicketSelectData(formData);
      setisLoadinguploadedFileStatusDataList(false);;
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.length > 0) {
          setuploadedFileStatusDataList(result.responseData);
          const columnOrder = {
            SupportTicketNo: "Ticket No",
            CurrentStatus: "Updated Ticket Status",
            TicketStatus: "Ticket Status",
            ErrorDescription: "Error Description",
            TicketDescription: "Comments",
          };
          const mappedData = pFarmerData.map((value) => {
            return {
              SupportTicketNo: value.SupportTicketNo,
              CurrentStatus: value.CurrentStatus,
              TicketStatus: value.TicketStatus,
              ErrorDescription: value.ErrorDescription,
              TicketDescription: value.TicketDescription,
            };
          });
          const rearrangedData = rearrangeAndRenameColumns(mappedData, columnOrder);
          const workSheetColumnWidth = [{ width: 25 }, { width: 20 },{ width: 20 }, { width: 70 }, { width: 100 }];
          const UniqueDateTimeTick = getCurrentDateTimeTick();
          downloadExcel(rearrangedData, workSheetColumnWidth, `Uploaded_File_Status_Result${UniqueDateTimeTick}`);
         
        } else {
          setuploadedFileStatusDataList([]);
          setAlertMessage({
            type: "error",
            message: result.responseMessage,
          });
        }
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

  const Viewuploadedfilestatus = (data) => {
    ViewuploadedfilestatusData(data);
  };

  useEffect(() => {
  
  getUploadedFileStatusList();

  }, []);  


  return (
    <Modal varient="half" title="Uploaded File Status List" show={uploadedFileStatusOnClick} right="0"
    width="62.5vw">
      <Modal.Body>
      <div className={BizClass.Card}>
          <PageBar>
            <PageBar.Search />
          </PageBar>
          <DataGrid rowData={uploadedFileStatusDataList} loader={isLoadinguploadedFileStatusDataList ? <Loader /> : false} 
          components={{
            actionTemplate: cellActionTemplate,
          }}
          suppressContextMenu={true}
          >
            <DataGrid.Column
                                  headerName="Action"
                                  lockPosition="1"
                                  pinned="left"
                                  width={80}
                                  cellRenderer="actionTemplate"
                                  cellRendererParams={{
                                    Viewuploadedfilestatus,
                                  }}
                                />
            <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
            <DataGrid.Column field="FileName" headerName="File Name" width="380px" />
            <DataGrid.Column field="Status" headerName="Status" width="160px" />
             <DataGrid.Column
                      field="#"
                      headerName="Created At"
                      width="145px"
                      valueGetter={(node) => {
                        return node.data.InsertedTime
                          ? dateToSpecificFormat(
                              `${node.data.InsertedTime.split("T")[0]} ${Convert24FourHourAndMinute(node.data.InsertedTime.split("T")[1])}`,
                              "DD-MM-YYYY HH:mm",
                            )
                          : null;
                      }}
                    />
          </DataGrid>
        </div>
      </Modal.Body>
      <Modal.Footer />
    </Modal>
  );
}

export default UploadedFileStatusList;

