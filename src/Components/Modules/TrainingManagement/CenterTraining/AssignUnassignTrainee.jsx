import React, { useState, useEffect } from "react";
import { AlertMessage, Loader } from "Framework/Components/Widgets";
import Modal from "Framework/Components/Layout/Modal/Modal";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { Button } from "Framework/Components/Widgets";
import { FaPaperPlane } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
// A import { getSessionStorage } from "Components/Modules/Common/Login/Auth/auth";
import { getSessionStorage } from "../../../Common/Login/Auth/auth";
import { CSCUserTrainingAssignManageData } from "../Services/Methods";
import "./CenterTraining.scss";


function AssignUnAssignTrainee({
    toggleAssignUnAssignCenterModal,
  assignUnAssignTraineeModal,
}) {
  const setAlertMessage = AlertMessage();

  const userData = getSessionStorage("user");

  const [assignedTraineeGridApi, setAssignedTraineeGridApi] = useState();
  const onAssignedTraineeGridReady = (params) => {
    setAssignedTraineeGridApi(params.api);
  };

  const [searchTextAssigendTrainee, setSearchTextAssigendTrainee] = useState("");
  const onSearchAssignedTrainee = (val) => {
    debugger;
    setSearchTextAssigendTrainee(val);
    assignedTraineeGridApi.setQuickFilter(val);
    assignedTraineeGridApi.refreshCells();
  };

  const [TraineeList, setTraineeList] = useState([]);
  const [isLoadingTraineeList, setIsLoadingTraineeList] = useState(false);
  const getAssignedUserListData = async (data) => {
    debugger;
    // A setProfileRightData(data);
    try {
      setTraineeList([]);
      setIsLoadingTraineeList(true);
      const formdata = {
        viewMode: "GETALLUSER",
        cSCAppAccessTypeID: userData && userData.CSCAccessTypeID ? userData.CSCAccessTypeID : 0,
        centerID: assignUnAssignTraineeModal && assignUnAssignTraineeModal.CenterMasterID
        ? assignUnAssignTraineeModal.CenterMasterID.toString()
        : "0",
        trainingMasterID: assignUnAssignTraineeModal && assignUnAssignTraineeModal.TrainingMasterID
        ? assignUnAssignTraineeModal.TrainingMasterID.toString()
        : "0",
        userID: "0",
        trainingUserAssignmentID: "0",
      };
      const result = await CSCUserTrainingAssignManageData(formdata);
      setIsLoadingTraineeList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.CscAssignManage.length > 0) {
          setTraineeList(result.response.responseData.CscAssignManage);
        } else {
          setTraineeList([]);
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
    debugger;
    getAssignedUserListData(assignUnAssignTraineeModal);
  }, [assignUnAssignTraineeModal]);

  const onClickDeleteAssignedTrainee = async (data) => {
    debugger;
    try {
      const formdata = {
        viewMode: "UNASSIGN",
        TraineeID: data.TraineeMasterID,
        trainingMasterID: assignUnAssignTraineeModal && assignUnAssignTraineeModal.TrainingMasterId
        ? assignUnAssignTraineeModal.TrainingMasterId.toString()
        : "0",
        trainingTraineeAssignmentID: data.TrainingTraineeAssignmentID,
      };
      const result = await CSCUserTrainingAssignManageData(formdata);
      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });
        data.AssignmentFlag = 0;
        if (assignedTraineeGridApi) {
          const itemsToUpdate = [];
          assignedTraineeGridApi.forEachNode(function (rowNode) {
            if (rowNode.data.TraineeMasterID === data.TraineeMasterID) {
              itemsToUpdate.push(data);
              rowNode.setData(data);
            }
          });
          assignedTraineeGridApi.updateRowData({
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
    const selectedNodes = assignedTraineeGridApi.getSelectedNodes();
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
          message: "Please select atleast one Trainee.",
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
        centerID: assignUnAssignTraineeModal && assignUnAssignTraineeModal.CenterMasterID
        ? assignUnAssignTraineeModal.CenterMasterID.toString()
        : "0",
        trainingMasterID: assignUnAssignTraineeModal && assignUnAssignTraineeModal.TrainingMasterID
        ? assignUnAssignTraineeModal.TrainingMasterID.toString()
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
                    TraineeMasterID: splitData[0],
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
              TraineeList.forEach((x) => {
                let pTraineeMasterID = "0";
                if (!Array.isArray(x)) {
                  pTraineeMasterID = x.TraineeMasterID.toString();
                } else {
                  pTraineeMasterID = x[0].TraineeMasterID.toString();
                }
                if (pTraineeMasterID === data.TraineeMasterID.toString()) {
                  x.AssignmentFlag = 1;
                  x.TraineeMasterID = data.TraineeMasterID;
                  x.TrainingTraineeAssignmentID = data.TrainingUserAssignmentID;
                }
              });
            });
          }
        }

        setTraineeList([]);
        setTraineeList(TraineeList);
        if (assignedTraineeGridApi) {
          assignedTraineeGridApi.setRowData(TraineeList);
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

  const updateAssignUnAssignTrainee = (addedTrainee) => {
    if (assignedTraineeGridApi) {
      const rowData = [];
      if (addedTrainee && addedTrainee.length > 0) {
        addedTrainee.forEach((data) => {
          rowData.push(data);
        });
      }
      assignedTraineeGridApi.forEachNode((node) => rowData.push(node.data));
      assignedTraineeGridApi.setRowData(rowData);
      TraineeList.unshift(addedTrainee[0]);
      setTraineeList([]);
      setTraineeList(TraineeList);
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
            assignUnAssignTraineeModal.TrainingTitle
            ? assignUnAssignTraineeModal.TrainingTitle
            : ""
        })`}
        right={0}
        width="50vw"
        height="100vh"
        show={toggleAssignUnAssignCenterModal}
      >
        <Modal.Body>
          <div
            className="PageStart"
          >
          
            <div className="custom-search-container">
                            <input
                                type="text"
                                value={searchTextAssigendTrainee}
                                onChange={(e) => onSearchAssignedTrainee(e.target.value)}
                                className="custom-search-input"
                                placeholder="Search Trainee..."
                            />

                        </div>


            <DataGrid
              rowData={TraineeList}
              loader={isLoadingTraineeList ? <Loader /> : null}
              suppressRowClickSelection={true}
              rowSelection={"multiple"}
              getRowStyle={getRowStyle}
              onGridReady={onAssignedTraineeGridReady}
              frameworkComponents={{
                assignedTraineeActionTemplate,
              }}
               className="custom-data-grid"
            >
              <DataGrid.Column
                lockPosition="1"
                pinned="left"
                headerName="Action"
                field=""
                flex={1}
                width={80}
                // A headerCheckboxSelection
                // A headerCheckboxSelectionFilteredOnly
                checkboxSelection={checkboxSelection}
                tooltipField="Assign The Trainee"
                cellRenderer="assignedTraineeActionTemplate"
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
                width={120}
                flex={1}
                valueFormatter={(param) =>

                  param.value === 1 ? "Assigned" : " Not Assigned"
                }
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
                width={150}
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

export default AssignUnAssignTrainee;

const assignedTraineeActionTemplate = (props) => {
  return (
    <div style={{ display: "flex" }}>
      {props.data && props.data.AssignmentFlag === 1 ? (
        <span
          title="Unassign The Center"
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
