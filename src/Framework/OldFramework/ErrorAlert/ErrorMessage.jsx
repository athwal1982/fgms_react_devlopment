import React, { useEffect } from "react";
import { HiEmojiSad } from "react-icons/hi";
import { BsFillEmojiSmileFill, BsExclamationCircleFill } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import "./ErrorMessage.scss";

const ErrorMessage = (props) => {
  debugger;
  const onClose = () => {
    props.setMsgAlert({ open: false, type: "", msg: "" });
  };

  let className = "";
  let MainTxt = "";
  let MainIcon = "";
  switch (props.msgAlert.type) {
    case "error":
      className = "Biz_toast_Error";
      MainTxt = "Something went wrong";
      MainIcon = <HiEmojiSad className="Biz__Icon" />;
      break;
    case "success":
      className = "Biz_toast_Success";
      MainTxt = "Success!";
      MainIcon = <BsFillEmojiSmileFill className="Biz__Icon" />;
      break;
    case "warning":
      className = "Biz_toast_Warning";
      MainTxt = "Check Your Input";
      MainIcon = <BsExclamationCircleFill className="Biz__Icon" />;
      break;
    default:
      className = "Biz_toast_Primary";
      MainTxt = "Check Your Input";
      MainIcon = <BsExclamationCircleFill className="Biz__Icon" />;
      break;
  }
  let timer = "";

  useEffect(() => {
    if (props.msgAlert.open) {
      timer = setTimeout(() => {
        props.setMsgAlert({ open: false, type: "", msg: "" });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [props.msgAlert]);

  const handleMouseEnter = () => {
    clearTimeout(timer);
  };

  const handleMouseLeave = () => {
    timer = setTimeout(() => {
      props.setMsgAlert({ open: false, type: "", msg: "" });
    }, 2000);
    return () => clearTimeout(timer);
  };

  return (
    <div className="Biz_clear___toast" onMouseEnter={() => handleMouseEnter()} onMouseLeave={() => handleMouseLeave()}>
      <div className={"Biz_toast__fd " + className}>
        <div className="Biz_toast__icon">{MainIcon}</div>
        <div className="Biz_toast__text">
          <h2>{MainTxt}</h2>
          <p>{props.msgAlert.msg}</p>
        </div>
        <div className="Biz_toast__close">
          <button type="button" onClick={() => onClose()} className="Biz_toast__closebtn" data-dismiss="alert" aria-label="Close">
            <IoCloseSharp className="Biz__Icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
