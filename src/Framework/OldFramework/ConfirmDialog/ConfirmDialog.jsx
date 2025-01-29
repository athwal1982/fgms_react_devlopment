import React from "react";
import "./ConfirmDialog.scss";

const ConfirmDialog = (props) => {
  const onCancel = () => {
    props.setConfirmAlert({
      open: false,
      title: "",
      msg: "",
      onConfirm: null,
      button: { confirmText: "", abortText: "", Color: "" },
    });
  };

  const onConfirm = () => {
    if (props.confirmAlert.onConfirm) props.confirmAlert.onConfirm();
    props.setConfirmAlert({
      open: false,
      title: "",
      msg: "",
      onConfirm: null,
      button: { confirmText: "", abortText: "", Color: "" },
    });
  };

  let className = "";
  switch (props.confirmAlert.button.Color) {
    case "Danger":
      className = "Biz_ConfirmDialog_Danger";
      break;
    default:
      className = "Biz_ConfirmDialog_Success";
      break;
  }

  return (
    <div className="Biz_ConfirmDialog_Overlay">
      <div className="Biz_ConfirmDialog">
        <h2 className="Biz_ConfirmDialog_Heading">{props.confirmAlert.title}</h2>
        <p className="Biz_ConfirmDialog_BodyTxt">{props.confirmAlert.msg}</p>
        <div className="Biz_ConfirmDialog_BtnBox">
          <button onClick={() => onCancel()} className="Biz_ConfirmDialog_CloseBtn">
            {props.confirmAlert.button.abortText}
          </button>
          <button onClick={() => onConfirm()} className={"Biz_ConfirmDialog_OpenBtn " + className}>
            {props.confirmAlert.button.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
