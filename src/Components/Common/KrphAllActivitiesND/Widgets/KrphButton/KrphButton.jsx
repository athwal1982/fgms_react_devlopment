import React from "react";
import PropTypes from "prop-types";
import "./KrphButton.scss";
import classNames from "classnames";

function KrphButton(props) {
  const { varient = "grey", trigger, className, children, ...restProps } = props;
  return (
    <button type="button" className={classNames(`DynBiz_Krph_Btn DynBiz_Krph_${varient}_Btn`, className)} {...restProps}>
      {trigger === "true" || trigger === true ? (
        <div className="DynBiz_Krph_btn__spinner">
          <div className="DynBiz_Krph_btn__bounce1" />
          <div className="DynBiz_Krph_btn__bounce2" />
          <div className="DynBiz_Krph_btn__bounce3" />
        </div>
      ) : (
        children
      )}
    </button>
  );
}

export default KrphButton;

KrphButton.propTypes = {
  varient: PropTypes.string.isRequired,
  trigger: PropTypes.string,
  className: PropTypes.any,
  children: PropTypes.node.isRequired,
};
