import React, { useState, useEffect } from "react";
import "./Popup.scss";
import Button from "../Button/Button";
import { FaTimes } from "react-icons/fa";
import Draggable from "react-draggable";

function Popup(props) {
  const { varient = "halfwidth", PopupTitle, style, children, CustomPopup = "", DualPopup = "", SearchBox, ...rest } = props;
  const [isModalAnimOpen, setModalAnimOpen] = useState(false);
  const toggleModalAnimOpen = () => {
    setModalAnimOpen(true);
    setTimeout(() => {
      setModalAnimOpen(false);
    }, 100);
  };

  const keyDownHander = (e) => {
    if (e.shiftKey && e.keyCode == 27) {
      props.togglepopup();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", keyDownHander, false);
    // console.log(props.children[0].type.name)
  }, []);

  return props.trigger ? (
    <React.Fragment>
      <div onClick={toggleModalAnimOpen} className={`DynBiz_Popup_overlay DynBiz_${varient}popupOverlay`}></div>
      <Draggable handle="#handle" disabled={varient === "top" ? false : true}>
        <div
          className={
            isModalAnimOpen
              ? `DynBiz_${varient}popup ${DualPopup} DynBiz_popup DynBiz_CustomPopup${CustomPopup} DynBiz_PopupAnimOn`
              : `DynBiz_${varient}popup ${DualPopup} DynBiz_popup DynBiz_CustomPopup${CustomPopup}`
          }
          style={style}
        >
          {CustomPopup ? (
            <React.Fragment>{props.children}</React.Fragment>
          ) : (
            <React.Fragment>
              <header id="handle" className={SearchBox === true ? "DynBiz_Popup_Header DynBiz_Popup_Header_SearchBoxOn" : "DynBiz_Popup_Header"}>
                <h2>{PopupTitle}</h2>
                {SearchBox === true ? <React.Fragment>{props.children[0]}</React.Fragment> : null}
                <a className="DynBiz_Popup_HeaderCloseBtn" onClick={() => props.togglepopup()}>
                  <FaTimes className="DynBiz_Popup_Icon" />
                </a>
              </header>
              <form className="DynBiz_Popup_FormTagContent" {...rest}>
                {SearchBox === true ? (
                  <React.Fragment>
                    {props.children.map((x, i) => {
                      {
                        return <React.Fragment>{props.children[i + 1]}</React.Fragment>;
                      }
                    })}
                  </React.Fragment>
                ) : (
                  <React.Fragment>{props.children}</React.Fragment>
                )}
              </form>
            </React.Fragment>
          )}
        </div>
      </Draggable>
    </React.Fragment>
  ) : null;
}

export default Popup;

export const PopupFooter = (props) => {
  const { children, ...rest } = props;
  return (
    <footer className="DynBizPopupFooter" {...rest}>
      <div className="DynBizPopupFooterBtnBox">
        {children}
        <Button type="button" varient="grey" onClick={() => props.togglepopup()}>
          Cancel
        </Button>
      </div>
    </footer>
  );
};
