import React from "react";
import Modal from "Framework/Components/Layout/Modal/Modal";
import { Loader } from "Framework/Components/Widgets";
import { PropTypes } from "prop-types";
import BizClass from "./ChatList.module.scss";

function FileViewer({ toggleFileViewerModal, imageURL, fileViewerIsLoading }) {
  return (
    <Modal varient="half" title="File Viewer" index={2} show={toggleFileViewerModal} width="50vw" style={{ zindex: "999999999999999999999" }}>
      <Modal.Body>
        <div className={BizClass.FileViewer}>
          {fileViewerIsLoading && <Loader />}
          {imageURL && imageURL.split(".").pop().split("?")[0] === "pdf" ? (
            <iframe className="doc" src={imageURL} style={{ display: "flex", width: "48vw", height: "87vh" }} title="File Viewer" />
          ) : (
            <img src={imageURL} alt="File Viewer" />
          )}
        </div>
      </Modal.Body>
      <Modal.Footer />
    </Modal>
  );
}

export default FileViewer;

FileViewer.propTypes = {
  fileViewerIsLoading: PropTypes.bool,
  toggleFileViewerModal: PropTypes.bool,
  imageURL: PropTypes.string,
};
