import React, { useRef, useEffect } from "react";
import { EnterKeyCode } from "Configration/Utilities/Constants/Constants";
import "./FormComponents.scss";
import Select from "react-select";
import { ReactSelectStyle, ReactMultiSelectStyle } from "../../Assets/Styles/Widgets/SelectStyle/SelectStyle";
import { BiLinkExternal } from "react-icons/bi";

function FormComponent(props) {
  const { column = "1", minWidth = "", children, ...rest } = props;

  let elements = React.Children.toArray(props.children);
  if (elements.length > 0) {
    elements = elements.map((element, i) => {
      if (element.type.name === "InputGroup") {
        element = React.cloneElement(element, { minWidth: `${minWidth}` });
      }
      return element;
    });
  }

  return (
    <div className={`DynBiz_Popup_Form_Content DynBiz_Popup_Form_ConCol_${column}`} {...rest}>
      {elements}
    </div>
  );
}

export default FormComponent;

export const PopupSearch = (props) => {
  const { ControlTxt = "", children, onClick, focus, Text = "Search", placeholder = "Search", ...rest } = props;

  const firstSearchInputBox = useRef();

  useEffect(() => {
    if (firstSearchInputBox.current) {
      firstSearchInputBox.current.focus();
    }
  }, [focus]);

  const handleKeyDown = (e) => {
    if (e.keyCode === EnterKeyCode) {
      {
        onClick ? props.onClick() : console.log();
      }
    }
  };

  return (
    <React.Fragment>
      <div className="DynBiz_PageTitle_SearchBox">
        <input type="text" placeholder={placeholder} className="DynBiz_PageTitle_SearchInputBox" ref={firstSearchInputBox} {...rest} onKeyDown={(e) => handleKeyDown(e)} />
        <button className="DynBiz_PageTitle_SearchBoxBtn" onClick={onClick}>
          {Text}
        </button>
      </div>
    </React.Fragment>
  );
};

export const MainGroup = (props) => {
  const { className, children, ...rest } = props;

  return (
    <div className={`DynBiz_Popup_Main_FormGroup ${className}`} {...rest}>
      {children}
    </div>
  );
};

export const BoxFormComponent = (props) => {
  const { column = "1", BoxCol = "", RowCol = "", boxtitle = "", minWidth = "", children, ...rest } = props;

  let elements = React.Children.toArray(props.children);
  if (elements.length > 0) {
    elements = elements.map((element, i) => {
      if (element.type.name === "InputGroup") {
        element = React.cloneElement(element, { minWidth: `${minWidth}` });
      }
      return element;
    });
  }

  return (
    <div
      className="DynBiz_Popup_FormBox_ContentDiv"
      style={{
        gridColumn: "span " + `${BoxCol}`,
        gridRow: "span " + `${RowCol}`,
      }}
      {...rest}
    >
      <h2 className="DynBiz_Popup_FormCheckBheadTxt">{boxtitle}</h2>
      <div className={`DynBiz_Popup_FormBox_Content DynBiz_Popup_FormBox_ConCol_${column}`}>{elements}</div>
    </div>
  );
};

export const InputGroup = (props) => {
  const { ErrorMsg = "", LabelTxt = "", Col = "1", Row = "", ColStart = "4", minWidth = "", LabelReq = "", children, ...rest } = props;

  return (
    <div className={`DynBiz_Popup_InputGroupBox Col__${Col} ColStart__${ColStart} ss_${Row}`}>
      {LabelTxt ? (
        <label className={`DynBiz_Popup_LabelTxt DynBiz_Popup_Req_${LabelReq}`} style={{ minWidth: `${minWidth}` }} {...rest}>
          {LabelTxt}
        </label>
      ) : null}
      <div className={`${ErrorMsg}` ? "DynBiz_Popup_InputGroup DynBiz_Popup_InputGroup_Error" : "DynBiz_Popup_InputGroup"}>
        {children}
        {ErrorMsg ? <span className="DynBiz_Popup_InputGroupError_Msg">{ErrorMsg}</span> : null}
      </div>
    </div>
  );
};

export const MultiInputGroup = (props) => {
  const { children, ControlCol, LabelTxt = "", LabelReq = "", Col = "", ...rest } = props;

  return (
    <div style={{ display: "contents" }}>
      <label className={`DynBiz_Popup_LabelTxt DynBiz_Popup_Req_${LabelReq}`} style={{ gridColumnStart: "1" }}>
        {LabelTxt}
      </label>
      <div className={`DynBiz_Popup_MultiInputGroupBox Col__${Col}`} style={{ gridTemplateColumns: `${ControlCol}` }} {...rest}>
        {children}
      </div>
    </div>
  );
};

export const AddressControl = (props) => {
  const { AddHead = "", AddBody = "", onClick, disabled, ...rest } = props;

  return (
    <div className="DynBiz_Popup_AddressControl">
      <div className="DynBiz_Popup_AddressControl_Header">
        <h4>{AddHead}</h4>
        <button type="button" onClick={onClick} disabled={disabled}>
          <BiLinkExternal {...rest} />
        </button>
      </div>
      <span className="DynBiz_Popup_AddressControl_Txt">{AddBody}</span>
    </div>
  );
};

export const InputControl = React.forwardRef((props, ref) => {
  const { ControlTxt = "", Input_type = "", MaxLength = "", maxLength = "", TxtPrefix, controlwidth = "100%", isClearable = "true", isSearchable = "true", ...rest } = props;

  let InputBox = "";
  switch (Input_type) {
    case "input":
      InputBox = (
        <React.Fragment>
          <input
            placeholder={`${ControlTxt}`}
            className={MaxLength === "" ? "DynBiz_AddPopup_Inputbox" : "DynBiz_AddPopup_Inputbox DynBiz_AddPopup_InputboxMaxLength"}
            maxLength={maxLength}
            style={{ width: `${controlwidth}` }}
            ref={ref}
            {...rest}
          />
        </React.Fragment>
      );
      break;

    case "select":
      InputBox = (
        <React.Fragment>
          <div style={{ width: `${controlwidth}` }}>
            <Select
              {...rest}
              menuPlacement="auto"
              classNamePrefix="BizN__"
              isClearable={isClearable}
              menuPosition={"absolute"}
              menuPortalTarget={document.body}
              isSearchable={isSearchable}
              styles={ReactSelectStyle}
              placeholder={TxtPrefix === false ? `${ControlTxt}` : `Select ${ControlTxt}`}
              ref={ref}
              menuShouldScrollIntoView={false}
              noOptionsMessage={() => "No Result Found"}
            />
          </div>
        </React.Fragment>
      );
      break;

    case "multiselect":
      InputBox = (
        <React.Fragment>
          <div style={{ width: `${controlwidth}` }}>
            <Select
              {...rest}
              isMulti
              menuPlacement="auto"
              classNamePrefix="BizN__"
              isClearable={isClearable}
              menuPosition={"absolute"}
              menuPortalTarget={document.body}
              isSearchable={isSearchable}
              styles={ReactMultiSelectStyle}
              placeholder={TxtPrefix === false ? `${ControlTxt}` : `Select ${ControlTxt}`}
              ref={ref}
              menuShouldScrollIntoView={false}
              noOptionsMessage={() => "No Result Found"}
            />
          </div>
        </React.Fragment>
      );
      break;

    case "checkbox":
      InputBox = (
        <React.Fragment>
          <label className="DynBiz__panel_Switch">
            <input className="DynBiz__panel_Switch-input" type="checkbox" ref={ref} {...rest} />
            <span className="DynBiz__panel_Switch-label" data-on="Yes" data-off="No"></span>
            <span className="DynBiz__panel_Switch-handle"></span>
          </label>
        </React.Fragment>
      );
      break;

    case "textarea":
      InputBox = (
        <React.Fragment>
          <textarea
            className={MaxLength === "" ? "DynBiz_AddPopup_Inputbox" : "DynBiz_AddPopup_Inputbox DynBiz_AddPopup_InputboxMaxLength"}
            ref={ref}
            maxLength={maxLength}
            placeholder={`${ControlTxt}`}
            style={{ width: `${controlwidth}` }}
            {...rest}
          />
        </React.Fragment>
      );
      break;

    default:
      InputBox = "";
      break;
  }

  return (
    <React.Fragment>
      {InputBox}
      {MaxLength === "" ? null : (
        <div className="DynBiz_Popup_MaxLengthBox">
          <span className="DynBiz_Popup_MaxLengthTxt">
            {MaxLength} / {maxLength}
          </span>
        </div>
      )}
    </React.Fragment>
  );
});
