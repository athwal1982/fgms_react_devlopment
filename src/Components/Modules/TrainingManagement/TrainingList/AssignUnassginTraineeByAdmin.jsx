import React, { useState, useEffect } from "react";
import { AlertMessage, Loader } from "Framework/Components/Widgets";
import Modal from "Framework/Components/Layout/Modal/Modal";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { Button } from "Framework/Components/Widgets";
import { FaPaperPlane } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
// A import { getSessionStorage } from "Components/Modules/Common/Login/Auth/auth";
import { getSessionStorage } from "../../../Common/Login/Auth/auth";
import { cSCCenterTrainingAssignManageData,CSCUserTrainingAssignManageData } from "../Services/Methods";
import "./TrainingList.scss";


function AssignUnassginTraineeByAdmin({
    toggleAssignUnAssignTraineeByAdminModal,
  assignUnAssignTraineeByAdminModal,
}) {
  const setAlertMessage = AlertMessage();

  const userData = getSessionStorage("user");

  const [filterValues, setFilterValues] = useState({
    txtAssignedCenter: null,
  });

  
  const updateState = (name, value) => {
    setFilterValues({ ...filterValues, [name]: value });

    if(name === "txtAssignedCenter") {
      setFilterValues({
        ...filterValues,
        txtAssignedCenter: value,
      });

      if(value) {
        getAssignedUserListData(value);
      }
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
  const getAssignedUserListData = async (data) => {
    debugger;
    // A setProfileRightData(data);
    try {
      setTraineeByAdminList([]);
      setIsLoadingTraineeByAdminList(true);
      const formdata = {
        viewMode: "GETALLUSER",
        cSCAppAccessTypeID: userData && userData.CSCAccessTypeID ? userData.CSCAccessTypeID : 0,
        centerID: filterValues.txtAssignedCenter && filterValues.txtAssignedCenter.CenterMasterID
        ? filterValues.txtAssignedCenter.CenterMasterID.toString()
        : "0",
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
                      setCenterList(result.response.responseData.CscAssignManage);
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

  useEffect(() => {
    debugger;
    getAssignedCenterListData(assignUnAssignTraineeByAdminModal);
  }, [assignUnAssignTraineeByAdminModal]);

  const onClickDeleteAssignedTraineeByAdmin = async (data) => {
    debugger;
    try {
      const formdata = {
        viewMode: "UNASSIGN",
        cSCAppAccessTypeID: userData && userData.CSCAccessTypeID ? userData.CSCAccessTypeID : 0,
        centerID: assignUnAssignTraineeByAdminModal && assignUnAssignTraineeByAdminModal.CenterMasterID
        ? assignUnAssignTraineeByAdminModal.CenterMasterID.toString()
        : "0",
        trainingMasterID: assignUnAssignTraineeByAdminModal && assignUnAssignTraineeByAdminModal.TrainingMasterID
        ? assignUnAssignTraineeByAdminModal.TrainingMasterID.toString()
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
    const selectedNodes = assignedTraineeByAdminGridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    return selectedData;
  };

  const [btnLoaderActive, setBtnLoaderActive] = useState(false);
  const handleSave = async (e) => {
    debugger;
    try {
      if (e) e.preventDefault();
      const checkedItem = getSelectedRowData();
      if (checkedItem.length === 0) {
        setAlertMessage({
          type: "warning",
          message: "Please select atleast one TraineeByAdmin.",
        });
        return;
      }
      const UserIds = checkedItem
        .map((data) => {
          return data.UserID;
        })
        .join(",");
      setBtnLoaderActive(true);

      const formdata = {
        viewMode: "ASSIGN",
        cSCAppAccessTypeID: userData && userData.CSCAccessTypeID ? userData.CSCAccessTypeID : 0,
        centerID: assignUnAssignTraineeByAdminModal && assignUnAssignTraineeByAdminModal.CenterMasterID
        ? assignUnAssignTraineeByAdminModal.CenterMasterID.toString()
        : "0",
        trainingMasterID: assignUnAssignTraineeByAdminModal && assignUnAssignTraineeByAdminModal.TrainingMasterID
        ? assignUnAssignTraineeByAdminModal.TrainingMasterID.toString()
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
        if (result.response.responseData) {
          const responseAssignedIds = result.response.responseData.AssignedID
            ? result.response.responseData.AssignedID.split(",")
            : [];
          console.log(responseAssignedIds);
          let assignedIds = [];
          if (responseAssignedIds.length > 0) {
            assignedIds = responseAssignedIds.reduce(
              (assignmentIdList, data) => {
                const splitData = data.split("|");
                if (splitData.length > 0 && splitData[0] && splitData[1]) {
                  assignmentIdList.push({
                    UserID: splitData[0],
                    TrainingUserAssignmentID: splitData[1],
                  });
                }
                return assignmentIdList;
              },
              []
            );
          }

          if (assignedIds.length > 0) {
            assignedIds.forEach((data) => {
              TraineeByAdminList.forEach((x) => {
                let pUserID = "0";
                if (!Array.isArray(x)) {
                  pUserID = x.UserID.toString();
                } else {
                  pUserID =  x[0].UserID.toString();
                }
                if (pUserID === data.UserID.toString()) {
                  x.AssignmentFlag = 1;
                  x.UserID = data.UserID;
                  x.TrainingUserAssignmentID = data.TrainingUserAssignmentID;
                }
              });
            });
          }
        }

        setTraineeByAdminList([]);
        setTraineeByAdminList(TraineeByAdminList);
        if (assignedTraineeByAdminGridApi) {
          assignedTraineeByAdminGridApi.setRowData(TraineeByAdminList);
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
        message: error,
      });
    }
  };

  const updateAssignUnAssignTraineeByAdmin = (addedTraineeByAdmin) => {
    if (assignedTraineeByAdminGridApi) {
      const rowData = [];
      if (addedTraineeByAdmin && addedTraineeByAdmin.length > 0) {
        addedTraineeByAdmin.forEach((data) => {
          rowData.push(data);
        });
      }
      assignedTraineeByAdminGridApi.forEachNode((node) => rowData.push(node.data));
      assignedTraineeByAdminGridApi.setRowData(rowData);
      TraineeByAdminList.unshift(addedTraineeByAdmin[0]);
      setTraineeByAdminList([]);
      setTraineeByAdminList(TraineeByAdminList);
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

  return (
    <>
      <Modal
        varient="half"
        title={`Assign/Unassign Trainee (${
            assignUnAssignTraineeByAdminModal.TrainingTitle
            ? assignUnAssignTraineeByAdminModal.TrainingTitle
            : ""
        })`}
        right={0}
        width="50vw"
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
                      getOptionLabel={(option) => `${option.Center}`}
                      getOptionValue={(option) => `${option}`}
                      options={CenterList}
                      loader={isLoadingCenterList ? <Loader /> : null}
                      value={filterValues.txtAssignedCenter}
                      onChange={(e) => updateState("txtAssignedCenter", e)}
                    /> 
              </div>           
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
                checkboxSelection={checkboxSelection}
                tooltipField="Assign The TraineeByAdmin"
                cellRenderer="assignedTraineeByAdminActionTemplate"
                cellRendererParams={{
                  onClickDeleteAssignedTraineeByAdmin,
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
             <FaPaperPlane className="icon" />
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
