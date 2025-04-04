import React, { useState, useEffect, useRef  } from "react";
import { AlertMessage, Loader } from "Framework/Components/Widgets";
import Modal from "Framework/Components/Layout/Modal/Modal";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { Button } from "Framework/Components/Widgets";
import { FaPaperPlane } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { cSCCenterTrainingAssignManageData, CSCUserTrainingAssignManageData } from "../Services/Methods";
import "./TrainingList.scss";
import * as XLSX from "xlsx";



function AssignUnassginTraineeByAdmin({
  toggleAssignUnAssignTraineeByAdminModal,
  assignUnAssignTraineeByAdminModal,
}) {
  const setAlertMessage = AlertMessage();


  const [centerMasterID, setCenterMasterID] = useState("0");
  const [fileKey, setFileKey] = useState(Date.now()); 
  const fileInputRef = useRef(null);
  

  const [filterValues, setFilterValues] = useState({
    txtAssignedCenter: null,
  });



  const updateState = (name, value) => {
    setFilterValues((prev) => ({
      ...prev,
      [name]: value ? value.CenterMasterID : null,
    }));

    if (name === "txtAssignedCenter" && value) {
      getAssignedUserListData(value);
      setCenterMasterID(value.CenterMasterID);

    }
  };


  const [assignedTraineeByAdminGridApi, setAssignedTraineeByAdminGridApi] = useState();
  const onAssignedTraineeByAdminGridReady = (params) => {
    setAssignedTraineeByAdminGridApi(params.api);
  };

  const [searchTextAssigendTraineeByAdmin, setSearchTextAssigendTraineeByAdmin] = useState("");
  const onSearchAssignedTraineeByAdmin = (val) => {
    debugger;
    setSearchTextAssigendTraineeByAdmin(val);
    assignedTraineeByAdminGridApi.setQuickFilter(val);
    assignedTraineeByAdminGridApi.refreshCells();
  };

  const [TraineeByAdminList, setTraineeByAdminList] = useState([]);
  const [isLoadingTraineeByAdminList, setIsLoadingTraineeByAdminList] = useState(false);

  const [TraineeUserID, setTraineeUserID] = useState([]);
  const [Exceldata, setExcelData] = useState([]);


  const getAssignedUserListData = async (data) => {
    debugger;
    // A setProfileRightData(data);
    try {
      setTraineeByAdminList([]);
      setIsLoadingTraineeByAdminList(true);
      const formdata = {
        viewMode: "GETALLUSER",
        cSCAppAccessTypeID: 503,
        centerID: data.CenterMasterID ? data.CenterMasterID.toString() : "0",
        trainingMasterID: data && data.TrainingMasterID
          ? data.TrainingMasterID.toString()
          : "0",
        userID: "0",
        trainingUserAssignmentID: "0",
      };
      const result = await CSCUserTrainingAssignManageData(formdata);
      setIsLoadingTraineeByAdminList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.CscAssignManage.length > 0) {
          setTraineeByAdminList(result.response.responseData.CscAssignManage);
         
        
          setTraineeUserID(result.response.responseData.CscAssignManage.map(item => item["UserID"]));
        } else {
          setTraineeByAdminList([]);
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

  const [CenterList, setCenterList] = useState([]);
  const [isLoadingCenterList, setIsLoadingCenterList] = useState(false);
  const getAssignedCenterListData = async (data) => {
    debugger;
    try {
      setCenterList([]);
      setIsLoadingCenterList(true);
      const formdata = {
        viewMode: "GETALLCENTER",
        centerID: "0",
        trainingMasterID: assignUnAssignTraineeByAdminModal && assignUnAssignTraineeByAdminModal.TrainingMasterId
          ? assignUnAssignTraineeByAdminModal.TrainingMasterId.toString()
          : "0",
        trainingCenterAssignmentID: "0",
      };
      const result = await cSCCenterTrainingAssignManageData(formdata);
      setIsLoadingCenterList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.CscAssignManage.length > 0) {
          const filteredData = result.response.responseData.CscAssignManage.filter(item => item.AssignmentFlag === 1);
          setCenterList(filteredData);
        } else {
          setCenterList([]);
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

  const onClickDeleteAssignedTrainee = async (data) => {
    debugger;
    try {
      const formdata = {
        viewMode: "UNASSIGN",
        cSCAppAccessTypeID: 503,
        centerID: centerMasterID ? centerMasterID.toString() : "0",
        trainingMasterID:
          assignUnAssignTraineeByAdminModal.TrainingMasterId
            ? assignUnAssignTraineeByAdminModal.TrainingMasterId.toString()
            : "0",
        userID: data.UserID,
        trainingUserAssignmentID: data.TrainingUserAssignmentID,
      };


      const result = await CSCUserTrainingAssignManageData(formdata);
      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });
        data.AssignmentFlag = 0;
        if (assignedTraineeByAdminGridApi) {
          const itemsToUpdate = [];
          assignedTraineeByAdminGridApi.forEachNode(function (rowNode) {
            if (rowNode.data.UserID === data.UserID) {
              itemsToUpdate.push(data);
              rowNode.setData(data);
            }
          });
          assignedTraineeByAdminGridApi.updateRowData({
            update: itemsToUpdate,
          });
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });

      }
    } catch (error) {
      setAlertMessage({ open: true, type: "error", message: error });
      console.log(error);
    }
  };


  const getSelectedRowData = () => {
    debugger;
    const selectedNodes = assignedTraineeByAdminGridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    return selectedData;
  };



  const handleFileUpload = (event) => {
    debugger;
    const file = event.target.files[0];
  
    if (
      file &&
      (file.type === "application/vnd.ms-excel" ||
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    ) {
      const reader = new FileReader();
  
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
  
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
  
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        
        
        if (!jsonData.some((row) => row.hasOwnProperty("User_ID"))) {
          setAlertMessage({
            type: "error",
            message: "XLS format is not appropriate. 'User_ID' column is missing.",
          });
          return;
        }
  
        const ids = jsonData.map((item) => item["User_ID"].toString());
  
        setExcelData(ids);
  
        let matchedCount = 0;
  
        if (assignedTraineeByAdminGridApi) {
          assignedTraineeByAdminGridApi.forEachNode((node) => {
            if (ids.includes(node.data.UserID.toString())) {
              node.setSelected(true);
              matchedCount++;
            }
          });
  
          assignedTraineeByAdminGridApi.refreshCells();
        }
  
      
        if (matchedCount > 0) {
          setAlertMessage({
            type: "success",
            message: `Successfully matched ${matchedCount} trainees from the uploaded file.`,
          });
        } else {
          setAlertMessage({
            type: "warning",
            message: "No trainees have matched from the uploaded file.",
          });
        }
      };
  
      reader.readAsArrayBuffer(file);
    } else {
      setAlertMessage({
        type: "error",
        message: "Invalid file format. Please upload a valid Excel file.",
      });
    }
  };
  

  
  
  

 
  


  const [btnLoaderActive, setBtnLoaderActive] = useState(false);
  const handleSave = async (e) => {
    debugger;
    try {
      if (e) e.preventDefault();
      if (!centerMasterID || centerMasterID.toString().trim() === "0") {
        setAlertMessage({
          type: "warning",
          message: "Please select trainee.",
        });
        return;
      }
      const checkedItem = getSelectedRowData();
      if (!checkedItem || checkedItem.length === 0) {
        setAlertMessage({
          type: "warning",
          message: "Please select at least one Trainee.",
        });
        return;
      }



      const UserIds = checkedItem
        .map((data) => data.UserID.toString())
        .join(",");

      setBtnLoaderActive(true);

      const formdata = {
        viewMode: "ASSIGN",
        cSCAppAccessTypeID: 503,
        centerID: centerMasterID ? centerMasterID.toString() : "0",
        trainingMasterID:
          assignUnAssignTraineeByAdminModal.TrainingMasterId
            ? assignUnAssignTraineeByAdminModal.TrainingMasterId.toString()
            : "0",
        userID: UserIds,
        trainingUserAssignmentID: "0",
      };

      const result = await CSCUserTrainingAssignManageData(formdata);
      setBtnLoaderActive(false);

      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });
        setFileKey(Date.now()); 
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; 
        }

        if (result.response.responseData) {
          const responseAssignedIds = result.response.responseData?.AssignedID
            ? result.response.responseData.AssignedID.split(",")
            : [];

          let assignedIds = [];
          if (responseAssignedIds.length > 0) {
            assignedIds = responseAssignedIds.reduce((assignmentIdList, data) => {
              const splitData = data.split("|");
              if (splitData.length > 1) {
                assignmentIdList.push({
                  UserID: splitData[0],
                  TrainingUserAssignmentID: splitData[1],
                });
              }
              return assignmentIdList;
            }, []);
          }

          if (assignedIds.length > 0) {
            const updatedTraineeList = TraineeByAdminList.map((x) => {
              let pUserID = !Array.isArray(x)
                ? x.UserID.toString()
                : x[0].UserID.toString();
              let assignedUser = assignedIds.find(
                (data) => pUserID === data.UserID.toString()
              );

              if (assignedUser) {
                return {
                  ...x,
                  AssignmentFlag: 1,
                  UserID: assignedUser.UserID,
                  TrainingUserAssignmentID: assignedUser.TrainingUserAssignmentID,
                };
              }
              return x;
            });

            setTraineeByAdminList(updatedTraineeList);
          }
        }

        if (assignedTraineeByAdminGridApi) {
          assignedTraineeByAdminGridApi.setRowData([...TraineeByAdminList]);
        }
      } else {
        setAlertMessage({
          type: "warning",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: error.message || "An error occurred",
      });
    }
  };
  


  const checkboxSelection = (params) => {
    console.log(params);
    if (params.node.data.AssignmentFlag === 1) {
      return false;
    } else {
      return true;
    }
  };

  const getRowStyle = (params) => {
    if (params.data.IsNewlyAdded) {
      return { background: "white" };
    }
    if (params.node.rowIndex % 2 === 0) {
      return { background: "white" };
    }          
    return { background: "white" };
  };


  const handleReset = () => {
    setExcelData([]); 
    setTraineeUserID([]); 
    setFilterValues({ txtAssignedCenter: null }); 
    setCenterMasterID("0"); 
    setSearchTextAssigendTraineeByAdmin(""); 
    setTraineeByAdminList([]); 

    setFileKey(Date.now()); 
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  
    if (assignedTraineeByAdminGridApi) {
      assignedTraineeByAdminGridApi.deselectAll(); 
      assignedTraineeByAdminGridApi.setRowData([]); 
    }
  
    setAlertMessage({ type: "success", message: "Reset successful!" });
  };
 



  



  useEffect(() => {
    debugger;
    getAssignedCenterListData(assignUnAssignTraineeByAdminModal);
  }, [assignUnAssignTraineeByAdminModal]);

  return (
    <>
      <Modal
        varient="half"
        title={`Trainee Allocation(${assignUnAssignTraineeByAdminModal.TrainingTitle
          ? assignUnAssignTraineeByAdminModal.TrainingTitle
          : ""
          })`}
        right={0}
        width="70vw"
        height="100vh"
        show={toggleAssignUnAssignTraineeByAdminModal}
      >
        <Modal.Body>
          <div
            className="PageStart"
          >
            <div className="top-actions">
              <div className="custom-ddl-container">
                <PageBar.Select
                  ControlTxt="Center"
                  label="Center"
                  name="txtAssignedCenter"
                  getOptionLabel={(option) => option.Center}
                  getOptionValue={(option) => option.CenterMasterID}
                  options={CenterList}
                  loader={isLoadingCenterList ? <Loader /> : null}
                  value={CenterList.find((center) => center.CenterMasterID === filterValues.txtAssignedCenter) || null}
                  onChange={(e) => updateState("txtAssignedCenter", e)}
                />

              </div>
              <input
               key={fileKey}
  type="file"
  accept=".csv, .xls, .xlsx"
  onChange={handleFileUpload}
  className="import-input"
  disabled={!filterValues.txtAssignedCenter} 
/>
<Button
    type="Button"
    varient="secondary"
    onClick={handleReset}
    className="custom-button-reset"
  >
    Reset
  </Button>

              <div className="custom-search-container">
                <input
                  type="text"
                  value={searchTextAssigendTraineeByAdmin}
                  onChange={(e) => onSearchAssignedTraineeByAdmin(e.target.value)}
                  className="custom-search-input"
                  placeholder="Search Trainee..."
                />

              </div>
            </div>
            <DataGrid
              rowData={TraineeByAdminList}
              loader={isLoadingTraineeByAdminList ? <Loader /> : null}
              suppressRowClickSelection={true}
              rowSelection={"multiple"}
              getRowStyle={getRowStyle}
              onGridReady={onAssignedTraineeByAdminGridReady}
              frameworkComponents={{
                assignedTraineeByAdminActionTemplate,
              }}
              className="custom-data-grid"
            >
              <DataGrid.Column
                lockPosition="1"
                pinned="left"
                headerName=""
                field=""
                flex={1}
                width={80}
                headerCheckboxSelection
                headerCheckboxSelectionFilteredOnly
              // A  checkboxSelection={checkboxSelection}
              checkboxSelection={(params) => params.node.data.AssignmentFlag !== 1}
                tooltipField="Assign The TraineeByAdmin"
                cellRenderer="assignedTraineeByAdminActionTemplate"
                cellRendererParams={{
                  onClickDeleteAssignedTrainee,
                }}

              />
              <DataGrid.Column
                field="#"
                headerName="Sr No."
                width={75}
                flex={1}
                valueGetter="node.rowIndex + 1"
                pinned="left"
              />
              <DataGrid.Column
                field="AssignmentFlag"
                headerName="Status"
                width={110}
                flex={1}
                valueFormatter={(param) =>
                  param.value === 1 ? "Assigned" : " Not Assigned"
                }
              />
              <DataGrid.Column
                field="UserID"
                headerName="User ID"
                width={100}
                flex={1}
              />
              <DataGrid.Column
                field="NAME"
                headerName="Trainee Name"
                width={150}
                flex={1}
              />
              <DataGrid.Column
                field="Center"
                flex={1}
                headerName="Center Name"
                width={120}
              />
            </DataGrid>
          </div>
        </Modal.Body>
        <Modal.Footer>
        <Button
    type="Button"
    varient="danger"
    onClick={(e) => handleSave(e)}
    trigger={btnLoaderActive ? "true" : "false"}
    className="custom-button-AssignUnassign"
  >
    Save
  </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AssignUnassginTraineeByAdmin;

const assignedTraineeByAdminActionTemplate = (props) => {
  return (
    <div style={{ display: "flex" }}>
      {props.data && props.data.AssignmentFlag === 1 ? (
        <span
          title="Unassign the trainee"
          style={{
            cursor: "pointer",
            display: "grid",
            marginTop: "3px",
            marginRight: "3px",
          }}
        >
          <FiTrash2
            style={{ fontSize: "15px", color: "#5d6d7e" }}
            onClick={() => props.onClickDeleteAssignedTrainee(props.data)}
          />
        </span>
      ) : null}
    </div>
  );
};
