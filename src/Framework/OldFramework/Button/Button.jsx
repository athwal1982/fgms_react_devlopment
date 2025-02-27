import React from "react";
import "./Button.scss";

function Button(props) {
  const { varient = "", add = "", children, ...rest } = props;
  return (
    <button className={`DynBiz_Btn DynBiz_${varient}_Btn DynBiz_${add}_Btn`} {...rest}>
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
  );
}

export default Button;
