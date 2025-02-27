import React, { useEffect, useRef } from "react";
import Select from "react-select";
import { ReactSelectStyle } from "../../Assets/Style/Widgets/SelectStyle/SelectStyle";
import { EnterKeyCode } from "Configration/Utilities/Constants";
import "./PageTitle.scss";

function PageTitle(props) {
  const { Title, children, className, controlOnLeft, leftControl, ...rest } = props;

  return (
    <React.Fragment>
      <div className={`DynBiz_PageTitle ${className}`} {...rest}>
        {controlOnLeft === true ? (
          <div className="DynBiz_PageTitle_ControlLeft">
            {leftControl} <span>{Title}</span>
          </div>
        ) : (
          <span>{Title}</span>
        )}
        <div className="DynBiz_PageTitle_Contentbox">{props.children}</div>
      </div>
    </React.Fragment>
  );
}

export default PageTitle;

export const PageSelect = React.forwardRef((props, ref) => {
  const { ControlTxt = "", width, focus, children, ...rest } = props;

  const firstSearchInput = useRef();

  useEffect(() => {
    if (firstSearchInput.current) {
      firstSearchInput.current.focus();
    }
  }, [focus]);

  return (
    <Select
      {...rest}
      ref={focus === true ? firstSearchInput : ref}
      menuPlacement="auto"
      openMenuOnFocus={true}
      isClearable={true}
      menuPosition={"absolute"}
      menuPortalTarget={document.body}
      isSearchable={true}
      className="DynBiz_PageTitle_Select"
      placeholder={`Select ${ControlTxt}`}
      styles={ReactSelectStyle}
      menuShouldScrollIntoView={false}
      noOptionsMessage={() => "No Result Found"}
    />
  );
});

export const PageSearch = (props) => {
  const { ControlTxt = "", children, onClick, focus, Text = "Search", withoutButton, placeholder = "Search", ...rest } = props;

  const firstSearchInput = useRef();

  useEffect(() => {
    if (firstSearchInput.current) {
      firstSearchInput.current.focus();
    }
  }, [focus]);

  const handleKeyDown = (e) => {
    if (e.keyCode === EnterKeyCode) {
      e.preventDefault();
      {
        onClick ? props.onClick() : console.log();
      }
    }
  };

  return (
    <React.Fragment>
      <div className="DynBiz_PageTitle_SearchBox">
        <input
          type="text"
          placeholder={placeholder}
          className="DynBiz_PageTitle_SearchInputBox"
          ref={focus === true ? firstSearchInput : null}
          {...rest}
          onKeyDown={(e) => handleKeyDown(e)}
        />
        {withoutButton === true ? null : (
          <button type="button" className="DynBiz_PageTitle_SearchBoxBtn" onClick={onClick}>
            {Text}
          </button>
        )}
      </div>
    </React.Fragment>
  );
};

export const PageButton = (props) => {
  const { children, ...rest } = props;
  return (
    <React.Fragment>
      {/* <button className="DynBiz_PageTitle_Btn" {...rest}>{children}</button> */}
      <button type="button" className="DynBiz_PageTitle_Btn" {...rest}>
        {props.trigger ? (
          <div className="DynBiz_btn__spinner">
            <div className="DynBiz_btn__bounce1"></div>
            <div className="DynBiz_btn__bounce2"></div>
            <div className="DynBiz_btn__bounce3"></div>
          </div>
        ) : (
          <React.Fragment>{children}</React.Fragment>
        )}
      </button>
    </React.Fragment>
  );
};

export const PageSearchButton = (props) => {
  const { children, ...rest } = props;
  return (
    <React.Fragment>
      <button type="button" className="DynBiz_PageTitle_SearchBtn" {...rest}>
        {props.trigger ? (
          <div className="DynBiz_btn__spinner">
            <div className="DynBiz_btn__bounce1"></div>
            <div className="DynBiz_btn__bounce2"></div>
            <div className="DynBiz_btn__bounce3"></div>
          </div>
        ) : (
          <React.Fragment>{children}</React.Fragment>
        )}
      </button>
    </React.Fragment>
  );
};

export const PageInput = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <React.Fragment>
      <input {...rest} className={`DynBiz_PageTitle_Input ${className}`} />
    </React.Fragment>
  );
});
