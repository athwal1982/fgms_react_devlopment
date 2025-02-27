import React from "react";
import "./Loader.scss";
import { BiLoaderAlt } from "react-icons/bi";
import Biz_Logo from "Framework/Assets/images/Logo/BizNextLogo.svg";

const Loader = () => {
  return (
    <div className="Biz_PlWait_loader_back">
      <div className="Biz_PlWait_loader">
        <img src={Biz_Logo} />
      </div>
    </div>
  );
};

export default Loader;
