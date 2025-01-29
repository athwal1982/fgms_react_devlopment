import React, { useEffect } from "react";
import { DataGrid, PageBar, Modal } from "Framework/Components/Layout";
import { HiArrowCircleLeft } from "react-icons/hi";
import { Splitter, Loader } from "Framework/Components/Widgets";
import PropTypes from "prop-types";
import DistrictAssignModalLogic from "./Logic/DistrictAssignModalLogic";
import BizClass from "./DistrictAssignModal.module.scss";

const cellTemplate = (props) => {
  return (
    <div className={BizClass.celltemplate}>
      <button type="button">
        <HiArrowCircleLeft
          style={{ fontSize: "20px", color: "#28323d", border: "none", background: "white", marginTop: "1px", transform: "rotate(180deg)" }}
          onClick={() => props.onGetAssignDistrict(props.data)}
        />
      </button>
    </div>
  );
};
const cellDistrictTemplate = (props) => {
  const assign = props.data;
  console.log(props.data);
  return (
    <div style={{ display: "flex", gap: "4px", marginTop: "2px" }}>
      {assign && assign.AssignmentFlag.toString() === "1" ? (
        <>
          {" "}
          <button type="button" className={BizClass.UnAssignActionButton} onClick={() => props.onUnAssignDistrict(props.data)}>
            Un-Assign
          </button>
        </>
      ) : (
        <button type="button" className={BizClass.ActionButton} onClick={() => props.onAssignDistrict(props.data)} style={{ cursor: "pointer" }}>
          Assign
        </button>
      )}
    </div>
  );
};

function DistrictAssignModal({ showfunc, selectedUserData }) {
  const {
    districtList,
    isLoadingDistrictList,
    getStateListData,
    searchTextDistrict,
    searchTextSubDistrict,
    onDistrictrGridReady,
    onAssinGridReady,
    onGetAssignDistrict,
    onSearchDistrict,
    onSearchSubDistrict,
    setSelectedUser,
    assignDistrictlist,
    onAssignDistrict,
    onUnAssignDistrict,
    btnLoaderActive,
    OnAssignAll,
    assignallbtn,
    setAssignallbtn,
    setAssignallHidebtn,
    assignallHidebtn,
  } = DistrictAssignModalLogic();

  useEffect(() => {
    debugger;
    setSelectedUser(selectedUserData);
    getStateListData(selectedUserData);
  }, [selectedUserData]);

  const getRowStyle = (params) => {
    if (params.data.AssignmentFlag === 0) {
      setAssignallbtn(true);
      setAssignallHidebtn(true);
    }

    if (params.data.IsSelected) {
      return { background: "#ffc176" };
    }
    return { background: "" };
  };
  const getRowStyle1 = (params) => {
    if (params.data.AssignmentFlag === 0) {
      setAssignallbtn(true);
      setAssignallHidebtn(true);
    }
    if (params.data.IsNewlyAdded) {
      return { background: "#d5a10e" };
    }
    if (params.data.IsSelected) {
      return { background: "#ffc176" };
    }
    return { background: "" };
  };

  return (
    <Modal varient="full" title="Assign District" show={showfunc} height="100vh" width="100vw">
      <Modal.Body>
        <div className={BizClass.PageStart}>
          <Splitter varient="column" template="1fr 9px 1fr">
            <div className={BizClass.Card}>
              <PageBar>
                <PageBar.Search onClick={() => console.log("CLicked")} value={searchTextDistrict} onChange={(e) => onSearchDistrict(e.target.value)} />
              </PageBar>
              <DataGrid
                rowData={districtList}
                loader={isLoadingDistrictList ? <Loader /> : false}
                getRowStyle={getRowStyle}
                components={{
                  actionTemplate: cellTemplate,
                }}
                onGridReady={onDistrictrGridReady}
              >
                <DataGrid.Column
                  headerName="Action"
                  lockPosition="1"
                  pinned="left"
                  width={125}
                  cellRenderer="actionTemplate"
                  cellRendererParams={{ onGetAssignDistrict }}
                />

                <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} />
                <DataGrid.Column headerName="State " field="StateMasterName" width={240} />
              </DataGrid>
            </div>
            <div className={BizClass.Card}>
              <PageBar>
                <PageBar.Search onClick={() => console.log("CLicked")} value={searchTextSubDistrict} onChange={(e) => onSearchSubDistrict(e.target.value)} />
                {assignallHidebtn ? (
                  <PageBar.Button onClick={() => OnAssignAll(assignallbtn === true ? "A" : "D")}>
                    {assignallbtn === true ? "Assign ALL" : "Un Assign ALL"}
                  </PageBar.Button>
                ) : null}
              </PageBar>
              <DataGrid
                rowData={assignDistrictlist}
                loader={btnLoaderActive ? <Loader /> : false}
                getRowStyle={getRowStyle1}
                onGridReady={onAssinGridReady}
                defaultColDef={{
                  flex: 1,
                  resizable: true,
                }}
                frameworkComponents={{
                  cellDistrictTemplate,
                }}
                autoGroupColumnDef={{
                  headerName: "District",
                  minWidth: 220,
                  cellRendererParams: {
                    innerRenderer: (params) => {
                      return params.data.DistrictMasterName;
                    },
                  },
                }}
              >
                <DataGrid.Column headerName="District Name" field="DistrictMasterName" width={150} />
                <DataGrid.Column
                  headerName="Action"
                  lockPosition="1"
                  pinned="left"
                  width={125}
                  cellRenderer="cellDistrictTemplate"
                  cellRendererParams={{
                    onAssignDistrict,
                    onUnAssignDistrict,
                  }}
                />
              </DataGrid>
            </div>
          </Splitter>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default DistrictAssignModal;

DistrictAssignModal.propTypes = {
  districtList: PropTypes.array,
  showfunc: PropTypes.func.isRequired,
  selectedUserData: PropTypes.object,
  onAssignDistrict: PropTypes.func.isRequired,
  onUnAssignDistrict: PropTypes.func.isRequired,
};
