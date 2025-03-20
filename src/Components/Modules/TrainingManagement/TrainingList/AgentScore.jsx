import React, { useState, useEffect } from "react";
import { AlertMessage, Loader } from "Framework/Components/Widgets";
import Modal from "Framework/Components/Layout/Modal/Modal";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { Button } from "Framework/Components/Widgets";
import { setAssignList, CSCAssessmentUpdateMark } from "../Services/Methods";



function AgentScore({
    toggleAgentScoreModal,
    trainingDetails,
    
}) {
    const setAlertMessage = AlertMessage();

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

            setIsLoadingCenterList(true);
            const formdata = {
                viewMode: "GETALLASSIGNED",
                cSCAppAccessTypeID: 503,
                centerID: "0",
                trainingMasterID: trainingDetails && trainingDetails.TrainingMasterId
                    ? trainingDetails.TrainingMasterId.toString()
                    : "0",
                userID: "0",
                trainingUserAssignmentID: "0",
            };
            const result = await setAssignList(formdata);
            setIsLoadingCenterList(false);
            if (result.response.responseCode === 1) {
                if (result.response.responseData && result.response.responseData.CscAssignManage.length > 0) {
                    const filteredData = result.response.responseData.CscAssignManage.filter(item => item.IsPresent === "Y");
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

    const [btnLoaderActive, setBtnLoaderActive] = useState(false);
    const handleSave = async (e) => {
        debugger;
        try {
            if (e) e.preventDefault();
            let pUserID, pTrainingUserAssignmentID, pOptedMarks = "";
            let updatedArray = [];
            if(assignedCenterGridApi) {
                assignedCenterGridApi.forEachNode(function (rowNode) {
                    if(rowNode.data.OptedMarks === "" || rowNode.data.OptedMarks === null || rowNode.data.OptedMarks === undefined ){
                        setAlertMessage({
                            type: "warning",
                            message: `Marks is required at row no. ${rowNode.rowIndex + 1}`,
                        });
                    updatedArray.push([]);    
                    throw new Error("Break");
                    }
                    if(rowNode.data.OptedMarks > 100) {
                        setAlertMessage({
                            type: "warning",
                            message: `Marks can not be greater than 100 at row no. ${rowNode.rowIndex + 1}`,
                        });
                        updatedArray.push([]);    
                        throw new Error("Break");
                    }
                    updatedArray.push(rowNode.data);
                });  
                pUserID = updatedArray
                 .map((data) => {
                 return data.UserID;
                })
                .join(","); 
                pTrainingUserAssignmentID = updatedArray
                 .map((data) => {
                 return data.TrainingUserAssignmentID;
                })
                .join(","); 
                pOptedMarks = updatedArray
                 .map((data) => {
                 return data.OptedMarks;
                })
                .join(",");  
            }    
            setBtnLoaderActive(true);
            const formdata = {
                SPTrainingUserAssignmentID: pTrainingUserAssignmentID,
                SPTrainingMasterID: trainingDetails && trainingDetails.TrainingMasterId
                    ? trainingDetails.TrainingMasterId
                    : 0,
               SPOptedMarks: pOptedMarks,
               SPUserID: pUserID
            };
            const result = await CSCAssessmentUpdateMark(formdata);
            setBtnLoaderActive(false);
            if (result.response.responseCode === 1) {
                setAlertMessage({
                    type: "success",
                    message: result.response.responseMessage,
                });
            } else {
                setAlertMessage({
                    type: "warning",
                    message: result.response.responseMessage,
                });
            }
        } catch (error) {
          if (error.message !== "Break")
          {
            setAlertMessage({
                type: "error",
                message: error,
            });
        }
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

    useEffect(() => {
        debugger;
        getAssignedUserListData(toggleAgentScoreModal);
    }, [toggleAgentScoreModal]);


    return (
        <>
            <Modal
                varient="half"
                title='Mark Assesment Score'
                right={0}
                width="55vw"
                height="100vh"
                show={toggleAgentScoreModal}
            >
                <Modal.Body>
                    <div
                        className="PageStart"
                    >


                        <div className="custom-search-container">
                            <input
                                type="text"
                                value={searchTextAssigendCenter}
                                onChange={(e) => onSearchAssignedCenter(e.target.value)}
                                className="custom-search-input"
                                placeholder="Search"
                            />

                        </div>
                        <DataGrid
                            rowData={CenterList}
                            loader={isLoadingCenterList ? <Loader /> : null}
                            suppressRowClickSelection={true}
                            rowSelection={"multiple"}
                            getRowStyle={getRowStyle}
                            onGridReady={onAssignedCenterGridReady}
                            domLayout="autoHeight"
                            className="custom-data-grid"
                        >
                            <DataGrid.Column
                                field="#"
                                headerName="Sr No."
                                flex={1}
                                width={75}
                                valueGetter="node.rowIndex + 1"
                                pinned="left"
                                headerComponentParams={{
                                    style: { backgroundColor: "#04540", color: "white", fontSize: "14px", textAlign: "center" },
                                }}
                            />
                            <DataGrid.Column
                                field="IsPresent"
                                headerName="Is-Present"
                                width={110}
                                flex={1}
                                headerComponentParams={{
                                    style: { backgroundColor: "#04540", color: "white", fontSize: "14px", textAlign: "center" },
                                }}
                                valueFormatter={(param) => (param.value === "Y" ? "Present" : "Absent")}
                            />
                            <DataGrid.Column
                                field="UserID"
                                headerName="User ID"
                                width={120}
                                flex={1}
                                headerComponentParams={{
                                    style: { backgroundColor: "#04540", color: "white", fontSize: "14px", textAlign: "center" },
                                }}
                            />

                            <DataGrid.Column
                                field="NAME"
                                headerName="Trainee Name"
                                width={150}
                                flex={1}
                                headerComponentParams={{
                                    style: { backgroundColor: "#04540", color: "white", fontSize: "14px", textAlign: "center" },
                                }}
                            />
                             <DataGrid.Column
                                field="OptedMarks"
                                headerName="Marks"
                                width={150}
                                flex={1}
                                cellRenderer={(node) => {
                                    const handleChange = (event) => {
                                        const updatedMarks = event.target.value.replace(/\D/g, "");
                                        node.data.OptedMarks = updatedMarks;
                                        node.api.refreshCells({ rowNodes: [node.node] });
                                    };                        
                                    return (
                                        <input
                                            type="text"
                                            value={node.data?.OptedMarks || ""}
                                            maxLength={3}
                                            onChange={handleChange}
                                        />
                                    );
                                }}
                                headerComponentParams={{
                                    style: { backgroundColor: "#04540", color: "white", fontSize: "14px", textAlign: "center" },
                                }}
                            />
                            <DataGrid.Column
                                field="Center"
                                headerName="Center Name"
                                width={150}
                                flex={1}
                                headerComponentParams={{
                                    style: { backgroundColor: "#04540", color: "white", fontSize: "14px", textAlign: "center" },
                                }}
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
                        <span className="button-content">
                            Save
                        </span>
                    </Button>



                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AgentScore;