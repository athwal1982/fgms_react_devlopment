import React from "react";
import BizClass from "./AdvanceFilter.module.scss";
import { IoClose } from "react-icons/io5";

function AdvanceFilter(props) {
  const { Title, ClearFnt, SearchFnt, toggleFilter, children, ...rest } = props;

  return (
    <React.Fragment>
      <div className={BizClass.Div}>
        <div className={BizClass.Div_HeaderBox}>
          <p>{Title}</p>
          <div className={BizClass.Div_SubBox}>
            <div className={BizClass.Div_CloseBox}>
              <IoClose className={BizClass.Div_CloseIcon} onClick={toggleFilter} />
            </div>
          </div>
        </div>
        <div className={BizClass.Div_ContentBox} {...rest}>
          {children}
        </div>
        <div className={BizClass.Div_FooterBox}>
          <button onClick={ClearFnt}>Clear All</button>
          <button onClick={SearchFnt}>Search</button>
        </div>
      </div>
    </React.Fragment>
  );
}

export default AdvanceFilter;

export const AdvanceFilterDiv = (props) => {
  const { className, children, ...rest } = props;

  return (
    <div className={BizClass.Master__Dash} {...rest}>
      {children}
    </div>
  );
};

export const AdvanceFilterInputGroup = (props) => {
  const { InputTxt, children, ...rest } = props;

  return (
    <div className={BizClass.Div_InputGroupBox}>
      <label>{InputTxt}</label>
      <div className={BizClass.Div_InputGroup} {...rest}>
        {children}
      </div>
    </div>
  );
};
