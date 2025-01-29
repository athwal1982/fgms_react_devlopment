import React from "react";
import { Button } from "Framework/Components/Widgets";
import { FaFileDownload } from "react-icons/fa";
import CallLogUploadLogic from "../Logic/CallLogUploadLogic";
import "./CallLogUpload.scss";

function CallLogUpload() {
  const { message, messageClass, handleSubmit, handleResetFile, downloadExcelFile, updateStateCallLogUpload, formValidationError, fileRef, btnLoaderActive } =
    CallLogUploadLogic();

  return (
    <div className="container">
      <div className="card mt-5">
        <div className="card-header">Upload Your Billing Excel</div>
        <div className="card-body">
          <form id="uploadForm">
            <div className="form-group">
              <div className="file-input-group">
                <label htmlFor="fileInput">File:</label>
                <input
                  type="file"
                  className="form-control-file"
                  id="fileInput"
                  accept=".xlsx,.csv"
                  name="txtDocumentUpload"
                  onChange={(e) => updateStateCallLogUpload(e.target.name, e.target.files[0])}
                  ref={fileRef}
                />
                <button type="button" className="btn btn-secondary" onClick={handleResetFile}>
                  Reset File
                </button>
                <FaFileDownload className="download-icon" onClick={downloadExcelFile} title="Download the Excel File" />
              </div>
              {formValidationError.txtDocumentUpload && <div className="error-message">{formValidationError.txtDocumentUpload}</div>}
            </div>
            <div className="form-footer">
              <Button type="button" trigger={btnLoaderActive} varient="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </form>
          {message && <div className={`message ${messageClass}`}>{message}</div>}
        </div>
      </div>
    </div>
  );
}

export default CallLogUpload;
