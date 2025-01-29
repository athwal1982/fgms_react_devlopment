import React, { useEffect } from "react";
import { DataGrid, PageBar, Modal } from "Framework/Components/Layout";
import { HiArrowCircleLeft } from "react-icons/hi";
import { Splitter, Loader } from "Framework/Components/Widgets";
import PropTypes from "prop-types";
import CategoryAssignModalLogic from "./Logic/CategoryAssignModalLogic";
import BizClass from "./CategoryAssignModal.module.scss";

const cellTemplate = (props) => {
  return (
    <div className={BizClass.celltemplate}>
      <button type="button">
        <HiArrowCircleLeft
          style={{ fontSize: "20px", color: "#28323d", border: "none", background: "white", marginTop: "1px", transform: "rotate(180deg)" }}
          onClick={() => props.onGetAssignCategory(props.data)}
        />
      </button>
    </div>
  );
};
const cellCategoryTemplate = (props) => {
  const assign = props.data;
  console.log(props.data);
  return (
    <div style={{ display: "flex", gap: "4px", marginTop: "2px" }}>
      {assign && assign.AssignmentFlag.toString() === "1" ? (
        <>
          {" "}
          <button type="button" className={BizClass.UnAssignActionButton} onClick={() => props.onUnAssignCategory(props.data)}>
            Un-Assign
          </button>
        </>
      ) : (
        <button type="button" className={BizClass.ActionButton} onClick={() => props.onAssignCategory(props.data)} style={{ cursor: "pointer" }}>
          Assign
        </button>
      )}
    </div>
  );
};

function CategoryAssignModal({ showfunc, selectedUserData }) {
  const {
    categoryList,
    isLoadingCategoryList,
    getCategoryListData,
    searchTextCategory,
    searchTextSubCategory,
    onCategoryrGridReady,
    onAssinGridReady,
    onGetAssignCategory,
    onSearchCategory,
    onSearchSubCategory,
    setSelectedUser,
    assignCategorylist,
    onAssignCategory,
    onUnAssignCategory,
    btnLoaderActive,
    OnAssignAll,
    assignallbtn,
    setAssignallbtn,
    setAssignallHidebtn,
    assignallHidebtn,
  } = CategoryAssignModalLogic();

  useEffect(() => {
    debugger;
    setSelectedUser(selectedUserData);
    getCategoryListData(selectedUserData);
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
    <Modal varient="full" title="Category" show={showfunc} height="100vh" width="100vw">
      <Modal.Body>
        <div className={BizClass.PageStart}>
          <Splitter varient="column" template="1fr 9px 1fr">
            <div className={BizClass.Card}>
              <PageBar>
                <PageBar.Search onClick={() => console.log("CLicked")} value={searchTextCategory} onChange={(e) => onSearchCategory(e.target.value)} />
              </PageBar>
              <DataGrid
                rowData={categoryList}
                loader={isLoadingCategoryList ? <Loader /> : false}
                getRowStyle={getRowStyle}
                components={{
                  actionTemplate: cellTemplate,
                }}
                onGridReady={onCategoryrGridReady}
              >
                <DataGrid.Column
                  headerName="Action"
                  lockPosition="1"
                  pinned="left"
                  width={125}
                  cellRenderer="actionTemplate"
                  cellRendererParams={{ onGetAssignCategory }}
                />

                <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} />
                <DataGrid.Column headerName="Category" field="SupportTicketTypeName" width={240} />
              </DataGrid>
            </div>
            <div className={BizClass.Card}>
              <PageBar>
                <PageBar.Search onClick={() => console.log("CLicked")} value={searchTextSubCategory} onChange={(e) => onSearchSubCategory(e.target.value)} />
                {assignallHidebtn ? (
                  <PageBar.Button onClick={() => OnAssignAll(assignallbtn === true ? "A" : "D")}>
                    {assignallbtn === true ? "Assign ALL" : "Un Assign ALL"}
                  </PageBar.Button>
                ) : null}
              </PageBar>
              <DataGrid
                rowData={assignCategorylist}
                loader={btnLoaderActive ? <Loader /> : false}
                getRowStyle={getRowStyle1}
                onGridReady={onAssinGridReady}
                defaultColDef={{
                  flex: 1,
                  resizable: true,
                }}
                frameworkComponents={{
                  cellCategoryTemplate,
                }}
                autoGroupColumnDef={{
                  headerName: "Sub Catgory",
                  minWidth: 220,
                  cellRendererParams: {
                    innerRenderer: (params) => {
                      return params.data.TicketCategoryName;
                    },
                  },
                }}
              >
                <DataGrid.Column headerName="Sub Category" field="TicketCategoryName" width={150} />
                <DataGrid.Column
                  headerName="Action"
                  lockPosition="1"
                  pinned="left"
                  width={125}
                  cellRenderer="cellCategoryTemplate"
                  cellRendererParams={{
                    onAssignCategory,
                    onUnAssignCategory,
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

export default CategoryAssignModal;

CategoryAssignModal.propTypes = {
  categoryList: PropTypes.array,
  showfunc: PropTypes.func.isRequired,
  selectedUserData: PropTypes.object,
  onAssignCategory: PropTypes.func.isRequired,
  onUnAssignCategory: PropTypes.func.isRequired,
};
