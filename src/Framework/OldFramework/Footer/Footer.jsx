import React from "react";
import BizClass from "./Footer.module.scss";

function Footer(props) {
  const { Title, children, ...rest } = props;

  return (
    <React.Fragment>
      <footer className={BizClass.Div} {...rest}>
        {children}
      </footer>
    </React.Fragment>
  );
}

export default Footer;

export const FooterBox = (props) => {
  const { aligned, children, ...rest } = props;

  return (
    <div className={aligned === "right" ? `${BizClass.BoxRight} ${BizClass.Box}` : BizClass.Box} {...rest}>
      {children}
    </div>
  );
};

export const FooterButton = (props) => {
  const { children, ...rest } = props;

  return (
    <button className={BizClass.Btn} {...rest}>
      {children}
    </button>
  );
};
