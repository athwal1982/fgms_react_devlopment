import React, { useState, useEffect } from "react";
import { AlertMessage, Loader } from "Framework/Components/Widgets";
import Modal from "Framework/Components/Layout/Modal/Modal";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { Button } from "Framework/Components/Widgets";
import { FiTrash2 } from "react-icons/fi";
// A import { getSessionStorage } from "Components/Modules/Common/Login/Auth/auth";
import { getSessionStorage } from "../../../Common/Login/Auth/auth";
import { cSCCenterTrainingAssignManageData } from "../Services/Methods";
import "./TrainingList.scss";


function AssignUnAssignCenter({
    toggleAssignUnAssignCenterModal,
  assignUnAssignCenterModal,
}) {
  const setAlertMessage = AlertMessage();

  const userData = getSessionStorage("user");

  const [assignedCenterGridApi, setAssignedCenterGridApi] = useState();
  const onAssignedCenterGridReady = (params) => {
    setAssignedCenterGridApi(params.api);
  };

  const [searchTextAssigendCenter, setSearchTextAssigendCenter] = useState("");
  const onSearchAssignedCenter = (val) => {
    debugger;
    setSearchTextAssigendCenter(val);
    assignedCenterGridApi.setQuickFilter(val);
    assignedCenterGridApi.refreshCells();
  };

  const [CenterList, setCenterList] = useState([]);
  const [isLoadingCenterList, setIsLoadingCenterList] = useState(false);
  const getAssignedUserListData = async (data) => {
    debugger;
    // A setProfileRightData(data);
    try {
      setCenterList([]);
      setIsLoadingCenterList(true);
      const formdata = {
        viewMode: "GETALLCENTER",
        centerID: "0",
        trainingMasterID: assignUnAssignCenterModal && assignUnAssignCenterModal.TrainingMasterId
        ? assignUnAssignCenterModal.TrainingMasterId.toString()
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
    getAssignedUserListData(assignUnAssignCenterModal);
  }, [assignUnAssignCenterModal]);

  const onClickDeleteAssignedCenter = async (data) => {
    debugger;
    try {
      const formdata = {
        viewMode: "UNASSIGN",
        centerID: data.CenterMasterID,
        trainingMasterID: assignUnAssignCenterModal && assignUnAssignCenterModal.TrainingMasterId
        ? assignUnAssignCenterModal.TrainingMasterId.toString()
        : "0",
        trainingCenterAssignmentID: data.TrainingCenterAssignmentID,
      };
      const result = await cSCCenterTrainingAssignManageData(formdata);
      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });
        data.AssignmentFlag = 0;
        if (assignedCenterGridApi) {
          const itemsToUpdate = [];
          assignedCenterGridApi.forEachNode(function (rowNode) {
            if (rowNode.data.CenterMasterID === data.CenterMasterID) {
              itemsToUpdate.push(data);
              rowNode.setData(data);
            }
          });
          assignedCenterGridApi.updateRowData({
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
    const selectedNodes = assignedCenterGridApi.getSelectedNodes();
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
          message: "Please select atleast one Center.",
        });
        return;
      }
      const CenterIds = checkedItem
        .map((data) => {
          return data.CenterMasterID;
        })
        .join(",");
      setBtnLoaderActive(true);

      const formdata = {
        viewMode: "ASSIGN",
        centerID: CenterIds,
        trainingMasterID: assignUnAssignCenterModal && assignUnAssignCenterModal.TrainingMasterId
        ? assignUnAssignCenterModal.TrainingMasterId.toString()
        : "0",
        trainingCenterAssignmentID: "0",
      };

      const result = await cSCCenterTrainingAssignManageData(formdata);
      setBtnLoaderActive(false);
      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });
        if (result.response.responseData) {
          const responseAssignedIds = result.response.responseData.AssignCenterID
            ? result.response.responseData.AssignCenterID.split(",")
            : [];
          console.log(responseAssignedIds);
          let assignedIds = [];
          if (responseAssignedIds.length > 0) {
            assignedIds = responseAssignedIds.reduce(
              (assignmentIdList, data) => {
                const splitData = data.split("|");
                if (splitData.length > 0 && splitData[0] && splitData[1]) {
                  assignmentIdList.push({
                    CenterMasterID: splitData[0],
                    TrainingCenterAssignmentID: splitData[1],
                  });
                }
                return assignmentIdList;
              },
              []
            );
          }

          if (assignedIds.length > 0) {
            assignedIds.forEach((data) => {
              CenterList.forEach((x) => {
                let pCenterMasterID = "0";
                if (!Array.isArray(x)) {
                  pCenterMasterID = x.CenterMasterID.toString();
                } else {
                  pCenterMasterID = x[0].CenterMasterID.toString();
                }
                if (pCenterMasterID === data.CenterMasterID.toString()) {
                  x.AssignmentFlag = 1;
                  x.CenterMasterID = data.CenterMasterID;
                  x.TrainingCenterAssignmentID = data.TrainingCenterAssignmentID;
                }
              });
            });
          }
        }

        setCenterList([]);
        setCenterList(CenterList);
        if (assignedCenterGridApi) {
          assignedCenterGridApi.setRowData(CenterList);
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

  const updateAssignUnAssignCenter = (addedCenter) => {
    if (assignedCenterGridApi) {
      const rowData = [];
      if (addedCenter && addedCenter.length > 0) {
        addedCenter.forEach((data) => {
          rowData.push(data);
        });
      }
      assignedCenterGridApi.forEachNode((node) => rowData.push(node.data));
      assignedCenterGridApi.setRowData(rowData);
      CenterList.unshift(addedCenter[0]);
      setCenterList([]);
      setCenterList(CenterList);
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
        title={`Assign/Unassign Center (${
            assignUnAssignCenterModal.TrainingTitle
            ? assignUnAssignCenterModal.TrainingTitle
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
            <PageBar>
              <PageBar.Search
                value={searchTextAssigendCenter}
                onChange={(e) => onSearchAssignedCenter(e.target.value)}
              />
            </PageBar>


            <DataGrid
              rowData={CenterList}
              loader={isLoadingCenterList ? <Loader /> : null}
              suppressRowClickSelection={true}
              rowSelection={"multiple"}
              getRowStyle={getRowStyle}
              onGridReady={onAssignedCenterGridReady}
              frameworkComponents={{
                assignedCenterActionTemplate,
              }}
            >
              <DataGrid.Column
                lockPosition="1"
                pinned="left"
                headerName="Action"
                field=""
                width={80}
                // A headerCheckboxSelection
                // A headerCheckboxSelectionFilteredOnly
                checkboxSelection={checkboxSelection}
                tooltipField="Assign the center"
                cellRenderer="assignedCenterActionTemplate"
                cellRendererParams={{
                  onClickDeleteAssignedCenter,
                }}
                
              />
              <DataGrid.Column
                field="#"
                headerName="Sr No."
                width={75}
                valueGetter="node.rowIndex + 1"
                pinned="left"
              />
              <DataGrid.Column
                field="AssignmentFlag"
                headerName="Status"
                width={120}
                valueFormatter={(param) =>
                  param.value === 1 ? "Assigned" : " Not Assigned"
                }
              />
              <DataGrid.Column
                field="Center"
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
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AssignUnAssignCenter;

const assignedCenterActionTemplate = (props) => {
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
            onClick={() => props.onClickDeleteAssignedCenter(props.data)}
          />
        </span>
      ) : null}
    </div>
  );
};
