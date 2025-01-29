/* eslint-disable */
import React from "react";
import BizClass from "../KrphAllActivities/KrphAllActivities.module.scss";
export const KrphToggleSwitch = React.memo((props) => {
  const { leftText, rightText, callback, noUpperCase, checked } = props;
  return (
    <React.Fragment>
      <input
        type="checkbox"
        id="toggle"
        className={BizClass.toggleCheckboxKrph}
        onClick={() => {
          callback();
        }}
        checked={checked}
      />
      <label for="toggle" className={BizClass.toggleContainerKrph}>
        <div>{leftText && (!noUpperCase ? leftText : leftText.toUpperCase())}</div>
        <div>{rightText && (!noUpperCase ? rightText : rightText.toUpperCase())}</div>
      </label>
    </React.Fragment>
  );
});
