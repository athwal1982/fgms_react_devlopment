import React from "react";
import { checkAuthExist, getSessionStorage } from "Components/Common/Login/Auth/auth";
import { Navigate } from "react-router-dom";

function PageAuthenticator() {
  debugger;
  // A if (checkAuthExist()) {
  // A  return <Navigate to="/welcome" />;
  // A }

  // A return <Navigate to="/login" />;
  const pathUrl = window.location.href;
  const servicesuccessData = getSessionStorage("servicesuccess");
  if (checkAuthExist()) {
    if (pathUrl.indexOf("uniqueID") !== -1 && pathUrl.indexOf("userID") !== -1 && pathUrl.indexOf("mobileNumber") !== -1) {
      if (servicesuccessData === "TC" || servicesuccessData === "CD") {
        return <Navigate to="/ServiceSuccess" />;
      }
      return <Navigate to="/login" />;
    }
    return <Navigate to="/welcome" />;
  }
  if( pathUrl.indexOf("ImportantInstructions") !== -1 ) {
    return <Navigate to="/ImportantInstructions" />;
  }

  return <Navigate to="/login" />;
}

export default PageAuthenticator;
